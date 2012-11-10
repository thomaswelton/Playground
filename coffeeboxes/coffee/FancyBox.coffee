## Fancy checkboxes 

class @FancyBox 
	constructor: (@input) ->
		input.FancyBox = this
		@div = new Element 'div', { class : input.getAttribute('class') }
		@div.inject input, 'after'
		@updateCheckbox()

		@div.addEvent 	'click'	, 	@onDivClick
		@input.addEvent 'change', 	@updateCheckbox

	updateCheckbox: () =>
		boxContent = if @input.checked then '&#10003;' else ''
		@div.set('html', boxContent)

		if @input.checked
			@div.addClass 'checked'
		else
			@div.removeClass 'checked'

	onDivClick: (event) =>
		event.preventDefault()
		@input.checked = (!@input.checked)
		@input.fireEvent('change')
