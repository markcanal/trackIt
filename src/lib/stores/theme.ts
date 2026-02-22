export function initTheme() {
	if (typeof window === 'undefined') return;
	const stored = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const isDark = stored === 'dark' || (!stored && prefersDark);
	document.documentElement.classList.toggle('dark', isDark);
}

export function toggleTheme() {
	const isDark = document.documentElement.classList.toggle('dark');
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
	return isDark;
}

export function isDarkMode() {
	return document.documentElement.classList.contains('dark');
}
