/** Browser navigation helper — kept tiny so tests can mock it under jsdom. */
export function redirectTo(url: string): void {
  window.location.href = url;
}
