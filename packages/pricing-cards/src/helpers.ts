export function resolveDomain(internal: boolean) {
  const currentUrl = new URL(window.location.href);
  return internal ? currentUrl.origin : 'https://dealo.app';
}
