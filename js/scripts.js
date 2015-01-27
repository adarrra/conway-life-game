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

var forms = {
	Glider: [[0,0],[0,2],[1,1],[1,2],[2,1]],
	Still_lifes:[[0,0],[0,1],[1,0],[1,1]],
	Pulsar:[[1,5], [1,6],[1,7],[1,11],[1,12],[1,13],[3,3],[3,8],[3,10],[3,15], [4,3],[4,8],[4,10],[4,15],[5,3],[5,8],[5,10],[5,15],[6,5], [6,6],[6,7],[6,11],[6,12],[6,13],[8,5], [8,6],[8,7],[8,11],[8,12],[8,13],[9,3],[9,8],[9,10],[9,15],[10,3],[10,8],[10,10],[10,15],[11,3],[11,8],[11,10],[11,15],[13,5],[13,6],[13,7],[13,11],[13,12],[13,13]],

	key: function(n) {
		return this[Object.keys(this)[n]]}
};

//=================   UI grid  and sync      ========================


jQuery(document).ready(function	() {
///////////

	/*
	 set scale of grid and Universe object
	 *  */

	var CELL_SIZE = 20;

	var rows;
	var stolets;
	var gridWidth;
	var gridHeight;
	var side;

	var newUniverse = Object.create(Universe);

	function calculateSide(gw,gh){
		if(gw > gh){
			side = gw;
		}else{
			side = gh
		}
		side = side - 1 + CELL_SIZE;
	}

	function beginningOfTheWorld(stolets,rows){
		gridWidth = stolets * CELL_SIZE + 1;
		gridHeight = rows * CELL_SIZE + 1;
		$( "canvas#grid" ).attr( "width", gridWidth );
		$( "canvas#grid" ).attr( "height", gridHeight );
		newUniverse.initialize(rows,stolets);
		calculateSide(gridWidth,gridHeight);//добавить в сет.клик

	}

	beginningOfTheWorld(20,15); //default value


	/*
	 draw basic grid
	 * */

	var grid_canvas = document.getElementById("grid");
	var context = grid_canvas.getContext("2d");

	function gridDraw() {

		for (var x = 0.5; x < side; x += CELL_SIZE) {
			context.moveTo(x, 0);
			context.lineTo(x, side);
		}
		for (var y = 0.5; y <= side; y += CELL_SIZE) {
			context.moveTo(0, y);
			context.lineTo(side, y);
		}
		context.strokeStyle = 'black';
		context.fillStyle = "#000";
		context.stroke();
	}

	function gridClear(){
		context.clearRect ( 0 , 0 , gridWidth, gridHeight );
	}

	gridDraw();

	/*
	 creating of new cells	or deleting them
	 */

	function born(a,b){
		var s = a / CELL_SIZE;
		var r = b / CELL_SIZE;
		newUniverse.field[r][s].alive = true;
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
	/*	var x = e.offsetX == undefined ? e.layerX : e.offsetX;
		var y = e.offsetY == undefined ? e.layerY : e.offsetY;*/

        if(e.offsetX==undefined) // this works for Firefox
        {
            var x = e.pageX-$('#grid').offset().left;
            var y = e.pageY-$('#grid').offset().top;
        }
        else                     // works in Google Chrome
        {
            var x = e.offsetX;
            var y = e.offsetY;
        }

		var a = result(x);
		var b = result(y);

		var pixelData = context.getImageData(x, y, 1, 1).data;
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

	/*
	 set drawing of survival cells and life process
	 */

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

				}

			}
		}
	}

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


	/*
	 set  buttons
	 */

	$('button#set').click(function (e){//debugger;
		e.preventDefault();
		var newStolets = parseInt($('input#gridWidth').val());
		var newRows = parseInt($('input#gridHeight').val());
		beginningOfTheWorld(newStolets,newRows);
		gridDraw();

	});

	$('button#step').click(function (e){
		e.preventDefault();
		lifeProcess();
	});


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

	function allCellsMustDie(){
		for (var i = 0; i < objectLength(newUniverse.field); i++) {
			for (var j = 0; j < objectLength(newUniverse.field[i]); j++) {
				newUniverse.field[i][j].alive = false;
			}
		}
	}

	function reset(){
		$("button#auto").text('Auto');
		clearInterval(autoLife);
		gridClear();
		gridDraw();
		allCellsMustDie();
		$('span.generation-counter').text(0);
	}

	$('button#reset').click(function (e) {
		e.preventDefault();
		reset();
	});

	$('button#forms').click(function (e){//debugger;
		e.preventDefault();
		$(this).text('One more');
		reset();
		formCreator(formCounter);
		aliveCellDrawer()
	});

	var formCounter = 0;
	function formCreator(fc){//debugger;
		var formName = forms.key(fc);
		console.log(formName);
		for(var i = 0; i < objectLength(formName); i++){
			var r = formName[i][0];
			var s = formName[i][1];
			newUniverse.field[r][s].alive = true;
		}
		if (formCounter < objectLength(forms)-2) {
			formCounter += 1
		} else{
			formCounter = 0
		}

	}

	$('button#info').click(function (e){
		e.preventDefault();
		$('.info').toggle();
	});

////////////////////////////////////
});

/*
 set  auxiliary functions
 */

//this one instead of deprecated function toggle()
$.fn.clicktoggle = function(a, b) {
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





//========================================
//TODO: (идея - режим интересные фигуры), сделать бесконечное поле, баг с ховером
//больше размер клетки? ведешь мышкой а не щелкаешь? , можно чтоб человек сам задавал скорость
//наползание канвас на соседнюю колонку.