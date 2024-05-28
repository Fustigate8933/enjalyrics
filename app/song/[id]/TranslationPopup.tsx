import React, { useState, useEffect } from "react"

interface TranslationPopupProps {
	text: string,
	position: { x: number, y: number },
	onTranslationChange: (translation: string) => void,
	onSubmitTranslation: (translation: string) => void,
	onDeleteTranslation: (id: number) => void,
	id: number,
	already_in: boolean,
	jp: string,
	start: number,
	end: number
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
	text,
	position,
	onTranslationChange,
	onSubmitTranslation,
	onDeleteTranslation,
	id,
	already_in,
	jp,
	start,
	end
}) => {
	const [inputTranslation, setTranslation] = useState(text)

	const handleTranslationChange =	(e: React.ChangeEvent<HTMLInputElement>) => {
		setTranslation(e.target.value)
		onTranslationChange(e.target.value)
	}

	const handleSubmitTranslation = () => {
		onSubmitTranslation(inputTranslation)
	}

	const handleDeleteTranslation = () => {
		onDeleteTranslation(id)
	}

	return (
		<div className="fixed right-column flex flex-col gap-3 text-xl">
			<h1>日本語: {jp || <span className="text-red-400">None detected</span>}</h1>
			<h1>User Translation: {text || <span className="text-red-400">None detected</span>}</h1>
			<h1>Start: {start}, end: {end}</h1>
			<input 
				type="text"
				className="text-black p-1 rounded-md min-w-20 bg-gray-300"
				value={inputTranslation}
				onChange={handleTranslationChange}
				placeholder={jp}
				id="translation-input"
			/>
			{(text !== "") ? 
			<button className="hover:cursor-pointer bg-green-300 text-black rounded-lg px-2" onClick={handleSubmitTranslation}>
				Submit
			</button>
				: null
			}
			{already_in ? (
				<button className="hover:cursor-pointer bg-red-400 text-black rounded-lg px-2" onClick={handleDeleteTranslation}>
					Delete
				</button>
				) : null}

			{/*
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
			*/}
		</div>
	)
}

export default TranslationPopup
