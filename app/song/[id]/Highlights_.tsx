"use client"
import TranslationPopup from "./TranslationPopup"
import React, { useState, useEffect } from "react"

interface HighlightsProps {
	songName: string,
	artist: string,
	songId: number,
	lyrics: string[]
}

interface HighlightObject {
	song_id: number;
	highlighted_text: string;
	x_pos: number;
	start: number;
	id: number;
	translation: string;
	y_pos: number;
	end: number;
}

interface HighlightsState {
	[lineNumber: number]: HighlightObject[];
}



// page.tsx fetchs the sone name, artist, id, and lyrics for us using server side rendering
const Highlights: React.FC<HighlightsProps> = ({ songName, artist, songId, lyrics }) => {
	const [canChangeLines, setCanChangeLines] = useState(true)
	const [startnode, setStartnode] = useState(0)

	const [highlighted, setHighlighted] = useState({
		id: -1,
		text: "",
		translation: "",
		position: { x: 0, y: 0 },
		start: 0,
		end: 0,
		line: 0,
		already_in: false
	})

	const [highlights, setHighlights] = useState<HighlightsState>({})

	const handleTranslationChange = (translation: string) => {
		setHighlighted((prevState) => ({
			...prevState,
			translation
		}))
	}

	const handleLineHover = (e: React.MouseEvent<HTMLHeadingElement>) => {
		if (canChangeLines){
			const lineId = parseInt(e.currentTarget.id, 10)
			setHighlighted((prevState) => ({
				...prevState,
				line: lineId
			}))
		}
	}

	const fetchHighlights = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:8000/get-highlights/${songId}`);
			const data = await response.json();
			setHighlights(data.highlights);
			console.log(data.highlights)
		} catch (error) {
			console.error("Error fetching highlights:", error);
		}
	}

	const handleSubmitTranslation = async (inputTranslation: string) => {
		try {
			// console.log(`Line: ${highlighted.line}`)
			const response = await fetch("http://127.0.0.1:8000/add-highlight", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					song_id: songId,
					highlighted_text: highlighted.text, 
					translation: inputTranslation, 
					x_pos: highlighted.position.x, 
					y_pos: highlighted.position.y,
					start: highlighted.start,
					end: highlighted.end,
					line: highlighted.line
				}),
			})
			const data = await response.json()
			// console.log(data)
			if (response.ok) {
				console.log("Translation submitted successfully");
				await fetchHighlights();
			} else {
				console.error("Failed to submit translation");
			}
		} catch (error) {
			console.error("Error submitting translation:", error);
		}
	}

	const handleDeleteTranslation = async (id: number) => {
		try {
			const response = await fetch(`http://127.0.0.1:8000/delete-highlight/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				console.log('Student deleted successfully');
				await fetchHighlights();
			} else {
				console.error('Error deleting student:', response.status);
			}
		} catch (error) {
			console.error('Error deleting student:', error);
		}
	}

	const handleSelectionChange = (endnode: number) => {
		if (endnode === -1){
			setHighlighted((prevState) => ({
				...prevState,
				text: ""
			}))
		}
		else{
			setCanChangeLines(false)

			const selection = window.getSelection()
			const selectedText = selection?.toString()

			const range = selection?.getRangeAt(0);
			const rect = range?.getBoundingClientRect()

			if (selectedText){
				setHighlighted((prevState) => ({
					...prevState,
					position: { x: Math.floor(rect.x), y: Math.floor(rect.y) },
					start: Math.min(startnode, endnode),
					end: Math.max(startnode, endnode),
					text: selectedText,
					translation: ""
				}))
			}else{
				setHighlighted((prevState) => ({
					...prevState,
					text: "",
					translation: ""
				}))
				setCanChangeLines(true)
			}
		}
	}

	useEffect(() => {
		fetchHighlights()
		console.log(lyrics)
		}, []);


	return (
		<div className="window-wrapper column-wrapper scroll-smooth">
			<div className="left-column">
				<h1 className="p-4 text-3xl underline">{decodeURIComponent(songName)}</h1>
				<h1 className="p-4 text-xl">{decodeURIComponent(artist)}</h1>
				{lyrics.map((lyric: string, index: number) => (
					<h1 className="p-4 text-2xl w-fit" key={index} id={`${index}`} onMouseOver={handleLineHover}>
						{lyric.split("").map((char, charIndex) => {
							const lineHighlights = highlights[index] || [] // get highlights for current line
							const highlight = lineHighlights.find(
								(h) => charIndex >= h.start && charIndex <= h.end
							) // if a highlight exists for the current character
							return highlight ? (
								<span
									key={charIndex}
									className={`text-green-300 ${charIndex} hover:cursor-pointer ${charIndex === highlight.end ? 'mr-2' : ''} ${charIndex === highlight.start && charIndex !== 0 ? "ml-2" : ""}`}
									onClick={() => {
										setHighlighted({
											id: highlight.id,
											text: highlight.highlighted_text,
											translation: highlight.translation,
											position: { x: highlight.x_pos, y: highlight.y_pos },
											start: highlight.start,
											end: highlight.end,
											line: index,
											already_in: true
										})
									}}
									onMouseUp={() => handleSelectionChange(charIndex)}
									onMouseDown={() => {setStartnode(charIndex)}}
									>
									{char}
								</span>
								) : (
									<span key={charIndex} className={`${charIndex}`} onMouseUp={() => handleSelectionChange(charIndex)} onMouseDown={() => setStartnode(charIndex)}>{char}</span>
							);
						})}
					</h1>
				))}

				{/* highlighted.text && (
					<TranslationPopup
						text={highlighted.translation}
						jp={highlighted.text}
						position={highlighted.position}
						onTranslationChange={handleTranslationChange}
						onSubmitTranslation={handleSubmitTranslation}
						onDeleteTranslation={handleDeleteTranslation}
						id={highlighted.id}
						already_in={highlighted.already_in}
					/>
				) */}
			</div>
			<div className="relative right-column flex flex-col text-3xl">
				<TranslationPopup 						
					text={highlighted.translation}
					jp={highlighted.text}
					position={highlighted.position}
					onTranslationChange={handleTranslationChange}
					onSubmitTranslation={handleSubmitTranslation}
					onDeleteTranslation={handleDeleteTranslation}
					id={highlighted.id}
					already_in={highlighted.already_in}
					start={highlighted.start}
					end={highlighted.end}
				/>
			</div>
		</div>
	)
}

export default Highlights

