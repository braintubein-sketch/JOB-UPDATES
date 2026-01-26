'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    const benefits = [
        'Save your favorite jobs',
        'Get instant job alerts',
        'Apply with one click',
        'Track your applications',
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Briefcase className="text-white" size={28} />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Start your job search journey today
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle className="text-green-500 shrink-0" size={16} />
                            {benefit}
                        </div>
                    ))}
                </div>

                {/* Register Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="input pl-11"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    className="input pl-11 pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                                I agree to the{' '}
                                <Link href="/disclaimer" className="text-blue-600 hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-60"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <ArrowRight size={18} className="ml-2" />}
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
