/**
 * @name Site
 * @description Define global variables and functions
 * @version 1.0
 */
var Site = (function($, window, undefined) {
  var privateVar = 1;

  function changeClassTheme() {
    
  }

  return {
    publicVar: 1,
    publicObj: {
      var1: 1,
      var2: 2
    },
    changeClassTheme: changeClassTheme
  };

})(jQuery, window);

jQuery(function() {
  Site.changeClassTheme();
});


