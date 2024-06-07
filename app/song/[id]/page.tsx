import HighlightsComponent from "./Highlights"
import config from "../../../config"

async function getLyrics(id: number){
	const apiUrl = config.apiUrl
	const url = `${apiUrl}/get-song/${id}`
	try {
		const response = await fetch(url)

		if (!response.ok){
			throw new Error("Failed to get lyrics")
		}

		const data = await response.json()
		
		return data	// returns string of lyrics with lines separated by "\n"s
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
			<HighlightsComponent songName={data.song_name} songArtist={data.artist} songId={data.id} songLyrics={data.lyrics} />
	)
}

