export default function sketch (p){
	let angle = 0;
	let maxD;

	p.setup = function() {
	  	p.createCanvas(p.windowWidth*0.75, p.windowHeight*0.75, p.WEBGL);
	  	p.background(0);
	  	maxD = p.dist(0, 0, 200, 20);
	}

	p.windowResized = function(){
		p.resizeCanvas(p.windowWidth*0.75,p.windowHeight*0.75)
	}

	p.draw = function() {
	  	p.background(0);
	  	p.translate(-p.width/3, -p.height/6, 0);

	  	p.rotateX(-p.QUARTER_PI*1.1);
	  	p.rotateY(p.QUARTER_PI);

		p.rectMode(p.CENTER);
	  	p.pointLight(255, 128, 0, -1, -1, 1);

		for (let i = 0; i < p.width-p.width/2; i+=p.width/20) {
			 	for (let j = 0; j < p.width-p.width/2; j+=p.width/20) {
			   	p.push();
			   	let d = p.dist(j, i, (p.width-p.width/2)/2, (p.width-p.width/2)/2);
			   	let offset = p.map(d, 0, maxD, -p.PI, p.PI);
			   	let a = angle + offset;
			   	let h = p.floor(p.map(p.sin(a), -1, 1, 1, 150));
			   	p.translate(j, 0, i);
			   	p.box(p.width/20-2, h, p.width/20-2);
			   	a += 0.1;
			   	offset += 0.01;
			   	p.pop();
			 	}
			}
			angle += 0.1;
		}
	}
