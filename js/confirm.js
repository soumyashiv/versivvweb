document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  const loadingState = document.getElementById('loading-state');
  const successState = document.getElementById('success-state');
  const errorState = document.getElementById('error-state');

  // Supabase CDN handles token exchange automatically on page load.
  // We check the URL for error parameters.
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error') || urlParams.get('error_description');
  
  // Also check hash for errors (implicit grant flow)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const hashError = hashParams.get('error') || hashParams.get('error_description');

  setTimeout(() => {
    loadingState.classList.add('hidden');
    
    if (error || hashError) {
      errorState.classList.remove('hidden');
    } else {
      successState.classList.remove('hidden');
    }
  }, 500); // Small delay to simulate loading or wait for supabase init
});
