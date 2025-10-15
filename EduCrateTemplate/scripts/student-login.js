 document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const studentIdInput = form.studentId;
  const emailInput = form.email;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default navigation for custom handling
    clearErrors();

    let valid = true;

    if (studentIdInput.value.trim().length < 4) {
      showError(studentIdInput, 'Student ID must be at least 4 characters');
      valid = false;
    }

    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      valid = false;
    }

    if (!valid) return;

    const studentId = studentIdInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    // Add more students here as needed
    const studentData = [
      {
        id: 'KAYLA1022',
        email: 'kayla@student.educrate.com',
        profilePage: 'kayla-profile.html'
      }
    ];

    const match = studentData.find(
      student => student.id === studentId && student.email === email
    );

    if (match) {
      window.location.href = match.profilePage;
    } else {
      alert('❌ Incorrect ID or email. Please try again.');
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

  function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    errors.forEach(e => e.remove());
  }

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }
});
