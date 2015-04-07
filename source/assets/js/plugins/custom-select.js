/**
 *  @name hl-select
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
  var pluginName = 'hl-select';
  var privateVar = null;

  function createList(options, ul){
    var list = [];
    for(i = 0, len = options.length; i < len; i++){
      var getOption = $(options[i]);
      li = '<li data-text-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
      list.push(li);
    }
    $('body').append($(ul).append(list));
  }

  function createWrap(selectBox, div, span, link){
    selectBox
    .wrap(div)
    .before(span)
    .before(link);
  }

  function styleDropdown(dropdowClass, x, y, heightE, widthE){
    $(dropdowClass).css({
      'left': x,
      'top': y + heightE,
      'minWidth': widthE
    });
  }

  function showHideDropdown(dropdowClass, className, status){
    var dropDown = $(dropdowClass);
    if(status){
      if(status === false){
        dropDown.removeClass(className);
      }else{
        dropDown.addClass(className);
      }
    }else{
      dropDown.toggleClass(className);
    }
  }

  function loadText(sel, span){
    var options = $(sel).find('option');
    $(span).text(options.filter(function(){
      return $(this).is(':selected');
    }).text());
  }

  function selectTextDropdown(sel, span, self, li, dropdowClass){
    var options = $(sel).find('option');
    $(span).text(self.text());
    $(options).attr('selected', false);
    for(var i = 0, len = options.length; i < len; i++){
      if(i === self.index()){
        $(options[i]).attr('selected', true);
      }
    }
    $(li).removeClass('active');
    self.addClass('active');
    showHideDropdown(dropdowClass, 'hl-hidden', true);
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        element = that.element,
        classWrap = that.options.classWrap,
        selectText = that.options.selectText,
        dropdowClass = that.options.dropdowClass,
        wrap = '<div class="' + classWrap + '"></div>',
        link = '<a href="javascript:void(0);">&nbsp;</a>',
        span = '<span>' + selectText + '</span>',
        ul = '<ul class="' + dropdowClass + ' hl-hidden"></ul>',
        options = element.find('option');

      if(element.length){
        createWrap(element, wrap, span, link);
        createList(options, ul);
        loadText(element, '.' + classWrap + '> span');
        element.parent().on('click', function(event){
          var that = $(this);
          styleDropdown('.' + dropdowClass, that.offset().left, that.offset().top, that.innerHeight(), that.innerWidth());
          showHideDropdown('.' + dropdowClass, 'hl-hidden');
        });
        $('.' + dropdowClass).on('click.li', 'li', function(e){
          selectTextDropdown(element, '.' + classWrap + '> span', $(this), '.' + dropdowClass + '> li', '.' + dropdowClass);
        });
      }
    },
    publicMethod: function(params) {

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
    selectText: 'Select',
    classWrap: 'hl-select',
    dropdowClass: 'hl-sel-dropdown'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
