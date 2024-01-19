export function required(message = "You can't leave this field empty") {
  const whitespaceRegex = /^\s*$/;

  return (v) => {
    if (!v || whitespaceRegex.test(v)) {
      return message;
    }

    return true;
  };
}

export function email(message = "This email is not valid") {
  return (v) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || message;
}
