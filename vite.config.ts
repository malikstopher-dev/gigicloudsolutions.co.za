import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localizeJsx } from './scripts/locale-source.mjs';

export default defineConfig({ plugins: [{
  name: 'gigi-localized-copy',
  enforce: 'pre',
  transform(code, id) {
    if (/[/\\]src[/\\](main|HeroMedia)\.tsx$/.test(id)) return localizeJsx(id, code);
  },
}, react()] });
