import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  X,
  Pipette,
  Check,
  Menu,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import telesatLogo from "../../assets/images/telesat.png";

export default function Navbar({ openSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    primaryColor,
    setPrimaryColor,
    sidebarColor,
    setSidebarColor,
    tabColor,
    setTabColor,
    logo,
    setLogo,
  } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const menuRef = useRef(null);
  const themeRef = useRef(null);

  const [tempNavbarColor, setTempNavbarColor] = useState(primaryColor);
  const [tempSidebarColor, setTempSidebarColor] = useState(
    sidebarColor || primaryColor
  );
  const [tempTabColor, setTempTabColor] = useState(tabColor || "#6b7280");
  const [tempLogo, setTempLogo] = useState(logo);

  useEffect(() => {
    setTempNavbarColor(primaryColor);
    setTempSidebarColor(sidebarColor || primaryColor);
    setTempTabColor(tabColor || "#6b7280");
    setTempLogo(logo);
  }, [primaryColor, sidebarColor, tabColor, logo]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setShowThemeSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setTempLogo(null);
  };

  const hexToRgb = (hex) => {
    const result =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#000000");
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return { h: h * 360, s, l };
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
  };

  const startColorPicking = async (targetType) => {
    if (!window.EyeDropper) {
      alert("EyeDropper API not supported in this browser");
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();

      if (targetType === "navbar") {
        setTempNavbarColor(result.sRGBHex);
      } else if (targetType === "sidebar") {
        setTempSidebarColor(result.sRGBHex);
      } else if (targetType === "tab") {
        setTempTabColor(result.sRGBHex);
      }
    } catch (e) {
      
    }
  };

  const handleSaveChanges = () => {
    setPrimaryColor(tempNavbarColor);
    setSidebarColor(tempSidebarColor);
    setTabColor(tempTabColor);

    if (tempLogo) {
      setLogo(tempLogo);
    } else {
      setLogo(null);
    }

    setShowSuccessMessage(true);
  };

  const handleThemeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowThemeSettings(!showThemeSettings);
  };

  const ColorPickerWithGradient = ({ label, color, setColor, targetType }) => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return (
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-20 h-20 rounded-lg border-2 border-gray-300 flex-shrink-0 cursor-pointer"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Hex</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              placeholder="#000000"
            />
          </div>
          <button
            type="button"
            onClick={() => startColorPicking(targetType)}
            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Pipette size={20} className="text-blue-600" />
          </button>
        </div>

        <div
          className="relative h-8 rounded-lg overflow-hidden mb-2"
          style={{
            background:
              "linear-gradient(to right, #ff0000, #ff00ff, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
          }}
        >
          <input
            type="range"
            min="0"
            max="360"
            value={hsl.h}
            onChange={(e) => {
              const hue = parseInt(e.target.value);
              const newRgb = hslToRgb(hue, hsl.s, hsl.l);
              setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          {["r", "g", "b"].map((key, idx) => {
            const labels = ["R", "G", "B"];
            const value = rgb[key];

            const ranges = {
              rMin: rgbToHex(0, rgb.g, rgb.b),
              rMax: rgbToHex(255, rgb.g, rgb.b),
              gMin: rgbToHex(rgb.r, 0, rgb.b),
              gMax: rgbToHex(rgb.r, 255, rgb.b),
              bMin: rgbToHex(rgb.r, rgb.g, 0),
              bMax: rgbToHex(rgb.r, rgb.g, 255),
            };

            const minClr =
              key === "r"
                ? ranges.rMin
                : key === "g"
                ? ranges.gMin
                : ranges.bMin;
            const maxClr =
              key === "r"
                ? ranges.rMax
                : key === "g"
                ? ranges.gMax
                : ranges.bMax;

            return (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600">
                    {labels[idx]}
                  </label>
                  <span className="text-xs font-mono text-gray-700">
                    {value}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={value}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value);
                    const newRgb = {
                      r: key === "r" ? newVal : rgb.r,
                      g: key === "g" ? newVal : rgb.g,
                      b: key === "b" ? newVal : rgb.b,
                    };
                    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${minClr}, ${maxClr})`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top navbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={openSidebar}
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="relative w-28 h-12 overflow-hidden flex items-center justify-center">
            <img
              src={logo || telesatLogo}
              alt="Company Logo"
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Search */}
          <div className="hidden sm:block relative w-40 md:w-72 lg:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3" ref={menuRef}>
          <button
            type="button"
            onClick={handleThemeToggle}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          <button
            type="button"
            className="relative p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                type="button"
                onClick={handleEditProfile}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <User size={16} />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Theme Settings panel */}
      {showThemeSettings && (
        <div
          className="fixed top-16 right-0 w-[420px] max-w-full bg-white shadow-xl border-l border-gray-200 z-50 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]"
          ref={themeRef}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Theme Settings</h3>
            <button
              type="button"
              onClick={() => setShowThemeSettings(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Logo upload */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500 mb-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:text-blue-700 cursor-pointer"
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
            >
              Reset to Default Logo
            </button>
          </div>

          {/* Primary color */}
          <ColorPickerWithGradient
            label="Primary Color (Navbar & Sidebar)"
            color={tempNavbarColor}
            setColor={(val) => {
              setTempNavbarColor(val);
              setTempSidebarColor(val);
            }}
            targetType="navbar"
          />

          {/* Tab color */}
          <ColorPickerWithGradient
            label="Tab Color"
            color={tempTabColor}
            setColor={setTempTabColor}
            targetType="tab"
          />

          <button
            type="button"
            onClick={handleSaveChanges}
            className="w-full mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Success toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 min-w-[320px]">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={24} className="text-white" />
            </div>
            <p className="text-green-800 font-medium">
              Theme updated successfully.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
