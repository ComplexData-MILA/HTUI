from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .middlewares import cors

app = FastAPI(middleware=[cors])
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )




def get_router(): 
    router = APIRouter()
    router.add_middleware(cors)
    return router