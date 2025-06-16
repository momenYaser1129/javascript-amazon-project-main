// Get DOM elements For Switching
const loginContainer = document.querySelector(".login-container");
const signupContainer = document.querySelector(".signup-container");
const toSignupButton = document.getElementById("to-signup");
const toLoginLink = document.getElementById("to-login");
const footer = document.getElementById("footer");

// Add click event for switching to signup
function signUp() {
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
  footer.classList.add("footer-signup");
  footer.classList.remove("footer-login");
}

toSignupButton.addEventListener("click", () => {
  signUp();
});

// Add click event for switching to login
function logIn() {
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  footer.classList.add("footer-login");
  footer.classList.remove("footer-signup");
}
toLoginLink.addEventListener("click", (e) => {
  // e.preventDefault(); // Prevent default link behavior
  logIn();
});

//  Data From user input sign-up => Register
let userNameReg = document.querySelector("#signupName");
let email = document.querySelector("#signupEmail");
let passwordReg = document.querySelector("#signupPassword");
let passwordReReg = document.querySelector("#signupRepassword");
let submitReg = document.querySelector("#signupSubmit");

// Add sign out functionality
const signOutButton = document.querySelector('.sign-out-button');
if (signOutButton) {
  signOutButton.addEventListener('click', () => {
    localStorage.removeItem('signedUser');
    toast('Signed out successfully', 'success');
    window.location.href = 'Log-in Sign-up.html';
  });
}

// Improved validation for sign up
const passwordMinLength = 8;
const nameRegex = /^[a-zA-Z ]{2,50}$/;

submitReg.addEventListener("click", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  
  // Validate all fields are filled
  if (!userNameReg.value || !email.value || !passwordReg.value || !passwordReReg.value) {
    toast("Please fill in all fields", "error");
    return;
  }

  // Validate name format
  if (!nameRegex.test(userNameReg.value)) {
    toast("Name should only contain letters and spaces, between 2-50 characters", "error");
    return;
  }

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  if (!emailRegex.test(email.value)) {
    toast("Please enter a valid email address ending with @gmail.com, @yahoo.com, or @outlook.com", "error");
    return;
  }

  // Check if email already exists
  let emailExists = users.some((user) => user.email === email.value);
  if (emailExists) {
    toast("This email is already registered. Please use another email.", "error");
    return;
  }

  // Validate password strength
  if (passwordReg.value.length < passwordMinLength) {
    toast("Password must be at least 8 characters long", "error");
    return;
  }

  // Validate password match
  if (passwordReReg.value !== passwordReg.value) {
    toast("Passwords do not match", "error");
    return;
  }

  // If all validations pass, create new user
  users.push({
    email: email.value,
    username: userNameReg.value,
    password: passwordReg.value,
  });
  
  localStorage.setItem("users", JSON.stringify(users));
  
  // Clear form fields
  userNameReg.value = "";
  passwordReReg.value = "";
  passwordReg.value = "";
  email.value = "";
  
  // Show success message and switch to login
  toast("Registration successful! Please log in.", "success");
  logIn();
});

let loginSubmit = document.querySelector("#loginSubmit");
let loginName = document.querySelector("#loginEmail");
let loginPassword = document.querySelector("#loginPassword");

// Improved login validation
loginSubmit.addEventListener("click", () => {
  if (!loginName.value || !loginPassword.value) {
    toast("Please fill in all fields", "error");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    (u) => u.email === loginName.value
  );

  if (!user) {
    toast("Account not found. Please check your credentials or sign up.", "error");
    loginName.value = "";
    loginPassword.value = "";
    return;
  }

  if (user.password !== loginPassword.value) {
    toast("Incorrect password. Please try again.", "error");
    loginPassword.value = "";
    return;
  }

  // Successful login
  localStorage.setItem("signedUser", JSON.stringify(user));
  toast("Login successful!", "success");
  window.location.href = "amazon.html";
});

// Sweet Alert

