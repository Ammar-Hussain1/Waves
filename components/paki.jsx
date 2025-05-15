'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import AnimatedCard from '@/components/animatedcard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function PakistanModel() {
  const gltf = useLoader(GLTFLoader, '/mount.glb'); 
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.00007;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={[0.001, 0.001, 0.001]}
      position={[0, 30,0]}
       rotation={[0, 3, 0]} // Rotates 90° horizontally
    />
  );
}


export default function Pakistan() {

   const router = useRouter(); 
  
    const handleClick = () => {
      router.push('/countryflight?countryName=Pakistan');
    };
  return (
    <div className="bg-black">
      {/* 3D Model Viewer */}
      <div className="h-screen w-full">
        <Canvas camera={{ position: [30, 80, 250], fov: 50 , rotation:[0, 120, 0] }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[9, 5, 5]} />
          <OrbitControls />
          <PakistanModel />
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="text-center mt-10 px-4 space-y-6">
        <h1 className="text-8xl font-extralight text-white drop-shadow-lg">Pakistan</h1>
        <p className="text-xl text-gray-400 mt-4">Land of Mountains, Mystics & Hospitality</p>
        <p className="text-md text-gray-500 mt-2 max-w-3xl mx-auto">
          From the majestic peaks of the north to the ancient ruins of Mohenjo-Daro, Pakistan is a tapestry of rich history, cultural diversity, and breathtaking landscapes.
        </p>
      </section>

      {/* Attractions */}
      <div className="py-20 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">Top Attractions in Pakistan</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-16 px-20 py-10">

       
          <AnimatedCard
            title="Hunza Valley"
            description="A picturesque paradise in the north, surrounded by snow-capped peaks, glacier-fed rivers, and warm-hearted locals."
            image="/hunza.jpg"
            category="Nature's Gem"
            date="Gilgit-Baltistan"
            className="w-full h-50"
          />
        <AnimatedCard
            title="Badshahi Mosque"
            description="A Mughal architectural marvel built in 1673 — a symbol of Lahore's imperial past and spiritual soul."
            image="/bm.jpg"
            category="Historic Landmark"
            date="Lahore, Punjab"
            className="w-full h-auto"
          />

            <AnimatedCard
            title="K2"
            description="The second-highest mountain in the world, K2 offers an awe-inspiring challenge for mountaineers and a breathtaking view of the Karakoram Range."
            image="/k2.jpg"
            category="Mountain Adventure"
            date="Gilgit-Baltistan"
            className="w-full h-auto"
            />

          <AnimatedCard
            title="Mohenjo-daro"
            description="Explore the remarkably preserved ruins of this ancient Indus Valley Civilization city in Sindh, a UNESCO World Heritage Site dating back over 4,000 years."
            image="/mohenjo.jpg" // Placeholder image path
            category="Archaeological Site"
            date="Sindh"
            className="w-full h-auto"
          />

        <AnimatedCard
          title="Saif-ul-Malook Lake"
          description="A breathtaking alpine lake in the Kaghan Valley, famous for its stunning natural beauty, the surrounding snow-capped peaks, and the folklore associated with it."
          image="/saiful.jpg" // Placeholder image path
          category="Natural Landmark"
          date="Kaghan Valley"
          className="w-full h-auto"
        />

        <AnimatedCard
          title="Rohtas Fort"
          description="A historic 16th-century garrison fort near Jhelum, a UNESCO World Heritage Site showcasing impressive military architecture and rich history."
          image="/rohtas.jpg" // Placeholder image path
          category="Historical Fort"
          date="Jhelum"
          className="w-full h-auto"
        />


        </div>
      </div>

      {/* History & Culture Section */}
      <div className="px-6 py-16 bg-black text-gray-300 space-y-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white">Pakistan's Living Heritage</h2>
        <p>
          With civilizations dating back over 5,000 years, Pakistan stands as a crossroad of cultures, empires, and spiritual traditions.
        </p>
        <h3 className="text-2xl font-semibold text-white mt-8">
          From Sufi shrines echoing with qawwalis to bustling bazaars filled with color, Pakistan offers a journey like no other.
        </h3>
        <p>
          Whether you're savoring biryani in Karachi or trekking to the base of Nanga Parbat, every path tells a story — of resilience, warmth, and wonder.
        </p>
      </div>

      {/* Why Travel Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 py-20">
        <div>
          <Image src="/pak.jpg" alt="Pakistani" width={700} height={300} className="rounded-xl px-10 shadow-green-400 h-200" />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Travel With Heart & Adventure</h2>
          <p className="text-gray-300 pr-20">
            Pakistan’s scenic diversity, hospitable people, and cultural depth make it an unforgettable destination for explorers and storytellers alike.
          </p>
          <h3 className="text-3xl font-semibold text-white">Why Waves?</h3>
          <p className="text-gray-400 pr-20">
            We offer hand-crafted itineraries, cultural immersion, and local connections that let you experience the real Pakistan — safely, comfortably, and meaningfully.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-200 text-black text-center py-20 space-y-4">
        <h2 className="text-4xl font-bold">Ready to Discover Pakistan?</h2>
        <p className="text-lg">Let us take you on a soulful journey through the land of legends, mountains, and unmatched hospitality.</p>
        <button  className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-black transition" onClick={handleClick}>
          Start Planning
        </button>
      </div>
    </div>
  );
}
