// Sample data
const quarterlyData = [
    { quarter: 'Q1 2023', sales: 2000, growth: 1000, distribution: 30 },
    { quarter: 'Q2 2023', sales: 4000, growth: 4000, distribution: 32 },
    { quarter: 'Q3 2023', sales: 5500, growth: 5000, distribution: 35 },
    { quarter: 'Q4 2023', sales: 7000, growth: 5000, distribution: 35 },
    // Add more data as needed
];

// Prepare data for charts
const quarters = quarterlyData.map(data => data.quarter);
const salesData = quarterlyData.map(data => data.sales);
const growthData = quarterlyData.map(data => data.growth);
const distributionData = quarterlyData.map(data => data.distribution);

// Sales and Growth Chart
const salesCtx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: quarters,
        datasets: [
            {
                label: 'Sales',
                data: salesData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)'
            },
            {
                label: 'Growth',
                data: growthData,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// User Distribution Pie Chart
const distributionCtx = document.getElementById('distributionChart').getContext('2d');
const distributionChart = new Chart(distributionCtx, {
    type: 'pie',
    data: {
        labels: quarters,
        datasets: [{
            data: distributionData,
            backgroundColor: [
                'red', 'blue', 'green', 'orange' // Add more colors as needed
            ]
        }]
    },
    options: {
        responsive: true
    }
});