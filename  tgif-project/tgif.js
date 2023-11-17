
// Close all dropdown lists if the user clicks outside of it
window.addEventListener('click', (event) => {
  if (!event.target.matches('.dropdown-btn')) {
    Array.from(document.querySelectorAll('.dropdown')).forEach((elt) => {
     elt.classList.remove('show');
    })
  }
});

// set all dropdown buttons to open their associated dropdown list on click
Array.from(document.querySelectorAll('.dropdown-btn')).forEach((btn) => {
  const dropdown = btn.closest('.dropdown');
  if (dropdown) {
    btn.addEventListener('click', (evt) => {
      evt.preventDefault();
      dropdown.classList.toggle('show');
    })
  }
});


