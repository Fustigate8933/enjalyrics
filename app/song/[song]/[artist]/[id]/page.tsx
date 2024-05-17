import Highlights from "./Highlights"

async function getLyrics(song: string, artist: string, id: number){
	const url = `http://localhost:8000/add-song/`
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				song_name: song,
				artist: artist,
				id: id
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
		artist: string,
		id: number
	}
}

export default async function Lyrics(props: Props){
	const params = props.params
	const song: string = decodeURIComponent(params.song)
	const artist: string = decodeURIComponent(params.artist)
	const data = await getLyrics(song, artist, params.id)
	const lyrics = data.lyrics

	return (
		<div className="window-wrapper">
			<Highlights songName={params.song} artist={params.artist} songId={data.song_id} lyrics={lyrics} />
		</div>
	)
}

