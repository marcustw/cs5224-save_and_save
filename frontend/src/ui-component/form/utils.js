export function parseIntOrUndefined(value) {
  return value ? parseInt(value) : undefined;
}

export function isValidNumber(value, decimal) {
  let floatValue = value;
  if (decimal) {
    floatValue = floatValue * Math.pow(10, decimal);
  }
  return !isNaN(value) && value >= 0 && floatValue % 1 === 0;
}
