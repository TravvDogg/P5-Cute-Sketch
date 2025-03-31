/* \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
------------------------------------------------------------------------
        Written by Travis Lizio | Creative Coding A1
------------------------------------------------------------------------
        Marshmallow Class: 
          Handles behavior and state for the marshmallow
------------------------------------------------------------------------
\\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ */

class Marshmallow {
  constructor(x, y) {
    // Initialise starting position for the marshmallow
    this.initialPos = createVector(x, y)
    this.position = createVector(x, y)
    // Velocity for movement towards targets
    this.velocity = createVector(0, 0)
    
    // Possible states:
    // "idle"      : Near the player, not cooking
    // "cooking"   : Near the fire, cooking up
    this.state = "idle"
    this.isBurnt = false
    this.isEaten = false

    // Flag to check if a burnt marshmallow has been extinguished
    this.isExtinguished = false
    
    // Timer to track cooking progress when near the fire
    this.cookTimer = 0
    // Threshold in seconds
    this.cookThreshold = 0.5

    // Initialise marshmallow's burning effect
    this.fire_particles = []
  }
  
  update() {
    // Simple State Machine
    this.position.set(mouseX, mouseY)

    // Cook Marshmallow
    if (this.state == "cooking") {
      // Increment cooking timer while near the fire, based on seconds
     
      // Time elapsed in seconds
      let dt = 1 / frameRate()
      
      // Update cooking progress based on time
      this.cookTimer += dt // TODO: Accelerate cooking based on proximity to the fire column
      this.cookedProgress = constrain(this.cookTimer / this.cookThreshold, 0, 1)

      console.log(this.cookedProgress)
      if (this.cookTimer > this.cookThreshold) {
        this.isBurnt = true
      }
    }
    // Do nothing if "eaten"
  }
  
  show() {
    // Skip display logic if "eaten"
    if (this.isEaten) return
    
    // Save the current drawing state
    push()
    
    // Update and display all fire_particles
    for (let i = this.fire_particles.length - 1; i >= 0; i--) {
      this.fire_particles[i].update()
      this.fire_particles[i].show()

      // Remove fire_particles when they have faded out
      if (this.fire_particles[i].isFinished()) {
        this.fire_particles.splice(i, 1)
      }
    }

    // Draw the marshmallow based on its current state
    colorMode(HSB)
    if (this.isBurnt && !this.isExtinguished) {
      // Burnt appearance: darker fill and stroke
      fill(40, 30, 30)
      stroke(10, 50, 50)

      // Add a flame particle to the marshmallow
      if (frameCount % random(1, 2) <= 1) {
        this.fire_particles.push(
          new FireParticle(this.position.x, this.position.y, 1, 0.975, 0.1, 0.5, -2, 0.97, ),
        )
      }

    } else if (this.isExtinguished) {
      fill(40)
      stroke(0)
    } else {
      // Normal cute marshmallow: soft, warm colors
      fill(60, 7, 95)
      // TODO: Interpolate from white to golden brown, with a threshold before completely burnt
      stroke(200)
    }
    ellipse(this.position.x, this.position.y, 40, 40)

    pop()
  }
  
  // Mouse interactions
  
  // On left mouse press: throw the marshmallow if it is following the mouse
  throwTowardsFire() {
    if (this.state == "idle") {
      this.state = "cooking"
    }
  }
  
  // On left mouse release: return the marshmallow to its initial position
  returnToPlayer() {
    if (this.state == "cooking") {
      this.state = "idle"
    }
  }
  
  // On right-click: if burnt, first extinguish then eat, else eat directly
  rightClickAction() {
    if (this.isBurnt) {
      if (!this.isExtinguished) {
        // First right-click extinguishes the burnt marshmallow
        this.isExtinguished = true
      } else {
        // Second right-click: eat the marshmallow
        this.isEaten = true
      }
    } else if (this.state == "following") {
      // Eat the marshmallow if not burnt and idle
      this.isEaten
    }
  }

  eatMarshmallow() {
    if (this.cookTimer >= this.cookThreshold || this.isExtinguished) {
      // Unhappy, yucky marshmallow
    } else if (this.cookTimer <= this.cookThreshold) {

    } 
  }
}

// Make the class available in the global scope
window.Marshmallow = Marshmallow