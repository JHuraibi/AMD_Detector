// CHECK: Might be able to just use an array or string var
// and then display the right var using <script>

function retrieveInstructions(target_test) {

	switch (target_test) {
		default:
			return "[DEBUG] - RETURNED FROM FUNCTION";
		// GROWING CIRCLES
		case "growing_circles":
			return "This test will detect AMD by analyzing if you have any blind spots in your vision. Start by covering\n" +
				"\t\t\t\t\tyour\n" +
				"\t\t\t\t\tright eye\n" +
				"\t\t\t\t\tand click the \"Start Test\" button. Keep your eye on the black dot in the center of the grid. Everytime\n" +
				"\t\t\t\t\tyou\n" +
				"\t\t\t\t\tnotice a\n" +
				"\t\t\t\t\tsmall red circle appear on the screen, click the \"seen\" button.";
		// PARALLEL LINES
		case "parallel_lines":
			return "Shut one eye. " +
				"Focus on black dot in the center. If objects appear distorted click the \"Distorted\" button." +
				"When you are ready to being click the \"Start Test\" button below.";

		// FULL BARS
		case "full_bars":
			return "Shut one eye. " +
				"Focus on black dot in the center. If any of the bars are broken or are bent " +
				"click your mouse anywhere on the window. \n\n\n" +
				"When you are ready to being the test click the \"Start Test\" button below.";
	}
}

// Default case will return '#' which will make the button not change the page
function retrieveURLLink(target_test) {
	switch (target_test) {
		default:
			return "#";
		case "growing_circles":
			return "./growingCircles/growingCircle.html";
		case "parallel_lines":
			return "./parallel_line/parallelline.html";
		case "full_bars":
			return "./full_bars/full_bars.html";
	}
}