import { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import logoPabOriginal from '../assets/img/logo-pab-original.png';

const MobileHeader = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) {
    return null;
  }

  // Lógica para lidar com nome de usuário ausente
  const displayName = currentUser.user_metadata?.full_name || currentUser.email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between pt-2 pb-2 pl-3 pr-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex items-center gap-2">
        <img
          src={logoPabOriginal}
          alt="Logo P.A.B"
          className="w-8 h-8 transition-all duration-300 dark:brightness-0 dark:invert"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          P.A.B
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img
            src={`https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`}
            alt={displayName}
            className="w-9 h-9 rounded-full"
          />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-30">
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              <p className="font-semibold">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <Link
              to="/minha-conta"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <User size={16} />
              <span>Minha Conta</span>
            </Link>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;