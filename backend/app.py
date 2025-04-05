from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

'''
type ClothingInput = {
  category: Category,
  colour: string,
  size: Size,
  initial_price: number,
  time_since_purchase: number,
  condition: Condition
}
'''


clothing = [
    { 
        "category": "T-Shirt", 
        "colour": "Blue", 
        "size": "M", 
        "initial_price": 55.89,
        "current_price": 48.21,
        "time_since_purchase": 28, 
        "condition": "Excellent" 
    }
]

@app.route('/api', methods=['GET'])
def home():
    return ""

@app.route('/api/model', methods=['GET'])
def model_get():
    return jsonify(clothing)

@app.route('/api/model', methods=['POST'])
def model_post():
    newClothing = request.get_json()

    if not newClothing:
        return jsonify({"error": "No input data provided"}), 400
    
    clothing.append(newClothing)

    return jsonify(clothing)

if __name__ == '__main__':
    app.run(port=5000, debug=True)