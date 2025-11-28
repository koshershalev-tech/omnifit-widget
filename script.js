// === DAY LOGIC ===
function daysSinceOmnifitStart() {
  const start = new Date("2024-05-13");
  const now = new Date();
  return Math.floor((now - start) / 86400000);
}

let offset = 0;

function cycleDay(raw) {
  return ((raw - 1) % 31) + 1;
}

// === LOAD DATA ===
async function loadDay() {
  const raw = daysSinceOmnifitStart() + offset;
  const day = cycleDay(raw);

  const res = await fetch("data-2.json");
  const data = await res.json();

  const item = data.find(d => d.day === day);

  if (!item) {
    fallback(raw);
    return;
  }

  updateCard(item, raw);
  updateMotivations(item);
  drawHeatmap(day);
}

function fallback(raw) {
  cardTitle.innerText = "Content Coming Soon";
  cardSubtitle.innerText = `Day ${raw} | Coming Soon ⏳`;
  motiveLabel.innerText = "Tap a motivation";
}

// === UPDATE MAIN CARD ===
function updateCard(entry, raw) {
  cardTitle.innerText = entry.title;
  cardSubtitle.innerText = `Day ${raw} | ${entry.category}`;
  motiveLabel.innerText = entry.micro_exercise;
}

// === HEATMAP ===
function drawHeatmap(activeDay) {
  const hm = document.getElementById("heatmapRow");
  hm.innerHTML = "";

  for (let i = 1; i <= 31; i++) {
    const p = document.createElement("div");
    p.classList.add("hm-pill");
    if (i === activeDay) p.classList.add("active");
    hm.appendChild(p);
  }
}

// === MOTIVATIONS PANEL ===
function updateMotivations(entry) {
  const tiles = document.querySelectorAll(".tile");
  const panel = document.getElementById("motivePanel");
  const overlay = document.getElementById("dimOverlay");
  const content = document.getElementById("panelContent");

  tiles.forEach(t => {
    t.onclick = () => {
      const key = t.dataset.motive;
      content.innerHTML =
        `<h3>${key}</h3><p>${entry.motivation[key]}</p>`;
      panel.classList.add("open");
      overlay.classList.add("open");
    };
  });

  document.getElementById("closePanel").onclick =
    () => closePanel(panel, overlay);

  overlay.onclick = () => closePanel(panel, overlay);
}

function closePanel(panel, overlay) {
  panel.classList.remove("open");
  overlay.classList.remove("open");
}

// === DAY NAV ===
document.getElementById("prevDay").onclick = () => {
  offset--;
  loadDay();
};

document.getElementById("nextDay").onclick = () => {
  offset++;
  loadDay();
};

// === INIT ===
loadDay();
