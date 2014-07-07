var game = this.game || (this.game={});
var createjs = createjs || {};
var images = images||{};

;(function(game, cjs, b2d){

  game.start = function() {
    cjs.EventDispatcher.initialize(game); // allow the game object to listen and dispatch custom events.

    game.canvas = document.getElementById('canvas');

    game.stage = new cjs.Stage(game.canvas);

    cjs.Ticker.setFPS(60);
    cjs.Ticker.addEventListener('tick', game.stage); // add game.stage to ticker make the stage.update call automatically.
    cjs.Ticker.addEventListener('tick', game.tick); // gameloop

    game.physics.createWorld();
    game.physics.showDebugDraw();

    game.physics.createLevel();

    isPlaying = true;

    game.tickWhenDown = 0;
    game.tickWhenUp = 0;
    game.stage.on('stagemousedown', function(e){
      if (!isPlaying) { return; }
      game.tickWhenDown = cjs.Ticker.getTicks();
    });

    game.stage.on('stagemouseup', function(e){
      if (!isPlaying) { return; }
      game.tickWhenUp = cjs.Ticker.getTicks();
      ticksDiff = game.tickWhenUp - game.tickWhenDown;

      game.physics.shootBall(e.stageX, e.stageY, ticksDiff);

      setTimeout(game.spawnBall, 500);
    });
  };

  game.spawnBall = function() {
    game.physics.spawnBall();
  };

  game.tick = function(){
    if (cjs.Ticker.getPaused()) { return; } // run when not paused

    game.physics.update();

  };

  game.start();


}).call(this, game, createjs, Box2D);


