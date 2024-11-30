from pydantic import BaseModel
from typing import Optional

class Tripo3DRequest(BaseModel):
    prompt: str
    
class MeshyRequest(BaseModel):
    prompt: str
    
class SV3DRequest(BaseModel):
    inputImageURL: str
    inputImagePath: str
    outputFileName: str
    generationId: str = None
    seed: Optional[int] = 38401736826042
    outputFileNameCount: Optional[int] = 1