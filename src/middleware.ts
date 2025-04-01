import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    //gets the user session
    //REMEMBER TO ALWAYS USE getUser() for security reasons
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    //if user session doesnt exist
    if (!user && pathname !== '/login' && pathname !== '/sign-up' && pathname!=='/welcome') {
        return NextResponse.redirect(new URL('/welcome', request.url))
    }

    //if user session exists, redirect to "/"
    if (user && (pathname === '/login' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return supabaseResponse
}
    