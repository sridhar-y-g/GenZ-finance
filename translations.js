const translations = {
    en: {
        nav: {
            dashboard: 'Dashboard',
            budget: 'Budget',
            savings: 'Savings',
            rewards: 'Rewards',
            analytics: 'Analytics',
            parentalControl: 'Parental Controls'
        },
        stats: {
            badges: 'Badges Unlocked',
            goals: 'Goals Completed',
            points: 'Total Points',
            totalSavings: 'Total Savings',
            monthlyBudget: 'Monthly Budget',
            rewardPoints: 'Reward Points'
        },
        badges: {
            savings_master: {
                name: 'Savings Master',
                condition: 'Saved ₹10,000 in a month'
            },
            budget_pro: {
                name: 'Budget Pro',
                condition: 'Stayed within budget for 3 months'
            },
            investment_guru: {
                name: 'Investment Guru',
                condition: 'Start your first FD'
            }
        },
        challenges: {
            daily_save: {
                name: 'Save ₹100 Today',
                reward: 'Reward: {points} points'
            },
            weekly_budget: {
                name: 'Stay Within Budget This Week',
                reward: 'Reward: {points} points'
            },
            monthly_goal: {
                name: 'Reach Monthly Savings Goal',
                reward: 'Reward: {points} points'
            }
        },
        quickActions: {
            createBudget: 'Create Budget',
            startSaving: 'Start Saving',
            viewRewards: 'View Rewards',
            viewAnalytics: 'Analytics'
        }
    },
    hi: {
        stats: {
            badges: 'बैज अनलॉक किए',
            goals: 'लक्ष्य पूरे किए',
            points: 'कुल अंक'
        },
        badges: {
            savings_master: {
                name: 'बचत मास्टर',
                condition: 'एक महीने में ₹10,000 की बचत की'
            },
            budget_pro: {
                name: 'बजट प्रो',
                condition: '3 महीने तक बजट के भीतर रहे'
            },
            investment_guru: {
                name: 'निवेश गुरु',
                condition: 'अपना पहला FD शुरू करें'
            }
        },
        challenges: {
            daily_save: {
                name: 'आज ₹100 बचाएं',
                reward: 'इनाम: {points} अंक'
            },
            weekly_budget: {
                name: 'इस सप्ताह बजट के भीतर रहें',
                reward: 'इनाम: {points} अंक'
            },
            monthly_goal: {
                name: 'मासिक बचत लक्ष्य प्राप्त करें',
                reward: 'इनाम: {points} अंक'
            }
        }
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.initializeLanguage();
    }

    initializeLanguage() {
        const languageSelector = document.createElement('select');
        languageSelector.className = 'form-select language-selector';
        languageSelector.innerHTML = `
            <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
            <option value="hi" ${this.currentLang === 'hi' ? 'selected' : ''}>हिंदी</option>
        `;

        languageSelector.addEventListener('change', (e) => this.setLanguage(e.target.value));
        document.querySelector('.navbar-nav')?.appendChild(languageSelector);
        this.updateContent();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateContent();
    }

    updateContent() {
        const currentTranslations = translations[this.currentLang];

        // Update stats
        document.querySelectorAll('.stat-info p').forEach(element => {
            const key = element.textContent.toLowerCase().replace(' ', '_');
            if (currentTranslations.stats[key]) {
                element.textContent = currentTranslations.stats[key];
            }
        });

        // Update badges
        document.querySelectorAll('.badge-item').forEach(badge => {
            const badgeId = badge.querySelector('h6')?.textContent.toLowerCase().replace(' ', '_');
            if (badgeId && currentTranslations.badges[badgeId]) {
                badge.querySelector('h6').textContent = currentTranslations.badges[badgeId].name;
                badge.querySelector('p').textContent = currentTranslations.badges[badgeId].condition;
            }
        });

        // Update challenges
        document.querySelectorAll('.challenge-item').forEach(challenge => {
            const challengeId = challenge.querySelector('h6')?.textContent
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_');
            if (challengeId && currentTranslations.challenges[challengeId]) {
                challenge.querySelector('h6').textContent = currentTranslations.challenges[challengeId].name;
                const points = challenge.querySelector('p').textContent.match(/\d+/);
                challenge.querySelector('p').textContent = currentTranslations.challenges[challengeId].reward
                    .replace('{points}', points);
            }
        });
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});