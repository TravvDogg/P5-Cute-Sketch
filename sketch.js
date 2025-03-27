/* \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
------------------------------------------------------------------------
        Written by Travis Lizio | Creative Coding A1
------------------------------------------------------------------------
        Main Sketch
------------------------------------------------------------------------
\\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ */

// Marshmallow burning Sound effect by ZapSplat (ZapSplat Standard Lisence)
// Campfire and forest sounds by West Wolf (ZapSplat Standard Lisence)

// ZapSplat Standard Lisence does not require links to each sound effect
// https://www.zapsplat.com/license-type/standard-license/

let SFX_marshmallow_burn;
let SFX_campfire;

// Initialise fire_particles array
let fire_particles = [];
// Initialise coordinates of fire base
let fire_base_x;
let fire_base_y;
// Set fire_lit to false
let fire_lit = true;

// Instance of the marshmallow class
let marshmallow

function preload() {
  // Once i have sound effects they will be loaded here
}

function setup() {
  createCanvas(400, 400);
  frameRate(60);

  // Draw fire from the middle of the screen
  fire_base_x = width / 2;
  // Draw fire 3/4 the height of the screen
  fire_base_y = (3 * height) / 4;

  marshmallow = new Marshmallow(width / 2, height / 2)
}

function draw() {
  // ---------------------------------Execute Regardless of Fire State-----------------------------
  colorMode(RGB);
  background(50);

  // Update and display all fire_particles
  for (let i = fire_particles.length - 1; i >= 0; i--) {
    fire_particles[i].update();
    fire_particles[i].show();

    // Remove fire_particles when they have faded out
    if (fire_particles[i].isFinished()) {
      fire_particles.splice(i, 1);
    }
  }

  // Logic for the beginning of the simulation, before the fire is lit
  if (!fire_lit) {
    // -------------------------------Execute While Fire is Unlit----------------------------------

    // Draw the 'open eyes' or 'light campfire' text, on black screen

    return;
  }
  // ---------------------------------Execute While Fire is Lit------------------------------------

  // Add a flame particle to the base of the fire on varying frames
  if (frameCount % random(1, 2) <= 1) {
    // Draw a flame particle at a random place along the width of the base of the fire
    fire_particles.push(
      new FireParticle(fire_base_x + random(-20, 20), fire_base_y),
    );
  }

  marshmallow.update()
  marshmallow.show()
}


// Interactions

function mousePressed() {
  if (mouseButton == LEFT) {
    marshmallow.throwTowardsFire()
  } else if (mouseButton == RIGHT) {
    marshmallow.rightClickAction()
    return false
  }
}
// Prevent default context menu on right click (courtesey of dev.to,
// https://dev.to/natclark/disable-right-click-context-menu-in-javascript-49co
window.addEventListener(`contextmenu`, (e) => e.preventDefault());

function mouseReleased() {
  if (mouseButton == LEFT) {
    marshmallow.returnToPlayer()
  }
}

// Toggle the fire when mouse is clicked (DEPRECIATED)
// TODO: Toggle the fire when 'F' key is pressed instead.
// function mouseClicked() {
//   // if (!fire_lit) {
//   //   fire_lit = true
//   // }
//   fire_lit = !fire_lit;
// }


