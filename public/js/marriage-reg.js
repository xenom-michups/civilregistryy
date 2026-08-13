// Marriage Registration Form Handler
const marriageForm = document.getElementById('marriageForm');

if (marriageForm) {
  marriageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(marriageForm);
    const data = {
      groomGivenName: formData.get('groom_given_name'),
      groomSurname: formData.get('groom_surname'),
      groomBornOn: formData.get('groom_born_on'),
      groomPlaceBirth: formData.get('groom_place_birth'),
      groomResidentAt: formData.get('groom_resident_at'),
      groomProfession: formData.get('groom_profession'),
      groomNationality: formData.get('groom_nationality'),
      groomIdNum: formData.get('groom_id_num'),
      groomFatherName: formData.get('groom_father_name'),
      groomMotherName: formData.get('groom_mother_name'),
      groomFamilyHead: formData.get('groom_family_head'),
      groomWitnessName: formData.get('groom_witness_name'),
      brideGivenName: formData.get('bride_given_name'),
      brideSurname: formData.get('bride_surname'),
      brideBornOn: formData.get('bride_born_on'),
      bridePlaceBirth: formData.get('bride_place_birth'),
      brideResidentAt: formData.get('bride_resident_at'),
      brideProfession: formData.get('bride_profession'),
      brideNationality: formData.get('bride_nationality'),
      brideIdNum: formData.get('bride_id_num'),
      brideFatherName: formData.get('bride_father_name'),
      brideMotherName: formData.get('bride_mother_name'),
      brideFamilyHead: formData.get('bride_family_head'),
      brideWitnessName: formData.get('bride_witness_name'),
      matrimonialRegime: formData.get('matrimonial_regime'),
      marriageType: formData.get('marriage_type'),
      objections: formData.get('objections'),
    };

    const submitBtn = marriageForm.querySelector('button[type="submit"]');
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
      const response = await fetch('/api/certificates/marriage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'success') {
        showNotification('Marriage certificate registered successfully!', 'success');
        marriageForm.reset();
        // Redirect to view certificate
        setTimeout(() => {
          window.location.href = '/generate-marriage-certificate';
        }, 1500);
      } else {
        showNotification(result.message || 'Failed to register marriage certificate', 'error');
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
