document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.getElementById("login-link");
  const signupLink = document.getElementById("signup-link");
  const adminLink = document.getElementById("admin-link");
  const logoutLink = document.getElementById("logout-link");

  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn === "true") {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    adminLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";
  } else {
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    adminLink.style.display = "none";
    logoutLink.style.display = "none";
  }
});
