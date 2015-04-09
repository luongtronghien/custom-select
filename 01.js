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

  function initStructure(that){
    var select = that.element,
      outer = '<div class="hl-select"></div>',
      arrow = '<a href="javascript:void(0);">&nbsp;</a>',
      span = '<span></span>';
    $(select)
      .wrap(outer)
      .before(span)
      .before(arrow);
  }

  function createDropdown(that){
    var select = that.element,
      options = $(select).find('option'),
      len = options.length,
      ul = '<ul class="hl-sel-dropdown hl-hidden"></ul>',
      li,
      opt = $(select).find('optgroup'),
      listLi = [],
      listOpt = [];
    if(opt.length){
      for(i=0; i < opt.length; i++){
        var getOpt = $(opt[i]),
          item = getOpt.find('option'),
          numberItem = item.length,
          ulInner = '<ul class="hl-sel-dropdown-inner"></ul>',
          listItem = [];
        for(j = 0; j < numberItem; j++){
          var getItem = $(item[j]);
          it = '<li data-text-option="' + getItem.attr('value') + '" class="' + (getItem.is(':selected') ? 'active' : '') + '">' + getItem.text() + '</li>';
          listItem.push(it);
        }
        var l = $(ulInner).append(listItem);
        li = '<li class="hl-optgroup"><strong>' + getOpt.attr('label') + '</strong></li>';
        var k = $(li).append(l);
        listOpt.push(k);
      }
      that.ulDrop = $(ul).append(listOpt);
    }
    else {
      for(i = 0; i < len; i++){
        var getOption = $(options[i]);
        li = '<li data-text-option="' + getOption.attr('value') + '" class="' + (getOption.is(':selected') ? 'active' : '') + '">' + getOption.text() + '</li>';
        listLi.push(li);
      }
      that.ulDrop = $(ul).append(listLi);
    }

    $(that.ulDrop).appendTo('body');
  }

  function styleDropdown(that, posL, posT, heightSel, widthSel, bottomView){
    var ul = that.ulDrop,
      heighDrop = $(ul).outerHeight();
    if(heighDrop > bottomView){
      $(ul).css({
        'left': posL,
        'top': posT - heighDrop,
        'minWidth': widthSel
      }).addClass('top');  
    }
    else {
      $(ul).css({
        'left': posL,
        'top': posT + heightSel,
        'minWidth': widthSel
      }).removeClass('top');
    }
  }

  function controlClass(that, status){
    var ul = that.ulDrop;
    if(status !== 'toggle'){
      if(status === 'remove'){
        $(ul).removeClass('hl-hidden');
      }
      else {
        $(ul).addClass('hl-hidden');
      }
    }
    else {
      $(ul).toggleClass('hl-hidden');
    }
  }

  function loadText(that){
    var select = that.element, 
      options = $(select).find('option'),
      selected = $(options).filter(function(){
        return $(this).is(':selected');
      }),
      span = $(select).siblings('span'),
      i = 0;
    if(selected.length < 1){
      $(span).text($(options[0].text()));
    }
    else {
      $(span).text($(selected).text());
    }
  }

  function selectTextDropdown(that){
    var select = that.element,
      options = $(select).find('option'),
      i = 0,
      len = options.length,
      span = $(select).siblings('span');
    $(span).text($(this).text());
    $(options).attr('selected', false);
    for(i; i < len; i++){
      if(i === $(this).index()){
        $(options[i]).attr('selected', true);
      }
    }
    $(this).siblings('li').removeClass('active');
    $(this).addClass('active');
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
        textInit = that.options.textInit;
        

        initStructure(that);
        that.wrapSel = $(element).parent();
        createDropdown(that);
        loadText(that);


        $(that.wrapSel).off('click.wrap').on('click.wrap', function(){
          var wrap = $(this),
            posL = wrap.offset().left,
            posT = wrap.offset().top,
            topView = posT - $(window).scrollTop(),
            bottomView = $(window).height() - topView - wrap.outerHeight(),
            heightSel = wrap.outerHeight(),
            widthSel = wrap.outerWidth(),
            ul = that.ulDrop;

          $(document).off('click.out').on('click.out', function(evt){
            var target = $(evt.target).closest('.hl-select');
            if(target.length < 1){
              controlClass(that, 'add');
            }
          });

          $(window).off('resize.drop').on('resize.drop', function(){
            var statusDrop = $(ul).is(':visible');
            if(statusDrop){
              posL = wrap.offset().left,
              posT = wrap.offset().top,
              topView = posT - $(window).scrollTop(),
              heightSel = wrap.outerHeight(),
              widthSel = wrap.outerWidth();
              bottomView = $(window).height() - topView - wrap.outerHeight();
              styleDropdown(that, posL, posT, heightSel, widthSel, bottomView);
            }
          });

          styleDropdown(that, posL, posT, heightSel, widthSel, bottomView);
          controlClass(that, 'toggle');
          $(ul).off('click.li').off('click.li').on('click.li', 'li', function(){
            selectTextDropdown.call(this, that);
          });
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
    textInit: 'Select'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
