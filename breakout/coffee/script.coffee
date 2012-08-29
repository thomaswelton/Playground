window.addEvent 'domready', () ->
	window.game = new Breakout $('frames'), $('paddle'), $('blocks')
	true