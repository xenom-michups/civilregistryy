// Login Form Handler
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const logOutBtn = document.getElementById('logOutBtn');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const errorMessage = document.getElementById('errorMessage');

    // Show loading state
    if (btnText) btnText.textContent = 'Signing in...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Redirect based on user role
        if (data.data.user.role === 'client') {
          window.location.href = '/client-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        // Show error
        if (errorMessage) {
          errorMessage.textContent = data.message || 'Login failed. Please try again.';
          errorMessage.classList.remove('hidden');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (errorMessage) {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.classList.remove('hidden');
      }
    } finally {
      // Reset button state
      if (btnText) btnText.textContent = 'Sign In';
      if (btnSpinner) btnSpinner.classList.add('hidden');
    }
  });
}

// Logout Handler
const handleLogout = async () => {
  try {
    await fetch('/api/users/logout', { method: 'GET' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/';
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', handleLogout);
}
