// ================= ROLE PROTECTION =================
const currentRole = localStorage.getItem("userRole");

if (!currentRole || currentRole !== "admin") {
    alert("Access Denied! Admin Login Required.");
    window.location.href = "login.html";
}

// ================= SESSION VERSION CHECK =================
const masterVersion = localStorage.getItem("adminAccessVersion");
const sessionVersion = localStorage.getItem("adminSessionVersion");

if (!masterVersion || masterVersion !== sessionVersion) {
    alert("Session expired or access revoked.");
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminSessionVersion");
    window.location.href = "login.html";
}

// ================= LOAD USERS =================
let users = JSON.parse(localStorage.getItem("users")) || [];

let totalStudents = 0;
let totalParents = 0;
let activeUsers = users.length;

users.forEach(user => {
    if (user.role === "student") totalStudents++;
    if (user.role === "parent") totalParents++;
});

// ================= UPDATE DASHBOARD =================
const totalStudentsEl = document.getElementById("totalStudents");
const totalParentsEl = document.getElementById("totalParents");
const totalSubjectsEl = document.getElementById("totalSubjects");
const activeUsersEl = document.getElementById("activeUsers");

if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
if (totalParentsEl) totalParentsEl.textContent = totalParents;
if (totalSubjectsEl) totalSubjectsEl.textContent = 0;
if (activeUsersEl) activeUsersEl.textContent = activeUsers;

// ================= RECENT REGISTRATIONS =================
const tableBody = document.getElementById("recentTableBody");

if (tableBody) {

    if (users.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center; opacity:0.6;">
                    No registrations yet
                </td>
            </tr>
        `;

    } else {

        const recentUsers = users.slice(-5).reverse();
        tableBody.innerHTML = "";

        recentUsers.forEach(user => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.firstName || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.role || "N/A"}</td>
            `;

            tableBody.appendChild(row);
        });
    }
}

// ================= LOGOUT =================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem("userRole");
        localStorage.removeItem("adminSessionVersion");

        window.location.href = "../HTML/login.html";
    });
}

// ================= REVOKE OTHER ADMIN SESSIONS =================
const revokeBtn = document.getElementById("revokeAccessBtn");

if (revokeBtn) {

    revokeBtn.addEventListener("click", function () {

        let currentVersion = parseInt(localStorage.getItem("adminAccessVersion") || "1");

        currentVersion++;

        localStorage.setItem("adminAccessVersion", currentVersion.toString());

        // Keep current admin logged-in
        localStorage.setItem("adminSessionVersion", currentVersion.toString());

        alert("All other admin sessions have been revoked.");

        window.location.reload();
    });
}

// ================= PASSWORD CHANGE SYSTEM =================
const changePasswordBtn = document.getElementById("changePasswordBtn");

if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", function () {

        const currentPass = document.getElementById("currentPassword").value.trim();
        const newPass = document.getElementById("newPassword").value.trim();
        const confirmNewPass = document.getElementById("confirmNewPassword").value.trim();

        const strongPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

        const adminUser = users.find(user => user.role === "admin");

        if (!adminUser) {
            alert("Admin account not found.");
            return;
        }

        if (adminUser.password !== currentPass) {
            alert("Current password incorrect.");
            return;
        }

        if (!strongPattern.test(newPass)) {
            alert("New password must be at least 6 characters, include 1 uppercase letter and 1 number.");
            return;
        }

        if (newPass !== confirmNewPass) {
            alert("New passwords do not match.");
            return;
        }

        // Update password
        adminUser.password = newPass;

        localStorage.setItem("users", JSON.stringify(users));

        // Revoke all other sessions automatically
        let currentVersion = parseInt(localStorage.getItem("adminAccessVersion") || "1");
        currentVersion++;

        localStorage.setItem("adminAccessVersion", currentVersion.toString());
        localStorage.setItem("adminSessionVersion", currentVersion.toString());

        alert("Password updated successfully. All other sessions logged out.");

        // Clear fields
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";

        window.location.reload();
    });
}

// ================= PAGE TOGGLE SYSTEM =================
const dashboardLink = document.getElementById("dashboardLink");
const settingsLink = document.getElementById("settingsLink");

const dashboardContent = document.getElementById("dashboardContent");
const settingsContent = document.getElementById("settingsContent");

const pageTitle = document.getElementById("pageTitle");

if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
        e.preventDefault();

        dashboardContent.style.display = "block";
        settingsContent.style.display = "none";

        pageTitle.textContent = "Dashboard Overview";

        dashboardLink.classList.add("active");
        settingsLink.classList.remove("active");
    });
}

if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
        e.preventDefault();

        dashboardContent.style.display = "none";
        settingsContent.style.display = "block";

        pageTitle.textContent = "Admin Settings";

        settingsLink.classList.add("active");
        dashboardLink.classList.remove("active");
    });
}