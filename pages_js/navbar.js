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
  function updateUserState() {
    const token = localStorage.getItem('restaurant_token');
    const userEmail = localStorage.getItem('restaurant_user_email') || '';
    const role = localStorage.getItem('restaurant_user_role') || '';
    const loginBtn = document.querySelector(`#navbar-container button[onclick="showPage('login')"]`);
    if (!loginBtn) return;

    if (token) {
      // if admin, show email with admin badge
      loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>${userEmail}${role === 'admin' ? ' (admin)' : ''}`;
      loginBtn.removeAttribute('onclick');
      // add logout button area if not present
      let userArea = document.getElementById('navbar-user-area');
      if (!userArea) {
        userArea = document.createElement('div');
        userArea.id = 'navbar-user-area';
        userArea.className = 'flex items-center ml-4';
        loginBtn.parentNode.appendChild(userArea);
      }
      // insert mes-reservations button + logout
      userArea.innerHTML = `<button id="my-res-btn" class="nav-btn px-6 py-3 rounded-xl text-amber-800 hover:text-amber-600 font-semibold mr-4">Mes réservations</button><button id="logout-btn" class="btn-secondary px-4 py-2 rounded-xl text-white font-semibold">Se déconnecter</button>`;
      const logoutBtn = document.getElementById('logout-btn');
      const myResBtn = document.getElementById('my-res-btn');
      if (myResBtn) {
        myResBtn.addEventListener('click', () => {
          if (typeof window.showPage === 'function') window.showPage('user-dashboard');
        });
      }
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          window.logout();
        });
      }
    } else {
      loginBtn.innerHTML = `<i class="fas fa-cog mr-2"></i>login`;
      loginBtn.setAttribute('onclick', "showPage('login')");
      const ua = document.getElementById('navbar-user-area');
      if (ua) ua.remove();
    }
  }

  window.updateUserState = updateUserState;

  window.logout = function () {
    localStorage.removeItem('restaurant_token');
    localStorage.removeItem('restaurant_user_email');
    localStorage.removeItem('restaurant_user_role');
    window.showToast('Déconnecté', 'info');
    updateUserState();
    if (typeof window.showPage === 'function') window.showPage('home');
  };

  // initialize user area based on stored state
  updateUserState();

  return { showPage };
}
