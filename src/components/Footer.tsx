import FellogicLogo from "./FellogicLogo";

const Footer = () => (
  <footer className="py-12 border-t border-border">
    <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <FellogicLogo size="small" />
        <p className="text-xs text-muted-foreground mt-2">Fabrice Emanuel Lindblom-Levy · Enterprise Integration Consultancy</p>
      </div>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FELLOGIC. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
