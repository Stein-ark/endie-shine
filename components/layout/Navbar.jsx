"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Store,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isLoggedIn, isAdmin, isVendor } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();

  // Add shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#profile-menu")) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isScrolled
          ? "rgba(247, 246, 243, 0.97)"
          : "rgba(247, 246, 243, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-neutral-200)",
        boxShadow: isScrolled ? "var(--shadow-sm)" : "none",
        transition: "box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "50px",
          }}
        >

          {/* ── Logo ── */}
          <Link
            href="/"
            style={{
              // position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
              flexShrink: 0,
              textDecoration: "none",
            }}
          >
            <Image
              src="/logo.png"
              alt="Shop With Endurance Shine"
              width={44}
              height={44}
              style={{
                width: "45px",
                height: "45px",
                objectFit: "contain",
                borderRadius: "50%",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem",lineHeight: 1 }}>
             
              <span
                className="text-gold-gradient"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                Endie
              </span>
              <span 
              style={{
                  color: "#000",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
                
               className="Elogo" >
                  Shine
                  </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ───────────────────────── */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "2.5rem",
              marginLeft: "50px"
            }}
            className="md-flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color:
                    pathname === link.href
                      ? "var(--color-gold-500)"
                      : "var(--color-neutral-600)",
                  textDecoration: "none",
                  position: "relative",
                  paddingBottom: "2px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (pathname !== link.href)
                    e.currentTarget.style.color = "var(--color-gold-500)";
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.href)
                    e.currentTarget.style.color = "var(--color-neutral-600)";
                }}
              >
                {link.label}
                {/* Active underline */}
                {pathname === link.href && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: 0,
                      right: 0,
                      height: "2px",
                      backgroundColor: "var(--color-gold-500)",
                      borderRadius: "1px",
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Right Side Icons ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Search */}
            <Link href="/search" className="nav-icon-btn">
              <Search size={18} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="nav-icon-btn" style={{ position: "relative" }}>
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "var(--color-forest-600)",
                    color: "white",
                    fontSize: "0.65rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="nav-icon-btn" style={{ position: "relative" }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "var(--color-gold-500)",
                    color: "var(--color-neutral-900)",
                    fontSize: "0.65rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "var(--color-neutral-200)",
                margin: "0 6px",
              }}
            />

            {/* Profile / Auth */}
            {isLoggedIn ? (
              <div style={{ position: "relative" }} id="profile-menu">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 10px 6px 6px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--color-neutral-200)",
                    backgroundColor: "var(--color-neutral-0)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-gold-400)";
                    e.currentTarget.style.boxShadow = "var(--shadow-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-neutral-200)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-neutral-900)",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={13}
                    style={{
                      color: "var(--color-neutral-500)",
                      transform: isProfileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: "220px",
                      backgroundColor: "var(--color-neutral-0)",
                      border: "1px solid var(--color-neutral-200)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-lg)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    {/* User Info Header */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--color-neutral-100)",
                        backgroundColor: "var(--color-neutral-50)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          color: "var(--color-neutral-800)",
                        }}
                      >
                        {user?.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-neutral-400)",
                          marginTop: "2px",
                        }}
                      >
                        {user?.email}
                      </p>
                      <span className="badge badge-gold" style={{ marginTop: "6px" }}>
                        {user?.role}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: "6px 12px" ,
                      
                    }}>
                      {[
                        { href: "/profile", icon: <User size={20} />, label: "My Profile" },
                        { href: "/orders", icon: <ShoppingBag size={20} />, label: "My Orders" },
                        { href: "/wishlist", icon: <Heart size={20} />, label: "My Wishlist" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="dropdown-item"
                         style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 16px",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "var(--color-neutral-600)",
                            textDecoration: "none",
                            transition: "all 0.15s ease",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}

                      {(isVendor || isAdmin) && (
                        <Link href="/vendor" className="dropdown-item">
                          <Store size={14} />
                          Vendor Dashboard
                        </Link>
                      )}

                      {isAdmin && (
                        <Link href="/admin" className="dropdown-item">
                          <LayoutDashboard size={14} />
                          Admin Dashboard
                        </Link>
                      )}

                      <div
                        style={{
                          borderTop: "1px solid var(--color-neutral-100)",
                          marginTop: "6px",
                          paddingTop: "6px",
                        }}
                      >
                        <button
                          onClick={logout}
                          className="dropdown-item"
                          style={{
                            width: "100%",
                            textAlign: "left",
                            color: "var(--color-error)",
                          }}
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                className="hide-mobile"
              >
                <Link href="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="nav-icon-btn show-mobile"
              style={{ marginLeft: "4px" }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──*/}
        {isMobileMenuOpen && (
          <div
            style={{
              borderTop: "1px solid var(--color-neutral-200)",
              padding: "12px 0 16px",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color:
                    pathname === link.href
                      ? "var(--color-gold-600)"
                      : "var(--color-neutral-600)",
                  backgroundColor:
                    pathname === link.href
                      ? "var(--color-gold-50)"
                      : "transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "12px 16px 0",
                }}
              >
                <Link
                  href="/login"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scoped styles for nav-specific classes */}
      <style jsx>{`
        /* Desktop flex — we use a custom class because Tailwind's md: prefix
           requires the config setup. This is pure CSS instead. */
        @media (min-width: 768px) {
          .md-flex {
            display: flex !important;
          }
          .hide-mobile {
            display: flex !important;
          }
          .show-mobile {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
        }

        /* Icon button — small circular clickable icon */
        .nav-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: var(--color-neutral-500);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          position: relative;
        }

        .nav-icon-btn:hover {
          background-color: var(--color-neutral-100);
          color: var(--color-gold-600);
        }

        /* Dropdown menu item */
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-neutral-600);
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          transition: all 0.15s ease;
        }

        .dropdown-item:hover {
          background-color: var(--color-neutral-50);
          color: var(--color-gold-600);
        }
      `}</style>
    </nav>
  );
}