from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import base64

from whisper_service import whisper_engine
from dedup_service import dedup_engine
from opencv_service import opencv_filter

app = FastAPI(
    title="Jharkhand JanSamadhan - AI & NLP Service",
    description="Python AI Backend incorporating OpenAI Whisper (Voice-to-Text), Sentence-Transformers (Deduplication), and OpenCV (Spam & Quality Filtering)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Transfer Models ---
class TranscribeRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "hi"

class ExistingChallengeItem(BaseModel):
    id: str
    title: str
    description: str
    district: Optional[str] = ""
    category: Optional[str] = ""

class DeduplicateRequest(BaseModel):
    title: str
    description: str
    existing_items: List[ExistingChallengeItem]
    threshold: Optional[float] = 0.65

class ImageFilterRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None

# --- Endpoints ---
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Jharkhand JanSamadhan AI & NLP Engine",
        "modules": {
            "whisper": "Active (OpenAI Whisper Voice-to-Text)",
            "sentence_transformers": "Active (Semantic Text Deduplication)",
            "opencv": "Active (Image Quality & Anti-Spam Filtering)"
        }
    }

@app.post("/transcribe")
def transcribe_audio(payload: TranscribeRequest):
    """
    OpenAI Whisper Voice-to-Text API
    """
    if not payload.audio_base64:
        raise HTTPException(status_code=400, detail="audio_base64 is required")
    
    result = whisper_engine.transcribe_base64(payload.audio_base64, payload.language)
    return result

@app.post("/deduplicate")
def check_deduplication(payload: DeduplicateRequest):
    """
    Sentence-Transformers Semantic Vector Deduplication API
    """
    items = [item.dict() for item in payload.existing_items]
    result = dedup_engine.check_duplicates(
        new_title=payload.title,
        new_desc=payload.description,
        existing_items=items,
        threshold=payload.threshold or 0.65
    )
    return result

@app.post("/filter-image")
def inspect_image(payload: ImageFilterRequest):
    """
    OpenCV Computer Vision Quality & Spam Audit API
    """
    if payload.image_base64:
        # Decode base64
        data = payload.image_base64
        if "," in data:
            data = data.split(",")[1]
        img_bytes = base64.b64decode(data)
        return opencv_filter.inspect_image_bytes(img_bytes)
    elif payload.image_url:
        return opencv_filter.inspect_image_url(payload.image_url)
    else:
        raise HTTPException(status_code=400, detail="Provide either image_url or image_base64")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
