import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import { Button, Card, Loading, EmptyState, Modal } from "../components/UI";
import { meetingsService } from "../services/meetingsService";
import { formatDateTime, copyToClipboard } from "../utils/helpers";
import {
  Plus,
  Calendar,
  Settings as SettingsIcon,
  Link,
  Check,
  Video,
  Users,
  Clock,
  Calendar as CalendarIcon,
  ArrowRight,
  Search,
  Copy,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [copiedMeetingId, setCopiedMeetingId] = useState(null);
  const [joinLink, setJoinLink] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await meetingsService.getAllMeetings();
      console.log("Loaded meetings:", data);
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!meetingTitle.trim()) return;

    try {
      const newMeeting = await meetingsService.createMeeting({
        title: meetingTitle,
        description: meetingDescription,
      });

      console.log("Created meeting:", newMeeting);

      if (!newMeeting || !newMeeting.id) {
        console.error("No meeting ID in response:", newMeeting);
        alert("Failed to create meeting: No meeting ID returned");
        return;
      }

      setMeetings([newMeeting, ...meetings]);
      setShowCreateModal(false);
      setMeetingTitle("");
      setMeetingDescription("");

      // Navigate to the meeting
      navigate(`/meeting/${newMeeting.id}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
      alert("Failed to create meeting. Please try again.");
    }
  };

  const handleJoinMeeting = async (meetingId) => {
    try {
      await meetingsService.joinMeeting(meetingId);
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("Failed to join meeting. Please try again.");
    }
  };

  const handleJoinByLink = async () => {
    if (!joinLink.trim()) {
      setJoinError("Please enter a meeting link or ID");
      return;
    }

    setIsJoining(true);
    setJoinError("");

    try {
      // Extract meeting ID from full URL if pasted
      let meetingId = joinLink.trim();
      if (meetingId.includes("/meeting/")) {
        meetingId = meetingId.split("/meeting/")[1];
      }
      if (meetingId.includes("meeting/")) {
        meetingId = meetingId.split("meeting/")[1];
      }
      // Remove any query parameters or trailing slashes
      meetingId = meetingId.split("?")[0].split("/")[0];

      if (!meetingId) {
        setJoinError("Invalid meeting link format");
        setIsJoining(false);
        return;
      }

      console.log("Joining meeting with ID:", meetingId);

      // Try to join the meeting
      await meetingsService.joinMeeting(meetingId);

      // Navigate to the meeting
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error("Error joining by link:", error);
      if (error.response?.status === 404) {
        setJoinError("Meeting not found. Please check the link and try again.");
      } else {
        setJoinError(
          "Failed to join meeting. Please make sure you have permission to join.",
        );
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleCopyMeetingLink = async (meetingId) => {
    const meetingLink = `${window.location.origin}/meeting/${meetingId}`;
    const success = await copyToClipboard(meetingLink);

    if (success) {
      setCopiedMeetingId(meetingId);
      setTimeout(() => setCopiedMeetingId(null), 2000);
    } else {
      alert("Failed to copy link. Please copy manually: " + meetingLink);
    }
  };

  const upcomingMeetings = meetings.filter(
    (m) => new Date(m.scheduledAt) > new Date(),
  );
  const recentMeetings = meetings
    .filter((m) => new Date(m.scheduledAt) <= new Date())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-8 mb-8 border border-indigo-200"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mb-6">
            Ready to connect? Start or join a meeting.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus size={20} className="mr-2" /> Start Meeting
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowJoinModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Link size={20} className="mr-2" /> Join with Link
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/settings")}
              className="text-gray-600 hover:bg-gray-100"
            >
              <SettingsIcon size={20} className="mr-2" /> Settings
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Video size={24} className="text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Total Meetings</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {meetings.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users size={24} className="text-cyan-600" />
              <h3 className="font-semibold text-gray-900">Upcoming</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {upcomingMeetings.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={24} className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Past Meetings</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {recentMeetings.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {["all", "upcoming", "recent"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                selectedTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Meetings Grid */}
        {loading ? (
          <Loading message="Loading your meetings..." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedTab === "all"
              ? meetings
              : selectedTab === "upcoming"
                ? upcomingMeetings
                : recentMeetings
            ).length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Video size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No meetings yet
                </h3>
                <p className="text-gray-500">
                  {selectedTab === "all"
                    ? "Click 'Start Meeting' to create your first meeting"
                    : `You don't have any ${selectedTab} meetings`}
                </p>
              </div>
            ) : (
              (selectedTab === "all"
                ? meetings
                : selectedTab === "upcoming"
                  ? upcomingMeetings
                  : recentMeetings
              ).map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {meeting.title}
                    </h3>
                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {meeting.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <CalendarIcon size={14} />
                      <span>{formatDateTime(meeting.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-600 mb-4">
                      <Users size={14} />
                      <span>
                        {meeting.participants?.length || 0} participants
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleJoinMeeting(meeting.id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Video size={16} className="mr-1" /> Join
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyMeetingLink(meeting.id)}
                        className="flex items-center gap-1 border border-gray-300"
                      >
                        {copiedMeetingId === meeting.id ? (
                          <>
                            <Check size={16} className="text-green-600" />
                            <span className="text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Create Meeting Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Start New Meeting"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Meeting title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <textarea
              placeholder="Meeting description (optional)"
              value={meetingDescription}
              onChange={(e) => setMeetingDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              rows="3"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Link size={16} />
              <span>Share the meeting link with others after creation</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateMeeting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Create Meeting
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Join with Link Modal */}
        <Modal
          isOpen={showJoinModal}
          onClose={() => {
            setShowJoinModal(false);
            setJoinLink("");
            setJoinError("");
          }}
          title="Join Meeting with Link"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Link size={16} className="text-blue-600" />
              <span>Paste a meeting link or ID to join</span>
            </div>

            <input
              type="text"
              placeholder="https://yourapp.com/meeting/abc123 or just abc123"
              value={joinLink}
              onChange={(e) => {
                setJoinLink(e.target.value);
                setJoinError("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />

            {joinError && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>⚠️</span> {joinError}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleJoinByLink}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={isJoining}
              >
                {isJoining ? (
                  <>Joining...</>
                ) : (
                  <>
                    <Search size={16} className="mr-1" /> Join Meeting
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinLink("");
                  setJoinError("");
                }}
                className="flex-1 border border-gray-300"
              >
                Cancel
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center pt-2">
              Example: http://localhost:3000/meeting/abc123 or abc123
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
