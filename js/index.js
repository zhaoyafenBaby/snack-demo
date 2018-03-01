// 1、点开始游戏--》startPage none，wrapper block
// 2、随机生成食物，三段蛇--》左上角，自动向右动
// 3、点左上角暂停按钮--》运动暂停/恢复
// 4、上下左右按钮控制方向
// 5、吃到食物，score+1
// 6、撞到四周/自身，游戏结束，lose block，显示分数
// 7、点close按钮，wrapper none，startPage block，分数清零，初始运动；

var oStartBtn = document.getElementsByClassName('startBtn')[0],
	oWrapper = document.getElementsByClassName('wrapper')[0],
	oStartPage = document.getElementsByClassName('startPage')[0],
	oGrass = document.getElementsByClassName('grass')[0],
	oScoreBox = document.getElementsByClassName('scoreBox')[0],
	oLose = document.getElementsByClassName('lose')[0],
	oLoseScore = document.getElementsByClassName('loseScore')[0],
	oCloseBtn = document.getElementsByClassName('close')[0],
	oPauseAndStart = document.getElementsByClassName('pauseAndStart')[0], 
	oFood = document.getElementsByClassName('food')[0],
	snakeMove,
	speed = 200,
	newfood = undefined,
	startBool = true,
	paushBool = true;


init();
function init(){
	//地图属性
	this.mapW = parseInt(getComputedStyle(oGrass).width);
	this.mapH = parseInt(getComputedStyle(oGrass).height);
	this.mapDiv = oGrass;
	//食物属性
	this.foodW = 20;
	this.foodH = 20;
	this.foodX = 0;
	this.foodY = 0;
	//蛇属性
	this.snakeW = 20;
	this.snakeH = 20;
	this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
	this.snakeX = 0;
	this.snakeY = 0;
	//游戏属性
	this.direction = 'right';
	this.right = false;
	this.left = false;
	this.up = true;
	this.down = true;
	this.score = 0;
	
	bindEvent();
}

function food(){
	newfood = document.createElement('div');
	newfood.style.width = this.foodW + 'px';
	newfood.style.height = this.foodH + 'px';
	newfood.style.position = 'absolute';
	this.foodX = Math.floor(Math.random() * (this.mapW/20));
	this.foodY = Math.floor(Math.random() * (this.mapH/20));
	newfood.style.left = this.foodX * 20 + 'px';
	newfood.style.top = this.foodY * 20 + 'px';
	this.mapDiv.appendChild(newfood).setAttribute('class','food');
	console.log(newfood)
}

function startGame(){
	if(!newfood){
		food();
	}
	snake();
	snakeMove = setInterval(function(){
		move();
	},speed)

}

function snake(){
	for(var i = 0; i < this.snakeBody.length; i ++){
		var snake = document.createElement('div');
		snake.style.width = this.snakeW + 'px';
		snake.style.height = this.snakeH + 'px';
		snake.style.position = 'absolute';
		snake.style.left = this.snakeBody[i][0] * this.snakeW + 'px';
		snake.style.top = this.snakeBody[i][1] * this.snakeH + 'px';
		snake.classList.add(this.snakeBody[i][2]);
		this.mapDiv.appendChild(snake).classList.add('snake');
		switch(this.direction){
			case 'right':
				break;
			case 'up':
				snake.style.transform = 'rotate(270deg)';
				break;
			case 'left':
				snake.style.transform = 'rotate(180deg)';
				break;
			case 'down':
				snake.style.transform = 'rotate(90deg)';
				break;
			default:
				break;
		}
	}
}

function move(){
	for(var i = this.snakeBody.length - 1; i > 0; i --){
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];
	}
	switch(this.direction){
		case 'right':
			this.snakeBody[0][0] += 1;
			break;
		case 'down':
			this.snakeBody[0][1] += 1;
			break;
		case 'left':
			this.snakeBody[0][0] -= 1;
			break;
		case 'up':
			this.snakeBody[0][1] -= 1;
			break;
		default:
			break;
	}
	removeClass('snake');
	snake();
	if(this.snakeBody[0][0] === this.foodX && this.snakeBody[0][1] === this.foodY){
		var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
		var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
		switch(this.direction){
			case 'right':
				this.snakeBody.push([snakeEndX - 1,snakeEndY,'body']);
				break;
			case 'down':
				this.snakeBody.push([snakeEndX,snakeEndY + 1,'body']);
				break;
			case 'left':
				this.snakeBody.push([snakeEndX + 1,snakeEndY,'body']);
				break;
			case 'up':
				this.snakeBody.push([snakeEndX,snakeEndY - 1,'body']);
				break;
			default:
				break;
		}
		this.score += 1;
		
		removeClass('food');
		food();
	}
	if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] > this.mapW/20){
		reloadGame();
	}
	if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] > this.mapH/20){
		reloadGame();
	}
	for(var i = 1; i < this.snakeBody.length; i ++){
		if(this.snakeBody[0][0] == this.snakeBody[i][0] && this.snakeBody[0][1] == this.snakeBody[i][1]){
			reloadGame();
		}
	}
	oScoreBox.innerHTML = this.score;
}

function reloadGame(){
	removeClass('food');
	removeClass('snake');
	clearInterval(snakeMove);
	this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
	this.direction = 'right';
	this.right = false;
	this.left = false;
	this.up = true;
	this.down = true;
	oLose.style.display = 'block';
	oLoseScore.innerHTML = this.score;
	this.score = 0;
	newfood = undefined;
}

function removeClass(className){
	var ele = document.getElementsByClassName(className);
	while(ele.length > 0){
		ele[0].parentNode.removeChild(ele[0]);
	}
}

function setDirection(code){
	switch(code){
		case 37:
			if(this.left){
				this.direction = 'left';
				this.right = false;
				this.left = false;
				this.up = true;
				this.down = true;
			}
			break;
		case 38:
			if(this.up){
				this.direction = 'up';
				this.right = true;
				this.left = true;
				this.up = false;
				this.down =false;
			}
			break;
		case 39:
			if(this.right){
				this.direction = 'right';
				this.right = false;
				this.left = false;
				this.up = true;
				this.down =true;
			}
			break;	
		case 40:
			if(this.down){
				this.direction = 'down';
				this.right = true;
				this.left = true;
				this.up = false;
				this.down =false;
			}
			break;
		default:
			break;
	}
}

function bindEvent(){

	oCloseBtn.onclick = function(){
		reloadGame();
		oLose.style.display = 'none';
		oPauseAndStart.classList.remove('pauseImg');
		oPauseAndStart.classList.add('startImg');
	}

	oStartBtn.onclick = function(){
		oStartPage.style.display = 'none';
		oWrapper.style.display = 'block';
		startAndPaush();
	}

	oPauseAndStart.onclick = function(){
		startAndPaush();
	}
}

function startAndPaush(){
	if(paushBool){
		if(startBool){
			startGame();
			startBool = false;
		}
		oPauseAndStart.classList.add('pauseImg');
		document.onkeydown = function(e){
			var code = e.keyCode;
			setDirection(code);
		}
		paushBool = false;
	}else{
		oPauseAndStart.classList.remove('pauseImg');
		oPauseAndStart.classList.add('startImg');
		clearInterval(snakeMove);
		document.onkeydown = function(e){
			e.returnValue = false;
			return false;
		}
		paushBool = true;
		startBool = true;
	}
}
