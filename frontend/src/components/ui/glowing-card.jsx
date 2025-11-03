import { GlowingEffect } from './glowing-effect';

const GlowingCard = ({ 
  children, 
  className = "", 
  color = "blue",
  intensity = "medium",
  ...props 
}) => {
  return (
    <div className={`relative ${className}`} {...props}>
      <GlowingEffect
        color={color}
        intensity={intensity}
        disabled={false}
      />
      {children}
    </div>
  );
};

export default GlowingCard;