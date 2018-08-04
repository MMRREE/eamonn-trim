export default function sketch (p){

	let colIndex = [255, 255, 128, 0, 0, 0, 0, 0, 128, 255, 255, 255]
	let shapeRInd = [5, 5.773502692, 7.071067812, 8.506508084, 10, 11.52382435, 13.06562965, 14.619022, 16.18033989, 17.74732766, 19.31851653, 20.89290734, 22.46979604, 24.04867172, 25.62915448, 27.21095576, 28.79385242, 30.3776691, 31.96226611];
	let SHAPES = 13+2;
	let SW = 1.5;
	let dots = [];
	let sf = 25;

	class Dots{
		constructor(points, radius){
			this.reset = points;
			this.xPoints = [];
			this.yPoints = [];
			this.x = 0;
			this.y = 0;
			let angle = p.TWO_PI / points;
		  	for (let m = 0; m < p.TWO_PI; m += angle) {
		    	let sx = this.x + p.cos(m) * radius;
		    	let sy = this.y + p.sin(m) * radius;
		    	this.xPoints.push(sx)
				this.yPoints.push(sy)
		  	}
			this.xNext = 0;
			this.yNext = 0;
			this.ind = ((this.reset-this.reset%2)/2)-1;
			if(points%6 === 0) this.ind--;
			if(points === 5 || points === 7 || points === 11 || points === 13) this.ind++; // <- prime numbers index needs to be added by one
			this.counter = 999;
			this.start = true;
		}

	  update(){
		 	if(this.start){
				this.xNext = this.xPoints[(this.ind+1)%this.reset];
				this.yNext = this.yPoints[(this.ind+1)%this.reset];
				this.x = this.xPoints[this.ind%this.reset];
				this.y = this.yPoints[this.ind%this.reset];
				this.dx = (this.xNext-this.x)/sf;
				this.dy = (this.yNext-this.y)/sf;
				this.x += (0.5*sf)*this.dx;
				this.y += (0.5*sf)*this.dy;
				this.ind++;
				this.counter = sf/2;
				this.start = false;
		 	}
		 	else if(this.counter+1 > sf){
				this.xNext = this.xPoints[(this.ind+1)%this.reset];
				this.yNext = this.yPoints[(this.ind+1)%this.reset];
				this.x = this.xPoints[this.ind%this.reset];
				this.y = this.yPoints[this.ind%this.reset];
				this.dx = (this.xNext-this.x)/sf;
				this.dy = (this.yNext-this.y)/sf;
				this.x += this.dx;
				this.y += this.dy;
				this.ind++;
				this.counter = 1;
		 	} else {
				this.x += this.dx;
				this.y += this.dy;
				this.counter++;
		 	}
		 	this.show();
	  	}

	  	show(){
		 	p.fill(0);
		 	p.stroke(0);
		 	p.ellipse(this.x, this.y, 5, 5);
	  	}
	}

	p.setup = function(){
	  	p.createCanvas(p.windowWidth*0.75, p.windowHeight*0.75);
	  	p.background(250);
		for(let i = 0; i < SHAPES; i++){
			if(i >= 2)dots.push(new Dots(i, (p.width+p.height)/130*shapeRInd[(i-2)]))
			else dots.push(new Dots(i, 0))
		}
	}

	p.windowResized = function(){
		p.resizeCanvas(p.windowWidth*0.75, p.windowHeight*0.75)
		p.background(250);
		dots =[];
		for(let i = 0; i < SHAPES; i++){
			if(i >= 2)dots.push(new Dots(i, (p.width+p.height)/130*shapeRInd[(i-2)]))
			else dots.push(new Dots(i, 0))
		}
	}

	p.polygon = function(x, y, radius, npoints,  c1,  c2,  c3) {
	  	let angle = p.TWO_PI / npoints;
	  	p.beginShape();
	  	for (let m = 0; m < p.TWO_PI; m += angle) {
	    	let sx = x + p.cos(m) * radius;
	    	let sy = y + p.sin(m) * radius;
	    	p.strokeWeight(SW);
	    	p.stroke(c1, c2, c3);
	    	p.vertex(sx, sy);
	  	}
	  	p.endShape(p.CLOSE);
	}

	p.draw = function(){
	  	p.translate(p.width/2, p.height/2);
	  	p.rotate(3*p.PI/2);
	  	p.background(250);

	  	for(let i = 2; i < SHAPES; i++){
	    	p.push();
	    	p.noFill();
	    	p.stroke(255*i%2, 255*i%3, 255*i%4);
	    	if(i%3 === 0) p.rotate(p.TWO_PI/i);
	    	if(i%2 === 0) p.rotate(p.PI/i);
	    	//height/2-(SHAPES-i)*height/33 <- old r method
	    	//height/2+shapeRInd[(i-3)]
	    	p.polygon(0, 0, (p.width+p.height)/130*shapeRInd[(i-2)], i, colIndex[(i-2)%12], colIndex[(i+3)%12], colIndex[(i)%12]);
	    	p.pop();
	  	}

	  	for(let i = 2; i < dots.length; i++){
	    	p.push();
	    	if(i%3 === 0) p.rotate(p.TWO_PI/i);
	    	if(i%2 === 0) p.rotate(p.PI/i);
			p.fill(0);
		 	p.stroke(0);
	    	dots[i].update();
			//p.ellipse(dots[i].x,dots[i].y, 20, 20)
	    	p.pop();
	  	}
	}
}
