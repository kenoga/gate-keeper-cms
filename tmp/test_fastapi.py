from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test/{id}")
def test(id: int = None):
    return { "message": "test", "id": id }
    