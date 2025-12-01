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
    customerName: document.getElementById('customer-name')?.value || '',
    customerEmail: document.getElementById('customer-email')?.value || '',
    customerPhone: document.getElementById('customer-phone')?.value || '',
    date: document.getElementById('reservation-date')?.value || '',
    time: document.getElementById('reservation-time')?.value || '',
    guests: parseInt(document.getElementById('guests-count')?.value || '0', 10),
    specialRequests: document.getElementById('special-requests')?.value || '',
    status: 'pending'
  };

  try {
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const json = await res.json();
    if (res.ok && json.isOk) {
      document.getElementById('reservation-form')?.classList.add('hidden');
      document.getElementById('reservation-success')?.classList.remove('hidden');
      window.showToast('Réservation enregistrée avec succès !', 'success');

      // update local state if available
      if (Array.isArray(appState.reservations)) {
        const r = json.reservation;
        r.__backendId = r._id;
        appState.reservations.unshift(r);
        if (typeof appState.updateReservationsList === 'function') appState.updateReservationsList();
        if (typeof appState.updateStatistics === 'function') appState.updateStatistics();
      }
    } else {
      window.showToast(json.error || "Erreur lors de l'enregistrement. Veuillez réessayer.", 'error');
    }
  } catch (err) {
    console.error(err);
    window.showToast('Erreur réseau. Veuillez réessayer.', 'error');
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
