document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  checkAdminLogin();

  // Load dashboard data
  loadDashboardData();

  // Set up event listeners
  setupEventListeners();
});

function checkAdminLogin() {
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  const adminUser = localStorage.getItem('adminUser');
  
  if (!isLoggedIn || !adminUser) {
    alert('Please login to access the admin dashboard.');
    window.location.href = 'admin-login.html';
    return;
  }

  // Update welcome message
  const welcomeElement = document.querySelector('p');
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome back, ${adminUser}`;
  }
}

function loadDashboardData() {
  // Load statistics
  updateStatistics();
  
  // Load recent activity
  loadRecentActivity();
  
  // Load system status
  updateSystemStatus();
}

function updateStatistics() {
  // Get student applications from localStorage
  const applications = JSON.parse(localStorage.getItem('studentApplications') || '[]');
  const pendingApplications = applications.filter(app => !app.processed);
  
  // Update pending applications count
  const pendingCount = document.querySelector('.news-cards .card:nth-child(2) h3');
  if (pendingCount) {
    pendingCount.textContent = pendingApplications.length;
  }

  // In a real app, these would come from a database
  const stats = {
    totalStudents: 1247,
    averageGrade: 85.2,
    matricPassRate: 100
  };

  // Update stats display
  const statCards = document.querySelectorAll('.news-cards .card h3');
  if (statCards.length >= 4) {
    statCards[0].textContent = stats.totalStudents.toLocaleString();
    statCards[2].textContent = stats.averageGrade + '%';
    statCards[3].textContent = stats.matricPassRate + '%';
  }
}

function loadRecentActivity() {
  const activities = [
    {
      type: 'New Application',
      description: 'John Smith applied for Grade 10',
      time: '2 hours ago'
    },
    {
      type: 'Grade Updated',
      description: 'Mathematics grades updated for Grade 12',
      time: '4 hours ago'
    },
    {
      type: 'Student Registered',
      description: 'Sarah Johnson successfully enrolled',
      time: '1 day ago'
    }
  ];

  const activityContainer = document.querySelector('.news-preview .news-cards');
  if (activityContainer) {
    activityContainer.innerHTML = activities.map(activity => `
      <div class="card">
        <h3>${activity.type}</h3>
        <p>${activity.description}</p>
        <p style="color: #666; font-size: 0.9rem;">${activity.time}</p>
      </div>
    `).join('');
  }
}

function updateSystemStatus() {
  // Simulate system status checks
  const statuses = [
    { name: 'System Online', status: 'operational', icon: '✅' },
    { name: 'Database Connected', status: 'accessible', icon: '✅' },
    { name: 'Backup Status', status: 'scheduled', icon: '⚠️' }
  ];

  const statusContainer = document.querySelector('.mission .news-cards');
  if (statusContainer) {
    statusContainer.innerHTML = statuses.map(status => `
      <div class="card" style="text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${status.icon}</div>
        <h3>${status.name}</h3>
        <p>${status.status}</p>
      </div>
    `).join('');
  }
}

function setupEventListeners() {
  // Quick action cards
  const actionCards = document.querySelectorAll('.mission .news-cards .card');
  actionCards.forEach(card => {
    card.addEventListener('click', function() {
      const cardText = this.querySelector('h3').textContent;
      
      switch(cardText) {
        case 'View Applications':
          window.location.href = 'admin-applications.html';
          break;
        case 'Manage Students':
          window.location.href = 'admin-students.html';
          break;
        case 'Update Grades':
          window.location.href = 'admin-grades.html';
          break;
        case 'Generate Reports':
          window.location.href = 'admin-reports.html';
          break;
      }
    });
  });
}

function logout() {
  // Clear admin session
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('adminUser');
  
  // Redirect to login
  window.location.href = 'admin-login.html';
}

// Add some demo functionality for the dashboard
function refreshData() {
  // Simulate data refresh
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = 'Refreshing...';
  refreshBtn.disabled = true;
  refreshBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: #003A70;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  
  document.body.appendChild(refreshBtn);
  
  setTimeout(() => {
    loadDashboardData();
    refreshBtn.remove();
    
    // Show refresh notification
    const notification = document.createElement('div');
    notification.textContent = 'Data refreshed successfully!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border-radius: 5px;
      z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }, 1500);
}

// Auto-refresh data every 5 minutes
setInterval(loadDashboardData, 5 * 60 * 1000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl + R to refresh data
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    refreshData();
  }
  
  // Escape to logout
  if (e.key === 'Escape') {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  }
});
