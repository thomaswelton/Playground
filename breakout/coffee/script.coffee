window.addEvent 'domready', () ->
	new Breakout $('frames'), $('paddle'), $('blocks')
	true