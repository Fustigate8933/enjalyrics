import HomePage from "./HomePage"

async function fetchSongs () {
	try {
			const response = await fetch("http://localhost:8000/get-all-songs")
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
