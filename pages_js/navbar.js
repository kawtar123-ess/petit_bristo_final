export function initNavbar(appState) {
  function showPage(pageId) {
    // If navigating to admin, ensure user has admin role first
    if (pageId === "admin" && typeof window.ensureAdmin === "function") {
      const ok = window.ensureAdmin();
      if (!ok) return; // ensureAdmin already redirected to login
    }
    document.querySelectorAll("#pages-container .page").forEach((page) => {
      page.classList.add("hidden");
    });

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.remove("hidden");
      setTimeout(() => targetPage.classList.add("fade-in"), 50);
    }

    appState.currentPage = pageId;

    // clear active state
    document.querySelectorAll("#navbar-container .nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Prefer data-page attribute (works with dynamic handlers)
    const activeBtn =
      document.querySelector(
        `#navbar-container button[data-page="${pageId}"]`
      ) ||
      document.querySelector(
        `#navbar-container button[onclick="showPage('${pageId}')"]`
      );
    if (activeBtn) activeBtn.classList.add("active");

    // Close mobile menu after navigation
    const mobileMenu = document.getElementById("navbar-mobile-menu");
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      const toggle = document.getElementById("navbar-toggle");
      if (toggle) {
        const icon = toggle.querySelector("i");
        if (icon) icon.classList.replace("fa-times", "fa-bars");
      }
    }

    // Sync nav button states
    syncNavButtons(pageId);
  }

  window.showPage = showPage;

  // Mobile toggle functionality
  const toggle = document.getElementById("navbar-toggle");
  const mobileMenu = document.getElementById("navbar-mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");
      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("animate-slideDown");
        toggle.querySelector("i").classList.replace("fa-bars", "fa-times");
      } else {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("animate-slideDown");
        toggle.querySelector("i").classList.replace("fa-times", "fa-bars");
      }
    });
  }

  // Sync mobile and desktop nav buttons
  const syncNavButtons = (pageId) => {
    document.querySelectorAll("#navbar-container .nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    const desktopBtn = document.querySelector(
      `#navbar-menu button[data-page="${pageId}"]`
    );
    const mobileBtn = document.querySelector(
      `#navbar-mobile-menu button[data-page="${pageId}"]`
    );

    if (desktopBtn) desktopBtn.classList.add("active");
    if (mobileBtn) mobileBtn.classList.add("active");
  };
  function updateUserState() {
    const token = localStorage.getItem("restaurant_token");
    const userEmail = localStorage.getItem("restaurant_user_email") || "";
    const role = localStorage.getItem("restaurant_user_role") || "";

    // Get both desktop and mobile login buttons
    const loginBtn = document.getElementById("login-btn");
    const loginBtnMobile = document.getElementById("login-btn-mobile");

    if (!loginBtn) return;

    // find main nav buttons (desktop)
    const homeBtn = document.getElementById("home-btn");
    const menuBtn = document.getElementById("menu-btn");
    const reservationBtn = document.getElementById("reservation-btn");

    // find mobile nav buttons
    const homeBtnMobile = document.getElementById("home-btn-mobile");
    const menuBtnMobile = document.getElementById("menu-btn-mobile");
    const reservationBtnMobile = document.getElementById(
      "reservation-btn-mobile"
    );

    const navArea = loginBtn.parentNode;

    if (token) {
      // Hide login buttons when user is connected
      if (loginBtn) loginBtn.style.display = "none";
      if (loginBtnMobile) loginBtnMobile.style.display = "none";

      // Admin-specific behavior
      if (role === "admin") {
        // hide Home, Menu, and Reservation buttons for admins (both desktop and mobile)
        if (homeBtn) homeBtn.style.display = "none";
        if (menuBtn) menuBtn.style.display = "none";
        if (reservationBtn) reservationBtn.style.display = "none";
        if (homeBtnMobile) homeBtnMobile.style.display = "none";
        if (menuBtnMobile) menuBtnMobile.style.display = "none";
        if (reservationBtnMobile) reservationBtnMobile.style.display = "none";

        // Desktop user area for admin
        let userArea = document.getElementById("navbar-user-area");
        if (!userArea) {
          userArea = document.createElement("div");
          userArea.id = "navbar-user-area";
          userArea.className = "flex items-center space-x-2 ml-2 lg:ml-4";
          navArea.appendChild(userArea);
        }
        userArea.innerHTML = `
          <button id="admin-orders-btn" class="nav-btn px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl text-amber-800 hover:text-amber-600 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center text-sm lg:text-base">
            <i class="fas fa-shopping-bag mr-2"></i>
            <span class="hidden xl:inline">Commandes</span>
          </button>
          <button id="logout-btn" class="btn-secondary px-3 lg:px-4 py-2 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center text-sm lg:text-base">
            <i class="fas fa-sign-out-alt mr-2"></i>
            <span class="hidden xl:inline">Déconnexion</span>
          </button>
        `;

        // Mobile user area for admin
        let userAreaMobile = document.getElementById("navbar-user-area-mobile");
        if (userAreaMobile) {
          userAreaMobile.innerHTML = `
            <div class="border-t border-amber-200 mt-2 pt-2 space-y-2">
              <button id="admin-orders-btn-mobile" class="nav-btn w-full text-left px-4 py-3 rounded-xl text-amber-800 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center">
                <i class="fas fa-shopping-bag mr-3 w-5"></i>
                <span>Commandes</span>
              </button>
              <button id="logout-btn-mobile" class="btn-secondary w-full text-left px-4 py-3 rounded-xl text-white font-semibold flex items-center">
                <i class="fas fa-sign-out-alt mr-3 w-5"></i>
                <span>Se déconnecter</span>
              </button>
            </div>
          `;
        }

        // Event listeners for admin buttons
        const adminOrdersBtn = document.getElementById("admin-orders-btn");
        const adminOrdersBtnMobile = document.getElementById(
          "admin-orders-btn-mobile"
        );
        const logoutBtn = document.getElementById("logout-btn");
        const logoutBtnMobile = document.getElementById("logout-btn-mobile");

        if (adminOrdersBtn) {
          adminOrdersBtn.addEventListener("click", () => {
            if (typeof window.showPage === "function") window.showPage("admin");
            setTimeout(() => {
              if (typeof window.switchAdminTab === "function")
                window.switchAdminTab("orders");
            }, 100);
          });
        }

        if (adminOrdersBtnMobile) {
          adminOrdersBtnMobile.addEventListener("click", () => {
            if (typeof window.showPage === "function") window.showPage("admin");
            setTimeout(() => {
              if (typeof window.switchAdminTab === "function")
                window.switchAdminTab("orders");
            }, 100);
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            window.logout();
          });
        }

        if (logoutBtnMobile) {
          logoutBtnMobile.addEventListener("click", () => {
            window.logout();
          });
        }
      } else {
        // Normal logged-in user behavior
        if (homeBtn) homeBtn.style.display = "";
        if (menuBtn) menuBtn.style.display = "";
        if (reservationBtn) reservationBtn.style.display = "";
        if (homeBtnMobile) homeBtnMobile.style.display = "";
        if (menuBtnMobile) menuBtnMobile.style.display = "";
        if (reservationBtnMobile) reservationBtnMobile.style.display = "";

        // Desktop user area for regular users
        let userArea = document.getElementById("navbar-user-area");
        if (!userArea) {
          userArea = document.createElement("div");
          userArea.id = "navbar-user-area";
          userArea.className = "flex items-center space-x-2 ml-2 lg:ml-4";
          navArea.appendChild(userArea);
        }
        userArea.innerHTML = `
          <button id="my-orders-btn" class="nav-btn px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-amber-800 hover:text-amber-600 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center text-sm lg:text-base">
            <i class="fas fa-shopping-bag mr-1 lg:mr-2"></i>
            <span class="hidden md:inline">Commandes</span>
          </button>
          <button id="my-res-btn" class="nav-btn px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-amber-800 hover:text-amber-600 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center text-sm lg:text-base">
            <i class="fas fa-calendar-check mr-1 lg:mr-2"></i>
            <span class="hidden md:inline">Réservations</span>
          </button>
          <button id="logout-btn" class="btn-secondary px-3 lg:px-4 py-2 rounded-xl text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center text-sm lg:text-base">
            <i class="fas fa-sign-out-alt mr-1 lg:mr-2"></i>
            <span class="hidden xl:inline">Déconnexion</span>
          </button>
        `;

        // Mobile user area for regular users
        let userAreaMobile = document.getElementById("navbar-user-area-mobile");
        if (userAreaMobile) {
          userAreaMobile.innerHTML = `
            <div class="border-t border-amber-200 mt-2 pt-2 space-y-2">
              <div class="px-4 py-2 text-amber-900 font-semibold text-sm bg-amber-50 rounded-lg">
                <i class="fas fa-user mr-2"></i>${userEmail}
              </div>
              <button id="my-orders-btn-mobile" class="nav-btn w-full text-left px-4 py-3 rounded-xl text-amber-800 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center">
                <i class="fas fa-shopping-bag mr-3 w-5"></i>
                <span>Mes commandes</span>
              </button>
              <button id="my-res-btn-mobile" class="nav-btn w-full text-left px-4 py-3 rounded-xl text-amber-800 hover:bg-amber-50 font-semibold transition-all duration-300 flex items-center">
                <i class="fas fa-calendar-check mr-3 w-5"></i>
                <span>Mes réservations</span>
              </button>
              <button id="logout-btn-mobile" class="btn-secondary w-full text-left px-4 py-3 rounded-xl text-white font-semibold flex items-center">
                <i class="fas fa-sign-out-alt mr-3 w-5"></i>
                <span>Se déconnecter</span>
              </button>
            </div>
          `;
        }

        // Event listeners for regular user buttons
        const logoutBtn = document.getElementById("logout-btn");
        const logoutBtnMobile = document.getElementById("logout-btn-mobile");
        const myResBtn = document.getElementById("my-res-btn");
        const myResBtnMobile = document.getElementById("my-res-btn-mobile");
        const myOrdersBtn = document.getElementById("my-orders-btn");
        const myOrdersBtnMobile = document.getElementById(
          "my-orders-btn-mobile"
        );

        if (myOrdersBtn) {
          myOrdersBtn.addEventListener("click", () => {
            if (typeof window.showPage === "function")
              window.showPage("orders");
            if (typeof window.displayUserOrders === "function")
              window.displayUserOrders();
          });
        }

        if (myOrdersBtnMobile) {
          myOrdersBtnMobile.addEventListener("click", () => {
            if (typeof window.showPage === "function")
              window.showPage("orders");
            if (typeof window.displayUserOrders === "function")
              window.displayUserOrders();
          });
        }

        if (myResBtn) {
          myResBtn.addEventListener("click", () => {
            if (typeof window.showPage === "function")
              window.showPage("user-dashboard");
          });
        }

        if (myResBtnMobile) {
          myResBtnMobile.addEventListener("click", () => {
            if (typeof window.showPage === "function")
              window.showPage("user-dashboard");
          });
        }

        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            window.logout();
          });
        }

        if (logoutBtnMobile) {
          logoutBtnMobile.addEventListener("click", () => {
            window.logout();
          });
        }
      }
    } else {
      // Not logged in: show login and remove user area
      if (homeBtn) homeBtn.style.display = "";
      if (menuBtn) menuBtn.style.display = "";
      if (reservationBtn) reservationBtn.style.display = "";
      if (homeBtnMobile) homeBtnMobile.style.display = "";
      if (menuBtnMobile) menuBtnMobile.style.display = "";
      if (reservationBtnMobile) reservationBtnMobile.style.display = "";

      if (loginBtn) {
        loginBtn.style.display = "";
        loginBtn.innerHTML = `<i class="fas fa-sign-in-alt mr-2"></i><span>Connexion</span>`;
        loginBtn.setAttribute("onclick", "showPage('login')");
        loginBtn.onclick = () => {
          if (typeof window.showPage === "function") window.showPage("login");
        };
      }

      if (loginBtnMobile) {
        loginBtnMobile.style.display = "";
        loginBtnMobile.innerHTML = `<i class="fas fa-sign-in-alt mr-3 w-5"></i><span>Connexion</span>`;
        loginBtnMobile.setAttribute("onclick", "showPage('login')");
        loginBtnMobile.onclick = () => {
          if (typeof window.showPage === "function") window.showPage("login");
        };
      }

      const ua = document.getElementById("navbar-user-area");
      if (ua) ua.remove();

      const uaMobile = document.getElementById("navbar-user-area-mobile");
      if (uaMobile) uaMobile.innerHTML = "";
    }
  }

  window.updateUserState = updateUserState;

  window.logout = function () {
    localStorage.removeItem("restaurant_token");
    localStorage.removeItem("restaurant_user_email");
    localStorage.removeItem("restaurant_user_role");
    window.showToast("Déconnecté", "info");
    updateUserState();
    if (typeof window.showPage === "function") window.showPage("home");
    else window.location.href = "index.html";
  };

  // initialize user area based on stored state
  updateUserState();

  return { showPage };
}
