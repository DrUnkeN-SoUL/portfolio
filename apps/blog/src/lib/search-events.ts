export const OPEN_SEARCH_EVENT = "blog:open-search";

export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
