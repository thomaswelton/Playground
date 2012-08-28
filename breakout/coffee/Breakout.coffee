###
Level ideas
Blackout mode - blocks are invisible, when the user user lots of balls in play
###

class canvasElement
	constructor: (@canvas, @x = 0, @y = 0, @width = 200, @height = 25, @color = 'white') ->
		@ctx = canvas.getContext '2d'

	collides: (x, y, width, height) =>
		@intersects(x,y,width,height,@x,@y,@width,@height)

	intersects: (x1, y1, w1, h1, x2, y2, w2, h2) =>
		w2 += x2
		w1 += x1
		h2 += y2
		h1 += y1
		
		!((x2 > w1 || x1 > w2) || (y2 > h1 || y1 > h2))

class Paddle extends canvasElement
	constructor: (canvas, x, y, width, height) ->
		super canvas, x, y, width, height

		console.log(canvas)
		canvas.getParent().addEvent 'mousemove', (event) =>
			@erase()
			clickedX = event.client.x;
			canvasX = @canvas.getPosition().x - window.scrollX;
			x = clickedX - canvasX;
			@x = (x - @width / 2).limit(0, @canvas.width - @width)
			@draw()

	draw: () =>
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height

	erase: () =>
		@ctx.clearRect @x, @y, @width, @height

class Block extends canvasElement
	constructor: (canvas, x, y, width, height) ->
		super canvas, x, y, width, height

		colors = ['#FF0000', '#FF6700', '#D50065', '#00CC00', '#FFF400', '#1921B1']
		@color = colors.getRandom()

	draw: () =>
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height
		@ctx.lineWidth   = 2
		@ctx.strokeStyle = '#FFFFFF'
		@ctx.strokeRect @x, @y, @width, @height

	destroy: () =>
		@ctx.globalCompositeOperation = 'destination-out'
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height + 1
		@ctx.globalCompositeOperation = 'source-over'

class Ball extends canvasElement
	constructor: (canvas, x, y, @radius = 20) ->
		super canvas, x, y, radius * 2, radius * 2

		@dx = 0
		@dy = 5

	draw: () =>
		@ctx.beginPath()
		@ctx.arc(@x, @y, @radius, 0, Math.PI*2)
		@ctx.closePath()
		@ctx.fillStyle = @color
		@ctx.fill()

	step: (seconds) ->
		@x += @dx
		@y += @dy
		@draw()

class @Breakout
	constructor: (@framesCanvas,@interactionCanvas,@blocksCanvas) ->
		@width = framesCanvas.getWidth()
		@height = framesCanvas.getHeight()

		@fps = 24

		for canvas in [framesCanvas,interactionCanvas,blocksCanvas]
			canvas.width = canvas.getWidth()
			canvas.height = canvas.getHeight()

		@startBlockCount = 20
		@startGame()

	startGame: () =>
		clearInterval @redrawInterval

		@level = 1
		@clearCanvas(@interactionCanvas)

		@balls = [new Ball(@framesCanvas, 400, 300, 10)]
		@paddles = [new Paddle(@interactionCanvas, @width / 2 - 100, @height - 10, 200, 10)]
		@blocks = @createBlocks(@startBlockCount)

		@frames = @balls
		element.draw() for element in @frames.concat @blocks, @paddles

		@redrawInterval = setInterval @redraw, 1 / @fps

	levelUp: () =>
		blockcount = @startBlockCount + (@level * 5)
		@level++
		@blocks = @createBlocks(blockcount)
		block.draw() for block in @blocks
		@balls.push new Ball(@framesCanvas, 400, 300 , 10)

	gameOver: () =>
		@startGame()

	createBlocks: (count) =>
		blocks = for i in [0...count]
			column = i % 5
			row = Math.floor(i / 5)
			blockWidth = 160
			blockHeight = 25
			new Block(@blocksCanvas, column * blockWidth, row * blockHeight, blockWidth, blockHeight)

	clearCanvas: (canvas) ->
		canvas.width = canvas.getWidth()

	redraw: () =>
		element.step() for element in @frames
		@clearCanvas(@framesCanvas)

		@detectCollisions()
		@frames = @balls

	pause: () =>
		clearInterval @redrawInterval

	resume: () =>
		@redrawInterval = setInterval @redraw, 1 / @fps

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
			ball.dy = Math.abs(ball.dy) if ball.y - (ball.width/2) <= 0

			##Has hit the paddle
			for paddle in @paddles
				if paddle.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
					ball.dy = Math.abs(ball.dy) * -1
					percent = (((paddle.x - ball.x) + paddle.width/2)/100).limit(-1,1)
					ball.dx = 5 * -1 * percent;


			for block in @blocks[..]
				if block.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
					ball.dy = ball.dy * -1 
					block.destroy()
					@blocks.erase block
					@levelUp() if @blocks.length is 0
