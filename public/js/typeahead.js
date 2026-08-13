// Typeahead Search with Auto-population
class Typeahead {
  constructor(inputId, options = {}) {
    this.input = document.getElementById(inputId);
    if (!this.input) return;

    this.options = {
      minChars: 2,
      delay: 300,
      onSelect: options.onSelect || (() => {}),
      fieldMappings: options.fieldMappings || {},
      // For split name fields (surname + givenname)
      surnameField: options.surnameField || null,
      givennameField: options.givennameField || null,
      ...options,
    };

    this.dropdown = null;
    this.timeout = null;
    this.init();
  }

  init() {
    // Create dropdown container
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'typeahead-dropdown hidden absolute z-50 w-full bg-dark-800 border border-dark-700 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg';
    this.input.parentElement.style.position = 'relative';
    this.input.parentElement.appendChild(this.dropdown);

    // Add event listeners
    this.input.addEventListener('input', () => this.onInput());
    this.input.addEventListener('focus', () => this.onInput());
    this.input.addEventListener('blur', () => setTimeout(() => this.hideDropdown(), 200));

    // Add styles if not already added
    if (!document.getElementById('typeahead-styles')) {
      const style = document.createElement('style');
      style.id = 'typeahead-styles';
      style.textContent = `
        .typeahead-dropdown { position: absolute; left: 0; right: 0; }
        .typeahead-item { padding: 10px 12px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .typeahead-item:last-child { border-bottom: none; }
        .typeahead-item:hover { background: rgba(99, 102, 241, 0.2); }
        .typeahead-item .name { font-weight: 500; }
        .typeahead-item .details { font-size: 12px; color: #9ca3af; }
      `;
      document.head.appendChild(style);
    }
  }

  async onInput() {
    const query = this.input.value.trim();
    
    if (query.length < this.options.minChars) {
      this.hideDropdown();
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.search(query), this.options.delay);
  }

