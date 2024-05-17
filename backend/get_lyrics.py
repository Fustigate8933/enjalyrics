from lyricsgenius import Genius
from dotenv import load_dotenv
import os


def get_song(song, artist):
    load_dotenv("../.env")
    token = os.getenv("GENIUS_TOKEN")
    

    genius = Genius(token)
    song = genius.search_song(song, artist)

    if song is None:
        return None

    return song


