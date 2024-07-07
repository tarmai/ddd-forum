export function fizzbuzz(num: number): string | Error {
  if (typeof num !== "number") return new Error("Input is not a number");

  if (num < 1 || num > 100) return new Error("Number is bigger than 100");

  if (num % 5 === 0 && num % 3 === 0) return "FizzBuzz";
  else if (num % 5 === 0) return "Buzz";
  else if (num % 3 === 0) return "Fizz";

  return num.toString();
}
