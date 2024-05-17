import React, { useState, useEffect } from "react"

interface TranslationPopupProps {
	text: string,
	position: { x: number, y: number },
	onTranslationChange: (translation: string) => void,
	onSubmitTranslation: (text:string, translation: string) => void,
	onDeleteTranslation: (id: number) => void,
	id: number,
	already_in: boolean,
	jp: string
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
	text,
	position,
	onTranslationChange,
	onSubmitTranslation,
	onDeleteTranslation,
	id,
	already_in,
	jp
}) => {
	const [translation, setTranslation] = useState(text)
	
	const handleTranslationChange =	(e: React.ChangeEvent<HTMLInputElement>) => {
		setTranslation(e.target.value)
		onTranslationChange(e.target.value)
	}

	const handleSubmitTranslation = () => {
		onSubmitTranslation(text, translation)
	}

	const handleDeleteTranslation = () => {
		onDeleteTranslation(id)
	}

	return (
		<div
			className="bg-black border border-black border-solid p-2 rounded-lg" 
			style={{
				position: "absolute",
        left: position.x,
        top: position.y - 80 + (window.scrollY)
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
					placeholder={jp}
					id="translation-input"
				/>
				<button className="hover:cursor-pointer bg-green-300 text-black rounded-lg px-2" onClick={handleSubmitTranslation}>
					Submit
				</button>
				{already_in ? (
					<button className="hover:cursor-pointer bg-red-400 text-black rounded-lg px-2" onClick={handleDeleteTranslation}>
						Delete
					</button>
				) : null}
			</div>
		</div>
	)
}

export default TranslationPopup
