import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./flowpilot.db")
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class WorkflowModel(Base):
    __tablename__ = "workflows"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, default="Untitled Workflow")
    nodes_json = Column(Text, default="[]")
    edges_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

class WorkflowRunModel(Base):
    __tablename__ = "workflow_runs"
    id = Column(String, primary_key=True, index=True)
    workflow_id = Column(String, index=True)
    status = Column(String, default="QUEUED")
    target_url = Column(String, nullable=True)
    page_title = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
