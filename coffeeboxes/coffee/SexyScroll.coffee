## Sexy Scroll
class @SexyScroll
	constructor: (@container) ->
		container.SexyScroll = this
		## Wrap content
		@scrollContent = @wrapScrollContent()
		## Add scrollbar
		@scrollBar = @addScrollBar()
		## Overwrite the scrollTo function for this element
		@scrollContent.scrollTo = @scrollTo
		## Set some commonly user variables
		@maxScroll = Math.max 0, @scrollContent.getHeight() - @container.getHeight()
		@maxHandleTop = @scrollBar.getHeight() - @handle.getHeight()

		container.addEvent('mousewheel:relay(".scroll-content")', @trackScroll)
		container.addEvent('mousedown:relay(".handle")',@trackHandle)
		container.addEvent('click:relay(".scroll")',@trackClick)

	wrapScrollContent: () ->
		@container.setStyles
			position: "relative",
			overflow: "hidden"

		## Take the container contents and wrap it's inner html in the scroll content
		@container.innerHTML = '<div class="scroll-content">'+@container.innerHTML+'<\/div>'
		## Hide the overflow of the scrollContent
		@container.getChildren('.scroll-content')[0].setStyles
			height: "auto",
			overflow: "hidden"

	addScrollBar: () ->
		## Create and inject the scrollbar
		scrollBar = new Element('div',
			class : 'scroll', 
			styles :
				position : "absolute",
				height : "100%",
				top : "0px", 
				right: "0px",
				cursor: "pointer"
		).grab(@createHandle()).inject @container

		## Update scrollContent margin to fit scroll bar
		@scrollContent.setStyles
			"margin-right" : scrollBar.getWidth() + scrollBar.getStyle('margin-left').toInt() + scrollBar.getStyle('margin-right').toInt()
		
		## Return the scroll bar
		scrollBar	

	createHandle: () ->
		@handle = new Element('div', 
			class : 'handle', 
			styles :
				position : "absolute",
				top : "0px", 
				left: "0px",
				width: "100%"
		)
		
	trackScroll: (event) =>
		deltaY = event.wheel * 20;
		currentMargin = -1 * @scrollContent.getStyle('margin-top').toInt() 

		newScroll = (currentMargin - deltaY).limit(0,@maxScroll);
		
		if newScroll < @maxScroll and newScroll > 0
			event.stop() 
			@scrollPercent newScroll / @maxScroll

	trackHandle: (event) =>
		## A mouse down events has been fired
		event.stop();
		@clientY = event.client.y;

		window.addEvent 'mousemove', @handleMouseMove
		window.addEvent 'mouseup', () =>
			window.removeEvent 'mousemove', @handleMouseMove

	trackClick: (event) =>
		if event.target.hasClass 'scroll'
			clickedY = event.client.y;
			barY = @scrollBar.getPosition().y - window.scrollY;
			newTop = clickedY - barY;
			@scrollPercent newTop / @maxHandleTop

	handleMouseMove: (event) =>
		deltaY = @clientY - event.client.y
		@clientY = event.client.y

		handleTop = @handle.getStyle('top').toInt()
		newTop = handleTop - deltaY

		@scrollPercent newTop / @maxHandleTop
	
	scrollPercent: (percent) =>
		decimal = percent.limit(0,1);
		## Set scroll handle position
		@handle.setStyle('top', @maxHandleTop * decimal)
		## Set Scroll
		@scrollContent.setStyle('margin-top', -1 * (@maxScroll * decimal))

	scrollTo: (x,y) =>
		@scrollPercent y / @maxScroll
###
