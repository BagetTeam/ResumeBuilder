import fastapi
from fastapi.middleware.cors import CORSMiddleware

from data_model import ResumeData

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def read_root():
    return {"Hello": "World"}


cached_resume: str = ""
@app.get("/resume")
def get_resume():
    global cached_resume
    return {"resume": cached_resume}

@app.post("/resume")
def set_resume(resume: ResumeData):
    global cached_resume
    cached_resume = resume.resume
    return {"success": True}