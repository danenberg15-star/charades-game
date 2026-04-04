import os
import requests
import time
from PIL import Image
from io import BytesIO

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
# עדכן את הנתיב לתיקיית ה-KIDS שלך
OUTPUT_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words\kids\TOCHECK"
IMAGE_STYLE = "photo" 
TARGET_SIZE = (800, 800)
MAX_FILE_SIZE_KB = 50 

# רשימה מורחבת של 400 מילים לרמת KIDS (מחולק לקטגוריות למעקב קל)
kids_extended_list = [
    # חיות (100)
    "Tiger", "Wolf", "Zebra", "Giraffe", "Penguin", "Koala", "Panda", "Kangaroo", "Shark", "Whale", 
    "Dolphin", "Jellyfish", "Octopus", "Seahorse", "Crab", "Lobster", "Bee", "Ant", "Spider", "Butterfly", 
    "Ladybug", "Worm", "Snake", "Turtle", "Frog", "Duck", "Chicken", "Pig", "Cow", "Horse", 
    "Sheep", "Goat", "Camel", "Monkey", "Squirrel", "Bat", "Owl", "Parrot", "Peacock", "Flamingo", 
    "Swan", "Crocodile", "Hippo", "Rhino", "Cheetah", "Hyena", "Fox", "Bear", "Rabbit", "Mouse", 
    "Hamster", "Donkey", "Deer", "Ostrich", "Turkey", "Goose", "Snail", "Caterpillar", "Dragonfly", "Cricket",
    "Goldfish", "Parakeet", "Eagle", "Vulture", "Seagull", "Pelican", "Seal", "Walrus", "Otter", "Beaver",
    "Skunk", "Raccoon", "Porcupine", "Badger", "Chameleon", "Iguana", "Gecko", "Scorpion", "Starfish", "Shrimp",
    "Polar Bear", "Brown Bear", "Buffalo", "Bull", "Calf", "Chick", "Kitten", "Puppy", "Lamb", "Foal",
    "Woodpecker", "Hummingbird", "Crane", "Stork", "Toucan", "Crow", "Pigeon", "Hen", "Rooster", "Peat",

    # מאכלים ושתייה (100)
    "Strawberry", "Watermelon", "Cherry", "Mango", "Peach", "Kiwi", "Pineapple", "Grape", "Pear", "Lemon", 
    "Orange", "Avocado", "Carrot", "Potato", "Broccoli", "Corn", "Tomato", "Cucumber", "Onion", "Garlic", 
    "Mushroom", "Bread", "Cheese", "Egg", "Milk", "Honey", "Pizza", "Burger", "Pasta", "Sandwich", 
    "Cookie", "Cake", "Ice Cream", "Lollipop", "Candy", "Juice", "Soup", "Rice", "Chicken Leg", "Fish",
    "Donut", "Muffin", "Popcorn", "Chocolate", "Pancake", "Waffle", "Jam", "Butter", "Yogurt", "Cereal",
    "Peas", "Pumpkin", "Eggplant", "Pepper", "Lettuce", "Cabbage", "Spinach", "Radish", "Celery", "Asparagus",
    "Coconut", "Papaya", "Plum", "Apricot", "Blueberry", "Raspberry", "Blackberry", "Fig", "Date", "Olive",
    "Walnut", "Almond", "Peanut", "Pretzel", "Pie", "Jelly", "Pudding", "Taco", "Sushi", "Hot Dog",
    "Noodles", "Steak", "Omelet", "Toast", "Bagel", "Croissant", "Tea", "Coffee", "Lemonade", "Milkshake",
    "Water", "Soda", "Smoothie", "Salt", "Sugar", "Flour", "Oil", "Ketchup", "Mustard", "Mayonnaise",

    # חפצים בבית וכלי עבודה (100)
    "Chair", "Table", "Bed", "Pillow", "Blanket", "Lamp", "Window", "Door", "Key", "Clock", 
    "Mirror", "Phone", "TV", "Computer", "Radio", "Guitar", "Piano", "Drum", "Toy", "Book", 
    "Pen", "Pencil", "Eraser", "Scissors", "Hammer", "Saw", "Brush", "Soap", "Towel", "Toothbrush", 
    "Spoon", "Fork", "Knife", "Plate", "Cup", "Pot", "Pan", "Fridge", "Oven", "Sink",
    "Toilet", "Bathtub", "Shower", "Comb", "Backpack", "Wallet", "Glasses", "Watch", "Umbrella", "Fan",
    "Heater", "Candle", "Flashlight", "Batteries", "Bulb", "Remote", "Camera", "Headphones", "Speaker", "Microwave",
    "Teapot", "Tray", "Basket", "Box", "Bag", "Bottle", "Can", "Jar", "Ladder", "Rope",
    "Bucket", "Shovel", "Broom", "Mop", "Vacuum", "Iron", "Washer", "Dryer", "Hanger", "Shelf",
    "Drawer", "Cabinet", "Sofa", "Armchair", "Rug", "Curtain", "Vase", "Picture Frame", "Wall", "Floor",
    "Screwdriver", "Wrench", "Pliers", "Nail", "Screw", "Tape", "Glue", "Paper", "Envelope", "Stamp",

    # חוץ, טבע, בגדים וכלי תחבורה (100)
    "Rainbow", "Star", "Clouds", "Rain", "Snow", "Snowflake", "Fire", "Mountain", "Beach", "Sea", 
    "Island", "River", "Leaf", "Grass", "Acorn", "Rock", "Shell", "Sand", "Volcano", "Desert", 
    "Forest", "Tree", "Flower", "Sun", "Moon", "Earth", "Sky", "Garden", "Park", "Fence",
    "Shirt", "Pants", "Dress", "Skirt", "Jacket", "Coat", "Hat", "Cap", "Socks", "Shoes", 
    "Boots", "Gloves", "Scarf", "Belt", "Suitcase", "Jewelry", "Ring", "Necklace", "Crown", "Mask",
    "Bus", "Truck", "Tractor", "Bike", "Motorcycle", "Boat", "Ship", "Airplane", "Rocket", "Helicopter", 
    "Train", "Submarine", "Ambulance", "Fire Truck", "Police Car", "Taxi", "Van", "Scooter", "Skates", "Sled",
    "Ball", "Kite", "Balloon", "Doll", "Block", "Teddy Bear", "Puzzle", "Chess", "Card", "Dice",
    "Slide", "Swing", "Sandbox", "Pool", "Flag", "Bell", "Anchor", "Compass", "Map", "Telescope",
    "Microscope", "Bridge", "Road", "Tunnel", "House", "Castle", "Tent", "Barn", "Igloo", "Statue"
]

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def download_and_compress(word):
    clean_name = word.lower().replace(" ", "_")
    file_path = os.path.join(OUTPUT_DIR, f"{clean_name}.webp")
    
    if os.path.exists(file_path):
        print(f"⏩ {word} כבר קיים, מדלג.")
        return False

    query = word.replace(" ", "+")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type={IMAGE_STYLE}&safesearch=true&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_res = requests.get(img_url)
            
            img = Image.open(BytesIO(img_res.content))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            img.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            
            quality = 80
            while True:
                img.save(file_path, "WEBP", quality=quality)
                file_size = os.path.getsize(file_path) / 1024 
                
                if file_size <= MAX_FILE_SIZE_KB or quality <= 20:
                    break
                quality -= 10 
            
            print(f"✅ {word} -> {file_size:.1f} KB (Quality: {quality})")
            return True
        else:
            print(f"❌ אין תוצאות עבור {word}")
            return False
    except Exception as e:
        print(f"⚠️ שגיאה במושג {word}: {e}")
        return False

print(f"🚀 מתחיל הורדה של 400 מילים למאגר KIDS...")
success_count = 0

for word in kids_extended_list:
    if download_and_compress(word):
        success_count += 1
    
    # השהיה קלה למניעת חסימה, והפסקה ארוכה יותר כל 90 הורדות
    if success_count > 0 and success_count % 90 == 0:
        print("🕒 ממתין 65 שניות כדי למנוע חסימת API...")
        time.sleep(65)
    else:
        time.sleep(0.6)

print(f"\n🎉 הסתיים! נוספו {success_count} תמונות חדשות לתיקיית KIDS.")