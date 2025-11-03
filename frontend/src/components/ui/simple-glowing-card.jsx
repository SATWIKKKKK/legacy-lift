const SimpleGlowingCard = ({ children, className = "" }) => {
  return (
    <div 
      className={`relative group ${className}`}
      style={{
        background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
        backgroundSize: '200% 200%',
        animation: 'glow 3s ease-in-out infinite alternate'
      }}
    >
      {children}
      <style jsx>{`
        @keyframes glow {
          0% {
            background-position: 0% 0%;
            box-shadow: 0 0 5px rgba(255,255,255,0.2);
          }
          100% {  
            background-position: 100% 100%;
            box-shadow: 0 0 20px rgba(255,255,255,0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleGlowingCard;