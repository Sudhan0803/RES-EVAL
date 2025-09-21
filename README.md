# Automated Resume Relevance Check System

## Overview
The **Automated Resume Relevance Check System** is an AI-powered solution designed to streamline resume evaluation for Innomatics Research Labs. It automates the process of matching resumes against job descriptions (JDs), addressing the challenges of manual, inconsistent, and time-consuming evaluations. The system processes thousands of resumes weekly, generates relevance scores, identifies gaps, and provides actionable feedback to students, all accessible via a web-based dashboard for the placement team.

## Features
- **Resume and JD Upload**: Supports PDF/DOCX for resumes and job descriptions.
- **Resume Parsing**: Extracts and standardizes text from resumes.
- **JD Parsing**: Extracts role title, must-have skills, good-to-have skills, and qualifications.
- **Relevance Analysis**:
  - Hard Match: Keyword and skill matching (exact and fuzzy).
  - Soft Match: Semantic similarity using embeddings and LLMs.
  - Weighted Scoring: Combines hard and soft matches for a Relevance Score (0–100).
- **Output**:
  - Relevance Score (0–100).
  - Missing skills, projects, or certifications.
  - Fit verdict (High/Medium/Low suitability).
  - Personalized improvement suggestions for students.
- **Web Dashboard**: Allows the placement team to upload JDs, view shortlisted resumes, and filter by job role, score, or location.
- **Scalability**: Handles thousands of resumes weekly with robust storage and retrieval.

## Tech Stack

### Core Resume Parsing, AI Framework, and Scoring
- **Python**: Primary programming language.
- **PyMuPDF / pdfplumber**: PDF text extraction.
- **python-docx / docx2txt**: DOCX text extraction.
- **spaCy / NLTK**: Entity extraction and text normalization.
- **LangChain**: Orchestrates LLM workflows.
- **LangGraph**: Structured pipelines for resume–JD analysis.
- **LangSmith**: Observability, testing, and debugging of LLM chains.
- **Vector Store (Chroma / FAISS / Pinecone)**: Stores embeddings for semantic search.
- **LLM Models**: OpenAI GPT / Gemini / Claude / HuggingFace models for semantic matching and feedback.
- **Keyword Matching**: TF-IDF, BM25, and fuzzy matching.
- **Semantic Matching**: Embeddings with cosine similarity.
- **Scoring**: Weighted combination of hard and soft matches.

### Web Application
- **Flask / FastAPI**: Backend APIs for processing uploads and serving results.
- **Streamlit**: Frontend for the placement team dashboard (MVP).
- **SQLite / PostgreSQL**: Database for storing results, metadata, and audit logs.

## Installation

### Prerequisites
- Python 3.8+
- pip for package management
- SQLite/PostgreSQL database
- Optional: Vector store (Chroma/FAISS/Pinecone) setup
- API keys for LLM providers (e.g., OpenAI, HuggingFace)

### Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sudhan0803/RES-EVAL.git
   cd RES-EVAL
