const searchButton = document.querySelector("[data-open-search]");
const searchDialog = document.querySelector("#siteSearch");
const searchInput = document.querySelector("#siteSearchInput");
const searchItems = Array.from(document.querySelectorAll("[data-search-item]"));
const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("#topNav");
const backTop = document.querySelector("[data-back-top]");

function openSearch() {
  if (!searchDialog) return;
  searchDialog.showModal();
  searchInput?.focus();
}

function closeSearch() {
  if (searchDialog?.open) searchDialog.close();
}

searchButton?.addEventListener("click", openSearch);

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "Escape") {
    closeSearch();
  }
});

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  searchItems.forEach((item) => {
    const haystack = item.dataset.searchItem.toLowerCase();
    item.hidden = query.length > 0 && !haystack.includes(query);
  });
});

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  nav?.toggleAttribute("data-open", !expanded);
});

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
