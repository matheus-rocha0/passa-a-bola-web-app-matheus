// src/pages/FintaPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VideoPost from '../components/VideoPost';
import UploadModal from '../components/UploadModal'; // Importe o modal
import { Plus } from 'lucide-react';

const FintaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false); // Estado para o modal

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      // Busca os vídeos da tabela 'videos', em ordem do mais novo para o mais antigo
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vídeos:', error);
      } else {
        // Renomeia as chaves para bater com o que o VideoPost espera
        const formattedData = data.map(video => ({
          id: video.id,
          user: {
            name: video.user_name,
            avatar: video.user_avatar_url,
          },
          videoUrl: video.video_url,
          caption: video.caption,
          likes: video.likes,
          comments: video.comments,
        }));
        setVideos(formattedData);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="h-full w-full bg-black flex justify-center items-center text-white">Carregando FINTA...</div>;
  }

  return (
    <div className="h-full w-full bg-black flex justify-center relative">
      {/* Botão para abrir o modal de upload */}
      <button
        onClick={() => setUploadModalOpen(true)}
        className="absolute top-4 right-4 z-10 bg-[#b554b5] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        aria-label="Postar vídeo"
      >
        <Plus size={28} />
      </button>

      <div className="h-full w-full md:max-w-md bg-neutral-900 overflow-y-auto snap-y snap-mandatory">
        {videos.map((video) => (
          <VideoPost key={video.id} videoData={video} />
        ))}
      </div>

      {/* Renderiza o modal se o estado for verdadeiro */}
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
};

export default FintaPage;