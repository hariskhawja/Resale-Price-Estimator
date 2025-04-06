from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv('../.env')

PORT = os.getenv('PORT')
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

app = Flask(__name__)
CORS(app, origins=["https://resale-price-estimator.vercel.app"])

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
user = ""

@app.route('/api', methods=['GET'])
def home():
    return ""

@app.route('/api/model', methods=['GET'])
def model_get():
    allData = supabase.table("clothing").select("*").execute()
    yourData = supabase.table("clothing").select("*").eq("user", user).execute()

    return([allData.data, yourData.data])

@app.route('/api/model', methods=['POST'])
def model_post():
    newClothing = request.get_json()

    if not newClothing:
        return jsonify({"error": "No input data provided"}), 400
    
    clothingToInsert = {
        "category": newClothing["category"],
        "colour": newClothing["colour"],
        "size": newClothing["size"],
        "initial_price": newClothing["initial_price"],
        "current_price": newClothing["initial_price"]*((1-0.01)**newClothing["age_in_months"]),
        "age_in_months": newClothing["age_in_months"],
        "condition": newClothing["condition"],
        "user": newClothing["user"],
        "brand": newClothing["brand"],
        "rarity": newClothing["rarity"],
        "fit": newClothing["fit"],
        "material": newClothing["material"]
    }

    user = newClothing["user"]

    try:
        response = supabase.table("clothing").insert(clothingToInsert).execute()
    except Exception as e:
        return {"error": str(e)}, 400

    allData = supabase.table("clothing").select("*").execute()
    yourData = supabase.table("clothing").select("*").eq("user", user).execute()

    return([allData.data, yourData.data])

if __name__ == '__main__':
    HOST = "0.0.0.0"
    PORT = int(os.getenv("PORT", 10000))
    app.run(host=HOST, port=PORT, debug=False)