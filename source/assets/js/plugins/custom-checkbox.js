/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'custom-input';
  var onloadClass = function(input){
    if(input.is(':checked')){
      input.parent().addClass('checked');
    }
  };

  var setClassForInput = function(input) {
    var listRD = input.closest('.radio-group').siblings(),
      type = input.attr('type'),
      inputS = listRD.find('input'),
      parent = input.parent();
    switch(type){
      case 'checkbox':
        if (input.is(':checked')) {
          input.prop('checked', false);
          parent.removeClass('checked');
        }else{
          input.prop('checked', true);
          parent.addClass('checked');
        }
      break;
      case 'radio':
        if(input.is(':checked')){
          return false;
        }else{
          inputS.prop('checked', false);
          listRD.children('span').removeClass('checked');
          input.prop('checked', true);
          parent.addClass('checked');
        }
      break;
    }
  };

  var effectPulse = function(element, effect){
    var label = element.children('label');
    if (effect) {
      element.bind({
        mouseenter: function(){
          label.addClass('pulse');
        },
        mouseleave: function(){
          label.removeClass('pulse');
        }
      });
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        options = that.options,
        element = that.element,
        input = element.find('input'),
        effect = options.effect;

      effectPulse(element, effect);
      onloadClass(input);      
      element.on('click.'+ pluginName, function(e){
        e.preventDefault();
        setClassForInput(input);
      });
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    effect: false
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
