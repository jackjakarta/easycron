export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none">{children}</article>
      </div>
    </div>
  );
}
