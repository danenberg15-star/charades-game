import os
from PIL import Image

# --- הגדרות ---
BASE_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words"
SUB_DIRS = ["kids", "junior"]
SIZE_THRESHOLD_KB = 50  # רף חדש ונמוך יותר לכיווץ מקסימלי
MAX_DIMENSION = 800     # רזולוציה אופטימלית לטלפון
QUALITY = 70            # איכות דחיסה מאוזנת

def optimize_images():
    count = 0
    total_saved = 0
    
    for sub in SUB_DIRS:
        folder_path = os.path.join(BASE_DIR, sub)
        if not os.path.exists(folder_path):
            print(f"⚠️ התיקייה {sub} לא נמצאה, מדלג...")
            continue
            
        print(f"🔎 סורק תמונות בתיקיית: {sub} (רף: {SIZE_THRESHOLD_KB}KB)...")
        
        for filename in os.listdir(folder_path):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(folder_path, filename)
                
                # בדיקת משקל הקובץ הנוכחי
                file_size_kb = os.path.getsize(file_path) / 1024
                
                if file_size_kb > SIZE_THRESHOLD_KB:
                    try:
                        with Image.open(file_path) as img:
                            original_size = file_size_kb
                            
                            # 1. הקטנת מימדים אם צריך
                            if max(img.width, img.height) > MAX_DIMENSION:
                                img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
                            
                            # 2. שמירה עם אופטימיזציה חזקה
                            img_format = img.format if img.format else "PNG"
                            # במידה וזה PNG, נשתמש ב-optimize. במידה וזה JPG, נשתמש ב-quality
                            if img_format == "PNG":
                                img.save(file_path, format="PNG", optimize=True)
                            else:
                                img.save(file_path, format="JPEG", quality=QUALITY, optimize=True)
                            
                            new_size_kb = os.path.getsize(file_path) / 1024
                            saved = original_size - new_size_kb
                            
                            if saved > 0:
                                total_saved += saved
                                count += 1
                                print(f"✅ אופטימיזציה: {filename} ({original_size:.1f}KB -> {new_size_kb:.1f}KB)")
                            
                    except Exception as e:
                        print(f"❌ שגיאה ב- {filename}: {e}")

    print(f"\n🎉 הסתיים! כווצו {count} תמונות נוספות.")
    print(f"📊 סה\"כ נפח שנחסך בסיבוב הזה: {total_saved/1024:.2f} MB")

if __name__ == "__main__":
    optimize_images()