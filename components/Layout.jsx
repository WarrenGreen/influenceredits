import Head from 'next/head';
import { Theme, ThemePanel } from '@radix-ui/themes';

export default function Layout ({children}) {
  return (
    <>
      <Head>
        <title>influencer edits</title>
      </Head>
      <Theme accentColor="violet" radius="none">
      {children}
      </Theme>
    </>
  )
}