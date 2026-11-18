import { useLayoutEffect, useRef } from 'react';

const highlightName = 'gc-hero-pending';
const posterGrace = 650;

// A highlight masks the untyped range without removing text from line layout
// or changing what assistive technology can read.
export function useHeroTypewriter(locale: string) {
  const copyRef = useRef<HTMLDivElement>(null);
  const wideRef = useRef<HTMLSpanElement>(null);
  const compactRef = useRef<HTMLSpanElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    const hero = copy?.closest('.gc-hero');
    const cursor = cursorRef.current;
    const motion = matchMedia('(prefers-reduced-motion: reduce), (forced-colors: active)');
    if (!copy || !hero || !cursor || motion.matches || !globalThis.CSS?.highlights ||
        typeof Highlight !== 'function' || typeof Intl.Segmenter !== 'function') return;

    const mobile = matchMedia('(width < 768px)').matches;
    const headline = (mobile ? compactRef : wideRef).current?.firstChild;
    const lead = leadRef.current?.firstChild;
    if (!(headline instanceof Text)) return;

    const hidden = new Highlight();
    const segmenter = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    const createTrack = (node: Text) => {
      const range = new Range();
      range.selectNodeContents(node);
      hidden.add(range);
      return { node, range, units: Array.from(segmenter.segment(node.data)) };
    };
    const tracks = [createTrack(headline)];
    if (lead instanceof Text && lead.length) tracks.push(createTrack(lead));
    const caret = new Range();
    CSS.highlights.set(highlightName, hidden);
    copy.dataset.intro = 'waiting';

    let timer: number;
    let started = false;
    let finished = false;
    const schedule = (step: () => void, delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(step, delay);
    };

    const finish = () => {
      finished = true;
      window.clearTimeout(timer);
      if (CSS.highlights.get(highlightName) === hidden) CSS.highlights.delete(highlightName);
      delete copy.dataset.intro;
      delete cursor.dataset.active;
      hero.removeEventListener('playing', begin, true);
      copy.removeEventListener('focusin', finish);
      window.removeEventListener('resize', finish);
      motion.removeEventListener('change', finish);
    };

    const type = (trackIndex: number, index: number) => {
      const track = tracks[trackIndex];
      const unit = track.units[index];
      if (!unit) {
        if (tracks[trackIndex + 1]) {
          schedule(() => type(trackIndex + 1, 0), 180);
        } else {
          copy.dataset.intro = 'actions';
          schedule(finish, 700);
        }
        return;
      }

      copy.dataset.intro = trackIndex === 0 ? 'headline' : 'lead';
      const end = unit.index + unit.segment.length;
      track.range.setStart(track.node, end);

      if (unit.segment.trim()) {
        caret.setStart(track.node, unit.index);
        caret.setEnd(track.node, end);
        const glyph = caret.getBoundingClientRect();
        const origin = copy.getBoundingClientRect();
        cursor.style.height = `${glyph.height * .76}px`;
        cursor.style.transform = `translate(${glyph.right - origin.left + 4}px, ${glyph.top - origin.top + glyph.height * .13}px)`;
        cursor.dataset.active = '';
      }

      const pause = /[.!?…:;]$/u.test(unit.segment) ? (trackIndex === 0 ? 88 : 56) : /,$/u.test(unit.segment) ? 28 : 0;
      schedule(() => type(trackIndex, index + 1), (trackIndex === 0 ? 39 : 16) + pause);
    };

    const begin = () => {
      if (started || finished) return;
      started = true;
      copy.dataset.intro = 'eyebrow';
      schedule(() => type(0, 0), mobile ? 180 : 240);
    };

    hero.addEventListener('playing', begin, true);
    copy.addEventListener('focusin', finish);
    window.addEventListener('resize', finish);
    motion.addEventListener('change', finish);

    // Prefer starting against a playing video; a stalled or disabled video
    // must never keep the visitor waiting for the headline.
    const video = hero.querySelector('video');
    if (video && !video.paused && video.readyState >= 3) begin();
    else schedule(begin, posterGrace);

    return finish;
  }, [locale]);

  return { copyRef, wideRef, compactRef, leadRef, cursorRef };
}
