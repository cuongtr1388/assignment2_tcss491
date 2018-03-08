function Rectangle(game) {
    this.width = 20;
    this.height = 100;
    this.isCircle = false;
    this.x = 0;
    this.y = 0;
    this.box = new BoundingBox(this.x, this.y, this.width, this.height);
    this.colors = ["Green", "Blue", "White"];
    Entity.call(this, game, this.x + Math.random() * (800 - this.x * 2), this.y + Math.random() * (800 - this.y * 2));
    
    //this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    this.velocity = {y: Math.random() *1000};
    //if (Math.random() > 0.5) this.velocity.x = -this.velocity.x;
    if (Math.random() > 0.5) this.velocity.y = -this.velocity.y;
    var speed = Math.sqrt(this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.y *= ratio;
    }
};

Rectangle.prototype = new Entity();
Rectangle.prototype.constructor = Rectangle;
Rectangle.prototype.collide = function (other) {
    return distance(this, other) < this.width;
};

Rectangle.prototype.collideTop = function () {
    return this.y < 0;
};

Rectangle.prototype.collideBottom = function () {
    return this.y > 800 - this.height;
};

Rectangle.prototype.update = function () {
    
    
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = 0;
        if (this.collideBottom()) this.y = 700;
        this.y += this.velocity.y * this.game.clockTick;
    }
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if(!ent.isCircle) {
	        this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
	        this.y += this.velocity.y * this.game.clockTick;
        }
    }
    this.box = new BoundingBox(this.x,this.y,this.width,this.height);
   
    Entity.prototype.update.call(this);
}
Rectangle.prototype.draw = function (ctx) {
	//console.log("drawing!!!!!!");
    ctx.beginPath();
    
    ctx.fillStyle = this.colors[this.color];
    ctx.rect(this.x, this.y, this.width, this.height);
    this.color = 2;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    this.box.draw(ctx);
};