from fastapi import FastAPI, HTTPException
from get_lyrics import get_lyrics
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models import *
from fastapi.responses import JSONResponse
from collections import defaultdict


print("\n", "-" * 20)


#### Initialize FastAPI ####
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#### Setting up database ####
import sqlalchemy as db
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = db.create_engine("sqlite+pysqlite:///./enja.db")
connection = engine.connect()
inspector = Inspector.from_engine(engine)
Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()

print(f"Tables in the database found: {inspector.get_table_names()}")


#### Function to fetch song from Genius ####
def fetch_lyrics(song: str, artist: str):
    lyrics = get_lyrics(song, artist)

    if lyrics is None:
        return None

    return lyrics

def lyrics_to_list(lyrics):
    return list(filter(None, lyrics.split("\n")))[1:]



#### Add song to database ####
class SongDetails(BaseModel):
    song_name: str
    artist: str


@app.post("/add-song/")
async def add_song(params: SongDetails):
    existing_song = session.query(Song).filter_by(song_name=params.song_name, artist=params.artist).first()
    
    if existing_song:
        highlights_by_line = defaultdict(list)
        for highlight in existing_song.highlights:
            highlights_by_line[highlight.line].append({
                "song_id": highlight.song_id,
                "highlighted_text": highlight.highlighted_text,
                "x_pos": highlight.x_pos,
                "start": highlight.start,
                "id": highlight.id,
                "translation": highlight.translation,
                "y_pos": highlight.y_pos,
                "end": highlight.end
            })

        response_content = {
            "message": "Song already exists in database", 
            "lyrics": lyrics_to_list(existing_song.lyrics), 
            "song_id": existing_song.id,
            "highlights": highlights_by_line
        }
        return response_content

    lyrics = fetch_lyrics(params.song_name, params.artist)
    if lyrics is None:
        raise HTTPException(status_code=400, detail="Song couldn't be found")

    new_song = Song(
        song_name=params.song_name,
        artist=params.artist,
        lyrics=lyrics
    )

    session.add(new_song)
    session.commit()

    response_content = {
        "message": "Song added successfully", 
        "lyrics": lyrics_to_list(lyrics), 
        "song_id": new_song.id,
        "highlights": {}
    }

    return response_content


#### Add highlight to database ####
class HighlightDetails(BaseModel):
    song_id: int
    highlighted_text: str
    translation: str
    x_pos: int
    y_pos: int
    start: int
    end: int
    line: int


@app.post("/add-highlight/")
async def add_highlight(params: HighlightDetails):
    new_highlight = Highlight(
        song_id=params.song_id,
        highlighted_text=params.highlighted_text,
        translation=params.translation,
        x_pos=params.x_pos,
        y_pos=params.y_pos,
        start=params.start,
        end=params.end,
        line=params.line
    )

    song = session.query(Song).get(params.song_id)
    new_highlight.song = song

    session.add(new_highlight)
    session.commit()

    response_content = {"message": "Highlight added successfully"}
    return JSONResponse(status_code=201, content=response_content)


#### Get highlights of a song from database ####
@app.get("/get-highlights/{song_id}/")
async def get_highlights(song_id: int):
    song = session.query(Song).filter_by(id=song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail=f"Song with id {song_id} not found.")

    highlights = song.highlights
    highlights_by_line = defaultdict(list)
    for highlight in highlights:
        highlights_by_line[highlight.line].append({
            "song_id": highlight.song_id,
            "highlighted_text": highlight.highlighted_text,
            "x_pos": highlight.x_pos,
            "start": highlight.start,
            "id": highlight.id,
            "translation": highlight.translation,
            "y_pos": highlight.y_pos,
            "end": highlight.end
        })


    return {"song_id": song_id, "highlights": highlights_by_line}

print("-" * 20)

