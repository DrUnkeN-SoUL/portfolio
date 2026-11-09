export const OPEN_SEARCH_EVENT = "blog:open-search";

/** Open the search dialog from anywhere (sidebar box, header button). */
export function openSearch() {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
