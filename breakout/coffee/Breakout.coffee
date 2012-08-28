class canvasElement
	constructor: (@game, x = 0, y = 0, @width = 200, @height = 25, @color = 'white') ->
		@ctx = game.ctx
		@x = x + 0.5
		@y = y + 0.5

	collides: (x, y, width, height) =>
		@intersects(x,y,width,height,@x,@y,@width,@height)

	intersects: (x1, y1, w1, h1, x2, y2, w2, h2) =>
		w2 += x2
		w1 += x1
		h2 += y2
		h1 += y1
		
		!((x2 > w1 || x1 > w2) || (y2 > h1 || y1 > h2))

class Paddle extends canvasElement
	constructor: (game, x, y, width, height) ->
		super game, x, y, width, height
		@newX = @x

		game.canvas.addEvent 'mousemove', (event) =>
			clickedX = event.client.x;
			canvasX = @game.canvas.getPosition().x - window.scrollX;
			x = clickedX - canvasX;
			@newX = (x - @width / 2).limit(0, @game.width - @width)

	draw: () =>
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height

	erase: () =>
		@ctx.fillStyle = 'black';
		@ctx.fillRect @x, @y, @width, @height

	step: () ->
		@x = @newX
		@draw()

class Block extends canvasElement
	constructor: (game, x, y, width, height) ->
		super game, x, y, width, height

		colors = ['#FF0000', '#FF6700', '#D50065', '#00CC00', '#FFF400', '#1921B1']
		@color = colors.getRandom()

	draw: () =>
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height
		@ctx.lineWidth   = 1
		@ctx.strokeStyle = '#FFFFFF'
		@ctx.strokeRect @x, @y, @width, @height

	step: () =>
		@draw()

class Ball extends canvasElement
	constructor: (game, x, y, @radius = 20) ->
		super game, x, y, radius * 2, radius * 2

		@dx = 0
		@dy = 5

	draw: () =>
		@ctx.beginPath()
		@ctx.arc(@x, @y, @radius, 0, Math.PI*2)
		@ctx.closePath()
		@ctx.fillStyle = @color
		@ctx.fill()

	step: () ->
		@x += @dx
		@y += @dy
		@draw()

class @Breakout
	constructor: (@canvas) ->
		canvas.Breakout = this

		@width = canvas.getWidth()
		@height = canvas.getHeight()

		canvas.width = @width
		canvas.height = @height

		@ctx = canvas.getContext '2d';

		@startBlockCount = 20
		@startGame()

	startGame: () =>
		clearInterval @redrawInterval

		@level = 1

		@balls = [new Ball(this, 400, 300, 10)]
		@paddles = [new Paddle(this, @width / 2 - 100, @height - 10, 200, 10)]
		@blocks = @createBlocks(@startBlockCount)

		@elements = @blocks.concat @balls, @paddles

		element.draw() for element in @elements

		@redrawInterval = setInterval @redraw, 1/32

	levelUp: () =>
		blockcount = @startBlockCount + (@level * 5)
		@level++
		@blocks = @createBlocks(blockcount)
		@balls.push new Ball(this, 400, 300 , 10)

	gameOver: () =>
		@startGame()

	createBlocks: (count) =>
		blocks = for i in [0...count]
			column = i % 5
			row = Math.floor(i / 5)
			blockWidth = 160
			blockHeight = 25
			new Block(this, column * blockWidth, row * blockHeight, blockWidth, blockHeight)

	clearGameScreen: () =>
		@ctx.clearRect(0, 0, @width, @height)

	redraw: () =>
		@clearGameScreen()

		element.step() for element in @elements

		@detectCollisions()
		@elements = @blocks.concat @balls, @paddles

	pause: () =>
		clearInterval @redrawInterval

	resume: () =>
		@redrawInterval = setInterval @redraw, 1/32

	detectCollisions: () =>
		for ball in @balls
			##Check if ball fell out of the bottom
			if ball.y - ball.radius * 2 > @height
				@balls.erase(ball)
				return @gameOver() if @balls.length is 0

			##Check if it has hit the left or right sides and flip the dx value
			ball.dx = Math.abs(ball.dx) if ball.x - (ball.width/2) <= 0
			ball.dx = Math.abs(ball.dx) * -1 if ball.x + (ball.width/2) >= @width

			##Check if it has hit the top
			ball.dy = ball.dy * -1  if ball.y - (ball.width/2) <= 0

			##Has hit the paddle
			for paddle in @paddles
				if paddle.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
					ball.dy = Math.abs(ball.dy) * -1
					percent = (((paddle.x - ball.x) + paddle.width/2)/100).limit(-1,1)
					ball.dx = 5 * -1 * percent;


			for block in @blocks[..]
				if block.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
					ball.dy = ball.dy * -1 
					@blocks.erase block
					@levelUp() if @blocks.length is 0
