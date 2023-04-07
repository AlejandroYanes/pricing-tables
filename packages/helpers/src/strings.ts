export function resolveInitials(name: string) {
  return name.split(' ').map((part) => part.at(0)?.toUpperCase()).join('').slice(0, 2);
}
