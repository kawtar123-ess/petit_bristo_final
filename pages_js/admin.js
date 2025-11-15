export function initAdminPage(appState) {
  function updateReservationsList() {
    const container = document.getElementById('reservations-list');
    if (!container) {
      return;
    }

    if (appState.filteredReservations.length === 0) {
      container.innerHTML = `
        <div class="p-12 text-center text-amber-600">
          <i class="fas fa-calendar-times text-6xl mb-4 opacity-50"></i>
          <p class="text-2xl font-semibold">Aucune réservation trouvée</p>
        </div>
      `;
      return;
    }

    container.innerHTML = appState.filteredReservations
      .map((reservation, index) => `
        <div class="p-8 hover:bg-amber-50 transition-all duration-300 slide-up" style="animation-delay: ${index * 0.05}s;">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-6 mb-4">
                <h4 class="text-2xl font-bold text-amber-900">${reservation.customerName}</h4>
                <span class="px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(reservation.status)}">
                  <i class="fas ${getStatusIcon(reservation.status)} mr-2"></i>
                  ${getStatusText(reservation.status)}
                </span>
              </div>
              <div class="grid md:grid-cols-2 gap-4 text-amber-700 mb-4">
                <div class="flex items-center">
                  <i class="fas fa-envelope mr-3 text-amber-500"></i>
                  <span class="text-lg">${reservation.customerEmail}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-phone mr-3 text-amber-500"></i>
                  <span class="text-lg">${reservation.customerPhone}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-calendar mr-3 text-amber-500"></i>
                  <span class="text-lg">${formatDate(reservation.date)} à ${reservation.time}</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-users mr-3 text-amber-500"></i>
                  <span class="text-lg">${reservation.guests} personne${reservation.guests > 1 ? 's' : ''}</span>
                </div>
              </div>
              ${reservation.specialRequests
                ? `
                    <div class="bg-amber-50 rounded-xl p-4 mt-4">
                      <div class="flex items-start">
                        <i class="fas fa-comment text-amber-600 mr-3 mt-1"></i>
                        <span class="text-amber-800 font-medium">${reservation.specialRequests}</span>
                      </div>
                    </div>
                  `
                : ''}
            </div>
            <div class="flex flex-col space-y-3 ml-6">
              ${reservation.status === 'pending'
                ? `
                    <button onclick="updateReservationStatus('${reservation.__backendId}', 'confirmed')"
                      class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
                      <i class="fas fa-check mr-2"></i>Confirmer
                    </button>
                  `
                : ''}
              ${reservation.status !== 'cancelled'
                ? `
                    <button onclick="updateReservationStatus('${reservation.__backendId}', 'cancelled')"
                      class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                      <i class="fas fa-times mr-2"></i>Annuler
                    </button>
                  `
                : ''}
              <button onclick="deleteReservation('${reservation.__backendId}')"
                class="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg">
                <i class="fas fa-trash mr-2"></i>Supprimer
              </button>
            </div>
          </div>
        </div>
      `)
      .join('');
  }

  function updateStatistics() {
    const total = appState.reservations.length;
    const confirmed = appState.reservations.filter((r) => r.status === 'confirmed').length;
    const pending = appState.reservations.filter((r) => r.status === 'pending').length;
    const cancelled = appState.reservations.filter((r) => r.status === 'cancelled').length;

    animateNumber('total-reservations', total);
    animateNumber('confirmed-reservations', confirmed);
    animateNumber('pending-reservations', pending);
    animateNumber('cancelled-reservations', cancelled);
  }

  function applyFilters() {
    const dateFilter = document.getElementById('filter-date')?.value;
    const statusFilter = document.getElementById('filter-status')?.value;

    appState.filteredReservations = appState.reservations.filter((reservation) => {
      const matchesDate = !dateFilter || reservation.date === dateFilter;
      const matchesStatus = !statusFilter || reservation.status === statusFilter;
      return matchesDate && matchesStatus;
    });

    updateReservationsList();
  }

  function clearFilters() {
    const dateField = document.getElementById('filter-date');
    const statusField = document.getElementById('filter-status');
    if (dateField) dateField.value = '';
    if (statusField) statusField.value = '';
    appState.filteredReservations = [...appState.reservations];
    updateReservationsList();
  }

  async function updateReservationStatus(backendId, newStatus) {
    if (!window.dataSdk) {
      window.showToast("Data SDK non disponible. Mise à jour impossible.", 'error');
      return;
    }

    const reservation = appState.reservations.find((r) => r.__backendId === backendId);
    if (!reservation) {
      return;
    }

    const updatedReservation = { ...reservation, status: newStatus };
    const result = await window.dataSdk.update(updatedReservation);

    if (result.isOk) {
      window.showToast(`Réservation ${getStatusText(newStatus).toLowerCase()}`, 'success');
    } else {
      window.showToast('Erreur lors de la mise à jour', 'error');
    }
  }

  async function deleteReservation(backendId) {
    if (!window.dataSdk) {
      window.showToast('Data SDK non disponible. Suppression impossible.', 'error');
      return;
    }

    const reservation = appState.reservations.find((r) => r.__backendId === backendId);
    if (!reservation) {
      return;
    }

    const result = await window.dataSdk.delete(reservation);
    if (result.isOk) {
      window.showToast('Réservation supprimée', 'success');
    } else {
      window.showToast('Erreur lors de la suppression', 'error');
    }
  }

  window.applyFilters = applyFilters;
  window.clearFilters = clearFilters;
  window.updateReservationStatus = updateReservationStatus;
  window.deleteReservation = deleteReservation;

  return { updateReservationsList, updateStatistics };
}

function animateNumber(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  const currentValue = parseInt(element.textContent, 10) || 0;
  const increment = targetValue > currentValue ? 1 : -1;
  const duration = 1000;
  const steps = Math.abs(targetValue - currentValue);
  const stepDuration = steps > 0 ? duration / steps : 0;

  if (stepDuration === 0) {
    element.textContent = targetValue;
    return;
  }

  let current = currentValue;
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === targetValue) {
      clearInterval(timer);
    }
  }, stepDuration);
}

function getStatusClass(status) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
}

function getStatusIcon(status) {
  switch (status) {
    case 'confirmed':
      return 'fa-check-circle';
    case 'pending':
      return 'fa-clock';
    case 'cancelled':
      return 'fa-times-circle';
    default:
      return 'fa-question-circle';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'confirmed':
      return 'Confirmée';
    case 'pending':
      return 'En attente';
    case 'cancelled':
      return 'Annulée';
    default:
      return 'Inconnu';
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
