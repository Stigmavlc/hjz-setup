// Password protection for HJZ Setup Pack
// Password: HenryHJZAutomation

// Simple hash function to avoid plain text password in code
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// The hashed password (HenryHJZAutomation hashed)
const CORRECT_PASSWORD_HASH = 1784882579;

// Check if user is authenticated
function isAuthenticated() {
  return sessionStorage.getItem('hjz_authenticated') === 'true';
}

// Set authentication
function setAuthenticated() {
  sessionStorage.setItem('hjz_authenticated', 'true');
}

// For index.html (login page)
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const inputHash = simpleHash(password);

    if (inputHash === CORRECT_PASSWORD_HASH) {
      setAuthenticated();
      window.location.href = 'setup.html';
    } else {
      errorMessage.classList.add('show');
      passwordInput.value = '';
      passwordInput.focus();

      // Hide error after 3 seconds
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 3000);
    }
  });

  // Focus password field on load
  passwordInput.focus();
}

// For setup.html (protected page)
if (document.getElementById('setupPage')) {
  // Check authentication on page load
  if (!isAuthenticated()) {
    window.location.href = 'index.html';
  }
}
