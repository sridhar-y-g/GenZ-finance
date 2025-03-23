// Savings functionality
class SavingsManager {
    constructor() {
        this.savings = JSON.parse(localStorage.getItem('savings')) || [];
        this.goals = JSON.parse(localStorage.getItem('savingsGoals')) || [];
        this.initializeSavings();
    }

    initializeSavings() {
        this.setupCharts();
        this.setupRDForm();
        this.setupFDForm();
        this.updateSavingsGoals();
        this.setupCalculator();
    }

    setupCharts() {
        const ctx = document.getElementById('savingsChart');
        if (!ctx) return;

        if (this.savingsChart) {
            this.savingsChart.destroy();
        }

        this.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Total Savings',
                    data: [5000, 8000, 12000, 15000, 20000, 25000],
                    borderColor: '#198754',
                    tension: 0.4
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

    setupRDForm() {
        const form = document.getElementById('rdForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.openRD();
            });
        }
    }

    setupFDForm() {
        const form = document.getElementById('fdForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.openFD();
            });
        }
    }

    openRD() {
        const form = document.getElementById('rdForm');
        const rd = {
            id: Date.now(),
            type: 'RD',
            monthlyAmount: parseFloat(form.querySelector('input[type="number"]').value),
            tenure: parseInt(form.querySelector('select').value),
            accountNumber: form.querySelector('select[required]').value,
            debitDate: parseInt(form.querySelector('select:last-child').value),
            startDate: new Date().toISOString(),
            interestRate: 7.5
        };

        this.savings.push(rd);
        localStorage.setItem('savings', JSON.stringify(this.savings));

        this.showSuccess('RD account opened successfully!');
        this.updateSavingsOverview();

        const modal = bootstrap.Modal.getInstance(document.getElementById('rdModal'));
        modal.hide();
        form.reset();
    }

    openFD() {
        const form = document.getElementById('fdForm');
        const fd = {
            id: Date.now(),
            type: 'FD',
            amount: parseFloat(form.querySelector('input[type="number"]').value),
            tenure: parseInt(form.querySelector('select').value),
            accountNumber: form.querySelector('select[required]').value,
            interestPayout: form.querySelector('select:last-child').value,
            startDate: new Date().toISOString(),
            interestRate: 8.5
        };

        this.savings.push(fd);
        localStorage.setItem('savings', JSON.stringify(this.savings));

        this.showSuccess('FD account opened successfully!');
        this.updateSavingsOverview();

        const modal = bootstrap.Modal.getInstance(document.getElementById('fdModal'));
        modal.hide();
        form.reset();
    }

    updateSavingsOverview() {
        const totalSavings = this.calculateTotalSavings();
        const savingsGoal = 50000; // Example goal amount
        const progress = (totalSavings / savingsGoal) * 100;

        document.querySelector('.savings-summary h2').textContent = `₹${totalSavings.toLocaleString()}`;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
        document.querySelector('.progress-bar').textContent = `${progress.toFixed(0)}% of Goal`;
    }

    calculateTotalSavings() {
        return this.savings.reduce((total, saving) => {
            if (saving.type === 'RD') {
                const monthsPassed = this.getMonthsDifference(new Date(saving.startDate), new Date());
                return total + (saving.monthlyAmount * monthsPassed);
            } else {
                return total + saving.amount;
            }
        }, 0);
    }

    getMonthsDifference(startDate, endDate) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
        return months + endDate.getMonth() - startDate.getMonth();
    }

    updateSavingsGoals() {
        const goalsList = document.getElementById('savingsGoalsList');
        if (!goalsList) return;

        goalsList.innerHTML = this.goals.map(goal => `
            <tr>
                <td>${goal.name}</td>
                <td>₹${goal.targetAmount.toLocaleString()}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" 
                             style="width: ${(goal.currentAmount / goal.targetAmount) * 100}%">
                            ₹${goal.currentAmount.toLocaleString()}
                        </div>
                    </div>
                </td>
                <td>${new Date(goal.targetDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="savingsManager.addToGoal(${goal.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    addToGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        const amount = prompt('Enter amount to add to goal:');
        if (amount && !isNaN(amount)) {
            goal.currentAmount += parseFloat(amount);
            localStorage.setItem('savingsGoals', JSON.stringify(this.goals));
            this.updateSavingsGoals();
            this.showSuccess(`Added ₹${amount} to ${goal.name}`);
        }
    }

    setupCalculator() {
        const calculator = document.getElementById('savingsCalculator');
        if (calculator) {
            calculator.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateReturns();
            });
        }
    }

    calculateReturns() {
        const type = document.getElementById('investmentType').value;
        const amount = parseFloat(document.getElementById('investmentAmount').value);
        const duration = parseInt(document.getElementById('duration').value);

        let returns = 0;
        if (type === 'rd') {
            returns = this.calculateRDReturns(amount, duration);
        } else {
            returns = this.calculateFDReturns(amount, duration);
        }

        const resultDiv = document.getElementById('calculationResult');
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <h6>Estimated Returns:</h6>
                <p>Principal: ₹${amount.toLocaleString()}</p>
                <p>Interest Earned: ₹${(returns - amount).toLocaleString()}</p>
                <p>Maturity Amount: ₹${returns.toLocaleString()}</p>
            </div>
        `;
    }

    calculateRDReturns(monthlyAmount, months) {
        const rate = 7.5 / 100 / 12; // Monthly interest rate
        const maturityAmount = monthlyAmount * ((Math.pow(1 + rate, months) - 1) / rate);
        return Math.round(maturityAmount);
    }

    calculateFDReturns(principal, months) {
        const rate = 8.5 / 100; // Annual interest rate
        const years = months / 12;
        const maturityAmount = principal * Math.pow(1 + rate, years);
        return Math.round(maturityAmount);
    }

    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.card-body').insertAdjacentElement('afterbegin', alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Initialize savings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.savingsManager = new SavingsManager();
});