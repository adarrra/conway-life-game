var Cell = {
	alive: false,
	neighbors: {
		topNeighborAlive: false,
		rightTopNeighborAlive: false,
		rightNeighborAlive: false,
		bottomRightNeighborAlive: false,
		bottomNeighborAlive: false,
		bottomLeftNeighborAlive: false,
		leftNeighborAlive: false,
		topLeftNeighborAlive: false},

	livingNeighborCounter: function(){
		var livingCells = 0;
		for (var key in this.neighbors){
			if(this.neighbors[key] == true){
				livingCells +=1;
			}
		}return livingCells;
	},
	checkNextGenerationStatus: function (livingCells){
		if(this.alive == true){
			if(livingCells >= 4 ||livingCells == 1 ){
				return false;
			}else if(livingCells >= 2){
				return true;
			}
		}else if(livingCells == 3){ //не рождаются почему то
			return true;
		}
	}

};


function cellCreator(){
	var newCell = Object.create(Cell);
	return newCell;
}

var nextGenerationCells = [];

var Universe = {
	initialize: function (rows,stolets){
		var field = [];
		var row;
		for (var i = 0; i < rows; i++){
			row = [];
			for (var j = 0; j < stolets; j++){
				row.push(cellCreator());
			}
			field.push(row);
		}
	this.field = field;
	},
	checkNeighborAndSetAlive: function(i,j) {
		if (i >= 0 && j >= 0 && i < this.field.length && j < this.field[0].length) {
			return this.field[i][j].alive
		}
		return false;
	},
	checkThisGeneration: function(){/*debugger;*/
		nextGenerationCells = jQuery.extend(true, {}, this.field);


		for(var i = 0; i < this.field.length; i++) {
			for(var j = 0; j <  this.field[i].length; j++) {
				if(this.field[i][j].alive == true){
					var thisCell = this.field[i][j];
					Cell.neighbors.topNeighborAlive = this.checkNeighborAndSetAlive(i-1,j);
					Cell.neighbors.rightTopNeighborAlive = this.checkNeighborAndSetAlive(i-1,j+1);
					Cell.neighbors.rightNeighborAlive = this.checkNeighborAndSetAlive(i,j+1);
					Cell.neighbors.bottomRightNeighborAlive = this.checkNeighborAndSetAlive(i+1,j+1);
					Cell.neighbors.bottomNeighborAlive = this.checkNeighborAndSetAlive(i+1,j);
					Cell.neighbors.bottomLeftNeighborAlive = this.checkNeighborAndSetAlive(i+1,j-1);
					Cell.neighbors.leftNeighborAlive = this.checkNeighborAndSetAlive(i,j-1);
					Cell.neighbors.topLeftNeighborAlive = this.checkNeighborAndSetAlive(i-1,j-1);

					nextGenerationCells[i][j].alive = thisCell.checkNextGenerationStatus(thisCell.livingNeighborCounter());
					/*if (neighbors.topNeighbor.alive)*/
				}
			}
		}
	},
	updateGeneration: function(){
		this.field = nextGenerationCells;//исправить
	}


};



