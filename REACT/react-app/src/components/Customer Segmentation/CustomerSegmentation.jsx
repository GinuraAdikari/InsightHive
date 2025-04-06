import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './CustomerSegmentation.css';
// Import images from the assets folder
import Plot1 from '../../assets/image_1.png';
import Plot2 from '../../assets/image_2.png';
import Plot3 from '../../assets/image_3.png';
import Plot4 from '../../assets/image_4.png';
import Plot5 from '../../assets/image_5.png';
import Plot7 from '../../assets/image_6.png';
import CSVFile from '../../assets/customer_segmentation.csv';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const plots = [
    {
        src: Plot1,
        title: 'Features Distribution',
        summary: 'This plot shows the distribution of key features across all customers. We can observe that most features follow a right-skewed distribution, indicating most customers have lower values with some high-spending outliers.',
        businessValue: 'Helps identify outliers and understand the spread of customer behaviors. Useful for setting realistic marketing targets and identifying potential high-value customers.'
    },
    {
        src: Plot2,
        title: 'Tenure vs Credit Limit',
        summary: 'Scatter plot showing the relationship between customer tenure and their credit limit. Longer-tenured customers tend to have higher credit limits, but there are exceptions.',
        businessValue: 'Reveals opportunities to increase credit limits for loyal customers, potentially boosting their spending capacity and customer lifetime value.'
    },
    {
        src: Plot3,
        title: 'Customer Count by Tenure',
        summary: 'Bar plot displaying the number of customers at different tenure levels. Most customers have been with the company between 10-12 months.',
        businessValue: 'Identifies customer retention patterns and helps focus retention efforts on critical tenure periods where customers might churn.'
    },
    {
        src: Plot7,
        title: 'Payment vs Tenure',
        summary: 'Shows the relationship between customer tenure and their payment amounts. Generally, longer tenure correlates with higher payments.',
        businessValue: 'Demonstrates the value of customer longevity. Can justify investment in retention programs by showing the payment growth of long-term customers.'
    },
    {
        src: Plot4,
        title: 'Elbow Method',
        summary: 'The elbow method helps determine the optimal number of clusters (3 in this case) where the within-cluster sum of squares begins to level off significantly.',
        businessValue: 'Provides data-driven justification for having 3 distinct customer segments, ensuring marketing resources are optimally allocated.'
    },
    {
        src: Plot5,
        title: 'Internal Validation',
        summary: 'Validation metrics (Silhouette Score, Davies-Bouldin Index) confirming that 3 clusters provide the best separation for our customer data.',
        businessValue: 'Validates the segmentation model quality, giving confidence that the clusters are statistically meaningful and actionable.'
    },
];

const clusters = [
    {
        id: 0,
        name: 'High Spenders',
        color: '#FF6B6B',
        icon: '💰',
        characteristics: [
            'Very high purchases, cash advances, and payments.',
            'High credit limit and balance.',
            'Frequent purchasers with high purchase frequency.',
        ],
        behavior: [
            'Likely to make large one-off purchases and cash advances.',
            'High engagement with credit card usage.',
        ],
        strategy: 'Target with premium offers and loyalty programs.',
    },
    {
        id: 1,
        name: 'Low Spenders',
        color: '#4ECDC4',
        icon: '🛒',
        characteristics: [
            'Low purchases, cash advances, and payments.',
            'Low credit limit and balance.',
            'Infrequent purchasers with low purchase frequency.',
        ],
        behavior: [
            'Minimal engagement with credit card usage.',
            'Likely to use credit cards for essential purchases only.',
        ],
        strategy: 'Encourage to increase credit card usage with low-cost incentives.',
    },
    {
        id: 2,
        name: 'Moderate Spenders',
        color: '#45B7D1',
        icon: '⚖',
        characteristics: [
            'Medium purchases, cash advances, and payments.',
            'High credit limit and medium balance.',
            'Moderate purchase frequency and one-off purchases.',
        ],
        behavior: [
            'Balanced credit card usage.',
            'Likely to make both one-off and installment purchases.',
        ],
        strategy: 'Offer installment plans and cashback deals.',
    },
];

