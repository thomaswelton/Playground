window.addEvent 'domready', () ->
	new FancyBox(input) for input in $$('.fancyCheckbox')
	new SexyScroll $('longContent')
	true