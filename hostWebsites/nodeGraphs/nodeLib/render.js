let dpi = 2;
function getDistance(x, y, x1, y1) {
	let distance = Math.hypot(x - x1, y - y1);
	if (distance == 0) {
		distance = 0.01;
	}
	return distance;
}

let type = prompt("Type what mode you would like to use. type cpu exactly for cpu, gpu exactly for gpu");
const gpu = new GPU.GPU({ mode: type });

class NodeGraph {
	constructor(canvas, network) {
		this.frame = 0;
		this.canvas = canvas;
		this.springPhysics = {
			"enabled": false,
			"forcePerPixel": 0.01,
			"extendDistance": 500,
			"contractDistance": 600,
			"framesPerUpdate": 2
		}
		this.nodeMagnetism = {
			"enabled": false,
			"extendForcePerPixel": 0.00005,
			"contractForcePerPixel": 0.00001,
			"extendDistance": 200,
			"contractDistance": 850,
			"framesPerUpdate": 5
		}
		this.displaySettings = {
			"scale": 1,
			"drawNames": true,
			"drawArrows": true,
			"fillArrows": true,
			"drawEdges": true,
			"lineWidth": 1,
			"arrowLength": 10,
			"arrowSideWidth": 4,
			"renderVideo": {
				"enabled": false,
				"fps": 30,
				"lengthInFrames": 300,
				"screenshots": [],
			}
		}

		this.customNodeProperties = {

		}

		this.ctx = canvas.getContext('2d', { alpha: false });

		canvas.style["margin"] = 0;
		const dpr = 2;
		const rect = canvas.getBoundingClientRect();

		canvas.width = rect.width * dpr;
		canvas.height = rect.height * dpr;

		this.ctx.scale(dpr, dpr);

		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;
		this.network = network;
		this.ctx.font = "10px serif";
		this.ctx.textAlign = "center";
		//this.video = new Whammy.Video(30,1);

		/*for (let i = 0; i < framesOfPhysicsUpdate; i++) {
			this.physicsUpdate();
		}*/
		this.canvas.onmousedown = this.checkMouseDown.bind(this);
		this.canvas.onmouseup = this.checkMouseUp.bind(this);
		this.canvas.onmousemove = this.checkMouseHover.bind(this);
		window.addEventListener("keydown", function(e) {
			for (let id in this.network.nodes) {
				let node = this.network.nodes[id];
				if (e.which == 70) {
					node.vx += Math.random() * 100 - 50;
					node.vy += Math.random() * 100 - 50;
				}
				if (e.which == 80) {
					this.springPhysics.extendDistance = Math.random() * 1000;
					this.springPhysics.contractDistance = this.springPhysics.extendDistance + (Math.random() * 200) + 100;
					this.springPhysics.forcePerPixel = Math.random() * 0.05;
				}
				if (e.which == 77) {
					this.nodeMagnetism.extendDistance = Math.random() * 1000;
					this.nodeMagnetism.contractDistance = this.nodeMagnetism.extendDistance + Math.random() * 200 + 100;
					this.nodeMagnetism.forcePerPixel = Math.random() * 0.05;
				}
				if (e.which == 83) {
					this.setScale(Math.random() * 2);
				}
			}
		}.bind(this));

		this.wasSelected = [];
		this.pastEdgesSize = 0;

		this.springKernel = gpu.createKernel(function(edges, xs, ys, masses, rules) {
			const n1 = edges[this.thread.x*2];
			const n2 = edges[this.thread.x*2+1];
			const x1 = xs[n1];
			const y1 = ys[n1];
			const x2 = xs[n2];
			const y2 = ys[n2];
		 
			const offsetx = x1 - x2;
			const offsety = x1 - x2;
			let distance = Math.sqrt(offsetx * offsetx + offsety * offsety);
		
			if (distance == 0) {
				distance = 0.001;
			}
		
			const normalizedOffsetX = offsetx / distance;
			const normalizedOffsetY = offsety / distance;
		
			let force = 0;
		
			if (distance > rules[1]) {
				force = (rules[1] - distance) * rules[0];
			} else if (distance < rules[2]) {
				force = (rules[2] - distance) * rules[0];
			} else {
				return [0, 0, 0, 0];
			}
		
			const forceX = normalizedOffsetX * force;
			const forceY = normalizedOffsetY * force;
		
			const node1_vx = forceX / masses[n1];
			const node1_vy = forceY / masses[n1];
			const node2_vx = -forceX / masses[n2];
			const node2_vy = -forceY / masses[n2];
		
			return [node1_vx, node1_vy, node2_vx, node2_vy];
			//return [0, 0, 0, 0];
		}, {
			dynamicOutput: true // Enable dynamic output resizing
		}).setOutput([0]);
	}

