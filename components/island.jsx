'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import AnimatedCard from '@/components/animatedcard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function IslandModel() {
  const modelRef = useRef();

  const gltf = useLoader(GLTFLoader, '/sag.glb', (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
  });

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      scale={[0.5, 0.5, 0.5]}
      position={[0, -1.5, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
}

export default function Island3D() {
   const router = useRouter();
  
    const handleClick = () => {
      router.push('/countryflight?countryName=Thailand');
    };
  return (
    <>
      <div className='bg-zinc-950'>
        {/* 3D Canvas Section */}
        <div className="h-screen w-full hidden md:block">
          <Canvas camera={{ position: [6, 2, 10], fov: 50 }}>
            <ambientLight intensity={8} />
            <directionalLight position={[9, 5, 5]} />
            <OrbitControls />
            <IslandModel />
          </Canvas>
        </div>

        {/* Title and Description */}
        <section className="text-center mt-10 px-4 space-y-6 bg-zinc-950">
          <h1 className="text-8xl font-extralight text-white">Bali</h1>
          <p className="text-xl text-gray-400 mt-4">The Island of the Gods</p>
          <p className="text-md text-gray-500 mt-2 max-w-3xl mx-auto">
            Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies,
            beaches, and coral reefs. It is a paradise that blends natural beauty, rich culture,
            and spiritual heritage into a magical experience.
          </p>
        </section>

        {/* Card Grid Section */}
        <div className="py-20 px-6 bg-zinc-950">
          <h2 className="text-4xl font-bold text-center mb-10 text-white">Top Attractions in Bali</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-20 py-10">
            {[
              { title: 'Ubud Monkey Forest', desc: 'A sanctuary for the Balinese long-tailed monkey.', img: '/monkey.jpg', cat: 'Nature' },
              { title: 'Tanah Lot Temple', desc: 'A unique temple perched on a rock formation.', img: '/tanah.jpg', cat: 'Cultural' },
              { title: 'Tegallalang Rice Terraces', desc: 'Famous for its scenic rice terraces in Ubud.', img: '/tegg.jpg', cat: 'Nature' },
              { title: 'Mount Batur Sunrise Trek', desc: 'A trek to the summit for an unforgettable sunrise.', img: '/batur.jpg', cat: 'Adventure' },
              { title: 'Besakih Temple', desc: 'The Mother Temple of Bali on Mount Agung.', img: '/besakih.jpg', cat: 'Cultural' },
              { title: 'Uluwatu Cliff', desc: 'A cliffside view with a temple over the ocean.', img: '/uluwatu.jpg', cat: 'Adventure' },
            ].map((card, i) => (
              <AnimatedCard
                key={i}
                title={card.title}
                description={card.desc}
                image={card.img}
                category={card.cat}
                date="2025"
                className="w-full h-auto"
              />
            ))}
          </div>
        </div>

        {/* History Section */}
        <div className="px-6 py-16 bg-zinc-950 text-gray-300 space-y-10 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white">The History of Bali</h2>
          <p>
            Bali's history dates back to prehistoric times, with early human settlement as far back as 2000 B.C.
            Influences from Hinduism and Buddhism shaped Bali's spiritual and cultural identity.
          </p>
          <h3 className="text-2xl font-semibold mt-8 text-white">Spiritual Legacy</h3>
          <p>
            The island is home to over 10,000 temples and a rich tradition of rituals, dances, and festivals deeply rooted in its spiritual ethos.
          </p>
          <h3 className="text-2xl font-semibold mt-8 text-white">Modern Day Bali</h3>
          <p>
            While embracing modern tourism, Bali retains its traditions, making it a unique blend of the past and present—where yoga retreats meet traditional ceremonies.
          </p>
        </div>

        {/* Why Bali Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 py-20">
          <div>
            <img src="/bali2.png" alt="Bali Nature" width={700} height={300} className="rounded-xl px-10 h-200" />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white">WHY BALI?</h2>
            <p className="text-gray-300">
              Bali offers more than just a vacation—it’s an experience. Whether you're a nature lover, adventurer, spiritual seeker, or someone craving peace, Bali has something just for you.
            </p>
            <h3 className="text-2xl font-semibold text-white">Why Waves?</h3>
            <p className="text-gray-400">
              At Waves, we make your Bali dreams come true. With expert guidance, tailored packages, and 24/7 customer support, we ensure your journey is smooth, unforgettable, and magical from start to finish.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-200 text-black text-center py-20 space-y-4">
          <h2 className="text-4xl font-bold text-white">Ready for your adventure?</h2>
          <p className="text-lg">Plan your dream trip now and let Bali enchant you</p>
          <button className="bg-black text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white hover:text-black transition" onClick={handleClick}>
            Start Planning
          </button>
        </div>
      </div>
    </>
  );
}
