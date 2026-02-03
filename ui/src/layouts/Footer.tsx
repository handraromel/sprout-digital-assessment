export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-elevated)]">
      <div className="px-4 py-4 md:px-6">
        {/* Single Row Layout */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
          {/* Brand & Description */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {"Sprout Digital Assessment"}
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-[var(--foreground-muted)]">
            &copy; {currentYear} {"Sprout Digital Assessment"}
          </p>
        </div>
      </div>
    </footer>
  );
}
