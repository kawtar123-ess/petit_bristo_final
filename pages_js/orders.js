// Orders page for users
let userOrders = [];

// Load and display user orders
export async function displayUserOrders() {
  const token = localStorage.getItem('restaurant_token');
  const userInfo = JSON.parse(localStorage.getItem('restaurant_user') || '{}');

  if (!token || !userInfo.id) {
    window.location.hash = '#login';
    window.showToast('Veuillez vous connecter', 'warning');
    return;
  }

  try {
    const response = await fetch('/api/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des commandes');
    }

    userOrders = await response.json();
    renderUserOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
    window.showToast(`Erreur: ${error.message}`, 'error');
  }
}

// Render user orders
function renderUserOrders() {
  const ordersList = document.getElementById('orders-list');
  const emptyState = document.getElementById('orders-empty-state');

  if (!ordersList || !emptyState) return;

  if (userOrders.length === 0) {
    emptyState.style.display = 'block';
    ordersList.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';

  ordersList.innerHTML = userOrders
    .map(
      (order) => `
    <div class="order-card bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
      <div class="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm opacity-90">Commande #${order._id ? order._id.substring(order._id.length - 8).toUpperCase() : 'UNKNOWN'}</p>
            <p class="text-lg font-semibold mt-1">${new Date(order.orderDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div class="text-right">
            <span class="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
              ${getOrderStatusBadge(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div class="p-8">
        <!-- Items -->
        <div class="mb-6">
          <h4 class="text-lg font-bold text-amber-900 mb-4">Articles commandés</h4>
          <div class="space-y-3">
            ${order.items
              .map(
                (item) => `
              <div class="flex justify-between items-center pb-3 border-b border-amber-100 last:border-b-0">
                <div>
                  <p class="font-semibold text-amber-900">${item.name}</p>
                  <p class="text-sm text-amber-600">Quantité: ${item.quantity}</p>
                </div>
                <p class="font-bold text-amber-600">${(item.price * item.quantity).toFixed(2)}€</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Total -->
        <div class="border-t-2 border-amber-200 pt-4 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-xl font-bold text-amber-900">Total</span>
            <span class="text-3xl font-bold text-amber-600">${order.totalPrice.toFixed(2)}€</span>
          </div>
        </div>

        <!-- Notes (if any) -->
        ${order.notes ? `
          <div class="bg-amber-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-amber-600 font-semibold mb-2">Notes:</p>
            <p class="text-amber-800">${order.notes}</p>
          </div>
        ` : ''}

        <!-- Status Timeline -->
        <div class="bg-amber-50 rounded-lg p-4">
          <p class="text-sm text-amber-600 font-semibold mb-3">Statut: <span class="text-amber-900 font-bold">${getOrderStatusLabel(order.status)}</span></p>
          <div class="flex items-center gap-2">
            <i class="fas ${getOrderStatusIcon(order.status)} text-amber-600"></i>
            <span class="text-sm text-amber-700">${getOrderStatusMessage(order.status)}</span>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

// Helper function to get status badge HTML
function getOrderStatusBadge(status) {
  const badges = {
    pending: '<span class="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-bold">En attente</span>',
    confirmed: '<span class="text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold">Confirmée</span>',
    completed: '<span class="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold">Livrée</span>',
    cancelled: '<span class="text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-bold">Annulée</span>'
  };
  return badges[status] || badges.pending;
}

// Helper function to get status label
function getOrderStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    completed: 'Livrée',
    cancelled: 'Annulée'
  };
  return labels[status] || 'Inconnu';
}

// Helper function to get status icon
function getOrderStatusIcon(status) {
  const icons = {
    pending: 'fa-clock',
    confirmed: 'fa-check-circle',
    completed: 'fa-check-double',
    cancelled: 'fa-times-circle'
  };
  return icons[status] || 'fa-info-circle';
}

// Helper function to get status message
function getOrderStatusMessage(status) {
  const messages = {
    pending: 'Votre commande a été reçue et est en cours de traitement.',
    confirmed: 'Votre commande a été confirmée et sera bientôt prête.',
    completed: 'Votre commande a été livrée.',
    cancelled: 'Votre commande a été annulée.'
  };
  return messages[status] || 'Statut inconnu';
}

// Cancel order (if needed)
async function cancelOrder(orderId) {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
    return;
  }

  const token = localStorage.getItem('restaurant_token');

  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'cancelled' })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'annulation');
    }

    window.showToast('Commande annulée avec succès', 'success');
    displayUserOrders();
  } catch (error) {
    console.error('Error cancelling order:', error);
    window.showToast(`Erreur: ${error.message}`, 'error');
  }
}

async function loadAndDisplayOrders() {
  await displayUserOrders();
}

export async function initOrdersPage(appState) {
  // Load user orders when page is shown
  const ordersPage = document.getElementById('orders-page');
  if (ordersPage) {
    ordersPage.addEventListener('click', (e) => {
      if (e.target.closest('.order-card')) {
        // Handle order card clicks if needed
      }
    });
  }

  window.displayUserOrders = displayUserOrders;
  window.cancelOrder = cancelOrder;

  return { loadAndDisplayOrders };
}
