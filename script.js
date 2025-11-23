const DATA_URL = "data.json";
const OMNIFIT_START = new Date("2024-05-13");

const cardTitle = document.getElementById("cardTitle");
const cardSubtitle = document.getElementById("cardSubtitle");
const motiveLabel = document.getElementById("motiveLabel");
const heatmapRow = document.getElementById("heatmapRow");
const panel = document.getElementById("motivePanel");
const dimOverlay = document.getElementById("dimOverlay");
const panelContent = document.getElementById("panelContent");

let jsonData = [];
let todayEntry = null;

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    jsonData = await res.json();
  } catch (err) {
    console.error("JSON Load Error:", err);
    jsonData = [];
  }

  findTodayEntry();
  renderCard();
  renderHeatmap();
}

loadData();

function findTodayEntry() {
  const todayStr = new Date().toISOString().slice(0, 10);
  todayEntry = jsonData.find(d => d.date === todayStr) || {
    date: todayStr,
    category: "Coming Soon",
    emoji: "⏳",
    micro_exercise_title: "Content Coming Soon",
    micro_exercise: "Your OMNIFIT session is on the way.",
    motivation: {
      Educational: "Content will appear soon.",
      Direct: "Check back later.",
      Playful: "Even widgets warm up.",
      Identity: "Consistency includes patience."
    }
  };
}

function getDayNumber(dateStr) {
  return Math.floor((new Date(dateStr) - OMNIFIT_START) / 86400000) + 1;
}

function renderCard() {
  cardTitle.textContent = todayEntry.micro_exercise_title;
  cardSubtitle.textContent =
    `Day ${getDayNumber(todayEntry.date)} | ${todayEntry.category} ${todayEntry.emoji}`;
  motiveLabel.textContent = "Tap a motivation";
}

document.querySelectorAll(".tile").forEach(tile => {
  tile.addEventListener("click", () => {
    document.querySelectorAll(".tile").forEach(t => t.classList.remove("active"));
    tile.classList.add("active");

    const key = tile.dataset.motive;
    motiveLabel.textContent = key;

    panelContent.innerHTML = `
      <h3>${key}</h3>
      <p>${todayEntry.motivation[key]}</p>
    `;

    panel.classList.add("open");
    dimOverlay.style.opacity = "1";
    dimOverlay.style.pointerEvents = "auto";
  });
});

document.getElementById("closePanel").onclick = closePanel;
dimOverlay.onclick = closePanel;

function closePanel() {
  panel.classList.remove("open");
  dimOverlay.style.opacity = "0";
  dimOverlay.style.pointerEvents = "none";
}

function renderHeatmap() {
  heatmapRow.innerHTML = "";
  const DAYS = 90;
  const today = new Date();

  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const ds = d.toISOString().slice(0, 10);
    const match = jsonData.find(x => x.date === ds);

    let level = 0;
    if (match) {
      switch (match.category) {
        case "Active Recovery":
        case "Practice": level = 1; break;
        case "Train":
        case "Aerobic Capacity": level = 2; break;
        case "Forge":
        case "Heavy": level = 3; break;
      }
    }

    const pill = document.createElement("div");
    pill.className = `hm-pill hm-${level}`;
    if (ds === today.toISOString().slice(0, 10)) {
      pill.classList.add("hm-today");
    }
    heatmapRow.appendChild(pill);
  }
}
