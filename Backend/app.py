# app.py
from flask import Flask
from routes.recommendation_engine_route.rec import rec_bp  # Import the Blueprint from rec.py

# Create the Flask app
app = Flask(__name__)

# Register the recommendation Blueprint with a URL prefix
app.register_blueprint(rec_bp, url_prefix='/recommendation')

# Run the app
if __name__ == '__main__':
    app.run(debug=True)