import { history } from './history.svelte.js';
import { modelName, requestableAspectRatio } from './models.js';
import { generateImage } from './openrouter.js';

export type JobStatus = 'loading' | 'success' | 'error';

export type Job = {
	id: string;
	modelId: string;
	modelName: string;
	prompt: string;
	size: string;
	aspectRatio: string | null;
	status: JobStatus;
	imageUrl: string | null;
	cost: number | null;
	error: string | null;
};

export type RunParams = {
	apiKey: string;
	models: string[];
	prompt: string;
	size: string;
	referenceImages: string[];
};

let jobs = $state<Job[]>([]);
let controller: AbortController | null = null;

function createJob(modelId: string, params: RunParams): Job {
	const aspectRatio = requestableAspectRatio(modelId, params.size);
	return {
		id: crypto.randomUUID(),
		modelId,
		modelName: modelName(modelId),
		prompt: params.prompt,
		size: params.size,
		aspectRatio,
		status: 'loading',
		imageUrl: null,
		cost: null,
		error: null
	};
}

/**
 * Drives one model to completion and settles its own job in place. Each job owns a
 * distinct object in the reactive array, so a job resolving only re-renders its own
 * card — slow models never hold up ones that already returned.
 */
async function runJob(job: Job, params: RunParams, signal: AbortSignal) {
	try {
		const { imageUrl, cost } = await generateImage({
			apiKey: params.apiKey,
			model: job.modelId,
			prompt: params.prompt,
			aspectRatio: job.aspectRatio,
			referenceImages: params.referenceImages,
			signal
		});
		job.imageUrl = imageUrl;
		job.cost = cost;
		job.status = 'success';
		await history.add({
			imageUrl,
			prompt: job.prompt,
			modelId: job.modelId,
			modelName: job.modelName,
			size: job.aspectRatio ?? job.size,
			cost
		});
	} catch (e) {
		if (signal.aborted) return; // cancel() already settled the job
		job.status = 'error';
		job.error = e instanceof Error ? e.message : 'Network error';
	}
}

export const generations = {
	get jobs() {
		return jobs;
	},
	get running() {
		return jobs.some((j) => j.status === 'loading');
	},
	get totalCost() {
		const costs = jobs.filter((j) => j.cost !== null).map((j) => j.cost as number);
		return costs.length > 0 ? costs.reduce((a, b) => a + b, 0) : null;
	},
	/** Fans every selected model out in parallel; resolves once all have settled. */
	async run(params: RunParams) {
		generations.cancel();
		controller = new AbortController();
		const { signal } = controller;

		jobs = params.models.map((modelId) => createJob(modelId, params));

		await Promise.all(jobs.map((job) => runJob(job, params, signal)));
	},
	cancel() {
		controller?.abort();
		controller = null;
		for (const job of jobs) {
			if (job.status === 'loading') {
				job.status = 'error';
				job.error = 'cancelled';
			}
		}
	},
	clear() {
		generations.cancel();
		jobs = [];
	}
};
