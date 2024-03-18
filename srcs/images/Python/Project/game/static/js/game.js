let PI = Math.PI;



function edgesColl(data, ctx, tr)
{
    if (data.ball.x + ballvx(data.ball) * tr.dt < data.ball.r - ctx.width / 2 - ctx.lengoal)
    {            
        tr.ntv = PI;
        tr.nrv = ctx.ballv;
        tr.restart = true;
        // tr.ntv = sanangle(PI - data.ball.tv);
        tr.dt = (data.ball.r - ctx.width / 2 - ctx.lengoal - data.ball.x) / ballvx(data.ball)
    }
    if (data.ball.x + ballvx(data.ball) * tr.dt > ctx.width / 2 - data.ball.r + ctx.lengoal)
    {
        tr.ntv = 0;
        tr.nrv = ctx.ballv;
        tr.restart = true;
        // tr.ntv = sanangle(PI - data.ball.tv);
        tr.dt = (ctx.width / 2 - data.ball.r  + ctx.lengoal - data.ball.x) / ballvx(data.ball)
    }

    if (data.ball.y + ballvy(data.ball) * tr.dt < data.ball.r - ctx.height / 2 && Math.sin(data.ball.tv) < 0)
    {
        tr.ntv = sanangle(- data.ball.tv);
        tr.dt = (data.ball.r - ctx.height / 2 - data.ball.y) / ballvy(data.ball)
    }
    if (data.ball.y + ballvy(data.ball) * tr.dt > ctx.height / 2 - data.ball.r && Math.sin(data.ball.tv) > 0)
    {
        tr.ntv = sanangle(- data.ball.tv);
        tr.dt = (ctx.height / 2 - data.ball.r - data.ball.y) / ballvy(data.ball)
    }
    return (tr);
}

function paddlesColl(data, ctx, tr)
{
    var dtc;
    var paddle;
    var side;

    for (let i = 0; i < 4; i++)
    {
        switch (i)
        {
            case 0:
                side = 1;
                paddle = data.paddleL;
                dtc = (data.paddleL.x + ctx.paddlew - data.ball.x + data.ball.r) / ballvx(data.ball);
                break;
            case 1:
                side = - 1;
                dtc = (data.paddleL.x - data.ball.x - data.ball.r) / ballvx(data.ball);
                break;
            case 2:
                side = 1;
                paddle = data.paddleR;
                dtc = (data.paddleR.x + ctx.paddlew - data.ball.x + data.ball.r) / ballvx(data.ball);
                break;
            case 3:
                side = -1;
                dtc = (data.paddleR.x - data.ball.x - data.ball.r) / ballvx(data.ball);
                break;
        }
        if (dtc >= 0 && dtc <= tr.dt && data.ball.y + ballvy(data.ball) * dtc > paddle.y + paddle.vy * dtc 
            && data.ball.y + ballvy(data.ball) * dtc < paddle.y + paddle.vy * dtc + ctx.paddleh
            && Math.cos(data.ball.tv) * side < 0)
        {
            tr.rv = data.ball.rv / ctx.ballfriction;
            tr.dt = dtc;
            tr.ntv = sanangle(((2 * (data.ball.y + ballvy(data.ball) * dtc - (paddle.y + dtc * paddle.vy)) / ctx.paddleh) - 1) * PI / 4);
            if (side == -1)
                tr.ntv = sanangle(PI - tr.ntv);
            //document.getElementById("test").innerHTML = (data.ball.y + ballvy(data.ball) * dtc - (paddle.y + dtc * paddle.vy)) / ctx.paddleh;
        }
    }
    return (tr);
}

function spheres(sphere1, sphere2)
{
    let dx = sphere1.x - sphere2.x;
    let dy = sphere1.y - sphere2.y;
    let dvx = ballvx(sphere1) - ballvx(sphere2);
    let dvy = ballvy(sphere1) - ballvy(sphere2);

    let a = Math.pow(dvx, 2) + Math.pow(dvy, 2);
    if (a == 0)
        return (-1);
    let b = 2 * (dx * dvx + dy * dvy);
    let c = Math.pow(dx, 2) + Math.pow(dy, 2) - Math.pow(sphere1.r + sphere2.r, 2);

    let delta = Math.pow(b, 2) - 4 * a * c;

    if (delta < 0)
        return (-1);
    return ((- b - Math.sqrt(delta)) / (2 * a));
}


