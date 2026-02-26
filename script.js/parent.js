// ================= CONFIG =================
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// ================= GLOBALS =================
let currentParent = null;
let sessionTimer = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

    if (!initSecurity()) return;

    loadCurrentParent();
    populateStudentSelector();
    handleNavigation();
    attachLogout();
    startSessionMonitor();
});

// ================= SECURITY INITIALIZER =================
function initSecurity() {

    const role = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const sessionToken = localStorage.getItem("sessionToken");

    if (role !== "parent" || isLoggedIn !== "true" || !loggedInUser || !sessionToken) {
        forceLogout();
        return false;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user =>
        user.role === "parent" &&
        user.email === loggedInUser.email &&
        user.sessionToken === sessionToken
    );

    if (!validUser) {
        forceLogout();
        return false;
    }

    // Multi-tab protection
    if (validUser.activeSessionId !== loggedInUser.activeSessionId) {
        forceLogout();
        return false;
    }

    return true;
}

// ================= LOAD CURRENT PARENT =================
function loadCurrentParent() {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    currentParent = loggedInUser;

    // Update last login display if needed (future)
}

// ================= SESSION MONITOR =================
function startSessionMonitor() {

    let lastActivity = Date.now();

    function resetTimer() {
        lastActivity = Date.now();
    }

    document.addEventListener("click", resetTimer);
    document.addEventListener("keydown", resetTimer);

    sessionTimer = setInterval(() => {
        if (Date.now() - lastActivity > SESSION_TIMEOUT) {
            alert("Session expired. Please login again.");
            forceLogout();
        }
    }, 5000);
}

// ================= FORCE LOGOUT =================
function forceLogout() {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("sessionToken");

    window.location.href = "login.html";
}

// ================= LOGOUT HANDLER =================
function attachLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", () => {
        forceLogout();
    });
}

// ================= STUDENT DROPDOWN =================
function populateStudentSelector() {

    const selector = document.getElementById("studentSelector");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const students = users.filter(user => user.role === "student");

    students.forEach(student => {
        const option = document.createElement("option");
        option.value = student.email;
        option.textContent = student.firstName;
        selector.appendChild(option);
    });
}

// ================= NAVIGATION HANDLER =================
function handleNavigation() {

    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", function () {

            buttons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const section = this.getAttribute("data-section");
            renderSection(section);
        });
    });
}

// ================= SECTION RENDERER =================
function renderSection(section) {

    const contentArea = document.getElementById("contentArea");

    switch (section) {

        case "studentInfo":
            contentArea.innerHTML = "<h2>Student Information</h2><p>Details will appear here.</p>";
            break;

        case "progress":
            contentArea.innerHTML = "<h2>Progress Report</h2><p>Progress data will appear here.</p>";
            break;

        case "performance":
            contentArea.innerHTML = "<h2>Performance</h2><p>Performance metrics here.</p>";
            break;

        case "marks":
            contentArea.innerHTML = "<h2>Marks</h2><p>Marks data here.</p>";
            break;

        case "progressEmail":
            contentArea.innerHTML = "<h2>Progress Transfer (Email)</h2><p>Email transfer feature here.</p>";
            break;

        case "marksMessage":
            contentArea.innerHTML = "<h2>Subject-wise Marks Transfer</h2><p>Message transfer feature here.</p>";
            break;

        case "studyActivity":
            contentArea.innerHTML = "<h2>Study Activity</h2><p>Student analytics will appear here.</p>";
            break;

        default:
            contentArea.innerHTML = "<p>Select a section.</p>";
    }
}