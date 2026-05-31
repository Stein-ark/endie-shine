"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Password strength checker
  function getPasswordStrength(password) {
    if (!password) return null;
    if (password.length < 6) return { label: "Too short", color: "var(--color-error)", width: "25%" };
    if (password.length < 8) return { label: "Weak", color: "#e67e22", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: "Fair", color: "var(--color-warning)", width: "75%" };
    return { label: "Strong", color: "var(--color-success)", width: "100%" };
  }

  const strength = getPasswordStrength(formData.password);

  function handleChange(e) {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.message);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  }

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        height: "100vh",
        overflow: "hidden",
      }}
      className="auth-grid"
    >
      {/* ── Left — Form ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "var(--color-neutral-0)",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "360px" }}>

          {/* Back link */}
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "var(--color-neutral-400)",
              marginBottom: "1.75rem",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-gold-500)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-neutral-400)")
            }
          >
            ← Back to store
          </Link>

          {/* Heading */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-gold-500)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "0.4rem",
                textAlign: "center",
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                color: "var(--color-neutral-400)",
                fontSize: "0.9rem",
                maxWidth: "100%",
                textAlign: "center",
              }}
            >
              Join thousands of happy shoppers
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                backgroundColor: "rgba(192, 57, 43, 0.06)",
                border: "1px solid rgba(192, 57, 43, 0.2)",
                borderRadius: "var(--radius-md)",
                marginBottom: "1rem",
                color: "var(--color-error)",
                fontSize: "0.85rem",
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
          >
            {/* Name */}
            <div>
              <label className="input-label" htmlFor="name">
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: "2.25rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: "2px",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength bar */}
              {strength && (
                <div style={{ marginTop: "6px" }}>
                  <div
                    style={{
                      height: "3px",
                      backgroundColor: "var(--color-neutral-200)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: strength.width,
                        backgroundColor: strength.color,
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: strength.color,
                      marginTop: "3px",
                      maxWidth: "100%",
                    }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="input-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  style={{
                    paddingLeft: "2.25rem",
                    paddingRight: "2.5rem",
                    borderColor: formData.confirmPassword
                      ? passwordsMatch
                        ? "var(--color-success)"
                        : "var(--color-error)"
                      : undefined,
                  }}
                />
                {/* Show/hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-neutral-300)",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: "2px",
                  }}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {/* Match indicator */}
                {formData.confirmPassword && passwordsMatch && (
                  <CheckCircle
                    size={15}
                    style={{
                      position: "absolute",
                      right: "36px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-success)",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "0.25rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* OR divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.1rem 0",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-neutral-200)" }} />
            <span style={{ fontSize: "0.78rem", color: "var(--color-neutral-400)", whiteSpace: "nowrap" }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-neutral-200)" }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "0.7rem 1rem",
              backgroundColor: "var(--color-neutral-0)",
              border: "1.5px solid var(--color-neutral-200)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-neutral-700)",
              cursor: googleLoading ? "not-allowed" : "pointer",
              opacity: googleLoading ? 0.7 : 1,
              transition: "all 0.2s ease",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-neutral-400)";
              e.currentTarget.style.backgroundColor = "var(--color-neutral-50)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-neutral-200)";
              e.currentTarget.style.backgroundColor = "var(--color-neutral-0)";
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Login link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.1rem",
              fontSize: "0.85rem",
              color: "var(--color-neutral-400)",
              maxWidth: "100%",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--color-gold-600)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right — Image ─────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--color-neutral-900)",
          overflow: "hidden",
        }}
        className="auth-image"
      >
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&auto=format&fit=crop"
          alt="Fashion"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(217,146,1,0.6) 0%, rgba(20,18,16,0.5) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "2.5rem",
          }}
        >
          <div className="divider-gold" style={{ marginBottom: "1.25rem" }} />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.25,
              marginBottom: "0.75rem",
              maxWidth: "100%",
            }}
          >
            Your style journey starts here
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.875rem",
              maxWidth: "100%",
            }}
          >
            Create an account and discover premium fashion curated just for you.
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-image {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}