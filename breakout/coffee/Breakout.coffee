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
		@addInteraction()
		
	draw: () =>
		@ctx.fillStyle = @color
		@ctx.fillRect @x, @y, @width, @height

	erase: () =>
		@ctx.clearRect @x, @y, @width, @height

	addInteraction: () =>
		document.body.addEvent 'mousemove', @onMouseMove

	removeInteraction: () =>
		document.body.removeEvent 'mousemove', @onMouseMove

	onMouseMove: (event) =>
		@erase()
		clickedX = event.client.x;
		canvasX = @canvas.getPosition().x - window.scrollX;
		x = clickedX - canvasX;
		@x = (x - @width / 2).limit(0, @canvas.width - @width)
		@draw()

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
		@dy = 500

		##The ball either flashes and stays still or bouncesAround
		@loadingTime = 1500
		##When loading flashFrameRate defines the flashes per second 
		@flashFrameRate = 3.5 
		@creationTime = new Date().getTime()
		@lifetime = 0

	draw: () =>
		@ctx.beginPath()
		@ctx.arc(@x, @y, @radius, 0, Math.PI*2)
		@ctx.closePath()
		@ctx.fillStyle = @color
		@ctx.fill()

	step: (miliseconds) ->
		@lifetime += miliseconds
		if(@lifetime >= @loadingTime)
			@x += @dx * (miliseconds / 1000)
			@y += @dy * (miliseconds / 1000)
			@draw()
		else
			@draw() if Math.floor(@lifetime / (1000 / (@flashFrameRate * 2))) % 2 is 1

class @Breakout
	constructor: (@framesCanvas,@interactionCanvas,@blocksCanvas) ->
		@width = framesCanvas.getWidth()
		@height = framesCanvas.getHeight()

		for canvas in [framesCanvas,interactionCanvas,blocksCanvas]
			canvas.width = canvas.getWidth()
			canvas.height = canvas.getHeight()

		@startBlockCount = 20
		@startBallCount = 1
		@blocks = @createBlocks(@startBlockCount)

		@animationRequest  = 0

		@ui = play : $('play'), score : $('score')

		@ui.play.addEvent 'click', (event) =>	
			event.target.hidden = true
			@startGame()

		Visibility.change (e, state) =>
			if state is 'hidden' then @pause() else @resume()

	startGame: () =>
		@blocks = @createBlocks(@startBlockCount) if @blocks.length < @startBlockCount
		@level = 1
		@clearScore()
		@clearCanvas(@interactionCanvas)

		@balls = @createBalls @level
		@paddle = new Paddle(@interactionCanvas, @width / 2 - 100, @height - 10, 200, 10)

		@paddle.draw()

		@frames = @balls
		@redraw()

	levelUp: () =>
		blockcount = @startBlockCount + (@level * 5)
		@level++
		@blocks = @createBlocks(blockcount)
		@balls = @balls.concat @createBalls()

	addScore: (points) =>
		@score += points
		@ui.score.set 'text', @score

	clearScore: (points) =>
		@score = 0
		@ui.score.set 'text', @score

	gameOver: () =>
		@paddle.removeInteraction()
		@clearCanvas(@interactionCanvas)
		@stopRedraw()
		@ui.play.hidden = false

	createBalls: (count = 1) =>
		console.log @startBlockCount
		blockCount = @startBlockCount + (@level * 5) - 5
		blockCount = Math.min(blockCount,85)
		console.log blockCount

		y = if blockCount > 50 then 300 + (25 * ((blockCount - 50)/5)) else 300
		new Ball(@framesCanvas, 400, y, 10) for i in [0...count]

	createBlocks: (count) =>
		count = Math.min(count,85)
		@clearCanvas(@blocksCanvas)
		blocks = for i in [0...count]
			column = i % 5
			row = Math.floor(i / 5)
			blockWidth = 160
			blockHeight = 25
			block = new Block(@blocksCanvas, column * blockWidth, row * blockHeight, blockWidth, blockHeight)
			block.draw()
			block

	clearCanvas: (canvi...) ->
		canvas.width = canvas.getWidth() for canvas in canvi
		return

	resume: ()=>
		@redraw()
	pause: () =>
		@stopRedraw()

	stopRedraw: () =>
		cancelAnimationFrame @animationRequest
		@lastRender = null

	redraw: () =>
		delta = if @lastRender? then new Date().getTime() - @lastRender else 1
		@clearCanvas @framesCanvas
		element.step(delta) for element in @frames

		@detectCollisions()
		@frames = @balls

		@lastRender = new Date().getTime()
		@animationRequest = requestAnimationFrame @redraw

	detectCollisions: () =>
		for ball in @balls[..]
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
			if @paddle.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
				ball.dy = Math.abs(ball.dy) * -1
				percent = (((@paddle.x - ball.x) + @paddle.width/2)/100).limit(-1,1)
				ball.dx = ball.dy * percent;

			##Ball hits a block
			for block in @blocks[..]
				if block.collides(ball.x - (ball.width/2), ball.y - (ball.height/2), ball.width, ball.height)
					ball.dy = ball.dy * -1 
					block.destroy()
					@blocks.erase block
					@addScore(100)
					@levelUp() if @blocks.length is 0
