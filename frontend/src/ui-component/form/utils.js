export function parseIntOrUndefined(value) {
  return value ? parseInt(value) : undefined;
}

export function isValidNumber(value, decimal) {
  let floatValue = value;
  if (decimal) {
    floatValue = floatValue * decimal * 10;
  }
  return !isNaN(value) && value >= 0 && floatValue % 1 === 0;
}
