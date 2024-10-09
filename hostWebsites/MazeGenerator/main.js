const cellSize = 8;
const mazeSize = Math.ceil(175/2);
const pickerSize = 64;
let canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
let context = canvas.getContext("2d");
document.body.style.backgroundColor = "darkblue";
document.body.appendChild(canvas);
canvas.width = cellSize*mazeSize+pickerSize;
canvas.height = cellSize*mazeSize;

function drawDynamicCell(x,y,color) {
    context.fillStyle=color;
    context.fillRect(x*cellSize+pickerSize,y*cellSize,cellSize,cellSize);
}

let board = new Board(mazeSize, mazeSize, new CellType("Blank", {}));

let selected="Explosion";

colors = {
    "Obsidian": "#3d076b",
    "MazePathMaker": "purple",
    "Explosion": `hsl(30,100%,50%)`,
    "Blank": "white",
    "Lava": "red",
    "Water": "blue"
}

static_colors = {
    "Obsidian": "#3d076b",
    "PathPlan": "#c300ff",
    "Retrace": "black",
    "MazePathMaker": "purple",
    "Lava": "red",
    "Water": "blue"
}

let MAZE_CANT_DESTROY = ["Start", "PathPlan", "Retrace", "Obsidian"]
let LAVA_CANT_DESTROY = ["Obsidian","Lava"]
let WATER_CANT_DESTROY = ["Start", "PathPlan", "Retrace", "Obsidian"]
let EXPLOSION_CANT_DESTROY = ["Lava", "Water", "Obsidian"]
let startHue = 0;

function liquidPhysics(cell, cantDestroy) {
    if (cell.lifetime == 0) {return; }
    let l = cell.lower();
    let lf = cell.left();
    let r = cell.right();
    let moved = false;
    if (l == null) {
        moved=true
    }
    else if (!cantDestroy.includes(board.grid[l[0]][l[1]].name)){
        let type = cell.name;
        let types = [type,board.grid[l[0]][l[1]].name]
        if (types.includes("Water") && types.includes("Lava")) {type="Obsidian"}
        board.setCell(l[0], l[1], type);
        moved = true;
    }
    else {
        let lDist=9999;
        if (lf!=null && !cantDestroy.includes(board.grid[lf[0]][lf[1]].name)){
            for (let i = cell.x; i > 0; i--){
                if (!cantDestroy.includes(board.grid[i-1][cell.y+1].name)) {
                    lDist = cell.x - i;
                    break;
                }
            }
        }

        let rDist=9999;
        if (r!=null && !cantDestroy.includes(board.grid[r[0]][r[1]].name)){
            for (let i = cell.x; i < mazeSize-1; i++){
                if (!cantDestroy.includes(board.grid[i+1][cell.y+1].name)) {
                    rDist = i-cell.x;
                    break;
                }
            }
        }

        let distanceTolerance = cell.getNeighbors().filter(function(loc) {if (loc == null) {return false} return board.grid[loc[0]][loc[1]].name == cell.name}).length > Math.round(Math.random()+1)?9990:3;

        if (Math.min(lDist, rDist) > distanceTolerance) return true;
        lDist += Math.random()-.5;
        let goLeft = lDist < rDist;

        if (goLeft) {
            let type = cell.name;
            let types = [type,board.grid[cell.x-1, cell.y].name]
            if (types.includes("Water") && types.includes("Lava")) {type="Obsidian"}
            board.setCell(cell.x-1,cell.y, type);
        }
        else {
            let type = cell.name;
            let types = [type,board.grid[cell.x+1][cell.y].name]
            if (types.includes("Water") && types.includes("Lava")) {type="Obsidian"}
            board.setCell(cell.x+1,cell.y, type);
        }
        board.setCell(cell.x, cell.y, "Blank");
    }

    if (moved) {
        cell.board.setCell(cell.x, cell.y, "Blank")
    }
}
board.addCellType(new CellType("Explosion", {"update":function() {
    if (this.lifespan == 0) {return;}
    drawDynamicCell(this.x, this.y, `hsl(${Math.min(10*this.power,50)},100%,50%)`);
    lostPower = 0.1+this.power/3
    this.power-=lostPower;
    if (this.power <= 0) {
        board.setCell(this.x, this.y, "Blank");
        return;
    }
    let sideNeighbors = this.getSideNeighbors();
    let cornerNeighbors = this.getSideNeighbors();
    let divisor = sideNeighbors.length + cornerNeighbors.length/Math.SQRT2+.1
    sideNeighbors.forEach(neighbor => {
        let neigh = this.board.grid[neighbor[0]][neighbor[1]];
        if (!EXPLOSION_CANT_DESTROY.includes(neigh.name)) return;
        divisor *= 1.2;
    });
    sideNeighbors.forEach(neighbor => {
        let neigh = this.board.grid[neighbor[0]][neighbor[1]];
        if (EXPLOSION_CANT_DESTROY.includes(neigh.name)) return;
        if (neigh.name == "Blank") {
            this.board.setCell(neighbor[0],neighbor[1],"Explosion",lostPower/divisor);
        }
        else if (neigh.name == "Explosion"){
            this.board.grid[neighbor[0]][neighbor[1]].power+=(lostPower/divisor) || 0;
        }
        else {
            this.board.setCell(neighbor[0],neighbor[1],"Explosion",lostPower/divisor);
        }
    });
    cornerNeighbors.forEach(neighbor => {
        let neigh = this.board.grid[neighbor[0]][neighbor[1]];
        if (EXPLOSION_CANT_DESTROY.includes(neigh)) return;
        if (neigh.name == "Blank") {
            this.board.setCell(neighbor[0],neighbor[1],"Explosion",lostPower/divisor/Math.SQRT2);
        }
        else if (neigh.name == "Explosion"){
            neigh.power+=lostPower/divisor/Math.SQRT2
        }
    });}, 
    "init": function (power=100) {
    this.power = power;
}}));

