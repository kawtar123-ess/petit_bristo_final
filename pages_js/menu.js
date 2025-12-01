const menuData = {
  entrees: {
    title: 'Entrées Raffinées',
    items: [
      { name: 'Foie gras mi-cuit aux figues', description: 'Foie gras de canard, compotée de figues, brioche dorée', price: '24€' },
      { name: 'Saint-Jacques snackées', description: "Noix de Saint-Jacques, purée de topinambour, caviar d'Aquitaine", price: '28€' },
      { name: 'Tartare de thon rouge', description: 'Thon rouge de ligne, avocat, wasabi, sésame noir', price: '22€' },
      { name: 'Velouté de châtaignes', description: 'Crème de châtaignes, truffe noire, huile de noisette', price: '18€' }
    ]
  },
  plats: {
    title: 'Plats Signature',
    items: [
      { name: 'Bœuf de Kobé grillé', description: 'Filet de bœuf de Kobé, jus au vin rouge, légumes de saison', price: '65€' },
      { name: 'Homard bleu thermidor', description: 'Homard breton, sauce thermidor, riz pilaf aux herbes', price: '48€' },
      { name: 'Pigeon en croûte de sel', description: 'Pigeon fermier, croûte aux herbes, jus corsé', price: '42€' },
      { name: 'Turbot sauvage', description: 'Filet de turbot, beurre blanc aux agrumes, légumes croquants', price: '38€' }
    ]
  },
  desserts: {
    title: 'Desserts Divins',
    items: [
      { name: 'Soufflé au Grand Marnier', description: 'Soufflé chaud, glace vanille Bourbon, tuile aux amandes', price: '16€' },
      { name: 'Tarte au chocolat Valrhona', description: 'Chocolat noir 70%, ganache onctueuse, or comestible', price: '14€' },
      { name: 'Mille-feuille revisité', description: 'Pâte feuilletée croustillante, crème diplomate, fruits rouges', price: '15€' },
      { name: 'Baba au rhum', description: 'Baba artisanal, rhum vieux, chantilly vanillée', price: '13€' }
    ]
  },
  boissons: {
    title: 'Cave Exceptionnelle',
    items: [
      { name: 'Champagne Dom Pérignon', description: 'Millésime 2012, bulles fines et persistantes', price: '280€' },
      { name: 'Bordeaux Pauillac', description: 'Château Lafite Rothschild 2015', price: '450€' },
      { name: 'Bourgogne Gevrey-Chambertin', description: 'Domaine Armand Rousseau 2018', price: '180€' },
      { name: 'Cocktails signature', description: 'Créations du chef barman, spiritueux premium', price: '18€-25€' }
    ]
  },
  'menu-degustation': {
    title: 'Menu Dégustation',
    items: [
      { name: 'Parcours Gastronomique', description: "7 services d'exception avec accords mets-vins", price: '95€' },
      { name: 'Accord mets-vins', description: 'Sélection de 5 vins par notre sommelier', price: '+45€' },
      { name: 'Menu végétarien', description: '7 services créatifs autour des légumes', price: '85€' }
    ]
  },
  formules: {
    title: 'Formules Gourmandes',
    items: [
      { name: 'Menu Découverte', description: 'Entrée + Plat + Dessert + Vin', price: '65€' },
      { name: 'Menu Affaires', description: 'Formule déjeuner rapide et raffinée', price: '45€' },
      { name: 'Menu Romantique', description: 'Dîner aux chandelles avec champagne', price: '120€' }
    ]
  }
};

export async function initMenuPage() {
  // attempt to fetch menu from backend, fallback to local menuData
  try {
    const res = await fetch('/api/menu');
    if (res.ok) {
      const serverMenu = await res.json();
      // serverMenu is grouped by category
      Object.keys(serverMenu).forEach((cat) => {
        const group = serverMenu[cat];
        // normalize key name for lookup in frontend
        const key = cat;
        menuData[key] = {
          title: group.title || cat,
          items: group.items || []
        };
      });
    }
  } catch (err) {
    console.warn('Unable to fetch menu from API, using local menuData', err);
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
