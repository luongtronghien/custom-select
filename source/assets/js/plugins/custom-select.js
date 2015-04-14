/**
 *  @name customSelect
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
  var pluginName = 'customSelect';
  var privateVar = null;

  function initStructure(that){
    var text = that.options.selectText,
        wrapSL = that.options.wrapSL,
        div = '<div class="' + wrapSL + '"></div>',
        arrow = '<a href="javascript:void(0);"></a>',
        span = '<span>' + text + '</span>';

    that.element
      .wrap(div)
      .before(span)
      .before(arrow);
  }

  function createList(that){
    var select = that.element;
    var options = select.find('option'),
      ul = '<ul class="hl-sel-dropdown hl-hidden"></ul>',
      list = [],
      len = options.length;
    for(i = 0; i < len; i++){
      var getOption = $(options[i]);
      li = '<li data-text-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
      list.push(li);
    }

     that.ulTag = $(ul).append(list);
     $('body').append(that.ulTag);
  }

  function positionDropdown(that, posX, posY, heightS, widthS, bottomView){
    var list = $(that.ulTag),
        heightUl = list.outerHeight();
      console.log(list);
    if(heightUl > bottomView){
      list.css({
        'left': posX,
        'top': posY - heightUl,
        'minWidth': widthS
      }).addClass('top');
    }
    else {
      list.css({
        'left': posX,
        'top': posY + heightS,
        'minWidth': widthS
      }).removeClass('top');
    }
  }

  function controlClass(that, status){
    var dropDown = that.ulTag;
    if(status !== 'toggle'){
      if(status === 'remove'){
        dropDown.removeClass('hl-hidden');
      }
      else {
        dropDown.addClass('hl-hidden');
      }
    }
    else {
      dropDown.toggleClass('hl-hidden');
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

  function selectTextDropdown(that){
    var self = $(this),
      select = that.element,
      options = select.find('option'),
      span = select.siblings('span');

    $(span).text(self.text());
    $(options).attr('selected', false);
    for(var i = 0, len = options.length; i < len; i++){
      if(i === self.index()){
        $(options[i]).attr('selected', true);
      }
    }
    $(self).siblings('li').removeClass('active');
    self.addClass('active');
    controlClass(that, 'add');
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
        wrapSL = that.options.wrapSL,
        doc = $(document),
        win = $(window),
        list = that.ulTag,
        target,
        wrap = that.wrapper,
        posX = 0,
        posY = 0,
        topView = 0,
        heightWrap = 0,
        widthWrap = 0;

      initStructure(that);
      wrap = element.parent('.' + wrapSL);

      createList(that);
      loadText(element);
      posX = wrap.offset().left;
      posY = wrap.offset().top;
      topView = posY - win.scrollTop();
      heightWrap = wrap.outerHeight();
      widthWrap = wrap.outerWidth();
      bottomView = win.height() - topView - heightWrap;

        wrap.off('click.wrap').on('click.wrap', function() {
          doc.off('click.out').on('click.out', function(evt){
            $('.hl-sel-dropdown').not(that.ulTag).addClass('hl-hidden');

            target = $(evt.target).closest('.' + wrapSL);
            if(target.length < 1){
              controlClass(that, 'add');
            }
          });

          // var wrapper = $(this),
          //   posX = wrapper.offset().left,
          //   posY = wrapper.offset().top,
          //   topView = posY - $(window).scrollTop(),
          //   bottomView = $(window).height() - topView - wrapper.outerHeight();

          // $(window).off('resize.drop').on('resize.drop', function(){
          //   if($(list).is(':visible')){
          //     posX = wrap.offset().left;
          //     posY = wrap.offset().top;
          //     topView = posY - win.scrollTop();
          //     bottomView = win.height() - topView - wrap.outerHeight();
          //     positionDropdown(that, posX, posY, wrap.outerHeight(), wrap.outerWidth(), bottomView);
          //   }
          // });

          positionDropdown(that, posX, posY, heightWrap, widthWrap, bottomView);
          controlClass(that, 'toggle');
        });
        that.ulTag.off('click.li').on('click.li', 'li', function(){
          selectTextDropdown.call(this, that);
        });
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
    wrapSL: 'hl-select'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
