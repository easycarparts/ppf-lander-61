import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  className?: string;
}

const VideoBackground = ({ className = '' }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Fallback image while video loads */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/assets/car-video-bg.jpg')`
        }}
      />
      
      {/* Video overlay with dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      
      {/* Animated video simulation using CSS */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--glow))_0%,transparent_50%)] animate-pulse" 
             style={{ animationDelay: '1s', animationDuration: '3s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary))/0.1_0%,transparent_40%)] animate-pulse" 
             style={{ animationDelay: '2s', animationDuration: '4s' }} />
      </div>
    </div>
  );
};

export default VideoBackground;