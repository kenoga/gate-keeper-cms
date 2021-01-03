import uvicorn
import backend.main 

import yaml
import logging

with open("./backend/logging.yaml", "r") as fr:
    conf = yaml.safe_load(fr)
logging.config.dictConfig(conf)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, log_level="info", reload=True)