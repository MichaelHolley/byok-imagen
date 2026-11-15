import assert from 'node:assert/strict';
import test, { after, before, type TestContext } from 'node:test';
import { MODELS, requestableAspectRatio } from './models.ts';
import { generateImage } from './openrouter.ts';

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

before(() => {
	Object.defineProperty(globalThis, 'window', {
		configurable: true,
		value: { location: { origin: 'https://imagen.example' } }
	});
});

after(() => {
	if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
	else Reflect.deleteProperty(globalThis, 'window');
});

function mockRequests(t: TestContext) {
	const requests: Record<string, unknown>[] = [];
	t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
		if (input === 'https://openrouter.ai/api/v1/images') {
			assert.equal(init?.method, 'POST');
			assert.equal(typeof init?.body, 'string');
			requests.push(JSON.parse(init!.body as string));
			return Response.json({ data: [{ b64_json: 'aW1hZ2U=', media_type: 'image/png' }] });
		}

		assert.equal(input, 'data:image/png;base64,aW1hZ2U=');
		return new Response('image', { headers: { 'Content-Type': 'image/png' } });
	});
	return requests;
}

test('Auto omits aspect_ratio for every model with and without reference images', async (t) => {
	const requests = mockRequests(t);
	const reference = 'data:image/png;base64,cmVmZXJlbmNl';

	for (const { id: model } of MODELS) {
		for (const referenceImages of [[], [reference]]) {
			const result = await generateImage({
				apiKey: 'test-key',
				model,
				prompt: 'Edit this image',
				aspectRatio: requestableAspectRatio(model, 'auto'),
				referenceImages
			});
			URL.revokeObjectURL(result.imageUrl);

			const body = requests.at(-1)!;
			assert.equal(body.model, model);
			assert.equal(body.prompt, 'Edit this image');
			assert.equal(Object.hasOwn(body, 'aspect_ratio'), false, model);
			if (referenceImages.length > 0) {
				assert.deepEqual(body.input_references, [
					{ type: 'image_url', image_url: { url: reference } }
				]);
			} else {
				assert.equal(Object.hasOwn(body, 'input_references'), false);
			}
		}
	}
	assert.equal(requests.length, MODELS.length * 2);
});

test('fixed sizes still send the exact or closest supported ratio, unless unsupported', async (t) => {
	const requests = mockRequests(t);
	for (const { model, size, expected } of [
		{ model: 'openai/gpt-image-2.6-flare', size: '16:9', expected: '16:9' },
		{ model: 'openai/gpt-image-2.6-flare', size: '4:5', expected: '3:4' },
		{ model: 'meta/muse-image', size: '16:9', expected: null }
	]) {
		const result = await generateImage({
			apiKey: 'test-key',
			model,
			prompt: 'A landscape',
			aspectRatio: requestableAspectRatio(model, size)
		});
		URL.revokeObjectURL(result.imageUrl);

		const body = requests.at(-1)!;
		if (expected === null) assert.equal(Object.hasOwn(body, 'aspect_ratio'), false);
		else assert.equal(body.aspect_ratio, expected);
	}
});
