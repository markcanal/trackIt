import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const darkMode = writable(false);

if (browser) {
	const stored = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isDark = stored ? stored === 'dark' : prefersDark;
	darkMode.set(isDark);
	document.documentElement.classList.toggle('dark', isDark);
}

export function toggleTheme() {
	if (!browser) return;
	darkMode.update((v) => {
		const next = !v;
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem('theme', next ? 'dark' : 'light');
		return next;
	});
}

export function isDarkMode(): boolean {
	if (!browser) return false;
	return document.documentElement.classList.contains('dark');
}

export { darkMode };
