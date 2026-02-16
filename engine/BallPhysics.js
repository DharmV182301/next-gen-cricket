export class BallPhysics {
    constructor(game) {
        this.game = game;
        this.reset();

        // Physics constants
        this.gravity = 0.5;
        this.friction = 0.99;
        this.bounceFactor = 0.7;
    }

    reset() {
        this.active = false;
        // 3D coordinates:
        // x: horizontal position (-width/2 to width/2)
        // y: vertical height (0 is ground)
        // z: depth (0 is player/camera, positive is away)
        this.pos = { x: 0, y: 0, z: 1000 };
        this.vel = { x: 0, y: 0, z: 0 };
        this.radius = 10;
        this.color = '#fff';
        this.type = 'NORMAL'; // SPIN, FAST, SWING
    }

    bowl(type, speed, targetX) {
        this.reset();
        this.active = true;
        this.type = type;

        // Setup initial velocity based on bowl type
        // z-velocity is negative (coming towards player)
        this.vel.z = -speed;

        // Calculate needed x/y velocity to hit target
        // Simple linear prediction for now
        const timeToReach = 1000 / speed;
        this.vel.x = (targetX - this.pos.x) / timeToReach;

        // Add some arc
        this.vel.y = -5; // Initial loft
        this.pos.y = 50; // Release height

        console.log(`Bowling: ${type} at speed ${speed}`);
    }

    update() {
        if (!this.active) return;

        // Apply velocities
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.z += this.vel.z;

        // Apply gravity
        this.vel.y += this.gravity;

        // Bounce logic (ground is y = 100 approx, relative to horizon)
        // Simplified: y > 0 is "below ground" in our 3D space, but for rendering we map differently.
        // Let's say y=0 is ground level. y>0 is up.

        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y *= -this.bounceFactor;

            // Apply spin/friction on bounce
            if (this.type === 'SPIN') {
                this.vel.x += (Math.random() - 0.5) * 10; // Random deviation on bounce
            }
        }

        // Check if passed player
        if (this.pos.z < 0) {
            this.game.handleBallPassed(this.pos);
            this.active = false;
        }
    }

    draw(ctx, width, height) {
        if (!this.active) return;

        // Perspective Projection
        const fov = 300;
        const scale = fov / (fov + this.pos.z);

        // Horizon line offset
        const horizonY = height * 0.4;
        const groundY = height; // Bottom of screen is z=0 ground

        // Map 3D pos to 2D screen
        // x: centered
        const screenX = width / 2 + (this.pos.x * scale);
        // y: map 0 (ground) to geometric ground plane
        // Simple perspective: y moves up as z increases
        const screenY = (height - 50) - (this.pos.y * scale) - ((1000 - this.pos.z) * 0.2); // Fake perspective height

        const size = this.radius * scale;

        // Draw Ball
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(2, size), 0, Math.PI * 2);

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.type === 'SPIN' ? '#0f0' : '#f0f';
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Trail
        // (Simplified for now, just draw circle)
    }
}
