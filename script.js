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
    // Day index must be 1–31
    const cycleLength = 31;
    const index = rawDay % cycleLength;
    return index === 0 ? cycleLength : index;
}

// ------------------------------
// LOAD DATA + SET TODAY'S ENTRY
// ------------------------------

async function loadDailyExercise() {
    try {
        const response = await fetch("data-2.json");
        const data = await response.json();

        const rawDay = daysSinceOmnifitStart();
        const cycleDay = getCycleDay(rawDay);

        // Find matching entry in JSON
        const entry = data.find(d => d.day === cycleDay);

        if (!entry) {
            displayFallback();
            return;
        }

        updateUI(entry, rawDay, cycleDay);

    } catch (err) {
        console.error("Error loading daily exercise:", err);
        displayFallback();
    }
}

// ------------------------------
// UPDATE UI
// ------------------------------

function updateUI(entry, rawDay, cycleDay) {
    document.getElementById("day-number").innerText = `Day ${rawDay}`;

    document.getElementById("category").innerText = entry.category;
    document.getElementById("exercise-title").innerText = entry.title;
    document.getElementById("exercise-details").innerText = entry.micro_exercise;

    // Motivation buttons
    document.getElementById("edu-text").innerText = entry.motivation.Educational;
    document.getElementById("direct-text").innerText = entry.motivation.Direct;
    document.getElementById("playful-text").innerText = entry.motivation.Playful;
    document.getElementById("identity-text").innerText = entry.motivation.Identity;

    // Optional: show cycle-day in UI (if you want)
    // document.getElementById("cycle-day").innerText = `Cycle Day ${cycleDay}`;
}

// ------------------------------
// FALLBACK (if data missing)
// ------------------------------

function displayFallback() {
    document.getElementById("exercise-title").innerText = "Content Coming Soon";
    document.getElementById("exercise-details").innerText =
        "Please check back later.";
}