	setScale(scale) {
		const dpr = 2;
		this.displaySettings.scale = scale;
		this.ctx.scale(dpr * scale, dpr * scale);
		return scale;
	}

	cenx() {
		const dpr = 2;
		/* 
		0.25: 1
		0.5: 2
		0.75: 3
		1: 4*/
		return this.canvas.width / (this.displaySettings.scale * 4 * dpr);
	}
	ceny() {
		const dpr = 2;
		return this.canvas.height / (this.displaySettings.scale * 4 * dpr);
	}

	ranx() {
		const dpr = 2;
		let endx = this.canvas.width / (this.displaySettings.scale * 2 * dpr);
		return Math.round(Math.random() * endx);
	}

	rany() {
		const dpr = 2;
		let endy = this.canvas.height / (this.displaySettings.scale * 2 * dpr);
		return Math.round(Math.random() * endy);
	}

	renderEdge(startNode, endNode) {
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = this.displaySettings.lineWidth;
		let fromx = startNode.x;
		let fromy = startNode.y;
		let endx = endNode.x;
		let endy = endNode.y;

		this.ctx.beginPath();
		this.ctx.moveTo(fromx, fromy);
		this.ctx.lineTo(endx, endy);
		this.ctx.stroke();

		if (!this.displaySettings.drawArrows) return;

		let distance = getDistance(fromx, fromy, endx, endy);

		if (distance <= startNode.size + endNode.size - 15) {
			return;
		}

		let arrowDistance = distance - endNode.size;
		let ratio = arrowDistance / distance;

		let offsetx = endx - fromx;
		let offsety = endy - fromy;
		offsetx *= ratio;
		offsety *= ratio;

		let arrowcenx = fromx + offsetx;
		let arrowceny = fromy + offsety;

		let arrowdir = Math.atan2(offsety, offsetx);
		let arrowdirx = Math.cos(arrowdir);
		let arrowdiry = Math.sin(arrowdir);

		let backEdgeDistance = arrowDistance - this.displaySettings.arrowLength;
		ratio = backEdgeDistance / arrowDistance;
		offsetx *= ratio;
		offsety *= ratio;

		let backedgex = fromx + offsetx;
		let backedgey = fromy + offsety;

		let pointax = backedgex + arrowdiry * this.displaySettings.arrowSideWidth;
		let pointay = backedgey - arrowdirx * this.displaySettings.arrowSideWidth;

		let pointbx = backedgex - arrowdiry * this.displaySettings.arrowSideWidth;
		let pointby = backedgey + arrowdirx * this.displaySettings.arrowSideWidth;

		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.moveTo(arrowcenx, arrowceny);
		this.ctx.lineTo(pointax, pointay);
		this.ctx.lineTo(pointbx, pointby);
		if (this.displaySettings.fillArrows) {
			this.ctx.fill();
		} else {
			this.ctx.stroke();
		}
	}

