// ================= DOM ELEMENTS =================
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginMobile = document.getElementById("loginMobile");
const loginPassword = document.getElementById("loginPassword");
const loginOtp = document.getElementById("loginOtp");
const loginSendOtpBtn = document.getElementById("loginSendOtpBtn");
const loginFullName = document.getElementById("loginFullName");
const studentNameGroup = document.getElementById("studentNameGroup");

let generatedLoginOTP = "";
let authenticatedUser = null;

// ================= VALIDATION PATTERNS =================
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[0-9]{10}$/;

// ================= PASSWORD TOGGLE =================
const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {
    button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const inputField = document.getElementById(targetId);
        inputField.type = inputField.type === "password" ? "text" : "password";
    });
});

// ================= ROLE CHANGE HANDLER =================
const roleRadios = document.querySelectorAll('input[name="loginRole"]');

roleRadios.forEach(radio => {
    radio.addEventListener("change", function () {

        generatedLoginOTP = "";
        authenticatedUser = null;
        loginSendOtpBtn.disabled = false;
        loginOtp.value = "";

        if (this.value === "student") {
            studentNameGroup.style.display = "flex";
            loginFullName.required = true;
        } else {
            studentNameGroup.style.display = "none";
            loginFullName.required = false;
        }
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
    const enteredName = loginFullName.value.trim();

    if (!mobilePattern.test(enteredMobile)) {
        alert("Enter valid 10-digit mobile number.");
        return;
    }

    if (enteredPassword === "") {
        alert("Enter Password.");
        return;
    }

    let foundUser = null;

    // ================= STUDENT LOGIN =================
    if (selectedRole.value === "student") {

        if (enteredName === "") {
            alert("Enter Full Name.");
            return;
        }

        foundUser = users.find(user =>
            user.role === "student" &&
            user.firstName === enteredName &&
            user.mobile === enteredMobile
        );
    }

    // ================= PARENT LOGIN =================
    else if (selectedRole.value === "parent") {

        if (enteredEmail === "" && enteredMobile === "") {
            alert("Enter Email or Mobile.");
            return;
        }

        foundUser = users.find(user =>
            user.role === "parent" &&
            (
                user.email === enteredEmail ||
                user.mobile === enteredMobile
            )
        );
    }

    // ================= ADMIN LOGIN =================
    else if (selectedRole.value === "admin") {

        foundUser = users.find(user =>
            user.role === "admin" &&
            user.email === enteredEmail
        );
    }

    if (!foundUser) {
        alert("User not found.");
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
        alert("Generate OTP first.");
        return;
    }

    if (loginOtp.value !== generatedLoginOTP || generatedLoginOTP === "") {
        alert("Invalid OTP.");
        return;
    }

    localStorage.setItem("userRole", authenticatedUser.role);

    if (authenticatedUser.role === "admin") {
        window.location.href = "admin_dashboard.html";
    }

    else if (authenticatedUser.role === "parent") {
        window.location.href = "parent_dashboard.html";
    }

    else if (authenticatedUser.role === "student") {
        window.location.href = "student_dashboard.html";
    }
});