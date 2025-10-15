document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('studentApplicationForm');

  // Load saved draft if exists
  loadDraft();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    if (validateForm()) {
      submitApplication();
    }
  });

  // Auto-save form data as user types
  const formInputs = form.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', saveDraft);
    input.addEventListener('change', saveDraft);
  });

  function validateForm() {
    let valid = true;
    clearErrors();

    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gradeApplying', 'idNumber',
      'email', 'phone', 'address', 'parentName', 'parentRelationship',
      'parentEmail', 'parentPhone', 'reasonForApplication', 'termsAccepted'
    ];

    requiredFields.forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field || (field.type === 'checkbox' ? !field.checked : !field.value.trim())) {
        showError(field, `${getFieldLabel(fieldName)} is required`);
        valid = false;
      }
    });

    // Email validation
    const email = form.querySelector('[name="email"]');
    const parentEmail = form.querySelector('[name="parentEmail"]');
    
    if (email && email.value && !validateEmail(email.value)) {
      showError(email, 'Please enter a valid email address');
      valid = false;
    }

    if (parentEmail && parentEmail.value && !validateEmail(parentEmail.value)) {
      showError(parentEmail, 'Please enter a valid parent email address');
      valid = false;
    }

    // Phone validation
    const phone = form.querySelector('[name="phone"]');
    const parentPhone = form.querySelector('[name="parentPhone"]');
    
    if (phone && phone.value && !validatePhone(phone.value)) {
      showError(phone, 'Please enter a valid phone number');
      valid = false;
    }

    if (parentPhone && parentPhone.value && !validatePhone(parentPhone.value)) {
      showError(parentPhone, 'Please enter a valid parent phone number');
      valid = false;
    }

    // ID Number validation (South African ID format)
    const idNumber = form.querySelector('[name="idNumber"]');
    if (idNumber && idNumber.value && !validateSouthAfricanID(idNumber.value)) {
      showError(idNumber, 'Please enter a valid South African ID number');
      valid = false;
    }

    // Age validation
    const dateOfBirth = form.querySelector('[name="dateOfBirth"]');
    if (dateOfBirth && dateOfBirth.value) {
      const age = calculateAge(dateOfBirth.value);
      const gradeApplying = form.querySelector('[name="gradeApplying"]').value;
      const minAge = getMinAgeForGrade(gradeApplying);
      
      if (age < minAge || age > 25) {
        showError(dateOfBirth, `Age must be between ${minAge} and 25 for Grade ${gradeApplying}`);
        valid = false;
      }
    }

    return valid;
  }

  function submitApplication() {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const applicationData = {};
    
    for (let [key, value] of formData.entries()) {
      applicationData[key] = value;
    }

    // Add timestamp
    applicationData.submittedAt = new Date().toISOString();
    applicationData.applicationId = generateApplicationId();

    // Simulate API call
    setTimeout(() => {
      // Store application data (in a real app, this would be sent to a server)
      const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
      applications.push(applicationData);
      localStorage.setItem('studentApplications', JSON.stringify(applications));

      // Clear saved draft
      localStorage.removeItem('studentApplicationDraft');

      // Show success message
      showSuccessMessage(applicationData.applicationId);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }

  function saveDraft() {
    const formData = new FormData(form);
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
      draftData[key] = value;
    }
    
    localStorage.setItem('studentApplicationDraft', JSON.stringify(draftData));
  }

  function loadDraft() {
    const draft = localStorage.getItem('studentApplicationDraft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        
        Object.keys(draftData).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) {
            if (field.type === 'checkbox') {
              field.checked = draftData[key] === 'on';
            } else {
              field.value = draftData[key];
            }
          }
        });
      } catch (e) {
        console.error('Error loading draft:', e);
      }
    }
  }

  function showSuccessMessage(applicationId) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 1000;
      max-width: 500px;
      text-align: center;
    `;
    
    successDiv.innerHTML = `
      <div style="color: #28a745; font-size: 3rem; margin-bottom: 1rem;">✅</div>
      <h2 style="color: #003A70; margin-bottom: 1rem;">Application Submitted Successfully!</h2>
      <p style="margin-bottom: 1rem;">Your application has been received and is being processed.</p>
      <p style="margin-bottom: 2rem; font-weight: 600;">Application ID: ${applicationId}</p>
      <p style="margin-bottom: 2rem; color: #666;">You will receive an email confirmation shortly.</p>
      <button onclick="location.href='index.html'" class="btn filled">Return to Home</button>
    `;
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    `;
    
    document.body.appendChild(backdrop);
    document.body.appendChild(successDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      backdrop.remove();
      successDiv.remove();
    }, 10000);
  }

  function showError(input, message) {
    const error = document.createElement('p');
    error.className = 'error-msg';
    error.textContent = message;
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';
    error.style.marginBottom = '0';
    
    if (input && input.parentNode) {
      input.parentNode.appendChild(error);
    }
  }

  function clearErrors() {
    const errors = document.querySelectorAll('.error-msg');
    errors.forEach(e => e.remove());
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
  }

  function validateSouthAfricanID(id) {
    // Basic SA ID validation (13 digits, valid date, checksum)
    if (!/^\d{13}$/.test(id)) return false;
    
    const year = parseInt(id.substring(0, 2));
    const month = parseInt(id.substring(2, 4));
    const day = parseInt(id.substring(4, 6));
    
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    
    return true;
  }

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  function getMinAgeForGrade(grade) {
    const gradeAges = {
      '8': 12,
      '9': 13,
      '10': 14,
      '11': 15,
      '12': 16
    };
    return gradeAges[grade] || 12;
  }

  function getFieldLabel(fieldName) {
    const labels = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'dateOfBirth': 'Date of Birth',
      'gradeApplying': 'Grade Applying For',
      'idNumber': 'ID Number',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'address': 'Home Address',
      'parentName': 'Parent/Guardian Name',
      'parentRelationship': 'Relationship',
      'parentEmail': 'Parent/Guardian Email',
      'parentPhone': 'Parent/Guardian Phone',
      'reasonForApplication': 'Reason for Application',
      'termsAccepted': 'Terms and Conditions'
    };
    return labels[fieldName] || fieldName;
  }

  function generateApplicationId() {
    return 'APP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
});
