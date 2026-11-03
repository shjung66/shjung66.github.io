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

if (researchTabs && areasPanel && allPanel) {
  const tabs = Array.from(researchTabs.querySelectorAll('[role="tab"]'));
  const groups = [
    { key: "current", en: "In Progress", ko: "진행 중" },
    { key: "review", en: "Under Review", ko: "심사 중" },
    { key: "accepted", en: "Accepted", ko: "게재 승인" },
    { key: "published", en: "Published", ko: "게재 논문" },
  ];
  const indexOrder = ["SCIE", "SSCI", "SCOPUS", "KCI"];

  const seen = new Set();
  const papers = [];
  areasPanel.querySelectorAll("li.research-study[data-paper-id]").forEach((li) => {
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
    const indexEl = li.querySelector(".index-tag");
    papers.push({
      li,
      status,
      year: yearMatch ? Number(yearMatch[1]) : 0,
      index: indexEl ? indexEl.textContent.trim() : "",
      num: Number(id.replace(/\D/g, "")),
    });
  });

  const byStatus = (key) => papers.filter((p) => p.status === key);
  const published = byStatus("published").sort((a, b) => b.year - a.year || b.num - a.num);

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const indexCounts = indexOrder
    .map((name) => [name, published.filter((p) => p.index === name).length])
    .filter(([, n]) => n > 0)
    .map(([name, n]) => `${name} ${n}`)
    .join(" · ");
  const summary = el("p", "paper-summary");
  summary.append(
    el("strong", "", `게재 ${published.length}편`),
    ` (${indexCounts}) · 게재 승인 ${byStatus("accepted").length}편 · 심사 중 ${byStatus("review").length}편 · 진행 중 ${byStatus("current").length}편`
  );
  // Jack's role, read from the author line: his name is in <strong>, and
  // a "*" after a name marks the corresponding author.
  const myName = (p) => p.li.querySelector(".study-authors strong");
  const firstCount = published.filter((p) => {
    const me = myName(p);
    return me && !me.previousSibling;
  }).length;
  const corrCount = published.filter((p) => {
    const me = myName(p);
    return me && me.textContent.trim().endsWith("*");
  }).length;
  if (firstCount || corrCount) {
    summary.append(el("br"), `게재 논문 중 1저자 ${firstCount}편 · 교신저자 ${corrCount}편 (* 교신저자)`);
  }
  allPanel.append(summary);

  let number = published.length;
  groups.forEach((group) => {
    const items = group.key === "published" ? published : byStatus(group.key).sort((a, b) => a.num - b.num);
    if (!items.length) return;
    const title = el("h3", "paper-group-title", `${group.en} `);
    title.append(el("span", "section-title-ko", group.ko), el("span", "paper-count", String(items.length)));
    allPanel.append(title);

    const years = group.key === "published" ? [...new Set(items.map((p) => p.year))] : [null];
    years.forEach((year) => {
      if (year) allPanel.append(el("h4", "paper-year", String(year)));
      const list = el("ul", "research-study-list paper-list");
      items
        .filter((p) => year === null || p.year === year)
        .forEach((p) => {
          const item = p.li.cloneNode(true);
          if (group.key === "published") item.prepend(el("span", "paper-num", `${number--}.`));
          list.append(item);
        });
      allPanel.append(list);
    });
  });

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
