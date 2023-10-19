export function random(number1: number, number2: number) {
  return number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
}
