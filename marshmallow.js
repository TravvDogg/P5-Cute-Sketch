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
    this.cookThreshold  // ~3 seconds at the current framerate (or 60) before burning

    // 0-1 value of cooking progress
    this.cookedProgress = 0

  }
  
  update() {
    this.cookThreshold = 15 * frameRate()
    // Simple State Machine
    this.position.set(mouseX, mouseY)
    

    // update value of cooking progress

    // Cook Marshmallow
    if (this.state == "cooking") {
      // Increment cooking timer while near the fire
      this.cookTimer++
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
    // Move the origin to the marshmallow's position
    translate(this.position.x, this.position.y)
    
    // Draw the marshmallow based on its current state
    if (this.isBurnt) {
      // Burnt appearance: darker fill and stroke
      fill(80)
      stroke(60)
    } else if (this.isExtinguished) {
      
    } else {
      // Normal cute marshmallow: soft, warm colors
      colorMode(RGB)
      fill(255, 240, 240)
      // TODO: Interpolate from white to golden brown, with a threshold before completely burnt
      stroke(200)
    }
    ellipse(0, 0, 40, 40)

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
  
  // On right-click: if burnt, first extinguish then eat; else eat directly if following
  rightClickAction() {
    if (this.isBurnt) {
      if (!this.Extinguished) {
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
window.Marshmallow = Marshmallow;