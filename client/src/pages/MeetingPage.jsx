import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Send,
  Users,
  MessageSquare,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { webrtcService } from "../services/webrtcService";
import { meetingsService } from "../services/meetingsService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const S = {
  mainCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
    background: "#eef1fb",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  topbar: {
    background: "#fff",
    borderBottom: "1px solid #eee",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    gap: 12,
  },
  meetingTitle: { fontSize: 15, fontWeight: 600, color: "#111", margin: 0 },
  meetingDate: { fontSize: 12, color: "#888", margin: "2px 0 0" },
  copyBtn: {
    background: "#4f6ef7",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    color: "white",
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },
  videoCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 16,
    gap: 12,
    minWidth: 0,
    overflow: "hidden",
  },
  videoGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
    overflowY: "auto",
    padding: 4,
    minHeight: 0,
  },
  videoCard: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    background: "#16213e",
    aspectRatio: "16/9",
  },
  videoElement: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fallbackAvatar: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  fallbackInitials: {
    fontSize: 48,
    fontWeight: 600,
    color: "#fff",
    marginBottom: 8,
  },
  fallbackText: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  videoLabel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  micIndicator: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsBar: {
    background: "#fff",
    borderRadius: 50,
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexShrink: 0,
    alignSelf: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  ctrlBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f5f9",
    color: "#555",
  },
  ctrlBtnActive: { background: "#e94560", color: "#fff" },
  endCallBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: "#dc3545",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rightPanel: {
    width: 300,
    background: "#fff",
    borderLeft: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflow: "hidden",
  },
  panelTabs: { display: "flex", borderBottom: "1px solid #eee", flexShrink: 0 },
  panelTab: {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    color: "#999",
    borderBottom: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  panelTabActive: { color: "#4f6ef7", borderBottom: "2px solid #4f6ef7" },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  msgRow: { display: "flex", gap: 8, alignItems: "flex-start" },
  msgBody: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: "calc(100% - 40px)",
  },
  msgSender: { fontSize: 10, fontWeight: 600, color: "#aaa" },
  msgBubble: {
    padding: "8px 12px",
    fontSize: 12,
    color: "#222",
    lineHeight: 1.5,
    borderRadius: 12,
  },
  chatInputRow: {
    borderTop: "1px solid #eee",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  chatInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 13,
    background: "#f4f5f8",
    color: "#222",
    padding: "10px 14px",
    borderRadius: 20,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#4f6ef7",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  participantsList: { flex: 1, overflowY: "auto", padding: "12px" },
  participantItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 4,
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#4f6ef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14,
    color: "#fff",
    flexShrink: 0,
  },
  participantInfo: { flex: 1 },
  participantName: { fontSize: 13, fontWeight: 500, color: "#222", margin: 0 },
  participantStatus: { fontSize: 11, color: "#888", margin: 0 },
  loadingScreen: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef1fb",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #eee",
    borderTop: "3px solid #4f6ef7",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// ======================== NEW COMPONENT ========================
