// Generated by CoffeeScript 1.3.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.FancyBox = (function() {

    function FancyBox(input) {
      this.input = input;
      this.onDivClick = __bind(this.onDivClick, this);

      this.updateCheckbox = __bind(this.updateCheckbox, this);

      input.FancyBox = this;
      this.div = new Element('div', {
        "class": input.getAttribute('class')
      });
      this.div.inject(input, 'after');
      this.updateCheckbox();
      this.div.addEvent('click', this.onDivClick);
      this.input.addEvent('change', this.updateCheckbox);
    }

    FancyBox.prototype.updateCheckbox = function() {
      var boxContent;
      boxContent = this.input.checked ? '&#10003;' : '';
      this.div.set('html', boxContent);
      if (this.input.checked) {
        return this.div.addClass('checked');
      } else {
        return this.div.removeClass('checked');
      }
    };

    FancyBox.prototype.onDivClick = function(event) {
      event.preventDefault();
      this.input.checked = !this.input.checked;
      return this.input.fireEvent('change');
    };

    return FancyBox;

  })();

}).call(this);