import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {SessionHeader} from '@/components/SessionHeader'
import { Hero } from '@/components/Hero'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { Testimonials } from '@/components/Testimonials'
import {useSession} from '@supabase/auth-helpers-react';
import VideoModal from '../components/VideoModal'

export default function Home() {
  const user = useSession();

  return (
    <>
      {user ? <SessionHeader />  : <Header />}
      <main>
        <Hero />
        <PrimaryFeatures />
        {/*<Testimonials />*/}
        <Pricing />
        <CallToAction />

      </main>
      <Footer />
    </>
  )
}
