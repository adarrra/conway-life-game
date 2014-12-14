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
		}else if(livingCells == 3){
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
			for(var j = 0; j <  this.field[i].length; j++) {//может добавить таки условие, чтоб только пустые с соседями
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
			}
		}
	},
	updateGeneration: function(){
		this.field = jQuery.extend(true, {}, nextGenerationCells);
	}


};

//for UI grid

 function gridDraw() {
	for (var x=0.5; x < width; x += sizeCell){ //задать sizeCell, width, height
		context.moveTo(x, 0);
		context.lineTo(x, height);
	}
	for (var y=0.5; y <= height; y += sizeCell){
		context.moveTo(0, y);
		context.lineTo(width, y);
	}
	context.strokeStyle = '#eee';
	context.fillStyle="#000";
	context.stroke();
};

jQuery(document).ready(function	() {
	var grid_canvas = document.getElementById("grid");
	var context = grid_canvas.getContext("2d");
});


//TODO: html - пользователь задает клетки или по умолчанию (идея - режим интересные фигуры), поколения - вручную или автоматически


