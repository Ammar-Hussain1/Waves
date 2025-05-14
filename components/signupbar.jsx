// SignUpBar.tsx
import React from 'react';

const SignUpBar = () => {
  return (
    <div
      className="relative flex items-center justify-between px-8 py-20 text-white mx-60 my-30"
      style={{
        backgroundImage: `url('flowers.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '120px',
      }}
    >
      <h2 className="text-2xl md:text-3xl font-extralight">
        Sign Up and Feel the Waves
      </h2>
<a href="/signup">
  <button className="relative flex items-center justify-between border border-white px-6 py-3 text-white bg-transparent hover:bg-white hover:text-black transition-all duration-300">
    Sign Up
    <span className="ml-4 w-3 h-3 bg-white rounded-full animate-pulse"></span>
  </button>
</a>

    </div>
  );
};

export default SignUpBar;
