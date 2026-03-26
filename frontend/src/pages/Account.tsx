// React
import React, { useState, useEffect } from "react";
import { FaArrowUp } from 'react-icons/fa';

// Layout
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/AccountPageBackground";

// Account Feature Sections
import ProfileSection from "../components/account/ProfileSection";
import LanguagesSection from "../components/account/LanguagesSection";
import GoalsSection from "../components/account/GoalsSection";
import AchievementSection from "../components/account/AchievementSection";

// Modals
import EditProfileModal from "../components/EditProfileModal";
import LanguageModal from "../components/account/LanguageModal";
import AddGoalController from "../components/account/AddGoalController";

// Services & Utilities
import API from "../services/api";
import toast from "react-hot-toast";


const Account: React.FC = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    API.get("/users/goals")
      .then((res) => {
        if (res.data?.goals) setGoals(res.data.goals);
      })
      .catch(() => {
        // silently fail — user may not be authenticated yet
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setUserStorage = (updatedUser: any) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await API.post("/users/upload-profile-picture", formData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setUserStorage(updatedUser);
      toast.success("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("UPLOAD ERROR:", error?.response?.data || error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Image must be under 10MB");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setUploading(true);
      const response = await API.delete("/users/upload-profile-picture");
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setUserStorage(updatedUser);
      toast.success("Profile picture removed!");
    } catch (error: any) {
      console.error("Remove profile picture error:", error?.response?.data || error);
      toast.error("Failed to remove profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="p-10 text-center">Loading account...</div>;
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map((name: string) => name[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="page-wrapper">
      <Navbar isLoggedIn={true} />

      <PageBackground>
        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

          {/* HEADER */}
          <div className="pb-8 mb-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-emerald-500/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Workspace</p>
            </div>
            <h1 className="text-4xl font-extrabold text-emerald-950 tracking-tight">
              Profile <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">&amp; Setting</span>
            </h1>
            <p className="mt-3 text-gray-400 font-medium text-lg max-w-2xl leading-relaxed">
              Curate your digital identity and fine-tune your language learning trajectory with precision.
            </p>
          </div>

          <ProfileSection
            user={user}
            uploading={uploading}
            initials={initials}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveProfilePicture}
            onEditClick={() => setIsEditOpen(true)}
          />

          <LanguagesSection
            user={user}
            onOpenLanguageModal={() => setIsLanguageOpen(true)}
          />

          <GoalsSection
            goals={goals}
            onOpenAddGoal={() => setIsAddGoalOpen(true)}
            setGoals={setGoals}
          />

          <AchievementSection user={user} goals={goals} />

        </main>
      </PageBackground>

      <Footer />

      {isEditOpen && (
        <EditProfileModal
          onClose={() => setIsEditOpen(false)}
          onProfileUpdate={(updatedUser: any) => {
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }}
        />
      )}

      <AddGoalController
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        goals={goals}
        setGoals={setGoals}
      />

      <LanguageModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
      />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-2xl bg-[#1a9e6b] text-white shadow-[0_10px_30px_rgba(26,158,107,0.3)] hover:bg-[#14c781] hover:scale-110 active:scale-95 transition-all duration-500 z-50 group ${
          showScrollTop ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible'
        }`}
        aria-label="Scroll to top"
      >
        <span className="flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
          <FaArrowUp size={20} />
        </span>
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d2d2a] text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Back to Top
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-[#0d2d2a]"></span>
        </span>
      </button>
    </div>
  );
};

export default Account;