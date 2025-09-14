import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';

const VideoPost = ({ videoData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(videoData.likes);
  const videoRef = useRef(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current
            ?.play()
            .catch((error) => console.log('Video play failed:', error));
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 },
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full snap-start flex-shrink-0 bg-black">
      <video
        ref={videoRef}
        src={videoData.videoUrl}
        loop
        playsInline
        muted // Autoplay geralmente requer que o vídeo esteja sem som
        className="h-full w-full object-cover"
      ></video>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center mb-2">
          <img
            src={videoData.user.avatar}
            alt={videoData.user.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <p className="ml-3 font-semibold">{videoData.user.name}</p>
        </div>
        <p className="text-sm">{videoData.caption}</p>
      </div>
      <div className="absolute right-2 bottom-24 flex flex-col items-center space-y-4 text-white">
        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart
            size={32}
            className={`transition-all ${
              isLiked ? 'text-[#b554b5] fill-[#b554b5]' : 'text-white'
            }`}
          />
          <span className="text-xs font-semibold">{likes}</span>
        </button>
        <button className="flex flex-col items-center">
          <MessageCircle size={32} />
          <span className="text-xs font-semibold">{videoData.comments}</span>
        </button>
        <button className="flex flex-col items-center">
          <Send size={32} />
        </button>
      </div>
    </div>
  );
};

export default VideoPost;
