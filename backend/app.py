from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # This allows all origins. In production, you should specify allowed origins.

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///teashop.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define database models
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    requirements = db.Column(db.Text, nullable=False)
    need_sample = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    new_contact = Contact(
        full_name=data['fullName'],
        email=data['email'],
        phone_number=data['phoneNumber'],
        message=data['message']
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"message": "Contact form submitted successfully"}), 201

@app.route('/api/order', methods=['POST'])
def submit_order():
    data = request.json
    new_order = Order(
        full_name=data['fullName'],
        address=data['address'],
        phone_number=data['phoneNumber'],
        requirements=data['requirements'],
        need_sample=data['needSample']
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order submitted successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)