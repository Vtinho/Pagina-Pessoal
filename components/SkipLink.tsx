export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-page"
    >
      {label}
    </a>
  );
}
