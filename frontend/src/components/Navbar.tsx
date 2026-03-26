import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn: propIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userInitials, setUserInitials] = useState("U");

  const syncFromStorage = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token || propIsLoggedIn || false);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const fullName = parsedUser.fullName || "";
      const firstName = fullName.split(".").pop()?.trim().split(" ")[0] || "User";
      const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

      setUserName(firstName);
      setUserAvatar((parsedUser.profilePicture && parsedUser.profilePicture.trim() !== "") ? parsedUser.profilePicture : "");
      setUserInitials(initials);
    }
  };

  useEffect(() => {
    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, [propIsLoggedIn]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Changed breakpoint from md (768px) to lg (1024px) so the hamburger menu
  // is used on tablets too, preventing the cramped navbar issue
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-all duration-200 py-2 px-4 block no-underline rounded-lg
     hover:bg-green-100 hover:scale-105 hover:shadow-md
     ${isActive ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`;

  return (
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white/60 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl transition-all max-w-7xl mx-auto">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Logo — always fully visible */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center gap-3 no-underline"
                onClick={closeMobileMenu}
              >
                <img
                  src={logo}
                  alt="Orato Logo"
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl shadow-md object-cover flex-shrink-0"
                />
                {/* Always show brand name — never hidden */}
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 whitespace-nowrap">
                  Orato
                </span>
              </Link>
            </div>

            {/* Desktop Navigation — only shown on lg+ (1024px+) */}
            <ul className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
              <li>
                <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>
                  Progress
                </NavLink>
              </li>
              <li>
                <NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
                  About Us
                </NavLink>
              </li>
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Login / Avatar — shown on lg+ only alongside desktop nav */}
              {isLoggedIn ? (
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 no-underline
                     hover:bg-green-100 hover:scale-105 hover:shadow-md
                     ${isActive ? "text-green-600 font-semibold bg-green-50" : "text-gray-700"}`
                  }
                  onClick={closeMobileMenu}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-green-500 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-green-500 flex-shrink-0">
                      {userInitials}
                    </div>
                  )}
                  <span className="font-semibold hidden lg:inline whitespace-nowrap">
                    {userName}
                  </span>
                </NavLink>
              ) : (
                <Link
                  to="/signin"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm lg:text-base transition shadow-md hover:shadow-lg no-underline hidden lg:block whitespace-nowrap"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}

              {/* Hamburger — shown below lg (i.e. mobile + tablet) */}
              <div
                className="lg:hidden flex flex-col gap-1.5 cursor-pointer z-50 p-1"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Menu — shown below lg */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-green-100 flex flex-col gap-2 p-6 bg-white/95 backdrop-blur-md rounded-b-2xl animate-fade-in-down">
            <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>
              Progress
            </NavLink>
            <NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>
              Settings
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
              About Us
            </NavLink>

            {/* Avatar or Login in mobile/tablet menu */}
            {isLoggedIn ? (
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-200 no-underline mt-2
                   hover:bg-green-100
                   ${isActive ? "text-green-600 font-semibold bg-green-50" : "text-gray-700"}`
                }
                onClick={closeMobileMenu}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-green-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-green-500">
                    {userInitials}
                  </div>
                )}
                <span className="font-semibold">{userName}</span>
              </NavLink>
            ) : (
              <Link
                to="/signin"
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-base transition shadow-md text-center no-underline"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;