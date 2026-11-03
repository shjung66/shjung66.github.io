const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Research page: "Research Areas" / "All Papers" tabs.
// The All Papers list is built from the research-area lists (one entry per
// data-paper-id), so a new paper only has to be added to its research area.
const researchTabs = document.querySelector(".research-tabs");
const areasPanel = document.getElementById("panel-areas");
const allPanel = document.getElementById("panel-all");
// Older papers outside the research areas, listed only in the All Papers tab
const paperArchive = document.getElementById("paper-archive");

if (researchTabs && areasPanel && allPanel) {
  const tabs = Array.from(researchTabs.querySelectorAll('[role="tab"]'));
  // One list, like the research-area lists: in progress, under review,
  // accepted, then published papers (newest first). Each paper keeps its
  // status and index tags.
  const statusOrder = ["current", "review", "accepted", "published"];

  const seen = new Set();
  const papers = [];
  const studyItems = [areasPanel, paperArchive]
    .filter(Boolean)
    .flatMap((source) => Array.from(source.querySelectorAll("li.research-study[data-paper-id]")));
  studyItems.forEach((li) => {
    const id = li.dataset.paperId;
    // CP = conference presentation (listed under Conference Presentations)
    if (seen.has(id) || id.startsWith("CP")) return;
    seen.add(id);
    const tags = Array.from(li.querySelectorAll(".publication-status")).map((t) => t.textContent.trim());
    let status = "published";
    if (tags.includes("In progress")) status = "current";
    else if (tags.includes("Under review")) status = "review";
    else if (tags.includes("Accepted")) status = "accepted";
    const metaEl = li.querySelector(".study-meta");
    const yearMatch = (metaEl ? metaEl.textContent : "").match(/(\d{4})\.?\s*$/);
    papers.push({
      li,
      status,
      year: yearMatch ? Number(yearMatch[1]) : 0,
      date: li.dataset.date || "", // "YYYY-MM", orders papers within a year
      num: Number(id.replace(/\D/g, "")),
    });
  });

  papers.sort((a, b) => {
    const byStatus = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    if (byStatus) return byStatus;
    if (a.status !== "published") return a.num - b.num;
    return b.year - a.year || b.date.localeCompare(a.date) || b.num - a.num;
  });

  // Published papers are numbered, the newest with the highest number
  let number = papers.filter((p) => p.status === "published").length;
  const list = document.createElement("ul");
  list.className = "research-study-list paper-list";
  papers.forEach((p) => {
    const item = p.li.cloneNode(true);
    if (p.status === "published") {
      const num = document.createElement("span");
      num.className = "paper-num";
      num.textContent = `${number--}.`;
      item.prepend(num);
    }
    list.append(item);
  });
  allPanel.append(list);

  const select = (tab, updateUrl) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (updateUrl) {
      const hash = tab.id === "tab-all" ? "#all-papers" : "";
      history.replaceState(null, "", location.pathname + location.search + hash);
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, true));
    tab.addEventListener("keydown", (event) => {
      const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      const next = tabs[(keys[event.key] + tabs.length) % tabs.length];
      next.focus();
      select(next, true);
    });
  });

  researchTabs.hidden = false;
  const heading = document.querySelector(".research-heading");
  if (heading) heading.hidden = true;
  // Open the All Papers tab from a link to research.html#all-papers;
  // other in-page links (such as #main) leave the tabs as they are.
  const fromHash = () => {
    if (location.hash === "#all-papers") select(tabs[1], false);
    else if (!location.hash) select(tabs[0], false);
  };
  window.addEventListener("hashchange", fromHash);
  if (location.hash === "#all-papers") fromHash();
}
