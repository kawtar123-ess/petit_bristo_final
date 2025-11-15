import { initNavbar } from './pages_js/navbar.js';
import { initHomePage } from './pages_js/home.js';
import { initMenuPage } from './pages_js/menu.js';
import { initReservationPage } from './pages_js/reservation.js';
import { initAdminPage } from './pages_js/admin.js';

const defaultConfig = {
  restaurant_name: 'Le Gourmet Parisien',
  restaurant_description:
    "Cuisine gastronomique française dans un cadre élégant. Découvrez nos créations culinaires d'exception préparées par notre chef étoilé.",
  contact_phone: '+33 1 42 86 87 88',
  contact_address: '15 Avenue des Champs-Élysées, Paris'
};

const appState = {
  currentPage: 'home',
  reservations: [],
  filteredReservations: [],
  config: { ...defaultConfig }
};

window.showToast = function showToast(message, type = 'info') {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  const colors = {
    success: 'from-green-500 to-green-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600'
  };

  const toast = document.createElement('div');
  toast.className = `toast fixed top-6 right-6 z-50 px-8 py-4 rounded-2xl text-white font-bold shadow-2xl bg-gradient-to-r ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${icons[type] || icons.info} mr-3 text-xl"></i>
      <span class="text-lg">${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadSections();
  applyConfig(appState.config);
  const loadedConfig = await loadConfig();
  appState.config = { ...appState.config, ...loadedConfig };
  applyConfig(appState.config);

  const navbarApi = initNavbar(appState);
  initHomePage(appState);
  initMenuPage(appState);
  const reservationApi = initReservationPage(appState);
  const adminApi = initAdminPage(appState);

  appState.updateReservationsList = adminApi.updateReservationsList;
  appState.updateStatistics = adminApi.updateStatistics;

  await initializeDataSdk(adminApi);
  await initializeElementSdk();

  if (navbarApi?.showPage) {
    navbarApi.showPage(appState.currentPage);
  }

  if (reservationApi?.focusDefault) {
    reservationApi.focusDefault();
  }
});

async function loadSections() {
  const sections = [
    { id: 'navbar-container', file: 'pages/navbar.html' },
    { id: 'home-container', file: 'pages/home.html' },
    { id: 'menu-container', file: 'pages/menu.html' },
    { id: 'reservation-container', file: 'pages/reservation.html' },
    { id: 'admin-container', file: 'pages/admin.html' }
  ];

  await Promise.all(
    sections.map(async (section) => {
      const container = document.getElementById(section.id);
      if (!container) return;

      try {
        const response = await fetch(section.file);
        if (!response.ok) throw new Error('Impossible de charger ' + section.file);
        container.innerHTML = await response.text();
      } catch (error) {
        container.innerHTML = `<div class="p-8 text-red-600 font-semibold">${error.message}</div>`;
        console.error(error);
      }
    })
  );
}

async function loadConfig() {
  try {
    const response = await fetch('config.json');
    if (!response.ok) throw new Error('Config introuvable');
    return await response.json();
  } catch (error) {
    console.warn('Utilisation de la configuration par défaut:', error.message);
    return { ...defaultConfig };
  }
}

function applyConfig(config) {
  const restaurantName = config.restaurant_name || defaultConfig.restaurant_name;
  const description = config.restaurant_description || defaultConfig.restaurant_description;
  const phone = config.contact_phone || defaultConfig.contact_phone;
  const address = config.contact_address || defaultConfig.contact_address;

  const nameElements = ['restaurant-name', 'hero-restaurant-name'];
  nameElements.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = restaurantName;
    }
  });

  const descriptionElement = document.getElementById('restaurant-description');
  if (descriptionElement) {
    descriptionElement.textContent = description;
  }

  const phoneElement = document.getElementById('contact-phone');
  if (phoneElement) {
    phoneElement.textContent = phone;
  }

  const addressElement = document.getElementById('contact-address');
  if (addressElement) {
    addressElement.textContent = address;
  }
}

async function initializeDataSdk(adminApi) {
  if (!window.dataSdk) {
    return;
  }

  const dataHandler = {
    onDataChanged(data) {
      appState.reservations = data;
      appState.filteredReservations = [...data];
      adminApi.updateReservationsList();
      adminApi.updateStatistics();
    }
  };

  const initResult = await window.dataSdk.init(dataHandler);
  if (!initResult.isOk) {
    console.error("Erreur d'initialisation du Data SDK");
  }
}

async function initializeElementSdk() {
  if (!window.elementSdk) {
    return;
  }

  await window.elementSdk.init({
    defaultConfig,
    onConfigChange: (config) => {
      appState.config = { ...appState.config, ...config };
      applyConfig(appState.config);
    },
    mapToCapabilities: () => ({
      recolorables: [],
      borderables: [],
      fontEditable: undefined,
      fontSizeable: undefined
    }),
    mapToEditPanelValues: (config) =>
      new Map([
        ['restaurant_name', config.restaurant_name || defaultConfig.restaurant_name],
        ['restaurant_description', config.restaurant_description || defaultConfig.restaurant_description],
        ['contact_phone', config.contact_phone || defaultConfig.contact_phone],
        ['contact_address', config.contact_address || defaultConfig.contact_address]
      ])
  });
}
