export function initReservationPage(appState) {
  const dateInput = document.getElementById('reservation-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  const form = document.getElementById('reservation-form');
  if (form) {
    form.addEventListener('submit', (event) => handleReservationSubmit(event, appState));
  }

  window.resetReservationForm = () => resetReservationForm(form);

  return {
    focusDefault: () => dateInput?.focus()
  };
}

async function handleReservationSubmit(event, appState) {
  event.preventDefault();

  if (appState.reservations.length >= 999) {
    window.showToast('Limite de 999 réservations atteinte. Veuillez supprimer des réservations anciennes.', 'error');
    return;
  }

  const submitButton = document.getElementById('submit-reservation');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  if (submitButton && submitText && submitSpinner) {
    submitButton.disabled = true;
    submitText.textContent = 'Envoi en cours...';
    submitSpinner.classList.remove('hidden');
  }

  const formData = {
    id: Date.now().toString(),
    type: 'reservation',
    customerName: document.getElementById('customer-name')?.value || '',
    customerEmail: document.getElementById('customer-email')?.value || '',
    customerPhone: document.getElementById('customer-phone')?.value || '',
    date: document.getElementById('reservation-date')?.value || '',
    time: document.getElementById('reservation-time')?.value || '',
    guests: parseInt(document.getElementById('guests-count')?.value || '0', 10),
    specialRequests: document.getElementById('special-requests')?.value || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  if (!window.dataSdk) {
    window.showToast("Data SDK non disponible. Impossible d'enregistrer la réservation.", 'error');
    resetButtonState(submitButton, submitText, submitSpinner);
    return;
  }

  const result = await window.dataSdk.create(formData);

  if (result.isOk) {
    document.getElementById('reservation-form')?.classList.add('hidden');
    document.getElementById('reservation-success')?.classList.remove('hidden');
    window.showToast('Réservation enregistrée avec succès !', 'success');
  } else {
    window.showToast("Erreur lors de l'enregistrement. Veuillez réessayer.", 'error');
  }

  resetButtonState(submitButton, submitText, submitSpinner);
}

function resetReservationForm(form) {
  form?.reset();
  document.getElementById('reservation-form')?.classList.remove('hidden');
  document.getElementById('reservation-success')?.classList.add('hidden');
}

function resetButtonState(button, textElement, spinner) {
  if (button) {
    button.disabled = false;
  }
  if (textElement) {
    textElement.textContent = 'Confirmer la réservation';
  }
  if (spinner) {
    spinner.classList.add('hidden');
  }
}
