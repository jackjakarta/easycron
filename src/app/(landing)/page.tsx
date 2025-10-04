import { CTA } from './cta';
import { Features } from './features';
import { Header } from './header';
import { Hero } from './hero';
import { Stats } from './stats';

export default function Page() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <CTA />
    </main>
  );
}
