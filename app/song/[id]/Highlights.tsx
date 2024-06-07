"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@nextui-org/input"
import Spinner from "../../Spinner"
import config from "../../../config"

interface HighlightsProps {
	songName: string,
	songArtist: string,
	songId: number,
	songLyrics: string
}

interface Highlight {
  highlighted_text: string;
  song_id: number;
  start_index: number;
  end_index: number;
  end_line: number;
  start_line: number;
  translation: string;
  id: number;
}

const HighlightsComponent: React.FC<HighlightsProps> = ({ songName, songArtist, songId, songLyrics }) => {
	// states and other constants go here //
	const [songHighlights, setSongHighlights] = useState<Highlight[]>([])
	const [translationInput, setTranslationInput] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [currentSelection, setCurrentSelection] = useState("Add or select a highlight")
	const [curId, setCurId] = useState(-1)

	const apiUrl = config.apiUrl


	// refs go here //
	



	// effects go here //
	useEffect(() => {
		getSongHighlights()
	}, [])

	useEffect(() => {
		highlightFetchedText()
	}, [songHighlights])

	useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (selection) {
				if (selection.toString().length !== 0){
					console.log("changed cur id to -1")
					setCurId(-1)
				}
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    }
  }, [])



	// helper functions go here //
	const highlightSelectedText = async () => {
		setIsLoading(true)
		var selection = window.getSelection()
		if (selection !== null && curId === -1){
			const selectedText = selection.toString()
			setCurrentSelection(selectedText)
			try {
				var range = selection.getRangeAt(0)
			} catch (error) {
				setIsLoading(false)
				return
			}

			// get starting line and ending line of selection
			const anchor = selection.anchorNode
			const focus = selection.focusNode

			const children = document.getElementById("lyrics")?.childNodes
			var start_line = 0
			var end_line = 0
			var stop_changing_start_line = false

			if (children){
				for (var i = 0; i < children.length; i++){
					const child = children[i]
					if (child.nodeType === Node.ELEMENT_NODE) {
						if (!stop_changing_start_line){
							start_line += child.querySelectorAll("br").length + (child.nodeName === "BR")
						}
						end_line += child.querySelectorAll("br").length + (child.nodeName === "BR")
					}
					if (child.isSameNode(anchor)){
						stop_changing_start_line = true
					}
					if (child.isSameNode(focus)){
						break
					}
				}
			}
			

			// start index of start line and end index of end line of selection, add highlight to database
			const startOffset = range.startOffset
			const endOffset = range.endOffset
			console.log(JSON.stringify({
					song_id: songId,
					highlighted_text: selectedText,
					translation: translationInput,
					start_index: range.startOffset,
					end_index: range.endOffset,
					start_line: start_line,
					end_line: end_line
				}))

			var newId = -1

			fetch(`${apiUrl}/add-highlight/`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					song_id: songId,
					highlighted_text: selectedText,
					translation: translationInput,
					start_index: startOffset,
					end_index: endOffset,
					start_line: start_line,
					end_line: end_line
				}),
			})
			.then((response) => {
				if (!response.ok){
					throw new Error("Add highlight failed")
				}
				return response.json()
			})
			.then((data) => {
				console.log(data)
				newId = data.highlight_id

				setSongHighlights(prevHighlights => [
					...prevHighlights,
					{
						id: newId,
						song_id: songId,
						highlighted_text: selectedText,
						translation: translationInput,
						start_index: startOffset,
						end_index: endOffset,
						start_line: start_line,
						end_line: end_line
					}
				])
			})
			.catch((error) => {
				console.log("Error: ", error)
			})
			


			// inject span into html
			var rangeContent = range.extractContents()
			var span = document.createElement("span")

			span.style.backgroundColor = "#b4b4b4"
			span.style.color = "black"
			span.style.cursor = "pointer"
			// span.style.marginLeft = "4px"
			// span.style.marginRight = "4px"
			span.id = `${newId}` 

			span.appendChild(rangeContent)
			span.onclick = () => { // add event listener to execute function on click
				// var parent = span.parentNode
				// if (parent) {
				// 	while (span.firstChild) {
				// 		parent.insertBefore(span.firstChild, span)
				// 	}
				// 	parent.removeChild(span)
				// }
				setTranslationInput(translationInput)
				setCurrentSelection(selectedText)
				setCurId(newId)
			}
			range.insertNode(span)
			selection.removeAllRanges()
		} else if (curId !== -1){
			const response = await fetch(`${apiUrl}/edit-highlight/${curId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ translation: translationInput })
			})
			const data = await response.json()
			console.log(data)

			setSongHighlights(prevHighlights =>
				prevHighlights.map(highlight =>
					highlight.id === curId ? { ...highlight, translation: translationInput } : highlight
				)
			)
			console.log(songHighlights)
		}
		setIsLoading(false)
	}

	function getTextNodeByLine(line: number) {
		const children = document.getElementById("lyrics")?.childNodes
		let currentLine = 0;

		if (children){
			for (var i = 0; i < children.length; i++){
				const child = children[i]
				if (currentLine === line){
					return child
				}
				if (child.nodeType === Node.ELEMENT_NODE) {
					currentLine += child.querySelectorAll("br").length + (child.nodeName === "BR")
				}
			}
		}
	}

	
	const highlightFetchedText = () => {
		const lyricsElement = document.getElementById("lyrics")
		if (!lyricsElement) return

		// const sortedHighlights = songHighlights.sort((a, b) => a.start_line - b.start_line)
		// console.log("Sorted Highlights: ", sortedHighlights)
		
		songHighlights.forEach((highlight) => {
			// console.log(`start line: ${highlight.start_line}, end line: ${highlight.end_line}, start index: ${highlight.start_index}, end index: ${highlight.end_index}`)
			const range = document.createRange()
			const startTextNode = getTextNodeByLine(highlight.start_line)
			const endTextNode = getTextNodeByLine(highlight.end_line)

			if (startTextNode && endTextNode) {
				range.setStart(startTextNode, highlight.start_index)
				try {
					range.setEnd(endTextNode, highlight.end_index)
				} catch (error) {
					console.log(error)
				}

				var rangeContent = range.extractContents()
				var span = document.createElement("span")

				span.style.backgroundColor = "#b4b4b4"
				span.style.color = "black"
				span.style.cursor = "pointer"
				// span.style.marginLeft = "4px"
				// span.style.marginRight = "4px"
				// span.style.paddingLeft = "2px"
				// span.style.paddingRight = "2px"
				span.id = `${highlight.id}`

				span.appendChild(rangeContent)
				span.onclick = () => { // add event listener to execute function on click
					// var parent = span.parentNode
					// if (parent) {
					// 	while (span.firstChild) {
					// 		parent.insertBefore(span.firstChild, span)
					// 	}
					// 	parent.removeChild(span)
					// }
					setTranslationInput(highlight.translation)
					setCurrentSelection(highlight.highlighted_text)
					setCurId(highlight.id)
				}
				range.insertNode(span)
			} else {
				console.error("Invalid start or end text node")
				return null
			}
		})
	}

	const getSongHighlights = async () => {
		try {
			const response = await fetch(`${apiUrl}/get-highlights/${songId}`)
			const data = await response.json()
			console.log(data)
			setSongHighlights(data.highlights)
		} catch (error) {
			console.error("Failed to get highlights: ", error)
		}
	}

	const translationInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.preventDefault()
		setTranslationInput(e.target.value)
	}


	// jsx
	return (
		<div className="window-wrapper column-wrapper scroll-smooth">
			{isLoading && 
				<div 
					className="z-[999] fixed top-0 left-0 w-full h-full bg-black/[.5] flex justify-center items-center"
					>
					<Spinner />
				</div>
			}
			<div className="left-column flex flex-col gap-3">
				<div id="song-metadata">
					<h1>{songName}</h1>
					<h1>By: {songArtist}</h1>
				</div>
				<div className="border-t max-w-[40vw] border-gray-400"></div>
				<h1 id="lyrics">
					{songLyrics.split("\n").map((line, lineIndex) => (lineIndex > 1 ?
						<React.Fragment key={lineIndex}>
							{line}
							<br />
						</React.Fragment> : null
					))}
				</h1>
			</div>

			<div className="relative right-column flex flex-col gap-2">
				<div className="fixed flex flex-col gap-2 self-center">
					<h1 className="text-lg text-white text-center">{currentSelection}</h1>
					<textarea className="rounded-lg text-black pl-1 pr-1" value={translationInput} onChange={translationInputChange} placeholder="Enter translation, description, or notes" />
					<button className="border hover:scale-[102%] text-gray-200 rounded-lg" onClick={highlightSelectedText}>Highlight</button>
					

					{/* Instructions */}
					<div className="mt-3">
						<h1 className="">Adding a highlight:</h1>
						<ol className="list-decimal list-inside">
							<li>Enter the translation</li>
							<li>Select the text to highlight</li>
							<li>Click on the highlight button</li>
						</ol>
					</div>
					<div>
						<h1 className="">Editing a highlight:</h1>
						<ol className="list-decimal list-inside">
							<li>Click on the pre-existing highlight</li>
							<li>Edit the highlight in the textarea</li>
							<li>Click on the highlight button to submit the change</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	)
}
// startline, endline, start offset, end offset
export default HighlightsComponent
