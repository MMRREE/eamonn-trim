export default function sketch (p){

	let speed;

	class Star {
	  	constructor() {
	    	this.x = p.random(-p.width, p.width);
	    	this.y = p.random(-p.height, p.height);
	    	this.z = p.random(p.width);
	    	this.pz = this.z;
	  	}

	 	update = function() {
	    	this.z = this.z - speed;
	    	if (this.z < 1) {
	      	this.z = p.width;
	      	this.x = p.random(-p.width, p.width);
	      	this.y = p.random(-p.height, p.height);
	      	this.pz = this.z;
	    	}
	  	}

	 	show = function() {
	    	p.fill(255);
	    	p.noStroke();

	    	let sx = p.map(this.x / this.z, 0, 1, 0, p.width);
	    	let sy = p.map(this.y / this.z, 0, 1, 0, p.height);

		   let r = p.map(this.z, 0, p.width, 16, 0);

		   p.ellipse(sx, sy, r/3, r/3);

	    	let px = p.map(this.x / this.pz, 0, 1, 0, p.width);
	    	let py = p.map(this.y / this.pz, 0, 1, 0, p.height);

	    	p.stroke(255);
	    	p.line(px, py, sx, sy);
	  	}
	}

	let stars = [];

	p.setup = function() {
	  	p.createCanvas(p.windowWidth*0.75, p.windowHeight*0.75);
	  	for (let i = 0; i < 100; i++) {
	    	stars[i] = new Star();
	  	}
	}

	p.windowResized = function(){
		p.resizeCanvas(p.windowWidth*0.75, p.windowHeight*0.75)
	}

	p.draw = function() {
	  	speed = 125;
	  	p.background(0);
	  	p.translate(p.width/2, p.height/2);
	  	for (let i = 0; i < stars.length; i++) {
	    	stars[i].update();
	    	stars[i].show();
	  	}
	}

}
