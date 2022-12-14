let canvas = document.querySelector('#cai_hong'),
	speedSelect = document.querySelector('#speed'),
	width = 300,
	height = 300,
	ctx = canvas.getContext('2d'),
	pSystemSize = 1000,
	deform = {a:100, s:0.4, min:-200, max:200, dir:1}; // a=4 is natural if not animated;

const mcos = Math.cos,
	  msin = Math.sin,
	  mpow = Math.pow,
	  PI180=Math.PI / 180,
	  tau = Math.PI * 2;

canvas.width = width;
canvas.height = height;
ctx.lineWidth = 1;

const ParticleSystem = function(num){
	this.scalar = 8;
	this.numParticles = num;
	this.allParticles = [];
	this.x = width * .5;
	this.y = height * .5;
	this.generate();
}
ParticleSystem.prototype.generate = function(){
	for(let i=0; i<this.numParticles; i++){
		let vo = {};
		vo.degrees = (360 / this.numParticles) * i * PI180;
		vo.parent = this;
		vo.x = width / 2;
		vo.y = height / 2;
		vo.vx = 0;
		vo.vy = 0;
		this.allParticles.push(new Particle(vo));
	}
}
ParticleSystem.prototype.update = function(){
	for(let i=0; i<this.allParticles.length; i++){
		this.allParticles[i].update();
	}
}

const Particle = function(vo){
	this.degrees = vo.degrees;
	this.parent = vo.parent;
	this.x = vo.x;
	this.y = vo.y;
	this.vx = 0;
	this.vy = 0;
	this.colour = 'hsl(' + (Math.round((this.degrees * (180/Math.PI)))) + ',100%,50%)';
}
Particle.prototype.update = function(){
	// http://mathworld.wolfram.com/HeartCurve.html
	this.vx = 16 * mpow(msin(this.degrees), 3) * deform.dir;
	this.vy = ((13 * mcos(this.degrees)) - 
			   (6 * mcos(2 * this.degrees)) - // 5
			   (2 * mcos(3 * this.degrees)) -
			   (mcos(deform.a * this.degrees))) * -1;
	
	// update position
	this.x = this.vx * this.parent.scalar + this.parent.x;
	this.y = this.vy * this.parent.scalar + this.parent.y;
}

function update(){
	if(deform.dir === 1){
		if(deform.a > deform.min){
			deform.a -= deform.s;
		}
		else{
			flipDirection();
		}
	}
	else{
		if(deform.a < deform.max){
			deform.a += deform.s;
		}
		else{
			flipDirection();
		}
	}
	system.update();
}
function flipDirection(){
	deform.dir *= -1;
}

function draw(){
	ctx.clearRect(0, 0, width, height);
	ctx.save();
	for(let i=0; i<system.numParticles; i++){
		let p = system.allParticles[i];
		ctx.fillStyle = p.colour;
		ctx.beginPath();
		ctx.arc(p.x, p.y, 1, 0, tau, false);
		ctx.fill();
	}
	ctx.restore();
}
function animate(){
	update();
	draw();
	requestAnimationFrame(animate);
}
let system = new ParticleSystem(pSystemSize);
animate();