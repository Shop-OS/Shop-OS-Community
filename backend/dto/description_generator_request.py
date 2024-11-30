from pydantic import BaseModel
from typing import Optional

class DescriptionGeneratorRequest(BaseModel):
    inputImagePath: str
    outputFileName: str