var game = this.game || (this.game={});
var createjs = createjs || {};
var images = images||{};

;(function(game, cjs){

  game.start = function() {
    cjs.EventDispatcher.initialize(game); // allow the game object to listen and dispatch custom events.

    game.canvas = document.getElementById('canvas');

    game.stage = new cjs.Stage(game.canvas);

    cjs.Ticker.setFPS(60);
    cjs.Ticker.addEventListener('tick', game.stage); // add game.stage to ticker make the stage.update call automatically.
    cjs.Ticker.addEventListener('tick', game.tick); // gameloop

    game.physics.createWorld();
    game.physics.showDebugDraw();
  };

  game.tick = function(){
    if (cjs.Ticker.getPaused()) { return; } // run when not paused

    game.physics.update();

  };

  game.start();


}).call(this, game, createjs);


