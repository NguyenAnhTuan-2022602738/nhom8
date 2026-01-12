import React, { useEffect, useState } from 'react';

const FallingFlowers = () => {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    // Generate initial flowers
    const initialFlowers = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 5 + 5 + 's',
      animationDelay: Math.random() * 5 + 's',
      size: Math.random() * 15 + 10 + 'px', // 10px to 25px
    }));
    setFlowers(initialFlowers);
  }, []);

  return (
    <div className="falling-flowers">
      {flowers.map((flower) => (
        <div
          key={flower.id}
          className="flower"
          style={{
            left: `${flower.left}%`,
            animationDuration: flower.animationDuration,
            animationDelay: flower.animationDelay,
            width: flower.size,
            height: flower.size,
          }}
        />
      ))}
    </div>
  );
};

export default FallingFlowers;
