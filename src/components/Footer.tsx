export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-text-muted/10 bg-bg-surface/50 py-4 text-center text-xs text-text-muted">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:px-6 max-w-7xl mx-auto">
        <p>
          &copy; {currentYear} Tech University. Todos los derechos reservados.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:text-text-base transition-colors">
            Términos de Servicio
          </a>
          <a href="#" className="hover:text-text-base transition-colors">
            Soporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
