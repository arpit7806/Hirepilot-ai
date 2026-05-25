from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pdfminer.high_level import extract_text
from dotenv import load_dotenv
import tempfile
import json
import os

load_dotenv()

app = FastAPI()

# CORS - allows Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://hirepilot-ai.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name
    text = extract_text(tmp_path)
    os.unlink(tmp_path)
    return text.strip()


def build_prompt(resume_text: str, job_description: str) -> str:
    return f"""
You are an expert ATS (Applicant Tracking System) and technical recruiter.

Analyze the resume below against the job description and return a JSON object with EXACTLY this structure:
{{
  "match_score": <integer 0-100>,
  "summary": "<2-3 sentence recruiter summary of the candidate>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "missing_skills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "technical_questions": ["<question 1>", "<question 2>", "<question 3>"],
  "hr_questions": ["<question 1>", "<question 2>", "<question 3>"]
}}

Rules:
- match_score: how well the candidate matches the job (0-100)
- strengths: top 3 things the candidate brings to this role
- missing_skills: top 3 skills from the job description the candidate lacks
- technical_questions: 3 role-specific technical interview questions
- hr_questions: 3 behavioral/HR interview questions
- Return ONLY the JSON object, no extra text, no markdown, no backticks

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""


@app.get("/")
def root():
    return {"message": "HirePilot AI backend is running"}


@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Read and extract text from uploaded PDF
    file_bytes = await resume.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        return {"error": "Could not extract text from PDF. Please use a text-based PDF."}

    # Build prompt and call Groq
    prompt = build_prompt(resume_text, job_description)

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.3,
    )

    raw_response = chat_completion.choices[0].message.content

    # Parse JSON response
    try:
        result = json.loads(raw_response)
    except json.JSONDecodeError:
        return {"error": "AI returned invalid JSON", "raw": raw_response}

    return result