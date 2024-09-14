export const isPalindrome = (text: string): boolean => {
  const textWithoutSpaces = text.replace(/\s/g, "");
  const lowerCaseText = textWithoutSpaces.toLowerCase();
  const reversedText = lowerCaseText.split("").reverse().join("");

  return lowerCaseText === reversedText;
};
