# PHASE 2/4: stored papers, their parsed text, and generated summaries
from sqlalchemy import Column, String, Text, Integer, ForeignKey
from app.database import Base
import uuid


class Paper(Base):
    __tablename__ = "papers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String)
    authors = Column(String)
    source = Column(String)        # arxiv / semantic_scholar / upload
    pdf_url = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)
    summary_json = Column(Text, nullable=True)  # PHASE 2 structured summary
