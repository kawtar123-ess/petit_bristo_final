// Cart state
let cart = [];

// Load cart from localStorage on module load
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('petit_bristo_cart');
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error loading cart from storage:', err);
    cart = [];
  }
}

// Save cart to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('petit_bristo_cart', JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart to storage:', err);
  }
}

// Initialize cart UI
export async function initCartUI() {
  loadCartFromStorage();

  const cartToggle = document.getElementById('cart-toggle-btn');
  const cartClose = document.getElementById('cart-close-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
  const cartClearBtn = document.getElementById('cart-clear-btn');

  if (cartToggle) {
    cartToggle.addEventListener('click', openCart);
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', proceedToCheckout);
  }

  if (cartClearBtn) {
    cartClearBtn.addEventListener('click', clearCart);
  }

  window.removeFromCart = removeFromCart;
  window.updateCartItemQuantity = updateCartItemQuantity;

  updateCartDisplay();

  return {};
}

// Add item to cart
export function addToCart(category, itemIndex) {
  const menuData = window.menuData || {};
  const categoryData = menuData[category];

  if (!categoryData || !categoryData.items || !categoryData.items[itemIndex]) {
    console.error('Invalid item');
    return;
  }

  const item = categoryData.items[itemIndex];
  const cartItem = cart.find(
    (ci) => ci.name === item.name && ci.price === item.price && ci.category === category
  );

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      id: `${category}-${itemIndex}-${Date.now()}`,
      category,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price.replace('€', '').trim()),
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartDisplay();
  openCart();

  window.showToast(`${item.name} ajouté au panier!`, 'success');
}

// Remove item from cart
export function removeFromCart(cartItemId) {
  const index = cart.findIndex((item) => item.id === cartItemId);
  if (index > -1) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
    window.showToast(`${removedItem.name} retiré du panier`, 'info');
  }
}

// Update item quantity
export function updateCartItemQuantity(cartItemId, quantity) {
  if (quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const item = cart.find((ci) => ci.id === cartItemId);
  if (item) {
    item.quantity = quantity;
    saveCartToStorage();
    updateCartDisplay();
  }
}

// Update cart display
function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCount = document.getElementById('cart-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotal = document.getElementById('cart-total');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

  if (!cartItemsContainer) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update cart count
  if (cartCount) {
    if (totalItems > 0) {
      cartCount.textContent = totalItems;
      cartCount.classList.remove('hidden');
    } else {
      cartCount.classList.add('hidden');
    }
  }

  // Update totals
  if (cartSubtotal) {
    cartSubtotal.textContent = `${totalPrice.toFixed(2)}€`;
  }

  if (cartTotal) {
    cartTotal.textContent = `${totalPrice.toFixed(2)}€`;
  }

  // Disable/enable checkout button
  if (cartCheckoutBtn) {
    cartCheckoutBtn.disabled = cart.length === 0;
  }

  // Render cart items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center text-amber-600 py-8">
        <p class="text-lg">Votre panier est vide</p>
        <p class="text-sm text-amber-500">Ajoutez des articles pour commencer</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="bg-white border-2 border-amber-200 rounded-lg p-4 hover:border-amber-400 transition-all">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <h4 class="font-bold text-amber-900">${item.name}</h4>
            <p class="text-sm text-amber-600">${item.price.toFixed(2)}€ x ${item.quantity}</p>
          </div>
          <button 
            onclick="removeFromCart('${item.id}')" 
            class="text-red-500 hover:text-red-700 transition-colors"
            title="Retirer"
          >
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button 
              onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})" 
              class="bg-amber-100 hover:bg-amber-200 text-amber-700 w-6 h-6 rounded flex items-center justify-center"
            >
              <i class="fas fa-minus text-xs"></i>
            </button>
            <span class="font-semibold text-amber-900 w-8 text-center">${item.quantity}</span>
            <button 
              onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})" 
              class="bg-amber-100 hover:bg-amber-200 text-amber-700 w-6 h-6 rounded flex items-center justify-center"
            >
              <i class="fas fa-plus text-xs"></i>
            </button>
          </div>
          <span class="font-bold text-amber-600">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
      </div>
    `
      )
      .join('');
  }
}

// Open cart sidebar
function openCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartSidebar) {
    cartSidebar.classList.remove('translate-x-full');
  }

  if (cartOverlay) {
    cartOverlay.classList.remove('hidden');
  }
}

// Close cart sidebar
function closeCart() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartSidebar) {
    cartSidebar.classList.add('translate-x-full');
  }

  if (cartOverlay) {
    cartOverlay.classList.add('hidden');
  }
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    window.showToast('Votre panier est vide', 'warning');
    return;
  }

  // Store cart in sessionStorage for the checkout page
  sessionStorage.setItem('checkout_cart', JSON.stringify(cart));

  // Navigate to checkout page
  window.location.hash = '#checkout';
  closeCart();
}

// Clear entire cart
function clearCart() {
  if (confirm('Êtes-vous sûr de vouloir vider le panier?')) {
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    window.showToast('Panier vidé', 'info');
  }
}

// Export cart state for checkout
export function getCartForCheckout() {
  return [...cart];
}
