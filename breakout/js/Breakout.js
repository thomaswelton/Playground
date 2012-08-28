// Generated by CoffeeScript 1.3.3
(function() {
  var Ball, Block, Paddle, canvasElement,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  canvasElement = (function() {

    function canvasElement(game, x, y, width, height, color) {
      this.game = game;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.width = width != null ? width : 200;
      this.height = height != null ? height : 25;
      this.color = color != null ? color : 'white';
      this.intersects = __bind(this.intersects, this);

      this.collides = __bind(this.collides, this);

      this.ctx = game.ctx;
      this.x = x + 0.5;
      this.y = y + 0.5;
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

    function Paddle(game, x, y, width, height) {
      this.erase = __bind(this.erase, this);

      this.draw = __bind(this.draw, this);

      var _this = this;
      Paddle.__super__.constructor.call(this, game, x, y, width, height);
      this.newX = this.x;
      game.canvas.addEvent('mousemove', function(event) {
        var canvasX, clickedX;
        clickedX = event.client.x;
        canvasX = _this.game.canvas.getPosition().x - window.scrollX;
        x = clickedX - canvasX;
        return _this.newX = (x - _this.width / 2).limit(0, _this.game.width - _this.width);
      });
    }

    Paddle.prototype.draw = function() {
      this.ctx.fillStyle = this.color;
      return this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.erase = function() {
      this.ctx.fillStyle = 'black';
      return this.ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.step = function() {
      this.x = this.newX;
      return this.draw();
    };

    return Paddle;

  })(canvasElement);

  Block = (function(_super) {

    __extends(Block, _super);

    function Block(game, x, y, width, height) {
      this.step = __bind(this.step, this);

      this.draw = __bind(this.draw, this);

      var colors;
      Block.__super__.constructor.call(this, game, x, y, width, height);
      colors = ['#FF0000', '#FF6700', '#D50065', '#00CC00', '#FFF400', '#1921B1'];
      this.color = colors.getRandom();
    }

    Block.prototype.draw = function() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#FFFFFF';
      return this.ctx.strokeRect(this.x, this.y, this.width, this.height);
    };

    Block.prototype.step = function() {
      return this.draw();
    };

    return Block;

  })(canvasElement);

  Ball = (function(_super) {

    __extends(Ball, _super);

    function Ball(game, x, y, radius) {
      this.radius = radius != null ? radius : 20;
      this.draw = __bind(this.draw, this);

      Ball.__super__.constructor.call(this, game, x, y, radius * 2, radius * 2);
      this.dx = 0;
      this.dy = 5;
    }

    Ball.prototype.draw = function() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fillStyle = this.color;
      return this.ctx.fill();
    };

    Ball.prototype.step = function() {
      this.x += this.dx;
      this.y += this.dy;
      return this.draw();
    };

    return Ball;

  })(canvasElement);

  this.Breakout = (function() {

    function Breakout(canvas) {
      this.canvas = canvas;
      this.detectCollisions = __bind(this.detectCollisions, this);

      this.resume = __bind(this.resume, this);

      this.pause = __bind(this.pause, this);

      this.redraw = __bind(this.redraw, this);

      this.clearGameScreen = __bind(this.clearGameScreen, this);

      this.createBlocks = __bind(this.createBlocks, this);

      this.gameOver = __bind(this.gameOver, this);

      this.levelUp = __bind(this.levelUp, this);

      this.startGame = __bind(this.startGame, this);

      canvas.Breakout = this;
      this.width = canvas.getWidth();
      this.height = canvas.getHeight();
      canvas.width = this.width;
      canvas.height = this.height;
      this.ctx = canvas.getContext('2d');
      this.startBlockCount = 20;
      this.startGame();
    }

    Breakout.prototype.startGame = function() {
      var element, _i, _len, _ref;
      clearInterval(this.redrawInterval);
      this.level = 1;
      this.balls = [new Ball(this, 400, 300, 10)];
      this.paddles = [new Paddle(this, this.width / 2 - 100, this.height - 10, 200, 10)];
      this.blocks = this.createBlocks(this.startBlockCount);
      this.elements = this.blocks.concat(this.balls, this.paddles);
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.draw();
      }
      return this.redrawInterval = setInterval(this.redraw, 1 / 32);
    };

    Breakout.prototype.levelUp = function() {
      var blockcount;
      blockcount = this.startBlockCount + (this.level * 5);
      this.level++;
      this.blocks = this.createBlocks(blockcount);
      return this.balls.push(new Ball(this, 400, 300, 10));
    };

    Breakout.prototype.gameOver = function() {
      return this.startGame();
    };

    Breakout.prototype.createBlocks = function(count) {
      var blockHeight, blockWidth, blocks, column, i, row;
      return blocks = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
          column = i % 5;
          row = Math.floor(i / 5);
          blockWidth = 160;
          blockHeight = 25;
          _results.push(new Block(this, column * blockWidth, row * blockHeight, blockWidth, blockHeight));
        }
        return _results;
      }).call(this);
    };

    Breakout.prototype.clearGameScreen = function() {
      return this.ctx.clearRect(0, 0, this.width, this.height);
    };

    Breakout.prototype.redraw = function() {
      var element, _i, _len, _ref;
      this.clearGameScreen();
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.step();
      }
      this.detectCollisions();
      return this.elements = this.blocks.concat(this.balls, this.paddles);
    };

    Breakout.prototype.pause = function() {
      return clearInterval(this.redrawInterval);
    };

    Breakout.prototype.resume = function() {
      return this.redrawInterval = setInterval(this.redraw, 1 / 32);
    };

    Breakout.prototype.detectCollisions = function() {
      var ball, block, paddle, percent, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      _ref = this.balls;
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
          ball.dy = ball.dy * -1;
        }
        _ref1 = this.paddles;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          paddle = _ref1[_j];
          if (paddle.collides(ball.x - (ball.width / 2), ball.y - (ball.height / 2), ball.width, ball.height)) {
            ball.dy = Math.abs(ball.dy) * -1;
            percent = (((paddle.x - ball.x) + paddle.width / 2) / 100).limit(-1, 1);
            ball.dx = 5 * -1 * percent;
          }
        }
        _ref2 = this.blocks.slice(0);
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          block = _ref2[_k];
          if (block.collides(ball.x - (ball.width / 2), ball.y - (ball.height / 2), ball.width, ball.height)) {
            ball.dy = ball.dy * -1;
            this.blocks.erase(block);
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
