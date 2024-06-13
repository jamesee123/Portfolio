const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
let mutationRatee = 0.2;
// let mutationRatee = parseFloat(prompt("What mutation rate do you want it to be?"));
const paddleHeight = grid * 5; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;
var balls = []
var paddles = []
var savedPaddles = [];
var paddleSpeed = 4;
var ballSpeed = 5;
class Paddle {
	constructor(brain, number) {
		this.x = canvas.width - grid * 3;
		this.y = canvas.height / 2 - paddleHeight / 2;
		this.pastY=this.y;
		this.width = grid;
		this.height = paddleHeight;
		this.score = 0;
		this.number = number;
		this.ballToCollide = balls[number];
		this.brain = brain;
		this.alive = true;
		this.fitness;
		// paddle velocity
		this.dy = 1;
		this.color = "rgb(" + (this.brain.bias_h.data[0] * 125 + 125) + "," + (this.brain.bias_h.data[1] * 125 + 125) + "," + ((this.brain.bias_h.data[2] * this.brain.bias_h.data[3]) * 125 + 125) + ")";
		// console.log(this.color);
	}

	prep() {
		this.alive = true;
		this.ballToCollide = balls[this.number];
	}
	
	mutate() {
		this.brain.mutate(mutationRatee);
	}

	update() {
		//for (let n = 0; n < parseInt(document.getElementById("speed").value); n++) {
		var toInput = [];
		if (this.alive) {
			toInput[0] = this.ballToCollide.x;
			toInput[1] = this.ballToCollide.y;
			toInput[2] = this.y;
			toInput[3] = this.pastY;
			var output = this.brain.predict(toInput);
			this.pastY = this.y;
			if (output[0] > output[1]) {
				this.y += 7;
			}
			else {
				this.y -= 7;
			}
			// this.score += Math.abs(this.pastY - this.y) / 500;
			// prevent paddles from going through walls
			if (this.y < grid) {
				this.y = grid;
			}
			else if (this.y > maxPaddleY) {
				this.y = maxPaddleY;
			}
		}
		//}
	}
	draw() {
		if (this.alive) {
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
};
class Ball {
	// start in the middle of the game
	constructor(number) {
		this.x = 0;
		this.y = Math.random() * canvas.height * 0.9;
		this.width = grid;
		this.height = grid;
		this.number = number;
		// keep track of when need to reset the ball position
		this.resetting = false;

		// ball velocity (start going to the top-right corner)
		this.dx = ballSpeed;
		this.dy = -ballSpeed;
		this.paddleToCollide = paddles[number];
	}
	prep() {
		this.paddleToCollide = paddles[this.number];
		this.color = this.paddleToCollide.color;
	}
	distance() {
		return Math.abs(this.paddleToCollide.y - this.y);
	}
	update() {
		//for (let n = 0; n < parseInt(document.getElementById("speed").value); n++) {
		this.x += this.dx; // + parseInt(speedInput.value);
		this.y += this.dy; // + parseInt(speedInput.value);
		// * speedInput.value;

		// prevent ball from going by changing its velocity through walls 
		if (this.y < grid) {
			this.y = grid;
			this.dy *= -1;
		}
		else if (this.y + grid > canvas.height - grid) {
			this.y = canvas.height - grid * 2;
			this.dy *= -1;
		}

		// reset ball if it goes past paddle (but only if we haven't already done so)
		if (this.x < 0) {
			this.x = 0;
			this.dx = -this.dx;
		}

		if (this.x > canvas.width && this.paddleToCollide.alive == true) {
			this.paddleToCollide.score += (585 - this.distance()) / 585;
			this.paddleToCollide.alive = false;
			var allDead = true;
			savedPaddles.push(this.paddleToCollide);

			for (let dpaddle of paddles) {
				if (dpaddle.alive == true) {
					allDead = false;
					break;
				}
			}
			if (allDead) {
				nextGeneration();
			}
			// if (balls.length > 51){
			// 	console.log("There are too many balls");
			// }
			// if (paddles.length > 51){
			// 	console.log("There are too many paddles");
			// }

		}

		// check to see if ball collides with paddle. if they do change x velocity

		// move ball next to the paddle otherwise the collision will happen again
		// in the next frame
		if (collides(this, this.paddleToCollide)) {
			this.dx *= -1;
			this.dx -= (Math.random()*0.02+0.03) * paddleSpeed;
			if (this.dy < 0) {
				this.dy -= (Math.random()*0.02+0.03) * paddleSpeed;
			}
			else {
				this.dy += (Math.random()*0.02+0.03) * paddleSpeed;
			}
			this.paddleToCollide.score += 2;
			// move ball next to the paddle otherwise the collision will happen again
			// in the next frame
			this.x = this.paddleToCollide.x - this.width;
		}
		//}
	}

	draw() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
	return obj1.x < obj2.x + obj2.width &&
		obj1.x + obj1.width > obj2.x &&
		obj1.y < obj2.y + obj2.height &&
		obj1.y + obj1.height > obj2.y;
}
for (var i = 0; i < 100; i++) {
	paddles.push(new Paddle(new NeuralNetwork(4, 7, 2), i));
	balls.push(new Ball(i));
}
for (var i = 0; i < 100; i++) {
	paddles[i].prep();
	balls[i].prep();
}

function download(content, fileName, contentType) {
	const a = document.createElement("a");
	const file = new Blob([content], { type: contentType });
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

function save() {
	const data = JSON.stringify(paddles[0].brain, null, 4);
	download(data, "paddle.json", "text/plain");
	// console.log(data);
	// saveJSON(birds[0], 'paddle.json')
}

// game loop
function loop() {
	requestAnimationFrame(loop);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// move paddles by their velocity

	// draw paddles

	for (let n = 0; n < parseInt(document.getElementById("speed").value); n++) {
		var allDead = true;
		for (var i = 0; i < paddles.length; i++) {
			if (paddles[i].alive === true) {
				try {
					paddles[i].update();
					balls[i].update();
					allDead = false;
				} catch { };
			}
		}
		if (allDead) {
			nextGeneration();
		}
	}
	for (var i = 0; i < paddles.length; i++) {
		try {
			paddles[i].draw();
			balls[i].draw();
			allDead = false;
		}
		catch{}
	}

	context.fillStyle = 'lightgrey';
	context.fillRect(0, 0, canvas.width, grid);
	context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

	// draw dotted line down the middle
	for (let i = grid; i < canvas.height - grid; i += grid * 2) {
		context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
	}
}

// listen to keyboard events to move the paddles
document.addEventListener('keydown', function (e) {

	// up arrow key
	if (e.which === 38) {
		rightPaddle.dy = -paddleSpeed;
	}
	// down arrow key
	else if (e.which === 40) {
		rightPaddle.dy = paddleSpeed;
	}


});

/* listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function (e) {
	if (e.which === 38 || e.which === 40) {
		rightPaddle.dy = 0;
	}

	if (e.which === 83 || e.which === 87) {
		leftPaddle.dy = 0;
	}
});
*/
// start the game
requestAnimationFrame(loop);

document.getElementById('something').onchange = function() {
		const thething = parseFloat(document.getElementById('something').value);
		console.log(thething);
		for (let i = 0; i < paddles.length; i++) 
		{
			paddles[i].brain.setLearningRate(thething);
		}
	}