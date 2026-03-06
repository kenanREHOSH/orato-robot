import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aboutBg from '../assets/AboutUs.jpg';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OurMission from '../components/OurMission';
import OurVision from '../components/OurVision';
import DifferentUs from '../components/DifferentUs';
import MeetOurTeam from '../components/OurTeam';
import PoweredByTechnology from '../components/TechnologyUs';
import LiveChat from '../components/LiveChat';
import { FaArrowUp } from 'react-icons/fa';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar isLoggedIn={false} />

      <main className="bg-[#f0faf6] min-h-screen relative overflow-x-hidden">
        {/* Page Header */}
        <header
          className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-end px-6 md:px-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutBg})` }}
        >
          {/* Dark Overlay - No Blur */}
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 w-full max-w-xl">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                About <br />
                <span className="text-[#1a9e6b]">ORATO</span>
              </h1>

              {/* Decorative Green Line */}
              <div className="w-20 h-1.5 bg-[#1a9e6b] rounded-full mb-8"></div>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-medium">
                Making language learning accessible, engaging, and effective for everyone around the world.
              </p>

              {/* Action Buttons (Optional, added for visual parity with screenshot) */}
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-8 py-3 bg-[#1a9e6b] text-white font-bold rounded-xl hover:bg-[#14c781] transition-all duration-300"
                >
                  Join Us
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-8 py-3 bg-[#1a9e6b] text-white font-bold rounded-xl hover:bg-[#14c781] transition-all duration-300 flex items-center gap-2"
                >
                  <span>💬</span> Live Chat
                </button>
              </div>
            </div>
          </div>
        </header>
        <OurMission />
        <OurVision />
        <DifferentUs />
        <MeetOurTeam />
        <PoweredByTechnology />

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-4 rounded-2xl bg-[#1a9e6b] text-white shadow-[0_10px_30px_rgba(26,158,107,0.3)] hover:bg-[#14c781] hover:scale-110 active:scale-95 transition-all duration-500 z-50 group ${showScrollTop ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible'
            }`}
          aria-label="Scroll to top"
        >
          <span className="flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
            <FaArrowUp size={20} />
          </span>

          {/* Tooltip */}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d2d2a] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Back to Top
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[#0d2d2a]"></span>
          </span>
        </button>
      </main>

      {/* Live Chat Widget */}
      <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Footer />
    </div>
  );
};

export default AboutUs;