export function initAdminPage(appState) {
  // expose a guard function that redirects to login when access to admin is attempted
  window.ensureAdmin = function () {
    const role = localStorage.getItem('restaurant_user_role');
    if (role !== 'admin') {
      window.showToast('Accès réservé à l\'administration.', 'error');
      if (typeof window.showPage === 'function') window.showPage('login');
      return false;
    }
    return true;
  };
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
    const token = localStorage.getItem('restaurant_token');
    if (!token) {
      window.showToast('Non autorisé. Veuillez vous connecter en tant qu\'administrateur.', 'error');
      return;
    }

    const reservation = appState.reservations.find((r) => r.__backendId === backendId);
    if (!reservation) {
      return;
    }

    try {
      const res = await fetch(`/api/reservations/${backendId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (res.ok && json.isOk) {
        window.showToast(`Réservation ${getStatusText(newStatus).toLowerCase()}`, 'success');
        // update local state
        const idx = appState.reservations.findIndex((r) => r.__backendId === backendId);
        if (idx !== -1) {
          appState.reservations[idx] = { ...appState.reservations[idx], status: newStatus };
          appState.filteredReservations = [...appState.reservations];
          updateReservationsList();
          updateStatistics();
        }
      } else {
        window.showToast(json.error || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('Erreur réseau lors de la mise à jour', 'error');
    }
  }

  async function deleteReservation(backendId) {
    const token = localStorage.getItem('restaurant_token');
    if (!token) {
      window.showToast('Non autorisé. Veuillez vous connecter en tant qu\'administrateur.', 'error');
      return;
    }

    const reservation = appState.reservations.find((r) => r.__backendId === backendId);
    if (!reservation) {
      return;
    }

    try {
      const res = await fetch(`/api/reservations/${backendId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.isOk) {
        window.showToast('Réservation supprimée', 'success');
        appState.reservations = appState.reservations.filter((r) => r.__backendId !== backendId);
        appState.filteredReservations = [...appState.reservations];
        updateReservationsList();
        updateStatistics();
      } else {
        window.showToast(json.error || 'Erreur lors de la suppression', 'error');
      }
    } catch (err) {
      console.error(err);
      window.showToast('Erreur réseau lors de la suppression', 'error');
    }
  }

  window.applyFilters = applyFilters;
  window.clearFilters = clearFilters;
  window.updateReservationStatus = updateReservationStatus;
  window.deleteReservation = deleteReservation;

  // --- MENU CRUD ---
  async function loadMenuItems() {
    const token = localStorage.getItem('restaurant_token');
    const container = document.getElementById('menu-items-list');
    if (!container) return;
    try {
      const res = await fetch('/api/menu');
      if (!res.ok) throw new Error('Erreur chargement menu');
      const menuData = await res.json();
      let rows = '';
      let items = [];
      Object.entries(menuData).forEach(([cat, group]) => {
        if (group.items) {
          group.items.forEach((item) => {
            items.push({ ...item, category: cat });
          });
        }
      });
      if (items.length === 0) {
        rows = '<tr><td colspan="5" class="text-center text-amber-600 py-8">Aucun plat</td></tr>';
      } else {
        rows = items.map((item, idx) => `
          <tr>
            <td class="px-4 py-2">${item.category}</td>
            <td class="px-4 py-2">${item.name}</td>
            <td class="px-4 py-2">${item.description}</td>
            <td class="px-4 py-2">${item.price}</td>
            <td class="px-4 py-2 space-x-2">
              <button class="btn-secondary px-3 py-1 rounded" onclick="editMenuItem('${item.name}','${item.category}','${item.description}','${item.price}')"><i class="fas fa-edit"></i></button>
              <button class="btn-danger px-3 py-1 rounded" onclick="deleteMenuItemPrompt('${item.name}','${item.category}')"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        `).join('');
      }
      container.innerHTML = rows;
    } catch (err) {
      container.innerHTML = '<tr><td colspan="5" class="text-center text-amber-600 py-8">Erreur chargement menu</td></tr>';
    }
  }

  async function addMenuItem(event) {
    event.preventDefault();
    const token = localStorage.getItem('restaurant_token');
    if (!token) return window.showToast('Authentification requise', 'error');
    const category = document.getElementById('menu-category').value;
    const name = document.getElementById('menu-name').value;
    const description = document.getElementById('menu-description').value;
    const price = document.getElementById('menu-price').value;
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, name, description, price })
      });
      if (!res.ok) throw new Error('Erreur ajout plat');
      window.showToast('Plat ajouté', 'success');
      document.getElementById('add-menu-form').reset();
      loadMenuItems();
    } catch (err) {
      window.showToast('Erreur lors de l\'ajout', 'error');
    }
  }

  window.editMenuItem = function(name, category, description, price) {
    document.getElementById('menu-category').value = category;
    document.getElementById('menu-name').value = name;
    document.getElementById('menu-description').value = description;
    document.getElementById('menu-price').value = price;
    window.showToast('Modifiez le plat puis cliquez Ajouter pour enregistrer.', 'info');
  };

  window.deleteMenuItemPrompt = async function(name, category) {
    if (!confirm(`Supprimer le plat "${name}" (${category}) ?`)) return;
    // fetch all menu items to find the _id
    const res = await fetch('/api/menu');
    const menuData = await res.json();
    let foundId = null;
    Object.entries(menuData).forEach(([cat, group]) => {
      if (cat === category && group.items) {
        const item = group.items.find((it) => it.name === name);
        if (item && item._id) foundId = item._id;
      }
    });
    if (!foundId) return window.showToast('Plat introuvable', 'error');
    const token = localStorage.getItem('restaurant_token');
    const delRes = await fetch(`/api/menu/${foundId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (delRes.ok) {
      window.showToast('Plat supprimé', 'success');
      loadMenuItems();
    } else {
      window.showToast('Erreur suppression', 'error');
    }
  };

  document.getElementById('add-menu-form')?.addEventListener('submit', addMenuItem);
  loadMenuItems();

  // Orders management
  let adminOrders = [];

  async function loadAdminOrders() {
    const token = localStorage.getItem('restaurant_token');
    if (!token) return;

    try {
      const response = await fetch('/api/orders/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }

      adminOrders = await response.json();
      renderAdminOrders();
    } catch (error) {
      console.error('Error loading admin orders:', error);
    }
  }

  function renderAdminOrders() {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    if (adminOrders.length === 0) {
      container.innerHTML = `
        <div class="text-center text-amber-600 py-12">
          <i class="fas fa-inbox text-6xl mb-4 opacity-50"></i>
          <p class="text-2xl font-semibold">Aucune commande pour le moment</p>
        </div>
      `;
      return;
    }

    // Calculate totals
    const totalOrders = adminOrders.length;
    const totalAmount = adminOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // Update summary
    const totalOrdersEl = document.getElementById('admin-total-orders');
    const totalAmountEl = document.getElementById('admin-total-amount');
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (totalAmountEl) totalAmountEl.textContent = `${totalAmount.toFixed(2)}€`;

    // Render orders
    container.innerHTML = adminOrders
      .map(
        (order, index) => `
      <div class="bg-white border-2 border-amber-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all slide-up" style="animation-delay: ${index * 0.05}s;">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm opacity-90">Commande #${order._id ? order._id.substring(order._id.length - 8).toUpperCase() : 'UNKNOWN'}</p>
              <p class="text-lg font-semibold mt-1">${new Date(order.orderDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-xl">${order.totalPrice.toFixed(2)}€</p>
              <p class="text-sm opacity-90 mt-1">${order.items.length} article${order.items.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Customer Info -->
          <div class="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-amber-100">
            <div>
              <p class="text-sm text-amber-600 font-semibold">Client</p>
              <p class="text-lg font-bold text-amber-900">${order.userName || 'N/A'}</p>
              <p class="text-sm text-amber-700">${order.userEmail || ''}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-amber-600 font-semibold">Statut</p>
              <span class="inline-block px-3 py-1 rounded-full text-sm font-bold ${getOrderStatusClass(order.status)}">
                ${getOrderStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <!-- Items -->
          <div class="mb-6">
            <h4 class="font-bold text-amber-900 mb-3">Articles</h4>
            <div class="space-y-2 text-sm">
              ${order.items
                .map(
                  (item) => `
                <div class="flex justify-between items-center text-amber-700">
                  <span>${item.name} × ${item.quantity}</span>
                  <span class="font-semibold">${(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Total -->
          <div class="bg-amber-50 rounded-lg p-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="font-bold text-amber-900">Total</span>
              <span class="text-2xl font-bold text-amber-600">${order.totalPrice.toFixed(2)}€</span>
            </div>
          </div>

          <!-- Notes (if any) -->
          ${order.notes ? `
            <div class="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-400">
              <p class="text-sm text-blue-600 font-semibold mb-2">Notes:</p>
              <p class="text-blue-800">${order.notes}</p>
            </div>
          ` : ''}

          <!-- Actions -->
          <div class="flex gap-3">
            ${order.status !== 'completed' ? `
              <button onclick="updateOrderStatus('${order._id}', 'completed')" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all">
                <i class="fas fa-check mr-2"></i>Marquer comme livrée
              </button>
            ` : ''}
            ${order.status !== 'cancelled' ? `
              <button onclick="updateOrderStatus('${order._id}', 'cancelled')" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all">
                <i class="fas fa-times mr-2"></i>Annuler
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `
      )
      .join('');
  }

  function getOrderStatusClass(status) {
    const classes = {
      pending: 'text-yellow-700 bg-yellow-100',
      confirmed: 'text-blue-700 bg-blue-100',
      completed: 'text-green-700 bg-green-100',
      cancelled: 'text-red-700 bg-red-100'
    };
    return classes[status] || classes.pending;
  }

  function getOrderStatusLabel(status) {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      completed: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || 'Inconnu';
  }

  window.switchAdminTab = function (tabName) {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');

    tabs.forEach((tab) => tab.classList.remove('active'));
    tabContents.forEach((content) => content.classList.add('hidden'));

    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`${tabName}-tab-content`).classList.remove('hidden');

    if (tabName === 'orders') {
      loadAdminOrders();
    }
  };

  window.updateOrderStatus = async function (orderId, status) {
    const token = localStorage.getItem('restaurant_token');
    if (!token) {
      window.showToast('Non autorisé', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      window.showToast('Statut mis à jour avec succès', 'success');
      loadAdminOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      window.showToast(`Erreur: ${error.message}`, 'error');
    }
  };

  return { updateReservationsList, updateStatistics, loadAdminOrders };
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
