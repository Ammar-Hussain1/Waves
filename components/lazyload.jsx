import React, { useState, Suspense } from 'react';

function LazyLoadModel() {
  const [loadModel, setLoadModel] = useState(false);

  const handleClick = () => {
    setLoadModel(true); // Trigger model load when the user clicks or scrolls
  };

  return (
    <div>
      <button onClick={handleClick}>Load Model</button>

      <Suspense fallback={<div>Loading...</div>}>
        {loadModel && <IslandModel />}
      </Suspense>
    </div>
  );
}

export default LazyLoadModel;
