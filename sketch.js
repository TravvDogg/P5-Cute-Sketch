/* \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
------------------------------------------------------------------------
        Written by Travis Lizio | Creative Coding A1
------------------------------------------------------------------------
        Main Sketch
------------------------------------------------------------------------
\\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ */

//#region Main-Logic
// Initialise fire_particles array
let fire_particles = []
// Initialise coordinates of fire base
let fire_base_x
let fire_base_y
// Set fire_lit to false
let fire_lit = false
// Allow the code to do something wile the campfire is being lit, but not yet lit
let lightingCampfire = false
// Measure time for text to fade off screen
let fadeLightCampfireTextStartTime = 0

// How far away from the sides and top/bottom the text is drawn
const textPaddingSides = 20
const textPaddingUD = 10
// Check if the mouse is within the canvas
let mouseIsWithinCanvas

// Instance of the marshmallow class
let marshmallow

// Buffer for marshmallows that still have tasks to complete after they are eaten
let marshmallowBuffer = []

function preload() {
  sfxControl.initSounds()
}

function setup() {
  createCanvas(400, 400)
  frameRate(60)
  rectMode(CENTER)
  // Draw fire from the middle of the screen
  fire_base_x = width / 2
  // Draw fire 3/4 the height of the screen
  fire_base_y = (3 * height) / 4

  marshmallow = new Marshmallow(width / 2, height / 2)
}

function draw() {
  // ---------------------------------Execute Regardless of Fire State-----------------------------
  colorMode(RGB)
  background(50)

  mouseIsWithinCanvas = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height
  // Manage buffered marshmallows and delete them when neccesary.
  updateBufferedMarshmallows()
  // Update and display all fire_particles
  for (let i = fire_particles.length - 1; i >= 0; i--) {
    fire_particles[i].update()
    fire_particles[i].show()

    // Remove fire_particles when they have faded out
    if (fire_particles[i].isFinished()) {
      fire_particles.splice(i, 1)
    }
  }

  // Logic for the beginning of the simulation, before the fire is lit
  if (!fire_lit) {
    // -------------------------------Execute While Fire is Unlit----------------------------------

    if (!lightingCampfire) {
      fill(255, 255)
    } else {
      // Measure time elapsed with the variable elapsed
      let elapsed_LightCampfireText = millis() - fadeLightCampfireTextStartTime
      // Fade out the alpha over 500 ms, from 255 to 0.
      fill(255, lerp(255, 0, constrain(elapsed_LightCampfireText / 500, 0, 1)))
    }
    // Display starting text in the middle of the screen
    textAlign(CENTER, CENTER)
    text("Press 'F' to light campfire", width / 2, height / 2)
    return
  }
  // ---------------------------------Execute While Fire is Lit------------------------------------

  // Add a flame particle to the base of the fire on varying frames
  if (frameCount % random(1, 2) <= 1) {
    // Draw a flame particle at a random place along the width of the base of the fire
    fire_particles.push(
      new FireParticle(fire_base_x + random(-20, 20), fire_base_y),
    )
  }
  marshmallow.update()
  marshmallow.show()
  
  // Draw all ui elements on top
  drawUI()
}

let UI_alpha = 0
const fadeRate = 10

function drawUI() {
  colorMode(RGB)
  // Only draw UI elements when mouse is within the canvas
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    // Fade in to 255 (max alpha) at a constant rate, without going above 255
    UI_alpha = min(UI_alpha + fadeRate, 255)
  } else {
    // Fade out to 0 (min alpha) at a constant rate, without going below 0
    UI_alpha = max(UI_alpha - fadeRate, 0);
  }

  fill(255, UI_alpha)
  textAlign(LEFT, TOP)
  text("roast marshmallow \n◀ (left click)", textPaddingSides, textPaddingUD)
  textAlign(RIGHT, TOP)
  text("eat / replace marshmallow \n(right click) ▶", width - textPaddingSides, textPaddingUD)
}

function replaceActiveMarshmallow(newMarshmallow) {
  // Push old marshmallow into the buffer instead of instantly deleting it.
  if (marshmallow) {
    marshmallowBuffer.push(marshmallow)
  }
  marshmallow = newMarshmallow
}

