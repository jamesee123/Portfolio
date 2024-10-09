class CellType {
    constructor(name, update, instantiation) {
        this.update = update;
        this.name = name;
        this.instantiation = instantiation;
    }
}

class Cell {
    constructor(cellType, x, y, boardRef) {
        this.x = x;
        this.y = y;
        this.board = boardRef;
        this.name = cellType.name;
        cellType.instantiation.bind(this)();
        this.update = cellType.update.bind(this);
    }
}

class Board {
    constructor(width, height) {
        this.cellTypes = {"Blank": new CellType("Blank",function() {}, function() {})};
        this.width = width;
        this.height = height;
        this.grid=[];
        for (let i = 0; i < width; i++) {
            this.grid.push([]);
            for (let j = 0; j < height; j++) {
                this.grid[i].push(new Cell((this.cellTypes["Blank"]), i, j, this));
            }
        }
    }

    setCell(x,y,typeName) {
        this.board[x][y] = new Cell(this.cellTypes[typeName]);
    }

    addCellType(cellType) {
        this.cellTypes[cellType.name] = cellType;
    }

    update() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.grid[i][j].update();
            }
        }
    }
}
