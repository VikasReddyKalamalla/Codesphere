import React from 'react';
import { Hero } from '../components/Hero.jsx';
import { Features } from '../components/Features.jsx';
import { CTA } from '../components/CTA.jsx';
import { ScrollingCodeBackground } from '../components/ScrollingCodeBackground.jsx';

export default function Home() {
  return (
    <div className="flex flex-col w-full relative bg-white">
      <ScrollingCodeBackground />
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}

