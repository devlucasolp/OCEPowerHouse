/**
 * Utility functions for handling text content from Sanity CMS
 */

/**
 * Safely extracts plain text from Sanity description field
 * Handles both simple string and portable text formats
 */
export const getDescriptionText = (description: string | any): string => {
  if (!description) return '';
  
  // If it's already a string, return it
  if (typeof description === 'string') return description;
  
  // If it's a Sanity portable text array, extract the text
  if (Array.isArray(description)) {
    return description
      .map((block: any) => {
        if (block._type === 'block' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join('');
        }
        return '';
      })
      .join(' ')
      .trim();
  }
  
  // If it's a single block object
  if (description._type === 'block' && description.children) {
    return description.children
      .map((child: any) => child.text || '')
      .join('')
      .trim();
  }
  
  // Fallback: try to convert to string
  return String(description);
};

/**
 * Truncates text to a specific length and adds ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Combines getDescriptionText and truncateText for convenience
 */
export const getTruncatedDescription = (description: string | any, maxLength: number = 160): string => {
  const text = getDescriptionText(description);
  return truncateText(text, maxLength);
}; 