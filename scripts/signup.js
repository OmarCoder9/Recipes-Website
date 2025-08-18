function showToast(message, type = "error") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "";
  toast.classList.add("show");
  if (type === "success") toast.classList.add("success");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

document.getElementById("signupBtn").addEventListener("click", function (e) {
  e.preventDefault();

  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  let usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!usernamePattern.test(username)) {
    showToast(
      "Name must be 3-15 characters and can include letters, numbers, and _ only."
    );
    return;
  }

  if (!emailPattern.test(email)) {
    showToast("Please enter a valid email address.");
    return;
  }

  if (!passwordPattern.test(password)) {
    showToast(
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
    );
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match.");
    return;
  }

  showToast(
    "Registration successful! You will be redirected to recipes page.",
    "success"
  );
  localStorage.setItem("loggedIn", true);
  setTimeout(() => {
    window.location.href = "recipes.html";
  }, 2000);
});
