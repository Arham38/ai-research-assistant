from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.types import Text
from sqlalchemy.dialects.mysql import LONGTEXT
from datetime import datetime, timezone
from app.database import Base
import uuid

LongText = Text().with_variant(LONGTEXT(), "mysql")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    paper_id = Column(String(36), ForeignKey("papers.id"), index=True)
    role = Column(String(20))  # "user" or "assistant"
    content = Column(LongText)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))