	nodeMagnets() {
		let ids = Object.keys(this.network.nodes);

		for (let i = 0; i < ids.length; i++) {
			for (let j = i + 1; j < ids.length; j++) {
				let id1 = ids[i];
				let id2 = ids[j];

				let node1 = this.network.nodes[id1];
				let node2 = this.network.nodes[id2];

				let offsetx = node1.x - node2.x;
				let offsety = node1.y - node2.y;
				let distance = (offsetx ** 2 + offsety ** 2) ** 0.5;

				if (distance == 0) {
					distance = 0.0001;
				}

				let normalizedOffsetX = offsetx / distance;
				let normalizedOffsetY = offsety / distance;

				let force = 0;

				if (distance > this.nodeMagnetism.contractDistance) {
					force = (this.nodeMagnetism.contractDistance - distance) * this.nodeMagnetism.contractForcePerPixel;
				} else if (distance < this.nodeMagnetism.extendDistance) {
					force = (this.nodeMagnetism.extendDistance - distance) * this.nodeMagnetism.extendForcePerPixel;
				} else {
					continue;
				}

				force *= this.nodeMagnetism.framesPerUpdate;

				let forceX = normalizedOffsetX * force;
				let forceY = normalizedOffsetY * force;

				node1.vx += forceX / node1.mass;
				node1.vy += forceY / node1.mass;
				node2.vx -= forceX / node2.mass;
				node2.vy -= forceY / node2.mass;
			}
		}
	}
	spring() {
		let xs = [];
		let ys = [];
		let masses = [];
		let edges = [];
		let ids = []; 
		for (let key of Object.keys(this.network.nodes)) {
			let id = parseInt(key);
			let node = this.network.nodes[id];
			xs.push(node.x);
			ys.push(node.y);
			masses.push(node.mass);
			ids.push(id);
		}

		for (let i = 0; i < this.network.edges.length; i++) {
			edges.push(ids.indexOf(this.network.edges[i][0]));
			edges.push(ids.indexOf(this.network.edges[i][1]));
		}
		const results = this.springKernel(
			edges, 
			xs, ys, masses, 
			[this.springPhysics.forcePerPixel * this.springPhysics.framesPerUpdate, 
			this.springPhysics.contractDistance,
			this.springPhysics.extendDistance]
		);

		for (let i = 0; i < results.length; i++) {
			const edge = this.network.edges[i];
			const node1 = this.network.nodes[edge[0]];
			const node2 = this.network.nodes[edge[1]];
	
			node1.vx += results[i][0];
			node1.vy += results[i][1];
			node2.vx += results[i][2];
			node2.vy += results[i][3];
		}
	}

	physicsUpdate() {
		const dpr = 2;
		for (let id in this.network.nodes) {
			let node = this.network.nodes[id];
			node.x += Math.random() / 100 - 0.005;
			node.y += Math.random() / 100 - 0.005;
			node.x += node.vx;
			node.y += node.vy;
			node.x = Math.max(0, node.x);
			node.x = Math.min(this.canvas.width / (this.displaySettings.scale * 2 * dpr), node.x);
			node.y = Math.max(0, node.y);
			node.y = Math.min(this.canvas.height / (this.displaySettings.scale * 2 * dpr), node.y);
			node.vx /= 1.1;
			node.vy /= 1.1;
		}
		if (true || (this.springPhysics.enabled && (this.frame % this.springPhysics.framesPerUpdate == 0))) {
			let currentEdgesSize = this.network.edges.length;
			if (this.pastEdgesSize != currentEdgesSize) {
				this.pastEdgesSize = currentEdgesSize;
				this.springKernel.setOutput([currentEdgesSize]);
			}
			if (this.network.edges.length > 0) {
				this.spring();
			}
		}
		if (this.nodeMagnetism.enabled && (this.frame % this.nodeMagnetism.framesPerUpdate == 0)) {
			this.nodeMagnets();
		}
	}

	update() {
		if (this.frame == 157700000) {
			this.frame = 0
		}
		this.physicsUpdate();
		this.draw();
		this.frame += 1;
		requestAnimationFrame(this.update.bind(this));
	}

	handleMouseEnter(id, e) {

	}

	handleMouseExit(id, e) {

	}

