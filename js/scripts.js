//=================    Logic       ========================

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
		}else{
			return false;
		}
	}

};


function cellCreator(){
	var newCell = Object.create(Cell);
	return newCell;
}

var nextGenerationCells = [];

function objectLength (obj) {
	var counter = 0;
	for (key in obj) {
		counter ++;
	}
	return counter;
}

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
		if (i >= 0 && j >= 0 && i <  objectLength(this.field) && j < objectLength(this.field[0])) {
			return this.field[i][j].alive
		}
		return false;
	},
	checkThisGeneration: function(){/*debugger;*/
		nextGenerationCells = jQuery.extend(true, {}, this.field);


		for(var i = 0; i < objectLength(this.field); i++) {
			for(var j = 0; j <  objectLength(this.field[i]); j++) {//может добавить таки условие, чтоб только пустые с соседями
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



//=================    for UI grid       ========================
jQuery(document).ready(function	() {

	var grid_canvas = document.getElementById("grid");
	var context = grid_canvas.getContext("2d");

	function gridDraw() {
		var sizeCell = 10;
		for (var x = 0.5; x < 410; x += sizeCell) {
			context.moveTo(x, 0);
			context.lineTo(x, 400);
		}
		for (var y = 0.5; y <= 400; y += sizeCell) {
			context.moveTo(0, y);
			context.lineTo(400, y);
		}
		context.strokeStyle = 'black';
		context.fillStyle = "#000";
		context.stroke();
	}

	function gridClear(){
		context.clearRect ( 0 , 0 , 401, 201 );
		gridDraw();
	}

	gridDraw();

	function born(a,b){
		var s = a/10;
		var r = b/10;
		newUniverse.field[r][s].alive = true;
	}
	function die(a,b){
		var s = a/10;
		var r = b/10;
		newUniverse.field[r][s].alive = false;
	}

	document.getElementById('grid').onclick = function (e) {
		var x = e.offsetX == undefined ? e.layerX : e.offsetX;
		var y = e.offsetY == undefined ? e.layerY : e.offsetY;
		//alert(x +'x'+ y);

		function result(a) {
			return a - a % 10;
		}

		var a = result(x);
		var b = result(y);
		var pixelData = context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
		//console.log(pixelData);
		if (pixelData[3] == 255) {
			context.beginPath();
			context.moveTo(a, b);
			context.clearRect(a + 1, b + 1, 9, 9);
			die(a, b)
		} else {
			context.beginPath();
			context.moveTo(a, b);
			context.fillRect(a, b, 10, 10);
			born(a, b);
		}


	};


	var rows = 20;
	var stolets = 40;
	var gridWidth = stolets * 100 + 1;
	var gridHeight = rows* 100 + 1;

	var newUniverse = Object.create(Universe);
	newUniverse.initialize(rows,stolets);


	$('button#step').click(function(e){//debugger;
		e.preventDefault();
		newUniverse.checkThisGeneration();
		console.log(nextGenerationCells);
		newUniverse.updateGeneration();
		console.log(newUniverse.field);
		gridClear();
		aliveCellDrawer();

	});




	function aliveCellDrawer() {//debugger;

		for (var i = 0; i < objectLength(newUniverse.field); i++) {
			for (var j = 0; j < objectLength(newUniverse.field[i]); j++) {
				var thisCell = newUniverse.field[i][j];
				if (thisCell.alive == true) {
					context.beginPath();
					context.moveTo(i * 10, j * 10);
					context.fillRect(i * 10, j * 10, 10, 10);

				}

			}
		}
	}

});








//=================    sync UI and logic       ========================
//TODO: html - пользователь задает клетки или по умолчанию (идея - режим интересные фигуры), поколения - вручную или автоматически
//больше размер клетки? ведешь мышкой а не щелкаешь? счетчик поколений