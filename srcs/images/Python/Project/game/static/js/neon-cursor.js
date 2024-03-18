const maxPointDistance = 500;
const maxPointAge = 3000;

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const canvas = document.getElementById('trailCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let points = [];

    document.addEventListener('mousemove', e => {
        const newX = e.pageX;
        const newY = e.pageY;
        const now = Date.now();
    
        cursor.style.left = newX - cursor.offsetWidth / 2 + 'px';
        cursor.style.top = newY - cursor.offsetHeight / 2 + 'px';

        points.push({ x: newX, y: newY, time: now });

        while (points.length > 1) {
            const point = points[0];
            const age = now - point.time;
            const distance = calculateDistance(point, { x: newX, y: newY });
    
            if (distance > maxPointDistance || age > maxPointAge) {
                points.shift();
            } else {
                break;
            }
        }
    });
    
    function calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length < 1) {
            requestAnimationFrame(draw);
            return;
        }

        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(171, 0, 201)';

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        let gradient = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length - 1].x, points[points.length - 1].y);
        gradient.addColorStop(0, 'rgba(171, 0, 201, 0)');
        gradient.addColorStop(1, 'rgba(171, 0, 201, 1)');

        ctx.strokeStyle = gradient;
        ctx.stroke();

        points.shift();

        requestAnimationFrame(draw);
    }

    draw();
});
