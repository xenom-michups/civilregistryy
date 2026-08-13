// Birth Registration Form Handler
const birthForm = document.getElementById('birthForm');

if (birthForm) {
  birthForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(birthForm);
    const data = {
      surname: formData.get('surname'),
      givenname: formData.get('givenname'),
      bornAt: formData.get('born_at'),
      bornOn: formData.get('born_on'),
      sex: formData.get('sex'),
      fatherName: formData.get('father_name'),
      fatherBornAt: formData.get('father_born_at'),
      fatherBornOn: formData.get('father_born_on'),
      fatherResidentAt: formData.get('father_resident_at'),
      fatherOccupation: formData.get('father_occupation'),
      fatherNationality: formData.get('father_nationality'),
      fatherRefDoc: formData.get('father_ref_doc'),
      motherName: formData.get('mother_name'),
      motherBornAt: formData.get('mother_born_at'),
      motherBornOn: formData.get('mother_born_on'),
      motherResidentAt: formData.get('mother_resident_at'),
      motherOccupation: formData.get('mother_occupation'),
      motherNationality: formData.get('mother_nationality'),
      motherRefDoc: formData.get('mother_ref_doc'),
    };

    const submitBtn = birthForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Registering...</span>
    `;
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/certificates/birth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'success') {
        showNotification('Birth certificate registered successfully!', 'success');
        birthForm.reset();
        // Redirect to view certificate
        setTimeout(() => {
          window.location.href = '/generate-birth-certificate';
        }, 1500);
      } else {
        showNotification(result.message || 'Failed to register birth certificate', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  } text-white`;
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${
          type === 'success'
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
