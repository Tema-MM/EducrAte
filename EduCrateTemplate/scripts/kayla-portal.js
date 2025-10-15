 document.addEventListener('DOMContentLoaded', () => {
  // Animate progress bars
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  progressFills.forEach(bar => {
    const grade = bar.getAttribute('data-grade');
    setTimeout(() => {
      bar.style.width = grade + '%';
    }, 400);
  });

  // Tabs functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all contents
      tabContents.forEach(tc => tc.classList.remove('active'));

      // Show selected tab
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Activate first tab by default
  tabButtons[0].click();
});
