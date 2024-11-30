from pydantic import BaseModel
from typing import Optional

class BrushnetBackgroundChangeRequest(BaseModel):
    inputImageURL: str
    prompt: str
    inputImagePath: str
    outputFileName: str
    seed: Optional[int] = None
    outputFileNameCount: Optional[int] = 1
    generationId: str = None