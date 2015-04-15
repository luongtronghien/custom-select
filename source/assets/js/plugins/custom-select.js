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
    var element = that.element,
        options = that.options,
        optionSL = element.find('option'),
        dropdowClass = options.dropdowClass,
        hiddenClass = options.hiddenClass,
        ul = '<ul class="' + dropdowClass + ' ' + hiddenClass + '"></ul>',
        getOption = [],
        listLI = [],
        len = optionSL.length,
        opt,
        optSL = element.find('optgroup'),
        optGroup = options.optGroupClass,
        getOpt = [],
        listOpt = [],
        optionGr,
        getOptionGr = [],
        listLiGr = [];

    if(optSL.length){
      for(var j = 0; j < optSL.length; j++){
        getOpt = $(optSL[j]);
        opt = '<li class="' + optGroup + '"><strong>' + getOpt.attr('name') + '</strong></li>';
        listOpt.push(opt);
        optionGr = getOpt.find('option'),
        for(var i = 0; i < optionGr.length; i++){
          getOptionGr = $(optionGr[i]);
          liGr = '<li data-option="' + getOptionGr.attr('value') + '" class="' + (getOptionGr.is(':selected') ? 'active' : '') + '">' + getOptionGr.text() + '</li>';
          listLiGr.push(liGr);
        }
        that.ulDrop = $(listOpt).append(listLiGr);
      }
    }
    else {
      for(var i = 0; i < len; i++){
        getOption = $(optionSL[i]);
        li = '<li data-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
        listLI.push(li);
      }
      that.ulDrop = $(ul).append(listLI);
    }
    $('body').append(that.ulDrop);
  }

  function positionDropdown(that, posX, posY, heightS, widthS, bottomView){
    var ulDrop = that.ulDrop,
        heightUl = ulDrop.outerHeight();
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
        dropdowClass = options.dropdowClass,
        $document = $(document),
        $window = $(window),
        target,
        wrapSL,
        ulDrop,
        posX = 0,
        posY = 0,
        topView = 0,
        heightWrap = 0,
        widthWrap = 0;

      var changepositionDropdown = function(){
        posX = wrapSL.offset().left;
        posY = wrapSL.offset().top;
        topView = posY - $window.scrollTop();
        heightWrap = wrapSL.outerHeight();
        widthWrap = wrapSL.outerWidth();
        bottomView = $window.height() - topView - heightWrap;
        positionDropdown(that, posX, posY, heightWrap, widthWrap, bottomView);
      };

      initStructure(that);
      loadText(that);
      createDropdown(that);
      wrapSL = element.parent();
      ulDrop = that.ulDrop;

      changepositionDropdown();

      wrapSL.off('click.sel').on('click.sel', function(e) {
        e.preventDefault();
        e.stopPropagation();

        changepositionDropdown();

        $('.' + dropdowClass).not(ulDrop).not(':hidden').addClass(hiddenClass);

        ulDrop.toggleClass(hiddenClass);

        ulDrop.off('click.li').on('click.li', 'li', function(e){
          e.stopPropagation();
          selectTextDropdown.call(this, that);
        });
      });

      $window.on('resize.sel', function(){
        if(ulDrop.is(':visible')){
          changepositionDropdown();
        }
      });

      $document.off('click.out').on('click.out', function(e){
        $('.' + dropdowClass).not(':hidden').addClass(hiddenClass);
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
    hiddenClass: 'sel-hidden',
    optGroupClass: 'opt-group'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
