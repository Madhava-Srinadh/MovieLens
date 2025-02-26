export const validate = (email, password, confirmPassword, isSignUp) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,16}$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Invalid email format." };
  }

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        "Password must be 8-16 characters, include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    };
  }

  if (isSignUp && password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match." };
  }

  return {
    isValid: true,
    message: isSignUp ? "Sign-up successful." : "Login successful.",
  };
};
