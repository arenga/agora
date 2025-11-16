export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-h2 text-primary">아고라</h1>
          <p className="text-body-sm text-muted-foreground">
            철학과 토론의 광장
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
