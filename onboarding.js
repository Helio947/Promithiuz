// Promithius AI - Onboarding Experience

// Initialize onboarding when a new user signs up
function initOnboarding() {
  // Check if user is new (just signed up)
  const isNewUser = localStorage.getItem('onboardingComplete') !== 'true';
  
  if (isNewUser) {
    showOnboardingModal(1);
  }
}

// Show onboarding modal with specified step
function showOnboardingModal(step) {
  // Create modal elements if they don't exist
  let onboardingOverlay = document.querySelector('.onboarding-overlay');
  
  if (!onboardingOverlay) {
    onboardingOverlay = document.createElement('div');
    onboardingOverlay.className = 'modal-overlay onboarding-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal onboarding-modal';
    
    const modalClose = document.createElement('div');
    modalClose.className = 'modal-close';
    modalClose.textContent = '×';
    modalClose.addEventListener('click', () => {
      completeOnboarding();
    });
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content onboarding-content';
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer onboarding-footer';
    
    const skipLink = document.createElement('a');
    skipLink.href = '#';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip';
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      completeOnboarding();
    });
    
    const nextButton = document.createElement('button');
    nextButton.className = 'btn next-btn';
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      const currentStep = parseInt(modal.getAttribute('data-step'));
      if (currentStep < 3) {
        showOnboardingStep(currentStep + 1);
      } else {
        completeOnboarding();
      }
    });
    
    modalFooter.appendChild(skipLink);
    modalFooter.appendChild(nextButton);
    
    modal.appendChild(modalClose);
    modal.appendChild(modalContent);
    modal.appendChild(modalFooter);
    onboardingOverlay.appendChild(modal);
    document.body.appendChild(onboardingOverlay);
  }
  
  // Show the modal with the specified step
  showOnboardingStep(step);
  onboardingOverlay.classList.add('active');
}

// Show specific onboarding step
function showOnboardingStep(step) {
  const modal = document.querySelector('.onboarding-modal');
  const content = modal.querySelector('.onboarding-content');
  const nextBtn = modal.querySelector('.next-btn');
  
  // Set current step
  modal.setAttribute('data-step', step);
  
  // Update content based on step
  switch (step) {
    case 1:
      content.innerHTML = `
        <h3>Welcome to Promithius AI—Let's Automate Your Day!</h3>
        <p>Discover 125 prompts to save hours every week. Let's get started!</p>
        <img src="img/hero-bg.jpg" alt="Promithius AI" class="onboarding-image">
      `;
      nextBtn.textContent = 'Next';
      break;
    case 2:
      content.innerHTML = `
        <h3>Pick Your Top 3 Apps to Start</h3>
        <p>Select the apps you use most frequently:</p>
        <div class="app-selection">
          <div class="app-checkbox">
            <input type="checkbox" id="app-gmail" name="preferred_apps" value="Gmail">
            <label for="app-gmail">Gmail</label>
          </div>
          <div class="app-checkbox">
            <input type="checkbox" id="app-slack" name="preferred_apps" value="Slack">
            <label for="app-slack">Slack</label>
          </div>
          <div class="app-checkbox">
            <input type="checkbox" id="app-tiktok" name="preferred_apps" value="TikTok">
            <label for="app-tiktok">TikTok</label>
          </div>
          <div class="app-checkbox">
            <input type="checkbox" id="app-calendar" name="preferred_apps" value="Google Calendar">
            <label for="app-calendar">Google Calendar</label>
          </div>
          <div class="app-checkbox">
            <input type="checkbox" id="app-notion" name="preferred_apps" value="Notion">
            <label for="app-notion">Notion</label>
          </div>
        </div>
      `;
      nextBtn.textContent = 'Next';
      break;
    case 3:
      content.innerHTML = `
        <h3>Copy Your First Prompt & Earn 10 Points!</h3>
        <p>Start with your favorite app and see the magic!</p>
        <a href="library.html" class="btn">Go to Library</a>
        <p class="note">Tip: Use the prompts daily to build your streak and earn bonus points!</p>
      `;
      nextBtn.textContent = 'Finish';
      break;
  }
}

// Complete onboarding process
function completeOnboarding() {
  // Save preferred apps
  const selectedApps = [];
  const appCheckboxes = document.querySelectorAll('input[name="preferred_apps"]:checked');
  
  appCheckboxes.forEach(checkbox => {
    selectedApps.push(checkbox.value);
  });
  
  // Save to localStorage
  localStorage.setItem('preferredApps', JSON.stringify(selectedApps));
  localStorage.setItem('onboardingComplete', 'true');
  
  // Award points
  addPoints(10);
  
  // Close modal
  const onboardingOverlay = document.querySelector('.onboarding-overlay');
  if (onboardingOverlay) {
    onboardingOverlay.classList.remove('active');
  }
  
  // Show completion message
  alert('Onboarding Complete! +10 Points—You\'re Ready to Win!');
}

// Add event listener to initialize onboarding after sign-up
document.addEventListener('userSignedUp', initOnboarding);
