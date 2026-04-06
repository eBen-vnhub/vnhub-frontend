export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-12 border-t border-border-subtle bg-surface/50">
      <div className="text-center">
        <p className="text-sm text-muted">
          © {currentYear} <span className="text-brand font-semibold">eBen</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
