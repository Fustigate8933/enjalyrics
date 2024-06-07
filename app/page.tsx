import HomePage from "./HomePage"
import config from "../config"


async function fetchSongs () {
	const apiUrl = config.apiUrl

	try {
			const response = await fetch(`${apiUrl}/get-all-songs`)
			const data = await response.json()
			return data
		} catch (error) {
			console.log(error)
			return null
		}
}


const Home = async () => {
	const songs = await fetchSongs()

	return (
		<HomePage songs={songs} />
  );

}

export default Home
