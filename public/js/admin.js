// Admin Dashboard JavaScript
let currentTab = 'births';
let currentPage = 1;
let perPage = 10;
let searchQuery = '';
let sortBy = 'newest';
let totalPages = 1;

// Tab switching
document.querySelectorAll('.admin-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(b => {
      b.classList.remove('bg-dark-800', 'text-primary-500', 'border-b-2', 'border-primary-500');
      b.classList.add('text-dark-400');
    });
    btn.classList.add('bg-dark-800', 'text-primary-500', 'border-b-2', 'border-primary-500');
    btn.classList.remove('text-dark-400');
    
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(btn.dataset.tab + 'Tab').classList.remove('hidden');
    
    currentTab = btn.dataset.tab;
    currentPage = 1;
    
    // Show/hide add staff button
    document.getElementById('addStaffBtn').classList.toggle('hidden', currentTab !== 'users');
    
    loadData();
  });
});

// Search
document.getElementById('searchInput').addEventListener('input', debounce((e) => {
  searchQuery = e.target.value;
  currentPage = 1;
  loadData();
}, 300));

// Sort
document.getElementById('sortSelect').addEventListener('change', (e) => {
  sortBy = e.target.value;
  currentPage = 1;
  loadData();
});

// Per page
document.getElementById('perPageSelect').addEventListener('change', (e) => {
  perPage = parseInt(e.target.value);
  currentPage = 1;
  loadData();
});

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


// Load data based on current tab
async function loadData() {
  const tableId = currentTab + 'Table';
  document.getElementById(tableId).innerHTML = '<div class="text-center py-8 text-dark-400">Loading...</div>';
  
  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: perPage,
      search: searchQuery,
      sort: sortBy
    });
    
    const res = await fetch(`/api/admin/${currentTab}?${params}`);
    const data = await res.json();
    
    if (data.status === 'success') {
      renderTable(currentTab, data.data);
      updatePagination(data.pagination);
    } else {
      document.getElementById(tableId).innerHTML = '<div class="text-center py-8 text-red-400">Error loading data</div>';
    }
  } catch (err) {
    document.getElementById(tableId).innerHTML = '<div class="text-center py-8 text-red-400">Error loading data</div>';
  }
}

function renderTable(type, data) {
  const tableId = type + 'Table';
  let html = '';
  
  if (!data || data.length === 0) {
    document.getElementById(tableId).innerHTML = '<div class="text-center py-8 text-dark-400">No records found</div>';
    return;
  }
  
  switch(type) {
    case 'births':
      html = renderBirthsTable(data);
      break;
    case 'deaths':
      html = renderDeathsTable(data);
      break;
    case 'marriages':
      html = renderMarriagesTable(data);
      break;
    case 'residencies':
      html = renderResidenciesTable(data);
      break;
    case 'requests':
      html = renderRequestsTable(data);
      break;
    case 'users':
      html = renderUsersTable(data);
      break;
  }
  
  document.getElementById(tableId).innerHTML = html;
}

