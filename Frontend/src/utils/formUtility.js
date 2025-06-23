export const base64Converter = (event) => {
  return new Promise((resolve) => {
    const file = event.target.files[0];
    if (!file) return resolve(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null); 
  });
};

export const validateFullName = (fullName) => {
  const errors = [];
  const trimmed = fullName.trim();
  if (!trimmed) errors.push("Full name is required");
  if (trimmed.length < 3) errors.push("Full name must be at least 3 characters");
  return errors;
};

export const validateEmail = (email) => {
  const errors = [];
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) errors.push("Invalid email format");
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters long");
  if (!/[0-9]/.test(password)) errors.push("Must contain at least one number");
  if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter");
  if (!/[\W]/.test(password)) errors.push("Must contain at least one special character");
  return errors;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  const errors = [];
  if (!confirmPassword.trim()) errors.push("Confirm Password is required");
  if (password !== confirmPassword) errors.push("Passwords do not match");
  return errors;
};
