import os
import requests
import time

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
OUTPUT_DIR = "public/words/junior"

# רשימת המילים המלאה (מקוצרת כאן להמחשה, תשתמש ברשימה המלאה ששלחתי קודם)
words_map = {
    "laptop": "laptop", "keyboard": "keyboard", "mouse": "computer mouse",
    "screen": "monitor", "printer": "printer", "speaker": "audio speaker",
    "camera": "photo camera", "microphone": "microphone", "tablet": "tablet",
    "headphones": "headphones", "charger": "battery charger", "flashlight": "flashlight",
    "fridge": "refrigerator", "freezer": "freezer", "dishwasher": "dishwasher",
    "microwave": "microwave oven", "toaster": "toaster", "kettle": "kettle",
    "fan": "electric fan", "air_conditioner": "air conditioner", "washing_machine": "washing machine",
    "dryer": "clothes dryer", "iron": "clothes iron", "vacuum_cleaner": "vacuum cleaner",
    "drill": "power drill", "screwdriver": "screwdriver", "battery": "battery",
    "light_bulb": "light bulb", "switch": "light switch", "socket": "electric socket",
    "robot": "robot", "backpack": "backpack", "pencil_case": "pencil case",
    "notebook": "notebook", "calculator": "calculator", "ruler": "ruler",
    "sharpener": "pencil sharpener", "eraser": "eraser", "highlighter": "marker pen",
    "scissors": "scissors", "stapler": "stapler", "hole_puncher": "hole punch",
    "glue_stick": "glue stick", "board": "blackboard", "chalk": "chalk",
    "basketball": "basketball", "soccer": "soccer ball", "volleyball": "volleyball",
    "tennis": "tennis racket", "whistle": "whistle", "helmet": "helmet",
    "rollerblades": "roller skates", "skateboard": "skateboard", "scooter": "kick scooter",
    "bicycle": "bicycle", "swimming_pool": "swimming pool", "goggles": "swimming goggles",
    "medal": "medal", "trophy": "trophy", "tent": "tent", "sleeping_bag": "sleeping bag",
    "doctor": "doctor", "nurse": "nurse", "police_officer": "police officer",
    "firefighter": "firefighter", "pilot": "pilot", "astronaut": "astronaut",
    "chef": "chef", "waiter": "waiter", "scientist": "scientist", "vet": "veterinarian",
    "jet": "jet plane", "helicopter": "helicopter", "submarine": "submarine",
    "truck": "truck", "bus": "bus", "taxi": "taxi", "ambulance": "ambulance",
    "fire_truck": "fire engine", "crane": "crane", "tractor": "tractor",
    "desert": "desert", "forest": "forest", "ocean": "ocean", "island": "island",
    "volcano": "volcano", "waterfall": "waterfall", "cave": "cave", "diamond": "diamond",
    "umbrella": "umbrella", "sunglasses": "sunglasses", "suitcase": "suitcase",
    "wallet": "wallet", "compass": "compass", "map": "map", "globe": "globe",
    "telescope": "telescope", "microscope": "microscope", "envelope": "envelope",
    "stamp": "postage stamp", "money": "money", "ladder": "ladder",
    "hammer": "hammer", "nail": "nail", "bridge": "bridge"
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

counter = 0

for en, query in words_map.items():
    file_path = os.path.join(OUTPUT_DIR, f"{en}.png")
    if os.path.exists(file_path):
        continue

    # בדיקת מכסה (כל 90 תמונות מחכים דקה)
    if counter > 0 and counter % 90 == 0:
        print("⏳ הגענו למכסה לדקה. מחכים 60 שניות למניעת חסימה...")
        time.sleep(65)

    print(f"🔎 Downloading ({counter+1}): {en}...")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type=vector&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_data = requests.get(img_url).content
            with open(file_path, 'wb') as f:
                f.write(img_data)
            print(f"✅ Success")
            counter += 1
        else:
            print(f"❌ No results for {en}")
    except Exception as e:
        print(f"⚠️ Error: {e}")
    
    time.sleep(0.5) # השהייה קלה בין בקשות

print("\n🎉 ההורדה הסתיימה בהצלחה!")