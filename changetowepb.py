import os
from PIL import Image

# נתיב בסיס (וודא שזה הנתיב הנכון אצלך)
BASE_DIR = r"C:\Users\danen\Documents\GitHub\ALIAS\family-alias\public\words"
SUB_DIRS = ["kids", "junior"]

def convert_to_webp():
    total_saved = 0
    count = 0

    for sub in SUB_DIRS:
        folder_path = os.path.join(BASE_DIR, sub)
        if not os.path.exists(folder_path): continue
        
        print(f"--- מעבד את תיקיית {sub} ---")
        for filename in os.listdir(folder_path):
            if filename.lower().endswith(".png"):
                file_path = os.path.join(folder_path, filename)
                original_size = os.path.getsize(file_path)
                
                try:
                    with Image.open(file_path) as img:
                        # שינוי גודל ל-800px לכל היותר
                        img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                        
                        # שם הקובץ החדש
                        new_filename = os.path.splitext(filename)[0] + ".webp"
                        new_path = os.path.join(folder_path, new_filename)
                        
                        # שמירה כ-WebP עם כיווץ חזק (איכות 80)
                        img.save(new_path, "WEBP", quality=80)
                        
                        new_size = os.path.getsize(new_path)
                        total_saved += (original_size - new_size)
                        count += 1
                        
                        # מחיקת ה-PNG הישן (חשוב!)
                        os.remove(file_path)
                        print(f"✅ הומר: {filename} -> {new_filename} ({original_size/1024:.0f}KB -> {new_size/1024:.0f}KB)")
                        
                except Exception as e:
                    print(f"❌ שגיאה ב-{filename}: {e}")

    print(f"\n🎉 סיימתי! {count} תמונות הומרו.")
    print(f"📊 חסכנו סך הכל: {total_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    convert_to_webp()