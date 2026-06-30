document.addEventListener('DOMContentLoaded', () => {
  // Initialize icons
  lucide.createIcons();

  const loadingContainer = document.getElementById('loading-container');
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const returnBtn = document.getElementById('return-btn');

  // The expected deep link scheme for the Versivv app
  const APP_DEEP_LINK_SCHEME = 'versivv://auth/callback';

  function showError(msg) {
    loadingContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorContainer.classList.add('flex');
    errorMessage.textContent = msg;
  }

  function handleRedirect() {
    try {
      const url = new URL(window.location.href);
      
      // We want to pass along all search parameters or hash parameters to the app.
      // Supabase OAuth may return them in the hash (implicit) or search (PKCE).
      const hashParams = url.hash; // e.g. #error=...
      const searchParams = url.search; // e.g. ?code=...
      
      const hasCode = url.searchParams.has('code');
      const hasError = url.searchParams.has('error') || new URLSearchParams(url.hash.replace('#', '?')).has('error');

      if (!hasCode && !hasError) {
        showError('No authentication code or error was found in the URL.');
        return;
      }

      // Construct the deep link by appending the exact search/hash to the scheme
      // E.g. versivv://login-callback?code=xxx
      const deepLinkUrl = `${APP_DEEP_LINK_SCHEME}${searchParams}${hashParams}`;

      // Immediately redirect to the deep link
      window.location.href = deepLinkUrl;

      // Add a fallback click event for the return button, just in case the automatic redirect doesn't work,
      // or if it was an error and the user needs to manually return.
      returnBtn.addEventListener('click', () => {
        window.location.href = APP_DEEP_LINK_SCHEME;
      });

      // If it's an error, we might want to display it instead of blindly redirecting,
      // but usually the app handles the error state better.
      // However, if the redirect fails, the user will be stuck. 
      // We will show a slight delay and then show the button if they are still on the page.
      setTimeout(() => {
        if (!document.hidden) {
          // If the page is still visible, the deep link might have failed or prompted a dialog.
          // We can show the return button just in case.
          loadingContainer.classList.add('hidden');
          errorContainer.classList.remove('hidden');
          errorContainer.classList.add('flex');
          
          if (hasError) {
             const errorDesc = url.searchParams.get('error_description') 
                               || new URLSearchParams(url.hash.replace('#', '?')).get('error_description') 
                               || 'Authentication failed.';
             errorMessage.textContent = errorDesc.replace(/\+/g, ' ');
          } else {
             errorMessage.textContent = 'Redirecting to the app... If nothing happens, make sure the Versivv app is installed.';
             returnBtn.textContent = 'Open App Manually';
             returnBtn.onclick = () => { window.location.href = deepLinkUrl; };
          }
        }
      }, 2000);

    } catch (e) {
      console.error('Error handling redirect:', e);
      showError('An unexpected error occurred while processing the login.');
    }
  }

  // Execute the redirect logic
  handleRedirect();
});
