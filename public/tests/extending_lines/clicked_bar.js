function ClickedBar(bar) {
	this.x = bar.x;
	this.y = bar.y;
	this.length = bar.length;
	this.height = 20;

	this.show = function () {
		noStroke();
		fill('#ac2188');
		rect(this.x, this.y, this.length, this.height);
	}
}