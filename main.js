// Promithius AI - Main JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initCopyButtons();
  initCarousel();
  initFilterTabs();
  initChallengeBar();
  initRefreshPoints();
  loadUserData();
  loadPromptData();
});

// Navigation
function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Copy Buttons
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const promptText = this.getAttribute('data-prompt');
      
      // Copy to clipboard
      navigator.clipboard.writeText(promptText).then(() => {
        // Visual feedback
        this.classList.add('copied');
        this.textContent = 'Copied! You\'re Winning!';
        
        // Add points
        addPoints(5);
        
        // Update challenge progress
        updateChallengeProgress();
        
        // Reset button after 2 seconds
        setTimeout(() => {
          this.classList.remove('copied');
          this.textContent = 'Copy Prompt';
        }, 2000);
      });
    });
  });

  // View Prompt Buttons
  const viewButtons = document.querySelectorAll('.view-prompt-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const promptTitle = this.getAttribute('data-title');
      const promptText = this.getAttribute('data-prompt');
      const promptApp = this.getAttribute('data-app');
      
      // Create and show modal
      showPromptModal(promptApp, promptTitle, promptText);
    });
  });
}

// Prompt Modal
function showPromptModal(app, title, promptText) {
  // Create modal elements if they don't exist
  let modalOverlay = document.querySelector('.modal-overlay');
  
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const modalClose = document.createElement('div');
    modalClose.className = 'modal-close';
    modalClose.textContent = '×';
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn';
    copyBtn.textContent = 'Copy Full Prompt';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(promptText).then(() => {
        copyBtn.textContent = 'Copied! You\'re Winning!';
        addPoints(5);
        setTimeout(() => {
          copyBtn.textContent = 'Copy Full Prompt';
        }, 2000);
      });
    });
    
    modalFooter.appendChild(copyBtn);
    modal.appendChild(modalClose);
    modal.appendChild(modalHeader);
    modal.appendChild(modalContent);
    modal.appendChild(modalFooter);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
  }
  
  // Update modal content
  const modalHeader = modalOverlay.querySelector('.modal-header');
  const modalContent = modalOverlay.querySelector('.modal-content');
  
  modalHeader.innerHTML = `
    <h3>${app}: ${title}</h3>
    <p>Detailed step-by-step system to save you time and boost productivity</p>
  `;
  
  // Format the prompt text with sections
  const formattedContent = formatPromptContent(promptText);
  modalContent.innerHTML = formattedContent;
  
  // Show modal
  modalOverlay.classList.add('active');
  
  // Close modal when clicking outside
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });
}

// Format prompt content with sections
function formatPromptContent(promptText) {
  // For this demo, we'll create a structured format
  // In a real implementation, this would parse the actual prompt structure
  return `
    <h4>Objective</h4>
    <p>${promptText}</p>
    
    <h4>Tools</h4>
    <p>AI agent with access to the application interface</p>
    
    <h4>Credentials</h4>
    <p>User's account access (securely provided)</p>
    
    <h4>Preconditions</h4>
    <p>- User has an active account<br>
    - Application is accessible<br>
    - Required permissions are granted</p>
    
    <h4>Step-by-Step Instructions</h4>
    <p>1. Access the application<br>
    2. Navigate to the relevant section<br>
    3. Apply the specific workflow<br>
    4. Verify the results<br>
    5. Save or export as needed</p>
    
    <h4>Error Handling</h4>
    <p>- If access is denied, verify credentials<br>
    - If operation fails, retry with modified parameters<br>
    - If system is unresponsive, wait and retry</p>
    
    <h4>Output Format</h4>
    <p>Confirmation message with summary of actions taken</p>
    
    <h4>Time Estimate</h4>
    <p>2-5 minutes</p>
  `;
}

// Benefits Carousel
function initCarousel() {
  const carousel = document.querySelector('.carousel-inner');
  if (!carousel) return;
  
  // Clone items for infinite scroll effect
  const items = carousel.querySelectorAll('.carousel-item');
  items.forEach(item => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
  });
}

// Filter Tabs
function initFilterTabs() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const appCards = document.querySelectorAll('.app-card');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      // Show/hide app cards based on filter
      appCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Challenge Progress Bar
function initChallengeBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  
  // Set initial progress
  const progress = localStorage.getItem('challengeProgress') || 0;
  progressBar.style.width = `${progress}%`;
}

function updateChallengeProgress() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  
  // Get current progress
  let progress = parseInt(localStorage.getItem('challengeProgress') || 0);
  
  // Increment progress
  progress += 20;
  if (progress > 100) progress = 100;
  
  // Update progress bar
  progressBar.style.width = `${progress}%`;
  
  // Save progress
  localStorage.setItem('challengeProgress', progress);
  
  // If challenge completed
  if (progress === 100) {
    addPoints(10);
    showConfetti();
    
    // Reset challenge after 2 seconds
    setTimeout(() => {
      progressBar.style.width = '0%';
      localStorage.setItem('challengeProgress', 0);
    }, 2000);
  }
}

// Refresh Points Button
function initRefreshPoints() {
  const refreshBtn = document.querySelector('.refresh-btn');
  if (!refreshBtn) return;
  
  refreshBtn.addEventListener('click', function() {
    this.classList.add('spinning');
    
    // Add points after animation
    setTimeout(() => {
      addPoints(5);
      this.classList.remove('spinning');
    }, 500);
  });
}

// Points System
function addPoints(points) {
  let currentPoints = parseInt(localStorage.getItem('userPoints') || 0);
  const previousLevel = getUserLevel(currentPoints);
  
  // Add points
  currentPoints += points;
  localStorage.setItem('userPoints', currentPoints);
  
  // Update points display
  const pointsDisplay = document.querySelector('.points-value');
  if (pointsDisplay) {
    pointsDisplay.textContent = currentPoints;
  }
  
  // Check for level up
  const newLevel = getUserLevel(currentPoints);
  if (newLevel > previousLevel) {
    levelUp(newLevel);
  }
  
  // Update streak
  updateStreak();
}

function getUserLevel(points) {
  if (points >= 501) return 3; // AI Master
  if (points >= 101) return 2; // Agent Pro
  return 1; // Agent Rookie
}

function getLevelName(level) {
  switch(level) {
    case 3: return 'AI Master';
    case 2: return 'Agent Pro';
    case 1: default: return 'Agent Rookie';
  }
}

function getLevelBadge(level) {
  switch(level) {
    case 3: return '👑';
    case 2: return '★★';
    case 1: default: return '★';
  }
}

function levelUp(newLevel) {
  const levelName = getLevelName(newLevel);
  
  // Show level up message
  alert(`Level Up! You're an ${levelName}—Confetti!`);
  
  // Update level display
  const levelDisplay = document.querySelector('.level-value');
  if (levelDisplay) {
    levelDisplay.textContent = levelName;
  }
  
  // Update badge display
  const badgeDisplay = document.querySelector('.level-badge');
  if (badgeDisplay) {
    badgeDisplay.textContent = getLevelBadge(newLevel);
  }
  
  // Show confetti
  showConfetti();
}

// Streak System
function updateStreak() {
  // Get last visit date
  const lastVisit = localStorage.getItem('lastVisit');
  const today = new Date().toDateString();
  
  // If first visit or visited today already, just update last visit
  if (!lastVisit) {
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('streak', 1);
  } else if (lastVisit !== today) {
    // Check if consecutive day
    const lastDate = new Date(lastVisit);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day, increment streak
      let streak = parseInt(localStorage.getItem('streak') || 0);
      streak++;
      localStorage.setItem('streak', streak);
      localStorage.setItem('lastVisit', today);
      
      // Check for 7-day streak
      if (streak % 7 === 0) {
        addPoints(50);
        alert('Epic 7-Day Streak—You\'re a Legend!');
        showConfetti();
      }
    } else if (diffDays > 1) {
      // Streak broken
      localStorage.setItem('streak', 1);
      localStorage.setItem('lastVisit', today);
    }
  }
  
  // Update streak display
  const streakDisplay = document.querySelector('.streak-value');
  if (streakDisplay) {
    const streak = localStorage.getItem('streak') || 1;
    streakDisplay.textContent = streak;
  }
}

