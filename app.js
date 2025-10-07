const state = {
  currentView: 'landing',
  currentUser: null,
  selectedCustomerId: null,
  activeTab: 'login',
  searchTerm: '',
  formData: {},
  errors: {}
};

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



