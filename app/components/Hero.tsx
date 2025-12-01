// src/app/components/Hero.tsx

'use client';

export default function Hero() {
  return (
    <div className="text-center py-12 md:py-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text glow-purple animate-scale-in mb-4">
        Poke Assign
      </h1>
      <p className="text-lg md:text-xl text-slate-400 animate-fade-in" style={{ animationDelay: '200ms' }}>
        Discover your inner gremlin through Pokemon science
      </p>
    </div>
  );
}