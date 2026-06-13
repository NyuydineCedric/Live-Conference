import React from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  PhoneOff,
} from "lucide-react";
import { Button } from "./UI";

export function MeetingControls({
  isMuted,
  isVideoOn,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 flex gap-4 justify-center flex-wrap border border-gray-200 shadow-sm"
    >
      <Button
        variant={isMuted ? "danger" : "secondary"}
        size="md"
        onClick={onToggleAudio}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        {isMuted ? "Unmute" : "Mute"}
      </Button>

      <Button
        variant={!isVideoOn ? "danger" : "secondary"}
        size="md"
        onClick={onToggleVideo}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white"
      >
        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        {isVideoOn ? "Stop Video" : "Start Video"}
      </Button>

      <Button
        variant={isScreenSharing ? "primary" : "ghost"}
        size="md"
        onClick={onToggleScreenShare}
        className="flex items-center gap-2"
      >
        {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      </Button>

      <Button
        variant="danger"
        size="md"
        onClick={onEndCall}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
      >
        <PhoneOff size={20} />
        End Call
      </Button>
    </motion.div>
  );
}

export function ParticipantsList({ participants, onMuteParticipant }) {
  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">
        Participants ({participants.length})
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {participant.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {participant.name}
                </p>
                {participant.isHost && (
                  <span className="text-xs text-yellow-400">Host</span>
                )}
              </div>
            </div>
            {!participant.isHost && (
              <button
                onClick={() => onMuteParticipant(participant.id)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {participant.isMuted ? "🔇" : "🎤"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommentsPanel({ comments, onSendComment }) {
  const [newComment, setNewComment] = React.useState("");

  const handleSend = () => {
    if (newComment.trim()) {
      onSendComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="glass rounded-xl p-4 flex flex-col h-96">
      <h3 className="text-lg font-bold text-white mb-4">Comments</h3>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {comments.length === 0 ? (
          <p className="text-slate-400 text-center text-sm">No comments yet</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={idx} className="p-2 bg-slate-800/50 rounded text-sm">
              <p className="text-xs text-slate-400 mb-1">{comment.author}</p>
              <p className="text-white">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <Button size="sm" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
