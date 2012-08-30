// Generated by CoffeeScript 1.3.3

/*
Level ideas
Blackout mode - blocks are invisible, when the user user lots of balls in play
*/


(function() {
  var Ball, Block, Paddle, canvasElement,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  canvasElement = (function() {

    function canvasElement(canvas, x, y, width, height, color) {
      this.canvas = canvas;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.width = width != null ? width : 200;
      this.height = height != null ? height : 25;
      this.color = color != null ? color : 'white';
      this.intersects = __bind(this.intersects, this);

      this.collides = __bind(this.collides, this);

      this.ctx = canvas.getContext('2d');
    }

    canvasElement.prototype.collides = function(x, y, width, height) {
      return this.intersects(x, y, width, height, this.x, this.y, this.width, this.height);
    };

    canvasElement.prototype.intersects = function(x1, y1, w1, h1, x2, y2, w2, h2) {
      w2 += x2;
      w1 += x1;
      h2 += y2;
      h1 += y1;
      return !((x2 > w1 || x1 > w2) || (y2 > h1 || y1 > h2));
    };

    return canvasElement;

  })();

  Paddle = (function(_super) {

    __extends(Paddle, _super);

    function Paddle(canvas, x, y, width, height) {
      this.onMouseMove = __bind(this.onMouseMove, this);

      this.removeInteraction = __bind(this.removeInteraction, this);

      this.addInteraction = __bind(this.addInteraction, this);

      this.erase = __bind(this.erase, this);

      this.draw = __bind(this.draw, this);
      Paddle.__super__.constructor.call(this, canvas, x, y, width, height);
      this.addInteraction();
    }

    Paddle.prototype.draw = function() {
      this.ctx.fillStyle = this.color;
      return this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.erase = function() {
      return this.ctx.clearRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.addInteraction = function() {
      return document.body.addEvent('mousemove', this.onMouseMove);
    };

    Paddle.prototype.removeInteraction = function() {
      return document.body.removeEvent('mousemove', this.onMouseMove);
    };

    Paddle.prototype.onMouseMove = function(event) {
      var canvasX, clickedX, x;
      this.erase();
      clickedX = event.client.x;
      canvasX = this.canvas.getPosition().x - window.scrollX;
      x = clickedX - canvasX;
      this.x = (x - this.width / 2).limit(0, this.canvas.width - this.width);
      return this.draw();
    };

    return Paddle;

  })(canvasElement);

  Block = (function(_super) {

    __extends(Block, _super);

    function Block(canvas, x, y, width, height) {
      this.destroy = __bind(this.destroy, this);

      this.draw = __bind(this.draw, this);

      var colors;
      Block.__super__.constructor.call(this, canvas, x, y, width, height);
      colors = ['#FF0000', '#FF6700', '#D50065', '#00CC00', '#FFF400', '#1921B1'];
      this.color = colors.getRandom();
    }

    Block.prototype.draw = function() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#FFFFFF';
      return this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    Block.prototype.destroy = function() {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height + 1);
      return this.ctx.globalCompositeOperation = 'source-over';
    };

    return Block;

  })(canvasElement);

  Ball = (function(_super) {

    __extends(Ball, _super);

    function Ball(canvas, x, y, radius) {
      this.radius = radius != null ? radius : 20;
      this.draw = __bind(this.draw, this);

      Ball.__super__.constructor.call(this, canvas, x, y, radius * 2, radius * 2);
      this.dx = 0;
      this.dy = 500;
      this.loadingTime = 1500;
      this.flashFrameRate = 3.5;
      this.creationTime = new Date().getTime();
      this.lifetime = 0;
    }

    Ball.prototype.draw = function() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fillStyle = this.color;
      return this.ctx.fill();
    };

    Ball.prototype.step = function(miliseconds) {
      this.lifetime += miliseconds;
      if (this.lifetime >= this.loadingTime) {
        this.x += this.dx * (miliseconds / 1000);
        this.y += this.dy * (miliseconds / 1000);
        return this.draw();
      } else {
        if (Math.floor(this.lifetime / (1000 / (this.flashFrameRate * 2))) % 2 === 1) {
          return this.draw();
        }
      }
    };

    return Ball;

  })(canvasElement);

  this.Breakout = (function() {

    function Breakout(framesCanvas, interactionCanvas, blocksCanvas) {
      var canvas, _i, _len, _ref,
        _this = this;
      this.framesCanvas = framesCanvas;
      this.interactionCanvas = interactionCanvas;
      this.blocksCanvas = blocksCanvas;
      this.detectCollisions = __bind(this.detectCollisions, this);

      this.redraw = __bind(this.redraw, this);

      this.stopRedraw = __bind(this.stopRedraw, this);

      this.pause = __bind(this.pause, this);

      this.resume = __bind(this.resume, this);

      this.createBlocks = __bind(this.createBlocks, this);

      this.gameOver = __bind(this.gameOver, this);

      this.clearScore = __bind(this.clearScore, this);

      this.addScore = __bind(this.addScore, this);

      this.levelUp = __bind(this.levelUp, this);

      this.startGame = __bind(this.startGame, this);

      this.width = framesCanvas.getWidth();
      this.height = framesCanvas.getHeight();
      _ref = [framesCanvas, interactionCanvas, blocksCanvas];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        canvas = _ref[_i];
        canvas.width = canvas.getWidth();
        canvas.height = canvas.getHeight();
      }
      this.startBlockCount = 20;
      this.startBallCount = 1;
      this.blocks = this.createBlocks(this.startBlockCount);
      this.animationRequest = 0;
      this.ui = {
        play: $('play'),
        score: $('score')
      };
      this.ui.play.addEvent('click', function(event) {
        event.target.hidden = true;
        return _this.startGame();
      });
      Visibility.change(function(e, state) {
        if (state === 'hidden') {
          return _this.pause();
        } else {
          return _this.resume();
        }
      });
    }

    Breakout.prototype.startGame = function() {
      var i;
      this.level = 1;
      this.clearScore();
      this.clearCanvas(this.interactionCanvas);
      this.balls = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.startBallCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(new Ball(this.framesCanvas, 400, 300, 10));
        }
        return _results;
      }).call(this);
      this.paddle = new Paddle(this.interactionCanvas, this.width / 2 - 100, this.height - 10, 200, 10);
      this.paddle.draw();
      this.frames = this.balls;
      return this.redraw();
    };

    Breakout.prototype.levelUp = function() {
      var blockcount;
      blockcount = this.startBlockCount + (this.level * 5);
      this.level++;
      this.blocks = this.createBlocks(blockcount);
      return this.balls.push(new Ball(this.framesCanvas, 400, 300, 10));
    };

    Breakout.prototype.addScore = function(points) {
      this.score += points;
      return this.ui.score.set('text', this.score);
    };

    Breakout.prototype.clearScore = function(points) {
      this.score = 0;
      return this.ui.score.set('text', this.score);
    };

    Breakout.prototype.gameOver = function() {
      this.paddle.removeInteraction();
      this.clearCanvas(this.interactionCanvas);
      this.stopRedraw();
      this.blocks = this.createBlocks(this.startBlockCount);
      this.ui.play.hidden = false;
      return this.clearScore();
    };

    Breakout.prototype.createBlocks = function(count) {
      var block, blockHeight, blockWidth, blocks, column, i, row;
      this.clearCanvas(this.blocksCanvas);
      return blocks = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
          column = i % 5;
          row = Math.floor(i / 5);
          blockWidth = 160;
          blockHeight = 25;
          block = new Block(this.blocksCanvas, column * blockWidth, row * blockHeight, blockWidth, blockHeight);
          block.draw();
          _results.push(block);
        }
        return _results;
      }).call(this);
    };

    Breakout.prototype.clearCanvas = function() {
      var canvas, canvi, _i, _len;
      canvi = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = canvi.length; _i < _len; _i++) {
        canvas = canvi[_i];
        canvas.width = canvas.getWidth();
      }
    };

    Breakout.prototype.resume = function() {
      return this.redraw();
    };

    Breakout.prototype.pause = function() {
      return this.stopRedraw();
    };

    Breakout.prototype.stopRedraw = function() {
      cancelAnimationFrame(this.animationRequest);
      return this.lastRender = null;
    };

    Breakout.prototype.redraw = function() {
      var delta, element, _i, _len, _ref;
      delta = this.lastRender != null ? new Date().getTime() - this.lastRender : 1;
      this.clearCanvas(this.framesCanvas);
      _ref = this.frames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.step(delta);
      }
      this.detectCollisions();
      this.frames = this.balls;
      this.lastRender = new Date().getTime();
      return this.animationRequest = requestAnimationFrame(this.redraw);
    };

    Breakout.prototype.detectCollisions = function() {
      var ball, block, percent, _i, _j, _len, _len1, _ref, _ref1;
      _ref = this.balls.slice(0);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ball = _ref[_i];
        if (ball.y - ball.radius * 2 > this.height) {
          this.balls.erase(ball);
          if (this.balls.length === 0) {
            return this.gameOver();
          }
        }
        if (ball.x - (ball.width / 2) <= 0) {
          ball.dx = Math.abs(ball.dx);
        }
        if (ball.x + (ball.width / 2) >= this.width) {
          ball.dx = Math.abs(ball.dx) * -1;
        }
        if (ball.y - (ball.width / 2) <= 0) {
          ball.dy = Math.abs(ball.dy);
        }
        if (this.paddle.collides(ball.x - (ball.width / 2), ball.y - (ball.height / 2), ball.width, ball.height)) {
          ball.dy = Math.abs(ball.dy) * -1;
          percent = (((this.paddle.x - ball.x) + this.paddle.width / 2) / 100).limit(-1, 1);
          ball.dx = ball.dy * percent;
        }
        _ref1 = this.blocks.slice(0);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          block = _ref1[_j];
          if (block.collides(ball.x - (ball.width / 2), ball.y - (ball.height / 2), ball.width, ball.height)) {
            ball.dy = ball.dy * -1;
            block.destroy();
            this.blocks.erase(block);
            this.addScore(100);
            if (this.blocks.length === 0) {
              this.levelUp();
            }
          }
        }
      }
    };

    return Breakout;

  })();

}).call(this);
