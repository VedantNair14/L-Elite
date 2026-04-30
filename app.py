from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Mock Data for Menu
MENU_DATA = {
    "starters": [
        {"id": 1, "name": "Truffle Arancini", "price": 18, "description": "Wild mushroom, black truffle, parmesan emulsion", "img": "arancini.jpg"},
        {"id": 2, "name": "Burrata & Heirloom", "price": 22, "description": "Creamy burrata, balsamic pearls, basil oil", "img": "burrata.jpg"},
        {"id": 3, "name": "Beef Tartare", "price": 28, "description": "Hand-cut wagyu, quail egg, caper emulsion", "img": "tartare.png"}
    ],
    "mains": [
        {"id": 4, "name": "Wagyu Ribeye", "price": 65, "description": "Grade A5 Wagyu, roasted bone marrow, red wine jus", "img": "wagyu.png"},
        {"id": 5, "name": "Lobster Thermidor", "price": 58, "description": "Atlantic lobster, brandy cream, gruyère crust", "img": "lobster.png"},
        {"id": 6, "name": "Truffle Tagliatelle", "price": 45, "description": "Handmade pasta, seasonal black truffle, parmigiano", "img": "pasta.png"}
    ],
    "desserts": [
        {"id": 7, "name": "Gold Leaf Fondant", "price": 16, "description": "Dark chocolate, edible gold, vanilla bean gelato", "img": "fondant.png"},
        {"id": 8, "name": "Saffron Panna Cotta", "price": 14, "description": "Infused saffron, honey glaze, toasted pistachios", "img": "fondant.png"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html', menu=MENU_DATA)

@app.route('/reserve', methods=['POST'])
def reserve():
    data = request.form
    print(f"New Reservation: {data}")
    return jsonify({"status": "success", "message": "Table reserved successfully!"})

@app.route('/order', methods=['POST'])
def order():
    data = request.json
    # In a real app, integrate payment and save to DB
    print(f"New Order Received: {data}")
    return jsonify({
        "status": "success", 
        "message": "Order placed successfully! Free home delivery is on its way.",
        "order_id": "ELITE-" + data.get('phone', '0000')[-4:]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
