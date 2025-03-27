// Header

// Marshmallow burning Sound effect by ZapSplat (ZapSplat Standard Lisence)
// Campfire and forest sounds by West Wolf (ZapSplat Standard Lisence)

// ZapSplat Standard Lisence does not require links to each sound effect
// https://www.zapsplat.com/license-type/standard-license/




let SFX_marshmallow_burn
let SFX_campfire


function preload() {
  
}

// Initialise fire_particles array
let fire_particles = []
// Initialise coordinates of fire base
let fire_base_x
let fire_base_y

// Initialise smoke_stream
let smoke_stream

function setup() {
  createCanvas(400, 400)
  frameRate(60)

  // Draw fire from the middle of the screen
  fire_base_x = width / 2
  // Draw fire 3/4 the height of the screen
  fire_base_y = 3 * height / 4

  // Assign the class SmokeStream to the variable smoke_stream
  smoke_stream = new SmokeStream(fire_base_x + random(-10, 10), fire_base_y)
}

let fire_lit = true
function draw() {
  // ---------------------------------Execute Regardless of Fire State-----------------------------
  colorMode(RGB)
  background(50)

  
  // Update and display all fire_particles
  for (let i = fire_particles.length - 1; i >= 0; i--) {
    fire_particles[i].update()
    fire_particles[i].show()
    
    // Remove fire_particles when they have faded out
    if (fire_particles[i].isFinished()) {
      fire_particles.splice(i, 1)
    }
  }
  
  // Update and display smoke_stream
  smoke_stream.update()
  smoke_stream.show()
  
  // Logic for the beginning of the simulation, before the fire is lit
  if (!fire_lit) {
  // ---------------------------------Execute While Fire is Unlit----------------------------------

    // Draw the 'open eyes' or 'light campfire' text, on black screen






    return
  }
  // ---------------------------------Execute While Fire is Lit------------------------------------

  // Add a flame particle to the base of the fire on varying frames
  if (frameCount % random(1, 2) <= 1) {
    // Draw a flame particle at a random place along the width of the base of the fire
    fire_particles.push(new FireParticle(fire_base_x + random(-20, 20), fire_base_y))
  }
}

// Toggle the fire when mouse is clicked
function mouseClicked() {
  // if (!fire_lit) {
  //   fire_lit = true
  // }
  fire_lit = !fire_lit
}