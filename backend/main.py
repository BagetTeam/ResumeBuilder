import base64
import os
import fastapi
from fastapi.middleware.cors import CORSMiddleware
import tempfile
from pdflatex import PDFLaTeX

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

def compile_latex(latex_content: str):
    """ Compile the LaTeX content to PDF """
    tmp_tex_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".tex", delete=False, mode="w") as tmp_file:
            tmp_tex_path = tmp_file.name
            tmp_file.write(latex_content)

        pdfl = PDFLaTeX.from_texfile(tmp_tex_path)
        pdf, log, completed_process = pdfl.create_pdf(keep_pdf_file=False, keep_log_file=False)
        return pdf

            # tmp_file.write(latex_content.encode("utf-8"))
            # tmp_file.flush()
            # subprocess.run(["pdflatex", tmp_file.name], check=True)
            # with open(tmp_file.name.replace(".tex", ".pdf"), "rb") as f:
            #     pdf_content = f.read()
    except Exception as e:
        raise Exception("PDF compilation failed: " + str(e))
    finally:
        if tmp_tex_path is not None and os.path.exists(tmp_tex_path):
            os.unlink(tmp_tex_path)

@app.post("/pdf-download")
def get_pdf_download(resume: ResumeData):
    try:
        pdf = compile_latex(resume.resume)
        return fastapi.responses.Response(content=pdf, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=resume.pdf"})
    except Exception as e:
        raise fastapi.HTTPException(status_code=500, detail=str(e))
    
@app.post("/pdf-display")
def get_pdf_display(resume: ResumeData):
    try:
        pdf = compile_latex(resume.resume)
        pdf_base64 = base64.b64encode(pdf).decode("utf-8")
        return {"pdf": pdf_base64}
    except Exception as e:
        raise fastapi.HTTPException(status_code=500, detail=str(e))