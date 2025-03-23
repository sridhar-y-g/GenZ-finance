// Rewards functionality
class RewardsManager {
    constructor() {
        this.rewards = JSON.parse(localStorage.getItem('rewards')) || {
            points: 250,
            badges: [],
            achievements: [],
            redeemedRewards: []
        };
        this.languageManager = new LanguageManager();
        this.initializeRewards();
    }

    initializeRewards() {
        this.updateRewardsStats();
        this.setupBadges();
        this.setupLeaderboard();
        this.setupChallenges();
    }

    updateRewardsStats() {
        document.querySelectorAll('.achievement-stat').forEach(stat => {
            const icon = stat.querySelector('.stat-icon i');
            if (icon) {
                icon.style.animation = 'float 3s ease-in-out infinite';
            }
        });
    }

    setupBadges() {
        const badges = [
            { id: 'savings_master', name: 'Savings Master', condition: 'Saved ₹10,000 in a month' },
            { id: 'budget_pro', name: 'Budget Pro', condition: 'Stayed within budget for 3 months' },
            { id: 'investment_guru', name: 'Investment Guru', condition: 'Start your first FD' }
        ];

        const badgesGrid = document.querySelector('.badges-grid');
        if (!badgesGrid) return;

        badges.forEach(badge => {
            const isUnlocked = this.rewards.badges.includes(badge.id);
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
            badgeElement.innerHTML = `
                <div class="badge-icon ${!isUnlocked ? 'locked' : ''}">
                    <img src="images/badges.svg#${badge.id}" alt="${badge.name} Badge" width="64" height="64">
                </div>
                <h6>${badge.name}</h6>
                <p>${badge.condition}</p>
            `;
            badgesGrid.appendChild(badgeElement);

            if (!isUnlocked) {
                badgeElement.addEventListener('click', () => this.showBadgeUnlockHint(badge));
            }
        });
    }

    showBadgeUnlockHint(badge) {
        const toast = new bootstrap.Toast(document.createElement('div'));
        toast.element.className = 'toast align-items-center text-white bg-primary border-0';
        toast.element.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    Complete this challenge to unlock ${badge.name}: ${badge.condition}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast.element);
        toast.show();
    }

    setupLeaderboard() {
        const leaderboardList = document.querySelector('.leaderboard-list');
        if (!leaderboardList) return;

        // Example leaderboard data
        const leaderboardData = [
            { name: 'Rahul S.', points: 450, rank: 1 },
            { name: 'Priya M.', points: 380, rank: 2 },
            { name: 'Arun K.', points: 320, rank: 3 },
            { name: 'You', points: this.rewards.points, rank: 4 },
            { name: 'Deepa R.', points: 220, rank: 5 }
        ];

        leaderboardList.innerHTML = leaderboardData.map(entry => `
            <div class="leaderboard-entry ${entry.name === 'You' ? 'current-user' : ''}">
                <div class="rank">#${entry.rank}</div>
                <div class="user-info">
                    <span class="name">${entry.name}</span>
                    <span class="points">${entry.points} points</span>
                </div>
                ${entry.rank <= 3 ? `<i class="fas fa-trophy rank-${entry.rank}"></i>` : ''}
            </div>
        `).join('');
    }

    setupChallenges() {
        const challenges = [
            { id: 'daily_save', name: 'Save ₹100 Today', progress: 60, reward: 10 },
            { id: 'weekly_budget', name: 'Stay Within Budget This Week', progress: 80, reward: 20 },
            { id: 'monthly_goal', name: 'Reach Monthly Savings Goal', progress: 45, reward: 50 }
        ];

        const challengeContainer = document.querySelector('.challenge-item')?.parentElement;
        if (!challengeContainer) return;

        challengeContainer.innerHTML = challenges.map(challenge => `
            <div class="challenge-item">
                <div class="challenge-icon">
                    <i class="fas fa-coins"></i>
                </div>
                <div class="challenge-info">
                    <h6>${challenge.name}</h6>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${challenge.progress}%" 
                             aria-valuenow="${challenge.progress}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            ${challenge.progress}%
                        </div>
                    </div>
                    <p>Reward: ${challenge.reward} points</p>
                </div>
            </div>
        `).join('');
    }

    redeemReward(rewardId, points) {
        if (this.rewards.points >= points) {
            this.rewards.points -= points;
            this.rewards.redeemedRewards.push({
                id: rewardId,
                date: new Date().toISOString()
            });
            localStorage.setItem('rewards', JSON.stringify(this.rewards));
            this.showSuccess('Reward redeemed successfully!');
            this.updateRewardsStats();
        } else {
            this.showError('Not enough points to redeem this reward.');
        }
    }

    showSuccess(message) {
        const toast = new bootstrap.Toast(document.createElement('div'));
        toast.element.className = 'toast align-items-center text-white bg-success border-0';
        toast.element.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast.element);
        toast.show();
    }

    showError(message) {
        const toast = new bootstrap.Toast(document.createElement('div'));
        toast.element.className = 'toast align-items-center text-white bg-danger border-0';
        toast.element.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast.element);
        toast.show();
    }
}

// Initialize rewards manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rewardsManager = new RewardsManager();
});