export function initNavbar(appState) {
  function showPage(pageId) {
    // If navigating to admin, ensure user has admin role first
    if (pageId === 'admin' && typeof window.ensureAdmin === 'function') {
      const ok = window.ensureAdmin();
      if (!ok) return; // ensureAdmin already redirected to login
    }
    document.querySelectorAll('#pages-container .page').forEach((page) => {
      page.classList.add('hidden');
    });

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      setTimeout(() => targetPage.classList.add('fade-in'), 50);
    }

    appState.currentPage = pageId;

    // clear active state
    document.querySelectorAll('#navbar-container .nav-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // Prefer data-page attribute (works with dynamic handlers)
    const activeBtn = document.querySelector(`#navbar-container button[data-page="${pageId}"]`) || document.querySelector(`#navbar-container button[onclick="showPage('${pageId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // If mobile menu is open, hide it after navigation
    const menu = document.getElementById('navbar-menu');
    if (menu && menu.classList.contains('block')) {
      menu.classList.remove('block');
      menu.classList.add('hidden');
    }
  }

  window.showPage = showPage;
  // mobile toggle
  const toggle = document.getElementById('navbar-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const menu = document.getElementById('navbar-menu');
      if (!menu) return;
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('block');
      } else {
        menu.classList.remove('block');
        menu.classList.add('hidden');
      }
    });
  }
  function updateUserState() {
    const token = localStorage.getItem('restaurant_token');
    const userEmail = localStorage.getItem('restaurant_user_email') || '';
    const role = localStorage.getItem('restaurant_user_role') || '';
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;
    // find main nav buttons
    const homeBtn = document.getElementById('home-btn');
    const reservationBtn = document.getElementById('reservation-btn');
    const navArea = loginBtn.parentNode;

    if (token) {
      // Admin-specific behavior
      if (role === 'admin') {
        // hide Home (Accueil) and reservation button for admins
        if (homeBtn) homeBtn.style.display = 'none';
        if (reservationBtn) reservationBtn.style.display = 'none';

        // make login button the single Admin tab (with icon)
        loginBtn.innerHTML = `<i class="fas fa-user-shield mr-2"></i>Admin`;
        loginBtn.removeAttribute('onclick');
        // ensure clicking it shows admin page
        loginBtn.onclick = () => {
          if (typeof window.showPage === 'function') window.showPage('admin');
        };

        // ensure user area exists and only contains Logout (no duplicate admin)
        let userArea = document.getElementById('navbar-user-area');
        if (!userArea) {
          userArea = document.createElement('div');
          userArea.id = 'navbar-user-area';
          userArea.className = 'flex items-center ml-4';
          navArea.appendChild(userArea);
        }
        userArea.innerHTML = `<button id="logout-btn" class="btn-secondary px-4 py-2 rounded-xl text-white font-semibold">Se déconnecter</button>`;

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            window.logout();
          });
        }
      } else {
        // Normal logged-in user behavior
        if (homeBtn) homeBtn.style.display = '';

        loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>${userEmail}`;
        loginBtn.removeAttribute('onclick');

        let userArea = document.getElementById('navbar-user-area');
        if (!userArea) {
          userArea = document.createElement('div');
          userArea.id = 'navbar-user-area';
          userArea.className = 'flex items-center ml-4';
          navArea.appendChild(userArea);
        }
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
      }
    } else {
      // Not logged in: show login and remove user area
      if (homeBtn) homeBtn.style.display = '';
      if (reservationBtn) reservationBtn.style.display = '';
      loginBtn.innerHTML = `<i class="fas fa-cog mr-2"></i>login`;
      // restore onclick attribute and property to navigate to login page
      loginBtn.setAttribute('onclick', "showPage('login')");
      loginBtn.onclick = () => {
        if (typeof window.showPage === 'function') window.showPage('login');
      };
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
    else window.location.href = 'index.html';
  };

  // initialize user area based on stored state
  updateUserState();

  return { showPage };
}