// Shows profile image if available, otherwise fallback to gradient + initials
function ParticipantAvatar({ participant }) {
  const [imgError, setImgError] = useState(false);
  const profileImage = participant.profileImage;
  const name = participant.name;
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  if (profileImage && !imgError) {
    return (
      <img
        src={profileImage}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <div style={S.fallbackAvatar}>
      <div style={S.fallbackInitials}>{initials}</div>
      <div style={S.fallbackText}>{name}</div>
    </div>
  );
}
// ================================================================

export default function MeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { socket, emit, on, off, connected } = useSocket();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [comments, setComments] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [copied, setCopied] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [mySocketId, setMySocketId] = useState(null);
  const hasJoinedRef = useRef(false);
  const pendingCandidates = useRef(new Map());

  const localVideoRef = useRef(null);

  const copyMeetingLink = async () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper: queue ICE candidates until remote description is set
  const addIceCandidateQueued = useCallback(async (peerId, candidate) => {
    const pc = webrtcService.getPeerConnection(peerId);
    if (!pc) return;
    if (pc.remoteDescription) {
      await webrtcService.addIceCandidate(peerId, candidate);
    } else {
      if (!pendingCandidates.current.has(peerId))
        pendingCandidates.current.set(peerId, []);
      pendingCandidates.current.get(peerId).push(candidate);
    }
  }, []);

  const processQueuedCandidates = useCallback(async (peerId) => {
    const candidates = pendingCandidates.current.get(peerId);
    if (candidates?.length) {
      for (const candidate of candidates)
        await webrtcService.addIceCandidate(peerId, candidate);
      pendingCandidates.current.delete(peerId);
    }
  }, []);

  // Remote stream callback
  useEffect(() => {
    webrtcService.onRemoteStream((peerId, stream) => {
      console.log("📹 Remote stream from", peerId);
      setRemoteStreams((prev) => ({ ...prev, [peerId]: stream }));
    });
  }, []);

  // WebRTC signaling handlers (unchanged)
  const handleOffer = useCallback(
    async ({ from, offer }) => {
      console.log("📞 Offer from", from);
      let pc = webrtcService.getPeerConnection(from);
      if (!pc) pc = webrtcService.createPeerConnection(from, socket, meetingId);
      if (pc.signalingState !== "stable") {
        console.log(`Ignoring offer, state=${pc.signalingState}`);
        return;
      }
      const answer = await webrtcService.handleOffer(from, offer);
      if (answer) emit("answer", { to: from, answer, meetingId });
      await processQueuedCandidates(from);
    },
    [socket, meetingId, emit, processQueuedCandidates],
  );

  const handleAnswer = useCallback(
    async ({ from, answer }) => {
      console.log("📞 Answer from", from);
      await webrtcService.handleAnswer(from, answer);
      await processQueuedCandidates(from);
    },
    [processQueuedCandidates],
  );

  const handleIceCandidate = useCallback(
    async ({ from, candidate }) => {
      await addIceCandidateQueued(from, candidate);
    },
    [addIceCandidateQueued],
  );

  // Participant management with profile image
  const handleParticipantJoined = useCallback(
    async ({ participantId, userName, profileImage }) => {
      if (participantId === socket?.id) return;
      console.log("👤 Participant joined:", userName);
      setParticipants((prev) => {
        if (prev.some((p) => p.id === participantId)) return prev;
        return [
          ...prev,
          { id: participantId, name: userName, isMuted: false, profileImage },
        ];
      });
      let pc = webrtcService.getPeerConnection(participantId);
      if (!pc)
        pc = webrtcService.createPeerConnection(
          participantId,
          socket,
          meetingId,
        );
      if (
        mySocketId &&
        mySocketId < participantId &&
        pc.signalingState === "stable"
      ) {
        const offer = await webrtcService.createOffer(participantId);
        if (offer) emit("offer", { to: participantId, offer, meetingId });
      }
    },
    [socket, meetingId, emit, mySocketId],
  );

  const handleParticipantLeft = useCallback(({ participantId }) => {
    console.log("👋 Participant left:", participantId);
    webrtcService.closePeerConnection(participantId);
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    setRemoteStreams((prev) => {
      const { [participantId]: _, ...rest } = prev;
      return rest;
    });
    pendingCandidates.current.delete(participantId);
  }, []);

  const handleParticipantsList = useCallback(
    async ({ participants: existingParticipants }) => {
      const others = existingParticipants.filter(
        (p) => p.socketId !== socket?.id,
      );
      const unique = Array.from(
        new Map(others.map((p) => [p.socketId, p])).values(),
      );
      setParticipants(
        unique.map((p) => ({
          id: p.socketId,
          name: p.userName,
          isMuted: false,
          profileImage: p.profileImage,
        })),
      );
      for (const p of unique) {
        let pc = webrtcService.getPeerConnection(p.socketId);
        if (!pc)
          pc = webrtcService.createPeerConnection(
            p.socketId,
            socket,
            meetingId,
          );
        if (
          mySocketId &&
          mySocketId < p.socketId &&
          pc.signalingState === "stable"
        ) {
          const offer = await webrtcService.createOffer(p.socketId);
          if (offer) emit("offer", { to: p.socketId, offer, meetingId });
        }
      }
    },
    [socket, meetingId, emit, mySocketId],
  );

  const handleCommentAdded = useCallback((data) => {
    setComments((prev) => [...prev, data]);
  }, []);

  const handleParticipantMuted = useCallback(({ participantId, isMuted }) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, isMuted } : p)),
    );
  }, []);

  // Initialize meeting and camera
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token || !isAuthenticated) {
          localStorage.setItem("redirectAfterLogin", `/meeting/${meetingId}`);
          navigate("/login");
          return;
        }
        const meetingData = await meetingsService.getMeetingById(meetingId);
        if (mounted) setMeeting(meetingData);
        await meetingsService.joinMeeting(meetingId);
        try {
          const stream = await webrtcService.getLocalStream();
          if (mounted && stream) {
            setLocalStream(stream);
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          }
        } catch (e) {
          console.warn("Camera error:", e);
        }
        const commentsData = await meetingsService.getComments(meetingId);
        if (mounted && commentsData.comments)
          setComments(commentsData.comments);
        if (mounted) setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [meetingId, isAuthenticated, navigate]);

  // Socket connection – include profile image when joining
  useEffect(() => {
    if (loading || !socket || !connected || hasJoinedRef.current) return;
    hasJoinedRef.current = true;
    setMySocketId(socket.id);
    emit("join-meeting", {
      meetingId,
      userId: user?.id,
      userName: user?.fullName,
      profileImage: user?.profileImage, // <-- send profile image
    });
    on("offer", handleOffer);
    on("answer", handleAnswer);
    on("ice-candidate", handleIceCandidate);
    on("participant-joined", handleParticipantJoined);
    on("participant-left", handleParticipantLeft);
    on("participants-list", handleParticipantsList);
    on("comment-added", handleCommentAdded);
    on("participant-muted", handleParticipantMuted);
    return () => {
      off("offer", handleOffer);
      off("answer", handleAnswer);
      off("ice-candidate", handleIceCandidate);
      off("participant-joined", handleParticipantJoined);
      off("participant-left", handleParticipantLeft);
      off("participants-list", handleParticipantsList);
      off("comment-added", handleCommentAdded);
      off("participant-muted", handleParticipantMuted);
      hasJoinedRef.current = false;
    };
  }, [
    loading,
    socket,
    connected,
    meetingId,
    user,
    emit,
    on,
    off,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    handleParticipantJoined,
    handleParticipantLeft,
    handleParticipantsList,
    handleCommentAdded,
    handleParticipantMuted,
  ]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    const newComment = {
      id: Date.now(),
      author: user?.fullName,
      text: messageInput.trim(),
    };
    setComments((prev) => [...prev, newComment]);
    setMessageInput("");
    await meetingsService.addComment(meetingId, messageInput.trim());
    emit("comment-added", { meetingId, comment: newComment });
  };

  const handleEndCall = async () => {
    await meetingsService.leaveMeeting(meetingId);
    emit("leave-meeting", { meetingId, userId: user?.id });
    webrtcService.closeAllConnections();
    navigate("/dashboard");
  };

  const handleToggleAudio = () => {
    const newMuted = !isMuted;
    if (localStream) {
      localStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !newMuted));
    }
    setIsMuted(newMuted);
    emit("participant-muted", {
      meetingId,
      participantId: socket?.id,
      isMuted: newMuted,
    });
  };

  const handleToggleVideo = () => {
    const newVideoOn = !isVideoOn;
    if (localStream) {
      localStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = newVideoOn));
    }
    setIsVideoOn(newVideoOn);
  };

  // Build participant list including profile images
  const allParticipants = [
    {
      id: "local",
      name: user?.fullName,
      isLocal: true,
      isMuted,
      stream: isVideoOn ? localStream : null,
      profileImage: user?.profileImage,
    },
    ...participants.map((p) => ({
      ...p,
      isLocal: false,
      stream: remoteStreams[p.id],
    })),
  ];

  if (loading) {
    return (
      <div style={S.loadingScreen}>
        <div style={S.spinner} />
        <p>Starting meeting…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div style={S.loadingScreen}>
        <p style={{ color: "red", marginBottom: 16 }}>{error}</p>
        <button onClick={() => navigate("/dashboard")} style={S.copyBtn}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div
      style={S.mainCol}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <header style={S.topbar}>
        <div>
          <h1 style={S.meetingTitle}>{meeting?.title || "Video Meeting"}</h1>
          <p style={S.meetingDate}>{new Date().toLocaleDateString()}</p>
        </div>
        <button onClick={copyMeetingLink} style={S.copyBtn}>
          {copied ? <Check size={14} /> : <LinkIcon size={14} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </header>
      <div style={S.body}>
        <div style={S.videoCol}>
          <div style={S.videoGrid}>
            {allParticipants.map((p) => {
              const hasVideo =
                p.stream &&
                p.stream.active &&
                p.stream
                  .getVideoTracks?.()
                  .some((t) => t.readyState === "live");
              return (
                <div key={p.id} style={S.videoCard}>
                  {hasVideo ? (
                    <video
                      autoPlay
                      muted={p.isLocal}
                      playsInline
                      style={S.videoElement}
                      ref={(el) => {
                        if (el && p.stream) el.srcObject = p.stream;
                      }}
                    />
                  ) : (
                    <ParticipantAvatar participant={p} />
                  )}
                  <div style={S.videoLabel}>
                    <span
                      style={{
                        ...S.micIndicator,
                        background: p.isMuted ? "#e24b4a" : "#1D9E75",
                      }}
                    >
                      {p.isMuted ? (
                        <MicOff size={10} color="#fff" />
                      ) : (
                        <Mic size={10} color="#fff" />
                      )}
                    </span>
                    {p.name}
                    {p.isLocal && " (You)"}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={S.controlsBar}>
            <button
              onClick={handleToggleAudio}
              style={{ ...S.ctrlBtn, ...(isMuted ? S.ctrlBtnActive : {}) }}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={handleToggleVideo}
              style={{ ...S.ctrlBtn, ...(!isVideoOn ? S.ctrlBtnActive : {}) }}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button
              onClick={() =>
                setActiveTab(activeTab === "chat" ? "participants" : "chat")
              }
              style={S.ctrlBtn}
            >
              {activeTab === "chat" ? (
                <Users size={20} />
              ) : (
                <MessageSquare size={20} />
              )}
            </button>
            <button onClick={handleEndCall} style={S.endCallBtn}>
              <PhoneOff size={20} color="#fff" />
            </button>
          </div>
        </div>
        <div style={S.rightPanel}>
          <div style={S.panelTabs}>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                ...S.panelTab,
                ...(activeTab === "chat" ? S.panelTabActive : {}),
              }}
            >
              <MessageSquare size={14} /> Room Chat
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              style={{
                ...S.panelTab,
                ...(activeTab === "participants" ? S.panelTabActive : {}),
              }}
            >
              <Users size={14} /> Participants ({participants.length + 1})
            </button>
          </div>
          {activeTab === "chat" ? (
            <>
              <div style={S.messages}>
                {comments.map((c, i) => (
                  <div
                    key={c.id || i}
                    style={{
                      ...S.msgRow,
                      justifyContent:
                        c.author === user?.fullName ? "flex-end" : "flex-start",
                    }}
                  >
                    {c.author !== user?.fullName && (
                      <div style={S.participantAvatar}>
                        {c.author?.charAt(0)}
                      </div>
                    )}
                    <div style={S.msgBody}>
                      <span style={S.msgSender}>{c.author}</span>
                      <div
                        style={{
                          ...S.msgBubble,
                          background:
                            c.author === user?.fullName ? "#eef1ff" : "#f4f5f8",
                        }}
                      >
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={S.chatInputRow}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  style={S.chatInput}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage} style={S.sendBtn}>
                  <Send size={15} color="#fff" />
                </button>
              </div>
            </>
          ) : (
            <div style={S.participantsList}>
              <div style={S.participantItem}>
                <div style={S.participantAvatar}>
                  {user?.fullName?.charAt(0)}
                </div>
                <div style={S.participantInfo}>
                  <p style={S.participantName}>{user?.fullName} (You)</p>
                  <p style={S.participantStatus}>
                    {isMuted ? "Muted" : "Speaking"}
                  </p>
                </div>
                {isMuted ? (
                  <MicOff size={16} color="#e24b4a" />
                ) : (
                  <Mic size={16} color="#1D9E75" />
                )}
              </div>
              {participants.map((p) => (
                <div key={p.id} style={S.participantItem}>
                  <div style={S.participantAvatar}>{p.name?.charAt(0)}</div>
                  <div style={S.participantInfo}>
                    <p style={S.participantName}>{p.name}</p>
                    <p style={S.participantStatus}>
                      {p.isMuted ? "Muted" : "Speaking"}
                    </p>
                  </div>
                  <Mic size={16} color="#1D9E75" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
