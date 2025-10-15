document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('adminLoginForm');
  const usernameInput = form.username;
  const passwordInput = form.password;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default navigation for custom handling
    clearErrors();

    let valid = true;

    if (usernameInput.value.trim().length < 3) {
      showError(usernameInput, 'Username must be at least 3 characters');
      valid = false;
    }

    if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      valid = false;
    }

    if (!valid) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Demo admin credentials - in a real app, this would be handled by a backend
    const adminCredentials = [
      {
        username: 'admin',
        password: 'admin123',
        redirectPage: 'admin-dashboard.html'
      },
      {
        username: 'teacher',
        password: 'teacher123',
        redirectPage: 'admin-dashboard.html'
      }
    ];

    const match = adminCredentials.find(
      admin => admin.username === username && admin.password === password
    );

    if (match) {
      // Store login state (in a real app, this would be a proper session)
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminUser', username);
      
      // Show success message
      showSuccess('Login successful! Redirecting...');
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = match.redirectPage;
      }, 1000);
    } else {
      showError(usernameInput, 'Invalid username or password');
    }
  });

  function showError(input, message) {
    const error = document.createElement('p');
    error.className = 'error-msg';
    error.textContent = message;
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '-12px';
    error.style.marginBottom = '10px';
    input.parentNode.insertBefore(error, input.nextSibling);
  }

  function showSuccess(message) {
    const success = document.createElement('div');
    success.className = 'success-msg';
    success.textContent = message;
    success.style.color = 'green';
    success.style.fontSize = '14px';
    success.style.textAlign = 'center';
    success.style.marginTop = '10px';
    success.style.padding = '10px';
    success.style.backgroundColor = '#d4edda';
    success.style.border = '1px solid #c3e6cb';
    success.style.borderRadius = '4px';
    
    form.appendChild(success);
  }

  function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    const success = document.querySelectorAll('.success-msg');
    errors.forEach(e => e.remove());
    success.forEach(s => s.remove());
  }
});
