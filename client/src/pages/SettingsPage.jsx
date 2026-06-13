import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import { Button, Input, Card } from "../components/UI";
import { useMediaDevices } from "../hooks";
import { Camera, Upload, X } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfileImage, logout } = useAuth(); // ✅ added logout
  const mediaDevices = useMediaDevices();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(user?.profileImage || null);
  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState({
    audioInput: "",
    audioOutput: "",
    videoInput: "",
    videoQuality: "hd",
    enableNotifications: true,
    enableAutoJoin: false,
    theme: "dark",
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setPreview(base64);
      setUploading(true);
      await updateProfileImage(base64);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = async () => {
    setPreview(null);
    setUploading(true);
    await updateProfileImage(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar Menu */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl p-4 space-y-2 border border-gray-200">
                {[
                  { id: "profile", label: "Profile" },
                  { id: "audio", label: "Audio Settings" },
                  { id: "video", label: "Video Settings" },
                  { id: "notification", label: "Notifications" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Section */}
              <Card>
                <h2 className="text-xl font-bold text-white mb-4">
                  Profile Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-1.5 text-white hover:bg-indigo-700 transition"
                      >
                        <Camera size={16} />
                      </button>
                      {preview && (
                        <button
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload size={14} className="mr-1" />{" "}
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </Button>
                    <p className="text-xs text-gray-500">JPEG, PNG up to 2MB</p>
                  </div>

                  <Input
                    label="Full Name"
                    type="text"
                    value={user?.fullName || ""}
                    disabled
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
              </Card>

              {/* Audio Settings */}
              <Card>
                <h2 className="text-xl font-bold text-white mb-4">
                  Audio Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Microphone
                    </label>
                    <select
                      value={settings.audioInput}
                      onChange={(e) =>
                        handleSettingChange("audioInput", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">Select microphone</option>
                      {mediaDevices.audioinput.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Microphone ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Speaker
                    </label>
                    <select
                      value={settings.audioOutput}
                      onChange={(e) =>
                        handleSettingChange("audioOutput", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">Select speaker</option>
                      {mediaDevices.audiooutput.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Speaker ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Video Settings */}
              <Card>
                <h2 className="text-xl font-bold text-white mb-4">
                  Video Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Camera
                    </label>
                    <select
                      value={settings.videoInput}
                      onChange={(e) =>
                        handleSettingChange("videoInput", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="">Select camera</option>
                      {mediaDevices.videoinput.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label ||
                            `Camera ${device.deviceId.slice(0, 5)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Video Quality
                    </label>
                    <select
                      value={settings.videoQuality}
                      onChange={(e) =>
                        handleSettingChange("videoQuality", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="low">Low (360p)</option>
                      <option value="standard">Standard (480p)</option>
                      <option value="hd">HD (720p)</option>
                      <option value="fullhd">Full HD (1080p)</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Notifications */}
              <Card>
                <h2 className="text-xl font-bold text-black mb-4">
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "enableNotifications",
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-black">
                      Enable notification sounds
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAutoJoin}
                      onChange={(e) =>
                        handleSettingChange("enableAutoJoin", e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-black">
                      Auto-join scheduled meetings
                    </span>
                  </label>
                </div>
              </Card>

              {/* Account Actions */}
              <Card>
                <h2 className="text-xl font-bold text-black mb-4">Account</h2>
                <div className="space-y-2">
                  <Button variant="danger" onClick={logout} className="w-full">
                    Logout
                  </Button>
                </div>
              </Card>

              <Button size="lg" className="w-full">
                Save Settings
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
