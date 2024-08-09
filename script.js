const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const ballLeft = document.querySelector('#balls-left');
const score = document.querySelector('#score');
let scoreTracker = 0;
canvas.width = 500;
canvas.height = 500;

const listOfCircles = [];
const listOfRectangles = [];

const collision = function (el1,el2){
    return el1.y + el1.height >= el2.y - el2.height && el1.y - el1.height <= el2.y + el2.height &&
        el1.x + el1.width >= el2.x - el2.width && el1.x - el1.width <= el2.x + el2.width
}
const dis = (x1,y1,x2,y2)=>{
   return Math.hypot(x2-x1,y2-y1)
}

const randomInt = (min,max)=>{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const drawCircle = (x,y)=>{
    listOfCircles.push(new Circle(x,y));
}
const drawAllCircles = ()=>{

    // drawCircle(250,100);
    //
    // drawCircle(225,150);
    // drawCircle(275,150);
    //
    // drawCircle(200,200);
    // drawCircle(250,200);
    // drawCircle(300,200);
    //
    // drawCircle(175,250);
    // drawCircle(225,250);
    // drawCircle(275,250);
    // drawCircle(325,250);
    //
    // drawCircle(175,250);
    // drawCircle(225,250);
    // drawCircle(275,250);
    // drawCircle(325,250);
    //
    // drawCircle(150,300);
    // drawCircle(200,300);
    // drawCircle(250,300);
    // drawCircle(300,300);
    // drawCircle(350,300);

    const rows = [
        { y: 100, xStart: 225, xEnd: 275, count: 3 },
        { y: 130, xStart: 200, xEnd: 300, count: 4 },
        { y: 160, xStart: 175, xEnd: 325, count: 5 },
        { y: 190, xStart: 150, xEnd: 350, count: 6 },
        { y: 220, xStart: 125, xEnd: 375, count: 7 },
        { y: 250, xStart: 100, xEnd: 400, count: 8 },
        { y: 280, xStart: 75, xEnd: 425, count: 9 },


    ];


    rows.forEach(row => {
        const xStep = (row.xEnd - row.xStart) / (row.count - 1);
        for (let i = 0; i < row.count; i++) {
            drawCircle(row.xStart + i * xStep, row.y);
        }
    });


}
const drawRect = (x,y,color,points)=>{
    listOfRectangles.push(new Rectangle(x,y,color,points))
}
const drawAllRect = ()=>{
    drawRect(100,350,'#ff0000',50);
    drawRect(150,350,'#ff5a00',40);
    drawRect(200,350,'#ff9a00',30);
    drawRect(250,350,'#ffce00',20);
    drawRect(300,350,'#ecca00',10);
    drawRect(350,350,'#f0ff00',-10);
}

drawAllCircles();
drawAllRect();

const drawGameBoard = ()=>{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    listOfCircles.forEach(circle=>{
        circle.draw();
    })
    listOfRectangles.forEach(rect=>{
        rect.draw();
    })
}

drawGameBoard();


class Ball{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.color = 'yellow';
        this.speedY = 0.4;
        this.speedX = 0;
        this.height = this.radius;
        this.width = this.radius;
        this.comMatch = false;
        this.gravity = 0.001;

    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
    update(){
        this.request = requestAnimationFrame(this.update.bind(this));
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGameBoard();
        this.speedY += this.gravity;
        this.newPos();
        this.draw();
        this.circleCollision();
        this.rectCollision();
    }

    newPos(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    circleCollision() {
        listOfCircles.forEach(circle=>{
            if (!circle.disabled){
                if (collision(this,circle)){
                    circle.disabled = true;
                    if (Math.abs(this.x - circle.x)<3){
                        this.comMatch = true;
                    }
                    this.changeDirection();
                    // cancelAnimationFrame(this.request)
                }
            }
        })
    };

    rectCollision(){

        listOfRectangles.forEach(rect=>{
            if (collision(this,rect)){
                console.log('collision with rectangle');
                cancelAnimationFrame(this.request);
                this.radius=0;
                scoreTracker+=rect.points;
                console.log(scoreTracker)
            }
            // console.log(dis(this.x,this.y,rect.x,rect.y))
            // if(dis(this.x,this.y,rect.x,rect.y) < this.radius + rect.height/2
            // ){
            //     console.log('collision with rectangle');
            //     cancelAnimationFrame(this.request);
            //     setTimeout(()=>{this.radius = 0},2000);
            //     console.log(rect.points)
            // }
        });
    }

    changeDirection() {
        if (this.comMatch){
            this.speedX = randomInt(1,2) === 1 ? 1 : -1;
            console.log(this.speedX)
            this.comMatch = false;
        }
        else{
            console.log('moving perpendicular')
            const x = this.speedX;
            const y = this.speedY;
            this.speedX = -x;
            this.speedY = y;
        }

    }
}
let ball =  new Ball(250,50);
ball.radius=0;

canvas.addEventListener('click',()=>{
    score.textContent = scoreTracker;
    if (Number(ballLeft.textContent) > 0 && !ball.radius){
        listOfCircles.forEach(circle=>circle.disabled=false);
        ball = new Ball(250,50);
        ball.update();
        ballLeft.textContent = Number(ballLeft.textContent) - 1;
    }
})