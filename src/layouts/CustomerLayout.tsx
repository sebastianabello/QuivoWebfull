import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import logo from "../assets/logo.svg";
import { MdLanguage } from "react-icons/md";
import { useKeycloak } from "@react-keycloak/web";

interface Props {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

export default function CustomerLayout({ children, headerContent }: Props) {
  const { t, i18n } = useTranslation();
  const { keycloak } = useKeycloak();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  const isAuthenticated = keycloak?.authenticated;
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.includes("adminn");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !(langRef.current as any).contains(e.target)) {
        setShowLangMenu(false);
      }
      if (userRef.current && !(userRef.current as any).contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => keycloak?.login();
  const handleLogout = () => keycloak?.logout({ redirectUri: window.location.origin });

  return (
    <div className="font-opensans min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white shadow w-full h-20 px-4 md:px-10 xl:px-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Quivo" className="h-8" />
          <span className="text-teal-700 text-xl font-bold">Quivo</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 transform -translate-y-1/2 top-1/2 hidden md:block">
          <AnimatePresence mode="wait">{headerContent}</AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-gray-700 hover:text-teal-600"
              title={t("language")}
            >
              <MdLanguage className="text-xl" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md text-sm z-50">
                <button onClick={() => changeLanguage("es")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Español
                </button>
                <button onClick={() => changeLanguage("en")} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  English
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="min-w-[100px] px-4 py-1 rounded bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition text-ellipsis overflow-hidden"
            >
              {isAuthenticated ? keycloak?.tokenParsed?.preferred_username : t("login")}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md text-sm z-50">
                {!isAuthenticated ? (
                  <button onClick={handleLogin} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    {t("login")}
                  </button>
                ) : (
                  <>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      {t("logout")}
                    </button>
                    <Link to="/bookings" className="block px-4 py-2 hover:bg-gray-100">
                      {t("bookings")}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin/rooms" className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Panel Admin
                      </Link>
                    )}
                  </>
                )}
                <hr className="my-1 border-t border-gray-300" />
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t("host_experience")}
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t("help_center")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-10 xl:px-20 py-8 w-full max-w-screen-2xl mx-auto">
        {children}
      </main>

      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4 px-4 md:px-10 xl:px-20">
        © {new Date().getFullYear()} Quivo. Todos los derechos reservados.
      </footer>
    </div>
  );
}
