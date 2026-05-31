const regex = /((?:api_key|apikey|secret|token|password|email|phone|ssn|credit_card)["']?\s*[:=]\s*)(?:(")([^"]*)(")|(')([^']*)(')|([^,\]\}\s]+))/gi;

const str1 = '{"email": "user@example.com"}';
const str2 = "{'email': 'user@example.com'}";
const str3 = "token: 'Bearer 12345'";
const str4 = "token=Bearer12345";

const replaceFn = (match, p1, p2, p3, p4, p5, p6, p7, p8) => {
  if (p8 && (p8.startsWith('[') || p8.startsWith('{'))) {
    return match;
  }
  if (p2) return p1 + p2 + "[REDACTED]" + p4;
  if (p5) return p1 + p5 + "[REDACTED]" + p7;
  return p1 + '"[REDACTED]"';
};

console.log(str1.replace(regex, replaceFn));
console.log(str2.replace(regex, replaceFn));
console.log(str3.replace(regex, replaceFn));
console.log(str4.replace(regex, replaceFn));
