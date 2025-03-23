// Budget functionality
class BudgetManager {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.categories = [
            { name: 'Food & Dining', color: '#0d6efd', icon: 'fa-utensils' },
            { name: 'Transportation', color: '#198754', icon: 'fa-car' },
            { name: 'Entertainment', color: '#ffc107', icon: 'fa-film' },
            { name: 'Shopping', color: '#0dcaf0', icon: 'fa-shopping-bag' },
            { name: 'Others', color: '#6c757d', icon: 'fa-ellipsis-h' }
        ];
        this.initializeBudget();
    }

    initializeBudget() {
        this.setupExpenseForm();
        this.setupCategoryCards();
        this.updateExpenseList();
        this.updateCharts();
        this.setupEventListeners();
    }

    setupExpenseForm() {
        const form = document.getElementById('expenseForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }
    }

    addExpense() {
        const form = document.getElementById('expenseForm');
        const expense = {
            id: Date.now(),
            date: form.querySelector('input[type="date"]').value,
            category: form.querySelector('select').value,
            description: form.querySelector('input[type="text"]').value,
            amount: parseFloat(form.querySelector('input[type="number"]').value)
        };

        this.expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(this.expenses));

        this.updateExpenseList();
        this.updateCharts();
        this.checkBudgetLimits(expense);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addExpenseModal'));
        modal.hide();
        form.reset();
    }

    updateExpenseList() {
        const expenseList = document.getElementById('expenseList');
        if (!expenseList) return;

        expenseList.innerHTML = '';
        this.expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="budgetManager.deleteExpense(${expense.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            expenseList.appendChild(row);
        });

        this.updateBudgetSummary();
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        this.updateExpenseList();
        this.updateCharts();
    }

    updateBudgetSummary() {
        const totalBudget = 10000; // Example budget amount
        const totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remaining = totalBudget - totalSpent;

        document.querySelector('.progress-bar').style.width = `${(totalSpent / totalBudget) * 100}%`;
        document.querySelector('.budget-summary strong:nth-child(1)').textContent = `₹${totalBudget}`;
        document.querySelector('.budget-summary .text-danger').textContent = `₹${totalSpent.toFixed(2)}`;
        document.querySelector('.budget-summary .text-success').textContent = `₹${remaining.toFixed(2)}`;
    }

    setupCategoryCards() {
        const categoryCards = document.getElementById('categoryCards');
        if (!categoryCards) return;

        categoryCards.innerHTML = this.categories.map(category => `
            <div class="col-md-4 mb-3">
                <div class="card category-card">
                    <div class="card-body text-center">
                        <i class="fas ${category.icon} fa-2x mb-2" style="color: ${category.color}"></i>
                        <h6>${category.name}</h6>
                        <div class="progress mt-2">
                            <div class="progress-bar" role="progressbar" style="width: 0%; background-color: ${category.color}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCharts() {
        this.updateExpenseChart();
        this.updateCategoryProgress();
    }

    updateExpenseChart() {
        const ctx = document.getElementById('expenseChart');
        if (!ctx) return;

        const categoryTotals = {};
        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        if (this.expenseChart) {
            this.expenseChart.destroy();
        }

        this.expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: this.categories.map(cat => cat.color)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateCategoryProgress() {
        const categoryTotals = {};
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

        this.expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        this.categories.forEach(category => {
            const percentage = ((categoryTotals[category.name] || 0) / totalExpenses) * 100;
            const progressBar = document.querySelector(`.category-card:nth-child(${this.categories.indexOf(category) + 1}) .progress-bar`);
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
        });
    }

    checkBudgetLimits(expense) {
        const monthlyTotal = this.expenses
            .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
            .reduce((sum, e) => sum + e.amount, 0);

        if (monthlyTotal > 10000) { // Example budget limit
            this.showAlert('Warning: You have exceeded your monthly budget limit!');
        }

        // Check category-specific limits
        const categoryTotal = this.expenses
            .filter(e => e.category === expense.category)
            .reduce((sum, e) => sum + e.amount, 0);

        const categoryLimits = {
            'Food & Dining': 5000,
            'Entertainment': 2000,
            'Shopping': 3000
        };

        if (categoryLimits[expense.category] && categoryTotal > categoryLimits[expense.category]) {
            this.showAlert(`Warning: You have exceeded your budget limit for ${expense.category}!`);
        }
    }

    showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.card-body').insertAdjacentElement('afterbegin', alertDiv);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }
}

// Initialize budget manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.budgetManager = new BudgetManager();
});

// Add budget-specific styles
const style = document.createElement('style');
style.textContent = `
    .category-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }

    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .progress {
        height: 8px;
        margin-top: 1rem;
    }

    .progress-bar {
        transition: width 1s ease-in-out;
    }

    .alert {
        animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);