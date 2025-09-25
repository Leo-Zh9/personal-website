const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const NUM_LINES = 7;
const NUM_POINTS = 500;
const MIN_AMPLITUDE = 50;
const MAX_AMPLITUDE = 120;
const PULSE_INTERVAL = 1000;

const strings = [];
for (let i = 0; i < NUM_LINES; i++) {
    const amplitude = MIN_AMPLITUDE + Math.random() * (MAX_AMPLITUDE - MIN_AMPLITUDE);
    const frequency = 3 + Math.random() * 2;
    const phase = Math.random() * Math.PI * 2;

    const points = [];
    for (let j = 0; j < NUM_POINTS; j++) {
        const x = (canvas.width / (NUM_POINTS - 1)) * j;
        points.push({ x: x, y: canvas.height / 2, baseY: canvas.height / 2 });
    }

    strings.push({ points, amplitude, frequency, phase });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now();

    strings.forEach(string => {
        const pts = string.points;
        pts.forEach((p, i) => {
            const t = i / (NUM_POINTS - 1);
            const wave = Math.sin(t * string.frequency * 2 * Math.PI + string.phase);
            const oscillationSpeed = 0.0015; 
            const verticalMod = 0.5 + 0.5 * Math.sin(time * oscillationSpeed + string.phase);
            p.y = p.baseY + wave * string.amplitude * verticalMod;
        });

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'hotpink');
        gradient.addColorStop(1, 'blue');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 0; i < pts.length - 1; i++) {
            const xc = (pts[i].x + pts[i + 1].x) / 2;
            const yc = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.stroke();
    });

    requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    strings.forEach(string => {
        string.points.forEach((p, j) => {
            p.x = (canvas.width / (NUM_POINTS - 1)) * j;
            p.baseY = canvas.height / 2;
        });
    });
});
