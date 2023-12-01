const currentUrl = window.location.href;
const allLinks = document.querySelectorAll('.navbar a');

allLinks.forEach(link => {
  const linkHref = link.getAttribute('href');
  console.log('Current URL:', currentUrl);
  console.log('Link Href:', linkHref);
  // Check if the current URL includes the linkHref
  if (currentUrl.includes(linkHref)) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});