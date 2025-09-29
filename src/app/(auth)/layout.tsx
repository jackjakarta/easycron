export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="bg-background absolute inset-0 z-0" />
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
}
