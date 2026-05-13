export type GenerationResult = {
	id: string;
	imageUrl: string;
	prompt: string;
	modelId: string;
	modelName: string;
	size: string;
	cost: number | null;
	timestamp: number;
};

const STORAGE_KEY = 'byok-imagen-history';

function load(): GenerationResult[] {
	if (typeof localStorage === 'undefined') return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
	} catch {
		return [];
	}
}

function persist(items: GenerationResult[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = $state<GenerationResult[]>([]);

export const history = {
	get items() {
		return items;
	},
	init() {
		items = load();
	},
	add(result: Omit<GenerationResult, 'id' | 'timestamp'>) {
		const entry: GenerationResult = { ...result, id: crypto.randomUUID(), timestamp: Date.now() };
		items = [entry, ...items];
		persist(items);
	},
	remove(id: string) {
		items = items.filter((i) => i.id !== id);
		persist(items);
	},
	clear() {
		items = [];
		localStorage.removeItem(STORAGE_KEY);
	}
};
