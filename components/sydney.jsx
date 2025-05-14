'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import FloatingText from '@/components/floatingtext';
import AnimatedCard from '@/components/animatedcard';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

function AustraliaModel() {
  const gltf = useLoader(GLTFLoader, '/uluru.glb'); 
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0001;
    }
  });

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={[0.02, 0.02, 0.02]}
      position={[0,0,0]}
      
    />
  );
}

export default function Australia() {
  const router = useRouter(); // Moved here inside the component

  const handleClick = () => {
    router.push('/countryflight?countryName=Australia');
  };

  return (
    <div className="bg-zinc-950">
      <div className="h-screen w-full">
        <Canvas camera={{ position: [35, 20, 30], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[9, 5, 5]} />
          <OrbitControls />
          <AustraliaModel />
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="text-center mt-10 px-4 space-y-6">
        <h1 className="text-8xl font-extralight text-white drop-shadow-lg">Australia</h1>
        <p className="text-xl text-gray-400 mt-4">Where Outback Meets Ocean</p>
        <p className="text-md text-gray-500 mt-2 max-w-3xl mx-auto">
          From the bustling streets of Sydney to the quiet red sands of Uluru, Australia offers a dazzling
          combination of natural beauty, vibrant culture, and chic coastal lifestyle.
        </p>
      </section>

      {/* Attractions */}
      <div className="py-20 px-6 bg-zinc-950">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">Top Attractions in Australia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 px-20 py-10">
          <AnimatedCard
            title="Sydney Opera House"
            description="An architectural masterpiece on Sydney's sparkling harbour — catch a show or simply admire the views."
            image="/opera.jpg"
            category="Cultural Icon"
            date="Sydney, NSW"
            className="w-full h-auto"
          />
          <AnimatedCard
            title="Great Barrier Reef"
            description="Snorkel or dive into a living natural wonder, bursting with color and marine biodiversity."
            image="/reef.jpg"
            category="Natural Wonder"
            date="Queensland"
            className="w-full h-auto"
          />
          <AnimatedCard
            title="Uluru"
            description="A sacred monolith glowing red at sunset, rooted in Aboriginal culture and storytelling."
            image="/uluru.jpg"
            category="Spiritual Site"
            date="Northern Territory"
            className="w-full h-auto"
          />
          <AnimatedCard
            title="Twelve Apostles"
            description="Dramatic limestone stacks rising from the Southern Ocean along the Great Ocean Road, a breathtaking coastal شاهکار (masterpiece)."
            image="/twelve.jpg" // Placeholder image path
            category="Coastal Landscape"
            date="Victoria"
            className="w-full h-auto"
          />
          <AnimatedCard
            title="Kakadu National Park"
            description="A vast, culturally significant national park in the Northern Territory, known for its ancient Aboriginal rock art, diverse wildlife, and stunning landscapes."
            image="/kakadu.jpg" // Placeholder image path
            category="National Park"
            date="Northern Territory"
            className="w-full h-auto"
          />

          <AnimatedCard
            title="Blue Mountains"
            description="A UNESCO World Heritage Area known for its dramatic scenery, eucalyptus forests creating a blue haze, waterfalls, and the iconic Three Sisters rock formation."
            image="/blue.jpg" // Placeholder image path
            category="Natural Landscape"
            date="New South Wales"
            className="w-full h-auto"
          />

          <AnimatedCard
            title="Kangaroo Island"
            description="A haven for Australian wildlife, offering close encounters with kangaroos, koalas, sea lions, and diverse bird species in a natural setting."
            image="/kangaroo.jpg" // Placeholder image path
            category="Wildlife Sanctuary"
            date="South Australia"
            className="w-full h-auto"
          />

          <AnimatedCard
            title="Daintree Rainforest"
            description="The world's oldest tropical rainforest, a lush and biodiverse region in Queensland where the rainforest meets the Great Barrier Reef."
            image="/daintree.jpg" // Placeholder image path
            category="Rainforest"
            date="Queensland"
            className="w-full h-auto"
          />

        </div>
      </div>

      {/* History & Culture Section */}
      <div className="px-6 py-16  text-gray-300 space-y-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white">Australia's Soulful Story</h2>
        <p>
          Australia is home to the world’s oldest living culture — the Aboriginal and Torres Strait Islander peoples
          have been the custodians of this land for over 65,000 years.
        </p>
        <h3 className="text-2xl font-semibold text-white mt-8">
          Beyond the koalas and kangaroos, Australia’s charm lies in its contrasts: deserts and rainforests, ancient traditions and modern lifestyle.
        </h3>
        <p>
          Whether you're sipping flat whites in laneway cafés or stargazing in the Outback, you’ll experience a land of open hearts and breathtaking horizons.
        </p>
      </div>

      {/* Why Travel Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 py-20">
        <div>
          <Image src="/koala.jpg" alt="Australia Vibes" width={700} height={300} className="rounded-xl px-10 shadow-yellow-300" />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Travel With Style & Ease</h2>
          <p className="text-gray-300 pr-20">
            Australia’s world-class hospitality, diverse landscapes, and relaxed culture make it a traveler's dream. 
            Whether you're seeking thrills, relaxation, or cultural immersion — it's all here.
          </p>
          <h3 className="text-3xl font-semibold text-white">Why Waves?</h3>
          <p className="text-gray-400 pr-20">
            We don't just book trips — we curate experiences. From personalized itineraries to luxe stays and local secrets,
            we make your Aussie adventure unforgettable.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-200 text-black text-center py-20 space-y-4">
        <h2 className="text-4xl font-bold">Craving Sun & Sand?</h2>
        <p className="text-lg">Your dream Australia trip is just a click away. Let’s get you there!</p>
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-black transition" onClick={handleClick}>
          Start Planning
        </button>
      </div>
    </div>
  );
}
