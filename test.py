import requests
import os
from datetime import datetime

def download_db():
    url = "https://sre-ptey.onrender.com/download_db"
    response = requests.get(url)
    
    if response.status_code == 200:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"teashop_{timestamp}.db"
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"Database downloaded as {filename}")
    else:
        print(f"Failed to download database. Status code: {response.status_code}")

if __name__ == "__main__":
    download_db()