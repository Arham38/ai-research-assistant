from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey
from app.database import Base
import uuid


class Paper(Base):
    __tablename__ = "papers"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    external_id = Column(String, nullable=True, index=True)  # arXiv/Semantic Scholar id, if saved from search
    owner_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String)
    authors = Column(String)
    abstract = Column(Text, nullable=True)
    year = Column(Integer, nullable=True)
    source = Column(String)
    pdf_url = Column(String, nullable=True)
    raw_text = Column(Text, nullable=True)
    summary_json = Column(Text, nullable=True)
    is_saved = Column(Boolean, default=False)