// Dark Mode Toggle Functionality
class DarkModeToggle {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.icon = this.themeToggle.querySelector('i');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    // Set initial theme
    this.setTheme(this.currentTheme);
    
    // Add event listener
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add keyboard support
    this.themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (theme === 'dark') {
      this.icon.className = 'fas fa-sun';
      this.themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      this.icon.className = 'fas fa-moon';
      this.themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.currentTheme = newTheme;
    this.setTheme(newTheme);
    
    // Add animation effect
    this.themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
    setTimeout(() => {
      this.themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  }
}

// Initialize dark mode toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DarkModeToggle();
}); 