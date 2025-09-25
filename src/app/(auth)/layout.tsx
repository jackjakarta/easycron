export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Auth Route</h1>
        <p className="text-gray-500">Part of auth routes</p>
        {children}
      </div>
    </div>
  );
}
