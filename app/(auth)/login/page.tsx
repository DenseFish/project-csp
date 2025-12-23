"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const validateEmail = (inputEmail: string) => /\S+@\S+\.\S+/.test(inputEmail)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(false)
    setPasswordError(false)

    let isValid = true
    if (!validateEmail(email)) { setEmailError(true); isValid = false }
    if (password.length < 4 || password.length > 60) { setPasswordError(true); isValid = false }
    if (!isValid) return

    const res = await fetch('/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      alert(data.message)
      return
    }

    // Ambil Role dari API /api/me
    try {
      const meRes = await fetch('/api/me');
      if (!meRes.ok) throw new Error("Gagal fetch profile");
      const meData = await meRes.json();

      // Cek Role dan ke page sesuai role
      if (meData.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/");
      }
      
      router.refresh() 
    } catch (error) {
      console.error("Gagal mengambil data role:", error);
      router.push("/"); // Fallback jika gagal ambil role
      router.refresh();
    }
  }

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-4">
      <div className="w-full max-w-[450px] rounded-lg bg-black/75 px-8 py-12 md:px-16">
        <h1 className="mb-8 text-3xl font-bold text-white">Sign In</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <input
              className={`w-full rounded bg-[#333] px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition ${emailError ? 'border-b-2 border-[#e50914]' : ''}`}
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if(emailError) setEmailError(false) }}
              suppressHydrationWarning={true}
            />
            {emailError && <p className="mt-1 text-xs text-[#e50914]">Please enter a valid email.</p>}
          </div>

          <div className="relative">
            <input
              className={`w-full rounded bg-[#333] px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:bg-[#454545] transition ${passwordError ? 'border-b-2 border-[#e50914]' : ''}`}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if(passwordError) setPasswordError(false) }}
              suppressHydrationWarning={true}
            />
            {passwordError && <p className="mt-1 text-xs text-[#e50914]">Password must be between 4 and 60 characters.</p>}
          </div>

          <button type="submit" className="mt-6 w-full rounded bg-[#e50914] py-3 font-bold text-white hover:bg-[#c11119] transition duration-200"
          suppressHydrationWarning={true}
          >
            Sign In
          </button>
          
          <div className="flex justify-between text-sm text-[#b3b3b3] mt-2">
            <div className="flex items-center gap-1">
              <input type="checkbox" id="rememberMe" className="rounded bg-[#333] border-none focus:ring-0 cursor-pointer" />
              <label htmlFor="rememberMe" className="cursor-pointer">Remember me</label>
            </div>
            <Link href="#" className="hover:underline">Need help?</Link>
          </div>
        </form>

        <div className="mt-16 text-[#737373]">
          <p className="text-base">
            New to Uflix?{' '}
            <Link href="/register" className="text-white hover:underline">
              Sign up now.
            </Link>
          </p>
          <p className="mt-4 text-xs">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </div>
    </div>
  )
}