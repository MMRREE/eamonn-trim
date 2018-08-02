export default function sketch (p){
	let floor = 5;

	class Snow {
		constructor(){
			this.seed = p.random(0,1)
			this.x = p.random(p.width);
			this.y = p.random(p.height);
			this.z = p.random(4, 10);
			this.speed = this.z/4;
			this.angle = p.random(0, p.TWO_PI);
			this.alpha = p.random(100, 200);
		}

		reset = function(){
			this.x = p.random(p.width);
			this.y = p.random(-20, -10);
			this.z = p.random(2, 10);
			this.speed = this.z/4;
			this.angle = p.random(0, p.TWO_PI);
			this.alpha = p.random(100, 200);
			floor += 0.01;
		}

	 	update = function() {
			this.x += this.seed*p.sin(this.angle);
			this.y+=this.speed;
			this.angle += 0.05;
			if (this.y > p.height-floor) this.reset();
			this.show();
		}

		show=function(){
			p.fill(255, this.alpha);
			p.ellipse(this.x, this.y, this.z, this.z);
		}
	}

	let snows = [];

	p.setup = function(){
		p.createCanvas(p.windowWidth*0.75, p.windowHeight*0.75);
		for (let i = 0; i < 100; i++) {
			snows.push(new Snow());
		}
		p.background(5);
	}

	p.windowResized = function(){
		p.resizeCanvas(p.windowWidth*0.75, p.windowHeight*0.75)
	}

	p.draw=function(){
		p.background(5);
		for(let i = 0; i < snows.length; i++){
	 		snows[i].update();
		}

		p.fill(225);
		p.rect(0, p.height, p.width, -floor);
	}
}
