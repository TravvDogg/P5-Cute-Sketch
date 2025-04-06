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

    // Possible states:
    // "undercooked"    : Undercooked. Its alright
    // "perfect"        : Perfect. Yummy Marshmallow
    // "burnt"          : Overcooked, tastes like charcoal
    this.cookedState = "undercooked"

    // Weather or not the marshmallow is eaten.
    this.isEaten = false

    // Check for completion of eaten sound effect
    this.soundEffectPlayed = false

    // Check before deleting marshmallow
    // Incase marshmallow still has tasks to do.
    this.isFinished = false

    // Flag to check if a burnt marshmallow has been extinguished
    this.isExtinguished = false
    
    // Timer to track cooking progress when near the fire
    this.cookTimer = 0
    // TOTAL Time to cook in seconds, before burning
    this.cookThreshold = 5
    // Ratio dictating the time the marshmallow can be cooked in its 'perfect state' without burning
    this.perfectionRatio = 0.6

    // Initialise marshmallow's burning effect
    this.fire_particles = []

    // Marshmallow size when near fire
    this.maxSize = 40
    this.minSize = 30

    // Time to shrink (in seconds)
    this.shrinkDuration = 0.2

    // Set display size as max size by default
    this.displaySize = this.maxSize

    // Capture the time this instance has been running in milliseconds
    this.ms = millis()
  }
  
  update() {

    // Temporary check, simulates a sound finished playing
    this.soundEffectPlayed = true
    // Mark marshmallow for deletion once it has completed every function.
    this.isFinished = (this.soundEffectPlayed && (this.fire_particles.length == 0))

    this.position.set(mouseX, mouseY)

    // Cook Marshmallow
    if (this.state == "cooking") {
      // Increment cooking timer while near the fire, based on seconds
     
      // Time elapsed in seconds
      let dt = 1 / frameRate()
      
      // Update cooking progress based on time
      this.cookTimer += dt // TODO: Accelerate cooking based on proximity to the fire column
      this.cookedProgress = constrain(this.cookTimer / this.cookThreshold, 0, 1)
      if (this.cookTimer > this.cookThreshold) {
        this.cookedState = "burnt"
      }
    }
    // Do nothing if "eaten"
  }
  
  show() {
    // Persistant logic to run after marshmallow is eaten.

    // Update and display all fire_particles
    for (let i = this.fire_particles.length - 1; i >= 0; i--) {
      this.fire_particles[i].update()
      this.fire_particles[i].show()
      
      // Remove fire_particles when they have faded out
      if (this.fire_particles[i].isFinished()) {
        this.fire_particles.splice(i, 1)
      }
    }
    
    // Skip the rest of the display logic if "eaten"
    if (this.isEaten) return

    // Draw the marshmallow based on its current state
    colorMode(HSB)
    // colors for the marshmallow
    let soft_white = color(45, 7, 95)
    let golden_brown = color(29, 52, 79)
    let burnt = color(12, 31, 50)

    if (this.cookedState == "burnt" && !this.isExtinguished) {
      // Burnt appearance: darker fill and stroke
      fill(color(burnt))
      stroke(10, 50, 50)
      
      // Add a flame particle to the marshmallow
      if (frameCount % random(1, 2) <= 1) {
        this.fire_particles.push(
          new FireParticle(this.position.x, this.position.y, 1, 0.975, 0.1, 0.5, -2, 0.97)
        )
      }
      
    } else if (this.isExtinguished) {
      fill(color(burnt))
      stroke(20)
    } else {

      let perfectTime = this.cookThreshold * this.perfectionRatio
      if (this.cookTimer < perfectTime) {
        let progress = constrain(this.cookTimer / perfectTime, 0, 1)
        // Interpolate between HSB values.
        fill(lerpColor(soft_white, golden_brown, progress))
      } else {
        // Remain at golden brown before burning
        fill(color(golden_brown))
        this.cookedState = "perfect"
      }
      noStroke()
    }
    
    let elapsed = (millis() - this.ms) / 1000.0
    if (this.state == "cooking") {
      if (elapsed < this.shrinkDuration) {
      this.displaySize = constrain(map(elapsed, 0, this.shrinkDuration, this.maxSize, this.minSize), this.minSize, this.maxSize)
      } else {
      this.displaySize = this.minSize
      }
    } else {
      if (elapsed < this.shrinkDuration) {
        this.displaySize = constrain(map(elapsed, 0, this.shrinkDuration, this.minSize, this.maxSize), this.minSize, this.maxSize)
      } else {
        this.displaySize = this.maxSize
      }
    }


    
    let marshmallowSquircleCurves = this.displaySize / 3
    square(this.position.x, this.position.y, this.displaySize, marshmallowSquircleCurves, marshmallowSquircleCurves, marshmallowSquircleCurves, marshmallowSquircleCurves)

  }
  
  // Mouse interactions

  // On left mouse press: throw the marshmallow if it is following the mouse
  throwTowardsFire() {
    if (this.state == "idle") {
      this.ms = millis()
      this.state = "cooking"
    }
  }
  
  // On left mouse release: return the marshmallow to its initial position
  returnToPlayer() {
    if (this.state == "cooking") {
      this.ms = millis()
      this.state = "idle"
    }
  }
  
  // On right-click: if burnt, first extinguish then eat, else eat directly
  rightClickAction() {
    if (this.cookedState == "burnt") {
      if (!this.isExtinguished) {
        // First right-click extinguishes the burnt marshmallow
        this.isExtinguished = true
      } else {
        // Second right-click: eat the marshmallow
        this.eatMarshmallow()
      }
    } else if (this.state == "idle") {
      // Eat the marshmallow if not burnt and idle
      this.eatMarshmallow()
    }
  }

  eatMarshmallow() {
      if (this.cookedState == "undercooked") {
        this.isEaten = true
      } else if (this.cookedState == "perfect") {
        this.isEaten = true
      } else if (this.cookedState == "burnt") {
        this.isEaten = true
      }
  }
}