function renderBirthsTable(data) {
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">Certificate #</th>
      <th class="table-header">Name</th>
      <th class="table-header">Date of Birth</th>
      <th class="table-header">Place</th>
      <th class="table-header">Sex</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(b => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs text-primary-500">${b.certificateNumber || '-'}</td>
        <td class="table-cell font-medium">${b.givenname || ''} ${b.surname || ''}</td>
        <td class="table-cell text-dark-400">${b.bornOn ? new Date(b.bornOn).toLocaleDateString() : '-'}</td>
        <td class="table-cell text-dark-400">${b.bornAt || '-'}</td>
        <td class="table-cell"><span class="px-2 py-1 text-xs rounded-full ${b.sex === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}">${b.sex || '-'}</span></td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="birth" data-id="${b.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          <button data-action="print" data-type="birth" data-id="${b.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="Print"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}


function renderDeathsTable(data) {
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">Certificate #</th>
      <th class="table-header">Deceased Name</th>
      <th class="table-header">Date of Death</th>
      <th class="table-header">Place</th>
      <th class="table-header">Cause</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(d => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs text-primary-500">${d.certificateNumber || '-'}</td>
        <td class="table-cell font-medium">${d.deceasedGivenname || ''} ${d.deceasedSurname || ''}</td>
        <td class="table-cell text-dark-400">${d.deathDate ? new Date(d.deathDate).toLocaleDateString() : '-'}</td>
        <td class="table-cell text-dark-400">${d.deathPlace || '-'}</td>
        <td class="table-cell text-dark-400">${d.causeOfDeath || '-'}</td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="death" data-id="${d.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          <button data-action="print" data-type="death" data-id="${d.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="Print"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderMarriagesTable(data) {
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">Certificate #</th>
      <th class="table-header">Groom</th>
      <th class="table-header">Bride</th>
      <th class="table-header">Date</th>
      <th class="table-header">Type</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(m => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs text-primary-500">${m.certificateNumber || '-'}</td>
        <td class="table-cell font-medium">${m.groomGivenName || ''} ${m.groomSurname || ''}</td>
        <td class="table-cell font-medium">${m.brideGivenName || ''} ${m.brideSurname || ''}</td>
        <td class="table-cell text-dark-400">${m.drawnUpOn ? new Date(m.drawnUpOn).toLocaleDateString() : '-'}</td>
        <td class="table-cell"><span class="px-2 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">${m.marriageType || '-'}</span></td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="marriage" data-id="${m.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          <button data-action="print" data-type="marriage" data-id="${m.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="Print"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}


function renderResidenciesTable(data) {
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">Certificate #</th>
      <th class="table-header">Name</th>
      <th class="table-header">Address</th>
      <th class="table-header">Purpose</th>
      <th class="table-header">Issued</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(r => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs text-primary-500">${r.certificateNumber || '-'}</td>
        <td class="table-cell font-medium">${r.givenName || ''} ${r.surname || ''}</td>
        <td class="table-cell text-dark-400">${r.address || '-'}</td>
        <td class="table-cell text-dark-400">${r.purpose || '-'}</td>
        <td class="table-cell text-dark-400">${r.issuedOn ? new Date(r.issuedOn).toLocaleDateString() : '-'}</td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="residency" data-id="${r.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          <button data-action="print" data-type="residency" data-id="${r.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="Print"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderRequestsTable(data) {
  const statusColors = { pending: 'yellow', processing: 'blue', approved: 'green', completed: 'green', rejected: 'red' };
  const typeColors = { birth: 'blue', death: 'gray', marriage: 'pink', residency: 'green' };
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">Request #</th>
      <th class="table-header">Type</th>
      <th class="table-header">Requester</th>
      <th class="table-header">Email</th>
      <th class="table-header">Date</th>
      <th class="table-header">Status</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(r => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs text-primary-500">${r.requestNumber || '-'}</td>
        <td class="table-cell"><span class="px-2 py-1 text-xs rounded-full bg-${typeColors[r.certificateType] || 'primary'}-500/20 text-${typeColors[r.certificateType] || 'primary'}-400 capitalize">${r.certificateType || '-'}</span></td>
        <td class="table-cell font-medium">${r.fullName || '-'}</td>
        <td class="table-cell text-dark-400">${r.email || '-'}</td>
        <td class="table-cell text-dark-400">${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
        <td class="table-cell"><span class="px-2 py-1 text-xs rounded-full bg-${statusColors[r.status] || 'gray'}-500/20 text-${statusColors[r.status] || 'gray'}-400 capitalize">${r.status || '-'}</span></td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="request" data-id="${r.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
          <button data-action="edit" data-type="request" data-id="${r.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="Update Status"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}


function renderUsersTable(data) {
  const roleColors = { admin: 'red', registrar: 'blue', client: 'green' };
  return `<div class="overflow-x-auto"><table class="w-full">
    <thead class="bg-dark-800/50"><tr>
      <th class="table-header">ID</th>
      <th class="table-header">Name</th>
      <th class="table-header">Email</th>
      <th class="table-header">Role</th>
      <th class="table-header">Phone</th>
      <th class="table-header">Created</th>
      <th class="table-header">Actions</th>
    </tr></thead>
    <tbody class="divide-y divide-dark-700">
      ${data.map(u => `<tr class="hover:bg-dark-800/50">
        <td class="table-cell font-mono text-xs">${u.id}</td>
        <td class="table-cell font-medium">${u.name || '-'}</td>
        <td class="table-cell text-dark-400">${u.email || '-'}</td>
        <td class="table-cell"><span class="px-2 py-1 text-xs rounded-full bg-${roleColors[u.role] || 'gray'}-500/20 text-${roleColors[u.role] || 'gray'}-400 capitalize">${u.role || '-'}</span></td>
        <td class="table-cell text-dark-400">${u.phone || '-'}</td>
        <td class="table-cell text-dark-400">${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
        <td class="table-cell"><div class="flex gap-2">
          <button data-action="view" data-type="user" data-id="${u.id}" class="action-btn p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white" title="View"><svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
        </div></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function updatePagination(pagination) {
  if (!pagination) return;
  totalPages = pagination.totalPages || 1;
  const total = pagination.total || 0;
  const start = ((currentPage - 1) * perPage) + 1;
  const end = Math.min(currentPage * perPage, total);
  
  document.getElementById('paginationInfo').textContent = `Showing ${total > 0 ? start : 0} to ${end} of ${total} entries`;
  document.getElementById('prevBtn').disabled = currentPage <= 1;
  document.getElementById('nextBtn').disabled = currentPage >= totalPages;
  
  // Page numbers
  let pageHtml = '';
  for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
    pageHtml += `<button data-page="${i}" class="page-btn px-3 py-1 rounded ${i === currentPage ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}">${i}</button>`;
  }
  document.getElementById('pageNumbers').innerHTML = pageHtml;
}

function goToPage(page) {
  currentPage = page;
  loadData();
}

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; loadData(); }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPage < totalPages) { currentPage++; loadData(); }
});

// View record
async function viewRecord(type, id) {
  document.getElementById('viewModal').classList.remove('hidden');
  document.getElementById('viewModalContent').innerHTML = '<div class="text-center py-8 text-dark-400">Loading...</div>';
  
  try {
    const res = await fetch(`/api/admin/${type}/${id}`);
    const data = await res.json();
    if (data.status === 'success') {
      document.getElementById('viewModalTitle').textContent = type.charAt(0).toUpperCase() + type.slice(1) + ' Details';
      document.getElementById('viewModalContent').innerHTML = renderDetails(type, data.data);
      document.getElementById('printCertBtn').onclick = () => printRecord(type, id);
    }
  } catch (err) {
    document.getElementById('viewModalContent').innerHTML = '<div class="text-center py-8 text-red-400">Error loading details</div>';
  }
}

function closeViewModal() {
  document.getElementById('viewModal').classList.add('hidden');
}


function renderDetails(type, data) {
  if (type === 'request') {
    return renderRequestDetails(data);
  }
  
  const fields = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'password' || key === 'passwordResetToken' || key === 'passwordResetExpires') continue;
    let displayValue = value;
    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      displayValue = new Date(value).toLocaleDateString();
    }
    fields.push(`<div class="py-3 border-b border-dark-700"><span class="text-dark-400 text-sm capitalize">${key.replace(/([A-Z])/g, ' $1').trim()}</span><p class="font-medium mt-1">${displayValue || '-'}</p></div>`);
  }
  return `<div class="space-y-1">${fields.join('')}</div>`;
}

function renderRequestDetails(data) {
  const formatDate = (val) => val ? new Date(val).toLocaleDateString() : '-';
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 class="text-primary-500 font-semibold mb-4">Request Information</h4>
        <div class="space-y-3">
          <div><span class="text-dark-400 text-sm">Request #:</span><p class="font-medium">${data.requestNumber || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Type:</span><p class="font-medium capitalize">${data.certificateType || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Status:</span><p class="font-medium capitalize">${data.status || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Purpose:</span><p class="font-medium">${data.purpose || '-'}</p></div>
        </div>
      </div>
      <div>
        <h4 class="text-primary-500 font-semibold mb-4">Requester Information</h4>
        <div class="space-y-3">
          <div><span class="text-dark-400 text-sm">Name:</span><p class="font-medium">${data.fullName || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Email:</span><p class="font-medium">${data.email || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Phone:</span><p class="font-medium">${data.phone || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">ID:</span><p class="font-medium">${data.idNumber || '-'}</p></div>
          <div><span class="text-dark-400 text-sm">Address:</span><p class="font-medium">${data.address || '-'}</p></div>
        </div>
      </div>
    </div>
    <div class="mt-6">
      <h4 class="text-primary-500 font-semibold mb-4">Subject Information</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><span class="text-dark-400 text-sm">Name:</span><p class="font-medium">${data.subjectName || '-'}</p></div>
        <div><span class="text-dark-400 text-sm">DOB:</span><p class="font-medium">${formatDate(data.subjectDob)}</p></div>
        <div><span class="text-dark-400 text-sm">Relationship:</span><p class="font-medium">${data.relationship || '-'}</p></div>
      </div>
    </div>
    <div class="mt-6 pt-6 border-t border-dark-700">
      <h4 class="font-semibold mb-4">Update Status</h4>
      <div class="flex flex-wrap gap-2">
        <button data-id="${data.id}" data-status="processing" class="status-btn px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors">Mark Processing</button>
        <button data-id="${data.id}" data-status="approved" class="status-btn px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors">Approve</button>
        <button data-id="${data.id}" data-status="ready" class="status-btn px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors">Mark Ready</button>
        <button data-id="${data.id}" data-status="completed" class="status-btn px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-sm transition-colors">Mark Collected</button>
        <button data-id="${data.id}" data-status="rejected" class="status-btn px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">Reject</button>
      </div>
    </div>
  `;
}

async function changeRequestStatus(id, status) {
  try {
    const res = await fetch(`/api/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Status updated successfully!');
      closeViewModal();
      loadData();
    } else {
      alert(data.message || 'Error updating status');
    }
  } catch (err) {
    alert('Error updating status');
  }
}

function printRecord(type, id) {
  const printUrls = {
    birth: `/print-ready?id=${id}`,
    death: `/print-ready-death?id=${id}`,
    marriage: `/print-ready-marriage?id=${id}`,
    residency: `/print-ready-residency?id=${id}`
  };
  if (printUrls[type]) {
    window.open(printUrls[type], '_blank');
  }
}

// Print current table
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// Add Staff Modal
document.getElementById('addStaffBtn').addEventListener('click', () => {
  document.getElementById('addStaffModal').classList.remove('hidden');
});

function closeModal() {
  document.getElementById('addStaffModal').classList.add('hidden');
}

document.getElementById('addStaffForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('staffName').value;
  const email = document.getElementById('staffEmail').value;
  const role = document.getElementById('staffRole').value;
  const password = document.getElementById('staffPassword').value;
  
  try {
    const res = await fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password })
    });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Staff member created successfully!');
      closeModal();
      document.getElementById('addStaffForm').reset();
      loadData();
    } else {
      alert(data.message || 'Error creating staff member');
    }
  } catch (err) {
    alert('Error creating staff member');
  }
});

// Update request status
async function updateRequestStatus(id) {
  const status = prompt('Enter new status (pending, processing, approved, completed, rejected):');
  if (!status) return;
  
  try {
    const res = await fetch(`/api/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Status updated successfully!');
      loadData();
    } else {
      alert(data.message || 'Error updating status');
    }
  } catch (err) {
    alert('Error updating status');
  }
}

// Make functions globally accessible for inline onclick handlers
window.closeViewModal = closeViewModal;
window.closeModal = closeModal;
window.viewRecord = viewRecord;
window.printRecord = printRecord;
window.updateRequestStatus = updateRequestStatus;
window.changeRequestStatus = changeRequestStatus;
window.goToPage = goToPage;

// Modal close event listeners
document.getElementById('viewModalBackdrop').addEventListener('click', closeViewModal);
document.getElementById('closeViewModalBtn').addEventListener('click', closeViewModal);
document.getElementById('addStaffModalBackdrop').addEventListener('click', closeModal);
document.getElementById('closeStaffModalBtn').addEventListener('click', closeModal);

// Event delegation for dynamically created table action buttons
document.addEventListener('click', function(e) {
  const actionBtn = e.target.closest('.action-btn');
  if (actionBtn) {
    const action = actionBtn.dataset.action;
    const type = actionBtn.dataset.type;
    const id = parseInt(actionBtn.dataset.id);
    
    if (action === 'view') {
      viewRecord(type, id);
    } else if (action === 'print') {
      printRecord(type, id);
    } else if (action === 'edit') {
      updateRequestStatus(id);
    }
  }
  
  // Handle pagination buttons
  const pageBtn = e.target.closest('.page-btn');
  if (pageBtn) {
    const page = parseInt(pageBtn.dataset.page);
    goToPage(page);
  }
  
  // Handle status change buttons in modal
  const statusBtn = e.target.closest('.status-btn');
  if (statusBtn) {
    const id = parseInt(statusBtn.dataset.id);
    const status = statusBtn.dataset.status;
    changeRequestStatus(id, status);
  }
});

// Initial load
loadData();
