export function initHomePage() {
  const homePage = document.getElementById('home-page');
  if (homePage) {
    setTimeout(() => homePage.classList.add('fade-in'), 100);
  }

  return {};
}
