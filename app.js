// Initialize language manager
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.languageSelector = document.getElementById('languageSelector');
        this.initializeLanguage();
    }

    initializeLanguage() {
        if (this.languageSelector) {
            this.languageSelector.value = this.currentLang;
            this.languageSelector.addEventListener('change', (e) => this.setLanguage(e.target.value));
        }
        this.updateContent();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        this.updateContent();
        this.animateTransition();
    }

    animateTransition() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'fadeInText 0.5s ease-in-out';
        });
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const section = element.getAttribute('data-section');
            const translation = section ? 
                translations[this.currentLang]?.[section]?.[key] :
                translations[this.currentLang]?.[key];

            if (translation) {
                element.textContent = translation;
                element.classList.add('translation-updated');
            }
        });
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});


// Initialize language preference
let currentLanguage = localStorage.getItem('language') || 'en';

// Language selector functionality
document.getElementById('languageSelector').addEventListener('change', function(e) {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
});

// Update UI language
function updateLanguage() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
}

// Parental Controls
class ParentalControls {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('parentalControls')) || {
            spendingLimit: 500,
            dailyLimit: true,
            categoryRestrictions: false,
            notifications: true
        };
        this.initializeControls();
    }

    initializeControls() {
        const parentalBtn = document.getElementById('parentalControl');
        if (parentalBtn) {
            parentalBtn.addEventListener('click', () => this.showParentalControlModal());
        }

        // Highlight parental control button if restrictions are active
        this.updateParentalControlIndicator();
    }

    showParentalControlModal() {
        // Implementation for parental control modal
        console.log('Show parental control modal');
    }

    updateParentalControlIndicator() {
        const btn = document.getElementById('parentalControl');
        if (this.settings.dailyLimit || this.settings.categoryRestrictions) {
            btn.classList.add('active-restrictions');
        }
    }

    checkTransaction(amount, category) {
        if (this.settings.dailyLimit && amount > this.settings.spendingLimit) {
            return {
                allowed: false,
                message: `Transaction exceeds daily limit of ₹${this.settings.spendingLimit}`
            };
        }
        return { allowed: true };
    }
}

// User Guide Tour
class UserGuideTour {
    constructor() {
        this.steps = [
            {
                element: '#dashboard',
                title: 'Welcome to GenZ Finance',
                content: 'This is your financial dashboard. Monitor your savings, budget, and rewards here.'
            },
            {
                element: '#quickActions',
                title: 'Quick Actions',
                content: 'Access common tasks like creating a budget or checking rewards quickly.'
            },
            // Add more tour steps
        ];
        this.initializeTour();
    }

    initializeTour() {
        const isFirstVisit = !localStorage.getItem('tourCompleted');
        if (isFirstVisit) {
            this.startTour();
        }

        // Add help button functionality
        const helpBtn = document.querySelector('.help-button');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.startTour());
        }
    }

    startTour() {
        let currentStep = 0;
        this.showStep(currentStep);
    }

    showStep(stepIndex) {
        const step = this.steps[stepIndex];
        const element = document.querySelector(step.element);
        if (element) {
            // Implementation for showing tour step
            console.log(`Showing tour step: ${step.title}`);
        }
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    new ParentalControls();
    new UserGuideTour();

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Show help tooltip
    const helpTooltip = new bootstrap.Toast(document.getElementById('helpTooltip'));
    setTimeout(() => helpTooltip.show(), 2000);
});