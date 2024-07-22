function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

let theCanvas = document.getElementById("canvas");
theCanvas.width = window.innerWidth;
theCanvas.height = window.innerHeight;
theCanvas.willReadFrequently = true;
document.body.appendChild(theCanvas);
let myNetwork = new NodeNetwork();
let myGraph = new NodeGraph(theCanvas, myNetwork, 20);

/*
TODO: Make clicking and dragging work
TODO: Make drawing faster
TODO: Fix bursting effect
TODO: Add scrolling
TODO: Make physics faster (GPU)
TODO: Make stuff freezable
TODO: Add mass
TODO: Fix weird array stuff with an array of graphs
TODO: Screenshot system
*/

//##########
//#SETTINGS#
//##########
myGraph.springPhysics = {
	"enabled": true,
	"forcePerPixel": 0.001,
	"extendDistance": 500,
	"contractDistance": 600,
	"framesPerUpdate": 2
}
myGraph.nodeMagnetism = {
	"enabled": false,
	"extendForcePerPixel": 0.00005,
	"contractForcePerPixel": 0.00001,
	"extendDistance": 200,
	"contractDistance": 850,
	"framesPerUpdate": 5
}
myGraph.displaySettings = {
	"scale": 1,
	"drawNames": false,
	"drawArrows": false,
	"fillArrows": false,
	"drawEdges": true,
	"lineWidth": 1,
	"arrowLength": 10,
	"arrowSideWidth": 4,
	"renderVideo": {
		"enabled": false,
		"fps": 30,
		"lengthInFrames": 300,
		"screenshots": []
	}
}

const _$ = x=>x;
const $$$ = x=>(alert("dont touch me!") == undefined) * 1

$_ = {
	"spring-enabled":      ["springPhysics",   "enabled",               _$        ],
	"spring-force":        ["springPhysics",   "forcePerPixel",         parseFloat],
	"spring-extend":       ["springPhysics",   "extendDistance",        parseFloat],
	"spring-contract":     ["springPhysics",   "contractDistance",      parseFloat],
	"spring-fpu":          ["springPhysics",   "framesPerUpdate",       parseFloat],
	"magnetism-enabled":   ["nodeMagnetism",   "enabled",               _$        ],
	"magnetism-eforce":    ["nodeMagnetism",   "extendForcePerPixel",   parseFloat],
	"magnetism-cforce":    ["nodeMagnetism",   "contractForcePerPixel", parseFloat],
	"magnetism-extend":    ["nodeMagnetism",   "extendDistance",        parseFloat],
	"magnetism-contract":  ["nodeMagnetism",   "contractDistance",      parseFloat],
	"magnetism-fpu":       ["nodeMagnetism",   "framesPerUpdate",       parseFloat],
	"scale":               ["displaySettings", "scale",                 $$$       ],
	"draw-names":          ["displaySettings", "drawNames",             _$        ],
	"draw-arrows":         ["displaySettings", "drawArrows",            _$        ],
	"fill-arrows":         ["displaySettings", "fillArrows",            _$        ],
	"draw-edges":          ["displaySettings", "drawEdges",             _$        ]
}

for ($$ in $_) {
	document.getElementById($$).onchange = function() {
		let __$ = $_[this["$"]];
		myGraph[__$[0]][__$[1]] = __$[2](this["€"].checked | this["€"].value);
		console.log(this["€"])
	}.bind({"$": $$, "€": document.getElementById($$)})
}

let randomPosition = true;
myGraph.setScale(0.5); 
document.getElementById("start").onclick = function() {
    let nodes = parseInt(prompt("Type in a number for the amount of nodes"));
    nodes-=1;
    for (let i = 0; i<=nodes; i++) {
		let color = `rgb(${randomNumber(0,255)},${randomNumber(0,255)},${randomNumber(0,255)})`
		let x = 0;
		let y = 0;
		if (randomPosition) {
			x = myGraph.ranx();
			y = myGraph.rany();
		}
		else {
			x = myGraph.cenx();
			y = myGraph.ceny();
		}
    	myNetwork.addNode(i, {"name": i.toString(), "color": color, "size": 10, "x": x, "y": y});
    }

    let maxedges = parseInt(prompt("Type in a number for the max of edges per node"));
    for (let i = 0; i <= nodes;i++) {
		for (let j = 0; j < Math.round(Math.random() * maxedges+1); j++) {
			let edges = new Set();

			// Generate unique random edges
			while (edges.size < maxedges) {
				let randomNode = Math.round(Math.random() * nodes);
				if (randomNode !== i) {
					edges.add(randomNode);
				}
			}
		
			// Remove existing edges and add new ones
			edges.forEach(node => {
				myNetwork.addEdge(i, node);
			});
		}
		if (i % 20000 == 0){
			alert(i);
		}
    }
	myGraph.update();
}