// Confetti Effect
function showConfetti() {
  for (let i = 0; i < 10; i++) {
    createConfetti();
  }
}

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  
  // Random position
  const startX = Math.random() * window.innerWidth;
  confetti.style.left = `${startX}px`;
  confetti.style.top = '0';
  
  // Random color
  const colors = ['#14B8A6', '#5EEAD4', '#0F766E', '#10B981', '#F59E0B'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.backgroundColor = randomColor;
  
  // Random rotation
  const rotation = Math.random() * 360;
  confetti.style.transform = `rotate(${rotation}deg)`;
  
  // Add to body
  document.body.appendChild(confetti);
  
  // Remove after animation
  setTimeout(() => {
    confetti.remove();
  }, 1000);
}

// User Data
function loadUserData() {
  // Check if user is logged in
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return;
  
  // Update user info displays
  const emailDisplay = document.querySelector('.user-email');
  if (emailDisplay) {
    emailDisplay.textContent = userEmail;
  }
  
  const nameDisplay = document.querySelector('.user-name');
  if (nameDisplay) {
    const userName = localStorage.getItem('userName') || 'AI Agent';
    nameDisplay.textContent = userName;
  }
  
  // Update points and level
  const points = parseInt(localStorage.getItem('userPoints') || 0);
  const level = getUserLevel(points);
  
  const pointsDisplay = document.querySelector('.points-value');
  if (pointsDisplay) {
    pointsDisplay.textContent = points;
  }
  
  const levelDisplay = document.querySelector('.level-value');
  if (levelDisplay) {
    levelDisplay.textContent = getLevelName(level);
  }
  
  const badgeDisplay = document.querySelector('.level-badge');
  if (badgeDisplay) {
    badgeDisplay.textContent = getLevelBadge(level);
  }
  
  // Update streak
  const streakDisplay = document.querySelector('.streak-value');
  if (streakDisplay) {
    const streak = localStorage.getItem('streak') || 1;
    streakDisplay.textContent = streak;
  }
}

// Sign Up Form
function handleSignUp(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  
  if (!nameInput || !emailInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  if (!name || !email) {
    alert('Please fill in all fields');
    return;
  }
  
  // Save user data
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPoints', 20);
  localStorage.setItem('streak', 1);
  localStorage.setItem('lastVisit', new Date().toDateString());
  localStorage.setItem('verified', false); // Set verification status to false by default
  
  // Show verification message
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.innerHTML = `
      <div class="verification-message">
        <h4>Almost there!</h4>
        <p>A verification link will be sent to <strong>${email}</strong>. Click the link to activate your account.</p>
        <p class="note">(Note: Email sending coming soon—account active for now.)</p>
        <a href="account.html" class="btn">Continue to Your Account</a>
      </div>
    `;
    
    // Trigger onboarding process
    const userSignedUpEvent = new Event('userSignedUp');
    document.dispatchEvent(userSignedUpEvent);
    
  } else {
    // Fallback if form element not found
    alert('A verification link will be sent to ' + email + '. Click the link to activate your account. (Note: Email sending coming soon—account active for now.)');
    
    // Trigger onboarding process
    const userSignedUpEvent = new Event('userSignedUp');
    document.dispatchEvent(userSignedUpEvent);
    
    window.location.href = 'account.html';
  }
}

// Submit Form
function handleSubmit(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('submit-name');
  const emailInput = document.getElementById('submit-email');
  const promptInput = document.getElementById('submit-prompt');
  
  if (!nameInput || !emailInput || !promptInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const prompt = promptInput.value.trim();
  
  if (!name || !email || !prompt) {
    alert('Please fill in all fields');
    return;
  }
  
  // Add submission to local storage
  const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
  submissions.push({
    name,
    email,
    prompt,
    date: new Date().toISOString(),
    upvotes: 0
  });
  localStorage.setItem('submissions', JSON.stringify(submissions));
  
  // Add points
  addPoints(50);
  
  // Show success message
  alert('Prompt Submitted! +50 Points—Share Your Genius!');
  
  // Re
(Content truncated due to size limit. Use line ranges to read in chunks)