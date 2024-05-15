from lyricsgenius import Genius


def get_lyrics(song, artist):
    token = "lxn9V1IwgK2pDmWlNYHpdAFae9A33vpnOWcmAC9d6W2uWLJ7kduq-fjfhY-cKdn_"

    genius = Genius(token)
    song = genius.search_song(song, artist)

    if song is None:
        return None

    return song.lyrics
# artist = genius.search_artist("Eve (JPN)")


if __name__ == "__main__":
    print(type(get_lyrics("インソムニア", "Eve")))