	handleMouseMove(id, e) {

	}

	handleMouseDown(id, e) {

	}

	handleMouseUp(id, e) {

	}

	handleMouseDrag(id, e) {

	}

	checkMouseHover(e) {
		for (let id in this.wasSelected) {
			let node = this.network.nodes[id];
			if (e.button == 0 && e.buttons > 0) {
				node.x += e.movementX;
				node.y += e.movementY;
			}
			else {
				if (getDistance(node.x, node.y, e.offsetX, e.offsetY) > node.size) {
					this.wasSelected = this.wasSelected.filter(checkId => checkId != id);
					node.mousedown = false;
				}
			}
		}

		this.wasSelected = [];

		for (let id in this.network.nodes) {
			let node = this.network.nodes[id];
			let colliding = getDistance(node.x, node.y, e.offsetX, e.offsetY) <= node.size;

			//let distance = getDistance();
			//node.color = "red";
			if (colliding) {
				this.handleMouseMove(id, e);
			}
			if (colliding && e.button == 0 && e.buttons > 0) {
				node.mousedown = true;
				if (!(id in this.wasSelected)) {
				this.wasSelected.push(id);
				}
				this.handleMouseDrag(id, e);
				//node.color = "green";
				node.x = e.offsetX;
				node.y = e.offsetY;
			}
		}
	}

	checkMouseUp(e) {
		for (let id in this.network.nodes) {
			let node = this.network.nodes[id];
			if (getDistance(e.offsetX, e.offsetY, node.x, node.y) <= node.size) {
				node.mass = 1;
				this.handleMouseDown(id, e);
			}
		}
	}

	checkMouseDown(e) {
		for (let id in this.network.nodes) {
			let node = this.network.nodes[id];
			if (getDistance(e.offsetX, e.offsetY, node.x, node.y) <= node.size) {
				node.vx = 0;
				node.vy = 0;
				node.mass = Infinity;
				this.handleMouseDown(id, e);
			}
		}
	}

	finishVideo() {
		let blob = undefined; 
		this.video.compile(false, function(webm) {blob=webm});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'canvas_video.webm';
		document.body.appendChild(a);
		a.style.display = 'none';
		a.click();
		setTimeout(() => {
			URL.revokeObjectURL(url);
		}, 100);
	}    

	draw() {
		// CanvasPath.arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined): void

		this.ctx.fillStyle = "black";
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.displaySettings.drawEdges) {
			for (let edge of this.network.edges) {
				let node1 = this.network.nodes[edge[0]];
				let node2 = this.network.nodes[edge[1]];

				if (getDistance(node1.x, node1.y, node2.x, node2.y) < node1.size + node2.size) {
					continue;
				}
				this.renderEdge(node1, node2)
			}
		}

		for (let id in this.network.nodes) {
			let node = this.network.nodes[id];
			if (node.x < -node.size || node.y < -node.size || (node.x - node.size) / this.displaySettings.scale > this.canvas.width || (node.y - node.size) / this.displaySettings.scale > this.canvas.height || node.draw == false) {
				continue;
			}
			this.ctx.beginPath();
			this.ctx.fillStyle = node.color;
			this.ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
			this.ctx.fill();
			//ctx.fillRect(0, 0, 100, 100);
			if (this.displaySettings.drawNames == false) {
				continue;
			}
			this.ctx.fillText(node.name, node.x, node.y - node.size - 3);
		}

		if (this.displaySettings.renderVideo.enabled && false) {
			alert("yo")
			if (this.frame >= this.displaySettings.renderVideo.lengthInFrames) {
				this.finishVideo();
				this.displaySettings.renderVideo.enabled = false;
			}
			this.video.add(this.canvas.toDataURL('image/webp'));
		}
	}

	delete(removeCanvasBool) {
		graphs.filter(graph => graph != this);
		if (!removeCanvasBool) {return; }
		this.canvas.parentNode.removeChild(this.canvas);
	}
}