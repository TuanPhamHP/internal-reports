/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'media',
	content: ['./components/**/*.{vue,js,ts}', './pages/**/*.{vue,js,ts}', './layouts/**/*.{vue,js,ts}', './app.vue'],
	safelist: [
		'bg-green-100', 'text-green-700', 'bg-green-900/40', 'text-green-300', 'bg-green-500', 'text-green-600', 'text-green-400',
		'bg-yellow-100', 'text-yellow-700', 'bg-yellow-900/40', 'text-yellow-300', 'bg-yellow-400', 'text-yellow-600', 'text-yellow-400',
		'bg-red-100', 'text-red-700', 'bg-red-900/40', 'text-red-300', 'bg-red-400', 'text-red-500', 'text-red-400',
		'bg-blue-100', 'text-blue-700', 'bg-blue-900/40', 'text-blue-300',
		'bg-indigo-100', 'text-indigo-700', 'bg-indigo-900/40', 'text-indigo-300',
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
