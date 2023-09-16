import Link from 'next/link'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useUser} from '@supabase/auth-helpers-react'
export const metadata = {
  title: 'Sign In',
}

export default function Login() {
  const supabaseClient = createClientComponentClient()
  const user = useUser()
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-purple-600 hover:underline"
        >
          Sign up
        </Link>{' '}
        for a free trial.
      </p>
      <Auth
        redirectTo="https://www.adeditor.io/app/dashboard"
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        providers={['google']}
        socialLayout="horizontal"
      />
    </SlimLayout>
  )
}
