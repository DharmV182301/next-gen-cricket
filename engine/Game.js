import { BallPhysics } from './BallPhysics.js';
import { BattingSystem } from './BattingSystem.js';
import { BowlerBrain } from './BowlerBrain.js';
import { Commentary } from './Commentary.js';
import { ParticleSystem } from './ParticleSystem.js';
import { SoundManager } from './SoundManager.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.lastTime = 0;
        this.gameState = 'MENU';

        // Initialize Systems
        this.ball = new BallPhysics(this);
        this.batting = new BattingSystem(this);
        this.bowler = new BowlerBrain();
        this.commentary = new Commentary();
        this.particles = new ParticleSystem();
        this.sound = new SoundManager();

        this.score = 0;
        this.ballsFaced = 0;
        this.streak = 0;
        this.flowStateActive = false;

        console.log("Game Engine Fully Integrated");

    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    start() {
        this.gameState = 'PLAYING';
        this.lastTime = performance.now();
        requestAnimationFrame((ts) => this.loop(ts));

        this.scheduleNextBall();
        this.updateCommentary('START');
    }

    scheduleNextBall() {
        if (this.gameState !== 'PLAYING') return;

        this.ctx.filter = 'none';
        const delay = this.flowStateActive ? 3000 : 2000;

        setTimeout(() => {
            const delivery = this.bowler.decideDelivery();
            this.ball.bowl(delivery.type, delivery.speed, delivery.targetX);

            this.updateBowlerHUD(delivery);
            this.sound.playBowl();
        }, delay);
    }

    updateBowlerHUD(delivery) {
        const statusEl = document.getElementById('bowler-status');
        statusEl.innerText = `INCOMING: ${delivery.type}`;
        statusEl.style.color = "var(--neon-pink)";

        const confBar = document.getElementById('confidence-bar');
        confBar.style.width = this.bowler.confidence + "%";
    }

    updateCommentary(type, detail) {
        const text = this.commentary.getLine(type, detail);
        const box = document.getElementById('commentary-text');
        box.style.opacity = 0;
        setTimeout(() => {
            box.innerText = text;
            box.style.opacity = 1;
        }, 200);
    }

    handleBallPassed(pos) {
        console.log("Ball passed");
        this.bowler.recordOutcome(this.ball.type, 'MISS');
        this.streak = 0;
        this.checkFlowState();

        this.updateCommentary('MISS');
        this.ballsFaced++;
        this.updateHUD();
        this.scheduleNextBall();
    }

    checkCollision(swingDir) {
        if (!this.ball.active) return;

        if (this.ball.pos.z < 150 && this.ball.pos.z > 0) {
            // HIT!
            this.ball.active = false;

            let points = 1;
            let outcome = 'HIT';

            if (this.ball.type === 'FAST' && swingDir === 'STRAIGHT') points = 4;
            if (this.ball.type === 'SPIN' && (swingDir === 'LEFT' || swingDir === 'RIGHT')) points = 6;

            this.score += points;
            this.bowler.recordOutcome(this.ball.type, outcome);

            this.streak++;
            this.checkFlowState();

            // Visual feedback
            this.triggerVisualFeedback('HIT', points);
            this.updateCommentary('HIT', points);
            this.sound.playHit(this.ball.type);

            // Particles
            // Spawn at ball pos mapped to screen
            // Since ball is at z~100, we approximate screen pos
            const screenX = this.canvas.width / 2 + this.ball.pos.x;
            const screenY = this.canvas.height - 100; // rough approximation
            this.particles.spawn(screenX, screenY, '#0ff', 20);

            this.ballsFaced++;
            this.updateHUD();
            this.scheduleNextBall();
        }
    }

    checkFlowState() {
        if (this.streak >= 3) {
            if (!this.flowStateActive) {
                this.flowStateActive = true;
                document.getElementById('game-container').style.border = "4px solid var(--neon-pink)";
            }
        } else {
            this.flowStateActive = false;
            document.getElementById('game-container').style.border = "2px solid var(--neon-cyan)";
        }
    }

    updateHUD() {
        document.getElementById('score-display').innerText = `${this.score}/0`;
        const overs = Math.floor(this.ballsFaced / 6) + "." + (this.ballsFaced % 6);
        document.getElementById('overs-display').innerText = overs;
    }

    triggerVisualFeedback(type, magnitude) {
        if (type === 'HIT') {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (magnitude >= 4) {
                const canvas = this.canvas;
                canvas.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                setTimeout(() => canvas.style.transform = 'none', 100);
            }
        }
    }

    loop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(dt) {
        this.ball.update();
        this.batting.update();
        this.particles.update();
    }

    draw() {
        this.ctx.fillStyle = this.flowStateActive ? 'rgba(20, 0, 20, 0.2)' : 'rgba(5, 5, 16, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGrid();

        this.ball.draw(this.ctx, this.canvas.width, this.canvas.height);
        this.batting.draw(this.ctx, this.canvas.width, this.canvas.height);
        this.particles.draw(this.ctx); // Draw particles

        if (this.flowStateActive) {
            this.ctx.fillStyle = "rgba(255, 0, 255, 0.05)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = this.flowStateActive ? 'rgba(255, 0, 255, 0.2)' : 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        const horizon = this.canvas.height * 0.4;

        this.ctx.beginPath();
        const centerX = this.canvas.width / 2;

        for (let i = -10; i <= 10; i++) {
            this.ctx.moveTo(centerX, horizon);
            this.ctx.lineTo(centerX + (i * this.canvas.width * 0.15), this.canvas.height);
        }

        for (let i = 0; i < 15; i++) {
            const y = horizon + (Math.pow(i, 2) * 2);
            if (y > this.canvas.height) break;
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
    }
}
