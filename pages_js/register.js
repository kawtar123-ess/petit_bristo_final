export function initRegisterPage(appState) {
  const form = document.getElementById('register-form');
  const msg = document.getElementById('register-message');

  function showMessage(type, text) {
    if (!msg) return;
    msg.classList.remove('hidden');
    msg.textContent = text;
    msg.className = type === 'error'
      ? 'text-sm rounded-lg px-3 py-2 bg-red-500/90 text-white border border-red-300 shadow-lg'
      : 'text-sm rounded-lg px-3 py-2 bg-emerald-500/90 text-white border border-emerald-300 shadow-lg';
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reg-email')?.value.trim();
      const password = document.getElementById('reg-password')?.value.trim();
      if (!email || !password) return showMessage('error', 'Veuillez renseigner tous les champs');
      if (password.length < 6) return showMessage('error', 'Le mot de passe doit contenir au moins 6 caractères');

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) return showMessage('error', data.error || 'Erreur lors de la création du compte');

        // store token + user info
        localStorage.setItem('restaurant_token', data.token);
        localStorage.setItem('restaurant_user_email', data.email);
        localStorage.setItem('restaurant_user_role', data.role || 'user');

        showMessage('success', 'Compte créé ! Redirection en cours...');
        setTimeout(() => {
          if (typeof window.updateUserState === 'function') window.updateUserState();
          if (typeof window.showPage === 'function') window.showPage('user-dashboard');
        }, 800);
      } catch (err) {
        console.error(err);
        showMessage('error', 'Erreur réseau');
      }
    });
  }

  return {};
}
