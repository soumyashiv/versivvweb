document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();

  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const successState = document.getElementById('success-state');
  const formState = document.getElementById('form-state');
  
  const resetForm = document.getElementById('reset-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const formError = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const strengthContainer = document.getElementById('strength-container');
  const strengthBar = document.getElementById('strength-bar');

  // Supabase CDN automatically parses the hash fragment for access_token in password recovery
  // So we just check if we have a valid session.
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  
  loadingState.classList.add('hidden');

  if (error || !session) {
    errorState.classList.remove('hidden');
    return;
  }

  // Session is valid, show form
  formState.classList.remove('hidden');

  // Toggle Password Visibility
  let showPassword = false;
  togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    confirmPasswordInput.type = showPassword ? 'text' : 'password';
    eyeIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
    lucide.createIcons();
  });

  // Password Strength logic
  const updateRule = (id, isMet) => {
    const el = document.getElementById(id);
    if (isMet) {
      el.classList.remove('bg-gray-200', 'text-transparent', 'dark:bg-gray-700');
      el.classList.add('bg-green-500', 'text-white');
    } else {
      el.classList.add('bg-gray-200', 'text-transparent', 'dark:bg-gray-700');
      el.classList.remove('bg-green-500', 'text-white');
    }
  };

  const validatePassword = (pass) => {
    const rules = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };

    updateRule('rule-length', rules.length);
    updateRule('rule-uppercase', rules.uppercase);
    updateRule('rule-lowercase', rules.lowercase);
    updateRule('rule-number', rules.number);
    updateRule('rule-special', rules.special);

    const metCount = Object.values(rules).filter(Boolean).length;
    
    strengthBar.style.width = `${(metCount / 5) * 100}%`;
    
    strengthBar.classList.remove('bg-red-500', 'bg-yellow-500', 'bg-green-500');
    if (metCount > 0 && metCount <= 2) strengthBar.classList.add('bg-red-500');
    if (metCount > 2 && metCount <= 4) strengthBar.classList.add('bg-yellow-500');
    if (metCount === 5) strengthBar.classList.add('bg-green-500');

    return metCount === 5;
  };

  passwordInput.addEventListener('input', (e) => {
    const pass = e.target.value;
    if (pass.length > 0) {
      strengthContainer.classList.remove('hidden');
    } else {
      strengthContainer.classList.add('hidden');
    }
    validatePassword(pass);
  });

  // Form Submission
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');
    
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      formError.textContent = "Passwords do not match.";
      formError.classList.remove('hidden');
      return;
    }

    if (!validatePassword(password)) {
      formError.textContent = "Password does not meet the required strength.";
      formError.classList.remove('hidden');
      return;
    }

    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');

    const { error: updateError } = await supabaseClient.auth.updateUser({ password });

    submitBtn.disabled = false;
    submitSpinner.classList.add('hidden');

    if (updateError) {
      formError.textContent = updateError.message;
      formError.classList.remove('hidden');
    } else {
      formState.classList.add('hidden');
      successState.classList.remove('hidden');
    }
  });

});
