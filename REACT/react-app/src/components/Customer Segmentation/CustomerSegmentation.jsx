import React, { useState } from 'react';
import './CustomerSegmentation.css';

// Import images from the assets folder
import Plot1 from '../../assets/image_1.png';
import Plot2 from '../../assets/image_2.png';
import Plot3 from '../../assets/image_3.png';
import Plot4 from '../../assets/image_4.png';
import Plot5 from '../../assets/image_5.png';
import Plot6 from '../../assets/image_6.png';

const plots = [
    { src: Plot1, title: 'Features Distribution' },
    { src: Plot2, title: 'Tenure with Credit Limit in Scatter Plot' },
    { src: Plot3, title: 'Customer count in particular Tenure in Bar Plot' },
    { src: Plot4, title: 'El-Bow Method' },
    { src: Plot5, title: 'Internal Validation Methods' },
    { src: Plot6, title: 'Visualize count of each cluster' },
];

const clusters = [
    {
        id: 0,
        name: 'Cluster 0: High Spenders',
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
        name: 'Cluster 1: Low Spenders',
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
        name: 'Cluster 2: Moderate Spenders',
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

const CustomerSegmentation = () => {
    const [activeCluster, setActiveCluster] = useState(null);

    const handleClusterClick = (clusterId) => {
        setActiveCluster(clusterId === activeCluster ? null : clusterId);
    };

    return (
        <div className="segmentation-background">
            {/* Container for the heading and intro paragraph */}
            <div className="segmentation-container">
                <h1>Customer Segmentation</h1>
                <p>Analyze and segment your customers based on behavior and demographics.</p>
            </div>

            {/* Container for the data details */}
            <div className="data-container">
                <h2>Data Used for Customer Segmentation</h2>

                {/* Table for Features and Meanings */}
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Feature</th>
                        <th>Description Of Feature</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td>BALANCE</td><td>Balance amount left in their account to make purchases</td></tr>
                    <tr><td>BALANCE FREQUENCY</td><td>How frequently the Balance is updated</td></tr>
                    <tr><td>PURCHASES</td><td>Amount of purchases made from the account</td></tr>
                    <tr><td>ONE OFF PURCHASES</td><td>Maximum purchase amount done in one-go</td></tr>
                    <tr><td>INSTALLMENTS PURCHASES</td><td>Amount of purchase done in installment</td></tr>
                    <tr><td>CASH ADVANCE</td><td>Cash in advance given by the user</td></tr>
                    <tr><td>PURCHASES FREQUENCY</td><td>How frequently purchases are being made</td></tr>
                    <tr><td>ONE OFF PURCHASES FREQUENCY</td><td>How frequently Purchases are happening in one-go</td></tr>
                    <tr><td>PURCHASES INSTALLMENTS FREQUENCY</td><td>How frequently purchases in installments are being done</td></tr>
                    <tr><td>CASH ADVANCE FREQUENCY</td><td>How frequently the cash in advance is being paid</td></tr>
                    <tr><td>CASH ADVANCE TRX</td><td>Number of Transactions made with “Cash in Advance”</td></tr>
                    <tr><td>PURCHASES TRX</td><td>Number of purchase transactions made</td></tr>
                    <tr><td>CREDIT LIMIT</td><td>Limit of Credit Card for user</td></tr>
                    <tr><td>PAYMENTS</td><td>Amount of Payment done by the user</td></tr>
                    <tr><td>MINIMUM PAYMENTS</td><td>Minimum amount of payments made by the user</td></tr>
                    <tr><td>PRC FULL PAYMENT</td><td>Percent of full payment paid by the user</td></tr>
                    <tr><td>TENURE</td><td>Tenure of credit card service for user</td></tr>
                    </tbody>
                </table>
            </div>

            {/* Container for the plots/graphs */}
            <div className="plots-container">
                <h2>Visualizations</h2>
                {plots.map((plot, index) => (
                    <div key={index} className="plot-item">
                        <h3>{plot.title}</h3>
                        <img src={plot.src} alt={plot.title} className="plot-image" />
                    </div>
                ))}
            </div>

            {/* Container for the clusters */}
            <div className="clusters-container">
                <h2>Customer Clusters</h2>
                <div className="cluster-buttons">
                    {clusters.map((cluster) => (
                        <button
                            key={cluster.id}
                            className={`cluster-button ${activeCluster === cluster.id ? 'active' : ''}`}
                            onClick={() => handleClusterClick(cluster.id)}
                        >
                            {cluster.name}
                        </button>
                    ))}
                </div>

                {/* Display active cluster details */}
                {activeCluster !== null && (
                    <div className="cluster-details">
                        <h3>{clusters[activeCluster].name}</h3>
                        <div className="cluster-info">
                            <h4>Characteristics:</h4>
                            <ul>
                                {clusters[activeCluster].characteristics.map((char, index) => (
                                    <li key={index}>{char}</li>
                                ))}
                            </ul>
                            <h4>Behavior:</h4>
                            <ul>
                                {clusters[activeCluster].behavior.map((beh, index) => (
                                    <li key={index}>{beh}</li>
                                ))}
                            </ul>
                            <h4>Strategy:</h4>
                            <p>{clusters[activeCluster].strategy}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerSegmentation;