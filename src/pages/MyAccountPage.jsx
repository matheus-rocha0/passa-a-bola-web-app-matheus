// src/pages/MyAccountPage.jsx

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Trash2, VideoOff } from 'lucide-react';

const MyAccountPage = () => {
  const { currentUser } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!currentUser) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar vídeos:', error);
      } else {
        setMyVideos(data);
      }
      setLoading(false);
    };

    fetchMyVideos();
  }, [currentUser]);

  const handleDeleteVideo = async (video) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const fileName = video.video_url.split('/').pop();
      const { error: storageError } = await supabase.storage
        .from('videos-finta')
        .remove([fileName]);
      
      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (dbError) throw dbError;

      setMyVideos(myVideos.filter(v => v.id !== video.id));
      alert('Vídeo excluído com sucesso!');

    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      alert('Ocorreu um erro ao excluir o vídeo.');
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Carregando seus vídeos...</div>;
  }

  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email;

  return (
    <div className="p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Minha Conta</h1>
        <p className="text-md text-gray-600 dark:text-gray-400">Gerencie seus vídeos, {displayName}</p>
      </header>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Meus Vídeos Postados</h2>
        {myVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myVideos.map(video => (
              <div key={video.id} className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video src={video.video_url} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-end">
                  <p className="text-white text-sm font-semibold truncate">{video.caption}</p>
                </div>
                {/* --- A MUDANÇA ESTÁ NA LINHA ABAIXO --- */}
                <button 
                  onClick={() => handleDeleteVideo(video)}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Excluir vídeo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <VideoOff size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Você ainda não postou nenhum vídeo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;