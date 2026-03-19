function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
  return usernameRegex.test(username);
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return passwordRegex.test(password);
}

function isValidName(name) {
  const nameRegex = /^[a-zA-ZÀ-ÿ' -]{2,100}$/;
  return nameRegex.test(name);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  isValidUsername,
  isValidPassword,
  isValidName,
  isValidEmail,
};
