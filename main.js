
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//////////////////////////////////////////////////////////////////////
function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 200;
    this.isCircle = true;
    
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.box = new BoundingBox(this.x-this.radius, this.y - this.radius, this.radius*2,this.radius*2 );
    //this.prev = {top: this.box.top, bottom: this.box.bottom, left : this.box.left, right: this.box.right };
    this.prev = {x: this.box.x, y: this.box.y};
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    if (Math.random() > 0.5) this.velocity.x = -this.velocity.x;
    if (Math.random() > 0.5) this.velocity.y = -this.velocity.y;
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    
 //  console.log(this.velocity);
    
    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    this.box = new BoundingBox(this.x-this.radius, this.y - this.radius, this.radius*2,this.radius*2 );
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.isCircle) {
	        if (ent !== this && this.collide(ent)) {
	            var temp = { x: this.velocity.x, y: this.velocity.y };
	
	            var dist = distance(this, ent);
	            var delta = this.radius + ent.radius - dist;
	            var difX = (this.x - ent.x)/dist;
	            var difY = (this.y - ent.y)/dist;
	
	            this.x += difX * delta / 2;
	            this.y += difY * delta / 2;
	            ent.x -= difX * delta / 2;
	            ent.y -= difY * delta / 2;
	
	            this.velocity.x = ent.velocity.x * friction;
	            this.velocity.y = ent.velocity.y * friction;
	            ent.velocity.x = temp.x * friction;
	            ent.velocity.y = temp.y * friction;
	            this.x += this.velocity.x * this.game.clockTick;
	            this.y += this.velocity.y * this.game.clockTick;
	            ent.x += ent.velocity.x * this.game.clockTick;
	            ent.y += ent.velocity.y * this.game.clockTick;
	            if (this.it) {
	                this.setNotIt();
	                ent.setIt();
	            }
	            else if (ent.it) {
	                this.setIt();
	                ent.setNotIt();
	            }
	        }

	        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
	            var dist = distance(this, ent);
	            if (this.it && dist > this.radius + ent.radius + 10) {
	                var difX = (ent.x - this.x)/dist;
	                var difY = (ent.y - this.y)/dist;
	                this.velocity.x += difX * acceleration / (dist*dist);
	                this.velocity.y += difY * acceleration / (dist * dist);
	                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
	                if (speed > maxSpeed) {
	                    var ratio = maxSpeed / speed;
	                    this.velocity.x *= ratio;
	                    this.velocity.y *= ratio;
	                }
	            }
	            if (ent.it && dist > this.radius + ent.radius) {
	                var difX = (ent.x - this.x) / dist;
	                var difY = (ent.y - this.y) / dist;
	                this.velocity.x -= difX * acceleration / (dist * dist);
	                this.velocity.y -= difY * acceleration / (dist * dist);
	                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
	                if (speed > maxSpeed) {
	                    var ratio = maxSpeed / speed;
	                    this.velocity.x *= ratio;
	                    this.velocity.y *= ratio;
	                }
	            }
	        }
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        }
        else if(this !== ent && !ent.isCircle && this.box.hasCollided(ent.box)) {
        		//if(ent !== this && !ent.isCircle){
        		
	    	 		if(this.prev.y < this.box.y && this.box.y + this.box.height > ent.box.y && this.prev.y + this.box.height <= ent.box.y){
					console.log("collide bottom");
					this.velocity.y = - this.velocity.y;
		        } else if(this.prev.y > this.box.y && this.box.y < ent.box.y + ent.box.height && this.prev.y >= ent.box.y + ent.box.height) {
		        		console.log("collide top");
		        		this.velocity.y = - this.velocity.y;
		        } else if(this.prev.x < this.box.x && this.box.x + this.box.width > ent.box.x) {
		        		//console.log("collide right");
		        		this.velocity.x = -this.velocity.x;
		        } else if(this.prev.x > this.box.x && this.box.x < ent.box.x + ent.box.width) {
		        		//console.log("collide left");
		        		this.velocity.x = -this.velocity.x;
		        }
        }
    
    
	}
	
//    this.x -=  2 *  this.velocity.x * this.game.clockTick;
// 	this.y -=  2 * this.velocity.y * this.game.clockTick;

//    this.prev.top = this.box.top;
//    this.prev.bottom = this.box.bottom;
//    this.prev.left = this.box.left;
//    this.prev.right = this.box.right;
    
 	this.prev.x = this.box.x;
    this.prev.y = this.box.y;
    
    
    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
    this.box = new BoundingBox(this.x-this.radius, this.y - this.radius, this.radius*2,this.radius*2 );
    Entity.prototype.update.call(this);
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    this.box.draw(ctx);
};
// the "main" code begins here
var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    var rect = new Rectangle(gameEngine);
    gameEngine.addEntity(rect);
    circle.setIt();
    gameEngine.addEntity(circle);
    
    for (var i = 0; i < 1; i++) {
    		var rect = new Rectangle(gameEngine);
    		gameEngine.addEntity(rect);
    }
    for (var i = 0; i < 3; i++) {
		var circle = new Circle(gameEngine);
		gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
	//Load canvas id for save and load button.
    var saveButton = document.getElementById('save');
    var loadButton = document.getElementById('load');
    
    //Declare save button function and add action listener.
    saveButton.addEventListener("click", function(d) {   	
    		var saveData = [];
        for(var i = 0; i < gameEngine.entities.length; i++) {
	        	var ent = gameEngine.entities[i];
	    		var saveEnt = { x: ent.x, y: ent.y, velocity: ent.velocity, color: ent.color};
	    			saveData.push(saveEnt);
        }
        console.log(saveData.length);
        gameEngine.socket.emit("save", { studentname: "Cuong Tran", statename: "aState", data: saveData });
        
    }, false);
    //Declare load button function and add action listener.
    loadButton.addEventListener("click", function(d) {
    		gameEngine.socket.emit("load", { studentname: "Cuong Tran", statename: "aState"});
    }, false);
    
    gameEngine.socket.on("load", function(d){
    	for(var i = 0; i < gameEngine.entities.length; i++) {
    		gameEngine.entities[i].x = d.data[i].x;
    		gameEngine.entities[i].y = d.data[i].y;
    		gameEngine.entities[i].velocity = d.data[i].velocity;
    		gameEngine.entities[i].color = d.data[i].color;
    	}
    });
});
