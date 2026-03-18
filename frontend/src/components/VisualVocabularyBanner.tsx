import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Layers, ArrowRight, Eye, HelpCircle, Headphones, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VisualVocabularyBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    gsap.to(containerRef.current, {
      rotateX: -rotateX,
      rotateY: rotateY,
      translateZ: 20,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    setIsHovered(false);
  };

  const steps = [
    { icon: Eye, label: "See" },
    { icon: HelpCircle, label: "Guess" },
    { icon: Headphones, label: "Listen" },
    { icon: Smile, label: "Enjoy" },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl p-6 card-shadow cursor-pointer transition-all duration-300"
      style={{ transformStyle: "preserve-3d", perspective: "500px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate("/visual-cards")}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-emerald-500" />
        <h5 className="text-lg font-semibold text-gray-900 font-heading">
          Visual Vocabulary Cards
        </h5>
      </div>

      {/* Content */}
      <div
        className={`rounded-xl p-5 transition-all duration-300 border ${
          isHovered
            ? "bg-emerald-50 border-emerald-200"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <p className="text-m text-gray-800 leading-relaxed mb-5">
          Learn new words through visual cards. No tests, no pressure — just explore and enjoy at your own pace.
        </p>

        {/* Steps Row */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {steps.map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all duration-300 ${
                isHovered ? "bg-white" : "bg-white"
              }`}
              style={{
                transitionDelay: `${i * 50}ms`,
                transform: isHovered ? "translateY(-3px)" : "translateY(0)",
              }}
            >
              <Icon
                className={`w-4 h-4 transition-colors duration-300 ${
                  isHovered ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span className="text-xs font-medium text-gray-800">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            isHovered
              ? "bg-green-500 text-white shadow-md"
              : "bg-green-100 text-green-600"
          }`}
        >
          Explore Cards
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}