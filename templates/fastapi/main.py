from fastapi import FastAPI

app = FastAPI(title="CodeSphere FastAPI Workspace")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "FastAPI Server",
        "message": "Welcome to your Python FastAPI Cloud Workspace!"
    }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}
