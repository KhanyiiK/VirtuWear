function togglePasswordVisibility(inputId) {
    var passwordInput = document.getElementById(inputId);
    var passwordEye = document.querySelector(`#${inputId} + .hide-show-password-eye`);
  
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