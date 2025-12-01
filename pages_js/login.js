export function initLoginPage(appState) {
  const form = document.getElementById('login-form');
  const messageBox = document.getElementById('login-message');

  function showMessage(type, text) {
    if (!messageBox) return;
    messageBox.classList.remove('hidden');
    messageBox.textContent = text;
    if (type === 'error') {
      messageBox.className = 'text-sm rounded-lg px-3 py-2 bg-red-500/90 text-white border border-red-300 shadow-lg';
    } else {
      messageBox.className = 'text-sm rounded-lg px-3 py-2 bg-emerald-500/90 text-white border border-emerald-300 shadow-lg';
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const rememberInput = document.getElementById('remember');

      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      if (!email || !password) {
        showMessage('error', "Veuillez saisir votre e-mail et votre mot de passe.");
        return;
      }

      if (password.length < 6) {
        showMessage('error', "Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          showMessage('error', data.error || 'Erreur de connexion');
          return;
        }

        // store token + role
        localStorage.setItem('restaurant_token', data.token);
        localStorage.setItem('restaurant_user_email', data.email);
        localStorage.setItem('restaurant_user_role', data.role || 'user');
        if (rememberInput?.checked) {
          localStorage.setItem('restaurant_login_email', email);
        } else {
          localStorage.removeItem('restaurant_login_email');
        }

        showMessage('success', 'Connexion réussie ! Redirection en cours...');

        setTimeout(() => {
          if (data.role === 'admin') {
            if (typeof window.showPage === 'function') window.showPage('admin');
            else window.location.href = 'index.html';
          } else {
            if (typeof window.showPage === 'function') window.showPage('user-dashboard');
            else window.location.href = 'index.html';
          }
          // trigger navbar update
          if (typeof window.updateUserState === 'function') window.updateUserState();
        }, 800);
      } catch (err) {
        console.error(err);
        showMessage('error', 'Erreur réseau');
      }
    });
  }

  // Pré-remplir si "se souvenir de moi"
  const savedEmail = localStorage.getItem('restaurant_login_email');
  const emailInput = document.getElementById('email');
  const rememberInput = document.getElementById('remember');
  if (savedEmail && emailInput && rememberInput) {
    emailInput.value = savedEmail;
    rememberInput.checked = true;
  }

  return {};
}
