document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-btn');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const details = button.nextElementSibling;
      if(details.style.display === 'block') {
        details.style.display = 'none';
        button.textContent = 'View Details';
      } else {
        details.style.display = 'block';
        button.textContent = 'Hide Details';
      }
    });
  });
});
