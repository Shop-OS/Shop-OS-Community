from pydantic import BaseModel
from typing import Optional

class ProductBackgroundChangeRequest(BaseModel):
    inputImageURL: str
    prompt: str
    inputProductImagePath: str
    backgroundRefImagePath: str
    inputBlackAndWhiteImagePath: str
    inputFocusImagePath: str
    outputFileName: str
    renderStrength: float
    seed: Optional[int] = None
    outputFileNameCount: Optional[int] = 1
    generationId: str = None