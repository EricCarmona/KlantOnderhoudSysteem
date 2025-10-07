// ============================================
// APPLICATION STATE
// ============================================
const state = {
  currentView: 'landing',
  currentUser: null,
  selectedCustomerId: null,
  activeTab: 'login',
  searchTerm: '',
  formData: {},
  errors: {}
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
  if (!dateString) return 'Niet ingepland';
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatDateShort(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function isMaintenanceDue(nextMaintenanceDate) {
  if (!nextMaintenanceDate) return false;
  const today = new Date();
  const nextDate = new Date(nextMaintenanceDate);
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 14;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg class="icon" width="20" height="20" viewBox="0 0 24 24">
      ${type === 'success' 
        ? '<path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor" stroke-width="2"/>'
        : '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor" stroke-width="2"/>'
      }
    </svg>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// VIEW RENDERING FUNCTIONS
// ============================================

function renderLandingPage() {
  const app = document.getElementById('app');
  const template = document.getElementById('landing-template');
  const clone = template.content.cloneNode(true);
  
  // Set icon based on active tab
  const iconContainer = clone.querySelector('#landing-icon');
  const isLoginTab = state.activeTab === 'login';
  iconContainer.innerHTML = isLoginTab 
    ? `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
         <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
       </svg>`
    : `<svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
         <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
         <circle cx="8.5" cy="7" r="4"/>
         <line x1="20" y1="8" x2="20" y2="14"/>
         <line x1="23" y1="11" x2="17" y2="11"/>
       </svg>`;
  
  // Set active tab
  const tabButtons = clone.querySelectorAll('.tabs-trigger');
  const tabContents = clone.querySelectorAll('.tabs-content');
  
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === state.activeTab) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  
  tabContents.forEach(content => {
    if (content.dataset.tabContent === state.activeTab) {
      content.classList.add('active');
    }
  });
  
  // Set up form handlers
  const loginForm = clone.querySelector('#login-form');
  loginForm.addEventListener('submit', handleLogin);
  
  const registerForm = clone.querySelector('#register-form');
  registerForm.addEventListener('submit', handleRegister);
  
  // Set up switch tab button
  const switchTabBtn = clone.querySelector('[data-switch-tab]');
  switchTabBtn.addEventListener('click', () => switchTab('login'));
  
  // Populate form data if exists
  if (state.formData.name) {
    clone.querySelector('#reg-name').value = state.formData.name || '';
    clone.querySelector('#reg-email').value = state.formData.email || '';
    clone.querySelector('#reg-phone').value = state.formData.phone || '';
    clone.querySelector('#reg-address').value = state.formData.address || '';
    clone.querySelector('#reg-username').value = state.formData.username || '';
    clone.querySelector('#reg-password').value = state.formData.password || '';
    clone.querySelector('#reg-confirm').value = state.formData.confirmPassword || '';
  }
  
  // Show errors
  if (state.errors.login) {
    const errorDiv = clone.querySelector('#login-error');
    errorDiv.textContent = state.errors.login;
    errorDiv.classList.remove('hidden');
  }
  
  Object.keys(state.errors).forEach(key => {
    if (key !== 'login') {
      const errorDiv = clone.querySelector(`[data-error="${key}"]`);
      if (errorDiv) {
        errorDiv.textContent = state.errors[key];
      }
    }
  });
  
  // Set up input handlers to clear errors
  const inputs = clone.querySelectorAll('input[id^="reg-"]');
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const errorKey = e.target.id.replace('reg-', '').replace('confirm', 'confirmPassword');
      clearFieldError(errorKey);
    });
  });
  
  app.innerHTML = '';
  app.appendChild(clone);
}

