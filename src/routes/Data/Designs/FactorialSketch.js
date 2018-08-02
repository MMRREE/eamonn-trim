export default function sketch (p){
	let angle = p.PI/4;

	p.setup = function() {
	  	p.createCanvas(p.windowWidth*0.75, p.windowHeight*0.75);
	}

	p.windowResized = function(){
		p.resizeCanvas(p.windowWidth*0.75, p.windowHeight*0.75)
	}

	p.branch = function(len) {
	  	p.line(0, 0, 0, -len);
	  	p.translate(0, -len);
	  	if (len > 2) {
	    	p.push();
	    	p.rotate(angle);
	    	p.branch(len*0.66);
	    	p.pop();
	    	p.push();
	    	p.rotate(-angle);
	    	p.branch(len*0.66);
	    	p.pop();
	  	}
	}

	p.draw = function() {
	  	p.background(51);
	  	p.stroke(255);
	  	p.translate(p.width/2, p.height);
	  	p.branch(p.height/4);
	}

}
