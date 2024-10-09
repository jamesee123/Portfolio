class CellType {
    constructor(name, functions) {
        this.functions = functions;
        this.name = name;
    }
}

class Cell {
    constructor(cellType, x, y, boardRef,...instantiationParams) {
        this.x = x;
        this.y = y;
        this.board = boardRef;
        this.lifetime = 0;
        this.name = cellType.name;
        this.update = null;
        if (Object.hasOwn(cellType.functions, "init")){
            cellType.functions.init.bind(this)(...instantiationParams);
        }
        if (Object.hasOwn(cellType.functions, "update")){
            this.update = cellType.functions.update.bind(this);
        }
    }

    upperleft() {
        if (this.y > 0 && this.x > 0) {return [this.x-1,this.y-1]; } return null;
    }

    upper() { 
        if (this.y > 0) {return [this.x,this.y-1]; } return null;
    }

    upperright() { 
        if (this.y > 0 && this.x < board.width-1) {return [this.x+1,this.y-1]; } return null;
    }

    left() { 
        if (this.x > 0) {return [this.x-1,this.y]; } return null;
    }

    right() { 
        if (this.x < board.width - 1) {return [this.x+1,this.y]; } return null;
    }

    lowerleft() {
        if (this.y < board.height-1 && this.x > 0) {return [this.x-1,this.y+1]; } return null;
    }

    lower() { 
        if (this.y < board.height-1) {return [this.x,this.y+1]; } return null;
    }

    lowerright() { 
        if (this.y < board.height-1 && this.x < board.width) {return [this.x,this.y+1]; } return null;
    }

    getNeighbors() {
        return [this.upperleft(), this.upper(), this.upperright(), this.left(), this.right(),this.lowerleft(),this.lower(),this.lowerright()].filter(x=>x!=null);
    }

    getSideNeighbors() {
        return [this.upper(), this.left(), this.right(), this.lower()].filter(x=>x!=null);
    }

    getCornerNeighbors() {
        return [this.upperleft(), this.upperright(),this.lowerleft(),,this.lowerright()].filter(x=>x!=null);
    }
}

class Board {
    constructor(width, height, filler=null) {
        this.cellTypes = {};
        if (filler != null) {this.addCellType(filler)}
        this.width = width;
        this.height = height;
        this.grid=[];
        for (let i = 0; i < width; i++) {
            this.grid.push([]);
            for (let j = 0; j < height; j++) {
                if (filler == null) this.grid[i].push(null);
                else this.grid[i].push(new Cell(filler, i, j, this));
            }
        }
    }

    setCell(x,y,typeName, ...instantiationParams) {
        if (typeName == null) {this.grid[x][y] = null; return;}
        this.grid[x][y] = new Cell(this.cellTypes[typeName], x, y, this, ...instantiationParams);
    }

    addCellType(cellType) {
        this.cellTypes[cellType.name] = cellType;
    }

    update() {
        //let locations = []
        let reverseX = Math.random()>.5;

        for (let i = reverseX?this.width-1:0; reverseX?i>=0:i < this.width; reverseX?i--:i++) {
            let reverseY = Math.random()>.5;
            for (let j = reverseY?this.height-1:0; reverseY?j>=0:j < this.height; reverseY?j--:j++) {
                if (this.grid[i][j]!=null && this.grid[i][j].update != null) {
                    this.grid[i][j].update();
                }
            }
        }

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.grid[i][j]!=null) {
                    this.grid[i][j].lifetime += 1;
                }
            }
        }
    }
}