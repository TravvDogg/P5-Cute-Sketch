class SmokeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0.5; // Opacity
        this.size = random(8, 15); // Varying particle sizes
        this.xOffset = random(1000); // Perlin noise offset
    }

    update() {
        this.y -= random(0.5, 2); // Slow upward drift
        this.x += map(noise(this.xOffset), 0, 1, -0.5, 0.5); // Wavy horizontal motion
        this.alpha -= 1 / 255; // Gradual fade
        this.xOffset += 0.01; // Increment noise offset
    }

    show() {
        noStroke();
        fill(150, this.alpha); // Soft gray color
        ellipse(this.x, this.y, this.size);
    }

    isFinished() {
        return this.alpha <= 0;
    }
}

class SmokeStream {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.particles = [];
    }

    update() {
        this.particles.push(new SmokeParticle(this.baseX, this.baseY)); // Add new smoke particles

        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isFinished()) {
                this.particles.splice(i, 1);
            }
        }
    }

    show() {
        for (let particle of this.particles) {
            particle.show();
        }
    }
}