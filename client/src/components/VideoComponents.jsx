import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "./UI";

export function VideoPreview({
  stream,
  isMuted = false,
  onToggleAudio,
  onToggleVideo,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
        <div className="w-full p-4 flex gap-2">
          <Button
            size="sm"
            variant={isMuted ? "danger" : "secondary"}
            onClick={onToggleAudio}
            className="bg-gray-900/70 hover:bg-gray-800 text-white"
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onToggleVideo}
            className="bg-gray-900/70 hover:bg-gray-800 text-white"
          >
            {/* stream?.getVideoTracks()[0]?.enabled ? <Video size={18} /> : <VideoOff size={18} /> */}
            <Video size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ParticipantVideo({ participant, stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {participant.name?.charAt(0)}
            </span>
          </div>
          <span className="text-xs text-white font-medium">
            {participant.name}
          </span>
          {participant.isHost && (
            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
              Host
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScreenShare({ stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
}
