"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Spinner from "./Spinner"

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
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	const handleSongNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSongName(e.target.value)
	}

	const handleSongArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSongArtist(e.target.value)
	}

	const handleSubmit = async (e: React.MouseEvent) => {
		e.preventDefault()

		setIsLoading(true)
		
		try {
			const response = await fetch("http://localhost:8000/add-song/", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					song_name: songName,
					artist: songArtist
				})
			})

			const data = await response.json()
			const href = data.id
			
			router.push(`/song/${href}`)
			if (response.ok){
				console.log("Success, redirecting...")
			}else{
				console.error("Falied to submit song request")
			}
		}catch (error) {
			console.error("Error submitting song request: ", error)
		} finally{
			setIsLoading(false)
		}
	}

	return (
    <main className="window-wrapper flex flex-col gap-[5rem]">
			{isLoading && 
				<div 
					className="z-[999] fixed top-0 left-0 w-full h-full bg-black/[.5] flex justify-center items-center"
				>
					<Spinner />
				</div>}
			<div className="flex flex-col">
				<h1 className="text-6xl mb-10">Learn <span className="text-[#FDB0C0]">Japanese</span> Vocabulary with <span className="text-[#BBE3F0]">Song Lyrics</span></h1>
				<h1 className="text-2xl"><span className="text-[#BBE3F0]">歌詞</span>で<span className="text-[#FDB0C0]">日本語</span>の単語を学ぼう</h1>
			</div>
			<div className="flex flex-col gap-5">
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
				<button className="self-start hover:cursor-pointer hover:scale-110 text-white border rounded-lg py-2 px-3" onClick={handleSubmit}>Search</button>
			</div>
			<div>
				<h1 className="text-4xl font-bold mb-5">Songs List</h1>
				<button className="self-start hover:cursor-pointer hover:scale-110 text-white border rounded-lg py-2 px-3 mb-5" onClick={() => location.reload()}>Refresh list</button>
				<div className="flex flex-col">
					{songs.map(song => {
						if (song.song_name !== "undefined"){
							return (
								<Link href={`/song/${song.id}`} key={song.id}>
									<div className="self-start hover:scale-[99%] p-2 border-yellow-300 rounded-md hover:cursor-pointer">
										<h1 className="text-2xl text-shadow">{song.song_name}</h1>
										<h1 className="text-xl italic">{song.artist}</h1>
									</div>
								</Link>
							)
						}
					})}
				</div>
			</div>
    </main>
	)
}

export default HomePage
