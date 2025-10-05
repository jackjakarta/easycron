type PageContainerProps = {
  children: React.ReactNode;
  wide?: boolean;
};

export default function PageContainer({ children, wide = false }: PageContainerProps) {
  if (wide) {
    return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </div>
  );
}
