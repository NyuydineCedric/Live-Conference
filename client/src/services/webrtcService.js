let localStream = null;
const peerConnections = new Map();
let onRemoteStreamCallback = null;

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'turn:turn.anyfirewall.com:443?transport=tcp', username: 'webrtc', credential: 'webrtc' },
    { urls: 'turn:turn.anyfirewall.com:443?transport=udp', username: 'webrtc', credential: 'webrtc' }
  ],
  iceCandidatePoolSize: 10
};

export const webrtcService = {
  onRemoteStream(callback) {
    onRemoteStreamCallback = callback;
  },

  async getLocalStream() {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("✅ Local camera ready");
      return localStream;
    } catch (error) {
      console.warn("⚠️ Cannot access camera – receive‑only mode");
      localStream = null;
      return null;
    }
  },

  getLocalStreamInstance() {
    return localStream;
  },

  createPeerConnection(peerId, socket, meetingId) {
    if (peerConnections.has(peerId)) return peerConnections.get(peerId);

    console.log("Creating peer connection for:", peerId);
    const pc = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
        console.log("  Added local track:", track.kind);
      });
    } else {
      console.log("  Receive‑only mode (no local stream)");
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log("📡 Sending ICE candidate to:", peerId);
        socket.emit('ice-candidate', { to: peerId, candidate: event.candidate, meetingId });
      }
    };

    pc.ontrack = (event) => {
      console.log("📹 Received remote stream from:", peerId);
      if (onRemoteStreamCallback) onRemoteStreamCallback(peerId, event.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE state with ${peerId}: ${pc.iceConnectionState}`);
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection with ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') console.log(`✅ Connected to ${peerId}`);
    };

    peerConnections.set(peerId, pc);
    return pc;
  },

  getPeerConnection(peerId) {
    return peerConnections.get(peerId);
  },

  async createOffer(peerId) {
    const pc = peerConnections.get(peerId);
    if (!pc) return null;
    if (pc.signalingState !== 'stable') {
      console.log(`Cannot create offer, state=${pc.signalingState}`);
      return null;
    }
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    console.log("✅ Offer created for", peerId);
    return offer;
  },

  async handleOffer(peerId, offer) {
    const pc = peerConnections.get(peerId);
    if (!pc) return null;
    if (pc.signalingState !== 'stable') {
      console.log(`Cannot handle offer, state=${pc.signalingState}`);
      return null;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("✅ Answer created for", peerId);
    return answer;
  },

  async handleAnswer(peerId, answer) {
    const pc = peerConnections.get(peerId);
    if (!pc) return;
    if (pc.signalingState !== 'have-local-offer') {
      console.log(`Cannot handle answer, state=${pc.signalingState}`);
      return;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("✅ Answer set for", peerId);
  },

  async addIceCandidate(peerId, candidate) {
    const pc = peerConnections.get(peerId);
    if (!pc) return;
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("ICE candidate error:", err);
    }
  },

  toggleAudio(enabled) {
    if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = enabled);
  },

  toggleVideo(enabled) {
    if (localStream) localStream.getVideoTracks().forEach(t => t.enabled = enabled);
  },

  closePeerConnection(peerId) {
    const pc = peerConnections.get(peerId);
    if (pc) {
      pc.close();
      peerConnections.delete(peerId);
    }
  },

  closeAllConnections() {
    peerConnections.forEach(pc => pc.close());
    peerConnections.clear();
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream = null;
    }
  }
};