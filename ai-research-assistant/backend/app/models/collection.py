# PHASE 4: tags + notes + saved-paper associations for the personal library
from sqlalchemy import Column, String, Text, ForeignKey
from app.database import Base
import uuid


class PaperTag(Base):
    __tablename__ = "paper_tags"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"))
    tag = Column(String)


class PaperNote(Base):
    __tablename__ = "paper_notes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String, ForeignKey("papers.id"))
    note = Column(Text)
