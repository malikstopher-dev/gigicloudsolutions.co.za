import { readFileSync } from 'node:fs';
import { listMessages } from './locale-source.mjs';
import localeConfig from '../src/locales.json' with { type: 'json' };

const catalog = JSON.parse(readFileSync('src/locale-copy.json', 'utf8'));
const messages = new Set(listMessages());
const languages = Object.keys(localeConfig).filter(code => code !== 'en').sort();
const errors = [];
for (const message of messages) {
  const entries = catalog[message];
  if (!entries || Object.keys(entries).sort().join() !== languages.join()) {
    errors.push(`Incorrect locale keys: ${message}`);
    continue;
  }
  for (const locale of languages) {
    const value = entries[locale];
    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`Empty ${locale} message: ${message}`);
      continue;
    }
    if ((locale === 'af' || locale === 'zu') && /GIGI Cloud Solutions/i.test(message) && !/GIGI Cloud Solutions/i.test(value)) {
      errors.push(`Brand name missing in ${locale}: ${message}`);
    }
  }
}
for (const message of Object.keys(catalog)) if (!messages.has(message)) errors.push(`Obsolete key: ${message}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`${messages.size} source messages, ${messages.size * languages.length} translations, 0 missing entries.`);
