# app.py
from flask import Flask
from routes.recommendation_engine_route.rec import rec_bp  # Import the Blueprint from rec.py
from routes.customer_engagement_route.engagement_pred import engagement_bp
# from routes.absa_route.absa_bp import absa_bp

# Create the Flask app
app = Flask(__name__)

# Register the customer engagement Blueprint
app.register_blueprint(engagement_bp, url_prefix='/engagement')

# Register the recommendation Blueprint with a URL prefix
app.register_blueprint(rec_bp, url_prefix='/recommendation')

# Register the ABSA Blueprint with a URL prefix
# app.register_blueprint(absa_bp, url_prefix='/absa')

print(app.url_map)


# Run the app
if __name__ == '__main__':
    app.run(debug=True)