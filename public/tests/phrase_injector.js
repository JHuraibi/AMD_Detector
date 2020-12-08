/**
 * (Fluff) Returns a random "happy" phrase that is shown on the popup window that
 * 	occurs between when the left eye test ends and the right eye begins.
 * To see an example -> full_bars.html:121, as of Dec 6, 2020
 *
 * @returns {string}
 */
function writePhrase() {
	// NOTE: Notice that each phrase ends with a single whitespace
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
	
	let index = Math.floor(Math.random() * phrases.length);
	let phrase = phrases[index];
	
	if (!phrase){
		console.log("Problem with loading phrase.")
		return "Great! ";
	}
	else {
		return phrase;
	}
}