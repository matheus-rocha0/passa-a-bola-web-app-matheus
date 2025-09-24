// src/components/UploadModal.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { X, UploadCloud } from 'lucide-react';

const UploadModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !currentUser) {
      alert('Por favor, selecione um vídeo e esteja logado!');
      return;
    }

    setUploading(true);

    const fileName = `${currentUser.id}_${Date.now()}`;
    const { error: uploadError } = await supabase.storage
      .from('videos-finta')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      alert('Erro ao enviar o vídeo.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('videos-finta')
      .getPublicUrl(fileName);

    const displayName = currentUser.user_metadata?.full_name || currentUser.email;
    const initial = displayName.charAt(0).toUpperCase();

    const { error: dbError } = await supabase.from('videos').insert([
      {
        // --- A CORREÇÃO CRÍTICA ESTÁ AQUI ---
        user_id: currentUser.id, 
        // ------------------------------------
        user_name: displayName,
        user_avatar_url: `https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`,
        video_url: publicUrl,
        caption: caption,
        likes: 0,
        comments: 0,
      },
    ]);

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      alert('Erro ao salvar as informações do vídeo.');
    } else {
      alert('Vídeo postado com sucesso!');
      onClose();
      window.location.reload(); // Recarrega a página para atualizar as listas
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Postar Vídeo</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label htmlFor="video-upload" className="block text-sm font-medium mb-2">
              Selecione o vídeo
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#b554b5] file:text-white hover:file:bg-[#d44b84]"
              disabled={uploading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="caption" className="block text-sm font-medium mb-2">
              Legenda
            </label>
            <textarea
              id="caption"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b554b5]"
              placeholder="Escreva uma legenda..."
              disabled={uploading}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#b554b5] hover:bg-[#d44b84] font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={uploading || !file}
          >
            <UploadCloud size={20} />
            {uploading ? 'Enviando...' : 'Postar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;