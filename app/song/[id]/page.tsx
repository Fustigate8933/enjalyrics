import Highlights from "./Highlights"

async function getLyrics(id: number){
	const url = `http://localhost:8000/get-song/${id}`
	try {
		const response = await fetch(url)

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
		id: number
	}
}

export default async function Lyrics(props: Props){
	const params = props.params
	const data = await getLyrics(params.id)

	return (
		<div className="window-wrapper">
			<Highlights songName={data.song_name} artist={data.artist} songId={data.id} lyrics={data.lyrics} />
		</div>
	)
}

