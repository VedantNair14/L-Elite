from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Mock Data for Menu
MENU_DATA = {
    "starters": [
        {"name": "Truffle Arancini", "price": "$18", "description": "Wild mushroom, black truffle, parmesan emulsion", "img": "arancini.jpg"},
        {"name": "Burrata & Heirloom", "price": "$22", "description": "Creamy burrata, balsamic pearls, basil oil", "img": "burrata.jpg"}
    ],
    "mains": [
        {"name": "Wagyu Ribeye", "price": "$65", "description": "Grade A5 Wagyu, roasted bone marrow, red wine jus", "img": "wagyu.jpg"},
        {"name": "Pan Seared Scallops", "price": "$42", "description": "Cauliflower puree, crispy pancetta, lemon zest", "img": "scallops.jpg"}
    ],
    "desserts": [
        {"name": "Gold Leaf Fondant", "price": "$16", "description": "Dark chocolate, edible gold, vanilla bean gelato", "img": "fondant.jpg"},
        {"name": "Saffron Panna Cotta", "price": "$14", "description": "Infused saffron, honey glaze, toasted pistachios", "img": "pannacotta.html"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html', menu=MENU_DATA)

@app.route('/reserve', methods=['POST'])
def reserve():
    data = request.form
    # In a real app, save to DB or send email
    print(f"New Reservation: {data}")
    return jsonify({"status": "success", "message": "Table reserved successfully!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
