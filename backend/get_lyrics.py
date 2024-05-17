from lyricsgenius import Genius
from dotenv import load_dotenv
import os


def get_lyrics(song, artist):
    load_dotenv("../.env")
    token = os.getenv("GENIUS_TOKEN")
    

    genius = Genius(token)
    song = genius.search_song(song, artist)

    print(song)

    if song is None:
        return None

    return song.lyrics
# artist = genius.search_artist("Eve (JPN)")


if __name__ == "__main__":
    print(type(get_lyrics("インソムニア", "Eve")))

