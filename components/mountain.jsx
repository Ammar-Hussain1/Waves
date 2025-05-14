'use client';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import FloatingText from '@/components/floatingtext';
import AnimatedCard from '@/components/animatedcard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function IslandModel() {
    const ref = useRef();

    const gltf = useLoader(GLTFLoader, '/ni.glb', (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      loader.setDRACOLoader(dracoLoader);
    });

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
    }
  });

   return (
    <primitive
      ref={ref}
      object={gltf.scene}
      scale={[8,8,8]}       // Uniform scale
      position={[0, 300, 50]}      // Slightly lowered
     rotation={[0, 0.40, 0]} // Rotates 90° horizontally

    />
  );
}

export default function Mountain() {
   const router = useRouter();
  
    const handleClick = () => {
      router.push('/countryflight?countryName=Canada');
    };
  return (
    <>
      <div className='bg-zinc-950'>
        <div className="h-screen w-full hidden md:block">
           <Canvas camera={{ position: [10, 80, 290], fov: 50 , rotation:[-20, 150, 0] }}>
                  <ambientLight intensity={0.3} />
                  <directionalLight position={[9, 5, 5]} />
                  <OrbitControls />
                  <IslandModel />
                </Canvas>
        </div>

         {/* Main Section with Title and Description */}
      <section className="text-center mt-10 px-4 space-y-6">
        <h1 className="text-8xl font-extralight text-white">Canada</h1>
        <p className="text-xl text-gray-400 mt-4">A Land of Nature, Culture, and Diversity</p>
        <p className="text-md text-gray-500 mt-2 max-w-3xl mx-auto">
        Canada is the second-largest country in the world, boasting a rich blend of natural wonders, cultural vibrance, 
        and modern charm. From icy mountain peaks to bustling multicultural cities, Canada offers something for every traveler.
        </p>
      </section>

      {/* Card Grid Section */}
      <div className="py-20 px-6 bg-zinc-950">
  <h2 className="text-4xl font-bold text-center mb-10 text-white">Top Attractions in Canada</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-20 py-10">
  <AnimatedCard
  title="Niagara Falls"
  description="Feel the roar of millions of gallons of water crashing down every second. You can take a boat tour (like the Hornblower) to get up close—or view the spectacle from the Skylon Tower."
  image="/niagara.jpg"
  category="Waterfall"
  date="Ontario"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Banff National Park"
  description="Turquoise lakes, majestic glaciers, and scenic hiking trails await in the heart of the Rocky Mountains. Banff is a dream destination for outdoor lovers and wildlife spotters."
  image="/banff.jpg"
  category="National Park"
  date="Alberta"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Old Quebec"
  description="Walk through cobblestone streets, historic forts, and French-inspired architecture in this UNESCO World Heritage site. Don't miss the iconic Château Frontenac!"
  image="/oldqubec.jpg"
  category="Historical"
  date="Quebec City"
  className="w-full h-auto"
/>

<AnimatedCard
  title="CN Tower"
  description="Canada’s tallest tower offers panoramic views of Toronto and Lake Ontario. Dare to walk on the glass floor or try the EdgeWalk for an adrenaline rush!"
  image="/cntower.jpg"
  category="Modern Wonder"
  date="Toronto, Ontario"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Stanley Park"
  description="A massive urban oasis featuring beaches, forests, totem poles, and the famous seawall. A perfect blend of nature and city life in Vancouver."
  image="/stanley.jpg"
  category="Urban Park"
  date="Vancouver, BC"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Gros Morne National Park"
  description="Explore dramatic fjords, ancient rocks, and hiking trails in this UNESCO site. A hidden gem for nature lovers and geology enthusiasts."
  image="/gros.jpg"
  category="Natural Wonder"
  date="Newfoundland & Labrador"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Whistler"
  description="Home to world-class skiing, Whistler also offers zip-lining, biking, and cozy mountain vibes year-round. A winter and summer playground."
  image="/whistler.jpg"
  category="Adventure"
  date="British Columbia"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Parliament Hill"
  description="Discover Canada’s political hub through historic tours, impressive architecture, and symbolic ceremonies like the Changing of the Guard."
  image="/parliament.jpg"
  category="Landmark"
  date="Ottawa, Ontario"
  className="w-full h-auto"
/>

<AnimatedCard
  title="Peggy’s Cove"
  description="An iconic red-and-white lighthouse perched on wave-battered rocks. This picturesque fishing village is perfect for peaceful walks and seafood cravings."
  image="/peggy.jpg"
  category="Coastal Escape"
  date="Nova Scotia"
  className="w-full h-auto"
/>

    </div>
    </div>
      {/* History Section */}
      <div className="px-6 py-16  text-gray-300 space-y-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white">A Glimpse Into Canada's History</h2>
        <p>
        Long before European settlers arrived, the land was home to Indigenous peoples with deep spiritual and cultural traditions.
        </p>
        <h3 className="text-2xl font-semibold mt-8 text-gray-300">Canada is more than just mountains and maple syrup—it's a vast, welcoming land brimming with natural wonders, multicultural vibrancy, and unforgettable adventures. Whether you're into urban explora
            tion or quiet retreats in nature, Canada has something for everyone.</h3>
        <p>
        Canada celebrates cultural diversity like few other places. Over 200 ethnic origins are represented, and
         festivals like Caribana, Diwali in Brampton, and Chinese New Year in Vancouver highlight its mosaic of traditions.</p>
      </div>

      {/* "WHY BALI?" Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 py-20">
        <div>
          <Image src="/canFlag.png" alt="Bali Nature" width={700} height={300} className="rounded-xl px-10 shadow-emerald-700 " />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Travel With Us For Smooth Experience</h2>
          <p className="text-gray-300 pr-20">
            Bali offers more than just a vacation—it’s an experience. Whether you're a nature lover, adventurer, spiritual seeker, or someone craving peace, Bali has something just for you.
          </p>
          <h3 className="text-3xl font-semibold text-white">Why Waves?</h3>
          <p className="text-gray-400 pr-20">
          💼 Tailored Itineraries, Just for You
            We understand that no two travelers are the same. Whether you're a thrill-seeker, culture enthusiast, or peaceful wanderer—we design your trip around your vibe, your pace, your dreams.
            <br/><br/><br/>
            📞 24/7 Customer Support
            From flight delays to last-minute changes, we're here anytime, anywhere. Travel stress-free knowing we’ve got your back—before, during, and after your trip.
            <br/><br/><br/>
            🧳 All-in-One Travel Solutions
            Flights, accommodations, local tours, transport, and hidden gems—everything under one roof, managed by our expert team.
            <br/><br/><br/>
            🌎 Local Expertise, Global Network
            Thanks to our strong partnerships with local guides and hotels, you get authentic experiences with the best value—no tourist traps, just real adventure.
            <br/><br/><br/>
            💸 Transparent Pricing. No Surprises.
            We believe in honesty and clarity. With Waves, what you see is what you get—no hidden fees, no last-minute costs.
            <br/><br/><br/>
</p>
                    </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-200 text-black text-center py-20 space-y-4">
        <h2 className="text-4xl font-bold">Ready for your adventure?</h2>
        <p className="text-lg">Plan your dream trip now and let Canada amaze you</p>
        <button className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-white hover:text-black transition" onClick={handleClick}>
          Start Planning
        </button>
      </div>
      </div>
    </>
  );
}
