export default function capitalizeWord(nameString) {
  if (typeof nameString !== 'string' || nameString.trim() === '') {
    return;
  }

  const words = nameString.trim().split(/\s+/);

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(' ');
}
