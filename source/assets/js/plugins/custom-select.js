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

  function initStructure(that, outer, span, arrow){
    var select = that.element;
    select
      .wrap(outer)
      .before(span)
      .before(arrow);
  }

  function createList(that){
    var select = that.element;
    var options = $(select).find('option'),
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
    var ul = that.ulTag,
      heightUl = ul.outerHeight();
    if(heightUl > bottomView){
      $(ul).css({
        'left': posX,
        'top': posY - heightUl,
        'minWidth': widthS
      }).addClass('top');
    }else{
      $(ul).css({
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
        doc = $(document);
        classWrap = that.options.classWrap,
        selectText = that.options.selectText,
        outer = '<div class="' + classWrap + '"></div>',
        arrow = '<a href="javascript:void(0);">&nbsp;</a>',
        span = '<span>' + selectText + '</span>';

        initStructure(that, outer, span, arrow);
        that.wrapper = element.parent();
        createList(that);
        loadText(element);

        that.wrapper.off('click.wrap').on('click.wrap', function() {
          doc.off('click.out').on('click.out', function(evt){
            var target = $(evt.target).closest('.' + classWrap);
            if(target.length < 1){
              controlClass(that, 'add');
            }
          });

          var wrapper = $(this),
            posX = wrapper.offset().left,
            posY = wrapper.offset().top,
            topView = posY - $(window).scrollTop(),
            bottomView = $(window).height() - topView - wrapper.outerHeight();

          $(window).off('resize.drop').on('resize.drop', function(){
            var statusDrop = $(that.ulTag).is(':visible');
            if(statusDrop){
              posX = wrapper.offset().left;
              posY = wrapper.offset().top;
              topView = posY - $(window).scrollTop();
              bottomView = $(window).height() - topView - wrapper.outerHeight();
              positionDropdown(that, posX, posY, wrapper.outerHeight(), wrapper.outerWidth(), bottomView);
            }
          });

          positionDropdown(that, posX, posY, wrapper.outerHeight(), wrapper.outerWidth(), bottomView);
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
    classWrap: 'hl-select'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
