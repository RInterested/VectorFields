
const scl = 45;
var cols, rows;
var particles = [];
var flowfield;

function setup() {

	createCanvas(750, 750);
	cols = ceil( width / scl );
	rows = ceil( height / scl );


	flowfield = new Array( cols * rows );

	for (var i = 0; i < 1000; i ++ ) {
		particles[i] = new Particle();
	}
}

function draw() {
    
	translate(height / 2, height / 2); //moves the origin to center
	scale( 1, - 1 ); //flips the y values so y increases "up"
    fill(0,10);
    rect(-width,-height,2*width,2*height);
  
  
	for ( var y = 0; y < rows; y ++ ) { 
		for ( var x = 0; x < cols; x ++ ) { 
      
      var index = x + y * cols;

      let vX = x * 2 - cols;
      let vY = y * 2 - rows;
                
     
      var v = createVector( vY, -vX );
      v.normalize();
          
      flowfield[index] = v;
      
      // The following push() / pull() affects only the arrows     
      push();
      translate(x*scl-width/2,y*scl-height/2);

      fill(255);
	  stroke(255);
      rotate(v.heading());
      line(0,0,0.5*scl,0);
      let arrowSize = 7;
      translate(0.5*scl - arrowSize, 0);
      triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
      pop();
// The preceding push() / pull() affects only the arrows     
    }// 
  }
  
//This next loop actually creates the desired particles:
    for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
  }
}

class Particle {

	constructor() {
		this.pos = createVector( random( - width / 2, width / 2 ),
			       random( - height / 2, height / 2 ) );
		this.vel = createVector( 0, 0 );
		this.acc = createVector( 0, 0 );
		this.maxspeed = 3;
        this.steerStrength = 0.1;
		this.prevPos = this.pos.copy();
		this.size = 4;
	}

	update() {
		this.vel.add( this.acc );
		this.vel.limit( this.maxspeed );
		this.pos.add( this.vel );
		this.acc.mult( 0 );
        noStroke();
        fill(255);
        circle( this.pos.x, this.pos.y, this.size );
	}

	follow( vectors ) {
		var x = floor( map( this.pos.x, - width / 2, width / 2, 0, cols - 1, true ) );
		var y = floor( map( this.pos.y, - height / 2, height / 2, 0, rows - 1, true ) );
		var index = (y * cols) + x;
		var force = vectors[index].copy();
        force.mult(this.steerStrength);
		this.applyForce(force);
	}

	applyForce( force ) {
	    this.acc.add(force);
	}

	updatePrev() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	edges() {
		//clamp between -width/2 and width/2. -height/2 and height/2
		if ( this.pos.x > width / 2 ) {

			this.pos.x = - width / 2;
			this.updatePrev();

		}
		if ( this.pos.x < - width / 2 ) {

			this.pos.x = width / 2;
			this.updatePrev();

		}
		if ( this.pos.y > height / 2 ) {

			this.pos.y = - height / 2;
			this.updatePrev();

		}
		if ( this.pos.y < - height / 2 ) {

			this.pos.y = height / 2;
			this.updatePrev();

		}
    }
}