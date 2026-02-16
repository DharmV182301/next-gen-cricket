export class BattingSystem {
    constructor(game) {
        this.game = game;
        this.swinging = false;
        this.swingDirection = null; // LEFT, RIGHT, STRAIGHT
        this.swingTimer = 0;

        // Input Bindings
        window.addEventListener('keydown', (e) => this.handleInput(e));
        window.addEventListener('touchstart', (e) => this.handleTouch(e));
    }

    handleInput(e) {
        if (this.swinging) return;

        switch (e.key) {
            case 'ArrowLeft':
                this.swing('LEFT');
                break;
            case 'ArrowRight':
                this.swing('RIGHT');
                break;
            case 'ArrowUp':
                this.swing('STRAIGHT');
                break;
        }
    }

    handleTouch(e) {
        // Ignore touches on control buttons or other UI elements
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

        const touchX = e.touches[0].clientX;
        const width = window.innerWidth;

        if (touchX < width / 3) this.swing('LEFT');
        else if (touchX > width * 2 / 3) this.swing('RIGHT');
        else this.swing('STRAIGHT');
    }

    swing(dir) {
        this.swinging = true;
        this.swingDirection = dir;
        this.swingTimer = 20; // Frames to complete swing
        console.log(`Swinging ${dir}`);

        this.game.checkCollision(dir);
    }

    update() {
        if (this.swinging) {
            this.swingTimer--;
            if (this.swingTimer <= 0) {
                this.swinging = false;
                this.swingDirection = null;
            }
        }
    }

    draw(ctx, width, height) {
        if (!this.swinging) {
            // Draw Bat Idle (represented as a dormant vector/line)
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(width / 2, height - 20);
            ctx.lineTo(width / 2, height - 100);
            ctx.stroke();
            return;
        }

        // Draw Swing
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#0ff';

        ctx.beginPath();
        const centerX = width / 2;
        const baseY = height - 20;

        ctx.moveTo(centerX, baseY);

        // Calculate endpoint based on direction
        let destX = centerX;
        if (this.swingDirection === 'LEFT') destX = centerX - 100;
        if (this.swingDirection === 'RIGHT') destX = centerX + 100;

        ctx.lineTo(destX, height - 120);
        ctx.stroke();

        ctx.shadowBlur = 0;
    }
}