const features = [
    { name: 'BALANCE', description: 'Balance amount left in their account to make purchases' },
    { name: 'BALANCE_FREQUENCY', description: 'How frequently the Balance is updated, score between 0 and 1 (1 = frequently updated)' },
    { name: 'CLUSTER', description: 'Customer segment assignment (0=High Spender, 1=Low Spender, 2=Moderate Spender)' },
    { name: 'PURCHASES', description: 'Amount of purchases made from the account' },
    { name: 'ONEOFF_PURCHASES', description: 'Maximum purchase amount done in one-go' },
    { name: 'INSTALLMENTS_PURCHASES', description: 'Amount of purchase done in installment' },
    { name: 'CASH_ADVANCE', description: 'Cash in advance given by the user' },
    { name: 'PURCHASES_FREQUENCY', description: 'How frequently purchases are being made, score between 0 and 1 (1 = frequent purchases)' },
    { name: 'ONEOFF_PURCHASES_FREQUENCY', description: 'How frequently purchases are happening in one-go' },
    { name: 'PURCHASES_INSTALLMENTS_FREQUENCY', description: 'How frequently purchases in installments are being done' },
    { name: 'CASH_ADVANCE_FREQUENCY', description: 'How frequently the cash in advance is being paid' },
    { name: 'CASH_ADVANCE_TRX', description: 'Number of Transactions made with "Cash in Advance"' },
    { name: 'PURCHASES_TRX', description: 'Number of purchase transactions made' },
    { name: 'CREDIT_LIMIT', description: 'Limit of Credit Card for user' },
    { name: 'PAYMENTS', description: 'Amount of Payment done by the user' },
    { name: 'MINIMUM_PAYMENTS', description: 'Minimum amount of payments made by the user' },
    { name: 'PRC_FULL_PAYMENT', description: 'Percent of full payment paid by the user' },
    { name: 'TENURE', description: 'Tenure of credit card service for user (in months)' },
].sort((a, b) => a.name.localeCompare(b.name));

const clusterStats = [
    { feature: 'BALANCE', cluster0: 4841.89, cluster1: 857.36, cluster2: 3414.11 },
    { feature: 'BALANCE_FREQUENCY', cluster0: 0.91, cluster1: 0.85, cluster2: 0.94 },
    { feature: 'PURCHASES', cluster0: 10789.31, cluster1: 606.22, cluster2: 1587.23 },
    { feature: 'ONEOFF_PURCHASES', cluster0: 7619.68, cluster1: 314.26, cluster2: 991.92 },
    { feature: 'INSTALLMENTS_PURCHASES', cluster0: 3169.79, cluster1: 292.26, cluster2: 595.62 },
    { feature: 'CASH_ADVANCE', cluster0: 5152.22, cluster1: 496.02, cluster2: 2131.09 },
    { feature: 'PURCHASES_FREQUENCY', cluster0: 0.75, cluster1: 0.47, cluster2: 0.54 },
    { feature: 'ONEOFF_PURCHASES_FREQUENCY', cluster0: 0.60, cluster1: 0.15, cluster2: 0.32 },
    { feature: 'PURCHASES_INSTALLMENTS_FREQUENCY', cluster0: 0.60, cluster1: 0.35, cluster2: 0.39 },
    { feature: 'CASH_ADVANCE_FREQUENCY', cluster0: 0.23, cluster1: 0.11, cluster2: 0.21 },
    { feature: 'CASH_ADVANCE_TRX', cluster0: 9.20, cluster1: 2.26, cluster2: 5.77 },
    { feature: 'PURCHASES_TRX', cluster0: 86.20, cluster1: 10.69, cluster2: 22.20 },
    { feature: 'CREDIT_LIMIT', cluster0: 12465.77, cluster1: 2761.03, cluster2: 9030.62 },
    { feature: 'PAYMENTS', cluster0: 18117.43, cluster1: 998.54, cluster2: 2912.43 },
    { feature: 'MINIMUM_PAYMENTS', cluster0: 2521.69, cluster1: 553.97, cluster2: 1561.59 },
    { feature: 'PRC_FULL_PAYMENT', cluster0: 0.33, cluster1: 0.16, cluster2: 0.13 },
    { feature: 'TENURE', cluster0: 11.84, cluster1: 11.44, cluster2: 11.74 },
];

