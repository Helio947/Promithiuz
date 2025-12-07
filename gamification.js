// Promithius AI - Gamification Features

// This file contains additional gamification functions to enhance user engagement

// Points System
function initPointsSystem() {
  // Check for initial sign-up bonus
  if (localStorage.getItem('userEmail') && !localStorage.getItem('signupBonusGiven')) {
    addPoints(20);
    localStorage.setItem('signupBonusGiven', 'true');
    showNotification('Signed Up! +20 Points—You\'re a Champion!');
  }
  
  // Display current points
  updatePointsDisplay();
}

function updatePointsDisplay() {
  const pointsDisplays = document.querySelectorAll('.points-display');
  const points = localStorage.getItem('userPoints') || 0;
  
  pointsDisplays.forEach(display => {
    display.textContent = points;
  });
}

// Achievements System
const achievements = [
  { id: 'first_prompt', name: 'First Prompt', description: 'Copy your first prompt', points: 10 },
  { id: 'five_prompts', name: 'Prompt Explorer', description: 'Copy 5 different prompts', points: 25 },
  { id: 'first_submission', name: 'Contributor', description: 'Submit your first prompt', points: 20 },
  { id: 'three_day_streak', name: 'Consistent', description: 'Maintain a 3-day streak', points: 15 },
  { id: 'seven_day_streak', name: 'Dedicated', description: 'Maintain a 7-day streak', points: 50 },
  { id: 'level_up', name: 'Rising Star', description: 'Reach Agent Pro level', points: 30 },
  { id: 'master_level', name: 'AI Master', description: 'Reach AI Master level', points: 100 }
];

function checkAchievements() {
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  const points = parseInt(localStorage.getItem('userPoints') || 0);
  const streak = parseInt(localStorage.getItem('streak') || 0);
  const promptsCopied = JSON.parse(localStorage.getItem('promptsCopied') || '[]');
  const hasSubmission = localStorage.getItem('hasSubmission') === 'true';
  
  // Check for first prompt achievement
  if (promptsCopied.length > 0 && !userAchievements.includes('first_prompt')) {
    unlockAchievement('first_prompt');
  }
  
  // Check for 5 prompts achievement
  if (promptsCopied.length >= 5 && !userAchievements.includes('five_prompts')) {
    unlockAchievement('five_prompts');
  }
  
  // Check for first submission achievement
  if (hasSubmission && !userAchievements.includes('first_submission')) {
    unlockAchievement('first_submission');
  }
  
  // Check for streak achievements
  if (streak >= 3 && !userAchievements.includes('three_day_streak')) {
    unlockAchievement('three_day_streak');
  }
  
  if (streak >= 7 && !userAchievements.includes('seven_day_streak')) {
    unlockAchievement('seven_day_streak');
  }
  
  // Check for level achievements
  if (points >= 101 && !userAchievements.includes('level_up')) {
    unlockAchievement('level_up');
  }
  
  if (points >= 501 && !userAchievements.includes('master_level')) {
    unlockAchievement('master_level');
  }
}

function unlockAchievement(achievementId) {
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) return;
  
  // Add to unlocked achievements
  const userAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
  userAchievements.push(achievementId);
  localStorage.setItem('achievements', JSON.stringify(userAchievements));
  
  // Award points
  addPoints(achievement.points);
  
  // Show notification
  showNotification(`Achievement Unlocked: ${achievement.name}! +${achievement.points} Points`);
  
  // Show confetti
  showConfetti();
}

// Notifications
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Daily Challenge System
function initDailyChallenge() {
  // Check if challenge needs to be reset
  const lastChallengeDate = localStorage.getItem('lastChallengeDate');
  const today = new Date().toDateString();
  
  if (lastChallengeDate !== today) {
    // Reset challenge
    localStorage.setItem('challengeProgress', 0);
    localStorage.setItem('lastChallengeDate', today);
    
    // Update challenge display
    updateChallengeDisplay();
  }
}

function updateChallengeDisplay() {
  const challengeTitle = document.querySelector('.challenge-title');
  if (!challengeTitle) return;
  
  // Get day of week to determine challenge
  const day = new Date().getDay();
  const challenges = [
    'Use Gmail\'s Sort & Win 10 Points!',
    'Try Slack\'s Poster & Earn 10 Points!',
    'Create a TikTok Caption & Get 10 Points!',
    'Organize with Notion & Claim 10 Points!',
    'Schedule with Calendar & Win 10 Points!',
    'Draft with ChatGPT & Earn 10 Points!',
    'Design with Canva & Get 10 Points!'
  ];
  
  challengeTitle.textContent = challenges[day];
}

// Enhanced Streak System
function enhancedStreakCheck() {
  // Get last visit date
  const lastVisit = localStorage.getItem('lastVisit');
  const today = new Date().toDateString();
  
  if (!lastVisit) {
    // First visit
    localStorage.setItem('lastVisit', today);
    localStorage.setItem('streak', 1);
    return;
  }
  
  if (lastVisit === today) {
    // Already visited today
    return;
  }
  
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
    
    // Show notification
    showNotification(`${streak}-Day Streak! Keep Your Fire Alive!`);
    
    // Check for milestone streaks
    if (streak === 3) {
      showNotification('3-Day Streak! You\'re on Fire!');
    } else if (streak === 7) {
      showNotification('Epic 7-Day Streak—You\'re a Legend!');
      addPoints(50);
      showConfetti();
    } else if (streak === 14) {
      showNotification('14-Day Streak! Unstoppable!');
      addPoints(100);
      showConfetti();
    } else if (streak === 30) {
      showNotification('30-Day Streak! AI Master Status!');
      addPoints(200);
      showConfetti();
    }
  } else if (diffDays > 1) {
    // Streak broken
    const oldStreak = localStorage.getItem('streak') || 0;
    localStorage.setItem('streak', 1);
    localStorage.setItem('lastVisit', today);
    
    if (oldStreak > 3) {
      showNotification(`Streak reset! You had a ${oldStreak}-day streak. Start again!`);
    }
  }
  
  // Update streak display
  updateStreakDisplay();
}

function updateStreakDisplay() {
  const streakDisplay = document.querySelector('.streak-value');
  if (!streakDisplay) return;
  
  const streak = localStorage.getItem('streak') || 1;
  streakDisplay.textContent = streak;
}

// Initialize all gamification features
document.addEventListener('DOMContentLoaded', function() {
  initPointsSystem();
  initDailyChallenge();
  enhancedStreakCheck();
  checkAchievements();
});
