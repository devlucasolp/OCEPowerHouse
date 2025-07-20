/**
 * Utility function for consistent date formatting that prevents hydration mismatches
 * Uses a consistent format that works the same on server and client
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Use a consistent format that doesn't depend on locale
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Alternative function that uses Intl.DateTimeFormat with explicit options
 * This ensures consistent formatting across server and client
 */
export const formatDateWithIntl = (dateString: string | Date): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};
