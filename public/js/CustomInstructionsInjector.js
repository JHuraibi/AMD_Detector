// CHECK: Might be able to just use an array or string var
// and then display the right var using <script>

function retrieveInstructions(target_test) {

	switch (target_test) {
		case "full_bars":
			return "This is a custom instruction string variable being injected.";
		default:
			return "[DEBUG] - No value returned";
	}
}