import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            // Attempt to sync user to Hono/MongoDB
            try {
                const response = await fetch('http://localhost:8000/users/init', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${data.session.access_token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {

                    console.warn('Hono user sync failed during callback, but proceeding with login.')
                    return NextResponse.redirect(`${origin}/auth/signout`)
                }
            } catch (err) {
                // Network error or Hono is down — log it, but do NOT block login
                console.error('Could not reach Hono backend during callback:', err)
                return NextResponse.redirect(`${origin}/auth/signout`)
            }

            // Let the user into the app anyway. 
            // Hono will create their MongoDB profile lazily when they fetch data.
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

