/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'ks-dark': '#0d0d12',
                'ks-neon-pink': '#ff2d75',
                'ks-neon-cyan': '#00f3ff',
                'ks-neon-fuchsia': '#f472b6',
                'ks-neon-yellow': '#fff300',
            },
        },
    },
    plugins: [],
}
