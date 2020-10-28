function retrieveTestTitle(target_test) {
	switch (target_test) {
		default:
			return "";
		
		case "amsler_grid":
			return "Amsler Grid";
		
		case "growing_circles":
			return "Growing Circles";
		
		case "symbols":
			return "Symbols";
		
		case "full_bars":
			return "Full Bars";
	}
}

function retrieveInstructions(target_test) {
	switch (target_test) {
		default:
			return "[DEBUG] - NO INSTRUCTIONS RETURNED FROM FUNCTION"; // !! FOR TESTING
		// return "";
		
		// AMSLER GRID
		case "amsler_grid":
			return "You are about to take the Amsler Grid test. You will need to start by cupping the eye that isn't being tested.\n" +
			 "Focus on the black dot in the center. Press next after timer is zero.";
		
		// GROWING CIRCLES
		case "growing_circles":
			return "This test will detect AMD by analyzing if you have any blind spots in your vision. Start by covering\n" +
				"your\n" +
				"right eye\n" +
				"and click the \"Start Test\" button. Keep your eye on the black dot in the center of the grid. Everytime\n" +
				"you\n" +
				"notice a\n" +
				"small red circle appear on the screen, click the \"seen\" button.";
		
		// SYMBOLS
		case "symbols":
			return "You will need to start by cupping your right eye with your hand." +
				" Focus on the black dot in the center " +
				"You will see random objects appearing on the screen " +
				"if you see \"+\" press \"A\", \"-\" press \"S\", \"x\" press \"X\", and \"÷\" press \"D\"";
		
		// FULL BARS
		case "full_bars":
			return "Shut one eye. " +
				"Focus on black dot in the center. If any of the bars are broken or are bent " +
				"click your mouse anywhere on the window. \n\n\n" +
				"When you are ready to begin the test click the \"Start Test\" button below.";
	}
}

// Default case will return '#' which will make the button not change the page
function retrieveURLLink(target_test) {
	switch (target_test) {
		default:
			return "#";
		case "amsler_grid":
			return "./AmslerGrid/Amsler.html";
		case "growing_circles":
			return "./growingCircles/growingCircle.html";
		case "symbols":
			return "./symbols_test/symbolsTest.html";
		case "full_bars":
			return "./full_bars/full_bars.html";
	}
}