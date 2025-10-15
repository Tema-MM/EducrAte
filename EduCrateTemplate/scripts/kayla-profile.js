 document.addEventListener('DOMContentLoaded', () => {
  // Animate progress bars
  const progressFills = document.querySelectorAll('.progress-bar-fill');
  progressFills.forEach(bar => {
    const grade = bar.getAttribute('data-grade');
    setTimeout(() => {
      bar.style.width = grade + '%';
    }, 400);
  });

  // Modal Elements
  const modalBg = document.querySelector('.modal-bg');
  const meetingBtn = document.querySelector('.meeting-btn');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const meetingForm = document.querySelector('.modal form');

  // Open modal on meeting button click
  meetingBtn.addEventListener('click', () => {
    modalBg.classList.add('show');
  });

  // Close modal function
  function closeModal() {
    modalBg.classList.remove('show');
    meetingForm.reset();
  }

  // Close modal on close button click or clicking outside modal
  modalCloseBtn.addEventListener('click', closeModal);
  modalBg.addEventListener('click', e => {
    if (e.target === modalBg) closeModal();
  });

  // Form submission with validation
  meetingForm.addEventListener('submit', e => {
    e.preventDefault();

    const meetingDate = meetingForm['meeting-date'].value;
    const meetingMsg = meetingForm['meeting-message'].value.trim();

    if (!meetingDate) {
      alert('⚠️ Please select a preferred meeting date.');
      return;
    }
    if (!meetingMsg) {
      alert('⚠️ Please enter a message for the teacher.');
      return;
    }

    alert(`✅ Meeting requested for ${meetingDate}!\nThe teacher will review your message:\n"${meetingMsg}"`);
    closeModal();
  });
});
