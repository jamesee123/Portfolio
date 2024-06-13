let generations = 0;
function copy() {

}
function nextGeneration() {
	generations++;
	calculateFitness();
	paddles = [];
	balls = [];
	for (var i = 0; i < 500; i++) {
		paddles.push(pickOne(i));
	}
	for (ball in balls) {
		delete ball;
	}
	balls = [];
	for (var i = 0; i < 1000; i++) {
		balls.push(new Ball(i));
	}
	for (var i = 0; i < 1000; i++) {
		paddles[i].prep();
		balls[i].prep();
	}
	savedPaddles = [];
}
function calculateFitness() {
	let sum = 0;
	let bestScore = 0;
	let bestFitness = 0;
	for (var i = 0; i < savedPaddles.length; i++) {
		sum += savedPaddles[i].score;
	}

	for (var i = 0; i < savedPaddles.length; i++) {
		savedPaddles[i].fitness = savedPaddles[i].score / sum;
		if (savedPaddles[i].fitness > bestFitness){
			bestFitness = savedPaddles[i].fitness;
		}
		if (savedPaddles[i].score > bestScore){
			bestScore = savedPaddles[i].score;
		}
	}
}
function pickOne(num) {
	let index = 0;
	let r = 0.9 + (Math.random()/10);
	while (r > 0) {
		r = r - savedPaddles[index].fitness;
		index++;
	}
	index--;
	if (index < 0){
		index = 0;
	}
	// paddlesNoChild.pop(paddlesNoChild.indexOf(bestPaddle));
	// paddlesNoChild.pop(index);
	let child = new Paddle(savedPaddles[index].brain, num);
	child.mutate();

	return child;
}