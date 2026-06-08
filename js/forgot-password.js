document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const forgotForm = document.getElementById('forgot-form');
  const emailInput = document.getElementById('email');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');

  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    
    const email = emailInput.value;

    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password.html`,
    });

    submitBtn.disabled = false;
    submitSpinner.classList.add('hidden');

    if (error) {
      formError.textContent = error.message;
      formError.classList.remove('hidden');
    } else {
      formSuccess.classList.remove('hidden');
    }
  });
});
