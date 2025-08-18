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

function login() {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (email === "" || password === "") {
    showToast("Please fill in all fields.");
    return;
  }
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showToast("Please enter a valid email address.");
    return;
  }
  if (password.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }
  showToast("Login successful! Redirecting...", "success");
  localStorage.setItem("loggedIn", true);
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}
