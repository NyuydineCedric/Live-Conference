import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Video,
  Mic,
  Monitor,
  MessageCircle,
  Users,
  Smartphone,
  Star,
  ArrowRight,
  Check,
  Zap,
  MicOff,
} from "lucide-react";
import { Button } from "../components/UI";
import man from "../assets/man.jpg";
import anotherMan from "../assets/another.jpg";
import mike from "../assets/mike.jpg";
import sarah from "../assets/sarah.webp";
import emma from "../assets/ema.jpg";
import clivelogo from "../assets/clivelogo.png";
// ─── Real image sources ────────────────────────────────────────────────────

const HERO_IMAGES = {
  you: man,
  sarah: sarah,
  mike: mike,
  emma: emma,
};

const TESTIMONIAL_IMAGES = [
  "https://randomuser.me/api/portraits/women/21.jpg",
  "https://randomuser.me/api/portraits/men/54.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
];

// ─── Fallback avatar (initials) ────────────────────────────────────────────

function FallbackAvatar({ name, size = 48 }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const palette = ["#4F46E5", "#0891B2", "#7C3AED", "#0F766E", "#B45309"];
  const bg = palette[name.charCodeAt(0) % palette.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function RealAvatar({ src, name, size = 48, className = "" }) {
  const [err, setErr] = useState(false);
  if (err) return <FallbackAvatar name={name} size={size} />;
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Hero video participant tile ───────────────────────────────────────────

function VideoTile({ src, name, delay, isMain = false, micOff = false }) {
  const [err, setErr] = useState(false);
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className={`rounded-lg overflow-hidden border-2 border-indigo-200 relative ${isMain ? "col-span-2 md:col-span-1" : ""}`}
      style={{ minHeight: isMain ? 0 : 90 }}
    >
      {err ? (
        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center">
          <Users size={isMain ? 48 : 28} className="text-white" />
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          onError={() => setErr(true)}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(.88)" }}
        />
      )}

      {/* Name tag */}
      <div className="absolute bottom-2 left-2 bg-gray-900/75 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
        {micOff && <MicOff size={9} className="text-red-400" />}
        {name}
      </div>

      {/* Speaking ring */}
      {!micOff && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-indigo-400/60 pointer-events-none" />
      )}
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Video,
      title: "HD Video Conferencing",
      description: "Crystal clear video with advanced codec support",
    },
    {
      icon: Mic,
      title: "Crystal Clear Audio",
      description: "Noise cancellation and echo reduction",
    },
    {
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your screen with participants",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Communicate via instant messaging",
    },
    {
      icon: Users,
      title: "Group Meetings",
      description: "Host meetings with multiple participants",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Works on all devices and browsers",
    },
  ];

  const testimonials = [
    {
      text: "Live C has transformed how our team collaborates remotely.",
      author: "Sarah Johnson",
      title: "CEO, Tech Startup",
      image: TESTIMONIAL_IMAGES[0],
    },
    {
      text: "The video quality and ease of use are unmatched.",
      author: "Michael Chen",
      title: "Product Manager",
      image: TESTIMONIAL_IMAGES[1],
    },
    {
      text: "Finally, a video conferencing tool that just works.",
      author: "Emma Davis",
      title: "HR Director",
      image: TESTIMONIAL_IMAGES[2],
    },
  ];

  // ── NavBar ──────────────────────────────────────────────────────────────

  const NavBar = () => (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={clivelogo}
            alt="logo"
            style={{ width: 200, height: 100, padding: 0, margin: 0 }}
          />
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <motion.a
            whileHover={{ color: "#0891b2" }}
            className="text-gray-600 cursor-pointer transition-colors"
            onClick={() =>
              document
                .querySelector("#features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </motion.a>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <motion.a
            whileHover={{ color: "#0891b2" }}
            className="text-gray-600 cursor-pointer transition-colors"
            onClick={() =>
              document
                .querySelector("#testimonials")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Testimonials
          </motion.a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      <NavBar />

      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-4 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 relative"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              Video Meetings
            </span>
            <br />
            <span className="text-gray-900">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Connect with anyone, anywhere. Crystal clear video, screen sharing,
            and real-time chat. The premium alternative to Zoom.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex gap-4 justify-center flex-wrap mb-16"
          >
            {isAuthenticated ? (
              <>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(79,70,229,.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/meeting/new")}
                  className="px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg"
                >
                  Start Meeting Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-4 rounded-lg font-semibold text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  Go to Dashboard
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(79,70,229,.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg flex items-center gap-2"
                >
                  Start Meeting <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-lg font-semibold text-indigo-600 bg-white border-2 border-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  Join Meeting <ArrowRight size={20} />
                </motion.button>
              </>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 text-sm"
          >
            Free to use. No credit card required. Join thousands of users.
          </motion.p>
        </motion.div>

        {/* ── Hero video mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative mt-20 z-10"
        >
          <div className="rounded-2xl p-1 border-2 border-indigo-200 shadow-2xl bg-white">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
              {/* 2×2 video grid */}
              <div
                className="w-full h-full grid grid-cols-2 gap-1.5 p-2"
                style={{ gridTemplateRows: "1fr 1fr" }}
              >
                <VideoTile
                  src={HERO_IMAGES.you}
                  name="You"
                  delay={0.9}
                  isMain={false}
                />
                <VideoTile
                  src={HERO_IMAGES.sarah}
                  name="Sarah"
                  delay={1.0}
                  micOff
                />
                <VideoTile src={HERO_IMAGES.mike} name="Mike" delay={1.1} />
                <VideoTile
                  src={HERO_IMAGES.emma}
                  name="Emma"
                  delay={1.2}
                  micOff
                />
              </div>

              {/* Control bar overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4 flex justify-center gap-3"
              >
                {[
                  { Icon: Video, color: "green" },
                  { Icon: MicOff, color: "red" },
                  { Icon: Monitor, color: "cyan" },
                ].map(({ Icon, color }, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full bg-${color}-500/30 border border-${color}-500/70 flex items-center justify-center`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                ))}
              </motion.div>

              {/* Chat panel preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="absolute right-0 top-0 w-36 h-full bg-white/90 border-l-2 border-indigo-200 p-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  {/* Chat message 1 */}
                  <div className="flex items-start gap-1.5">
                    <RealAvatar
                      src={HERO_IMAGES.sarah}
                      name="Sarah"
                      size={20}
                    />
                    <div className="bg-indigo-100 rounded p-1.5 text-xs flex-1">
                      <p className="font-semibold text-indigo-700 text-[10px]">
                        Sarah
                      </p>
                      <p className="text-gray-700">Great meeting!</p>
                    </div>
                  </div>
                  {/* Chat message 2 */}
                  <div className="flex items-start gap-1.5 flex-row-reverse">
                    <RealAvatar src={HERO_IMAGES.you} name="You" size={20} />
                    <div className="bg-gray-100 rounded p-1.5 text-xs flex-1">
                      <p className="font-semibold text-indigo-700 text-[10px]">
                        You
                      </p>
                      <p className="text-gray-700">Thanks!</p>
                    </div>
                  </div>
                  {/* Chat message 3 */}
                  <div className="flex items-start gap-1.5">
                    <RealAvatar src={HERO_IMAGES.mike} name="Mike" size={20} />
                    <div className="bg-indigo-100 rounded p-1.5 text-xs flex-1">
                      <p className="font-semibold text-indigo-700 text-[10px]">
                        Mike
                      </p>
                      <p className="text-gray-700">See you next week 👋</p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 pt-2 border-t border-gray-100">
                  <MessageCircle size={12} /> Chat
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-12 -left-12 w-24 h-24 rounded-lg border-2 border-indigo-300 flex items-center justify-center opacity-60 bg-white/80"
          >
            <Video size={40} className="text-indigo-600" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-12 -right-12 w-24 h-24 rounded-lg border-2 border-cyan-300 flex items-center justify-center opacity-60 bg-white/80"
          >
            <Zap size={40} className="text-cyan-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need for professional video conferencing, all in one
            platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 40px rgba(79,70,229,.1)",
                }}
                className="rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all bg-white/80 group"
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="relative max-w-7xl mx-auto px-4 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Teams Worldwide
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl p-6 border-2 border-gray-200 hover:border-indigo-300 transition-all bg-white/80"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{t.text}"</p>
              {/* Author row with real photo */}
              <div className="flex items-center gap-3">
                <RealAvatar src={t.image} name={t.author} size={42} />
                <div>
                  <p className="font-semibold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-600">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-gray-200 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={clivelogo}
                  alt="logo"
                  style={{ width: 100, height: 50 }}
                />
              </div>
              <p className="text-gray-600 text-sm">
                Premium video conferencing for modern teams
              </p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Contact"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-semibold text-gray-900 mb-4">{title}</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-indigo-600 transition">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-8 flex justify-between items-center text-gray-600 text-sm">
            <p>&copy; 2026 Nyuydine Cedric Live C. All rights reserved.</p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="hover:text-indigo-600 transition"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
