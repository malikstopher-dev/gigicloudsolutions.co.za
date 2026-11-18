import { readFileSync } from 'node:fs';
import { listMessages } from './locale-source.mjs';

const catalog = JSON.parse(readFileSync('src/locale-copy.json', 'utf8'));
const messages = new Set(listMessages());
const languages = ['fr', 'ln', 'pt', 'sw'];
const errors = [];
for (const message of messages) {
  const entries = catalog[message];
  if (!entries || Object.keys(entries).sort().join() !== languages.join()) {
    errors.push(`Incorrect locale keys: ${message}`);
    continue;
  }
  for (const locale of languages) if (typeof entries[locale] !== 'string' || !entries[locale].trim()) {
    errors.push(`Empty ${locale} message: ${message}`);
  }
}
for (const message of Object.keys(catalog)) if (!messages.has(message)) errors.push(`Obsolete key: ${message}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`${messages.size} source messages, ${messages.size * languages.length} translations, 0 missing entries.`);
