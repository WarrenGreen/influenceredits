import Head from 'next/head';
import { Theme, ThemePanel } from '@radix-ui/themes';

export default function Layout ({children}) {
  return (
    <>
      <Head>
        <title>AdEditor</title>
      </Head>
      {children}
    </>
  )
}