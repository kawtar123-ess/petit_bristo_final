// Menu data loaded from MongoDB via API
let menuData = {};

export async function initMenuPage() {
  // Fetch menu from MongoDB via API (no fallback to local data)
  try {
    const res = await fetch('/api/menu');
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const serverMenu = await res.json();
    // serverMenu is grouped by category from MongoDB
    Object.keys(serverMenu).forEach((cat) => {
      const group = serverMenu[cat];
      menuData[cat] = {
        title: group.title || cat.toUpperCase(),
        items: group.items || []
      };
    });
  } catch (err) {
    console.error('❌ Erreur lors du chargement du menu:', err);
    window.showToast('❌ Impossible de charger le menu. Veuillez rafraîchir la page.', 'error');
  }

  const modal = document.getElementById('menu-modal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeMenuModal();
      }
    });
  }

  window.showMenuDetail = showMenuDetail;
  window.closeMenuModal = closeMenuModal;

  return {};
}

function showMenuDetail(category) {
  const modal = document.getElementById('menu-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  const menuCategory = menuData[category];

  if (!modal || !title || !content || !menuCategory) {
    return;
  }

  title.innerHTML = `<i class="fas fa-utensils mr-3"></i>${menuCategory.title}`;
  content.innerHTML = menuCategory.items
    .map(
      (item, index) => `
        <div class="border-b-2 border-amber-100 pb-6 last:border-b-0 slide-up" style="animation-delay: ${index * 0.1}s;">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h4 class="text-2xl font-bold text-amber-900 mb-3">${item.name}</h4>
              <p class="text-amber-700 text-lg leading-relaxed">${item.description}</p>
            </div>
            <div class="text-3xl font-bold text-amber-600 ml-6">${item.price}</div>
          </div>
        </div>
      `
    )
    .join('');

  modal.classList.remove('hidden');
}

function closeMenuModal() {
  const modal = document.getElementById('menu-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}
