// src/contexts/AuthContexts.jsx

import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Importe o cliente do supabase
import LoadingScreen from '../components/LoadingScreen.jsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Mantemos para o efeito de loading
  const navigate = useNavigate();

  // useEffect para ouvir o estado da autenticação REAL do Supabase
  useEffect(() => {
    // Pega a sessão do usuário (se ele já estiver logado)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Ouve mudanças no estado de autenticação (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Limpa o listener quando o componente desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- NOVAS FUNÇÕES DE LOGIN, CADASTRO E LOGOUT ---

  const login = async (email, password) => {
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoggingIn(false);
      // Lança o erro para a página de login poder mostrar
      throw new Error(error.message);
    }

    // A navegação agora acontece automaticamente por causa do onAuthStateChange
    // Mas podemos adicionar um delay para a tela de loading
    setTimeout(() => {
      navigate('/');
      setIsLoggingIn(false);
    }, 1500);
  };

  const register = async (name, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // Podemos guardar o nome do usuário nos metadados
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    // O currentUser agora vem diretamente do Supabase
    currentUser,
    loading,
    isLoggingIn,
    login,
    register,
    logout,
  };

  // Se estiver carregando, mostra a tela de carregamento
  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  // Não renderiza nada enquanto o estado inicial de auth é verificado
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};