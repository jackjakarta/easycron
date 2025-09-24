export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-500">Sign in to your account</p>
        {children}
      </div>
    </div>
  );
}
