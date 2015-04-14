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
        wrapClass = that.options.wrapClass,
        div = '<div class="' + wrapClass + '"></div>',
        arrow = '<a href="javascript:void(0);"></a>',
        span = '<span>' + text + '</span>';

    that.element
      .wrap(div)
      .before(span)
      .before(arrow);
  }

  function createDropdown(that){
    var select = that.element,
        options = that.options,
        optionSL = select.find('option'),
        dropdowClass = options.dropdowClass,
        hiddenClass = options.hiddenClass,
        ul = '<ul class="' + dropdowClass + ' ' + hiddenClass + '"></ul>',
        listLI = [],
        len = optionSL.length,
        listUL;

    for(var i = 0; i < len; i++){
      var getOption = $(optionSL[i]);
      li = '<li data-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
      listLI.push(li);
    }
    that.ulDrop = listUL = $(ul).append(listLI);
    $('body').append(listUL);
  }

  function positionDropdown(that, posX, posY, heightS, widthS, bottomView){
    var ulDrop = that.ulDrop,
        heightUl = ulDrop.outerHeight();
    console.log(heightUl);
    if(heightUl > bottomView){
      ulDrop.css({
        'left': posX,
        'top': posY - heightUl,
        'minWidth': widthS
      }).addClass('top');
    }
    else {
      ulDrop.css({
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

  function loadText(that){
    var element = that.element,
      optionSL = element.find('option'),
      getSpan = element.siblings('span');
    getSpan.text(optionSL.filter(function(){
      return $(this).is(':selected');
    }).text());
  }

  function selectTextDropdown(that){
    var self = $(this),
        element = that.element,
        optionSL = element.find('option'),
        getSpan = element.siblings('span'),
        hiddenClass = that.options.hiddenClass;

    getSpan.text(self.text());
    $(optionSL).attr('selected', false);
    for(var i = 0, len = optionSL.length; i < len; i++){
      if(i === self.index()){
        $(optionSL[i]).attr('selected', true);
      }
    }
    $(self).siblings('li').removeClass('active');
    self.addClass('active');
    that.hideSL(that.ulDrop, hiddenClass);
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
        options = that.options,
        wrapClass = options.wrapClass,
        hiddenClass = options.hiddenClass,
        doc = $(document),
        win = $(window),
        // list = that.ulTag,
        target,
        // wrap = that.wrapper,

        wrapSL,
        ulDrop,
        posX = 0,
        posY = 0,
        topView = 0,
        heightWrap = 0,
        widthWrap = 0;

      initStructure(that);
      loadText(that);
      createDropdown(that);
      wrapSL = element.parent();
      ulDrop = that.ulDrop;
      
      posX = wrapSL.offset().left;
      posY = wrapSL.offset().top;
      topView = posY - win.scrollTop();
      heightWrap = wrapSL.outerHeight();
      widthWrap = wrapSL.outerWidth();

      bottomView = win.height() - topView - heightWrap;

      positionDropdown(that, posX, posY, heightWrap, widthWrap, bottomView);

      wrapSL.off('click.sel').on('click.sel', function(e) {
        e.preventDefault();
        ulDrop.toggleClass(hiddenClass);

        ulDrop.off('click.li').on('click.li', 'li', function(e){
          selectTextDropdown.call(this, that);
        });

        // if(ulDrop.hasClass(hiddenClass)){
        //   that.showSL(ulDrop, hiddenClass);
        // }
        // else {
        //   that.hideSL(ulDrop, hiddenClass);
        // }
        
        // doc.off('click.out').on('click.out', function(evt){
        //   $('.hl-sel-dropdown').not(that.ulTag).addClass('hl-hidden');

        //   target = $(evt.target).closest('.' + wrapClass);
        //   if(target.length < 1){
        //     controlClass(that, 'add');
        //   }
        // });

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

        // positionDropdown(that, posX, posY, heightWrap, widthWrap, bottomView);
        // controlClass(that, 'toggle');
      });
      // that.ulTag.off('click.li').on('click.li', 'li', function(){
      //   selectTextDropdown.call(this, that);
      // });
      win.off('resize.sel').on('resize.sel', function(){
        if(ulDrop.is(':visible')){
          posX = wrapSL.offset().left;
          posY = wrapSL.offset().top;
          topView = posY - win.scrollTop();
          heightWrap = wrapSL.outerHeight();
          widthWrap = wrapSL.outerWidth();
          positionDropdown(that, posX, posY, heightWrap, widthWrap, bottomView);
        }
      });
    },
    showSL: function(ulDrop, className) {
      ulDrop.removeClass(className);
    },
    hideSL: function(ulDrop, className) {
      ulDrop.addClass(className);
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
    selectText: 'Select...',
    wrapClass: 'sel-custom',
    dropdowClass: 'sel-dropdown',
    hiddenClass: 'sel-hidden'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
