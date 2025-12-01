export function initUserDashboard(appState) {
  async function loadMyReservations() {
    const token = localStorage.getItem('restaurant_token');
    const container = document.getElementById('user-reservations-list');
    if (!container) return;
    if (!token) {
      container.innerHTML = `<div class="p-12 text-center text-amber-600">Veuillez vous connecter pour voir vos réservations. <button onclick="showPage('login')" class="font-semibold ml-2">Se connecter</button></div>`;
      return;
    }

    try {
      const res = await fetch('/api/reservations/mine', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        container.innerHTML = `<div class="p-12 text-center text-amber-600">Erreur lors du chargement de vos réservations.</div>`;
        return;
      }
      const list = await res.json();
      if (!Array.isArray(list) || list.length === 0) {
        container.innerHTML = `<div class="p-12 text-center text-amber-600">Aucune réservation trouvée.</div>`;
        return;
      }

      container.innerHTML = list.map((r) => `
        <div class="bg-white rounded-xl shadow p-6 flex justify-between items-start">
          <div>
            <h4 class="text-xl font-bold text-amber-900">${r.customerName || r.customerEmail}</h4>
            <p class="text-amber-700">${r.date} à ${r.time} — ${r.guests} personne(s)</p>
            <p class="text-sm text-amber-600 mt-2">Statut : <strong>${r.status}</strong></p>
            ${r.specialRequests ? `<p class="text-sm text-amber-600 mt-2">Note : ${r.specialRequests}</p>` : ''}
          </div>
          <div class="text-right text-sm text-amber-500">
            <div class="mb-2">Créée : ${new Date(r.createdAt).toLocaleString('fr-FR')}</div>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-12 text-center text-amber-600">Erreur réseau lors du chargement.</div>`;
    }
  }

  // reload when page shown
  if (typeof window.showPage === 'function') {
    const origShow = window.showPage;
    window.showPage = function (pageId) {
      origShow(pageId);
      if (pageId === 'user-dashboard') loadMyReservations();
    };
  }

  // initial load if already on page
  if (document.getElementById('user-dashboard-page') && !document.getElementById('user-dashboard-page').classList.contains('hidden')) {
    loadMyReservations();
  }

  return { loadMyReservations };
}
