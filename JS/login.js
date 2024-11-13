function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var passwordEye = document.querySelector(".hide-show-password-eye");
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordEye.classList.remove("bsEyeSlash");
      passwordEye.classList.add("bsEye");
    } else {
      passwordInput.type = "password";
      passwordEye.classList.remove("bsEye");
      passwordEye.classList.add("bsEyeSlash");
    }
  }
  
  function loginWithTestCredentials(event) {
    event.preventDefault();
    document.getElementById("email").value = "virtuwear@gmail.com";
    document.getElementById("password").value = "Virtuwear";
    document.querySelector("form").submit();
  }

  // Get the login form and input fields
const loginForm = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.querySelector(".error");

// Add event listener to the login form
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    // Get the email and password values from the input fields
    const email = emailInput.value;
    const password = passwordInput.value;

    // Call your login service here (replace this with your actual login logic)
    const response = await loginService(email, password);

    if (response.status === 200) {
      // Login successful, store the token and user information
      localStorage.setItem("token", response.data.encodedToken);
      localStorage.setItem("firstName", response.data.foundUser.firstName);
      localStorage.setItem("lastName", response.data.foundUser.lastName);
      localStorage.setItem("email", response.data.foundUser.email);

      // Navigate to the appropriate page
      window.location.href = "/";
    } else {
      // Login failed, display the error message
      errorMessage.textContent = response.data.errors[0];
    }
  } catch (error) {
    // Handle any errors that occurred during the login process
    errorMessage.textContent = error.response.data.errors[0];
  }
});