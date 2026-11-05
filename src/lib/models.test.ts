import assert from 'node:assert/strict';
import test from 'node:test';
import { MODELS, modelName, requestableAspectRatio, SIZES } from './models.ts';

test('offers unique concrete sizes supported by the model catalogue', () => {
	const supported = new Set(
		MODELS.flatMap((model) => model.aspectRatios).filter((ratio) => ratio !== 'auto')
	);
	const selectable = SIZES.map((size) => size.id);

	assert.equal(new Set(selectable).size, selectable.length);
	for (const size of selectable) assert.ok(supported.has(size));
});

for (const variant of ['Sunburst', 'Flare']) {
	const id = `openai/gpt-image-2.6-${variant.toLowerCase()}`;
	const aspectRatios = ['1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9', 'auto'];

	test(`offers GPT Image 2.6 ${variant} with the OpenRouter image descriptor`, () => {
		assert.deepEqual(
			MODELS.filter((model) => model.id === id),
			[
				{
					id,
					name: `GPT Image 2.6 ${variant}`,
					note: 'OpenAI',
					aspectRatios,
					pricing: '$$$'
				}
			]
		);
		assert.equal(modelName(id), `GPT Image 2.6 ${variant}`);
	});

	test(`resolves exact and closest aspect ratios for GPT Image 2.6 ${variant}`, () => {
		for (const ratio of aspectRatios) {
			assert.equal(requestableAspectRatio(id, ratio), ratio);
		}
		assert.equal(requestableAspectRatio(id, '4:5'), '3:4');
		assert.equal(requestableAspectRatio(id, '5:4'), '4:3');
		assert.equal(requestableAspectRatio(id, '8:1'), '21:9');
		assert.equal(requestableAspectRatio(id, '1:8'), '9:16');
		for (const { id: size } of SIZES) {
			assert.ok(aspectRatios.includes(requestableAspectRatio(id, size)!));
		}
	});
}

test('omits aspect ratios for parameterless and unknown models', () => {
	assert.equal(requestableAspectRatio('meta/muse-image', '16:9'), null);
	assert.equal(requestableAspectRatio('unknown/model', '16:9'), null);
});
