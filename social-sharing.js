// Social Sharing Functions

// Initialize social sharing buttons
function initSocialSharing() {
  // Add event listeners to all share buttons
  const shareButtons = document.querySelectorAll('.share-button');
  
  shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const platform = this.getAttribute('data-platform');
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const description = encodeURIComponent(document.querySelector('meta[name="description"]').getAttribute('content'));
      
      let shareUrl = '';
      
      switch(platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });
}

// Add social sharing buttons to the page
function addSocialSharingButtons() {
  // Create social sharing container if it doesn't exist
  let sharingContainer = document.querySelector('.social-sharing');
  
  if (!sharingContainer) {
    sharingContainer = document.createElement('div');
    sharingContainer.className = 'social-sharing';
    
    // Create share text
    const shareText = document.createElement('span');
    shareText.className = 'share-text';
    shareText.textContent = 'Share this page:';
    
    // Create buttons
    const twitterButton = createShareButton('twitter', 'Share on Twitter');
    const facebookButton = createShareButton('facebook', 'Share on Facebook');
    const linkedinButton = createShareButton('linkedin', 'Share on LinkedIn');
    const emailButton = createShareButton('email', 'Share via Email');
    
    // Assemble container
    sharingContainer.appendChild(shareText);
    sharingContainer.appendChild(twitterButton);
    sharingContainer.appendChild(facebookButton);
    sharingContainer.appendChild(linkedinButton);
    sharingContainer.appendChild(emailButton);
    
    // Add to page
    const heroSection = document.querySelector('.hero .container');
    if (heroSection) {
      heroSection.appendChild(sharingContainer);
    }
  }
}

// Create a share button element
function createShareButton(platform, title) {
  const button = document.createElement('a');
  button.href = '#';
  button.className = `share-button ${platform}-share`;
  button.setAttribute('data-platform', platform);
  button.setAttribute('title', title);
  button.innerHTML = `<span class="share-icon">${getShareIcon(platform)}</span>`;
  
  return button;
}

// Get icon for share button
function getShareIcon(platform) {
  switch(platform) {
    case 'twitter':
      return '🐦';
    case 'facebook':
      return 'ⓕ';
    case 'linkedin':
      return 'ⓘⓝ';
    case 'email':
      return '✉️';
    default:
      return '↗️';
  }
}

// Initialize social sharing when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addSocialSharingButtons();
  initSocialSharing();
});
