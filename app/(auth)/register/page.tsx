"use client";

import { useState } from "react"; // useEffect sudah tidak dipakai untuk cek session
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading state hanya untuk tombol submit, bukan loading halaman
  const [loading, setLoading] = useState(false);

  // State Validasi Visual
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // --- BAGIAN useEffect LAMA SUDAH DIHAPUS ---
  // Kita biarkan saja halaman ini terbuka meskipun user sudah login.
  // Ini mencegah bentrok saat user baru mendaftar.

  // Validasi Email Sederhana
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    let isValid = true
    if (!validateEmail(email)) { setEmailError(true); isValid = false }
    if (password.length < 4 || password.length > 60) { setPasswordError(true); isValid = false }
    if (!isValid) return

    setLoading(true); // Mulai loading

    try {
      // Panggil API Signup
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // berhasil
      alert("Registration successful! Please login.");
      router.push("/login");

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black md:bg-[url('/images/bg-login.jpg')] bg-cover bg-center bg-no-repeat bg-fixed font-['Netflix_Sans']">
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black md:bg-black/50 z-0"></div>

      {/* Header Logo */}
      <header className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 md:h-12 w-auto"
          />
        </Link>
      </header>

      {/* Form Card */}
      <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
        <div className="w-full max-w-[450px] rounded-lg bg-black/75 px-8 py-12 md:px-16 border border-transparent md:border-none">
          <h1 className="mb-8 text-3xl font-bold text-white">Sign Up</h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Input Email */}
            <div className="relative">
              <input
                className={`w-full rounded bg-[#333] px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition ${
                  emailError ? "border-b-2 border-[#e50914]" : ""
                }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
              />
              {emailError && (
                <p className="mt-1 text-xs text-[#e50914]">
                  Please enter a valid email.
                </p>
              )}
            </div>

            {/* Input Password */}
            <div className="relative">
              <input
                className={`w-full rounded bg-[#333] px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition ${
                  passwordError ? "border-b-2 border-[#e50914]" : ""
                }`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
              />
              {passwordError && (
                <p className="mt-1 text-xs text-[#e50914]">
                  Password must be between 4 and 60 characters.
                </p>
              )}
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full rounded bg-[#e50914] py-3 font-bold text-white hover:bg-[#c11119] transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-10 text-[#737373] text-base">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Sign in now.
              </Link>
            </p>
            <p className="mt-4 text-xs">
              This page is protected by Google reCAPTCHA to ensure you're not a
              bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
