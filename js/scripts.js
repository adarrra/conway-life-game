var Cell = {
	alive: false,
	neighbors: {
		topNeighbor: true,
		rightTopNeighborAlive: true,
		rightNeighborAlive: true,
		bottomRightNeighborAlive: true,
		bottomNeighborAlive: true,
		bottomLeftNeighborAlive: true,
		leftNeighborAlive: true,
		topLeftNeighborAlive: true},

	livingNeighborCounter: function(){
		var livingCells = 0;
		for (var key in this.neighbors){
			if(this.neighbors[key] == true){
				livingCells +=1;
			}
		}return livingCells;
	},
	checkAndApplyNextGenerationStatus: function (livingCells){
		if(this.alive == true){
			if(livingCells >= 4){
				this.alive = false;
			}else if(livingCells >= 2){
				this.alive = true;
			}
		}else if(livingCells == 3){
			this.alive = true;
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
		var row = [];
		for (var i = 0; i < stolets; i++){
			row.push(cellCreator());
		}
		for (var i = 0; i < rows; i++){
			field.push(row)
		} this.field = field;
	},
	checkThisGeneration: function(){
		for(var i = 0; i < this.field.length; i++) {
			for(var j = 0; j <  this.field[i].length; j++) {
				if(this.field[i][j].alive == true){
					var thisCell = this.field[i][j];
				/*	Cell.neighbors.topNeighbor = this.field[i-1][j];
					Cell.neighbors.rightTopNeighborAlive = this.field[i-1][j+1].alive;
					Cell.neighbors.rightNeighborAlive = this.field[i+1][j].alive;
					Cell.neighbors.bottomRightNeighborAlive = this.field[i+1][j+1].alive;
					Cell.neighbors.bottomNeighborAlive = this.field[i+1][j].alive;
					Cell.neighbors.bottomLeftNeighborAlive = this.field[i+1][j-1].alive;
					Cell.neighbors.leftNeighborAlive = this.field[i][j-1].alive;
					Cell.neighbors.topLeftNeighborAlive = this.field[i-1][j-1].alive;*/
					nextGenerationCells = this.field;
					nextGenerationCells[i][j] = thisCell.checkAndApplyNextGenerationStatus(thisCell.livingNeighborCounter())
					if (neighbors.topNeighbor.alive)
				}
			}
		}
	},
	updateGeneration: function(){
		this.field = nextGenerationCells;
	}


};

/*Cell.neighbors.topNeighborAlive = checkNeighborAndSetAlive(i,j);
 function checkNeighborAndSetAlive(i,j){
 проверять если i и j > 0 и
 меньше чем field.length или field.length[i]

 и если да - то alive
 }
а иначе - просто выход
 */



/*но так работает for(var i = 0; i < newUniverse.field.length; i++) {
	var fieldsRow = newUniverse.field[i];
	for(var j = 0; j < fieldsRow.length; j++) {
		if(fieldsRow[j].alive == true){
			console.log("ok")
		}
	}
}*/





/*
function table(rows,stolets){
	var field = [];
	var row = [];
	for (i = 0; i < stolets; i++){
		row.push(cellCreator());
	}
	for (i = 0; i < rows; i++){
		field.push(row)
	}
	return field;
}*/
