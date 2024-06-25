class NodeNetwork {
	constructor() {
		this.nodes = {};
		this.edges = [];
	}

	addNode(id, nodeValues) {
		this.nodes[id] = {
			"name": nodeValues["name"] || id,
			"color": nodeValues["color"] || "white",
			"size": nodeValues["size"] || 15,
			"x": nodeValues["x"] || 0,
			"y": nodeValues["y"] || 0,
			"vx": nodeValues["vx"] || 0,
			"vy": nodeValues["vy"] || 0,
			"id": id,
			"draw": true,
			"mass": 1,
			"mousedown": false
		};
	}

	removeNode(id) {
		delete this.nodes[id];
	}

	addEdge(node1, node2) {
		this.edges.push([node1, node2])
	}

	removeEdge(node1, node2) {
		this.edges = this.edges.filter(nodeCombo => !(nodeCombo[0] == node1 && nodeCombo[1] == node2))
		this.edges = this.edges.filter(nodeCombo => !(nodeCombo[1] == node1 && nodeCombo[0] == node2))
	}
}