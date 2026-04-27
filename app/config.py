import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    REDIS_URL = os.getenv("REDIS_URL")
    
    def __init__(self):
        if not self.DATABASE_URL:
            self.DATABASE_URL = "postgresql://user:password@localhost:5432/taskdb"
            self.REDIS_URL = "redis://localhost:6379/0"
            print("??  Warning: .env not found, using hardcoded fallback.")
        else:
            print(f"? Connection strings loaded successfully!")

settings = Settings()
