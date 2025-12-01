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
      <div className="mt-8 flex justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-slow"></div>
        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse-slow" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-slow" style={{ animationDelay: '600ms' }}></div>
      </div>
    </div>
  );
}