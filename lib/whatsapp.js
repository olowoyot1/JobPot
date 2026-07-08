function toWhatsAppLink(number, message) {
  const digits = (number || '').replace(/[^0-9]/g, '');
  if (!digits) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

module.exports = { toWhatsAppLink };
