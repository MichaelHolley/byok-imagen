type StoredGeneration = {
	id: string;
	image: Blob;
	prompt: string;
	modelId: string;
	modelName: string;
	size: string;
	cost: number | null;
	timestamp: number;
};

export type GenerationResult = StoredGeneration & { imageUrl: string };

type LegacyGenerationResult = Omit<StoredGeneration, 'image'> & { imageUrl: string };

const DB_NAME = 'byok-imagen';
const STORE_NAME = 'history';
const DB_VERSION = 1;
const LEGACY_KEY = 'byok-imagen-history';

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
				store.createIndex('timestamp', 'timestamp');
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function loadStored(): Promise<(StoredGeneration | LegacyGenerationResult)[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const req = tx.objectStore(STORE_NAME).index('timestamp').getAll();
		req.onsuccess = () =>
			resolve((req.result as (StoredGeneration | LegacyGenerationResult)[]).reverse());
		req.onerror = () => reject(req.error);
	});
}

async function putItem(item: StoredGeneration): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put(item);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function toStored(
	item: StoredGeneration | LegacyGenerationResult
): Promise<StoredGeneration> {
	if ('image' in item) return item;
	const { imageUrl, ...metadata } = item;
	const image = await fetch(imageUrl).then((response) => response.blob());
	return { ...metadata, image };
}

function toResult(item: StoredGeneration): GenerationResult {
	return { ...item, imageUrl: URL.createObjectURL(item.image) };
}

async function loadAll(): Promise<GenerationResult[]> {
	return Promise.all(
		(await loadStored()).map(async (item) => {
			const stored = await toStored(item);
			if (!('image' in item)) await putItem(stored);
			return toResult(stored);
		})
	);
}

async function deleteItem(id: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function clearAll(): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).clear();
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}

async function migrateLegacy(): Promise<void> {
	try {
		const raw = localStorage.getItem(LEGACY_KEY);
		if (!raw) return;
		const legacy: LegacyGenerationResult[] = JSON.parse(raw);
		await Promise.all(legacy.map(async (item) => putItem(await toStored(item))));
		localStorage.removeItem(LEGACY_KEY);
	} catch {
		// ignore migration errors
	}
}

let items = $state<GenerationResult[]>([]);

export const history = {
	get items() {
		return items;
	},
	async init() {
		await migrateLegacy();
		items = await loadAll();
	},
	async add(result: Omit<StoredGeneration, 'id' | 'timestamp'>) {
		const stored: StoredGeneration = {
			...result,
			id: crypto.randomUUID(),
			timestamp: Date.now()
		};
		const entry = toResult(stored);
		items = [entry, ...items];
		await putItem(stored);
	},
	async remove(id: string) {
		const item = items.find((entry) => entry.id === id);
		if (item) URL.revokeObjectURL(item.imageUrl);
		items = items.filter((i) => i.id !== id);
		await deleteItem(id);
	},
	async clear() {
		for (const item of items) URL.revokeObjectURL(item.imageUrl);
		items = [];
		await clearAll();
	}
};
