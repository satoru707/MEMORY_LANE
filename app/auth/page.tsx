"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import { Mail, ArrowRight, Github, Chrome } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { AuthPageProps } from "@/types/types";

const AuthPage: React.FC<AuthPageProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (type === "passwordless") {
      setTimeout(() => {
        setEmailSent(true);
        setLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        onSubmit({ email, password });
        setLoading(false);
      }, 1000);
    }
  };

  const titles = {
    login: "Welcome back",
    signup: "Create your account",
    passwordless: "Sign in with email",
  };

  const subtitles = {
    login: "Sign in to your Memory Lane account",
    signup: "Start preserving your memories today",
    passwordless: "We'll send you a magic link to sign in",
  };

  if (type === "passwordless" && emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center space-y-6" padding="lg">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-bold text-neutral-900">
              Check your email
            </h1>
            <p className="text-neutral-600">
              We sent a magic link to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>
          <div className="text-sm text-neutral-500">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              try again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md space-y-6" padding="lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold">ML</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            {titles[type]}
          </h1>
          <p className="text-neutral-600">{subtitles[type]}</p>
        </div>

        {/* OAuth Buttons */}
        {type !== "passwordless" && (
          <div className="space-y-3">
            <Button variant="secondary" size="lg" className="w-full">
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">or</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {type !== "passwordless" && (
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          {type === "signup" && (
            <Input
              type="password"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {type === "login" && "Sign in"}
            {type === "signup" && "Create account"}
            {type === "passwordless" && "Send magic link"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-center text-sm">
          {type === "login" && (
            <div className="space-y-2">
              <div>
                <NextLink
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  href={"/auth/password"}
                >
                  Forgot your password?
                </NextLink>
              </div>
              <div className="text-neutral-500">
                Don&apos;t have an account?
                <NextLink
                  className="text-primary-600 hover:text-primary-700 font-medium"
                  href={"/auth/register"}
                >
                  Sign up
                </NextLink>
              </div>
            </div>
          )}

          {type === "signup" && (
            <div className="text-neutral-500">
              Already have an account?{" "}
              <NextLink
                className="text-primary-600 hover:text-primary-700 font-medium"
                href={"/auth/login"}
              >
                Sign in
              </NextLink>
            </div>
          )}

          {type === "passwordless" && (
            <div className="text-neutral-500">
              Prefer a password?{" "}
              <NextLink
                className="text-primary-600 hover:text-primary-700 font-medium"
                href={"/auth/login"}
              >
                Sign in with password
              </NextLink>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
