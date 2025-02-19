function submitData() {
    const campaign = document.getElementById("campaign").value;
    const platform = document.getElementById("platform").value;
    const channel = document.getElementById("channel").value;
    const creative = document.getElementById("creative").value;
    const template = document.getElementById("template").value;
    const network = document.getElementById("network").value;
    
    // Convert comma-separated values to arrays
    const keywords = document.getElementById("keywords").value.split(",").map(item => item.trim());
    const advertiser = document.getElementById("advertiser").value.split(",").map(item => item.trim());

    const inputData = {
        campaign: parseFloat(campaign),
        platform: parseFloat(platform),
        channel: parseFloat(channel),
        creative: parseFloat(creative),
        template: parseFloat(template),
        network: parseFloat(network),
        keywords: keywords.map(k => parseFloat(k)),  // Convert to numbers if needed
        advertiser: advertiser.map(a => parseFloat(a)) // Convert to numbers if needed
    };

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerText = "Prediction: " + JSON.stringify(data.prediction);
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("result").innerText = "Error: Unable to fetch prediction";
    });
}
