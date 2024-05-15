import React, { useState, useEffect } from "react"

interface TranslationPopupProps {
	text: string,
	position: { x: number, y: number },
	onTranslationChange: (translation: string) => void,
	onSubmitTranslation: (text:string, translation: string) => void,
	onDeleteTranslation: (id: number) => void,
	lineId: number,
	id: number,
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
	text,
	position,
	onTranslationChange,
	onSubmitTranslation,
	onDeleteTranslation,
	lineId,
	id
}) => {
	const [translation, setTranslation] = useState(text)
	const [popupWidth, setPopupWidth] = useState(0)
	
	const handleTranslationChange =	(e: React.ChangeEvent<HTMLInputElement>) => {
		setTranslation(e.target.value)
		onTranslationChange(e.target.value)
	}

	const handleSubmitTranslation = () => {
		onSubmitTranslation(text, translation)
	}

	const handlePopupWidthChange = (width: number) => {
		setPopupWidth(width)
	}

	const handleDeleteTranslation = () => {
		onDeleteTranslation(id)
	}

	const centerX = position.x - popupWidth / 2

	return (
		<div
			className="bg-black border border-black border-solid p-2 rounded-lg" 
			style={{
				position: "absolute",
        left: centerX,
        top: position.y - 80
			}}
			onLoad={() => {
				const popupElement = document.getElementById("translation-popup")
				if (popupElement){
					handlePopupWidthChange(popupElement.offsetWidth)
				}
			}}
			id="translation-popup"
			>
			<p>{translation}</p>
			<div className="flex gap-2 mt-1">
				<input
					type="text"
					className="text-black p-1 rounded-md min-w-20"
					value={translation}
					onChange={handleTranslationChange}
					placeholder="Enter translation"
					id="translation-input"
				/>
				<button className="hover:cursor-pointer bg-green-300 text-black rounded-lg px-2" onClick={handleSubmitTranslation}>
					Submit
				</button>
				{translation !== "" ? (
					<button className="hover:cursor-pointer bg-red-400 text-black rounded-lg px-2" onClick={handleDeleteTranslation}>
						Delete
					</button>
				) : null}
			</div>
		</div>
	)
}

export default TranslationPopup
