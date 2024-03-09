// utils/validators.js

export const required = value => !!value || 'This field is required';

export function email(message = "This email is not valid") {
  return (v) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || message;
}

export const number = value => !isNaN(parseFloat(value)) && isFinite(value) || 'Must be a number';

export const min = minValue => value => parseFloat(value) >= minValue || `Minimum value is ${minValue}`;

export const max = maxValue => value => parseFloat(value) <= maxValue || `Maximum value is ${maxValue}`;
