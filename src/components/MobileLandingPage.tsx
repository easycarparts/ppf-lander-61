import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VideoBackground from './VideoBackground';

const MobileLandingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi! I'm interested in paint protection film services. My phone number is ${phoneNumber || 'will provide later'}.`);
    const whatsappUrl = `https://wa.me/971501234567?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        {/* Header - Logo */}
        <div className="mb-8 space-y-2">
          <h1 className="text-lg font-black tracking-[0.2em] text-foreground uppercase">
            <span className="inline-block bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              EASY AUTO DUBAI
            </span>
          </h1>
          <div className="h-0.5 w-20 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        </div>

        {/* Hero Section */}
        <div className="mb-12 space-y-6 max-w-sm">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="text-foreground">Preserve Your</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Masterpiece
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-foreground/80 font-medium leading-relaxed">
            Dubai's Specialists for
            <br />
            <span className="text-accent">Paint Protection Film</span>
          </p>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Input
              type="tel"
              placeholder="+971 (Enter Your Number)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-14 rounded-xl bg-glass backdrop-blur-sm border-border/50 text-foreground placeholder:text-muted-foreground text-lg px-6 focus:border-primary/50 focus:ring-primary/25"
            />
          </div>
          
          <Button
            onClick={handleWhatsAppClick}
            variant="whatsapp"
            size="chunky"
            className="w-full flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.386"/>
            </svg>
            Send Me WhatsApp Quote
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-foreground">Trustpilot</span>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLandingPage;