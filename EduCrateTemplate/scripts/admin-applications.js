document.addEventListener('DOMContentLoaded', () => {
  // Check admin login
  checkAdminLogin();
  
  // Load applications
  loadApplications();
  
  // Setup event listeners
  setupEventListeners();
});

function checkAdminLogin() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (!isLoggedIn) {
    alert('Please login to access the admin panel.');
    window.location.href = 'admin-login.html';
    return;
  }
}

function loadApplications() {
  // Get applications from localStorage
  const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
  
  // Create demo applications if none exist
  if (applications.length === 0) {
    createDemoApplications();
    return;
  }
  
  displayApplications(applications);
  updateStatistics(applications);
}

function createDemoApplications() {
  const demoApplications = [
    {
      applicationId: 'APP-123',
      firstName: 'John',
      lastName: 'Smith',
      gradeApplying: '10',
      email: 'john.smith@email.com',
      parentName: 'Mary Smith',
      parentEmail: 'mary.smith@email.com',
      phone: '+27 11 555 1234',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'pending',
      reasonForApplication: 'Interested in the school\'s excellent academic program and sports facilities.'
    },
    {
      applicationId: 'APP-124',
      firstName: 'Sarah',
      lastName: 'Johnson',
      gradeApplying: '9',
      email: 'sarah.johnson@email.com',
      parentName: 'David Johnson',
      parentEmail: 'david.johnson@email.com',
      phone: '+27 11 555 5678',
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'approved',
      reasonForApplication: 'Looking for a school with strong mathematics and science programs.'
    },
    {
      applicationId: 'APP-125',
      firstName: 'Michael',
      lastName: 'Brown',
      gradeApplying: '11',
      email: 'michael.brown@email.com',
      parentName: 'Lisa Brown',
      parentEmail: 'lisa.brown@email.com',
      phone: '+27 11 555 9012',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'rejected',
      reasonForApplication: 'Want to transfer for better academic opportunities.'
    }
  ];
  
  localStorage.setItem('studentApplications', JSON.stringify(demoApplications));
  displayApplications(demoApplications);
  updateStatistics(demoApplications);
}

function displayApplications(applications) {
  const applicationsList = document.getElementById('applicationsList');
  const searchTerm = document.getElementById('searchApplications').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const gradeFilter = document.getElementById('gradeFilter').value;
  
  // Filter applications
  let filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm) ||
      app.parentName.toLowerCase().includes(searchTerm) ||
      app.parentEmail.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesGrade = !gradeFilter || app.gradeApplying === gradeFilter;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });
  
  // Sort by submission date (newest first)
  filteredApplications.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  
  if (filteredApplications.length === 0) {
    applicationsList.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>No applications found matching your criteria.</p>
      </div>
    `;
    return;
  }
  
  applicationsList.innerHTML = `
    <div class="news-cards">
      ${filteredApplications.map(app => createApplicationCard(app)).join('')}
    </div>
  `;
}

function createApplicationCard(application) {
  const timeAgo = getTimeAgo(new Date(application.submittedAt));
  const statusColor = getStatusColor(application.status);
  const statusText = application.status.toUpperCase();
  
  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3>${application.firstName} ${application.lastName}</h3>
        <span style="background: ${statusColor}; color: ${application.status === 'pending' ? '#333' : 'white'}; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${statusText}</span>
      </div>
      <p><strong>Grade:</strong> ${application.gradeApplying}</p>
      <p><strong>Applied:</strong> ${timeAgo}</p>
      <p><strong>Parent:</strong> ${application.parentName}</p>
      <p><strong>Email:</strong> ${application.parentEmail}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn filled" onclick="viewApplication('${application.applicationId}')">View Details</button>
        ${getActionButtons(application)}
      </div>
    </div>
  `;
}

