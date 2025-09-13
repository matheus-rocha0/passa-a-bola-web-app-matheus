import React, { useState } from 'react';
import { Trophy, Mail, Lock, User } from 'lucide-react';

const RegisterPage = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find((u) => u.email === email)) {
      setError('Este e-mail já está em uso.');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setSuccess('Cadastro realizado com sucesso! Você já pode fazer o login.');
    setTimeout(() => onNavigate('login'), 2000);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Trophy size={48} className="mx-auto text-[#b554b5]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Crie sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#b554b5] focus:border-[#b554b5] sm:text-sm"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#b554b5] focus:border-[#b554b5] sm:text-sm"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#b554b5] focus:border-[#b554b5] sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#b554b5] hover:bg-[#d44b84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b554b5]"
            >
              Cadastrar
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="font-medium text-[#b554b5] hover:text-[#d44b84]"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
