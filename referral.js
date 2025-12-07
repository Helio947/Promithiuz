// Promithius AI - Referral Program

// Initialize referral program
function initReferralProgram() {
  // Generate referral link
  generateReferralLink();
  
  // Initialize copy button
  initCopyReferralButton();
  
  // Initialize share progress button
  initShareProgressButton();
}

// Generate referral link based on user email
function generateReferralLink() {
  const userEmail = localStorage.getItem('userEmail');
  const referralLinkInput = document.getElementById('referral-link');
  
  if (userEmail && referralLinkInput) {
    // Create a simple referral code from email (in a real app, this would be more secure)
    const referralCode = btoa(userEmail).substring(0, 10);
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/?ref=${referralCode}`;
    
    // Set the referral link in the input field
    referralLinkInput.value = referralLink;
  }
}

// Initialize copy referral button
function initCopyReferralButton() {
  const copyButton = document.getElementById('copy-referral');
  const referralLinkInput = document.getElementById('referral-link');
  
  if (copyButton && referralLinkInput) {
    copyButton.addEventListener('click', function() {
      // Select the text
      referralLinkInput.select();
      referralLinkInput.setSelectionRange(0, 99999); // For mobile devices
      
      // Copy to clipboard
      navigator.clipboard.writeText(referralLinkInput.value).then(() => {
        // Visual feedback
        copyButton.textContent = 'Copied!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          copyButton.textContent = 'Copy Link';
        }, 2000);
      });
    });
  }
}

// Initialize share progress button
function initShareProgressButton() {
  const shareButton = document.getElementById('share-progress-btn');
  
  if (shareButton) {
    shareButton.addEventListener('click', function() {
      // Get user points
      const userPoints = localStorage.getItem('userPoints') || 0;
      
      // Create share text
      const shareText = `I've earned ${userPoints} Agent Points on Promithius AI! Join me to automate your day: ${window.location.origin}`;
      
      // Create Twitter share URL
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      
      // Open Twitter share dialog
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    });
  }
}

// Check for referral code in URL when page loads
function checkReferralCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('ref');
  
  if (referralCode) {
    // Store referral code in localStorage
    localStorage.setItem('referralCode', referralCode);
    
    // Show referral banner
    showReferralBanner();
  }
}

// Show referral banner
function showReferralBanner() {
  // Create banner if it doesn't exist
  let referralBanner = document.querySelector('.referral-banner');
  
  if (!referralBanner) {
    referralBanner = document.createElement('div');
    referralBanner.className = 'referral-banner';
    referralBanner.innerHTML = `
      <p>You've been referred by a friend! Sign up to get 50 bonus points!</p>
      <button class="close-banner">×</button>
    `;
    
    // Add close button functionality
    const closeButton = referralBanner.querySelector('.close-banner');
    closeButton.addEventListener('click', () => {
      referralBanner.style.display = 'none';
    });
    
    // Add to page
    document.body.insertBefore(referralBanner, document.body.firstChild);
  }
}

// Initialize referral program when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if on account page
  if (window.location.pathname.includes('account.html')) {
    initReferralProgram();
  }
  
  // Check for referral code on any page
  checkReferralCode();
});
