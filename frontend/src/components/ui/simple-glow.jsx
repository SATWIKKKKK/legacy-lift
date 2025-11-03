import { useEffect, useRef } from "react";

const SimpleGlow = ({ children }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative group"
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      }}
    >
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-inherit"
        style={{
          background: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 40%)`
        }}
      />
      {children}
    </div>
  );
};

export default SimpleGlow;