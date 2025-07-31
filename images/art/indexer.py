import os
import json

image_dir = "./"
valid_exts = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic"}

image_files = [
    f for f in os.listdir(image_dir)
    if os.path.splitext(f)[1].lower() in valid_exts
]

# Optionally save this to JSON to load in JS
with open("image-list.json", "w") as f:
    json.dump(image_files, f)