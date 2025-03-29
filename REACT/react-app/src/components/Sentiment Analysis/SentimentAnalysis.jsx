
import React, { useState } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./SentimentAnalysis.module.css";
import Papa from "papaparse";

ChartJS.register(ArcElement, Tooltip, Legend);

const PREDEFINED_ASPECTS = [
  "price", "service", "quality", "delivery", "usability",
  "item", "product", "performance", "support", "refunds",
  "food", "speed", "packaging", "customer service", "value"
];

export default function ABSAUploader() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("fast");
  const [controller, setController] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    const abortController = new AbortController();
    setController(abortController);  

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      const response = await axios.post("http://127.0.0.1:5000/absa/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      });

      const results = response.data.results || [];
      const resultMap = {};

      results.forEach(({ aspect, positive, negative }) => {
        for (const target of PREDEFINED_ASPECTS) {
          if (aspect.toLowerCase().includes(target.toLowerCase())) {
            if (!resultMap[target]) {
              resultMap[target] = { positive: 0, negative: 0, count: 0 };
            }
            resultMap[target].positive += positive;
            resultMap[target].negative += negative;
            resultMap[target].count += 1;
            break;
          }
        }
      });

      const averaged = {};
      Object.entries(resultMap).forEach(([key, val]) => {
        averaged[key] = {
          positive: (val.positive / val.count).toFixed(2),
          negative: (val.negative / val.count).toFixed(2)
        };
      });

      setData(averaged);
    } catch (err) {
      if (axios.isCancel(err)) {
        setError("Upload canceled by user.");
      } else {
        console.error("Upload error:", err);
        const friendlyMessage =
          err.response?.data?.error ||
          (err.message?.includes("Network") ? "Server is not reachable. Please try again later." : null) ||
          "Something went wrong. Please check your file and try again.";
        setError(friendlyMessage);
      }
    } finally {
      setLoading(false);
      setProgress(0);
      setController(null);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    const csvHeader = "Aspect,Positive (%),Negative (%)\n";
    const csvRows = Object.entries(data)
      .map(([aspect, scores]) => `${aspect},${scores.positive},${scores.negative}`)
      .join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sentiment_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sentimentCounts = data
    ? Object.values(data).reduce(
        (acc, val) => {
          acc.positive += parseFloat(val.positive);
          acc.negative += parseFloat(val.negative);
          return acc;
        },
        { positive: 0, negative: 0 }
      )
    : { positive: 0, negative: 0 };

  const chartData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [sentimentCounts.positive, sentimentCounts.negative],
        backgroundColor: ["#36A2EB", "#FF6384"]
      }
    ]
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.gradientTitle}>Aspect-Based Sentiment Analysis</h1>
  
      <div className={styles.descriptionBox}>
        <h3>What Does This Component Do?</h3>
        <p>
          This module performs <strong>Aspect-Based Sentiment Analysis (ABSA)</strong> on customer reviews.
          It automatically identifies key aspects like <em>price</em>, <em>delivery</em>, or <em>support</em> and analyzes how positively or negatively customers feel about each one.
          Upload your CSV file with customer reviews and gain valuable insights into what matters most to your audience.
        </p>
      </div>
  
      <div className={styles.controls}>
        <select className={styles.selectBox} value={mode} onChange={handleModeChange}>
          <option value="fast">Fast (VADER)</option>
          <option value="model">Accurate (Model)</option>
        </select>
  
        <div className={styles.uploadSection}>
          <div className={styles.fileRow}>
            <input type="file" accept=".csv" onChange={handleFileChange} />

            <div className={styles.tooltipWrapper}>
              <span className={styles.infoIcon}>ℹ️</span>
              <div className={styles.tooltipText}>
              • Only `.csv` files supported.<br />
              • Must contain a <b>'review'</b> column.<br />
              • Other columns will be ignored.<br />
              • Recommended: under 500 rows.<br />
              • Reviews should be in English.
              </div>
            </div>
          </div>

          <button onClick={handleUpload} disabled={loading} className={styles.uploadBtn}>
            {loading ? "Processing..." : "Upload"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          {loading && (
            <>
              <div className={styles.progressWrapper}>
                <CircularProgressbar value={progress} text={`${progress}%`} />
              </div>
              <button className={styles.cancelButton} onClick={() => controller?.abort()}>Cancel</button>
            </>
          )}
        </div>
      </div>
  
      {data && (
        <div className={styles.resultsWrapper}>
        <div className={styles.resultsContainer}>
          <h3 className={styles.resultsTitle}>Analysis Results</h3>
          <table className={styles.resultTable}>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Positive (%)</th>
                <th>Negative (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data).map(([aspect, scores]) => (
                <tr key={aspect}>
                  <td>{aspect}</td>
                  <td>{scores.positive}</td>
                  <td>{scores.negative}</td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <div className={styles.pieChartContainer}>
            <h3>Sentiment Distribution</h3>
            <Pie data={chartData} />
          </div>
  
          <button className={styles.downloadButton} onClick={handleDownload}>Download Results</button>
        </div>
        </div>
      )}
    </div>
  );


}
