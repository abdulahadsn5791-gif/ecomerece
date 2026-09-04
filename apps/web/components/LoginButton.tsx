'use client'

import { createClient } from '@/utils/supabase/client'

export default function LoginButton() {
    const handleLogin = async () => {
        const supabase = createClient()

        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <button onClick={handleLogin}>
            Sign in with Google
        </button>
    )
}