import openai
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

load_dotenv()  # Charger les variables d'environnement depuis le fichier .env

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)


def get_colors(prompt):
    full_prompt = f"""
    You are a color palette generating assistant. Generate color palettes that fit the theme, mood, or instructions in the prompt.
    The palettes should be between 2 and 8 colors in JSON array format (e.g., ["#FFFFFF", "#000000"]).

    Q: Convert the following verbal description of a color palette into a list of colors: The Mediterranean Sea
    A: ["#006699", "#66CCCC", "#F0E68C", "#008000", "#F08080"]

    Q: Convert the following verbal description of a color palette into a list of colors: sage, nature, earth
    A: ["#EDF1D6", "#9DC08B", "#609966", "#40513B"]

    Q: Convert the following verbal description of a color palette into a list of colors: {prompt}
    A:
    """
    try:
        # Log du prompt complet envoyé à l'API
        print("Full Prompt Sent to API:\n", full_prompt)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates color palettes."},
                {"role": "user", "content": full_prompt}
            ],
            max_tokens=1000,
            temperature=0.5
        )
        response_text = response['choices'][0]['message']['content'].strip()
        # Log de la réponse brute de l'API
        print("API Response Text:", response_text)
        colors = json.loads(response_text)
        print("Parsed Colors:", colors)  # Log des couleurs parsées
        return colors
    except json.JSONDecodeError:
        print("Error decoding JSON from API response")
        return []
    except Exception as e:
        print(f"Erreur lors de l'appel à l'API OpenAI: {e}")
        return []


@app.route("/palette", methods=["POST"])
def prompt_to_palette():
    query = request.form.get("query")
    colors = get_colors(query)
    print("Query:", query)
    print("Colors:", colors)
    return jsonify({"colors": colors})


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
