var game = this.game || (this.game={});
var createjs = createjs || {};
var Box2D = Box2D || {};

;(function(game, cjs, b2d){

  // alias
  var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2World = Box2D.Dynamics.b2World
    , b2MassData = Box2D.Collision.Shapes.b2MassData
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
    ;

  var pxPerMeter = 30; // 30 pixels = 1 meter. Box3D uses meters and we use pixels.
  var shouldDrawDebug = false;

  var physics = game.physics = {};



  physics.createWorld = function() {
    var gravity = new b2Vec2(0, 9.8);
    this.world = new b2World(gravity, /*allow sleep= */ true);
  };

  physics.createLevel = function() {

    this.createHoop();

    // the first ball
    this.spawnBall();
  };

  physics.createHoop = function() {
    var hoopX = 50;
    var hoopY = 100;

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;

    // default fixture
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    // hoop
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = hoopX/pxPerMeter;
    bodyDef.position.y = hoopY/pxPerMeter;
    bodyDef.angle = 0;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(5/pxPerMeter, 5/pxPerMeter);

    var body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);

    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = (hoopX+45)/pxPerMeter;
    bodyDef.position.y = hoopY/pxPerMeter;
    bodyDef.angle = 0;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(5/pxPerMeter, 5/pxPerMeter);

    body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);


    // hoop board
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = (hoopX-5)/pxPerMeter;
    bodyDef.position.y = (hoopY-40)/pxPerMeter;
    bodyDef.angle = 0;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(5/pxPerMeter, 40/pxPerMeter);
    fixDef.restitution = 0.05;

    var board = this.world.CreateBody(bodyDef);
    board.CreateFixture(fixDef);

  };

  physics.spawnBall = function() {
    var positionX = 300;
    var positionY = 200;
    var radius = 13;

    var bodyDef = new b2BodyDef;

    var fixDef = new b2FixtureDef;
    fixDef.density = 0.6;
    fixDef.friction = 0.8;
    fixDef.restitution = 0.1;

    bodyDef.type = b2Body.b2_staticBody;

    bodyDef.position.x = positionX/pxPerMeter;
    bodyDef.position.y = positionY/pxPerMeter;

    fixDef.shape = new b2CircleShape(radius/pxPerMeter);

    this.ball = this.world.CreateBody(bodyDef);
    this.ball.CreateFixture(fixDef);

  };

  physics.ballPosition = function(){
    var pos = this.ball.GetPosition();
    return {
      x: pos.x * pxPerMeter,
      y: pos.y * pxPerMeter
    };
  };

  physics.launchAngle = function(stageX, stageY) {
    var ballPos = this.ballPosition();

    var diffX = stageX - ballPos.x;
    var diffY = stageY - ballPos.y;

    // Quadrant
    var degreeAddition = 0; // Quadrant I
    if (diffX < 0 && diffY > 0) {
      degreeAddition = Math.PI; // Quadrant II
    } else if (diffX < 0 && diffY < 0) {
      degreeAddition = Math.PI; // Quadrant III
    } else if (diffX > 0 && diffY < 0) {
      degreeAddition = Math.PI * 2; // Quadrant IV
    }

    var theta = Math.atan(diffY / diffX) + degreeAddition;
    return theta;
  };

  physics.shootBall = function(stageX, stageY, ticksDiff) {
    this.ball.SetType(b2Body.b2_dynamicBody);

    var theta = this.launchAngle(stageX, stageY);

    var r = Math.log(ticksDiff) * 50; // power

    var resultX = r * Math.cos(theta);
    var resultY = r * Math.sin(theta);

    this.ball.ApplyTorque(30); // rotate it

    // shoot the ball
    this.ball.ApplyImpulse(new b2Vec2(resultX/pxPerMeter, resultY/pxPerMeter), this.ball.GetWorldCenter());

    this.ball = undefined;
  };

  physics.update = function() {
    this.world.Step(1 / 60, 10, 10);
    if (shouldDrawDebug) {
      this.world.DrawDebugData();
    }
    this.world.ClearForces();

  };

  physics.showDebugDraw = function() {
    shouldDrawDebug = true;

    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("debug-canvas").getContext("2d"));
    debugDraw.SetDrawScale(pxPerMeter);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(debugDraw);
  };


}).call(this, game, createjs, Box2D);