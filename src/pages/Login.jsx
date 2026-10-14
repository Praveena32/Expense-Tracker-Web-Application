import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, LogIn, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';
import Checkbox from '../components/auth/Checkbox';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Take control of your money.">
      
      {/* Header */}
      <header className="mb-6">
        <h2 className="font-display text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
          Welcome back
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Sign in to continue managing your finances.
        </p>
      </header>

      {/* Server Error Notification */}
      {serverError && (
        <div className="mb-4.5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
          required
        />

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-800 font-display"
            >
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="pt-1">
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            label="Remember me for 30 days"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={isLoading}
            loadingText="Signing in..."
            icon={LogIn}
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Footer Navigation Link: To Register */}
      <footer className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors ml-1 font-display"
          >
            Sign up
          </Link>
        </p>
      </footer>

    </AuthLayout>
  );
}
