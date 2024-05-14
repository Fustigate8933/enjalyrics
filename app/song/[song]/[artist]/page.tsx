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
	const lyrics = (await getLyrics(decodeURIComponent(params.song), decodeURIComponent(params.artist))).lyrics
	return (
		<div className="window-wrapper">
			<Highlights songName={params.song} artist={params.artist} />
			{lyrics.map((line: string, index: number) => (
				<h1 className="p-4 text-xl" key={index}>
					{line}
				</h1>
			))}
		</div>
	)
}
