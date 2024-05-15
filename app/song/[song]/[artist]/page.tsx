import Highlights from "./Highlights"

async function getLyrics(song: string, artist: string){
	const url = `http://localhost:8000/add-song/`
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				song_name: song,
				artist: artist
			})
		})

		if (!response.ok){
			throw new Error("Failed to get lyrics")
		}

		const data = await response.json()
		
		return data	
	}catch (error){
		console.log(error)
		return null
	}
}

type Props = {
	params: {
		song: string,
		artist: string
	}
}

export default async function Lyrics(props: Props){
	const params = props.params
	const song: string = decodeURIComponent(params.song)
	const artist: string = decodeURIComponent(params.artist)
	const data = await getLyrics(song, artist)
	const lyrics = data.lyrics
	const highlights = data.highlights

	return (
		<div className="window-wrapper">
			<Highlights songName={params.song} artist={params.artist} songId={data.song_id} lyrics={lyrics} />
		</div>
	)
}
