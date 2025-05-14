// components/Loader.js
'use client';

import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <motion.div
        className="relative w-24 h-24 rounded-full border-4 border-t-transparent border-gray-400"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1.2,
        }}
      >
        {/* Inner Pulse Circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;
