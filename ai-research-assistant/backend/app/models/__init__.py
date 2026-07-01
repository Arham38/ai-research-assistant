# Import every model here so SQLAlchemy knows about all tables before create_all() runs
from app.models.user import User
from app.models.paper import Paper
from app.models.collection import PaperTag, PaperNote