function renderAdminDashboard() {
  const app = document.getElementById('app');
  const template = document.getElementById('admin-dashboard-template');
  const clone = template.content.cloneNode(true);
  
  const customers = database.customers;
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
  
  // Set stats
  const urgentCount = customers.filter(c => isMaintenanceDue(c.nextMaintenance)).length;
  const totalMaintenanceCount = customers.reduce((acc, c) => acc + c.maintenanceHistory.length, 0);
  
  clone.querySelector('#stat-total').textContent = customers.length;
  clone.querySelector('#stat-urgent').textContent = urgentCount;
  clone.querySelector('#stat-recent').textContent = totalMaintenanceCount;
  
  // Set up search
  const searchInput = clone.querySelector('#customer-search');
  searchInput.value = state.searchTerm;
  searchInput.addEventListener('input', handleSearch);
  
  // Set up logout
  clone.querySelector('#admin-logout').addEventListener('click', handleLogout);
  
  // Populate table
  const tbody = clone.querySelector('#customers-table-body');
  
  if (filteredCustomers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Geen klanten gevonden</td></tr>';
  } else {
    filteredCustomers.forEach(customer => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>
          <div class="contact-info">
            <div>${customer.email}</div>
            <div>${customer.phone}</div>
          </div>
        </td>
        <td>${formatDateShort(customer.lastMaintenance)}</td>
        <td>
          <div class="date-cell">
            <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${formatDateShort(customer.nextMaintenance)}</span>
          </div>
        </td>
        <td>
          ${isMaintenanceDue(customer.nextMaintenance)
            ? '<span class="badge badge-destructive">Urgent</span>'
            : '<span class="badge badge-success">Actueel</span>'
          }
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-outline btn-sm" data-view-customer="${customer.id}">
              <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>Bekijken</span>
            </button>
            <button class="btn btn-outline btn-sm" data-edit-customer="${customer.id}">
              <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Bewerken</span>
            </button>
          </div>
        </td>
      `;
      
      // Add event listeners
      row.querySelector('[data-view-customer]').addEventListener('click', () => selectCustomer(customer.id));
      row.querySelector('[data-edit-customer]').addEventListener('click', () => selectCustomer(customer.id));
      
      tbody.appendChild(row);
    });
  }
  
  app.innerHTML = '';
  app.appendChild(clone);
}

function renderCustomerDashboard() {
  const customer = database.customers.find(c => c.id === state.selectedCustomerId);
  
  if (!customer) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="dashboard">
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div class="card" style="max-width: 28rem;">
            <div class="card-content" style="padding: 1.5rem;">
              <p style="text-align: center; color: var(--muted-foreground);">Klant niet gevonden</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return;
  }
  
  const app = document.getElementById('app');
  const template = document.getElementById('customer-dashboard-template');
  const clone = template.content.cloneNode(true);
  
  const isAdminView = state.currentUser && state.currentUser.role === 'admin';
  
  // Set header
  clone.querySelector('#customer-header-title').textContent = 
    isAdminView ? 'Klant Details' : 'Mijn Dashboard';
  
  // Show back button for admin
  if (isAdminView) {
    const backBtn = clone.querySelector('#back-button');
    backBtn.classList.remove('hidden');
    backBtn.addEventListener('click', backToAdmin);
  }
  
  // Set up logout
  clone.querySelector('#customer-logout').addEventListener('click', handleLogout);
  
  // Populate profile
  clone.querySelector('#profile-name').textContent = customer.name;
  clone.querySelector('#profile-id').textContent = `ID: ${customer.id}`;
  clone.querySelector('#profile-email').textContent = customer.email;
  clone.querySelector('#profile-phone').textContent = customer.phone;
  clone.querySelector('#profile-address').textContent = customer.address;
  
  // Populate schedule
  clone.querySelector('#schedule-last').textContent = formatDate(customer.lastMaintenance);
  clone.querySelector('#schedule-next').textContent = formatDate(customer.nextMaintenance);
  
  // Show add maintenance form for admin
  if (isAdminView) {
    const addCard = clone.querySelector('#add-maintenance-card');
    addCard.classList.remove('hidden');
    const form = addCard.querySelector('#maintenance-form');
    form.addEventListener('submit', handleAddMaintenance);
  }
  
  // Populate maintenance history
  clone.querySelector('#history-description').textContent = 
    `Alle uitgevoerde onderhoudsactiviteiten (${customer.maintenanceHistory.length} records)`;
  
  const historyContainer = clone.querySelector('#maintenance-history');
  
  if (customer.maintenanceHistory.length === 0) {
    historyContainer.innerHTML = '<p class="empty-state">Geen onderhoudsrecords beschikbaar</p>';
  } else {
    customer.maintenanceHistory.forEach((record, index) => {
      const item = document.createElement('div');
      
      item.innerHTML = `
        <div class="maintenance-item">
          <div class="maintenance-icon">
            <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="maintenance-content">
            <div class="maintenance-header">
              <div class="maintenance-title">
                <h3>${record.description}</h3>
                <p class="maintenance-meta">${formatDate(record.date)} • ${record.performedBy}</p>
              </div>
              <span class="badge badge-secondary">
                ${index === 0 ? 'Laatste' : 'Voltooid'}
              </span>
            </div>
            <div class="maintenance-notes">
              ${record.notes}
            </div>
          </div>
        </div>
        ${index < customer.maintenanceHistory.length - 1 ? '<div class="separator"></div>' : ''}
      `;
      
      historyContainer.appendChild(item);
    });
  }
  
  app.innerHTML = '';
  app.appendChild(clone);
}

// ============================================
// EVENT HANDLERS
// ============================================

function switchTab(tab) {
  state.activeTab = tab;
  state.errors = {};
  state.formData = {};
  renderLandingPage();
}

function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const user = database.users.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    state.currentUser = user;
    state.errors = {};
    if (user.role === 'admin') {
      state.currentView = 'admin';
      renderAdminDashboard();
    } else {
      state.currentView = 'customer';
      state.selectedCustomerId = user.customerId;
      renderCustomerDashboard();
    }
  } else {
    state.errors.login = 'Ongeldige gebruikersnaam of wachtwoord';
    renderLandingPage();
  }
}

function handleRegister(event) {
  event.preventDefault();
  
  state.formData = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    phone: document.getElementById('reg-phone').value,
    address: document.getElementById('reg-address').value,
    username: document.getElementById('reg-username').value,
    password: document.getElementById('reg-password').value,
    confirmPassword: document.getElementById('reg-confirm').value
  };
  
  // Validate
  state.errors = {};
  
  if (!state.formData.name.trim()) {
    state.errors.name = 'Naam is verplicht';
  }
  
  if (!state.formData.email.trim()) {
    state.errors.email = 'Email is verplicht';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.formData.email)) {
    state.errors.email = 'Ongeldig email formaat';
  }
  
  if (!state.formData.phone.trim()) {
    state.errors.phone = 'Telefoonnummer is verplicht';
  }
  
  if (!state.formData.address.trim()) {
    state.errors.address = 'Adres is verplicht';
  }
  
  if (!state.formData.username.trim()) {
    state.errors.username = 'Gebruikersnaam is verplicht';
  } else if (state.formData.username.length < 4) {
    state.errors.username = 'Gebruikersnaam moet minimaal 4 tekens zijn';
  }
  
  if (!state.formData.password) {
    state.errors.password = 'Wachtwoord is verplicht';
  } else if (state.formData.password.length < 6) {
    state.errors.password = 'Wachtwoord moet minimaal 6 tekens zijn';
  }
  
  if (state.formData.password !== state.formData.confirmPassword) {
    state.errors.confirmPassword = 'Wachtwoorden komen niet overeen';
  }
  
  // Check for duplicates
  if (database.users.find(u => u.username.toLowerCase() === state.formData.username.toLowerCase())) {
    state.errors.username = 'Gebruikersnaam is al in gebruik';
  }
  
  if (database.customers.find(c => c.email.toLowerCase() === state.formData.email.toLowerCase())) {
    state.errors.email = 'Email is al geregistreerd';
  }
  
  if (Object.keys(state.errors).length > 0) {
    renderLandingPage();
    return;
  }
  
  // Create new customer
  const existingIds = database.customers.map(c => parseInt(c.id.replace('C', '')));
  const maxId = Math.max(...existingIds, 0);
  const newCustomerId = `C${String(maxId + 1).padStart(3, '0')}`;
  
  const newCustomer = {
    id: newCustomerId,
    name: state.formData.name,
    email: state.formData.email,
    phone: state.formData.phone,
    address: state.formData.address,
    lastMaintenance: '',
    nextMaintenance: '',
    maintenanceHistory: []
  };
  
  const newUser = {
    id: `customer${Date.now()}`,
    username: state.formData.username,
    password: state.formData.password,
    role: 'customer',
    customerId: newCustomerId
  };
  
  database.users.push(newUser);
  database.customers.push(newCustomer);
  
  showToast('Account succesvol aangemaakt!');
  
  // Auto-login
  state.currentUser = newUser;
  state.currentView = 'customer';
  state.selectedCustomerId = newCustomerId;
  state.formData = {};
  state.errors = {};
  renderCustomerDashboard();
}

function clearFieldError(field) {
  if (state.errors[field]) {
    delete state.errors[field];
    const errorDiv = document.querySelector(`[data-error="${field}"]`);
    if (errorDiv) {
      errorDiv.textContent = '';
    }
  }
}

function handleLogout() {
  state.currentUser = null;
  state.currentView = 'landing';
  state.selectedCustomerId = null;
  state.activeTab = 'login';
  state.searchTerm = '';
  state.errors = {};
  state.formData = {};
  renderLandingPage();
}

function handleSearch(event) {
  state.searchTerm = event.target.value;
  renderAdminDashboard();
}

function selectCustomer(customerId) {
  state.selectedCustomerId = customerId;
  state.currentView = 'customer';
  renderCustomerDashboard();
}

function backToAdmin() {
  state.currentView = 'admin';
  state.selectedCustomerId = null;
  renderAdminDashboard();
}

function handleAddMaintenance(event) {
  event.preventDefault();
  
  const description = document.getElementById('maint-description').value;
  const notes = document.getElementById('maint-notes').value;
  
  const customer = database.customers.find(c => c.id === state.selectedCustomerId);
  if (!customer) return;
  
  const newRecord = {
    id: `M${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    description: description,
    performedBy: 'Systeem',
    notes: notes
  };
  
  customer.maintenanceHistory.unshift(newRecord);
  customer.lastMaintenance = newRecord.date;
  
  showToast('Onderhoudsrecord succesvol toegevoegd');
  renderCustomerDashboard();
}

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  renderLandingPage();
});