function getActionButtons(application) {
  switch (application.status) {
    case 'pending':
      return `
        <button class="btn outline" onclick="approveApplication('${application.applicationId}')">Approve</button>
        <button class="btn outline" onclick="rejectApplication('${application.applicationId}')" style="color: #dc3545; border-color: #dc3545;">Reject</button>
      `;
    case 'approved':
      return `
        <button class="btn outline" onclick="sendAcceptanceLetter('${application.applicationId}')">Send Acceptance</button>
      `;
    case 'rejected':
      return `
        <button class="btn outline" onclick="sendRejectionLetter('${application.applicationId}')">Send Rejection</button>
      `;
    default:
      return '';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'pending': return '#ffc107';
    case 'approved': return '#28a745';
    case 'rejected': return '#dc3545';
    default: return '#6c757d';
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}

function updateStatistics(applications) {
  const total = applications.length;
  const pending = applications.filter(app => app.status === 'pending').length;
  const approved = applications.filter(app => app.status === 'approved').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  
  document.getElementById('totalApplications').textContent = total;
  document.getElementById('pendingApplications').textContent = pending;
  document.getElementById('approvedApplications').textContent = approved;
  document.getElementById('rejectedApplications').textContent = rejected;
}

function setupEventListeners() {
  // Search functionality
  document.getElementById('searchApplications').addEventListener('input', loadApplications);
  document.getElementById('statusFilter').addEventListener('change', loadApplications);
  document.getElementById('gradeFilter').addEventListener('change', loadApplications);
}

function viewApplication(applicationId) {
  const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
  const application = applications.find(app => app.applicationId === applicationId);
  
  if (!application) {
    alert('Application not found.');
    return;
  }
  
  // Create modal to display application details
  showApplicationModal(application);
}

function showApplicationModal(application) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 10px; padding: 2rem; max-width: 600px; max-height: 80vh; overflow-y: auto; width: 100%;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2>Application Details - ${application.firstName} ${application.lastName}</h2>
        <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
        <div>
          <h3>Student Information</h3>
          <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
          <p><strong>Grade Applying:</strong> ${application.gradeApplying}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Phone:</strong> ${application.phone}</p>
        </div>
        <div>
          <h3>Parent Information</h3>
          <p><strong>Parent Name:</strong> ${application.parentName}</p>
          <p><strong>Parent Email:</strong> ${application.parentEmail}</p>
          <p><strong>Applied:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${application.status.toUpperCase()}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h3>Reason for Application</h3>
        <p style="background: #f8f9fa; padding: 1rem; border-radius: 5px;">${application.reasonForApplication}</p>
      </div>
      
      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn outline" onclick="this.closest('.modal').remove()">Close</button>
        ${application.status === 'pending' ? `
          <button class="btn filled" onclick="approveApplication('${application.applicationId}'); this.closest('.modal').remove();">Approve</button>
          <button class="btn outline" onclick="rejectApplication('${application.applicationId}'); this.closest('.modal').remove();" style="color: #dc3545; border-color: #dc3545;">Reject</button>
        ` : ''}
      </div>
    </div>
  `;
  
  modal.className = 'modal';
  document.body.appendChild(modal);
}

function approveApplication(applicationId) {
  if (confirm('Are you sure you want to approve this application?')) {
    updateApplicationStatus(applicationId, 'approved');
    showNotification('Application approved successfully!', 'success');
  }
}

function rejectApplication(applicationId) {
  if (confirm('Are you sure you want to reject this application?')) {
    updateApplicationStatus(applicationId, 'rejected');
    showNotification('Application rejected.', 'info');
  }
}

function updateApplicationStatus(applicationId, newStatus) {
  const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
  const applicationIndex = applications.findIndex(app => app.applicationId === applicationId);
  
  if (applicationIndex !== -1) {
    applications[applicationIndex].status = newStatus;
    applications[applicationIndex].processedAt = new Date().toISOString();
    applications[applicationIndex].processedBy = localStorage.getItem('adminUser');
    
    localStorage.setItem('studentApplications', JSON.stringify(applications));
    loadApplications(); // Refresh the display
  }
}

function sendAcceptanceLetter(applicationId) {
  showNotification('Acceptance letter sent successfully!', 'success');
}

function sendRejectionLetter(applicationId) {
  showNotification('Rejection letter sent successfully!', 'info');
}

function refreshApplications() {
  loadApplications();
  showNotification('Applications refreshed!', 'info');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${colors[type]};
    color: white;
    border-radius: 5px;
    z-index: 1001;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function logout() {
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminUser');
  window.location.href = 'admin-login.html';
}
