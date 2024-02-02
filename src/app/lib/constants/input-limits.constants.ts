export const InputLimits = {
  email: {
    minLength: { value: 7, message: 'Email address must be at least 7 characters' },
    maxLength: { value: 63, message: 'Email address must be fewer than 64 characters' },
    notValidEmail: { value: '', message: 'Please enter a valid email address' },
  },
  password: {
    minLength: { value: 7, message: 'Password must be at least 7 characters' },
    maxLength: { value: 31, message: 'Password must be fewer than 32 characters' },
  },
  firstName: {
    maxLength: { value: 20, message: 'First name must be fewer than 21 characters' },
    validChars: { value: /^[a-z]+$/i, message: 'Only letters permitted in first name' },
  },
  lastName: {
    maxLength: { value: 20, message: 'Last name must be fewer than 21 characters' },
    validChars: { value: /^[a-z]+$/i, message: 'Only letters permitted in last name' },
  },
  contactMessage: {
    minLength: { value: 1, message: 'Please include a message' },
    maxLength: { value: 128, message: 'Message must be fewer than 127 characters' },
  },
};
