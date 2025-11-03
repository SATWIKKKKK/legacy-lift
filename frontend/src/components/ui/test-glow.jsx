import { useEffect, useRef } from "react";

const TestGlow = ({ children }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    console.log("TestGlow mounted");
    
    const handleMouseMove = (e) => {
      console.log("Mouse move detected");
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log(`Mouse position: ${x}, ${y}`);
      
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
      className="relative"
      style={{
        '--mouse-x': '50px',
        '--mouse-y': '50px'
      }}
    >
      {/* Simple visible glow for testing */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(100px circle at var(--mouse-x) var(--mouse-y), rgba(255,0,0,0.5), transparent 70%)`,
          opacity: 1
        }}
      />
      {children}
    </div>
  );
};

export default TestGlow;