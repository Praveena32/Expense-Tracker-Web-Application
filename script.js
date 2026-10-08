/**
 * Expense Tracker — Modern Authentication UI Logic
 * Handles visual UI state simulations, password toggle, and interactive design spec drawer.
 * (No backend, authentication or database logic included as instructed)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const emailGroup = document.getElementById('emailGroup');
  const emailWrapper = emailGroup?.querySelector('.input-wrapper');
  const emailFeedback = document.getElementById('emailFeedback');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const eyeShow = togglePasswordBtn?.querySelector('.eye-show');
  const eyeHide = togglePasswordBtn?.querySelector('.eye-hide');
  const signInBtn = document.getElementById('signInBtn');
  const loginForm = document.getElementById('loginForm');

  // State Switcher Buttons
  const stateChips = document.querySelectorAll('.state-chip');

  // Spec Sheet Modal Elements
  const specModal = document.getElementById('specModal');
  const openSpecModalBtn = document.getElementById('openSpecModalBtn');
  const closeSpecModalBtn = document.getElementById('closeSpecModalBtn');

  /* -------------------------------------------------------------------------
     1. Password Visibility Toggle
     ------------------------------------------------------------------------- */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      if (isPassword) {
        eyeShow.style.display = 'none';
        eyeHide.style.display = 'block';
        togglePasswordBtn.setAttribute('aria-label', 'Hide password');
      } else {
        eyeShow.style.display = 'block';
        eyeHide.style.display = 'none';
        togglePasswordBtn.setAttribute('aria-label', 'Show password');
      }
    });
  }

  /* -------------------------------------------------------------------------
     2. UI State Showcase Engine
     ------------------------------------------------------------------------- */
  function applyVisualState(stateName) {
    // Reset all custom simulation states first
    emailWrapper?.classList.remove('forced-focus', 'is-error');
    emailFeedback?.classList.remove('visible');
    signInBtn?.removeAttribute('disabled');
    signInBtn?.classList.remove('is-disabled', 'is-loading');

    // Update active pill in controller
    stateChips.forEach(chip => {
      if (chip.getAttribute('data-state') === stateName) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Apply specific state visual representations
    switch (stateName) {
      case 'normal':
        emailInput?.blur();
        passwordInput?.blur();
        break;

      case 'focused':
        emailWrapper?.classList.add('forced-focus');
        emailInput?.focus();
        break;

      case 'error':
        emailWrapper?.classList.add('is-error');
        if (emailFeedback) {
          emailFeedback.textContent = 'Invalid email address format (e.g. name@company.com)';
          emailFeedback.classList.add('visible');
        }
        break;

      case 'disabled':
        signInBtn?.setAttribute('disabled', 'true');
        signInBtn?.classList.add('is-disabled');
        break;

      case 'loading':
        signInBtn?.classList.add('is-loading');
        break;

      default:
        break;
    }
  }

  // Connect state switcher buttons
  stateChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const targetState = e.currentTarget.getAttribute('data-state');
      applyVisualState(targetState);
    });
  });

  /* -------------------------------------------------------------------------
     3. Natural Input Interactions
     ------------------------------------------------------------------------- */
  // Clear error visuals on natural typing
  emailInput?.addEventListener('input', () => {
    if (emailWrapper?.classList.contains('is-error')) {
      emailWrapper.classList.remove('is-error');
      emailFeedback?.classList.remove('visible');
      // Set chip to normal if error was active
      const activeChip = document.querySelector('.state-chip.active');
      if (activeChip?.getAttribute('data-state') === 'error') {
        document.getElementById('btnStateNormal')?.click();
      }
    }
  });

  // Natural form submit simulation: show loading animation for 1.8s
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (signInBtn?.hasAttribute('disabled') || signInBtn?.classList.contains('is-loading')) {
      return;
    }

    // Trigger visual loading state
    applyVisualState('loading');

    setTimeout(() => {
      // Revert to normal state after visual preview
      applyVisualState('normal');
    }, 1800);
  });

  /* -------------------------------------------------------------------------
     4. Design Spec Modal Handlers
     ------------------------------------------------------------------------- */
  function openModal() {
    specModal?.classList.add('open');
    specModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    specModal?.classList.remove('open');
    specModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openSpecModalBtn?.addEventListener('click', openModal);
  closeSpecModalBtn?.addEventListener('click', closeModal);

  specModal?.addEventListener('click', (e) => {
    if (e.target === specModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && specModal?.classList.contains('open')) {
      closeModal();
    }
  });
});
