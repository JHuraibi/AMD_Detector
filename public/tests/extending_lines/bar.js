function Bar(numBar, seedY) {
	this.x = 0;
	this.length = 0;
	this.randDist = 0;
	this.visible = true;
	this.manualYAdjust = 60;
	this.cornerRad = 10;

	this.y = ((height / numBar) + 1) * seedY + (this.manualYAdjust);

	this.toggleView = function () {
		this.visible = !this.visible;
	}

	this.show = function () {
		if (this.visible) {
			noStroke();
			var c = this.cornerRad;
			rect(this.x, this.y, this.length, 20);
			rect(this.x, this.y, this.length + c, 20, 0, c, c, 0);
		}
	}

	this.move = function () {
		this.x += this.length;
		this.length = int(random(50, 100));
	}
}