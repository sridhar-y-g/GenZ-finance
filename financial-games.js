class FinancialGames {
    constructor() {
        this.rewardsManager = window.rewardsManager;
        this.games = [
            {
                id: 'budget_puzzle',
                name: 'Budget Master Puzzle',
                description: 'Arrange expenses to create the perfect budget',
                reward: 50,
                cashback: 20
            },
            {
                id: 'savings_challenge',
                name: 'Savings Sprint',
                description: 'Race against time to maximize your savings',
                reward: 75,
                cashback: 30
            },
            {
                id: 'investment_quiz',
                name: 'Investment IQ',
                description: 'Test your investment knowledge',
                reward: 100,
                cashback: 40
            }
        ];
        this.initializeGames();
    }

    initializeGames() {
        const gamesContainer = document.getElementById('financial-games');
        if (!gamesContainer) return;

        gamesContainer.innerHTML = `
            <div class="games-grid">
                ${this.games.map(game => this.createGameCard(game)).join('')}
            </div>
        `;

        this.attachGameListeners();
    }

    createGameCard(game) {
        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-icon">
                    <i class="fas ${this.getGameIcon(game.id)}"></i>
                </div>
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="game-rewards">
                    <span class="points">🏆 ${game.reward} points</span>
                    <span class="cashback">💰 ₹${game.cashback} cashback</span>
                </div>
                <button class="btn btn-primary play-game">Play Now</button>
            </div>
        `;
    }

    getGameIcon(gameId) {
        const icons = {
            budget_puzzle: 'fa-puzzle-piece',
            savings_challenge: 'fa-running',
            investment_quiz: 'fa-brain'
        };
        return icons[gameId] || 'fa-gamepad';
    }

    attachGameListeners() {
        document.querySelectorAll('.play-game').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameCard = e.target.closest('.game-card');
                const gameId = gameCard.dataset.gameId;
                this.startGame(gameId);
            });
        });
    }

    startGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;

        const gameModal = new bootstrap.Modal(document.createElement('div'));
        gameModal.element.className = 'modal fade';
        gameModal.element.innerHTML = this.createGameModal(game);
        document.body.appendChild(gameModal.element);

        gameModal.show();
        this.initializeGameLogic(gameId, gameModal);
    }

    createGameModal(game) {
        return `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${game.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" id="game-content">
                        ${this.getGameContent(game.id)}
                    </div>
                </div>
            </div>
        `;
    }

    getGameContent(gameId) {
        switch(gameId) {
            case 'budget_puzzle':
                return this.createBudgetPuzzle();
            case 'savings_challenge':
                return this.createSavingsChallenge();
            case 'investment_quiz':
                return this.createInvestmentQuiz();
            default:
                return '<p>Game content not available</p>';
        }
    }

    createBudgetPuzzle() {
        return `
            <div class="budget-puzzle">
                <div class="puzzle-grid" id="puzzle-grid">
                    <div class="puzzle-item" draggable="true" data-category="essentials">Groceries</div>
                    <div class="puzzle-item" draggable="true" data-category="entertainment">Movies</div>
                    <div class="puzzle-item" draggable="true" data-category="savings">Emergency Fund</div>
                </div>
                <div class="puzzle-categories">
                    <div class="category" data-category="essentials">Essentials</div>
                    <div class="category" data-category="entertainment">Entertainment</div>
                    <div class="category" data-category="savings">Savings</div>
                </div>
            </div>
        `;
    }

    createSavingsChallenge() {
        return `
            <div class="savings-challenge">
                <div class="timer">Time: <span id="timer">60</span>s</div>
                <div class="savings-container">
                    <div class="savings-item" data-value="100">₹100</div>
                    <div class="savings-item" data-value="500">₹500</div>
                    <div class="savings-item" data-value="1000">₹1000</div>
                </div>
                <div class="savings-goal">
                    Target: ₹5000
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    createInvestmentQuiz() {
        return `
            <div class="investment-quiz">
                <div class="quiz-progress">Question 1/5</div>
                <div class="quiz-question">
                    <h4>What is the primary benefit of diversification?</h4>
                    <div class="quiz-options">
                        <button class="btn btn-outline-primary option">Reduced Risk</button>
                        <button class="btn btn-outline-primary option">Higher Returns</button>
                        <button class="btn btn-outline-primary option">Lower Taxes</button>
                        <button class="btn btn-outline-primary option">Better Liquidity</button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeGameLogic(gameId, modal) {
        switch(gameId) {
            case 'budget_puzzle':
                this.initializeBudgetPuzzle(modal);
                break;
            case 'savings_challenge':
                this.initializeSavingsChallenge(modal);
                break;
            case 'investment_quiz':
                this.initializeInvestmentQuiz(modal);
                break;
        }
    }

    completeGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) return;

        this.rewardsManager.rewards.points += game.reward;
        localStorage.setItem('rewards', JSON.stringify(this.rewardsManager.rewards));

        this.showGameComplete(game);
    }

    showGameComplete(game) {
        const toast = new bootstrap.Toast(document.createElement('div'));
        toast.element.className = 'toast align-items-center text-white bg-success border-0';
        toast.element.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    Congratulations! You earned ${game.reward} points and ₹${game.cashback} cashback!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        document.body.appendChild(toast.element);
        toast.show();
    }
}

// Initialize games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialGames = new FinancialGames();
});