function allSpheresColl(data, ctx, tr)
{
    var coll;
    var little =
    {
        x : data.paddleL.x + ctx.paddlew / 2,
        y : data.paddleL.y,
        r : ctx.paddlew / 2,
        rv : data.paddleL.vy,
        tv : PI / 2
    };
    coll = spheres(little, data.ball);
    //document.getElementById("test").innerHTML = coll;
    //logMessage(coll);
    if (coll >= 0 && coll <= tr.dt)
    {
        tr.nrv *= ctx.smash;
        tr.dt = coll;
        tr.ntv = sanangle(- PI / 4);
        tr.nlvy = ctx.recoil;
        data.paddleL.recover = 0;
    }

    little.y = data.paddleL.y + ctx.paddleh;

    coll = spheres(little, data.ball);
    if (coll >= 0 && coll <= tr.dt)
    {
        tr.nrv *= ctx.smash;
        tr.dt = coll;
        tr.ntv = sanangle(PI / 4);
        tr.nlvy = - ctx.recoil;
        data.paddleL.recover = 0;
    }

    little.x = data.paddleR.x + ctx.paddlew / 2;
    little.y = data.paddleR.y;
    little.rv = data.paddleR.vy;

    coll = spheres(little, data.ball);
    if (coll >= 0 && coll <= tr.dt)
    {
        tr.nrv *= ctx.smash;
        tr.dt = coll;
        tr.ntv = sanangle(- 3 * PI / 4);
        tr.nrvy = ctx.recoil;
        data.paddleR.recover = 0;
    }

    little.y = data.paddleR.y + ctx.paddleh;

    coll = spheres(little, data.ball);
    if (coll >= 0 && coll <= tr.dt)
    {
        tr.nrv *= ctx.smash;
        tr.dt = coll;
        tr.ntv = sanangle(3 * PI / 4);
        tr.nrvy = - ctx.recoil;
        data.paddleR.recover = 0;
    }
    return (tr);
}

function paddles(data, ctx, tr)
{
    if (data.paddleL.y + data.paddleL.vy * tr.dt - ctx.paddlew / 2 < - ctx.height / 2)
    {
        tr.dt = (- ctx.height / 2 - data.paddleL.y + ctx.paddlew / 2) / data.paddleL.vy;
        tr.nlvy = 0;
    }
    else if (data.paddleL.y + data.paddleL.vy * tr.dt + ctx.paddleh + ctx.paddlew / 2 > ctx.height / 2)
    {
        tr.dt = (ctx.height / 2 - data.paddleL.y - ctx.paddlew / 2 - ctx.paddleh) / data.paddleL.vy;
        tr.nlvy = 0;
    }
    if (data.paddleR.y + data.paddleR.vy * tr.dt - ctx.paddlew / 2 < - ctx.height / 2)
    {
        tr.dt = (- ctx.height / 2 - data.paddleR.y + ctx.paddlew / 2) / data.paddleR.vy;
        tr.nrvy = 0;
    }
    else if (data.paddleR.y + data.paddleR.vy * tr.dt + ctx.paddleh + ctx.paddlew / 2 > ctx.height / 2)
    {
        tr.dt = (ctx.height / 2 - data.paddleR.y - ctx.paddlew / 2 - ctx.paddleh) / data.paddleR.vy;
        tr.nrvy = 0;
    }
    return (tr);
}

