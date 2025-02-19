import requests

# Define the API endpoint
url = "http://127.0.0.1:5000/predict"

# Sample input data
data = {
    "campaign": [0.5], "platform": [1.2], "channel": [0.8],
    "creative": [0.7], "template": [1.0], "network": [0.4],
    "keywords": [0.9], "advertiser": [1.1]
}

# Send POST request
response = requests.post(url, json=data)

# Print API response
print("Status Code:", response.status_code)
print("Response JSON:", response.json())
