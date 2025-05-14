'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function InteractiveGlobe() {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 3000);
    }
  }, []);

  return (
    <div className="w-full h-[500px] bg-black">
      <Globe
        ref={globeEl}
        globeImageUrl="/globe.png"
        backgroundColor="rgba(0, 0, 0, 0)" 
        width={typeof window !== 'undefined' ? window.innerWidth : 800}
        height={500}
        animateIn={true}
      />
    </div>
  );
}
