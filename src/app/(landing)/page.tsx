import CTA from './_components/cta';
import DeveloperAPI from './_components/developer-api';
import Features from './_components/features';
import Hero from './_components/hero';
import Stats from './_components/stats';

export default function Page() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <DeveloperAPI />
      <CTA />
    </>
  );
}
