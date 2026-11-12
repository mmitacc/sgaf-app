export function abrirVentanaPasarela(
  url: string,
  onVentanaCerrada?: () => void,
) {
  const width = 520;
  const height = 720;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    url,
    "PasarelaTechUniversity",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  );

  // Si el navegador bloqueó el popup, abrimos en una pestaña nueva como respaldo
  if (!popup) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  popup.focus();

  // Monitoreamos cada 800ms si el usuario cerró la ventana tras confirmar el pago
  if (onVentanaCerrada) {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        onVentanaCerrada();
      }
    }, 800);
  }
}