function updateBufferedMarshmallows() {
  for (let i = marshmallowBuffer.length - 1; i >= 0; i--) {
    if (marshmallowBuffer[i].isFinished) {
      // Remove from buffer once everything is complete
      marshmallowBuffer.splice(i, 1)
    } else {
      marshmallowBuffer[i].update()
      marshmallowBuffer[i].show()
    }
  }
}


// Interactions

function mousePressed() {
  if (mouseButton == LEFT) {
    marshmallow.holdToFire()
  } else if (mouseButton == RIGHT) {
    if (!marshmallow.isEaten) {
      marshmallow.rightClickAction()
    } else {
      replaceActiveMarshmallow(new Marshmallow(mouseX, mouseY))
    }
    return false
  }
}

function mouseReleased() {
  if (mouseButton == LEFT) {
    marshmallow.returnToPlayer()
  }
}

// Prevent default context menu on right click, courtesey of dev.to,
// https://dev.to/natclark/disable-right-click-context-menu-in-javascript-49co
window.addEventListener(`contextmenu`, (e) => e.preventDefault())

function keyPressed() {
  if (key === 'F' || key === 'f') {
    if (!fire_lit && !lightingCampfire) {
      lightingCampfire = true
      fadeLightCampfireTextStartTime = millis()
      sfxControl.lightCampfire()
    }
  }
}


//#endregion

//#region Sound-Effect-Control-Functions
// Sound effect control and setup
/* 
--------------------------------------- Sound Effects Used ------------------------------------------
Marshmallow Lighting on fire sound effect (clipped)
And Marshmallow Burning loop (clipped and edited)
Firework sparkler Sound effect by ZapSplat (ZapSplat Standard License)
https://www.zapsplat.com/music/firework-sparkler-light-with-lighter-and-sizzle-fizz-burn/

Campfire Burning sound effect (clipped and edited)
Campfire and forest sounds by West Wolf (ZapSplat Standard License)
https://www.zapsplat.com/music/forest-campfire-crackling-fire-birds-in-the-background/

Marshmallow eat sound effect (clipped)
Single eat, crunch on a Pringle potato chip by ZapSplat (ZapSplat Standard License)
https://www.zapsplat.com/music/single-eat-crunch-on-a-pringle-potato-chip/

Marshmallow burn out flame sound effect (unedited)
Metal Zippo lighter flame blow out by ZapSplat (ZapSplat Standard License)
https://www.zapsplat.com/music/metal-zippo-lighter-flame-blow-out-on-the-first-try-version-4/

Light campfire sound effect (unedited)
Match Lighting.wav by Wihan98 -- https://freesound.org/s/544140/ -- License: Attribution 4.0

Marshmallow eat burp sound effect (unedited)
Burp Human by eZZin -- https://freesound.org/s/684129/ -- License: Creative Commons 0


Background Music (edited)
Music by Premankur Adhikary from Pixabay

------------------------------------------ Creative Licenses ----------------------------------------
ZapSplat Standard license
https://www.zapsplat.com/license-type/standard-license/

Creative Commons 0 License
https://creativecommons.org/publicdomain/zero/1.0/

Attribution 4.0 license
https://creativecommons.org/licenses/by/4.0/

Pixabay Content License
https://pixabay.com/service/license-summary/
*/

// Initialise variables for every sound effect or track to play
// Marshmallows and eating sounds
let SFX_marshmallow_ignite
let SFX_marshmallow_burn_loop
let SFX_marshmallow_extinguish
let SFX_marshmallow_eat
let SFX_burp
// Campfire sounds
let SFX_campfire_ignite
let SFX_campfire_loop
// Ambient music
let Music_ambience_loop

// Change any volume control here. No need to look through the rest of the script
const sfxVolume = {
    marshmallow_ignite: 1,
    marshmallow_burnLoop: 0.6,
    marshmallow_extinguish: 0.1,
    marshmallow_eat: 1,
    burp: 0.6,
    campfire_ignite: 1,
    campfire_loop: 0.8,
    ambientMusic: 0.15
    // ambientMusic: 0 // Temporarily mute music because it was getting a lil old while coding
}

// 50% chance to play burp sound effect. 
// Higher number means higher chance
const burpChance = 0.3

