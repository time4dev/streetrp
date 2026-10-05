// Vite replacement for CRA's dynamic `require()` of image assets.
// Builds a name -> url map from every file inside `src/assets/images` at startup.
const modules = import.meta.glob('../assets/images/**/*', {
	eager: true,
	query: '?url',
	import: 'default'
}) as Record<string, string>;

const map = new Map<string, string>();

for (const [path, url] of Object.entries(modules)) {
	const key = path.replace('../assets/images/', '');

	map.set(key, url);

	const file = key.split('/').pop();

	if (file && !map.has(file)) map.set(file, url);
}

class Images {
	getImage(name?: string, folder?: string) {
		if (!name) return '';

		const url = folder ? map.get(`${folder}/${name}`) : map.get(name);

		return url ?? '';
	}
}

export default new Images();