const CustomerSegmentation = () => {
    const [activeCluster, setActiveCluster] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);

    const filteredFeatures = features.filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
    };

    const handlePlotClick = (plot) => {
        setSelectedPlot(plot);
    };

    const handleDownloadCSV = () => {
        const link = document.createElement('a');
        link.href = CSVFile;
        link.download = 'customer_segmentation.csv';
        link.click();
    };

    // Common tooltip configuration for both charts
    const commonTooltipConfig = {
        enabled: true,
        displayColors: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#f0f0f0',
        bodyColor: '#f0f0f0',
        bodyFont: {
            size: 14,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            weight: 'bold'
        },
        padding: 12,
        cornerRadius: 6,
        bodySpacing: 8,
        boxPadding: 6,
        caretSize: 8,
        caretPadding: 10,
        usePointStyle: true
    };

    return (
        <div className="segmentation-background">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Customer Segmentation Dashboard</h1>
                    <p className="subtitle">Advanced analytics to understand and target different customer groups</p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="main-container">
                {/* Data Features Section */}
                <section className="section-card">
                    <h2>Data Features</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search features..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="features-grid">
                        {filteredFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-card ${selectedFeature?.name === feature.name ? 'active' : ''}`}
                                onClick={() => handleFeatureClick(feature)}
                            >
                                <h3>{feature.name}</h3>
                                {selectedFeature?.name === feature.name && (
                                    <div className="feature-description">
                                        <p>{feature.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Visualizations Section */}
                <section className="section-card">
                    <h2>Analytical Visualizations</h2>
                    <div className="plots-grid">
                        {plots.map((plot, index) => (
                            <div key={index} className="plot-card">
                                <div className="plot-image-container">
                                    <img
                                        src={plot.src}
                                        alt={plot.title}
                                        className="plot-image"
                                    />
                                </div>
                                <div className="plot-footer">
                                    <h3>{plot.title}</h3>
                                    <button
                                        className="plot-action-btn"
                                        onClick={() => handlePlotClick(plot)}
                                    >
                                        View Insights
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Plot Summary Modal */}
                {selectedPlot && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{selectedPlot.title}</h3>
                                <button
                                    className="modal-close"
                                    onClick={() => setSelectedPlot(null)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={selectedPlot.src}
                                    alt={selectedPlot.title}
                                    className="modal-image"
                                />
                                <div className="plot-summary">
                                    <h4>Analysis:</h4>
                                    <p>{selectedPlot.summary}</p>
                                    <h4>Business Value:</h4>
                                    <p>{selectedPlot.businessValue}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cluster Statistics Table */}
                <section className="section-card">
                    <h2>Mean Values by Cluster</h2>
                    <div className="table-container">
                        <table className="cluster-table">
                            <thead>
                            <tr>
                                <th>Feature</th>
                                <th>High Spenders</th>
                                <th>Low Spenders</th>
                                <th>Moderate Spenders</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clusterStats.map((stat, index) => (
                                <tr key={index}>
                                    <td>{stat.feature}</td>
                                    <td>{stat.cluster0}</td>
                                    <td>{stat.cluster1}</td>
                                    <td>{stat.cluster2}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Cluster Distribution Visualization */}
                <section className="section-card">
                    <h2>Cluster Distribution</h2>
                    <div className="cluster-charts-container">
                        {/* Pie Chart */}
                        <div className="cluster-chart">
                            <h3>Percentage Distribution</h3>
                            <div className="chart-wrapper">
                                <Pie
                                    data={{
                                        labels: ['High Spenders', 'Low Spenders', 'Moderate Spenders'],
                                        datasets: [{
                                            data: [1.5, 73.1, 25.5],
                                            backgroundColor: [
                                                '#FF6B6B',
                                                '#4ECDC4',
                                                '#45B7D1'
                                            ],
                                            borderColor: '#2a2a2a',
                                            borderWidth: 2,
                                            hoverOffset: 15
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                ...commonTooltipConfig,
                                                callbacks: {
                                                    label: function(context) {
                                                        return `Customers: ${context.raw}%`;
                                                    }
                                                },
                                                position: 'average'
                                            }
                                        },
                                        animation: {
                                            animateScale: true,
                                            animateRotate: true
                                        },
                                        cutout: '60%',
                                        radius: '90%',
                                        rotation: -30
                                    }}
                                />
                            </div>
                            {/* Custom Legend */}
                            <div className="custom-legend">
                                {['High Spenders', 'Low Spenders', 'Moderate Spenders'].map((label, index) => (
                                    <div key={index} className="legend-item">
                                        <span className="color-box" style={{
                                            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index]
                                        }} />
                                        <span className="legend-label">{label}</span>
                                        <span className="legend-value">{[1.5, 73.1, 25.5][index]}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="cluster-chart">
                            <h3>Count Distribution</h3>
                            <div className="chart-wrapper">
                                <Bar
                                    data={{
                                        labels: ['High Spenders', 'Low Spenders', 'Moderate Spenders'],
                                        datasets: [{
                                            label: 'Customers',
                                            data: [130, 6539, 2280],
                                            backgroundColor: [
                                                '#FF6B6B',
                                                '#4ECDC4',
                                                '#45B7D1'
                                            ],
                                            borderColor: '#2a2a2a',
                                            borderWidth: 2,
                                            hoverBackgroundColor: [
                                                '#ff8e8e',
                                                '#7ce0d8',
                                                '#67c7e0'
                                            ]
                                        }]
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                ...commonTooltipConfig,
                                                callbacks: {
                                                    label: function(context) {
                                                        return `Customers: ${context.raw}`;
                                                    }
                                                },
                                                position: 'nearest',
                                                xAlign: 'center',
                                                yAlign: 'bottom'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: { color: '#f0f0f0' },
                                                grid: { color: 'rgba(255, 255, 255, 0.1)' }
                                            },
                                            x: {
                                                ticks: { color: '#f0f0f0' },
                                                grid: { display: false }
                                            }
                                        },
                                        animation: {
                                            duration: 2000
                                        },
                                        borderRadius: 6
                                    }}
                                />
                            </div>

                            <div className="custom-legend">
                                {['High Spenders', 'Low Spenders', 'Moderate Spenders'].map((label, index) => (
                                    <div key={index} className="legend-item">
                                        <span className="color-box" style={{
                                            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index]
                                        }} />
                                        <span className="legend-label">{label}</span>
                                        <span className="legend-value">{[130, 6539, 2280][index]}</span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className="cluster-count-summary">
                        <p>This visualization shows the proportion of customers in each segment. Understanding the distribution helps allocate appropriate resources for each customer group's needs and potential value.</p>
                    </div>
                </section>

                {/* Customer Segments Analysis */}
                <section className="section-card">
                    <h2>Customer Segments Analysis</h2>
                    <div className="cluster-tabs">
                        {clusters.map((cluster) => (
                            <button
                                key={cluster.id}
                                className={`cluster-tab ${activeCluster === cluster.id ? 'active' : ''}`}
                                style={{ borderBottomColor: cluster.color }}
                                onClick={() => setActiveCluster(cluster.id)}
                            >
                                <span className="cluster-icon">{cluster.icon}</span>
                                <span className="cluster-name">{cluster.name}</span>
                            </button>
                        ))}
                    </div>

                    {activeCluster !== null && (
                        <div className="cluster-details" style={{ borderTop: `4px solid ${clusters[activeCluster].color}` }}>
                            <div className="cluster-header">
                                <h3>
                                    <span className="cluster-icon-large">{clusters[activeCluster].icon}</span>
                                    {clusters[activeCluster].name} Segment
                                </h3>
                                <span className="cluster-id">Segment {clusters[activeCluster].id}</span>
                            </div>

                            <div className="cluster-info-grid">
                                <div className="info-card">
                                    <h4>Key Characteristics</h4>
                                    <ul>
                                        {clusters[activeCluster].characteristics.map((char, index) => (
                                            <li key={index}>{char}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="info-card">
                                    <h4>Behavior Patterns</h4>
                                    <ul>
                                        {clusters[activeCluster].behavior.map((beh, index) => (
                                            <li key={index}>{beh}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="info-card strategy-card">
                                    <h4>Recommended Strategy</h4>
                                    <p>{clusters[activeCluster].strategy}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* CSV Download Section */}
                <section className="section-card download-section">
                    <div className="download-content">
                        <div className="download-text">
                            <h2>Explore Customer-Level Data</h2>
                            <p>Download the complete customer segmentation dataset to analyze individual customers within each cluster. The CSV includes all features plus cluster assignments for each customer.</p>
                        </div>
                        <button
                            className="download-btn"
                            onClick={handleDownloadCSV}
                        >
                            <span className="download-icon">↓</span>
                            Download Clustered_Data (csv)
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CustomerSegmentation;