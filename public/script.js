const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const NUM_LINES = 7;
const NUM_POINTS = 500;
const MIN_AMPLITUDE = 50;
const MAX_AMPLITUDE = 120;
const PULSE_INTERVAL = 1000; // heartbeat per second

// Add a straight line (no oscillation)
// const straightLinePoints = [];
// for (let j = 0; j < NUM_POINTS; j++) {
//     const x = (canvas.width / (NUM_POINTS - 1)) * j;
//     straightLinePoints.push({ x: x, y: canvas.height / 2, baseY: canvas.height / 2 });
// }
// strings.push({ points: straightLinePoints, amplitude: 0, frequency: 0, phase: 0, isStraight: true });

// Generate lines with independent amplitudes and frequencies but synced pulse
const strings = [];
for (let i = 0; i < NUM_LINES; i++) {
    const amplitude = MIN_AMPLITUDE + Math.random() * (MAX_AMPLITUDE - MIN_AMPLITUDE);
    const frequency = 3 + Math.random() * 2; // base wave frequency
    const phase = Math.random() * Math.PI * 2; // independent wave offset

    const points = [];
    for (let j = 0; j < NUM_POINTS; j++) {
        const x = (canvas.width / (NUM_POINTS - 1)) * j;
        points.push({ x: x, y: canvas.height / 2, baseY: canvas.height / 2 });
    }

    strings.push({ points, amplitude, frequency, phase });
}

// Heartbeat envelope function (same for all lines)-----------------------------------------------------------
// function heartbeatEnvelope(t) {
//     const ms = t % PULSE_INTERVAL;
//     const normalized = ms / PULSE_INTERVAL;

//     // Simple ECG-like shape: small rise → sharp spike → drop → flat
//     if (normalized < 0.3) return normalized * 0.5;             // P wave
//     else if (normalized < 0.35) return 1.5 * (normalized - 0.3) * 20; // QRS spike
//     else if (normalized < 0.45) return 1 - (normalized - 0.35) * 10;  // decay
//     else return 0; // flat T wave + rest
// }


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now();

    strings.forEach(string => {
    const pts = string.points;

    pts.forEach((p, i) => {
        if (!string.isStraight) {
            const t = i / (NUM_POINTS - 1);
            const wave = Math.sin(t * string.frequency * 2 * Math.PI + string.phase);

            const oscillationSpeed = 0.0015; 
            const verticalMod = 0.5 + 0.5 * Math.sin(time * oscillationSpeed + string.phase);

            p.y = p.baseY + wave * string.amplitude * verticalMod;
        } else {
            p.y = p.baseY; // straight line stays at center
        }
    });

    // Draw the line
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

async function getCurrentTrack() {
  try {
    const res = await fetch("/api/current-track");
    const data = await res.json();

    if (data.item) {
      const track = data.item;
      document.getElementById("track-name").innerText = track.name;
      document.getElementById("track-artist").innerText = track.artists
        .map((a) => a.name)
        .join(", ");
      document.getElementById("track-album").src =
        track.album.images[0].url;
    } else {
      document.getElementById("track-name").innerText =
        "No track playing";
      document.getElementById("track-artist").innerText = "";
      document.getElementById("track-album").src = "";
    }
  } catch (error) {
    console.error("Error fetching Spotify track:", error);
  }
}

// Initial fetch and auto-refresh every 10 seconds
getCurrentTrack();
setInterval(getCurrentTrack, 10000);