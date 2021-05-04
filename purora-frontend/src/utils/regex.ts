export const regexId = /^[A-Za-z0-9]*$/g;
export const regexPw = /^((?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]*){6,}$/g;

export const regexMatch = (str: string, regex: RegExp) => {
  const matched = str.match(regex);
  return (matched !== null && matched[0].length !== 0);
}