export function initNavbar(appState) {
  function showPage(pageId) {
    document.querySelectorAll('#pages-container .page').forEach((page) => {
      page.classList.add('hidden');
    });

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      setTimeout(() => targetPage.classList.add('fade-in'), 50);
    }

    appState.currentPage = pageId;

    document.querySelectorAll('#navbar-container .nav-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`#navbar-container button[onclick="showPage('${pageId}')"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  window.showPage = showPage;

  return { showPage };
}
