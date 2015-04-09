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

  function initStructure(select, outer, span, arrow){
    select
      .wrap(outer)
      .before(span)
      .before(arrow);
  }

  function createList(select){
    var options = $(select).find('option'),
      ul = '<ul class="hl-sel-dropdown hl-hidden"></ul>',
      list = [];

    for(i = 0, len = options.length; i < len; i++){
      var getOption = $(options[i]);
      li = '<li data-text-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
      list.push(li);
    }

    $('body').append($(ul).append(list));
  }

  function styleDropdown(x, y, heightE, widthE, bottomView){
    if($('.hl-sel-dropdown').outerHeight() > bottomView){
      $('.hl-sel-dropdown').css({
        'left': x,
        'top': y - $('.hl-sel-dropdown').outerHeight(),
        'minWidth': widthE
      }).addClass('top');  
    }else{
      $('.hl-sel-dropdown').css({
        'left': x,
        'top': y + heightE,
        'minWidth': widthE
      }).removeClass('top');
    }
  }

  function showHideDropdown(className, status){
    var dropDown = $('.hl-sel-dropdown');
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

  function loadText(select){
    var that = $(select), 
      options = that.find('option'),
      span = that.siblings('span');
    $(span).text(options.filter(function(){
      return $(this).is(':selected');
    }).text());
  }

  function selectTextDropdown(select, self){
    var that = $(select),
      options = that.find('option'),
      span = that.siblings('span');
    $(span).text(self.text());
    $(options).attr('selected', false);
    for(var i = 0, len = options.length; i < len; i++){
      if(i === self.index()){
        $(options[i]).attr('selected', true);
      }
    }
    $(self).siblings('li').removeClass('active');
    self.addClass('active');
    showHideDropdown('hl-hidden', true);
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
        outer = '<div class="' + classWrap + '"></div>',
        arrow = '<a href="javascript:void(0);">&nbsp;</a>',
        span = '<span>' + selectText + '</span>';

        console.log($(element).length);

      if(element.length){
        initStructure(element, outer, span, arrow);
        createList(element);
        loadText(element);
        $('html').off('click.out').on('click.out', function(event){
          var target = $(event.target).closest('.' + classWrap);
          if(target.length < 1){
            showHideDropdown('hl-hidden', true);
          }
        });
        element.parent().on('click', function(event){
          var that = $(this),
            leftE = that.offset().left,
            topE = that.offset().top,
            topView = topE - $(window).scrollTop(),
            bottomView = $(window).height() - topView - that.outerHeight();

          $(window).on('resize', function(){
            var statusDrop = $('.hl-sel-dropdown').is(':visible');
            if(statusDrop){
              leftE = that.offset().left;
              topE = that.offset().top;
              topView = topE - $(window).scrollTop();
              bottomView = $(window).height() - topView - that.outerHeight();
              styleDropdown(leftE, topE, that.outerHeight(), that.outerWidth(), bottomView);
            }
          });
          styleDropdown(leftE, topE, that.outerHeight(), that.outerWidth(), bottomView);
          showHideDropdown('hl-hidden');
        });
        $('.hl-sel-dropdown').off('click.li').on('click.li', 'li', function(e){
          selectTextDropdown(element, $(this));
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
    classWrap: 'hl-select'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
