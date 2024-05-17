"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

interface songDetails {
	artist: string,
	id: number,
	song_name: string,
	lyrics: string
}

interface HomePageProps {
	songs: songDetails[]
}

const HomePage: React.FC<HomePageProps> = ({
	songs
}) => {

	const [songName, setSongName] = useState("")
	const [songArtist, setSongArtist] = useState("")

	const router = useRouter()

	const handleSongNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSongName(e.target.value)
	}

	const handleSongArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSongArtist(e.target.value)
	}

	const handleSubmit = async (e: React.MouseEvent) => {
		e.preventDefault()
		
		try {
			const response = await fetch("http://localhost:8000/add-song", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					song_name: songName,
					artist: songArtist
				})
			})

			const data = await response.json()
			const href = data.id
			
			router.push(href)
			if (response.ok){
				console.log("Success, redirecting...")
			}else{
				console.error("Falied to submit song request")
			}
		}catch (error) {
			console.error("Error submitting song request: ", error)
		}
	}

	return (
    <main className="window-wrapper">
			<h1 className="text-6xl mb-10">Learn Japanese Vocabulary with Song Lyrics</h1>
			<div className="flex flex-col gap-5 mb-4">
				<div className="flex gap-2">
					<h1 className="text-xl">Song name: </h1>
					<input
						type="text"
						className="text-black p-1 rounded-md"
						value={songName}
						onChange={handleSongNameChange}
						placeholder="Name of song"
						id="song-name-search"
					/>
				</div>
				<div className="flex gap-2">
					<h1 className="text-xl">Artist name: </h1>
					<input
						type="text"
						className="text-black p-1 rounded-md"
						value={songArtist}
						onChange={handleSongArtistChange}
						placeholder="Name of artist"
						id="artist-name-search"
					/>
				</div>
				<button className="self-start hover:cursor-pointer bg-gray-300 text-black rounded-lg px-2" onClick={handleSubmit}>Search</button>
			</div>
			<div>
				<h1 className="text-5xl font-bold">Songs List</h1>
				{songs.map(song => (
					<div key={song.id} className="p-5 border-yellow-300 rounded-md m-3">
						<h1 className="text-2xl">{song.song_name}</h1>
						<h1 className="text-xl">{song.artist}</h1>
					</div>
				))}
			</div>
    </main>
	)
}

export default HomePage
