// Caminho: src/pages/HubPage.jsx

import React from "react";
import { Trophy, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AgendaCalendario from '../components/AgendaCalendario';
import ProximoJogoCard from '../components/ProximoJogoCard'; // <-- 1. IMPORT FALTANDO ADICIONADO AQUI

const HubPage = () => {
  const { currentUser } = useAuth();

  const stats = [
    { icon: <Trophy size={24} className="text-[#b554b5]" />, value: '12', label: 'Gols' },
    { icon: <ShieldCheck size={24} className="text-[#b554b5]" />, value: '8', label: 'Assistências' },
    { icon: <Calendar size={24} className="text-[#b554b5]" />, value: '25', label: 'Jogos' },
  ];

  const currentChampionships = [
    { name: 'Copa Sulsanca', progress: 75 },
    { name: 'Liga da Zona Leste', progress: 40 },
  ];

  if (!currentUser) {
    return <div className="p-8 bg-gray-900 text-white min-h-screen">Carregando dados da atleta...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-900 text-gray-200 min-h-screen">
      {/* 2. ADICIONADO O CONTAINER DE LAYOUT AO HEADER */}
      <header className="mb-6 max-w-6xl mx-auto">
        <p className="text-md text-gray-400">Bem-vinda de volta,</p>
        <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
      </header>

      {/* 2. ADICIONADO O CONTAINER DE LAYOUT PRINCIPAL */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-3 space-y-6">
            
            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">
                Calendário de Jogos
              </h2>
              <AgendaCalendario />
            </div>

            {/* 3. ORGANIZADO O CARD DENTRO DE UMA DIV COM TÍTULO */}
            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">
                Próximo Jogo
              </h2>
              <ProximoJogoCard />
            </div>

            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">Meus Campeonatos</h2>
              <div className="space-y-4">
                {currentChampionships.map((champ) => (
                  <div key={champ.name} className="bg-gray-800 p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-white">{champ.name}</p>
                      <p className="text-sm text-gray-400">{champ.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-[#b554b5] h-2.5 rounded-full"
                        style={{ width: `${champ.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">Estatísticas</h2>
              <div className="grid grid-cols-1 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
                    {stat.icon}
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HubPage;