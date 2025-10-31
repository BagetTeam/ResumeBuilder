from pydantic import BaseModel

class ResumeData(BaseModel):
    resume: list[str]
    datetime: int
