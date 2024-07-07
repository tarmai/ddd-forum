import { fizzbuzz } from "./fizzbuzz";

describe("fizzbuzz", () => {
  it("should return '1' when given 1", () => {
    expect(fizzbuzz(1)).toBe("1");
  });

  it("should return '2' when given 2", () => {
    expect(fizzbuzz(2)).toBe("2");
  });

  it("should return 'Fizz' when given 3", () => {
    expect(fizzbuzz(3)).toBe("Fizz");
  });

  it('should return "Fizz" when given 6', () => {
    expect(fizzbuzz(6)).toBe("Fizz");
  });

  it('should return "Buzz" when given 5', () => {
    expect(fizzbuzz(5)).toBe("Buzz");
  });

  it('should return "FizzBuzz" when given 15', () => {
    expect(fizzbuzz(15)).toBe("FizzBuzz");
  });

  it('should return "FizzBuzz" when given 30', () => {
    expect(fizzbuzz(30)).toBe("FizzBuzz");
  });

  it("should return error if number is bigger than 100", () => {
    expect(fizzbuzz(101)).toBeInstanceOf(Error);
  });

  it("should return error if number is less than 1", () => {
    expect(fizzbuzz(0)).toBeInstanceOf(Error);
  });

  it("should return error if input is not a number", () => {
    expect(fizzbuzz("1" as any)).toBeInstanceOf(Error);
  });
});
