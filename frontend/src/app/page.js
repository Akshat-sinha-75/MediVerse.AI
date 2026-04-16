import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GlowEffect from '@/components/GlowEffect';
import SecondHero from '@/components/SecondHero';
import FloatingIcons from '@/components/FloatingIcons';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';
import BackgroundAnimation from '@/components/BackgroundAnimation';

export default function Home() {
  return (
    <>
      <BackgroundAnimation />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <GlowEffect />
        <div style={{ position: 'relative' }}>
          <FloatingIcons />
          <SecondHero />
        </div>
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
}
