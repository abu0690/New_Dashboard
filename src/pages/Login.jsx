import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import satelliteImg from '../assets/images/satellite.png';
import telesatLogo from '../assets/images/telesat.png';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

const handleSubmit = () => {
  const validEmail = "admin@gmail.com";
  const validPassword = "Admin@123";

  setEmailError('');
  setPasswordError('');

  let hasError = false;

  if (email !== validEmail) {
    setEmailError("Invalid email. Please enter a valid email address.");
    hasError = true;
  }

  if (password !== validPassword) {
    setPasswordError("Incorrect password. Please try again.");
    hasError = true;
  }

  if (!hasError) {
    // Pass email and password to the login function
    const success = login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  }
};
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Image */}
       <div className="hidden lg:flex lg:w-1/2 h-full">
          <img
            src={satelliteImg}
            alt="Satellite Image"
            className="w-full h-full object-cover"
          />
        </div>


      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <img
              src={telesatLogo}
              alt="Telesat Logo"
              className="w-40 object-contain"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome 👋
            </h2>
            <p className="text-gray-600 mt-2">Lets start!</p>
          </div>

          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {emailError && (
                <p className="text-red-600 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
              <p className="text-red-600 text-sm mt-1">{passwordError}</p>
            )}
            </div>

            <div className="text-right mb-6">
              <button className="text-sm text-blue-600 hover:underline">
                Forgot Password
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg transition-colors mb-4"
            >
              Login
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:underline font-medium">
                Contact Us
              </button>
            </div>
          </div>

          <div className="text-center mt-8 text-xs text-gray-500">
            © 2025 ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </div>
  );
}