import requests

API_KEY = "sk-ecnZLy75XzRYpWmUp4dZQUqGJbIWFsDNoyMRgSZTFsxWoEr5"
BASE_URL = "https://api.ai.cc/v1"

res = requests.get(
    f"{BASE_URL}/models",
    headers={"Authorization": f"Bearer {API_KEY}"}
)

if res.status_code == 200:
    models = res.json().get("data", [])
    print(f"Tổng số model: {len(models)}\n")
    # Lọc các model có khả năng tạo ảnh
    image_keywords = ["flux", "dall-e", "sd", "stable", "image", "draw", "paint", "midjourney"]
    image_models = [m for m in models if any(k in m["id"].lower() for k in image_keywords)]
    print("=== MODEL TẠO ẢNH ===")
    for m in image_models:
        print(f"  - {m['id']}")
    print("\n=== TẤT CẢ MODEL ===")
    for m in models:
        print(f"  - {m['id']}")
else:
    print(f"Lỗi: {res.status_code} - {res.text}")
