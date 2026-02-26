// ================= DOM ELEMENTS =================
const registerForm = document.getElementById("registerForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const otpInput = document.getElementById("otp");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const mobileInput = document.getElementById("mobileNumber");

let generatedOTP = "";

// ================= PASSWORD TOGGLE =================
const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {
    button.addEventListener("click", function () {
        const targetId = this.getAttribute("data-target");
        const inputField = document.getElementById(targetId);
        inputField.type = inputField.type === "password" ? "text" : "password";
    });
});

// ================= PASSWORD STRENGTH CHECK =================
function isStrongPassword(pass) {
    const pattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    return pattern.test(pass);
}

// ================= OTP GENERATION =================
sendOtpBtn.addEventListener("click", function () {

    const selectedRole = document.querySelector('input[name="userRole"]:checked');

    if (!selectedRole) {
        alert("Please select your role first.");
        return;
    }

    if (mobileInput.value.length !== 10) {
        alert("Enter valid 10-digit mobile number.");
        return;
    }

    if (password.value.trim() === "" || confirmPassword.value.trim() === "") {
        alert("Enter Password and Confirm Password first.");
        return;
    }

    if (!isStrongPassword(password.value)) {
        alert("Password must be at least 6 characters long, include 1 uppercase letter and 1 number.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    alert("Your OTP is: " + generatedOTP);

    sendOtpBtn.disabled = true;
});

// ================= FORM SUBMIT =================
registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const selectedRole = document.querySelector('input[name="userRole"]:checked');

    if (!selectedRole) {
        alert("Please select your role.");
        return;
    }

    if (mobileInput.value.length !== 10) {
        alert("Mobile number must be 10 digits.");
        return;
    }

    if (!isStrongPassword(password.value)) {
        alert("Password must be at least 6 characters long, include 1 uppercase letter and 1 number.");
        return;
    }

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match.");
        return;
    }

    if (otpInput.value !== generatedOTP || generatedOTP === "") {
        alert("Invalid or missing OTP.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
        role: selectedRole.value,
        firstName: document.getElementById("firstName").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: mobileInput.value.trim(),
        password: password.value.trim()
    };

    // ================= DUPLICATE CHECK =================
    const emailExists = users.some(user => user.email === newUser.email);
    const mobileExists = users.some(user => user.mobile === newUser.mobile);

    if (emailExists) {
        alert("Email already registered.");
        return;
    }

    if (mobileExists) {
        alert("Mobile number already registered.");
        return;
    }

    // ================= NEW: MULTIPLE ADMIN RESTRICTION =================
    if (newUser.role === "admin") {

        const adminExists = users.some(user => user.role === "admin");

        if (adminExists) {
            alert("Admin account already exists. Multiple admins are not allowed.");
            return;
        }
    }
    // ================================================================

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("userRole", selectedRole.value);

    alert("Registration Successful!");

    generatedOTP = "";
    sendOtpBtn.disabled = false;

    window.location.href = "HTML/login.html";
});