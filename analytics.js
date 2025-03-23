// Analytics functionality
class FinancialAnalytics {
    constructor() {
        this.data = {
            expenses: JSON.parse(localStorage.getItem('expenses')) || [],
            savings: JSON.parse(localStorage.getItem('savings')) || [],
            rewards: JSON.parse(localStorage.getItem('rewards')) || []
        };
        this.period = 'monthly';
        this.initializeAnalytics();
    }

    initializeAnalytics() {
        this.setupPeriodButtons();
        this.updateCharts();
        this.setupReportGeneration();
        this.generateInsights();
    }

    setupPeriodButtons() {
        const buttons = document.querySelectorAll('[data-period]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                this.period = button.dataset.period;
                this.updateCharts();
            });
        });
    }

    updateCharts() {
        this.updateSpendingTrendChart();
        this.updateSavingsGoalChart();
        this.updateCategoryPieChart();
    }

    updateSpendingTrendChart() {
        const ctx = document.getElementById('spendingTrendChart');
        if (!ctx) return;

        const periodData = this.getSpendingTrendData();

        if (this.spendingTrendChart) {
            this.spendingTrendChart.destroy();
        }

        this.spendingTrendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: periodData.labels,
                datasets: [{
                    label: 'Spending',
                    data: periodData.spending,
                    borderColor: '#0d6efd',
                    tension: 0.4
                }, {
                    label: 'Budget',
                    data: periodData.budget,
                    borderColor: '#198754',
                    borderDash: [5, 5],
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

    updateSavingsGoalChart() {
        const ctx = document.getElementById('savingsGoalChart');
        if (!ctx) return;

        const savingsData = this.getSavingsData();

        if (this.savingsGoalChart) {
            this.savingsGoalChart.destroy();
        }

        this.savingsGoalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: savingsData.labels,
                datasets: [{
                    label: 'Current Savings',
                    data: savingsData.current,
                    backgroundColor: '#0dcaf0'
                }, {
                    label: 'Goal',
                    data: savingsData.goals,
                    backgroundColor: '#6c757d'
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

    updateCategoryPieChart() {
        const ctx = document.getElementById('categoryPieChart');
        if (!ctx) return;

        const categoryData = this.getCategoryData();

        if (this.categoryPieChart) {
            this.categoryPieChart.destroy();
        }

        this.categoryPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: [
                        '#0d6efd',
                        '#198754',
                        '#ffc107',
                        '#0dcaf0',
                        '#6c757d'
                    ]
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

        this.updateCategoryStats(categoryData);
    }

    updateCategoryStats(data) {
        const categoryStats = document.querySelector('.category-stats');
        if (!categoryStats) return;

        const total = data.values.reduce((sum, value) => sum + value, 0);
        const items = data.labels.map((label, index) => {
            const percentage = ((data.values[index] / total) * 100).toFixed(0);
            return `
                <div class="category-item">
                    <span class="category-name">${label}</span>
                    <div class="progress">
                        <div class="progress-bar bg-${this.getCategoryColor(index)}" 
                             role="progressbar" 
                             style="width: ${percentage}%">
                            ₹${data.values[index].toLocaleString()}
                        </div>
                    </div>
                </div>
            `;
        });

        categoryStats.innerHTML = items.join('');
    }

    getCategoryColor(index) {
        const colors = ['primary', 'success', 'warning', 'info', 'secondary'];
        return colors[index % colors.length];
    }

    getSpendingTrendData() {
        // Example data - replace with actual data processing
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            spending: [5000, 4500, 6000, 5500, 4800, 5200],
            budget: [5500, 5500, 5500, 5500, 5500, 5500]
        };
    }

    getSavingsData() {
        // Example data - replace with actual data processing
        return {
            labels: ['Emergency Fund', 'New Laptop', 'Vacation'],
            current: [15000, 20000, 5000],
            goals: [20000, 50000, 30000]
        };
    }

    getCategoryData() {
        // Example data - replace with actual data processing
        return {
            labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Others'],
            values: [3500, 2000, 1500, 3000, 1000]
        };
    }

    setupReportGeneration() {
        const generateBtn = document.getElementById('generateReport');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReport());
        }
    }

    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const reportMonth = document.getElementById('reportMonth').value;

        // Generate report data
        const reportData = this.getReportData(reportType, reportMonth);

        // Create report preview
        this.showReportPreview(reportData);

        // Enable download
        this.enableReportDownload(reportData);
    }

    getReportData(type, month) {
        // Example report data - replace with actual data processing
        return {
            type: type,
            period: month,
            summary: {
                totalExpenses: 11000,
                totalSavings: 4000,
                rewardsEarned: 250
            },
            categories: this.getCategoryData(),
            insights: this.generateInsights()
        };
    }

    showReportPreview(data) {
        const preview = document.getElementById('reportPreview');
        if (!preview) return;

        preview.innerHTML = `
            <div class="report-preview-content">
                <h5>Report Preview - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}</h5>
                <div class="report-summary">
                    <p><strong>Period:</strong> ${data.period}</p>
                    <p><strong>Total Expenses:</strong> ₹${data.summary.totalExpenses}</p>
                    <p><strong>Total Savings:</strong> ₹${data.summary.totalSavings}</p>
                    <p><strong>Rewards Earned:</strong> ${data.summary.rewardsEarned} points</p>
                </div>
                <div class="report-insights mt-3">
                    <h6>Key Insights:</h6>
                    <ul>
                        ${data.insights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    enableReportDownload(data) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn btn-success mt-3';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Report';
        downloadBtn.onclick = () => this.downloadReport(data);

        const preview = document.getElementById('reportPreview');
        if (preview) {
            preview.appendChild(downloadBtn);
        }
    }

    downloadReport(data) {
        // Create text report content
        const textContent = this.generateTextReport(data);
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial_report_${data.period}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    generateTextReport(data) {
        const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;
        
        let report = `Financial Report - ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}\n`;
        report += `Period: ${data.period}\n\n`;

        report += 'Summary\n';
        report += '-------\n';
        report += `Total Expenses: ${formatCurrency(data.summary.totalExpenses)}\n`;
        report += `Total Savings: ${formatCurrency(data.summary.totalSavings)}\n`;
        report += `Rewards Earned: ${data.summary.rewardsEarned} points\n\n`;

        report += 'Category-wise Expenses\n';
        report += '-------------------\n';
        const total = data.categories.values.reduce((sum, value) => sum + value, 0);
        data.categories.labels.forEach((label, index) => {
            const value = data.categories.values[index];
            const percentage = ((value / total) * 100).toFixed(1);
            report += `${label}: ${formatCurrency(value)} (${percentage}%)\n`;
        });
        report += '\n';

        report += 'Key Insights\n';
        report += '------------\n';
        data.insights.forEach(insight => {
            report += `• ${insight}\n`;
        });

        return report;
    }

    generateInsights() {
        // Example insights - replace with AI-powered analysis
        return [
            'Your savings rate has increased by 15% compared to last month',
            'Entertainment spending is higher than usual',
            'You could save ₹2,000 more by reducing food delivery expenses',
            'You\'re on track to reach your emergency fund goal'
        ];
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialAnalytics = new FinancialAnalytics();
});