const sfxControl = {
    initSounds: function() {
        // Initialize all sound assets
        SFX_campfire_ignite = loadSound('Aux/Light_campfire.mp3')
        SFX_campfire_loop = loadSound('Aux/Campfire_loop.mp3')
        SFX_marshmallow_eat = loadSound('Aux/Marshmallow_eat.mp3')
        SFX_burp = loadSound('Aux/Burp.mp3')
        SFX_marshmallow_ignite = loadSound('Aux/Marshmallow_light.mp3')
        SFX_marshmallow_burn_loop = loadSound('Aux/Marshmallow_fire_loop.mp3')
        SFX_marshmallow_extinguish = loadSound('Aux/marshmallow_extinguish.mp3')
        Music_ambience_loop = loadSound('Aux/Ambient_music.mp3')
    },
    
    lightCampfire: function() {
      // Ignite Campfire sound
      SFX_campfire_ignite.setVolume(sfxVolume.campfire_ignite)
      SFX_campfire_ignite.play()
      setTimeout(() => {
        fire_lit = true
        // Fade in over 0.5 seconds, from 0 to the volume set in sfxVolume object
        fadeAsLoop(SFX_campfire_loop, 0, sfxVolume.campfire_loop, 0.5)

        // Play ambient music as a loop. 
        // It has its own crossfade in the file,
        // so it can just be played as a loop.
        Music_ambience_loop.setVolume(sfxVolume.ambientMusic)
        Music_ambience_loop.loop()
      }, 750)
    },
    
    eatMarshmallow: function(marshmallow_instance) {
      // Play marshmallow eat sound effect
      SFX_marshmallow_eat.setVolume(sfxVolume.marshmallow_eat)
      SFX_marshmallow_eat.play()
      
      // Randomised burp sound effect logic
      SFX_marshmallow_eat.onended(() => {
        // Chance to play burp sound effect
        if (random(1) < burpChance) {
            SFX_burp.setVolume(sfxVolume.burp)
            SFX_burp.play()
            SFX_burp.onended(() => flagMarshmallowSoundFinished(marshmallow_instance))
        } else {
          flagMarshmallowSoundFinished(marshmallow_instance)
        }
      })
    },
    
    igniteMarshmallow: function() {
      // Play ignite sound effect
      SFX_marshmallow_ignite.setVolume(sfxVolume.igniteMarshmallow)
      SFX_marshmallow_ignite.play()
      // Fade in over 0.5 seconds, from 0 to the volume set in sfxVolume object
      
      fadeAsLoop(SFX_marshmallow_burn_loop, 0, sfxVolume.marshmallow_burnLoop, 0.5)
    },
    
    extinguishFire: function() {
      SFX_marshmallow_extinguish.setVolume(sfxVolume.marshmallow_extinguish)
      SFX_marshmallow_extinguish.play()

      // Fade out from 1 to 0 over 0.5 seconds, before stopping the playback.
      fadeAsLoop(SFX_marshmallow_burn_loop, sfxVolume.marshmallow_burnLoop, 0, 0.5, true)
    }
}

function flagMarshmallowSoundFinished(marshmallow_instance) {
    if (marshmallow_instance instanceof Marshmallow) {
      marshmallow_instance.isFinished = true
    } else {
      console.warn("Invalid marshmallow instance")
    }
}

// Function to fade in or out sounds, defaulting to fading in over 0.5 seconds
function fadeAsLoop(soundEffect, startVolume = 0, endVolume = 1, fadeTime = 0.5, stopLoop = false) {
    if (soundEffect instanceof p5.SoundFile) {
        
        // If the function is not stopping the loop, initialise it.
        if (!stopLoop) {
            // Set loop to start at a certain volume to fade in
            soundEffect.setVolume(startVolume)
            // Start as a loop
            soundEffect.loop()
        }
        // Fade to endVolume over fadeTime (in seconds)
        soundEffect.setVolume(endVolume, fadeTime)

        // If the function is not stopping the loop, don't stop it.
        if (stopLoop) {
            // Wait to fade out completely before stopping the loop.
            setTimeout(() => {
                // Stop the loop after fading
                soundEffect.stop()
            }, fadeTime * 1000)
        }
    } else {
        console.warn("Not a valid sound file")
    }
}
//#endregion