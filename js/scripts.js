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
			if(livingCells >= 4 ||livingCells <= 1 ){
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
	checkThisGeneration: function(){
		nextGenerationCells = jQuery.extend(true, {}, this.field);


		for(var i = 0; i < objectLength(this.field); i++) {
			for(var j = 0; j <  objectLength(this.field[i]); j++) {
				var thisCell = this.field[i][j];
				thisCell.neighbors.topNeighborAlive = this.checkNeighborAndSetAlive(i-1,j);
				thisCell.neighbors.rightTopNeighborAlive = this.checkNeighborAndSetAlive(i-1,j+1);
				thisCell.neighbors.rightNeighborAlive = this.checkNeighborAndSetAlive(i,j+1);
				thisCell.neighbors.bottomRightNeighborAlive = this.checkNeighborAndSetAlive(i+1,j+1);
				thisCell.neighbors.bottomNeighborAlive = this.checkNeighborAndSetAlive(i+1,j);
				thisCell.neighbors.bottomLeftNeighborAlive = this.checkNeighborAndSetAlive(i+1,j-1);
				thisCell.neighbors.leftNeighborAlive = this.checkNeighborAndSetAlive(i,j-1);
				thisCell.neighbors.topLeftNeighborAlive = this.checkNeighborAndSetAlive(i-1,j-1);

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



	var CELL_SIZE = 20;

	var rows = 10;//получают значения из сет
	var stolets = 10;//получают значения из сет
	var gridWidth;
	gridWidth = stolets * CELL_SIZE + 1;
	var gridHeight;
	gridHeight = rows * CELL_SIZE + 1;

	var newUniverse = Object.create(Universe);
	newUniverse.initialize(rows,stolets);


	var grid_canvas = document.getElementById("grid");
	var context = grid_canvas.getContext("2d");

	function gridDraw() {

		for (var x = 0.5; x < gridWidth - 1 + CELL_SIZE; x += CELL_SIZE) {
			context.moveTo(x, 0);
			context.lineTo(x, gridWidth - 1);
		}
		for (var y = 0.5; y <= gridHeight - 1 + CELL_SIZE; y += CELL_SIZE) {
			context.moveTo(0, y);
			context.lineTo(gridHeight - 1, y);
		}
		context.strokeStyle = 'black';
		context.fillStyle = "#000";
		context.stroke();
	}

	function gridClear(){
		context.clearRect ( 0 , 0 , gridWidth, gridHeight );
	}

	gridDraw();

	function born(a,b){
		var s = a / CELL_SIZE;
		var r = b / CELL_SIZE;
		newUniverse.field[r][s].alive = true;
		console.log(r, s);
		console.log(newUniverse.field);
	}
	function die(a,b){
		var s = a / CELL_SIZE;
		var r = b / CELL_SIZE;
		newUniverse.field[r][s].alive = false;
	}

	function result(c) {
		return Math.floor(c / CELL_SIZE)* CELL_SIZE;
	}

	document.getElementById('grid').onclick = function (e) {
		var x = e.offsetX == undefined ? e.layerX : e.offsetX;
		var y = e.offsetY == undefined ? e.layerY : e.offsetY;
		//alert(x +'x'+ y);
		console.log(x , y);





		var a = result(x);
		var b = result(y);
		console.log(a , b);
		var pixelData = context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
		if (pixelData[3] == 255) {
			context.beginPath();
			context.moveTo(a, b);
			context.clearRect(a + 1, b + 1, CELL_SIZE - 1, CELL_SIZE - 1);
			die(a, b)
		} else {
			context.beginPath();
			context.moveTo(a, b);
			context.fillRect(a, b, CELL_SIZE, CELL_SIZE);
			born(a, b);
		}


	};


	$('button#step').click(function (e){
		e.preventDefault();
		console.log(newUniverse.field);
		lifeProcess();
		console.log(newUniverse.field);

	});

	function updateGenerationCounter(){
		$('span.generation-counter').text (
			parseInt($('span.generation-counter').text()) + 1
		);
	}

	function lifeProcess(){

		newUniverse.checkThisGeneration();
		newUniverse.updateGeneration();
		gridClear();
		gridDraw();
		aliveCellDrawer();
		updateGenerationCounter()

	}


	function aliveCellDrawer() {

		for (var i = 0; i < objectLength(newUniverse.field); i++) {
			for (var j = 0; j < objectLength(newUniverse.field[i]); j++) {
				var thisCell = newUniverse.field[i][j];
				if (thisCell.alive == true) {
					context.beginPath();
					var x = result(j * CELL_SIZE);
					var y = result(i * CELL_SIZE);
					context.moveTo(x, y);
					context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
					console.log(x, y);

				}

			}
		}
	}


	var autoLife;

	$("button#auto").clicktoggle(
		function(){
			$(this).text('Stop');
			autoLife  = setInterval(function() {
				lifeProcess()
			}, 800)

		},
		function(){
			$(this).text('Auto');
			clearInterval(autoLife)
		}
	);

	$('button#reset').click(function (e) {
		e.preventDefault();
		$("button#auto").text('Auto');
		clearInterval(autoLife);
		gridClear();
		gridDraw();
		for (var i = 0; i < objectLength(newUniverse.field); i++) {
			for (var j = 0; j < objectLength(newUniverse.field[i]); j++) {
				newUniverse.field[i][j].alive = false;
			}
		}
		$('span.generation-counter').text(0);

	});

/////////////////////////////
});


$.fn.clicktoggle = function(a, b) {  //this one instead of old deprecated function toggle()
	return this.each(function() {
		var clicked = false;
		$(this).click(function() {
			if (clicked) {
				clicked = false;
				return b.apply(this, arguments);
			}
			clicked = true;
			return a.apply(this, arguments);
		});
	});
};





//=================    sync UI and logic       ========================
//TODO: html - пользователь задает клетки или по умолчанию (идея - режим интересные фигуры), поколения - вручную или автоматически
//больше размер клетки? ведешь мышкой а не щелкаешь? счетчик поколений