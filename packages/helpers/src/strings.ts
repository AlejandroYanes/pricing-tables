export function resolveInitials(name: string) {
  return name.split(' ').map((part) => part.at(0)?.toUpperCase()).join('').slice(0, 2);
}

export function generateQueryString(params: Record<string, string | number>) {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== '')
    .map((key) => `${key}=${params[key]}`).join('&');
}
