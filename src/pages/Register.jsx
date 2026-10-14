import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, UserPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/auth/InputField';
import PasswordInput from '../components/auth/PasswordInput';
import PasswordStrength, { calculatePasswordStrength } from '../components/auth/PasswordStrength';
import Checkbox from '../components/auth/Checkbox';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forceDisabled, setForceDisabled] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  // Comprehensive Client-side Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Full name check
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter at least 2 characters';
    }

    // 2. Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. you@example.com)';
    }

    // 3. Password check
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = calculatePasswordStrength(formData.password);
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      } else if (strength.score < 2) {
        newErrors.password = 'Password is too weak. Include mixed cases and numbers';
      }
    }

    // 4. Confirm password check
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // 5. Terms acceptance check
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the Terms of Service to continue';
    }

    return newErrors;
  };

  // Submission Handler calling backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout tagline="Build better financial habits.">
      {/* Form Heading & Subtitle */}
      <header className="mb-6">
        <h2 className="font-display text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">
          Create your account
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Start tracking your income, expenses, and budgets today.
        </p>
      </header>

      {/* Global Server / Existing Email Alert Banner */}
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-snug">{serverError}</div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="font-medium leading-snug">{successMessage}</div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
        
        {/* Full Name Field */}
        <InputField
          id="fullName"
          name="fullName"
          label="Full name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={User}
          autoComplete="name"
          required
        />

        {/* Email Address Field */}
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
          required
        />

        {/* Password Field with Password Strength Meter */}
        <div>
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          {/* Password Strength Indicator */}
          <PasswordStrength password={formData.password} />
        </div>

        {/* Confirm Password Field */}
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <Checkbox
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            error={errors.termsAccepted}
            label={
              <span>
                I agree to the{' '}
                <a
                  href="#terms"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  className="font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                >
                  Privacy Policy
                </a>
                .
              </span>
            }
          />
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={forceDisabled}
            loading={isLoading}
            loadingText="Creating account..."
            icon={UserPlus}
          >
            Create Account
          </Button>
        </div>

      </form>

      {/* Footer Navigation Link: To Login */}
      <footer className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors ml-1 font-display"
          >
            Sign in
          </Link>
        </p>
      </footer>

    </AuthLayout>
  );
}
