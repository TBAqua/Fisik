/*
#######################################
#               SETUP                 #
#######################################
*/

let gravity = 800;
let loss = -24;
let consumption = 1;

const canvas = document.getElementById("canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Couldn't find a <canvas> with id \"canvas\"");
}

canvas.width = 720;
canvas.height = 720;

const ctx = canvas.getContext("2d");

if (ctx === null) {
    throw new Error("Couldn't get a 2D context from the canvas");
}

/*
#######################################
#               BORDER                #
#######################################
*/

interface Border {
    x: number;
    y: number;
    width: number;
    radius: number;
}

const border: Border = {
    x: canvas.width/2,
    y: canvas.height/2,
    width: 2,
    radius: 300
};

ctx.beginPath();
ctx.arc(border.x, border.y, border.radius, 0, Math.PI * 2, false);
ctx.lineWidth = border.width;
ctx.stroke();

/*
#######################################
#                BALL                 #
#######################################
*/

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

const ball: Ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    vx: 1,
    vy: 0,
    radius: 6
};

ctx.beginPath();
ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
ctx.fill();

/*
#######################################
#                LOOP                 #
#######################################
*/

const collide = (dx: number, dy: number, dist: number, maxDist: number) => {
    let nx = dx / dist;
    let ny = dy / dist;

    let dot = ball.vx * nx + ball.vy * ny;

    if (dot > 0) {
        ball.vx -= 2 * dot * nx;
        ball.vy -= 2 * dot * ny;
    }

    let speed = Math.hypot(ball.vx, ball.vy)
    let newSpeed = speed - loss
    newSpeed = Math.max(newSpeed, 0);
    let scale = newSpeed / speed;

    ball.vx *= scale;
    ball.vy *= scale;

    ball.radius += consumption;
    ball.radius = Math.min(ball.radius, border.radius - border.width / 2);

    const newMaxDist = border.radius - border.width / 2 - ball.radius;

    ball.x = border.x + nx * newMaxDist;
    ball.y = border.y + ny * newMaxDist;

    ball.radius += consumption;
    ball.radius = Math.min(ball.radius, border.radius - border.width / 2);
}

const update = (dt: number) => {
    ball.vy += gravity * dt;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    let dx = ball.x - border.x
    let dy = ball.y - border.y
    let dist = Math.hypot(dx, dy)
    const maxDist = border.radius - border.width / 2 - ball.radius

    if (dist > maxDist) {
        collide(dx, dy, dist, maxDist);
    }
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(border.x, border.y, border.radius, 0, Math.PI * 2, false);
    ctx.lineWidth = border.width;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fill();
}

let lastTime: number | null = null;

const loop = (time: number) => {
    if (lastTime === null) {
        lastTime = time;
    }

    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    update(dt);
    draw();

    requestAnimationFrame(loop);
};

requestAnimationFrame(loop);