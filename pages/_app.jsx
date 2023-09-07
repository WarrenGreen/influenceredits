import '@radix-ui/themes/styles.css';

import RootLayout from './layout'
import '@/styles/global.css'
import { Inter, Lexend } from 'next/font/google'
import { Provider } from '@next-auth/client'

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
  return (
    <Provider session={pageProps.session}>
      <main className={`${inter.variable} font-sans ${lexend.variable}`} style={{height: "100%"}}>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}</style>
        <Component {...pageProps} />
      </main>
    </Provider>
  )
}

export default MyApp
