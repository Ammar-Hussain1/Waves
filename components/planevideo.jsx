import { Pacifico } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

const Plainvideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden z-0">
      {/* Background Image */}
      <motion.div
        initial={{ x: 600, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <img
          src="/bg2.png"
          alt="plane image"
          className="w-screen h-screen object-cover"
        />
      </motion.div>

      {/* Overlay Text/Buttons */}
      <div className="absolute top-6 w-full flex flex-col items-center gap-4 z-10 font-light ">
        <h1 className="text-white text-8xl">Fly the Future with Waves</h1>
      
      </div>
    </div>
  );
};

export default Plainvideo;
