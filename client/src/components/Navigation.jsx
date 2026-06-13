import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { Button } from "./UI";
import clivelogo from "../assets/clivelogo.png";

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={clivelogo}
            alt="logo"
            style={{ width: 200, height: 100, padding: 0, margin: 0 }}
          />
        </motion.div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">
                    {user?.fullName?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm">{user?.fullName}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings size={18} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
