// ================= DOM =================
const logoutBtn = document.querySelector(".logout-btn");
const classCards = document.querySelectorAll(".class-card");
const studentNameElement = document.getElementById("studentName");
const continueSection = document.getElementById("continueSection");
const continueText = document.getElementById("continueText");
const resumeBtn = document.getElementById("resumeBtn");
const progressSection = document.getElementById("progressSection");
const completedEl = document.getElementById("completedChapters");
const totalEl = document.getElementById("totalChapters");
const percentEl = document.getElementById("progressPercent");

// ================= SECURITY =================
(function () {
    const role = sessionStorage.getItem("userRole");
    const token = sessionStorage.getItem("sessionToken");
    const sessionId = sessionStorage.getItem("activeSessionId");

    if (!role || !token || !sessionId || role !== "student") {
        sessionStorage.clear();
        window.location.href = "login.html";
    }
})();

// ================= INACTIVITY LOGOUT (10 MIN) =================
let inactivityTimer;
const LIMIT = 10 * 60 * 1000;

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function startTimer() {
    inactivityTimer = setTimeout(logout, LIMIT);
}

function resetTimer() {
    clearTimeout(inactivityTimer);
    startTimer();
}

["click","mousemove","keypress","scroll","touchstart"]
.forEach(event => document.addEventListener(event, resetTimer));

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        inactivityTimer = setTimeout(logout, LIMIT);
    } else {
        resetTimer();
    }
});

startTimer();

// ================= NAME LOAD =================
const name = sessionStorage.getItem("displayName");
if (name) studentNameElement.innerText = "Welcome, " + name;

// ================= CONTINUE =================
const lastClass = sessionStorage.getItem("lastVisitedClass");
const lastSubject = sessionStorage.getItem("lastVisitedSubject");
const lastChapter = sessionStorage.getItem("lastVisitedChapter");

if (lastClass && lastSubject && lastChapter) {
    continueSection.style.display = "block";
    continueText.innerText = `${lastClass} - ${lastSubject} - ${lastChapter}`;
    resumeBtn.addEventListener("click", () => {
        window.location.href = "chapters.html";
    });
}

// ================= PROGRESS =================
const completed = parseInt(sessionStorage.getItem("completedChapters"));
const total = parseInt(sessionStorage.getItem("totalChapters"));

if (!isNaN(completed) && !isNaN(total) && total > 0) {
    progressSection.style.display = "block";
    const percent = Math.floor((completed / total) * 100);
    completedEl.innerText = completed;
    totalEl.innerText = total;
    percentEl.innerText = percent;
}

// ================= CLASS =================
classCards.forEach(card => {
    card.addEventListener("click", () => {
        sessionStorage.setItem("selectedClass", card.innerText);
        window.location.href = "subjects.html";
    });
});

// ================= LOGOUT =================
logoutBtn.addEventListener("click", logout);