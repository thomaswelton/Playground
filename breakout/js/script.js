// Generated by CoffeeScript 1.3.3
(function() {

  window.addEvent('domready', function() {
    window.game = new Breakout($('frames'), $('paddle'), $('blocks'));
    return true;
  });

}).call(this);
