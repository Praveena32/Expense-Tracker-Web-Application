import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, LogIn, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';
import Checkbox from '../components/auth/Checkbox';
import Button from '../components/auth/Button';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
