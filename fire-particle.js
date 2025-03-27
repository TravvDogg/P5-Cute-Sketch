class FireParticle {
    // Define the parameters for each Fire Particle
    constructor(x, y) {

    // Define starting parameters
        
        // Define particle starting coordinates
        this.x = x
        this.y = y
        
        // Give the fire random velocity, to move up and to the side at varying speeds
        this.vx = random(-0.4, 0.4)
        this.vy = random(-4, -0.5)

        // Start the particle as transparent, to fade in
        this.alpha = 0
        this.fadingIn = true

        // Vary the starting sizes of each particle
        this.size = random(20, 28)

        // Random color at differing shades of red / orange / yellow
        this.color = [random(15, 27), 80, 100];

    // Reduce the particle's 'visual energy' as they progress 
    // higher values will damp less

        // Reduce the speed they move sideways and up
        this.damping_x = 0.95
        this.damping_y = 0.975

        // Reduce the size and opacity of each particle
        this.decay_size = 0.98
        this.decay_alpha = 0.985

        // Random value for the particles to sway back and forth with the 'wind'
        this.sway = random(10)
    }

    update() {
        // Translate each particle by their velocity
        // And apply sway to the particles over time. 
        // Increase coefficient of sin() for more spread
        this.x += this.vx + (sin(this.sway) * 0.2)

        this.y += this.vy

        // Reduce velocity over time
        this.vx *= this.damping_x 
        this.vy *= this.damping_y
        
        // Reduce size over time
        this.size *= this.decay_size
        
        // Advance 'sway' over time
        // Larger values will increase their oscillating left-to-right energy. 
        this.sway += 0.02
        
        // Fade particles in then out
        if (this.alpha < 1 && this.fadingIn) {
             //Fade in over 8 frames
            this.alpha += 1 / 8
        } else {
            // Once faded in, begin fading each particle out
            this.fadingIn = false
            this.alpha *= this.decay_alpha
        }
    }

    show() {
        colorMode(HSB)
        noStroke()
        // Use a softer, more varied fire color
        fill(this.color[0], this.color[1] * (this.alpha * 2), this.color[2] * (this.alpha * 2), this.alpha)
        ellipse(this.x, this.y, this.size)

    }

    isFinished() {
        return this.alpha <= 0.005
    }
}
