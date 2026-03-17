import FellogicLogo from "./FellogicLogo";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
    <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between h-14">
      <a href="/" className="hover:opacity-80 transition-opacity">
        <FellogicLogo size="small" />
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="#platforms" className="text-sm text-slate-body hover:text-foreground transition-colors">Platforms</a>
        <a href="#gigs" className="text-sm text-slate-body hover:text-foreground transition-colors">Gigs</a>
        <a href="#scoping" className="text-sm text-slate-body hover:text-foreground transition-colors">Scoping</a>
      </div>
      <a
        href="#scoping"
        className="px-4 py-2 text-xs font-medium bg-foreground text-primary-foreground rounded transition-colors hover:bg-foreground/90"
      >
        Get Started
      </a>
    </div>
  </nav>
);

export default Navbar;
