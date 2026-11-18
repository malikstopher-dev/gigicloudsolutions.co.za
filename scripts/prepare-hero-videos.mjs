// Optional asset preparation: node scripts/prepare-hero-videos.mjs (requires ffmpeg).
import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const output = 'public/enterprise/videos';
await mkdir(output, { recursive: true });
for (const scene of ['home', 'about', 'services', 'enterprise-security', 'it-connectivity', 'solar-energy', 'web-graphic-design', 'data-backup', 'contact']) {
  for (const [device, suffix] of [['desktop', '1920x1080'], ['mobile', '1080x1920']]) {
    const stem = `hero-${scene}-${device}`;
    execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', `assets/${stem}-${suffix}.mp4`, '-map', '0:v:0', '-an', '-map_metadata', '-1', '-vf', 'fps=24', '-c:v', 'libx264', '-threads', '4', '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${output}/${stem}.mp4`]);
  }
}
