import Header from './_components/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      {children}
    </main>
  );
}
