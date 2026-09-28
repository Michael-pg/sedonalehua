import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useGSAP} from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ease: 'power3.out', duration: 1.2});
}

/** Media query keys shared by every animated section. */
export const MOTION = {
  ok: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
} as const;

export {gsap, ScrollTrigger, useGSAP};
