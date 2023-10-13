import '@radix-ui/themes/styles.css';

import '@/styles/global.css'
import { Inter, Lexend } from 'next/font/google'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import LoaderPage from '@/components/LoaderPage'
import ReactGA from "react-ga4";
import Script from 'next/script';


export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})


function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleRouteChange = (url) => {
      setLoading(true)
    }

    const handleRouteChangeComplete = () => {
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events])

  ReactGA.initialize("G-CJ5TKMZDY3");
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <main className={`${inter.variable} font-sans ${lexend.variable}`} style={{height: "100%"}}>
      <Script id="google ads script 1" async src="https://www.googletagmanager.com/gtag/js?id=AW-11370530041"></Script>
        <Script id="google ads script 2" dangerouslySetInnerHTML={{
          __html:`
          window.dataLayer = window.dataLayer || [];
          (function gtag(){dataLayer.push(arguments)});
          gtag('js', new Date());

          gtag('config', 'AW-11370530041');`}}>

        </Script>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}</style>
        {loading? <LoaderPage /> : <Component {...pageProps} />}
      </main>
      </SessionContextProvider>
  )
}

export default MyApp
