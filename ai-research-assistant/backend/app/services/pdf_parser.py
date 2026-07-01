import fitz  # PyMuPDF


def extract_text(pdf_bytes: bytes) -> str:
    text_parts = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text_parts.append(page.get_text())
    return "\n".join(text_parts).strip()