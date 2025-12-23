import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                supabaseResponse = NextResponse.next({
                    request,
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                )
                },
            },
        }
    );

    // Mendapatkan user dari sesi
    const { data: { user } } = await supabase.auth.getUser();

    // Route Guard
    const url = request.nextUrl.clone();

    if (url.pathname.startsWith('/admin')) {
        if (!user) {
            // Jika tidak login, lempar ke login
            return NextResponse.redirect(new URL('/login', request.url));
        }
        
        /* CATATAN PENTING:
           Jika hanya cek '!user', user biasa pun bisa masuk ke /admin asal mereka login.
           Untuk skripsi/projek yang matang, idealnya cek role di sini.
        */
    }

    return supabaseResponse
}