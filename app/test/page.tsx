"use client"
import React, { useState } from 'react';

function HighlightableText() {
	const [highlightedText, setHighlightedText] = useState('');

	const handleTextSelection = () => {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			const range = selection.getRangeAt(0);
			const selectedText = range.toString();
			setHighlightedText(selectedText);
			// Apply highlight to the selected text
			const span = document.createElement('span');
			span.className = 'highlighted';
			range.surroundContents(span);
		}
	};

	function wrapSelectedText() {       
		var selection= window.getSelection().getRangeAt(0);
		var selectedText = selection.extractContents();
		var span= document.createElement("span");
		span.style.backgroundColor = "yellow";
		span.appendChild(selectedText);
		selection.insertNode(span);
	}
	return (
		<div className="window-wrapper">
			<h1>poig<br/>pi</h1>
			<p>Select and highlight text:</p>
			<div className="highlightable">
				This is a paragraph of text that can be selected and highlighted.
			</div>
			<style>
				{`
.highlighted {
background-color: yellow;
}
.highlightable {
cursor: text;
}
`}
			</style>
			<button onClick={wrapSelectedText}>Highlight</button>

		</div>
	);
}

export default HighlightableText;

