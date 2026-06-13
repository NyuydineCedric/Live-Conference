import { createContext, useContext, useState, useCallback } from "react";

const MeetingContext = createContext();

export function MeetingProvider({ children }) {
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [comments, setComments] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

  const startMeeting = useCallback((meetingData) => {
    setMeeting(meetingData);
    setParticipants([]);
    setComments([]);
    setRemoteStreams({});
  }, []);

  const endMeeting = useCallback(() => {
    setMeeting(null);
    setParticipants([]);
    setComments([]);
    setRemoteStreams({});
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  }, [localStream]);

  const addParticipant = useCallback((participant) => {
    setParticipants((prev) => [...prev, participant]);
  }, []);

  const removeParticipant = useCallback((participantId) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  const addComment = useCallback((comment) => {
    setComments((prev) => [...prev, comment]);
  }, []);

  const addRemoteStream = useCallback((participantId, stream) => {
    setRemoteStreams((prev) => ({
      ...prev,
      [participantId]: stream,
    }));
  }, []);

  const removeRemoteStream = useCallback((participantId) => {
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[participantId];
      return next;
    });
  }, []);

  const value = {
    meeting,
    participants,
    comments,
    localStream,
    remoteStreams,
    startMeeting,
    endMeeting,
    addParticipant,
    removeParticipant,
    addComment,
    setLocalStream,
    addRemoteStream,
    removeRemoteStream,
  };

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeeting must be used within MeetingProvider");
  }
  return context;
}
