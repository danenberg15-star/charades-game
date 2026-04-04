import os
import requests
import time
from PIL import Image
from io import BytesIO

# --- הגדרות ---
API_KEY = '55198187-ed108d21348c5cd70a52ac7cc' 
OUTPUT_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words\junior\TO CHECK"
TARGET_SIZE = (800, 800)
MAX_FILE_SIZE_KB = 50 

# מילון קטגוריות: (שם בעברית, שם באנגלית לחיפוש)
words_to_download = {
    "superheroes": [
        ("ספיידרמן", "Spiderman"), ("באטמן", "Batman"), ("סופרמן", "Superman"), 
        ("וונדר וומן", "Wonder Woman"), ("הענק הירוק", "Hulk"), ("איירון מן", "Iron Man"), 
        ("קפטן אמריקה", "Captain America"), ("תור", "Thor"), ("הפנתר הוורוד", "Pink Panther")
    ],
    "furniture": [
        ("מיטה", "Bed"), ("ארון בגדים", "Wardrobe"), ("שולחן כתיבה", "Desk"), ("כיסא מסתובב", "Swivel Chair"),
        ("ספה", "Sofa"), ("כורסה", "Armchair"), ("שידת לילה", "Nightstand"), ("מזנון", "Sideboard"),
        ("מראה", "Mirror"), ("פוף", "Bean Bag"), ("ספסל", "Bench"), ("וילון", "Curtain"),
        ("ספרייה", "Bookshelf"), ("שולחן אוכל", "Dining Table"), ("כיסא נדנדה", "Rocking Chair"),
        ("שרפרף", "Stool"), ("ארון נעליים", "Shoe Cabinet"), ("שידת מגירות", "Chest of Drawers"),
        ("שולחן קפה", "Coffee Table"), ("כוננית", "Bookcase"), ("מיטת קומותיים", "Bunk Bed"),
        ("לול", "Playpen"), ("עריסה", "Crib"), ("שולחן איפור", "Dressing Table"), ("הדום", "Ottoman"),
        ("כרית נוי", "Throw Pillow"), ("ארון מטבח", "Kitchen Cabinet"), ("אי במטבח", "Kitchen Island"),
        ("שולחן עבודה", "Workbench"), ("ארון תרופות", "Medicine Cabinet"), ("מעמד לטלוויזיה", "TV Stand"),
        ("כיסא בר", "Bar Stool"), ("מזרון", "Mattress"), ("בסיס למיטה", "Bed Frame"),
        ("ראש מיטה", "Headboard"), ("שולחן פיקניק", "Picnic Table"), ("ארונית", "Cabinet"),
        ("ויטרינה", "Display Cabinet"), ("ארון תצוגה", "Showcase"), ("שולחן צד", "Side Table"),
        ("מנורת שולחן", "Table Lamp"), ("אח", "Fireplace"), ("קרש גיהוץ", "Ironing Board"),
        ("סולם", "Ladder"), ("מתלה מעילים", "Coat Rack"), ("סל כביסה", "Laundry Basket"),
        ("ארון שירות", "Utility Cabinet"), ("מחיצה", "Partition"), ("כוורת מדפים", "Cube Shelves"),
        ("כיסא גן", "Garden Chair"), ("שמשייה", "Parasol"), ("ערסל", "Hammock"),
        ("שולחן מתקפל", "Folding Table"), ("שולחן ציור", "Drawing Table"), ("שולחן משחקים", "Game Table"),
        ("מיטה מתקפלת", "Folding Bed"), ("מזרון מתנפח", "Inflatable Mattress"), ("שולחן מחשב", "Computer Desk"),
        ("כוננית נעליים", "Shoe Rack"), ("ארגז מצעים", "Bedding Box"), ("מעמד לעציצים", "Plant Stand"),
        ("פנס רחוב", "Street Lamp"), ("ספסל גינה", "Garden Bench"), ("מסדרון", "Corridor"), ("ארון קיר", "Built-in Closet")
    ],
    "jewelry": [
        ("שרשרת", "Necklace"), ("צמיד", "Bracelet"), ("עגילים", "Earrings"), ("שעון יד", "Wristwatch"),
        ("סיכה לבגד", "Brooch"), ("כתר", "Crown"), ("יהלום", "Diamond"), ("זהב", "Gold Bar"),
        ("כסף", "Silver Bar"), ("פנינה", "Pearl"), ("שרשרת פנינים", "Pearl Necklace"), 
        ("צמיד לרגל", "Anklet"), ("עגילי חישוק", "Hoop Earrings"), ("טבעת יהלום", "Diamond Ring"),
        ("תליון", "Pendant"), ("קמע", "Amulet"), ("צמיד חרוזים", "Beaded Bracelet"), ("נזם", "Nose Ring"),
        ("שרשרת זהב", "Gold Necklace"), ("צמיד כסף", "Silver Bracelet"), ("קריסטל", "Crystal"),
        ("חרוזים", "Beads"), ("תכשיט", "Jewelry"), ("קופסת תכשיטים", "Jewelry Box"),
        ("צמיד גומי", "Rubber Bracelet"), ("שעון חכם", "Smartwatch"), ("משקפי שמש", "Sunglasses"),
        ("מטפחת", "Kerchief"), ("עניבה", "Necktie"), ("סיכת ראש", "Hairpin"), ("קשת לשיער", "Hairband"),
        ("גומייה", "Hair Rubber Band"), ("קליפס", "Hair Clip"), ("מניפה", "Hand Fan"), ("כפתור", "Button")
    ],
    "clothes": [
        ("חולצה", "Shirt"), ("מכנסיים", "Pants"), ("שמלה", "Dress"), ("חצאית", "Skirt"),
        ("גרביים", "Socks"), ("נעליים", "Shoes"), ("מעיל", "Coat"), ("סוודר", "Sweater"),
        ("צעיף", "Scarf"), ("כובע", "Hat"), ("כפפות", "Gloves"), ("בגד ים", "Swimsuit"),
        ("פיג'מה", "Pyjamas"), ("חגורה", "Belt"), ("נעלי ספורט", "Sneakers"), ("מגפיים", "Boots"),
        ("סנדלים", "Sandals"), ("כפכפים", "Flip-flops"), ("חולצת טי", "T-shirt"), ("ג'ינס", "Jeans"),
        ("דגמ\"ח", "Cargo Pants"), ("גופייה", "Tank Top"), ("ז'קט", "Jacket"), ("חליפה", "Suit"),
        ("וסט", "Vest"), ("חלוק רחצה", "Bathrobe"), ("בגד גוף", "Bodysuit"), ("חותלות", "Leg Warmers"),
        ("שלייקס", "Suspenders"), ("כובע צמר", "Beanie"), ("כובע מצחייה", "Baseball Cap"),
        ("כובע טמבל", "Bucket Hat"), ("כובע גרב", "Ski Mask"), ("כפפות איגרוף", "Boxing Gloves"),
        ("כפפות צמר", "Woolen Gloves"), ("גרביונים", "Tights"), ("בגדי ריקוד", "Dancewear"),
        ("טוניקה", "Tunica"), ("סרבל", "Overalls"), ("אוברול", "Jumpsuit"), ("חולצה מכופתרת", "Button-down Shirt"),
        ("חולצת פולו", "Polo Shirt"), ("קפוצ'ון", "Hoodie"), ("סווטשירט", "Sweatshirt"),
        ("מכנסיים קצרים", "Shorts"), ("טייץ", "Leggings"), ("חולצת בטן", "Crop Top"), ("גלימה", "Cape"),
        ("מדים", "Uniform"), ("מדי בית ספר", "School Uniform"), ("בגדי עבודה", "Work Clothes"),
        ("סינר", "Apron"), ("נעלי בית", "Slippers"), ("נעלי עקב", "High Heels"), ("נעלי בובה", "Ballet Flats"),
        ("נעלי פקקים", "Soccer Cleats"), ("נעלי טיפוס", "Climbing Shoes"), ("נעלי הרים", "Hiking Boots"),
        ("נעלי לק", "Patent Leather Shoes"), ("מגפי גומי", "Rubber Boots"), ("סנדלי שורש", "Hiking Sandals"),
        ("כפכפי אצבע", "Thong Sandals"), ("בגדי צלילה", "Wetsuit"), ("חליפת חלל", "Spacesuit"),
        ("בגד ג'ודו", "Judo Gi"), ("חלוק רופאים", "Lab Coat"), ("חולצת משבצות", "Plaid Shirt"),
        ("חולצת פסים", "Striped Shirt"), ("חולצה חלקה", "Plain Shirt"), ("חצאית מיני", "Mini Skirt"),
        ("חצאית מקסי", "Maxi Skirt"), ("בגדי ספורט", "Sportswear"), ("גופיית סל", "Basketball Jersey"),
        ("גרבי כדורגל", "Soccer Socks"), ("כפפות שוער", "Goalkeeper Gloves"), ("שרוכים", "Shoelaces"),
        ("רוכסן", "Zipper"), ("כיס", "Pocket")
    ],
    "playground": [
        ("מגלשה", "Slide"), ("נדנדה", "Swing"), ("קרוסלה", "Carousel"), ("ארגז חול", "Sandbox"),
        ("מתקן טיפוס", "Climbing Frame"), ("ברזייה", "Drinking Fountain"), ("חבל", "Rope"),
        ("נדנדת עלה ורד", "Seesaw"), ("מגלשה לוליינית", "Spiral Slide"), ("נדנדת צמיג", "Tire Swing"),
        ("סולמות", "Ladders"), ("קיר טיפוס", "Climbing Wall"), ("רשת טיפוס", "Climbing Net"),
        ("גשר חבלים", "Rope Bridge"), ("מנהרה", "Tunnel"), ("טרמפולינה", "Trampoline"),
        ("אומגה", "Zipline"), ("דשא", "Grass"), ("דשא סינטטי", "Artificial Grass"),
        ("שביל אופניים", "Bike Path"), ("פח אשפה", "Trash Can"), ("מגרש כדורסל", "Basketball Court"),
        ("מגרש כדורגל", "Soccer Field"), ("שער", "Soccer Goal"), ("סל", "Basketball Hoop"),
        ("גדר", "Fence"), ("שער כניסה", "Entrance Gate"), ("צלון", "Shade Structure"),
        ("מתקן כושר", "Fitness Equipment"), ("מקבילים", "Parallel Bars"), ("מתח", "Pull-up Bar"),
        ("טבעות", "Gymnastic Rings"), ("סולם קופים", "Monkey Bars"), ("גבעה", "Hill"),
        ("מגלשת צינור", "Tube Slide"), ("מזרקת מים", "Water Fountain"), ("דלי וכף", "Bucket and Spade"),
        ("משאית צעצוע", "Toy Truck"), ("כדור", "Ball"), ("פריזבי", "Frisbee"),
        ("גלגיליות", "Rollerblades"), ("קורקינט", "Scooter"), ("אופניים", "Bicycle"),
        ("קסדה", "Helmet"), ("מגיני ברכיים", "Knee Pads"), ("פיקניק", "Picnic"),
        ("סל פיקניק", "Picnic Basket"), ("מחצלת", "Mat"), ("גיר", "Chalk")
    ],
    "school": [
        ("עיפרון", "Pencil"), ("מחק", "Eraser"), ("מחברת", "Notebook"), ("ספר לימוד", "Textbook"),
        ("ילקוט", "Schoolbag"), ("מורה", "Teacher"), ("לוח", "Blackboard"), ("טוש", "Marker"),
        ("סרגל", "Ruler"), ("מחדד", "Sharpener"), ("דבק", "Glue"), ("מספריים", "Scissors"),
        ("קלמר", "Pencil Case"), ("מבחן", "Exam"), ("שיעורי בית", "Homework"), ("הפסקה", "Recess"),
        ("צלצול", "School Bell"), ("כיתה", "Classroom"), ("מנהל", "Principal"), ("מזכירה", "Secretary"),
        ("אב בית", "Janitor"), ("חדר מורים", "Teachers' Lounge"), ("חדר מחשבים", "Computer Lab"),
        ("ספרייה", "Library"), ("אולם ספורט", "Gym"), ("מעבדה", "Science Lab"), ("לוקר", "Locker"),
        ("שולחן תלמיד", "Student Desk"), ("כיסא", "Chair"), ("לוח שנה", "Calendar"),
        ("לוח מודעות", "Bulletin Board"), ("פח", "Trash Can"), ("דף עבודה", "Worksheet"),
        ("קלסר", "Binder"), ("שמרדף", "Sheet Protector"), ("נייר צילום", "Copy Paper"),
        ("מדפסת", "Printer"), ("מחשבון", "Calculator"), ("גלובוס", "Globe"), ("מפה", "Map"),
        ("אטלס", "Atlas"), ("מיקרוסקופ", "Microscope"), ("צבעי מים", "Watercolors"),
        ("מכחול", "Paintbrush"), ("בלוק ציור", "Drawing Pad"), ("פלסטלינה", "Plasticine"),
        ("לוח גיר", "Chalkboard"), ("גיר", "Chalk"), ("ספוג ללוח", "Board Eraser"), ("יומן", "Diary"),
        ("תעודה", "Certificate"), ("מדליה", "Medal"), ("גביע", "Trophy"), ("טקס", "Ceremony"),
        ("הצגה", "Play Performance"), ("טיול שנתי", "School Trip"), ("אוטובוס", "School Bus"),
        ("מאבטח", "Security Guard"), ("שער בית הספר", "School Gate"), ("חצר", "School Yard"),
        ("תורנות", "Duty"), ("קפיטריה", "Cafeteria"), ("כריך", "Sandwich"), ("בקבוק מים", "Water Bottle"),
        ("קופסת אוכל", "Lunchbox"), ("ציור", "Drawing"), ("פיסול", "Sculpture"), ("מוזיקה", "Music"),
        ("שיעור ספורט", "PE Lesson"), ("ריצה", "Running"), ("קפיצה לרוחק", "Long Jump"),
        ("כדורעף", "Volleyball"), ("מחניים", "Dodgeball"), ("חולצת בית ספר", "School Shirt"),
        ("סמל בית ספר", "School Emblem"), ("ספר ספרייה", "Library Book"), ("כרטיס קורא", "Library Card"),
        ("שעת סיפור", "Story Time"), ("מדעים", "Science"), ("חשבון", "Math"), ("אנגלית", "English"),
        ("עברית", "Hebrew"), ("היסטוריה", "History"), ("גאוגרפיה", "Geography"), ("תנ\"ך", "Bible"),
        ("מולדת", "Homeland"), ("אמנות", "Art")
    ],
    "professions": [
        ("רופא", "Doctor"), ("אחות", "Nurse"), ("שוטר", "Police Officer"), ("טייס", "Pilot"),
        ("טבח", "Chef"), ("בנאי", "Construction Worker"), ("חקלאי", "Farmer"), ("נהג", "Driver"),
        ("מדען", "Scientist"), ("דייג", "Fisherman"), ("מוזיקאי", "Musician"), ("ספר", "Barber"),
        ("קצב", "Butcher"), ("אופה", "Baker"), ("נגר", "Carpenter"), ("חשמלאי", "Electrician"),
        ("אינסטלטור", "Plumber"), ("פסנתרן", "Pianist"), ("כדורגלן", "Soccer Player"),
        ("כדורסלן", "Basketball Player"), ("אתלט", "Athlete"), ("מציל", "Lifeguard"),
        ("מדריך", "Instructor"), ("שופט", "Judge"), ("עורך דין", "Lawyer"), ("מהנדס", "Engineer"),
        ("אדריכל", "Architect"), ("עיתונאי", "Journalist"), ("סופר", "Author"), ("משורר", "Poet"),
        ("בלש", "Detective"), ("קוסם", "Magician"), ("ליצן", "Clown"), ("מלצר", "Waiter"),
        ("שליח", "Courier"), ("מוכר", "Salesperson"), ("קופאי", "Cashier"), ("פקיד", "Clerk"),
        ("בנקאי", "Banker"), ("תוכניתן", "Programmer"), ("גרפיקאי", "Graphic Designer"),
        ("מעצב", "Designer"), ("דוגמן", "Model"), ("מעצב אופנה", "Fashion Designer"),
        ("תופר", "Tailor"), ("סבל", "Porter"), ("שומר", "Security Guard"), ("חייל", "Soldier"),
        ("קצין", "Officer"), ("מלח", "Sailor"), ("קפטן", "Captain"), ("צוללן", "Diver"),
        ("חוקר", "Researcher"), ("ארכיאולוג", "Archeologist"), ("אסטרונום", "Astronomer"),
        ("פסיכולוג", "Psychologist"), ("כימאי", "Chemist"), ("פיזיקאי", "Physicist"),
        ("מתמטיקאי", "Mathematician"), ("פילוסוף", "Philosopher"), ("פוליטיקאי", "Politician"),
        ("ראש ממשלה", "Prime Minister"), ("נשיא", "President"), ("שר", "Minister"),
        ("דוור", "Mailman"), ("מנקה", "Cleaner"), ("גנן", "Gardener"), ("חוטב עצים", "Lumberjack"),
        ("צבע", "House Painter"), ("רצף", "Tiler"), ("מכונאי", "Mechanic"),
        ("חשמלאי רכב", "Auto Electrician"), ("נהג אוטובוס", "Bus Driver"), ("נהג מונית", "Taxi Driver"),
        ("טייס משנה", "Co-pilot"), ("דייל", "Flight Attendant"), ("פקח טיסה", "Air Traffic Controller"),
        ("קברניט", "Captain Ship"), ("כומר", "Priest"), ("רב", "Rabbi"), ("מואזין", "Muezzin"),
        ("נזיר", "Monk"), ("מאמן ספורט", "Sports Coach"), ("יועץ", "Consultant"),
        ("ספרן", "Librarian"), ("ארכיונאי", "Archivist"), ("אוצר מוזיאון", "Museum Curator"),
        ("מדריך טיולים", "Tour Guide"), ("וטרינר חיות מחמד", "Pet Vet"), ("וטרינר חיות בר", "Wildlife Vet"),
        ("זואולוג", "Zoologist"), ("בוטנאי", "Botanist"), ("מטאורולוג", "Meteorologist"),
        ("שדרן רדיו", "Radio Broadcaster"), ("מגיש טלוויזיה", "TV Host"), ("עורך", "Editor"),
        ("מפיק", "Producer"), ("במאי", "Director"), ("תסריטאי", "Screenwriter"),
        ("פעלולן", "Stuntman"), ("מאפר", "Makeup Artist"), ("ספר מעצב שיער", "Hair Stylist")
    ]
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def download_and_compress(heb_word, eng_word, category):
    # לגיבורי על נאפשר גם איורים, לאחרים רק תמונות
    img_type = "all" if category == "superheroes" else "photo"
    query = eng_word.replace(" ", "+")
    url = f"https://pixabay.com/api/?key={API_KEY}&q={query}&image_type={img_type}&safesearch=true&per_page=3"
    
    try:
        res = requests.get(url).json()
        if res.get('hits'):
            img_url = res['hits'][0]['webformatURL']
            img_res = requests.get(img_url)
            
            img = Image.open(BytesIO(img_res.content))
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            img.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
            
            # שמירה עם השם בעברית (לפי הפורמט של המשחק)
            file_name = heb_word.replace(" ", "_") + ".webp"
            file_path = os.path.join(OUTPUT_DIR, file_name)
            
            quality = 80
            while True:
                img.save(file_path, "WEBP", quality=quality)
                file_size = os.path.getsize(file_path) / 1024
                if file_size <= MAX_FILE_SIZE_KB or quality <= 20:
                    break
                quality -= 10
            
            print(f"✅ {heb_word} ({eng_word}) -> {file_size:.1f} KB")
            return True
        else:
            print(f"❌ No results for {eng_word}")
            return False
    except Exception as e:
        print(f"⚠️ Error with {eng_word}: {e}")
        return False

# הרצה על כל הקטגוריות
total_count = sum(len(lst) for lst in words_to_download.values())
print(f"🚀 Starting download of {total_count} words across categories...")
counter = 0

for category, word_list in words_to_download.items():
    print(f"\n📂 Processing Category: {category.upper()}")
    for heb, eng in word_list:
        success = download_and_compress(heb, eng, category)
        if success:
            counter += 1
        
        if counter > 0 and counter % 90 == 0:
            print("🕒 Waiting to avoid rate limit...")
            time.sleep(65)
        else:
            time.sleep(0.4)

print(f"\n🎉 Done! Downloaded {counter} images to TO CHECK.")