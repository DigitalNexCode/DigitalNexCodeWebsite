const WORDS_PER_MINUTE = 225;

export const calculateReadTime = (content: string | null): string => {
  if (!content) {
    return '1 min read';
  }

  // Strip HTML tags to get plain text
  const text = content.replace(/<[^>]+>/g, '');
  
  // Count words
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  // Calculate read time in minutes, rounding up
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return `${minutes} min read`;
};
