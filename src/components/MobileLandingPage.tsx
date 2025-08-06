import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VideoBackground from './VideoBackground';
import { CountryCodeSelect } from './CountryCodeSelect';
import { PPFLeadApiService } from '../api/ppfLeadApi';
import { TemplateApiService } from '../api/templateApi';
import { sendSingleMessage } from '../api/wassender';

const MobileLandingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+971');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load template on mount
  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      const response = await TemplateApiService.getActiveTemplate();
      if (response.success && response.data) {
        setTemplate(response.data as string);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleWhatsAppClick = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Save lead to database with full phone number
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const leadResult = await PPFLeadApiService.createLead(fullPhoneNumber);
      
      if (!leadResult.success) {
        console.error('Failed to save lead:', leadResult.error);
      }

      // Generate message from template
      let message = template || `Hi! I'm interested in paint protection film services. My phone number is ${fullPhoneNumber}.`;
      
      // Replace template variables
      message = message.replace(/{whatsapp_number}/g, fullPhoneNumber);

      // Send message via Wasender API
      try {
        await sendSingleMessage(fullPhoneNumber, message);
        console.log('Message sent via Wasender API');
      } catch (error) {
        console.error('Failed to send message via Wasender API:', error);
        alert('Message sent! We will contact you shortly.');
      }

      // Show success state
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error processing request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        {/* Premium Glass Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="premium-glass-card p-8 rounded-2xl animate-fade-in">
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
            <div className="mb-12 space-y-6">
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

            {/* Contact Form or Thank You Message */}
            {!isSubmitted ? (
              <div className="space-y-4">
                <div className="relative flex">
                  <CountryCodeSelect
                    value={countryCode}
                    onChange={setCountryCode}
                    className="w-32 flex-shrink-0"
                  />
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 h-14 rounded-r-xl rounded-l-none bg-glass backdrop-blur-sm border border-l-0 border-border/50 text-foreground placeholder:text-muted-foreground text-lg px-6 focus:border-primary/50 focus:ring-primary/25 transition-all duration-300 hover:border-primary/30"
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  onClick={handleWhatsAppClick}
                  variant="whatsapp"
                  size="chunky"
                  className="w-full flex items-center gap-3 premium-button transition-all duration-300 hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.386"/>
                    </svg>
                  )}
                  {isLoading ? 'Processing...' : 'Send My Quote'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                {/* Thank You Message */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    Thank You!
                  </h3>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    One of our specialist agents will get back to you soon.
                  </p>
                </div>
              </div>
            )}

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
      </div>
    </div>
  );
};

export default MobileLandingPage;