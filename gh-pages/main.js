require('aframe');
require('../index.js');


AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var COLORS = ['#4F005E', '#4C23D9', '#FF761D', '#1BC814'];
    var index = 0;
    this.el.addEventListener('click', function (evt) {
      // var randomIndex = Math.floor(Math.random() * COLORS.length);
      this.setAttribute('material', 'color', COLORS[index++ % COLORS.length]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});
