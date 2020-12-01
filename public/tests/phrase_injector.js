function writePhrase() {
	// NOTE: Each phrase ends with a single whitespace
	let phrases = [
		"Great! ",
		"Nicely Done! ",
		"Well Done! ",
		"That Went Great! ",
		"Perfect! ",
		"Awesome! ",
		"Fine Work! ",
		"Super! ",
		"Marvelous! ",
		"Fantastic! ",
		"Fabulous! ",
	]
	
	let phrase = phrases[Math.floor(Math.random() * phrases.length)];
	
	if (!phrase){
		console.log("Problem with loading phrase.")
		return "Great! ";
	}
	else {
		return phrase;
	}
}