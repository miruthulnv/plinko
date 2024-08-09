class Circle{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.color = 'pink';
        this.radius = 6;
        this.height = this.radius;
        this.width = this.radius;
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
}

class Rectangle{
    constructor(x,y,colour,points) {
        this.x = x;
        this.y = y;
        this.color = colour;
        this.points = points;
        this.width = 25;
        this.height = 5;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,50,10);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
}