/**
 * Persists the last used credentials so the auth form can be pre-filled.
 * Stored in localStorage (per CEF origin, survives game restarts).
 *
 * NOTE: the password is kept in plain text - this matches the requested
 * "remember me" behaviour, but treat the storage as sensitive.
 */

const STORAGE_KEY = 'streetrp.auth.credentials';

export type Credentials = {
	email: string;
	password: string;
};

export function loadCredentials(): Credentials | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);

		if (!raw) return null;

		const data = JSON.parse(raw) as Partial<Credentials>;

		if (!data || typeof data.email !== 'string') return null;

		return {
			email: data.email,
			password: typeof data.password === 'string' ? data.password : ''
		};
	} catch {
		return null;
	}
}

export function saveCredentials(email: string, password: string) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
	} catch {
		// storage unavailable - ignore
	}
}

export function clearCredentials() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// storage unavailable - ignore
	}
}
