// Checkout page logic
export async function initCheckoutPage() {
  const checkoutBtn = document.getElementById('checkout-place-order-btn');
  const backBtn = document.getElementById('checkout-back-btn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', placeOrder);
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.hash = '#menu';
    });
  }

  window.displayCheckout = displayCheckout;

  return {};
}

// Display checkout with cart items
async function displayCheckout() {
  const checkout = document.getElementById('checkout-page');
  if (!checkout) return;

  // Get cart from sessionStorage or localStorage
  let cart = [];
  try {
    const sessionCart = sessionStorage.getItem('checkout_cart');
    const localCart = localStorage.getItem('petit_bristo_cart');
    cart = sessionCart ? JSON.parse(sessionCart) : (localCart ? JSON.parse(localCart) : []);
  } catch (err) {
    console.error('Error loading cart:', err);
    window.showToast('Erreur de chargement du panier', 'error');
    return;
  }

  if (cart.length === 0) {
    window.location.hash = '#menu';
    window.showToast('Votre panier est vide', 'warning');
    return;
  }

  // Get current user info
  const userInfo = JSON.parse(localStorage.getItem('restaurant_user') || '{}');
  if (!userInfo.id) {
    window.location.hash = '#login';
    window.showToast('Veuillez vous connecter pour commander', 'warning');
    return;
  }

  const checkoutItemList = document.getElementById('checkout-items-list');
  const checkoutItemCount = document.getElementById('checkout-item-count');
  const checkoutSubtotal = document.getElementById('checkout-subtotal');
  const checkoutTotal = document.getElementById('checkout-total');
  const checkoutUserInfo = document.getElementById('checkout-user-info');

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Display items
  if (checkoutItemList) {
    checkoutItemList.innerHTML = cart
      .map(
        (item) => `
      <div class="border-b-2 border-amber-100 pb-4 last:border-b-0">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="text-xl font-bold text-amber-900">${item.name}</h4>
            <p class="text-sm text-amber-600">${item.description || 'Sans description'}</p>
          </div>
          <span class="text-2xl font-bold text-amber-600">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
        <p class="text-right text-sm text-amber-700">Quantité: ${item.quantity} × ${item.price.toFixed(2)}€</p>
      </div>
    `
      )
      .join('');
  }

  // Update totals
  if (checkoutItemCount) checkoutItemCount.textContent = totalItems;
  if (checkoutSubtotal) checkoutSubtotal.textContent = `${totalPrice.toFixed(2)}€`;
  if (checkoutTotal) checkoutTotal.textContent = `${totalPrice.toFixed(2)}€`;

  // Update user info
  if (checkoutUserInfo) {
    const userName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'Utilisateur';
    checkoutUserInfo.textContent = `${userName}\n${userInfo.email || ''}`;
  }
}

// Place order
async function placeOrder() {
  const checkoutBtn = document.getElementById('checkout-place-order-btn');
  const notesTextarea = document.getElementById('checkout-notes');

  // Get user info and token first
  const token = localStorage.getItem('restaurant_token');
  const userInfo = JSON.parse(localStorage.getItem('restaurant_user') || '{}');

  // Debug log for troubleshooting login state
  console.log('[DEBUG] placeOrder: token =', token, 'userInfo =', userInfo);

  // If not logged in, redirect to login and save checkout state
  if (!token || !userInfo.id) {
    // Save the current checkout state
    sessionStorage.setItem('checkout_in_progress', 'true');
    sessionStorage.setItem('checkout_notes', notesTextarea ? notesTextarea.value.trim() : '');
    
    window.showToast('Veuillez vous connecter pour continuer', 'warning');
    setTimeout(() => {
      window.location.hash = '#login';
    }, 500);
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
  }

  try {
    // Get cart
    let cart = [];
    try {
      const sessionCart = sessionStorage.getItem('checkout_cart');
      const localCart = localStorage.getItem('petit_bristo_cart');
      cart = sessionCart ? JSON.parse(sessionCart) : (localCart ? JSON.parse(localCart) : []);
    } catch (err) {
      throw new Error('Erreur de chargement du panier');
    }

    if (cart.length === 0) {
      throw new Error('Votre panier est vide');
    }

    // Prepare order data
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const notes = notesTextarea ? notesTextarea.value.trim() : '';

    const orderData = {
      items: cart,
      totalPrice,
      notes
    };

    // Send order to backend
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de la commande');
    }

    const result = await response.json();

    // Clear cart
    localStorage.removeItem('petit_bristo_cart');
    sessionStorage.removeItem('checkout_cart');
    sessionStorage.removeItem('checkout_in_progress');
    sessionStorage.removeItem('checkout_notes');

    // Show success message
    window.showToast('✓ Commande confirmée avec succès!', 'success');

    // Redirect to orders page after a short delay
    setTimeout(() => {
      window.location.hash = '#orders';
    }, 1500);
  } catch (error) {
    console.error('Error placing order:', error);
    window.showToast(`❌ ${error.message}`, 'error');

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmer la commande';
    }
  }
}

// Show checkout page
export function showCheckout() {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => page.classList.add('hidden'));

  const checkoutPage = document.getElementById('checkout-page');
  if (checkoutPage) {
    checkoutPage.classList.remove('hidden');
  }

  displayCheckout();
}
