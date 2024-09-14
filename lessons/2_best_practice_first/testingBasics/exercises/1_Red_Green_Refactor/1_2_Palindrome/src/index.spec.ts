import { isPalindrome } from "./index";
describe("palindrome checker", () => {
  it("should know that racecar is a palindrome", () => {
    expect(isPalindrome("racecar")).toBe(true);
  });

  it("should know that hello is not a palindrome", () => {
    expect(isPalindrome("hello")).toBe(false);
  });

  it("should know that a is a palindrome", () => {
    expect(isPalindrome("a")).toBe(true);
  });

  it("should know that an empty string is a palindrome", () => {
    expect(isPalindrome("")).toBe(true);
  });

  it("should know that Mom is pallindrome", () => {
    expect(isPalindrome("Mom")).toBe(true);
  });

  it("should know that 'Was it a car or a cat I saw' is a palindrome", () => {
    expect(isPalindrome("Was it a car or a cat I saw")).toBe(true);
  });

  it("should know that 'never odd or even' is a palindrome", () => {
    expect(isPalindrome("never odd or even")).toBe(true);
  });
});
