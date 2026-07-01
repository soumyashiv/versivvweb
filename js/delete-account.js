document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const deleteForm = document.getElementById('delete-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const formError = document.getElementById('form-error');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const googleBtn = document.getElementById('oauth-google-btn');

  // Toggle Password Visibility
  let showPassword = false;
  togglePasswordBtn.addEventListener('click', () => {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    eyeIcon.setAttribute('data-lucide', showPassword ? 'eye-off' : 'eye');
    lucide.createIcons();
  });

  const performDeletion = async () => {
    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');
    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');

    // Assumes you have created a "delete_user()" RPC in Supabase.
    // E.g. CREATE OR REPLACE FUNCTION delete_user() RETURNS void LANGUAGE sql SECURITY DEFINER AS $$ delete from auth.users where id = auth.uid(); $$;
    const { error } = await supabaseClient.rpc('delete_user');

    submitBtn.disabled = false;
    submitSpinner.classList.add('hidden');

    if (error) {
      formError.textContent = "Failed to delete account. You might need to set up the 'delete_user' RPC function in Supabase. Error: " + error.message;
      formError.classList.remove('hidden');
    } else {
      await supabaseClient.auth.signOut();
      formSuccess.textContent = "Account successfully deleted. All your data has been removed.";
      formSuccess.classList.remove('hidden');
      deleteForm.reset();
      
      // Optionally redirect after a few seconds
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 3000);
    }
  };

  // Handle Google OAuth
  googleBtn.addEventListener('click', async () => {
    sessionStorage.setItem('pending_deletion', 'true');
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/delete-account.html'
      }
    });

    if (error) {
      formError.textContent = error.message;
      formError.classList.remove('hidden');
    }
  });

  // Check if returning from OAuth flow with intention to delete
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    const pendingDeletion = sessionStorage.getItem('pending_deletion');
    if (session && pendingDeletion) {
      sessionStorage.removeItem('pending_deletion');
      await performDeletion();
    }
  });

  // Form Submission (Email/Password)
  deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    
    const email = emailInput.value;
    const password = passwordInput.value;

    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');

    // Authenticate user first
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      submitBtn.disabled = false;
      submitSpinner.classList.add('hidden');
      formError.textContent = error.message;
      formError.classList.remove('hidden');
      return;
    }

    // Proceed to delete
    await performDeletion();
  });
});
