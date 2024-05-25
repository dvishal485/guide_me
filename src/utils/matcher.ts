import { URL } from "url";

export default function match(url: URL, regexString: string): boolean {
  const regex = new RegExp(regexString);
  return regex.test(url.pathname);
}

// Example usage:
// const url = new URL("https://example.com/login/ok");
// const regexString = "^/login$";

// const isMatch = isPathnameMatch(url, regexString);
// console.log(isMatch); // Output: false
