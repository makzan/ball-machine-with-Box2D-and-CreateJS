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

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;

    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 100/pxPerMeter;
    bodyDef.position.y = 100/pxPerMeter;

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(20/pxPerMeter, 20/pxPerMeter);

    this.world.CreateBody(bodyDef).CreateFixture(fixDef);

    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 200/pxPerMeter;
    bodyDef.position.y = 100/pxPerMeter;

    this.world.CreateBody(bodyDef).CreateFixture(fixDef);
  }

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