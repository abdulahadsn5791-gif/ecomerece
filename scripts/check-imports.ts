import { readFileSync } from 'fs';
import { glob } from 'glob';

const root = process.cwd();

// Find all TypeScript files in apps/ and packages/
const files = glob.sync('{apps,packages}/**/*.ts', {
    ignore: ['**/node_modules/**', '**/dist/**'],
});

let hasError = false;

for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    // Match imports that go into another workspace (packages/ or apps/) using relative paths
    const matches = content.match(/from\s+['"]\.\.\/\.\.\/\.\.\/(packages|apps)\//g);
    if (matches) {
        console.error(`❌ ${file} imports from '../../${matches[0].split('/')[2]}/' – use '@ecomerece/*' instead.`);
        hasError = true;
    }
}

if (hasError) {
    process.exit(1);
} else {
    console.log('✅ No cross‑workspace relative imports found.');
}