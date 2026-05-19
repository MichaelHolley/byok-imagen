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

async function loadAll(): Promise<GenerationResult[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readonly');
		const req = tx.objectStore(STORE_NAME).index('timestamp').getAll();
		req.onsuccess = () => resolve((req.result as GenerationResult[]).reverse());
		req.onerror = () => reject(req.error);
	});
}

async function putItem(item: GenerationResult): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put(item);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
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
		const legacy: GenerationResult[] = JSON.parse(raw);
		await Promise.all(legacy.map(putItem));
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
	async add(result: Omit<GenerationResult, 'id' | 'timestamp'>) {
		const entry: GenerationResult = { ...result, id: crypto.randomUUID(), timestamp: Date.now() };
		items = [entry, ...items];
		await putItem(entry);
	},
	async remove(id: string) {
		items = items.filter((i) => i.id !== id);
		await deleteItem(id);
	},
	async clear() {
		items = [];
		await clearAll();
	}
};
