from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.types import Text
from sqlalchemy.dialects.mysql import LONGTEXT
from app.database import Base
import uuid

# on MySQL this becomes LONGTEXT (no size limit issue); on SQLite it stays TEXT
LongText = Text().with_variant(LONGTEXT(), "mysql")


class Paper(Base):
    __tablename__ = "papers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    external_id = Column(String(128), nullable=True, index=True)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(500))
    authors = Column(String(500))
    abstract = Column(LongText, nullable=True)
    year = Column(Integer, nullable=True)
    source = Column(String(50))
    pdf_url = Column(String(1000), nullable=True)
    raw_text = Column(LongText, nullable=True)
    summary_json = Column(LongText, nullable=True)
    is_saved = Column(Boolean, default=False)