"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleChange(e) {
    setError("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const result = await login(formData.email, formData.password);
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
              marginBottom: "2rem",
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
          <div style={{ marginBottom: "1.75rem" }}>
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
              Sign In
            </h1>
            <p
              style={{
                textAlign: "center",
                color: "var(--color-neutral-400)",
                fontSize: "0.9rem",
                maxWidth: "100%",
              }}
            >
              Enter your details to continue shopping
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
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-2)",
                }}
              >
                <label
                  className="input-label"
                  htmlFor="password"
                  style={{ marginBottom: 0 }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-gold-600)",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              </div>
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
                  autoComplete="current-password"
                  placeholder="••••••••"
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
                    padding: "2px",
                    background: "none",
                    border: "none",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* OR divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              margin: "1.25rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--color-neutral-200)",
              }}
            />
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--color-neutral-400)",
                whiteSpace: "nowrap",
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--color-neutral-200)",
              }}
            />
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
              e.currentTarget.style.backgroundColor =
                "var(--color-neutral-50)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-neutral-200)";
              e.currentTarget.style.backgroundColor =
                "var(--color-neutral-0)";
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Register link */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              fontSize: "0.85rem",
              color: "var(--color-neutral-400)",
              maxWidth: "100%",
            }}
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              style={{ color: "var(--color-gold-600)", fontWeight: 600 }}
            >
              Sign up
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
          src="https://images.unsplash.com/photo-1631346543932-ce110c10dbec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsYWNrJTIwZmVtYWxlJTIwamV3ZWxyeSUyMGZhc2hpb258ZW58MHx8MHx8fDA%3D"
          alt="Fashion"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(26,63,34,0.75) 0%, rgba(20,18,16,0.4) 100%)",
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
            Elevate your wardrobe with pieces that speak to your soul
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.875rem",
              maxWidth: "100%",
            }}
          >
            Premium clothing and accessories, curated for the modern woman.
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