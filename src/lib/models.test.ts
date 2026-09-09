import assert from 'node:assert/strict';
import test from 'node:test';
import { MODELS, requestableAspectRatio, SIZES } from './models.ts';

test('offers every concrete model aspect ratio once', () => {
	const supported = new Set(
		MODELS.flatMap((model) => model.aspectRatios).filter((ratio) => ratio !== 'auto')
	);
	const selectable = SIZES.map((size) => size.id);

	assert.deepEqual(new Set(selectable), supported);
	assert.equal(selectable.length, supported.size);
});

test('resolves exact, closest, and unsupported aspect ratios', () => {
	assert.equal(requestableAspectRatio('openai/gpt-5-image-mini', '2:3'), '2:3');
	assert.equal(requestableAspectRatio('openai/gpt-5-image-mini', '4:5'), '2:3');
	assert.equal(requestableAspectRatio('openai/gpt-5-image-mini', '4:3'), '3:2');
	assert.equal(requestableAspectRatio('meta/muse-image', '16:9'), null);
});