board.addCellType(new CellType("Lava", {"update": function() {
    liquidPhysics(this, LAVA_CANT_DESTROY);
}}));
board.addCellType(new CellType("Water", {"update": function() {
    liquidPhysics(this, WATER_CANT_DESTROY);
}}));
board.addCellType(new CellType("Obsidian", {}));
board.addCellType(new CellType("PathPlan", {}));
board.addCellType(new CellType("Retrace", {}));
board.addCellType(new CellType("Finish", {}));
board.addCellType(new CellType("MazePathMaker", {"update": function() {
    if (this.lifetime == 0) {return; }
    let neighbors = [this.y>1? [this.x,this.y-2]: null, this.x > 1 ? [this.x-2,this.y] : null, this.x < board.width-2 ? [this.x+2,this.y] : null, this.y < board.height-2 ? [this.x,this.y+2] : null].filter(function (pos) {
        if (pos == null) {return false;}
        if (board.grid[pos[0]][pos[1]] == null) return true;
        let name = board.grid[pos[0]][pos[1]].name;
        if (pos[0] < this.x && MAZE_CANT_DESTROY.includes(board.grid[this.x-1][this.y].name)) return false;
        if (pos[0] > this.x && MAZE_CANT_DESTROY.includes(board.grid[this.x+1][this.y].name)) return false;
        if (pos[1] < this.y && MAZE_CANT_DESTROY.includes(board.grid[this.x][this.y-1].name)) return false;
        if (pos[1] > this.y && MAZE_CANT_DESTROY.includes(board.grid[this.x][this.y+1].name)) return false;
        return !MAZE_CANT_DESTROY.includes(name);
    }.bind(this));

    if (neighbors.length == 0) {
        let neighbors = this.getSideNeighbors().filter(function (pos) {
            if (board.grid[pos[0]][pos[1]] == null) return true;
            let name = board.grid[pos[0]][pos[1]].name;
            return name == "PathPlan";
        });

        if (neighbors.length == 0) {
            return;
        }

        let choice = neighbors[Math.floor(Math.random()*neighbors.length)];
        board.setCell(choice[0], choice[1], "Retrace");
        board.setCell(this.x, this.y, "Retrace");
        if (choice[0] < this.x) board.setCell(this.x - 2, this.y, "MazePathMaker");
        if (choice[0] > this.x) board.setCell(this.x + 2, this.y, "MazePathMaker");
        if (choice[1] < this.y) board.setCell(this.x, this.y - 2, "MazePathMaker");
        if (choice[1] > this.y) board.setCell(this.x, this.y + 2, "MazePathMaker");
        return;
    }

    let choice = neighbors[Math.floor(Math.random()*neighbors.length)];
    board.setCell(choice[0], choice[1], "MazePathMaker");
    board.setCell(this.x, this.y, "PathPlan");
    if (choice[0] < this.x) board.setCell(this.x - 1, this.y, "PathPlan");
    if (choice[0] > this.x) board.setCell(this.x + 1, this.y, "PathPlan");
    if (choice[1] < this.y) board.setCell(this.x, this.y - 1, "PathPlan");
    if (choice[1] > this.y) board.setCell(this.x, this.y + 1, "PathPlan");
}}));

