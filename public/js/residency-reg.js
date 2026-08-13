document.getElementById('residencyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/api/residency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.status === 'success') {
      alert('Residency certificate issued successfully!');
      window.location.href = '/generate-residency-certificate';
    } else {
      alert('Error: ' + result.message);
    }
  } catch (err) {
    alert('Error issuing residency certificate. Please try again.');
  }
});
