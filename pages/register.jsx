import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useUser} from '@supabase/auth-helpers-react'

export const metadata = {
  title: 'Sign Up',
}

export default function Register() {
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
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-medium text-purple-600 hover:underline"
        >
          Sign in 
        </Link>
        to your account.
      </p>
      <Auth
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        providers={['google']}
        socialLayout="horizontal"
        onlyThirdPartyProviders={true}
        redirectTo='https://adeditor.io/api/auth/new_user'
      />
    </SlimLayout>
  )
}
