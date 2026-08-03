export function downloadImage(imageUrl: string, filename: string) {
	const a = document.createElement('a');
	a.href = imageUrl;
	a.download = filename;
	a.click();
}