function input(data, ctx)
{
    data.paddleL.vy /= ctx.paddlefriction; // Deplacer pour que ce soit en fonction du t et dans la simulation
    data.paddleR.vy /= ctx.paddlefriction;
    data.ball.rv /= ctx.ballfriction;
    if (data.ball.rv < ctx.ballv)
        data.ball.rv = ctx.ballv;
    data.paddleL.recover += data.t / ctx.recovertime;
    data.paddleR.recover += data.t / ctx.recovertime; 
    if (data.paddleL.recover > 1)
        data.paddleL.recover = 1;
    if (data.paddleR.recover > 1)
        data.paddleR.recover = 1;
    if (data.keys[0] == true)
    {
        data.paddleL.vy += ctx.paddlespeed * data.paddleL.recover * data.t;
        //data.paddleR.vy += ctx.paddlespeed * data.paddleR.recover * data.t;
    }
    if (data.keys[1] == true)
    {
        data.paddleL.vy -= ctx.paddlespeed * data.paddleL.recover * data.t;
        //data.paddleR.vy -= ctx.paddlespeed * data.paddleR.recover * data.t;
    }
    if (data.keys[2] == true)
    {
        //data.paddleL.vy += ctx.paddlespeed * data.paddleL.recover * data.t;
        data.paddleR.vy += ctx.paddlespeed * data.paddleR.recover * data.t;
    }
    if (data.keys[3] == true)
    {
        //data.paddleL.vy -= ctx.paddlespeed * data.paddleL.recover * data.t;
        data.paddleR.vy -= ctx.paddlespeed * data.paddleR.recover * data.t;
    }

}

function sanangle(angle) {return angle % (2 * PI)}
function ballvx(ball) {return ball.rv * Math.cos(ball.tv);}
function ballvy(ball) {return ball.rv * Math.sin(ball.tv);}

function deepcopy(tr)
{
    let copy = {
        dt : tr.dt,
        nrv : tr.nrv,
        ntv : tr.ntv,
        nlvy : tr.nlvy,
        nrvy : tr.nrvy,
        restart : tr.restart
    }
    return (copy)
}

export function simulate(data, ctx)
{
    input(data, ctx);
    var i = 0;
    var inter;
    var final;
    while (data.t > 0)
    {
        let tr = {
            dt : data.t,
            nrv : data.ball.rv,
            ntv : data.ball.tv,
            nlvy : data.paddleL.vy,
            nrvy : data.paddleR.vy,
            restart : false
        }
        final = deepcopy(tr);

        inter = paddles(data, ctx, deepcopy(tr));
        tr.dt = inter.dt;
        if (inter.dt < final.dt)
            final = deepcopy(inter);
        if (!data.scored)
        {
            inter = edgesColl(data, ctx, deepcopy(tr));
            tr.dt = inter.dt;
            if (inter.dt < final.dt)
                final = deepcopy(inter);
        }
        inter = paddlesColl(data, ctx, deepcopy(tr));
        tr.dt = inter.dt;
        if (inter.dt < final.dt)
            final = deepcopy(inter);
        inter = allSpheresColl(data, ctx, deepcopy(tr));
        tr.dt = inter.dt;
        if (inter.dt < final.dt)
            final = deepcopy(inter);

        data.ball.x += ballvx(data.ball) * final.dt;
        data.ball.y += ballvy(data.ball) * final.dt;
        if (final.restart && !data.scored)
        {
            if (data.ball.x > 0)
                data.paddleL.score++;
            else
                data.paddleR.score++;
            data.scored = true;
        }
        data.paddleL.y += data.paddleL.vy * final.dt;
        data.paddleR.y += data.paddleR.vy * final.dt;

        data.ball.rv = final.nrv;
        data.ball.tv = final.ntv;
        if (data.ball.rv > 1000000)
            data.ball.rv = 1000000;

        data.paddleL.vy = final.nlvy;
        data.paddleR.vy = final.nrvy;
        data.t -= final.dt;

        i++;
        // logMessage("i = " + i);
        if (i == 10000)
        {
            return (1);
        }
    }
    data.t = 0.1;
    if (data.scored == true)
        data.timeSinceRestart += data.t;
    if (data.timeSinceRestart >= ctx.timeToRestart)
    {
        data.ball.x = 0;
        data.ball.y = 0;
        data.timeSinceRestart = 0;
        data.scored = false;
    }
    return (0);
}

// window.onerror = function (message, source, lineno, colno, error) {
//     console.error('Catch error:', message);
//     return true;
//   };