document.getElementById('deathForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/api/deaths', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (result.status === 'success') {
      alert('Death certificate registered successfully!');
      window.location.href = '/generate-death-certificate';
    } else {
      alert('Error: ' + result.message);
    }
  } catch (err) {
    alert('Error registering death certificate. Please try again.');
  }
});
