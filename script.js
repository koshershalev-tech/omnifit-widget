// ------------------------------
// OMNIFIT DAY COUNT (START: 13 May 2024)
// ------------------------------
function daysSinceOmnifitStart() {
  const startDate = new Date("2024-05-13T00:00:00");
  const today = new Date();
  const diffTime = today - startDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// ------------------------------
// 31-DAY CYCLE INDEX
// ------------------------------
function getCycleDay(rawDay) {
  const cycleLength = 31;
  const index = rawDay % cycleLength;
  return index === 0 ? cycleLength : index;
}

// ------------------------------
// LOAD DAILY EXERCISE
// ------------------------------
async function loadDailyExercise() {
  try {
    const response = await fetch("data-2.json");
    const data = await response.json();

    const rawDay = daysSinceOmnifitStart();
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
    console.error("Error loading JSON:", err);
    displayFallback(daysSinceOmnifitStart());
  }
}

// ------------------------------
// UPDATE MAIN CARD (TITLE + SUBTITLE + EXERCISE)
// ------------------------------
function updateMainCard(entry, rawDay) {

  // Title always the workout title
  document.getElementById("cardTitle").innerText = entry.title;

  // Subtitle shows: Day 564 | Train
  document.getElementById("cardSubtitle").innerText =
    `Day ${rawDay} | ${entry.category}`;

  // Exercise text goes inside the white card, under subtitle
  document.getElementById("motiveLabel").innerText = entry.micro_exercise;
}

// ------------------------------
// MOTIVATION BUTTON LOGIC
// ------------------------------
function setupMotivationButtons(entry) {
  const tiles = document.querySelectorAll(".tile");
  const panel = document.getElementById("motivePanel");
  const overlay = document.getElementById("dimOverlay");
  const panelContent = document.getElementById("panelContent");

  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const key = tile.dataset.motive;

      let text = entry.motivation[key];
      if (!text) text = "No motivation available.";

      panelContent.innerText = text;
      panel.style.display = "block";
      overlay.style.display = "block";
    });
  });

  // Close panel
  document.getElementById("closePanel").addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  function closePanel() {
    panel.style.display = "none";
    overlay.style.display = "none";
  }
}

// ------------------------------
// HEATMAP GENERATION
// ------------------------------
function generateHeatmap(rawDay) {
  const heatmap = document.getElementById("heatmapRow");
  heatmap.innerHTML = "";

  const total = 31; // one cycle
  const cycleIndex = getCycleDay(rawDay);

  for (let i = 1; i <= total; i++) {
    const cell = document.createElement("div");
    cell.classList.add("hm-cell");

    if (i === cycleIndex) {
      cell.classList.add("active");
    }

    heatmap.appendChild(cell);
  }
}

// ------------------------------
// FALLBACK
// ------------------------------
function displayFallback(rawDay) {
  document.getElementById("cardTitle").innerText = "Content Coming Soon";
  document.getElementById("cardSubtitle").innerText = `Day ${rawDay} | Coming Soon ⏳`;
  document.getElementById("motiveLabel").innerText = "Tap a motivation";
}

// ------------------------------
loadDailyExercise();

