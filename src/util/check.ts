export function isURL(domain: string) : boolean {
  return /[ http:// | https:// ][a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(domain);
}