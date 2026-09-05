// tailwind.config.js
module.exports = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",      // <-- App Router
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",    // <-- Pages Router (if used)
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",      // <-- If you use /src folder
    ],

    theme: { extend: {} },
    plugins: [],
}