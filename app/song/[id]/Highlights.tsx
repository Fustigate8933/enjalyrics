"use client"

import React, { useState, useEffect, useRef } from "react"

interface HighlightsProps {
	songName: string,
	songArtist: string,
	songId: number,
	songLyrics: string
}

const HighlightsComponent: React.FC<HighlightsProps> = ({ songName, songArtist, songId, songLyrics }) => {
	// states go here
	const [totalLyricLength, setTotalLyricLength] = useState(0)


	// effects go here
	useEffect(() => {
		if (lyricsRef.current) {
			setTotalLyricLength(lyricsRef.current.innerText.length)
		}
	}, [])


	// refs go here
	const lyricsRef = useRef<HTMLDivElement>(null)


	// helper functions go here
	const highlightSelectedText = () => {
		var selection = window.getSelection()
		if (selection !== null){
			var range = selection.getRangeAt(0)

			const anchor = selection.anchorNode
			console.log(anchor.textContent)

			const children = document.getElementById("lyrics")?.childNodes
			var br_count = 0
			if (children){
				for (var i = 0; i < children.length; i++){
					const child = children[i]
					if (child.nodeType === Node.ELEMENT_NODE) {
						br_count += child.querySelectorAll("br").length + (child.nodeName === "BR")
					}
					if (child.isSameNode(anchor)){
						console.log(br_count)
						break
					}
				}
			}

			console.log(`start offset: ${range.startOffset}, end offset: ${range.endOffset}`)

			var selectedText = range.extractContents()
			var span = document.createElement("span")

			span.style.backgroundColor = "gray"
			span.style.cursor = "pointer"

			span.appendChild(selectedText)
			span.onclick = () => { // add event listener to execute function on click
				var parent = span.parentNode
				if (parent) {
					while (span.firstChild) {
						parent.insertBefore(span.firstChild, span)
					}
					parent.removeChild(span)
				}
			}
			range.insertNode(span)

		}
	}



	// jsx
	return (
		<div className="window-wrapper column-wrapper scroll-smooth">
			<div className="left-column flex flex-col gap-3">
				<div id="song-metadata">
					<h1>{songName}</h1>
					<h1>By: {songArtist}</h1>
				</div>
				<div className="border-t max-w-[40vw] border-gray-400"></div>
				<h1 ref={lyricsRef} id="lyrics">
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
					Edit highlight
					<button className="border hover:scale-[102%] bg-gray-800 rounded-lg" onClick={highlightSelectedText}>Highlight</button>
				</div>
			</div>
		</div>
	)
}
// startline, endline, start offset, end offset
export default HighlightsComponent
