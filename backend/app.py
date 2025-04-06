from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
from supabase import create_client, Client
from depreciation import depreciator
from openai import OpenAI

load_dotenv('../.env')

PORT = os.getenv('PORT')
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API_KEY)

app = Flask(__name__)
CORS(app, origins=["https://resale-price-estimator.vercel.app"])
# CORS(app, origins=["http://localhost:3000", "localhost:3000"])

client = OpenAI(
    api_key=os.environ.get('OPENAI_API_KEY')
)

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
        "current_price": depreciator(newClothing["initial_price"], newClothing["brand"], newClothing["category"], newClothing["condition"], newClothing["material"], newClothing["rarity"], newClothing["age_in_months"]),
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

    gptResponse = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Given the following properties of an article of clothing, give a sentence describing APPROXIMATELY how much YOU would think you could resell it for. Give another sentence"
            "explaining your reasoning (does not need to be accurate). Then one sentence to express your own opinion on the estimated current market price calculated. Even though this is your opinion, personal pronouns like 'I' and 'my' are completely unacceptable and forbidden."},
            {"role": "user", "content": f"Category: {clothingToInsert["category"]}, Colour: {clothingToInsert["colour"]}, Size: {clothingToInsert["size"]}, Age in Months: {clothingToInsert["age_in_months"]}, Condition: {clothingToInsert["condition"]}, Brand: {clothingToInsert["brand"]}, Rarity: {clothingToInsert["rarity"]}, Fit: {clothingToInsert["fit"]}, Material: {clothingToInsert["material"]}, Initial Price: {clothingToInsert["initial_price"]}, Estimated Current Market Price: {clothingToInsert["current_price"]}"}
        ]
    )

    return([allData.data, yourData.data, gptResponse.choices[0].message.content])

if __name__ == '__main__':
    # Prod
    HOST = "0.0.0.0"
    PORT = int(os.getenv("PORT", 10000))
    app.run(host=HOST, port=PORT, debug=False)

    # Local
    # app.run(port=PORT, debug=True)