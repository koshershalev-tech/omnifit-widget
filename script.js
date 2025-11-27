// ============================================================
// OMNIFIT — DAY COUNT LOGIC
// Start date: 13 May 2024
// ============================================================

function daysSinceOmnifitStart() {
  const startDate = new Date("2024-05-13T00:00:00");
  const today = new Date();
  const diff = today - startDate;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ============================================================
// 31-DAY CYCLE LOGIC
// ============================================================

function getCycleDay(rawDay) {
  const cycleLength = 31;
  const index = rawDay % cycleLength;
  return index === 0 ? cycleLength : index;
}

// ============================================================
// GLOBAL OFFSET (Prev/Next navigation)
// ============================================================

let manualOffset = 0;

// Wrapper function to reload with offset
function refreshWithOffset() {
  loadDailyExercise(manualOffset);
}

// ============================================================
// MAIN DATA LOADER
// ============================================================

async function loadDailyExercise(offset = 0) {
  try {
    const response = await fetch("data-2.json");
    const data = await response.json();

    const rawDay = daysSinceOmnifitStart() + offset;
    const cycleDay = getCycleDay(rawDay);

    const entry = data.find(d => d.day === cycleDay);

    if (!entry) {
      displayFallback(rawDay);
      return;
    }

    updateMainCard(entry, rawDay);
    setupMotivationButtons(entry);
    generateHeatmap(rawDay);

  } catch (err) {
    console.error("JSON Load Error:", err);
    displayFallback(daysSinceOmnifitStart());
  }
}

// ============================================================
// UPDATE MAIN CARD UI (TITLE, SUBTITLE, EXERCISE TEXT)
// ============================================================

function updateMainCard(entry, rawDay) {
  // Title = workout title
  document.getElementById("cardTitle").innerText = entry.title;

  // Subtitle = Day XXX | Category
  document.getElementById("cardSubtitle").innerText =
    `Day ${rawDay} | ${entry.category}`;

  // Exercise text = inside main card white area
  document.getElementById("motiveLabel").innerText = entry.micro_exercise;
}

// ============================================================
// MOTIVATION PANEL LOGIC
// ============================================================

function setupMotivationButtons(entry) {
  const tiles = document.querySelectorAll(".tile");
  const panel = document.getElementById("motivePanel");
  const overlay = document.getElementById("dimOverlay");
  const panelContent = document.getElementById("panelContent");

  tiles.forEach(tile => {
    tile.onclick = () => {
      const key = tile.dataset.motive;
      panelContent.innerText = entry.motivation[key] || "No motivation found.";
      panel.style.display = "block";
      overlay.style.display = "block";
    };
  });

  // Close panel
  document.getElementById("closePanel").onclick = closePanel;
  overlay.onclick = closePanel;

  function closePanel() {
    panel.style.display = "none";
    overlay.style.display = "none";
  }
}

// ============================================================
// HEATMAP RENDERING
// ============================================================

function generateHeatmap(rawDay) {
  const heatmap = document.getElementById("heatmapRow");
  heatmap.innerHTML = "";

  const cycleLength = 31;
  const cycleIndex = getCycleDay(rawDay);

  for (let i = 1; i <= cycleLength; i++) {
    const cell = document.createElement("div");
    cell.classList.add("hm-cell");
    if (i === cycleIndex) {
      cell.classList.add("active");
    }
    heatmap.appendChild(cell);
  }
}

// ============================================================
// FALLBACK STATE
// ============================================================

function displayFallback(rawDay) {
  document.getElementById("cardTitle").innerText = "Content Coming Soon";
  document.getElementById("cardSubtitle").innerText =
    `Day ${rawDay} | Coming Soon ⏳`;
  document.getElementById("motiveLabel").innerText =
    "Tap a motivation to preview text.";
}

// ============================================================
// DAY NAVIGATION BUTTONS
// ============================================================

document.getElementById("prevDay").addEventListener("click", () => {
  manualOffset -= 1;
  refreshWithOffset();
});

document.getElementById("nextDay").addEventListener("click", () => {
  manualOffset += 1;
  refreshWithOffset();
});

// ============================================================
// INITIAL LOAD
// ============================================================

loadDailyExercise();