board.addCellType(new CellType("Start", {"update": function() {
    let neighbors = [this.y>1? [this.x,this.y-2]: null, this.x > 1 ? [this.x-2,this.y] : null, this.x < board.width-2 ? [this.x+2,this.y] : null, this.y < board.height-2 ? [this.x,this.y+2] : null].filter(function (pos) {
        if (pos == null) {return false;}
        if (board.grid[pos[0]][pos[1]] == null) return true;
        let name = board.grid[pos[0]][pos[1]].name;
        return name == "Blank";
    });

    if (neighbors.length < 4) {
        return;
    }

    let choice = neighbors[Math.floor(Math.random()*neighbors.length)];
    board.setCell(choice[0], choice[1], "MazePathMaker");
    if (choice[0] < this.x) board.setCell(this.x - 1, this.y, "PathPlan");
    if (choice[0] > this.x) board.setCell(this.x + 1, this.y, "PathPlan");
    if (choice[1] < this.y) board.setCell(this.x, this.y - 1, "PathPlan");
    if (choice[1] > this.y) board.setCell(this.x, this.y + 1, "PathPlan");
}}));

board.setCell(0,0,"PathPlan");

function update(){
    context.fillStyle="white";
    context.fillRect(0,0,canvas.width,canvas.height);

    board.update();

    for (let i = 0; i < mazeSize; i++) {
        let lastStart = 0;
        let lastObject = null;
        for (let j = 0; j < mazeSize+1; j++) {
            if (j==mazeSize || board.grid[i][j].name != lastObject) {
                if (lastObject in static_colors) {
                    context.fillStyle = static_colors[lastObject];
                    context.fillRect(i*cellSize+pickerSize, lastStart*cellSize, cellSize, (j-lastStart) * cellSize);
                }
                if (j<mazeSize){
                    lastObject = board.grid[i][j].name;
                    lastStart = j;
                }
                continue;
            }
        }
    }

    context.fillStyle="lightgrey";
    context.fillRect(0,0,pickerSize,canvas.height);

    let i = 0;
    for (let object in colors) {
        context.fillStyle = colors[object];
        context.fillRect(5,i*pickerSize+5,pickerSize-10,pickerSize-10);
        i++;
    }

    context.fillStyle="black";
    context.font = "50px Arial";
    context.fillText(`Selected: ${selected}`,pickerSize+30,50);

    /*for (let i = 0; i < mazeSize; i++) {
        context.fillStyle = "white";
        context.fillRect(i*cellSize+pickerSize, 0, 0.5, canvas.height);
        context.fillRect(pickerSize, i*cellSize, canvas.width, 0.5);
    }*/

    startHue+=0.01;
    static_colors["MazePathMaker"] = `hsl(${Math.floor(Math.sin(startHue)*360)+180}, 100%, 50%)`;
    colors["MazePathMaker"] = `hsl(${Math.floor(Math.sin(startHue)*360)+180}, 100%, 50%)`;
    //setTimeout(update, 1000);
    requestAnimationFrame(update);
}

let anchorX;
let anchorY;

let lowerXBound;
let upperXBound;
let lowerYBound;
let upperYBound;

canvas.onmousemove = function(event) {
    if (event.buttons == 1 && event.button == 0) {
        let x = event.offsetX;
        let y = event.offsetY;
        let objects = Object.keys(colors);
        if (x > canvas.width || x <pickerSize || y > canvas.height || y < 0) {
            return;
        }
        let lowerXBound = Math.min(Math.floor((x-pickerSize)/cellSize), anchorX);
        let upperXBound = Math.max(Math.floor((x-pickerSize)/cellSize), anchorX)+1;
        let lowerYBound = Math.min(Math.floor(y/cellSize), anchorY);
        let upperYBound = Math.max(Math.floor(y/cellSize), anchorY)+1;
        for (let i = lowerXBound; i < upperXBound; i++) {
            for (let j = lowerYBound; j < upperYBound; j++) {
                board.setCell(i,j,selected);
                context.fillStyle = "lightblue";
                context.fillRect(i*cellSize+pickerSize,j*cellSize, cellSize,cellSize);
            }
        }
    }
}

canvas.onmousedown = function(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let objects = Object.keys(colors);

    if (x < pickerSize) {
        if (y > pickerSize * objects.length || y < 0) {
            return;
        }

        selected = objects[Math.floor(y / pickerSize)];
        return;
    }

    
    if (x > canvas.width || y > canvas.height || y < 0) {
        return;
    }

    anchorX = Math.floor((x-pickerSize)/cellSize);
    anchorY = Math.floor(y/cellSize);
    canvas.onmousemove(event);
}

update();