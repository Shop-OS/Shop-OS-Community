from pydantic import BaseModel
from typing import Optional

class OOTDBackgroundChangeRequest(BaseModel):
    inputPersonImageURL: str
    inputClothImageURL: str
    
    inputClothImagePath: str
    inputPersonImagePath: str
    
    outputFileName: str
    seed: Optional[int] = None
    outputFileNameCount: Optional[int] = 1
    generationId: str = None