document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const signinForm = document.getElementById('signin-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');

  // Toggle Password Visibility
  let showPassword = false;
  togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    eyeIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
    lucide.createIcons();
  });

  // Form Submission
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    
    const email = emailInput.value;
    const password = passwordInput.value;

    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    submitBtn.disabled = false;
    submitSpinner.classList.add('hidden');

    if (error) {
      formError.textContent = error.message;
      formError.classList.remove('hidden');
    } else {
      formSuccess.textContent = "Successfully signed in!";
      formSuccess.classList.remove('hidden');
      console.log('Session established:', data.session);
    }
  });
});