  async search(query) {
    try {
      const res = await fetch(`/api/admin/search-clients?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.status === 'success' && data.data.length > 0) {
        this.showResults(data.data);
      } else {
        this.hideDropdown();
      }
    } catch (err) {
      console.error('Typeahead search error:', err);
      this.hideDropdown();
    }
  }

  showResults(results) {
    this.dropdown.innerHTML = results.map(client => `
      <div class="typeahead-item" data-client='${JSON.stringify(client).replace(/'/g, "&#39;")}'>
        <div class="name">${client.name}</div>
        <div class="details">${client.email || ''} ${client.phone ? '• ' + client.phone : ''}</div>
      </div>
    `).join('');

    this.dropdown.querySelectorAll('.typeahead-item').forEach(item => {
      item.addEventListener('click', () => {
        const client = JSON.parse(item.dataset.client.replace(/&#39;/g, "'"));
        this.selectClient(client);
      });
    });

    this.dropdown.classList.remove('hidden');
  }

  hideDropdown() {
    this.dropdown.classList.add('hidden');
  }

  // Helper to split name into surname and given name
  splitName(fullName) {
    if (!fullName) return { surname: '', givenname: '' };
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { surname: parts[0], givenname: '' };
    }
    // Assume last word is surname, rest is given name
    const surname = parts[parts.length - 1];
    const givenname = parts.slice(0, -1).join(' ');
    return { surname, givenname };
  }

  selectClient(client) {
    const { surname, givenname } = this.splitName(client.name);

    // Handle split name fields (surname + givenname)
    if (this.options.surnameField && this.options.givennameField) {
      const surnameInput = document.getElementById(this.options.surnameField);
      const givennameInput = document.getElementById(this.options.givennameField);
      if (surnameInput) surnameInput.value = surname;
      if (givennameInput) givennameInput.value = givenname;
      // Also set the trigger input
      this.input.value = this.input.id.includes('surname') ? surname : givenname;
    } else {
      // Single name field - set full name
      this.input.value = client.name;
    }

    // Auto-populate mapped fields
    Object.entries(this.options.fieldMappings).forEach(([fieldId, clientKey]) => {
      const field = document.getElementById(fieldId);
      if (field && client[clientKey]) {
        field.value = client[clientKey];
      }
    });

    // Call custom onSelect callback
    this.options.onSelect(client);

    this.hideDropdown();
  }
}

// Initialize typeahead on page load
document.addEventListener('DOMContentLoaded', () => {
  // Birth form - Father's Information (full name field)
  if (document.getElementById('father_name')) {
    new Typeahead('father_name', {
      fieldMappings: {
        'father_born_at': 'address',
        'father_resident_at': 'address',
        'father_ref_doc': 'idNumber',
      }
    });
  }

  // Birth form - Mother's Information (full name field)
  if (document.getElementById('mother_name')) {
    new Typeahead('mother_name', {
      fieldMappings: {
        'mother_born_at': 'address',
        'mother_resident_at': 'address',
        'mother_ref_doc': 'idNumber',
      }
    });
  }

  // Death form - Deceased Information (surname + givenname)
  if (document.getElementById('deceased_surname')) {
    new Typeahead('deceased_surname', {
      surnameField: 'deceased_surname',
      givennameField: 'deceased_givenname',
      fieldMappings: {
        'deceased_residence': 'address',
        'deceased_id_num': 'idNumber',
      }
    });
  }
  if (document.getElementById('deceased_givenname')) {
    new Typeahead('deceased_givenname', {
      surnameField: 'deceased_surname',
      givennameField: 'deceased_givenname',
      fieldMappings: {
        'deceased_residence': 'address',
        'deceased_id_num': 'idNumber',
      }
    });
  }

  // Death form - Declarant Information (full name field)
  if (document.getElementById('declarant_name')) {
    new Typeahead('declarant_name', {
      fieldMappings: {
        'declarant_id_num': 'idNumber',
        'declarant_address': 'address',
      }
    });
  }

  // Marriage form - Groom Information (surname + givenname)
  if (document.getElementById('groom_surname')) {
    new Typeahead('groom_surname', {
      surnameField: 'groom_surname',
      givennameField: 'groom_given_name',
      fieldMappings: {
        'groom_resident_at': 'address',
        'groom_id_num': 'idNumber',
      }
    });
  }
  if (document.getElementById('groom_given_name')) {
    new Typeahead('groom_given_name', {
      surnameField: 'groom_surname',
      givennameField: 'groom_given_name',
      fieldMappings: {
        'groom_resident_at': 'address',
        'groom_id_num': 'idNumber',
      }
    });
  }

  // Marriage form - Bride Information (surname + givenname)
  if (document.getElementById('bride_surname')) {
    new Typeahead('bride_surname', {
      surnameField: 'bride_surname',
      givennameField: 'bride_given_name',
      fieldMappings: {
        'bride_resident_at': 'address',
        'bride_id_num': 'idNumber',
      }
    });
  }
  if (document.getElementById('bride_given_name')) {
    new Typeahead('bride_given_name', {
      surnameField: 'bride_surname',
      givennameField: 'bride_given_name',
      fieldMappings: {
        'bride_resident_at': 'address',
        'bride_id_num': 'idNumber',
      }
    });
  }

  // Residency form - Applicant Information (surname + givenname)
  if (document.getElementById('applicant_surname')) {
    new Typeahead('applicant_surname', {
      surnameField: 'applicant_surname',
      givennameField: 'applicant_givenname',
      fieldMappings: {
        'applicant_id_num': 'idNumber',
        'residence_address': 'address',
      }
    });
  }
  if (document.getElementById('applicant_givenname')) {
    new Typeahead('applicant_givenname', {
      surnameField: 'applicant_surname',
      givennameField: 'applicant_givenname',
      fieldMappings: {
        'applicant_id_num': 'idNumber',
        'residence_address': 'address',
      }
    });
  }
});
