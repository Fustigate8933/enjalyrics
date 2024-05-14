"use client"
import TranslationPopup from "./TranslationPopup"
import React, { useState, useEffect } from "react"

interface HighlightsProps {
	songName: string,
	artist: string
}

const Highlights: React.FC<HighlightsProps> = ({ songName, artist }) => {
	const [highlighted, setHighlighted] = useState({
		text: "",
		translation: "",
		position: { x: 0, y: 0 },
	})

	const [highlights, setHighlights] = useState<{ id: number, text: string, translation: string }[]>([])
	const [translationPopup, setTranslationPopup] = useState({
		visible: false,
		text: "",
		position: { x: 0, y: 0 },
	});

	const handleTranslationChange = (translation: string) => {
		setHighlighted((prevState) => ({
			...prevState,
			translation
		}))
	}

	const fetchHighlights = async () => {
		try {
			const response = await fetch(`http://127.0.0.1:8000/highlights/${songName}/${artist}`);
			const data = await response.json();
			setHighlights(data);
		} catch (error) {
			console.error("Error fetching highlights:", error);
		}
	};

	const handleSubmitTranslation = async (text: string, translation: string) => {
		try {
			const payload = {
				highlighted_text: text, 
				translation: translation, 
				x_pos: highlighted.position.x, 
				y_pos: highlighted.position.y, 
				song_name: songName, 
				artist: artist 
			}
			console.log(JSON.stringify(payload))
			const response = await fetch("http://127.0.0.1:8000/highlights", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
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

	useEffect(() => {
		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (selection !== null){
				console.log("Selection changed")
				const selectedText = selection.toString();
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				setHighlighted({
					text: selectedText,
					translation: "",
					position: { x: Math.floor(rect.x), y: Math.floor(rect.y) },
				});
			}
		}

		document.addEventListener("mouseup", handleSelectionChange)

		return () => {
			document.removeEventListener("mouseup", handleSelectionChange)
		}
		}, [])

	return (
		<div>
			hi
			{highlights.map((highlight) => (
				<span
					key={highlight.id}
					onMouseOver={(e) => {
						// Show the translation popup when hovering over the highlighted text
						setTranslationPopup({
							visible: true,
							text: highlight.translation,
							position: {
								x: e.currentTarget.offsetLeft,
								y: e.currentTarget.offsetTop - 50,
							},
						});
					}}
					onMouseLeave={() => {
						// Hide the translation popup when mouse leaves the highlighted text
						setTranslationPopup({ visible: false, text: "", position: { x: 0, y: 0 } });
					}}
				>
					{highlight.text}{" "}
				</span>
			))}

			{translationPopup.visible && (
				<div
					style={{
						position: "absolute",
						left: translationPopup.position.x,
						top: translationPopup.position.y,
						backgroundColor: "white",
						border: "1px solid black",
						padding: "5px",
					}}
				>
					{translationPopup.text}
				</div>
			)}

			{highlighted.text && (
        <TranslationPopup
          text={highlighted.text}
          position={highlighted.position}
          onTranslationChange={handleTranslationChange}
					onSubmitTranslation={handleSubmitTranslation}
        />
      )}
		</div>
	)
}

export default Highlights

