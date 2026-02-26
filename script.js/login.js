// ================= DOM ELEMENTS =================
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginMobile = document.getElementById("loginMobile");
const loginPassword = document.getElementById("loginPassword");
const loginOtp = document.getElementById("loginOtp");
const loginSendOtpBtn = document.getElementById("loginSendOtpBtn");

let generatedLoginOTP = "";
let authenticatedUser = null;

// ================= PASSWORD TOGGLE =================
const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {
    button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const inputField = document.getElementById(targetId);
        inputField.type = inputField.type === "password" ? "text" : "password";
    });
});

// ================= RESET IF ROLE CHANGES =================
const roleRadios = document.querySelectorAll('input[name="loginRole"]');

roleRadios.forEach(radio => {
    radio.addEventListener("change", function () {
        generatedLoginOTP = "";
        authenticatedUser = null;
        loginSendOtpBtn.disabled = false;
        loginOtp.value = "";
    });
});

// ================= OTP GENERATION =================
loginSendOtpBtn.addEventListener("click", function () {

    const selectedRole = document.querySelector('input[name="loginRole"]:checked');

    if (!selectedRole) {
        alert("Please select your role first.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const enteredEmail = loginEmail.value.trim();
    const enteredMobile = loginMobile.value.trim();
    const enteredPassword = loginPassword.value.trim();

    if (enteredEmail === "" && enteredMobile === "") {
        alert("Enter Email or Mobile Number.");
        return;
    }

    if (enteredPassword === "") {
        alert("Enter Password.");
        return;
    }

    // 🔐 Role + Identity Match
    const foundUser = users.find(user =>
        (user.email === enteredEmail || user.mobile === enteredMobile) &&
        user.role === selectedRole.value
    );

    if (!foundUser) {
        alert("User not found with selected role.");
        return;
    }

    if (foundUser.password !== enteredPassword) {
        alert("Incorrect password.");
        return;
    }

    authenticatedUser = foundUser;

    generatedLoginOTP = Math.floor(100000 + Math.random() * 900000).toString();

    alert("Your Login OTP is: " + generatedLoginOTP);

    loginSendOtpBtn.disabled = true;
});

// ================= LOGIN SUBMIT =================
loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!authenticatedUser) {
        alert("Please verify credentials and generate OTP first.");
        return;
    }

    if (loginOtp.value !== generatedLoginOTP || generatedLoginOTP === "") {
        alert("Invalid OTP.");
        return;
    }

    // Save role
    localStorage.setItem("userRole", authenticatedUser.role);

    // ================= ADMIN SESSION SYSTEM =================
    if (authenticatedUser.role === "admin") {

        let currentVersion = localStorage.getItem("adminAccessVersion");

        if (!currentVersion) {
            currentVersion = "1";
            localStorage.setItem("adminAccessVersion", currentVersion);
        }

        localStorage.setItem("adminSessionVersion", currentVersion);

        alert("Admin Login Successful!");
        window.location.href = "admin_dashboard.html";
    }

    else if (authenticatedUser.role === "parent") {
        alert("Parent Login Successful!");
        window.location.href = "parent_dashboard.html";
    }

    else if (authenticatedUser.role === "student") {
        alert("Student Login Successful!");
        window.location.href = "student_dashboard.html";
    }
});