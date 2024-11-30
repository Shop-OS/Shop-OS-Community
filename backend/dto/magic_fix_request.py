from pydantic import BaseModel
from typing import Optional

class MagicFixRequest(BaseModel):
    inputImageURL: str
    inputImagePath: str
    inputMaskImagePath: str
    inputGeneratedImagePath: str
    outputFileName: str
    outputFileNameCount: Optional[int] = 1
    generationId: str = None
    originalImageURL: str = None
    originalImageFileName: str = None