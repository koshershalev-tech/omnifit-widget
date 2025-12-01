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
// 31-DAY CYCLE LOGIC (for data lookup)
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

    // update weekly bar pills
    updateWeekPills(rawDay);

    if (!entry) {
      displayFallback(rawDay);
      return;
    }

    updateMainCard(entry, rawDay);
    setupMotivationButtons(entry);

  } catch (err) {
    console.error("JSON Load Error:", err);
    displayFallback(daysSinceOmnifitStart());
  }
}

// ============================================================
// UPDATE MAIN CARD UI
// ============================================================

function updateMainCard(entry, rawDay) {

  // Title
  document.getElementById("cardTitle").innerText = entry.title;

  // Subtitle
  document.getElementById("cardSubtitle").innerText =
    `Day ${rawDay} | ${entry.category}`;

  // Exercise text
  document.getElementById("motiveLabel").innerText = entry.micro_exercise;
}

// ============================================================
// MOTIVATION PANEL
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
      openPanel();
    };
  });

  document.getElementById("closePanel").onclick = closePanel;
  overlay.onclick = closePanel;

  function openPanel() {
    panel.classList.add("open");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
  }

  function closePanel() {
    panel.classList.remove("open");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  }
}

// ============================================================
// WEEK BAR (7 PILLS)
// ============================================================
// Weekly pill index = (rawDay % 7)
// Green pill moves with Prev/Next Day

function updateWeekPills(offset = 0) {
  const pillsContainer = document.getElementById("weekPills");
  pillsContainer.innerHTML = "";

  // FIXED: Local time, not UTC
  const startDate = new Date(2024, 4, 13);

  const rawDay = daysSinceOmnifitStart() + offset;

  // FIXED: compute displayed date using local time
  const workoutDate = new Date(startDate.getTime() + rawDay * 86400000);

  const weekday = workoutDate.getDay();

  for (let i = 0; i < 7; i++) {
    const pill = document.createElement("div");
    pill.classList.add("week-pill");
    if (i === weekday) pill.classList.add("active");
    pillsContainer.appendChild(pill);
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
  loadDailyExercise(manualOffset);
});

document.getElementById("nextDay").addEventListener("click", () => {
  manualOffset += 1;
  loadDailyExercise(manualOffset);
});

// ============================================================
// INITIAL LOAD
// ============================================================

loadDailyExercise();
