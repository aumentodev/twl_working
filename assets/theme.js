window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};
var pageload = 1;

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));  
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventName, function(evt) {
      if (
        options.$container[0] !== evt.target &&
        !options.$container.has(evt.target).length
      ) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      'change',
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function(element) {
          var $element = $(element);
          var type = $element.attr('type');
          var currentOption = {};

          if (type === 'radio' || type === 'checkbox') {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data('index');

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      console.log(selectedValues);
      var variants = this.product.variants;
	  console.log(variants);
      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      console.log("Onselectchange!!");
      var variant = this._getVariantFromOptions();
      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });
      var variant_title = variant;
      if (variant_title != undefined) {
       var variant_title_1 = variant_title.title.replace(/\//g, "_").replace(/\s/g,'').replace('.','_')
       if($(".order_tag_status").html() == "true") 
       {
          $(".pre_order_instruction").hide();
          $(".var_"+variant_title_1).show();
          $('.preorder_properties').html('');
          if($(".var_"+variant_title_1).css('display') == 'block')
          {
            if($(".back_order_tag").attr("data-tag") == "true")
            {
              var backtag = $(".back_order_tag").html();
              console.log("backtag"+backtag);
              $('.product-form__cart-submit span').text(backtag);
              var newInput = document.createElement("input");
              newInput.setAttribute('type', 'hidden');
              newInput.setAttribute('name', 'properties[_backorder]');
              newInput.setAttribute('value', 'BACK ORDERD');
              $('.backorder_properties').append(newInput);
            }    
            if($(".pre_order_tag").attr("data-tag") == "true")
            {
              var pretag = $(".pre_order_tag").html();
              $('.product-form__cart-submit span').text(pretag);
              var newInput = document.createElement("input");
              newInput.setAttribute('type', 'hidden');
              newInput.setAttribute('name', 'properties[_preorder]');
              newInput.setAttribute('value', 'PRE ORDER');
              $('.preorder_properties').append(newInput);
            }
          }else{
            if(!variant.available){}else{$('.product-form__cart-submit span').text('Add to cart');}  
          }
       }
      }
      if (variant == undefined) {
        if(pageload < 1)
        {
          $("#ProductPrice-product-template .money").html(""); 
        }
        $("#AddToCartText-product-template").html("Unavailable");
        var variant_opt_length = $(".single-option-selector").length;
        for(var i=0; i<variant_opt_length; i++)
        {
            if($("#SingleOptionSelector-"+i).val() == "")
            {
          		$("#AddToCartText-product-template").html("SELECT PRODUCT");
                break;
            }
        }
        $("#AddToCart-product-template").attr("disabled", true);        
        if($(".color-list").hasClass("selected"))
        {
           if($(".single-option-selector").hasClass("multiple_variants"))
           {
           }else{
             $("#AddToCartText-product-template").html("Add to cart");
             $("#AddToCart-product-template").attr("disabled", false); 
           }
        }        
        return;
       }
      else
      {
        if(!variant.available)
        {
          if($(".template_suffix").html() == "launches-notifiy")
          {
            $("#AddToCart-notification-template").hide();
            $(".email_popup").html("Coming soon - notify me"); 
          }          
        }
        else
        {
          $("#ProductPrice-product-template").html(theme.Currency.formatMoney(variant.price, theme.moneyFormat));
          $("#AddToCart-notification-template").show();
        }
      }
      pageload++;
      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }

      if (window.BOLD && BOLD.common && BOLD.common.eventEmitter && typeof BOLD.common.eventEmitter.emit === 'function' && BOLDCURRENCY.currentCurrency) {
        BOLD.common.eventEmitter.emit('BOLD_CURRENCY_double_check');
      }
     
},

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function(variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }
      

      var newurl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        '?variant=' +
        variant.id;
      window.history.replaceState({ path: newurl }, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    }
  });

  return Variants;
})();


/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();


/* ================ MODULES ================ */
window.theme = window.theme || {};

theme.Header = (function() {
  var selectors = {
    body: 'body',
    navigation: '#AccessibleNav',
    siteNavHasDropdown: '.site-nav--has-dropdown',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link'
  };

  var cache = {};

  function init() {
    cacheSelectors();

    cache.$parents.on('click.siteNav', function(evt) {
      var $el = $(this);

      if (!$el.hasClass(config.activeClass)) {
        // force stop the click from happening
        //evt.preventDefault();
        //evt.stopImmediatePropagation();
        showDropdown($el);
      }
    });

    // check when we're leaving a dropdown and close the active dropdown
    $(selectors.siteNavChildLink).on('focusout.siteNav', function() {
      setTimeout(function() {
        if (
          $(document.activeElement).hasClass(config.childLinkClass) ||
          !cache.$activeDropdown.length
        ) {
          return;
        }

        hideDropdown(cache.$activeDropdown);
      });
    });

    // close dropdowns when on top level nav
    cache.$topLevel.on('focus.siteNav', function() {
      if (cache.$activeDropdown.length) {
        hideDropdown(cache.$activeDropdown);
      }
    });

    cache.$subMenuLinks.on('click.siteNav', function(evt) {
      // Prevent click on body from firing instead of link
      evt.stopImmediatePropagation();
    });
  }

  function cacheSelectors() {
    cache = {
      $nav: $(selectors.navigation),
      $topLevel: $(selectors.siteNavLinkMain),
      $parents: $(selectors.navigation).find(selectors.siteNavHasDropdown),
      $subMenuLinks: $(selectors.siteNavChildLinks),
      $activeDropdown: $(selectors.siteNavActiveDropdown)
    };
  }

  function showDropdown($el) {
    $el.addClass(config.activeClass);

    // close open dropdowns
    if (cache.$activeDropdown.length) {
      hideDropdown(cache.$activeDropdown);
    }

    cache.$activeDropdown = $el;

    // set expanded on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'true');

    setTimeout(function() {
      $(window).on('keyup.siteNav', function(evt) {
        if (evt.keyCode === 27) {
          hideDropdown($el);
        }
      });

      $(selectors.body).on('click.siteNav', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown($el) {
    // remove aria on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'false');
    $el.removeClass(config.activeClass);

    // reset active dropdown
    cache.$activeDropdown = $(selectors.siteNavActiveDropdown);

    $(selectors.body).off('click.siteNav');
    $(window).off('keyup.siteNav');
  }

  function unload() {
    $(window).off('.siteNav');
    cache.$parents.off('.siteNav');
    cache.$subMenuLinks.off('.siteNav');
    cache.$topLevel.off('.siteNav');
    $(selectors.siteNavChildLink).off('.siteNav');
    $(selectors.body).off('.siteNav');
  }

  return {
    init: init,
    unload: unload
  };
})();

window.theme = window.theme || {};

theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 749px)';

  function init() {
    cacheSelectors();

    cache.$mobileNavToggle.on('mousedown', toggleMobileNav);
    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

    // Close mobile nav when unmatching mobile breakpoint
    enquire.register(mediaQuerySmall, {
      unmatch: function() {
        closeMobileNav();
      }
    });
  }

  function toggleMobileNav() {
    if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
      closeMobileNav();
      $("html").removeClass("fixed-scrolling");
    } else {
      openMobileNav();
      $("html").addClass("fixed-scrolling");
    }
  }

  function cacheSelectors() {
    cache = {
      $pageContainer: $('#PageContainer'),
      $siteHeader: $('.site-header'),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-wrapper'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $('#shopify-section-header'),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn)
    };
  }

  function openMobileNav() {
    var translateHeaderHeight =
      cache.$siteHeader.outerHeight() + cache.$siteHeader.position().top;

    cache.$mobileNavContainer.prepareTransition().addClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(' + translateHeaderHeight + 'px)'
    });

    cache.$pageContainer.css({
      transform:
        'translate3d(0, ' + cache.$mobileNavContainer[0].scrollHeight + 'px, 0)'
    });

    slate.a11y.trapFocus({
      $container: cache.$sectionHeader,
      $elementToFocus: cache.$mobileNav
        .find('.' + classes.navLinkWrapper + ':first')
        .find('.' + classes.navLink),
      namespace: 'navFocus'
    });

    cache.$mobileNavToggle
      .addClass(classes.mobileNavCloseIcon)
      .removeClass(classes.mobileNavOpenIcon);

    // close on escape
    $(window).on('keyup.mobileNav', function(evt) {
      if (evt.which === 27) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    cache.$mobileNavContainer.prepareTransition().removeClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(-100%)'
    });

   //cache.$pageContainer.removeAttr('style');
    cache.$pageContainer.css({
      transform:
        'translate3d(0,0, 0)'
    });

    slate.a11y.trapFocus({
      $container: $('html'),
      $elementToFocus: $('body')
    });

    cache.$mobileNavContainer.one(
      'TransitionEnd.navToggle webkitTransitionEnd.navToggle transitionend.navToggle oTransitionEnd.navToggle',
      function() {
        slate.a11y.removeTrapFocus({
          $container: cache.$mobileNav,
          namespace: 'navFocus'
        });
        document.activeElement.blur();
      }
    );

    cache.$mobileNavToggle
      .addClass(classes.mobileNavOpenIcon)
      .removeClass(classes.mobileNavCloseIcon);

    $(window).off('keyup.mobileNav');

    scrollTo(0, 0);
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {
    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
      ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
      : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav.prepareTransition().addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    var $elementToFocus = target
      ? $targetMenu.find('.' + classes.subNavLink + ':first')
      : $activeTrigger;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu.outerHeight();

    var openNavClass =
      menuLevel > 2 ? classes.thirdNavShowing : classes.subNavShowing;

    cache.$mobileNavContainer
      //.css('height', translateMenuHeight)      
      //  .css('height', 'calc(100vh - 100px)')      
      .removeClass(classes.thirdNavShowing)
      .addClass(openNavClass);

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
      	//.css('height', '100%')
        .removeClass(classes.thirdNavShowing)
        .removeClass(classes.subNavShowing);
      	
    }

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        slate.a11y.trapFocus({
          $container: $targetMenu,
          $elementToFocus: $elementToFocus,
          namespace: 'subNavFocus'
        });

        cache.$mobileNavContainer.off('.subnavToggle');
        isTransitioning = false;
      }
    );

    // Match height of subnav
    cache.$pageContainer.css({
      transform: 'translateY(' + translateMenuHeight + 'px)'
    });

    $activeSubNav.removeClass(classes.subNavClosing);
  }

  return {
    init: init,
    closeMobileNav: closeMobileNav
  };
})(jQuery);

window.theme = window.theme || {};

theme.Search = (function() {
  var selectors = {
    search: '.search',
    searchSubmit: '.search__submit',
    searchInput: '.search__input',

    siteHeader: '.site-header',
    siteHeaderSearchToggle: '.site-header__search-toggle',
    siteHeaderSearch: '.site-header__search',

    searchDrawer: '.search-bar',
    searchDrawerInput: '.search-bar__input',

    searchHeader: '.search-header',
    searchHeaderInput: '.search-header__input',
    searchHeaderSubmit: '.search-header__submit',

    mobileNavWrapper: '.mobile-nav-wrapper'
  };

  var classes = {
    focus: 'search--focus-custom',
    mobileNavIsOpen: 'js-menu--is-open'
  };

  function init() {
    if (!$(selectors.siteHeader).length) {
      return;
    }

    initDrawer();
    searchSubmit();

    $(selectors.searchHeaderInput)
      .add(selectors.searchHeaderSubmit)
      .on('focus blur', function() {
        $(selectors.searchHeader).toggleClass(classes.focus);
      });

    $(selectors.siteHeaderSearchToggle).on('click', function() {
      var searchHeight = $(selectors.siteHeader).outerHeight();
      var searchOffset = $(selectors.siteHeader).offset().top - searchHeight;

      $(selectors.searchDrawer).css({
        height: searchHeight + 'px',
        top: searchOffset + 'px'
      });
    });
  }

  function initDrawer() {
    // Add required classes to HTML
    $('#PageContainer').addClass('drawer-page-content');
    $('.js-drawer-open-top')
      .attr('aria-controls', 'SearchDrawer')
      .attr('aria-expanded', 'false');

    theme.SearchDrawer = new theme.Drawers('SearchDrawer', 'top', {
      onDrawerOpen: searchDrawerFocus
    });
  }

  function searchDrawerFocus() {
    searchFocus($(selectors.searchDrawerInput));

    if ($(selectors.mobileNavWrapper).hasClass(classes.mobileNavIsOpen)) {
      theme.MobileNav.closeMobileNav();
    }
  }

  function searchFocus($el) {
    $el.focus();
    // set selection range hack for iOS
    $el[0].setSelectionRange(0, $el[0].value.length);
  }

  function searchSubmit() {
    $(selectors.searchSubmit).on('click', function(evt) {
      var $el = $(evt.target);
      var $input = $el.parents(selectors.search).find(selectors.searchInput);
      if ($input.val().length === 0) {
        evt.preventDefault();
        searchFocus($input);
      }
    });
  }

  return {
    init: init
  };
})();

(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();

theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    wrapper: 'slideshow-wrapper',
    slideshow: 'slideshow',
    currentSlide: 'slick-current',
    video: 'slideshow__video',
    videoBackground: 'slideshow__video--background',
    closeVideoBtn: 'slideshow__video-control--close',
    pauseButton: 'slideshow__pause',
    isPaused: 'is-paused'
  };

  function slideshow(el) {
    this.$slideshow = $(el);
    this.$wrapper = this.$slideshow.closest('.' + classes.wrapper);
    this.$pause = this.$wrapper.find('.' + classes.pauseButton);

    this.settings = {
      accessibility: true,
      arrows: false,
      dots: true,
      fade: true,
      draggable: true,
      touchThreshold: 20,
      autoplay: this.$slideshow.data('autoplay'),
      autoplaySpeed: this.$slideshow.data('speed')
    };

    this.$slideshow.on('beforeChange', beforeChange.bind(this));
    this.$slideshow.on('init', slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);

    this.$pause.on('click', this.togglePause.bind(this));
  }

  function slideshowA11y(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    var $wrapper = this.$wrapper;
    var autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        $slider.slick('slickPause');
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        // Manual check if the focused element was the video close button
        // to ensure autoplay does not resume when focus goes inside YouTube iframe
        if ($(evt.target).hasClass(classes.closeVideoBtn)) {
          return;
        }

        $slider.slick('slickPlay');
      }
    });

    // Add arrow key support when focused
    if (obj.$dots) {
      obj.$dots.on('keydown', function(evt) {
        if (evt.which === 37) {
          $slider.slick('slickPrev');
        }

        if (evt.which === 39) {
          $slider.slick('slickNext');
        }

        // Update focus on newly selected tab
        if (evt.which === 37 || evt.which === 39) {
          obj.$dots.find('.slick-active button').focus();
        }
      });
    }
  }

  function beforeChange(event, slick, currentSlide, nextSlide) {
    var $slider = slick.$slider;
    var $currentSlide = $slider.find('.' + classes.currentSlide);
    var $nextSlide = $slider.find(
      '.slideshow__slide[data-slick-index="' + nextSlide + '"]'
    );

    if (isVideoInSlide($currentSlide)) {
      var $currentVideo = $currentSlide.find('.' + classes.video);
      var currentVideoId = $currentVideo.attr('id');
      theme.SlideshowVideo.pauseVideo(currentVideoId);
      $currentVideo.attr('tabindex', '-1');
    }

    if (isVideoInSlide($nextSlide)) {
      var $video = $nextSlide.find('.' + classes.video);
      var videoId = $video.attr('id');
      var isBackground = $video.hasClass(classes.videoBackground);
      if (isBackground) {
        theme.SlideshowVideo.playVideo(videoId);
      } else {
        $video.attr('tabindex', '0');
      }
    }
  }

  function isVideoInSlide($slide) {
    return $slide.find('.' + classes.video).length;
  }

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick('slickPlay');
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick('slickPause');
    }
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.SlideshowVideo.loadVideos();
}

theme.SlideshowVideo = (function() {
  var autoplayCheckComplete = false;
  var autoplayAvailable = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    slideshowWrapper: 'slideshow-wrapper',
    slide: 'slideshow__slide',
    slideBackgroundVideo: 'slideshow__slide--background-video',
    slideDots: 'slick-dots',
    videoChrome: 'slideshow__video--chrome',
    videoBackground: 'slideshow__video--background',
    playVideoBtn: 'slideshow__video-control--play',
    closeVideoBtn: 'slideshow__video-control--close',
    currentSlide: 'slick-current',
    slickClone: 'slick-cloned',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay'
  };

  /**
   * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status: $video.data('type') === 'chrome' ? 'closed' : 'background', // closed, open, background
      videoSelector: $video.attr('id'),
      $parentSlide: $video.closest('.' + classes.slide),
      $parentSlideshowWrapper: $video.closest('.' + classes.slideshowWrapper),
      controls: $video.data('type') === 'background' ? 0 : 1,
      slideshow: $video.data('slideshow')
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function customPlayVideo(playerId) {
    // Do not autoplay just because the slideshow asked you to.
    // If the slideshow asks to play a video, make sure
    // we have done the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function loadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);

    initEvents();
  }

  /**
   * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $slide = videos[id].$parentSlide;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
      // Play if autoplay is available or clicked to play
      $slide.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    }

    // Check for autoplay if not already done
    if (!autoplayCheckComplete) {
      autoplayCheckFunction(player, $slide);
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported
      ? classes.supportsAutoplay
      : classes.supportsNoAutoplay;
    $(document.documentElement).addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function autoplayCheckFunction(player, $slide) {
    // attempt to play video
    player.playVideo();

    autoplayTest(player)
      .then(function() {
        setAutoplaySupport(true);
      })
      .fail(function() {
        // No autoplay available (or took too long to start playing).
        // Show fallback image. Stop video for safety.
        setAutoplaySupport(false);
        player.stopVideo();
      })
      .always(function() {
        autoplayCheckComplete = true;
        $slide.removeClass(classes.loading);
      });
  }

  function autoplayTest(player) {
    var deferred = $.Deferred();
    var wait;
    var timeout;

    wait = setInterval(function() {
      if (player.getCurrentTime() <= 0) {
        return;
      }

      autoplayAvailable = true;
      clearInterval(wait);
      clearTimeout(timeout);
      deferred.resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      deferred.reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds

    return deferred;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if ($(window).width() < 750) {
      playOnClick = true;
    } else if (window.mobileCheck()) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);

    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();

    // Customize based on options from the video ID
    switch (videoData.type) {
      case 'background-chrome':
      case 'background':
        evt.target.mute();
        // Only play the video if it is in the active slide
        if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
          privatePlayVideo(videoData.id);
        }
        break;
    }

    videoData.$parentSlide.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);

    switch (evt.data) {
      case 0: // ended
        setAsFinished(videoData);
        break;
      case 1: // playing
        setAsPlaying(videoData);
        break;
      case 2: // paused
        setAsPaused(videoData);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'background-chrome':
        videoPlayers[videoData.id].seekTo(0);
        closeVideo(videoData.id);
        break;
      case 'chrome':
        closeVideo(videoData.id);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    $slide.removeClass(classes.loading);

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    switch (videoData.type) {
      case 'chrome':
      case 'background-chrome':
        $slideshow.removeClass(classes.paused).addClass(classes.playing);
        $slide.removeClass(classes.paused).addClass(classes.playing);
        break;
    }

    // Update focus to the close button so we stay within the slide
    $slide.find('.' + classes.closeVideoBtn).focus();
  }

  function setAsPaused(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    if (videoData.type === 'background-chrome') {
      closeVideo(videoData.id);
      return;
    }

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.status !== 'closed' && videoData.type !== 'background') {
      $slideshow.addClass(classes.paused);
      $slide.addClass(classes.paused);
    }

    if (videoData.type === 'chrome' && videoData.status === 'closed') {
      $slideshow.removeClass(classes.paused);
      $slide.removeClass(classes.paused);
    }

    $slideshow.removeClass(classes.playing);
    $slide.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;
    var classesToRemove = [classes.pause, classes.playing].join(' ');

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'background-chrome':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
      case 'chrome':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
    }

    $slideshow.removeClass(classesToRemove);
    $slide.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    return videos[evt.target.h.id];
  }

  function startVideoOnClick(playerId) {
    var videoData = videos[playerId];
    // add loading class to slide
    videoData.$parentSlide.addClass(classes.loading);

    videoData.status = 'open';

    switch (videoData.type) {
      case 'background-chrome':
        unsetBackgroundVideo(playerId, videoData);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
      case 'chrome':
        privatePlayVideo(playerId, true);
        break;
    }

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      if (evt.keyCode === 27) {
        closeVideo(playerId);
      }
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.videoBackground).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($player) {
    var $slide = $player.closest('.' + classes.slide);
    // Ignore cloned slides
    if ($slide.hasClass(classes.slickClone)) {
      return;
    }
    var slideWidth = $slide.width();
    var playerWidth = $player.width();
    var playerHeight = $player.height();

    // when screen aspect ratio differs from video, video must center and underlay one dimension
    if (slideWidth / videoOptions.ratio < playerHeight) {
      playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
      $player
        .width(playerWidth)
        .height(playerHeight)
        .css({
          left: (slideWidth - playerWidth) / 2,
          top: 0
        }); // player width is greater, offset left; reset top
    } else {
      // new video width < window width (gap to right)
      playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
      $player
        .width(slideWidth)
        .height(playerHeight)
        .css({
          left: 0,
          top: (playerHeight - playerHeight) / 2
        }); // player height is greater, offset top; reset left
    }

    $player.prepareTransition().addClass(classes.loaded);
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background-chrome to a chrome-only player once played
    $('#' + playerId)
      .removeAttr('style')
      .removeClass(classes.videoBackground)
      .addClass(classes.videoChrome);

    videos[playerId].$parentSlideshowWrapper
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].$parentSlide
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    // Switch back to background-chrome when closed
    var $player = $('#' + playerId)
      .addClass(classes.videoBackground)
      .removeClass(classes.videoChrome);

    videos[playerId].$parentSlide.addClass(classes.slideBackgroundVideo);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($player);
  }

  function initEvents() {
    $(document).on('click.videoPlayer', '.' + classes.playVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', '.' + classes.closeVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      closeVideo(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on(
      'resize.videoPlayer',
      $.debounce(250, function() {
        if (youtubeLoaded) {
          sizeBackgroundVideos();
        }
      })
    );
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  return {
    init: init,
    loadVideos: loadVideos,
    loadVideo: loadVideo,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();


/* ================ TEMPLATES ================ */
(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });
})();

window.theme = theme || {};

theme.customerTemplates = (function() {
  function initEventListeners() {
    // Show reset password form
    $('#RecoverPassword').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });

    // Hide reset password form
    $('#HideRecoverPasswordLink').on('click', function(evt) {
      evt.preventDefault();
      toggleRecoverPasswordForm();
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $('#AddressNewForm');

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        'AddressCountryNew',
        'AddressProvinceNew',
        {
          hideElement: 'AddressProvinceContainerNew'
        }
      );
    }

    // Initialize each edit form's country/province selector
    $('.address-country-option').each(function() {
      var formId = $(this).data('form-id');
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });

    // Toggle new/edit address forms
    $('.address-new-toggle').on('click', function() {
      $newAddressForm.toggleClass('hide');
    });

    $('.address-edit-toggle').on('click', function() {
      var formId = $(this).data('form-id');
      $('#EditAddress_' + formId).toggleClass('hide');
    });

    $('.address-delete').on('click', function() {
      var $el = $(this);
      var formId = $el.data('form-id');
      var confirmMessage = $el.data('confirm-message');

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || 'Are you sure you wish to delete this address?'
        )
      ) {
        Shopify.postLink('/account/addresses/' + formId, {
          parameters: { _method: 'delete' }
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  return {
    init: function() {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
    }
  };
})();


/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function() {
  var selectors = {
    edit: '.js-edit-toggle'
  };
  var config = {
    showClass: 'cart__update--show',
    showEditClass: 'cart__edit--active',
    cartNoCookies: 'cart--no-cookies'
  };

  function Cart(container) {
    this.$container = $(container);
    this.$edit = $(selectors.edit, this.$container);

    if (!this.cookiesEnabled()) {
      this.$container.addClass(config.cartNoCookies);
    }

    this.$edit.on('click', this._onEditClick.bind(this));
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      this.$edit.off('click', this._onEditClick);
    },

    _onEditClick: function(evt) {
      var $evtTarget = $(evt.target);
      var $updateLine = $('.' + $evtTarget.data('target'));

      $evtTarget.toggleClass(config.showEditClass);
      $updateLine.toggleClass(config.showClass);
    },

    cookiesEnabled: function() {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;
      }
      return cookieEnabled;
    }
  });

  return Cart;
})();

window.theme = window.theme || {};

theme.Filters = (function() {
  var constants = {
    SORT_BY: 'sort_by'
  };
  var selectors = {
    filterSelection: '#SortTags',
    sortSelection: '#SortBy',
    defaultSort: '#DefaultSortBy'
  };

  function Filters(container) {
    var $container = (this.$container = $(container));

    this.$filterSelect = $(selectors.filterSelection, $container);
    this.$sortSelect = $(selectors.sortSelection, $container);
    this.$selects = $(selectors.filterSelection, $container).add(
      $(selectors.sortSelection, $container)
    );

    this.defaultSort = this._getDefaultSortValue();
    this._resizeSelect(this.$selects);
    this.$selects.removeClass('hidden');

    this.$filterSelect.on('change', this._onFilterChange.bind(this));
    this.$sortSelect.on('change', this._onSortChange.bind(this));
  }

  Filters.prototype = _.assignIn({}, Filters.prototype, {
    _onSortChange: function(evt) {
      var sort = this._sortValue();
      if (sort.length) {
        window.location.search = sort;
      } else {
        // clean up our url if the sort value is blank for default
        window.location.href = window.location.href.replace(
          window.location.search,
          ''
        );
      }
      this._resizeSelect($(evt.target));
    },

    _onFilterChange: function(evt) {
      var filter = this._getFilterValue();

      // remove the 'page' parameter to go to the first page of results
      var search = document.location.search.replace(/\?(page=\w+)?&?/, '');

      // only add the search parameters to the url if they exist
      search = search !== '' ? '?' + search : '';

      document.location.href = filter + search;
      this._resizeSelect($(evt.target));
    },

    _getFilterValue: function() {
      return this.$filterSelect.val();
    },

    _getSortValue: function() {
      return this.$sortSelect.val() || this.defaultSort;
    },

    _getDefaultSortValue: function() {
      return $(selectors.defaultSort, this.$container).val();
    },

    _sortValue: function() {
      var sort = this._getSortValue();
      var query = '';

      if (sort !== this.defaultSort) {
        query = constants.SORT_BY + '=' + sort;
      }

      return query;
    },

    _resizeSelect: function($selection) {
      $selection.each(function() {
        var $this = $(this);
        var arrowWidth = 10;
        // create test element
        var text = $this.find('option:selected').text();
        var $test = $('<span>').html(text);

        // add to body, get width, and get out
        $test.appendTo('body');
        var width = $test.width();
        $test.remove();

        // set select width
        $this.width(width + arrowWidth);
      });
    },

    onUnload: function() {
      this.$filterSelect.off('change', this._onFilterChange);
      this.$sortSelect.off('change', this._onSortChange);
    }
  });

  return Filters;
})();

window.theme = window.theme || {};

theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    theme.MobileNav.init();
    theme.Search.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  });

  return Header;
})();

theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];

  var errors = {
    addressNoResults: theme.strings.addressNoResults,
    addressQueryLimit: theme.strings.addressQueryLimit,
    addressError: theme.strings.addressError,
    authError: theme.strings.authError
  };

  var selectors = {
    section: '[data-section-type="map"]',
    map: '[data-map]',
    mapOverlay: '[data-map-overlay]'
  };

  var classes = {
    mapError: 'map-section--load-error',
    errorMsg: 'map-section__error errors text-center'
  };

  // Global function called by Google on auth errors.
  // Show an auto error message on all map instances.
  // eslint-disable-next-line camelcase, no-unused-vars
  window.gm_authFailure = function() {
    if (!Shopify.designMode) {
      return;
    }

    $(selectors.section).addClass(classes.mapError);
    $(selectors.map).remove();
    $(selectors.mapOverlay).after(
      '<div class="' +
        classes.errorMsg +
        '">' +
        theme.strings.authError +
        '</div>'
    );
  };

  function Map(container) {
    this.$container = $(container);
    this.$map = this.$container.find(selectors.map);
    this.key = this.$map.data('api-key');

    if (typeof this.key === 'undefined') {
      return;
    }

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + this.key
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$map;

      return geolocate($map)
        .then(
          function(results) {
            var mapOptions = {
              zoom: config.zoom,
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: map.getCenter()
            });

            google.maps.event.addDomListener(
              window,
              'resize',
              $.debounce(250, function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                $map.removeAttr('style');
              })
            );
          }.bind(this)
        )
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = errors.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = errors.addressQueryLimit;
              break;
            case 'REQUEST_DENIED':
              errorMessage = errors.authError;
              break;
            default:
              errorMessage = errors.addressError;
              break;
          }

          // Show errors only to merchant in the editor.
          if (Shopify.designMode) {
            $map
              .parent()
              .addClass(classes.mapError)
              .html(
                '<div class="' +
                  classes.errorMsg +
                  '">' +
                  errorMessage +
                  '</div>'
              );
          }
        });
    },

    onUnload: function() {
      if (this.$map.length === 0) {
        return;
      }
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();

/* eslint-disable no-new */
theme.Product = (function() {
  function Product(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');

    this.settings = {
      // Breakpoints from src/stylesheets/global/variables.scss.liquid
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      mediaQuerySmall: 'screen and (max-width: 749px)',
      bpSmall: false,
      enableHistoryState: $container.data('enable-history-state') || false,
      namespace: '.slideshow-' + sectionId,
      sectionId: sectionId,
      sliderActive: false,
      zoomEnabled: false
    };

    this.selectors = {
      addToCart: '#AddToCart-' + sectionId,
      addToCartText: '#AddToCartText-' + sectionId,
      comparePrice: '#ComparePrice-' + sectionId,
      originalPrice: '#ProductPrice-' + sectionId,
      SKU: '.variant-sku',
      originalPriceWrapper: '.product-price__price-' + sectionId,
      originalSelectorId: '#ProductSelect-' + sectionId,
      productImageWraps: '.product-single__photo',
      productPrices: '.product-single__price-' + sectionId,
      productThumbImages: '.product-single__thumbnail--' + sectionId,
      productThumbs: '.product-single__thumbnails-' + sectionId,
      saleClasses: 'product-price__sale product-price__sale--single',
      saleLabel: '.product-price__sale-label-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId
    };

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      document.getElementById('ProductJson-' + sectionId).innerHTML
    );

    this.settings.zoomEnabled = $(this.selectors.productImageWraps).hasClass(
      'js-zoom-enabled'
    );

    this._initBreakpoints();
    this._stringOverrides();
    this._initVariants();
    this._initImageSwitch();
    this._setActiveThumbnail();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    _stringOverrides: function() {
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },

    _initBreakpoints: function() {
      var self = this;

      enquire.register(this.settings.mediaQuerySmall, {
        match: function() {
          // initialize thumbnail slider on mobile if more than three thumbnails
          if ($(self.selectors.productThumbImages).length > 3) {
            self._initThumbnailSlider();
          }

          // destroy image zooming if enabled
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function() {
              _destroyZoom(this);
            });
          }

          self.settings.bpSmall = true;
        },
        unmatch: function() {
          if (self.settings.sliderActive) {
            self._destroyThumbnailSlider();
          }

          self.settings.bpSmall = false;
        }
      });

      enquire.register(this.settings.mediaQueryMediumUp, {
        match: function() {
          if (self.settings.zoomEnabled) {
            $(self.selectors.productImageWraps).each(function() {
              _enableZoom(this);
            });
          }
        }
      });
    },

    _initVariants: function() {
      var options = {
        
        $container: this.$container,
        enableHistoryState:
          this.$container.data('enable-history-state') || false,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on(
        'variantChange' + this.settings.namespace,
        this._updateAddToCart.bind(this)
      );
     
      this.$container.on(
        'variantImageChange' + this.settings.namespace,
        this._updateImages.bind(this)
      );
      this.$container.on(
        'variantPriceChange' + this.settings.namespace,
        this._updatePrice.bind(this)
      );
      this.$container.on(
        'variantSKUChange' + this.settings.namespace,
        this._updateSKU.bind(this)
      );
    },

    _initImageSwitch: function() {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;

      $(this.selectors.productThumbImages).on('click', function(evt) {
        evt.preventDefault();
        var $el = $(this);

        var imageId = $el.data('thumbnail-id');

        self._switchImage(imageId);
        self._setActiveThumbnail(imageId);
      });
    },

    _setActiveThumbnail: function(imageId) {
      var activeClass = 'active-thumb';

      // If there is no element passed, find it by the current product image
      if (typeof imageId === 'undefined') {
        imageId = $(this.selectors.productImageWraps + ":not('.hide')").data(
          'image-id'
        );
      }

      var $thumbnail = $(
        this.selectors.productThumbImages +
          "[data-thumbnail-id='" +
          imageId +
          "']"
      );
      $(this.selectors.productThumbImages).removeClass(activeClass);
      $thumbnail.addClass(activeClass);
    },

    _switchImage: function(imageId) {
      var $newImage = $(
        this.selectors.productImageWraps + "[data-image-id='" + imageId + "']",
        this.$container
      );
      var $otherImages = $(
        this.selectors.productImageWraps +
          ":not([data-image-id='" +
          imageId +
          "'])",
        this.$container
      );
      $newImage.removeClass('hide');
      $otherImages.addClass('hide');
    },

    _initThumbnailSlider: function() {
      var options = {
        slidesToShow: 4,
        slidesToScroll: 3,
        infinite: false,
        prevArrow: '.thumbnails-slider__prev--' + this.settings.sectionId,
        nextArrow: '.thumbnails-slider__next--' + this.settings.sectionId,
        responsive: [
          {
            breakpoint: 321,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      };

      $(this.selectors.productThumbs).slick(options);
      this.settings.sliderActive = true;
    },

    _destroyThumbnailSlider: function() {
      $(this.selectors.productThumbs).slick('unslick');
      this.settings.sliderActive = false;
    },

    _updateAddToCart: function(evt) {
      var variant = evt.variant;
      console.log(variant);
      console.log("*****??");
      if (variant) {
        if (variant.available) {
          console.log('available');
          $(this.selectors.addToCart).prop('disabled', false);
          //$(this.selectors.addToCartText).text(theme.strings.addToCart);
          $(this.selectors.addToCartText).text("Add to cart");          
          $('.email_popup').hide();
          $(this.selectors.addToCart).removeClass('soldout_btn');
        } else {
          var $this = this;
          var i = 0;
          var flag = 'false';
          $('.prod_tags_list > span').each(function(){
            //console.log("Backorder:"+$(this).text().indexOf('backorder'));
            if($(this).text().indexOf('backorder') != -1){
			  setTimeout(function(){ 
              if($('form').find('.pre_order_instruction').length > 0){
                $('.pre_order_instruction').each(function(){                  
                  if($(this).css('display') != 'none')
                  {
                    flag = 'true';
                    return false;
                  }else{
                    flag = 'false';
                  }
                });
              }
             }, 500);
              if(flag == 'true'){
              	$($this.selectors.addToCartText).text('BACK-ORDER NOW');
                var backtag = $(".back_order_tag").html();
				$($this.selectors.addToCartText).text(backtag);
              }
              else{
                $($this.selectors.addToCartText).text(theme.strings.soldOut);
              }              
              i = 1;
            }
            else{
              if(i == 0)
              {
                $($this.selectors.addToCartText).text(theme.strings.soldOut);
              }
            }
          });
          // The variant doesn't exist, disable submit button and change the text.
          // This may be an error or notice that a specific variant is not available.
          $(this.selectors.addToCart).prop('disabled', true);
          $(this.selectors.addToCart).addClass('soldout_btn');
         // $(this.selectors.addToCartText).text(theme.strings.soldOut);
          $('.email_popup').show();
          $('.bis-reset').trigger('click');
        }
      } else {
        setTimeout(function(){     
        variantShow();
        }
        , 1000);
        
		// $(this.selectors.addToCart).prop('disabled', true);
		//$(this.selectors.addToCartText).text('Add to cart');        
        //$(this.selectors.addToCartText).text('Select A Size');
        $('.email_popup').hide();
         /*$(this.selectors.productPrices)
           .addClass('hide')
           .attr('aria-hidden', 'false');*/
      }
    },

    _updateImages: function(evt) {
      var variant = evt.variant;
      var imageId = variant.featured_image.id;

      this._switchImage(imageId);
      this._setActiveThumbnail(imageId);
    },

    _updatePrice: function(evt) {
      var variant = evt.variant;

      // Update the product price
      $(this.selectors.originalPrice).html(
        theme.Currency.formatMoney(variant.price, theme.moneyFormat)
      );

      // Update and show the product's compare price if necessary
      if (variant.compare_at_price > variant.price) {
        $(this.selectors.comparePrice)
          .html(
            theme.Currency.formatMoney(
              variant.compare_at_price,
              theme.moneyFormat
            )
          )
          .removeClass('hide');

        $(this.selectors.originalPriceWrapper).addClass(
          this.selectors.saleClasses
        );

        $(this.selectors.saleLabel).removeClass('hide');
      } else {
        $(this.selectors.comparePrice).addClass('hide');
        $(this.selectors.saleLabel).addClass('hide');
        $(this.selectors.originalPriceWrapper).removeClass(
          this.selectors.saleClasses
        );
      }
    },

    _updateSKU: function(evt) {
      var variant = evt.variant;

      // Update the sku
      $(this.selectors.SKU).html(variant.sku);
    },

    onUnload: function() {
      this.$container.off(this.settings.namespace);
    }
  });

  function _enableZoom(el) {
    var zoomUrl = $(el).data('zoom');
    $(el).zoom({
      url: zoomUrl
    });
  }

  function _destroyZoom(el) {
    $(el).trigger('zoom.destroy');
  }

  return Product;
})();

theme.Quotes = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideCount: 0
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    dots: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  function Quotes(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.quotes-wrapper');
    var slider = (this.slider = '#Quotes-' + sectionId);
    var $slider = $(slider, wrapper);

    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();

theme.slideshows = {};

theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    $('.slideshow__video', slideshow).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return SlideshowSection;
})();

theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume autoplay
      $(this.slideshow).slick('slickPlay');
    }
  }
);


$(document).ready(function() {
  $('.drawer-shipping').slideToggle();
  var sections = new theme.Sections();

  sections.register('cart-template', theme.Cart);
  sections.register('product', theme.Product);
  sections.register('collection-template', theme.Filters);
  sections.register('product-template', theme.Product);
  sections.register('header-section', theme.HeaderSection);
  sections.register('map', theme.Maps);
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('quotes', theme.Quotes);

  //load_collection();
  $('.shipping_country').val('Australia').trigger('change');

});

theme.init = function() {
  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on('click', function(evt) {
    evt.preventDefault();
  });
};

$(theme.init);

$('.calculate-title').on('click',function(){
  $(this).toggleClass('active');
  $('.drawer-shipping').slideToggle();
});

$('.shipping_country').on('change',function(){
  $('.shipping_calculate').removeAttr('disabled');
  $('.shipping_calculate').html("Calculate");
  var e = $("option:selected", $(this)).data("provinces");
  if(e != undefined && e != ''){
    $(this).parents('.shipping_calculator').find('.shipping_country_province').parents('.form-group').show();
    $(this).parents('.shipping_calculator').find('.shipping_country_province').find("option").remove().end();
    for (var t in e) $("<option></option>", {
      value: e[t][0],
      text: e[t][1]
    }).appendTo($(this).parents('.shipping_calculator').find('.shipping_country_province'));
  }else{
    $(this).parents('.shipping_calculator').find('.shipping_country_province').parents('.form-group').hide();
  }
});

$('.shipping_country_province').on('change',function(){
  $('.shipping_calculate').removeAttr('disabled');
  $('.shipping_calculate').html("Calculate");
});

$('.shipping_zip').on('click',function(){
  $('.shipping_calculate').removeAttr('disabled');
  $('.shipping_calculate').html("Calculate");
});

$('#ShippingAddToCart').on("click", function(){
    $('#AddToCart-product-template').click();
});
$('#frm_shipping_calculator').on('submit',function(){
  $('.shipping_calculate').click();
});

$('.shipping_calculate').on('click',function(){
  console.log("8888888888");
  $('#ShippingAddToCart').hide();
  $('.shipping_calculate').attr('disabled','disabled');
  $(this).html('<i class="fa fa-refresh fa-spin"></i>');
  var el = $(this);
  var r = {
    "shipping_address[zip]": $(this).parents('.shipping_calculator').find('.zip_code ').val(),
    "shipping_address[country]": $(this).parents('.shipping_calculator').find('.shipping_country').val(),
    "shipping_address[province]": $(this).parents('.shipping_calculator').find('.shipping_country_province').val()
  }; console.log(r);
  $(this).parents('.shipping_calculator').find('.shipping_loader').html(""), $(this).parents('.shipping_calculator').find('.shipping_loader').removeClass("hide"), $.getJSON("/cart/shipping_rates.json", r).done(function(e) {
    el.parents('.shipping_calculator').find('.shipping_loader').addClass("hide");
    var t = "";
    for (var n in e.shipping_rates) {
      var i = e.shipping_rates[n];
      t += '<ul class="product-free-shipping-action"><li><span class="col-md-9 shipping_method">' + i.name + "</span>", t += "<strong>$" + i.price + "</strong>", null !== i.description && (t += '<span class="description">' + i.description + "</span>"), t += "</li></ul>"
    }
    $('.shipping_calculate').html("Calculate");
    if(t != "")
    {
      $('#ShippingAddToCart').show();
    }
    $('.shipping_calculate').removeAttr('disabled');
    $('.shipping_calculate').html("Calculate");
    el.parents('.shipping_calculator').find('.shipping_methods').html(t)
    $(".shipping-checkout").show();
  }).fail(function(e, t, n) {
    var i = "Sorry, something went wrong!!";
    if (422 === e.status) {
      i = "";
      for (var o in e.responseJSON) e.responseJSON.hasOwnProperty(o) && (i += ("zip" == o ? "Post Code" : o) + " " + e.responseJSON[o] + "<br/>")
        }
    $('.shipping_calculate').html("Calculate");
    $('.shipping_calculate').removeAttr('disabled');
    $('.shipping_calculate').html("Calculate");
    $('#ShippingAddToCart').hide();
    el.parents('.shipping_calculator').find('.shipping_loader').addClass("hide"), el.parents('.shipping_calculator').find('.shipping_methods').html('<span class="error_text">' + i + "</span>")
    $(".shipping-checkout").hide();
  })  
});

function change($obj) {
      var $sel = $obj.parent("form");
  	  var selector = $sel.find(".product-sel__final").attr("id");
  	  var arr_variants = [];
      for(var i=1; i<=$sel.find(".selector-wrapper-all").length; i++)
      {
        if($sel.find(".wrapper-"+i+" .selected-color").length !== 0) {
           arr_variants.push($sel.find(".wrapper-"+i+" .selected-color").attr("value"));
         }
         else
         {
           arr_variants.push($sel.find(".wrapper-"+i+" .selected-size").attr("value"));
         }
      }
  	  var sel_variants = arr_variants.join(" / ");


  	  $("#" + selector + " option").each(function() {
        console.log(this);
        $(this).removeAttr('selected');
        if(sel_variants == $(this).attr("title"))
        {
          $(this).attr('selected', 'selected');
          var value = $(this).attr('value');
          $('#'+selector).val(value);
        }
      });


  	  /*var $color = $sel.find(".selector-wrapper-color");
      var col_value = $color.find(".selected-color").attr("value");
      var $size = $sel.find(".selector-wrapper-all");

      var siz_value = $size.find(".selected-size").attr("value");
      var str1 = col_value + " / " + siz_value;
      var str2 = siz_value + " / " + col_value;
      var selector = $sel.find(".product-sel__final").attr("id");

      $("#" + selector + " option").each(function() {
        $(this).removeAttr('selected');
        if(siz_value == $(this).attr("title") || $(this).attr("title") == col_value)
          {
            $(this).attr('selected', 'selected');
            var value = $(this).attr('value');
            $('#'+selector).val(value);
          }
          else
          {
            if(($(this).attr("title") == str1) || ($(this).attr("title") == str2)) {
              $(this).attr('selected', 'selected');
              var value = $(this).attr('value');
              $('#'+selector).val(value);
            }
          }
      }); */
    }



function load_collection(){

$('.grid-view-item').hover(function(){
    $(this).find('.quick-shop-form').show();
  }, function(){
    $(this).find('.quick-shop-form').hide();
  });

  $(".grid-view-item .quick-shop-form .quick_title").click(function(){
    var $obj = $(this).parent(".quick-shop-form");
    $obj.addClass("click-quick-form");
  });

  $(document).on('click',".selector-wrapper-all .enabled-option",function(e){
    

      var $obj = $(this).parent(".selector-wrapper-all");
      if(!$(this).hasClass("selected-size")){
        $obj.find(".selected-size").removeClass("selected-size");
        $(this).addClass("selected-size");
      }
      var val = $obj.find(".selected-size").attr("value");
      change($obj);
    });

     $(document).on('click',".selector-wrapper-all .box-option",function(e){
      var $obj = $(this).parent(".selector-wrapper-all");
      if($obj.find(".selected-color").length !== 0 )
      {
        if(!$(this).hasClass("selected-color")){
          $obj.find(".selected-color").removeClass("selected-color");
          $(this).addClass("selected-color");
        }
      }
      else
      {
        if(!$(this).hasClass("selected-size")){
          $obj.find(".selected-size").removeClass("selected-size");
          $(this).addClass("selected-size");
        }
      }
      var val = $obj.find(".selected-size").attr("value");
      change($obj);
    });

}
var video = document.getElementById("a-set-myVideo");
  var btn = document.getElementById("a-set-myBtn");

  function myFunction() {
    if (video.paused) {
      video.play();
      btn.innerHTML = "Pause";
    } else {
      video.pause();
      btn.innerHTML = "Play";
    }
  }

if($('.slider-carousel-wrap').hasClass('swiper-container')){
  var swiper = new Swiper('.swiper-container', {
      slidesPerView: 4,
      spaceBetween: 10,

      loop: true,
      loopFillGroupWithBlank: true,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        989: {
          slidesPerView: 3
        },
        749: {
          slidesPerView: 2
        },
        480: {
          slidesPerView: 1

        }
      }
    });
}
if($('.open-slider-carousel-wrap').hasClass('swiper-container')){
var swiper = new Swiper('.open-slider-carousel-wrap', {
      slidesPerView: 2,
      spaceBetween:10,

      loop: true,
      loopFillGroupWithBlank: true,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
  
    });
}
//  page-ring-loader-js--------------------------------

$(document).ajaxSuccess(function(){
    var widthScreen = $(window).width();
    if(widthScreen <= 768 ){
      var widthdive = ($(window).width() - 10) / 2;
      var widthdive1 =  -($(window).width() - 20) / 2;
      var translate1 = 'translate3d('+widthdive1+'px, 0px, 0px)';
      $('#product-recommendation .bkt--products-vertical').css("width",widthdive);
      $('#product-recommendation .bkt--prec--layout1_slider.bkt--prec--layout_slider').css("transform",translate1);
      $('#product-recommendation .bx-has-controls-direction .bx-next').trigger("click");

    }
    $( window ).resize(function() {

      var widthScreen1 = $(window).width();
      if(widthScreen1 <= 768 ){
        var widthdive = ($(window).width() - 10) / 2;
        var widthdive1 =  -($(window).width() - 20) / 2;
        var translate1 = 'translate3d('+widthdive1+'px, 0px, 0px)';
        $('#product-recommendation .bkt--products-vertical').css("width",widthdive);
        $('#product-recommendation .bkt--prec--layout1_slider.bkt--prec--layout_slider').css("transform",translate1);
        $('#product-recommendation .bx-has-controls-direction .bx-next').trigger("click");

      }
    });
  });


/*=====================================================
JS from footer.liquid
=======================================================*/
$(document).ready(function(){
   $(".search-header").click(function(){
     var obj = $(".header-search-section");
     if(obj.hasClass("search--focus-custom-eve")) {
       obj.removeClass("search--focus-custom-eve");
     }else {
       obj.addClass("search--focus-custom-eve");
     }
   });

   $(".site-mega-menu-sec-main .mega-menu-parent-lists li").click(function(){

     $(".site-mega-menu-sec-main .mega-menu-parent-lists .nav--active").removeClass("nav--active");
     $(this).addClass("nav--active");

     var id = $(this).attr("data-id");
     $(".site-mega-menu-sec-main .mega-menu-sub-area .site-mega-menu-lists").removeClass("active");
     $("#" + id).addClass("active");
   });

   $(".site-mega-menu-sec-sticky .mega-menu-parent-lists li").click(function(){

     $(".site-mega-menu-sec-sticky .mega-menu-parent-lists .nav--active").removeClass("nav--active");
     $(this).addClass("nav--active");

     var id = $(this).attr("data-id");
     $(".site-mega-menu-sec-sticky .mega-menu-sub-area .site-mega-menu-lists").removeClass("active");
     $("#" + id).addClass("active");
   });

   $(".seach-header-items").click(function(){
     $(".quick-search-sections").show();
     $(".quick-search-sections #header-quick-search .search-header__input-custom").focus();
     $(".quick-search-sections #header-quick-search .search-header__input-custom").addClass('ttt');
   });

   $(".quick-search-sections .close-search").click(function(){
     $(".quick-search-sections").hide();
   });

    $(".header-search-section-desktop form").focusin(function(){
      var obj = $(this).parent();
      $(this).addClass("overlay-show");
      obj.find(".headerSearch_overlay").addClass("headerSearch_overlay-show");
    });

    $(".header-search-section-desktop form").focusout(function(){
      var obj = $(this).parent();
      $(this).removeClass("overlay-show");
      obj.find(".headerSearch_overlay").removeClass("headerSearch_overlay-show");
    });

   var pos = 0;

   $(window).scroll(function(){
     var scrollPos = $(document).scrollTop();

     if($(".announcement-bar").length) {
       var off = $(".announcement-bar").offset();
     }else {
       var off = 0;
     }

     off = off.top + 34 + 68;

     var $mob = $("nav.mobile-nav-wrapper");

     if(pos > scrollPos) {
       if(scrollPos < 171) {

         if($(".sticky-menu").hasClass("active-sticky")) {
            $(".sticky-menu").removeClass("active-sticky");
         }
       }
     }else {
       if(scrollPos > 171) {
         if(!$(".sticky-menu").hasClass("active-sticky")) {
         $(".sticky-menu").addClass("active-sticky");
         }
       }
     }

     if(pos > scrollPos) {
       if(scrollPos < 97) {

         if($(".site-header").hasClass("mobile-sticky-menu")) {
         $(".site-header").removeClass("mobile-sticky-menu");
           $mob.removeClass("active-stc-menu");
         }
       }
     }else {
       if(scrollPos > 97) {

         if(!$(".site-header").hasClass("mobile-sticky-menu")) {
         $(".site-header").addClass("mobile-sticky-menu");
           $mob.addClass("active-stc-menu");
         }
       }
     }


     pos = scrollPos;
   });

   $(".help-section").hover(function(){
     $(this).addClass("active-menu");
   }, function(){
     $(this).removeClass("active-menu");
   });

   $(".has_group_selected").click(function(){
     $(this).removeClass("has_group_selected");
   });

   $(".grid-view-item__image-wrapper .quick-shop-form .quick_title").click(function(){
       var $obj = $(this).parent(".quick-shop-form");
       $obj.addClass("click-quick-form");
     });

   $(".quick-shop-form").hover(function(){

   }, function(){
     $(this).removeClass("click-quick-form");
   });

   var $win = $(".quick-shop-form");
   var $title = $(".quick_title");
   var $box = $(".box-option");
   var $log = $(".product-form__cart-submit");

   $win.on("click.Bst", function(event){
     if ( $box.has(event.target).length == 0 && !$box.is(event.target) ){
         if ( $title.has(event.target).length == 0 && !$title.is(event.target) ){
           $win.removeClass("click-quick-form");
         }else {

         }
       }else {

         if ( $log.has(event.target).length == 0 && !$log.is(event.target) ){

         }else {

         }

       }
   });

   $(".grid--table-first .site-header__account").hover(function(){
     $(".grid--table-first .site-header__account .sub-header__account").addClass("active");
   }, function(){
     $(".grid--table-first .site-header__account .sub-header__account").removeClass("active");
   });

   $(".store-sections .store-selected").click(function(){
     if($(".store-sections").hasClass("active")) {
       $(".store-sections").removeClass("active");
     }else {
       $(".store-sections").addClass("active");
     }
   });

   var height = $( window ).height();
   var ele_height = height - 425;
   $(".body-search-footer").css("margin-top", ele_height + "px");

   $(".btn_to_login").click(function(){
     $(".btn-create-btn").hide();
     $("#CustomerRegisterForm").show();
     $("#CustomerLoginForm").hide();
     $("#RecoverPasswordForm").hide();
   });

   $("#shopify-section-footer .grid__item-listd .footer-title").click(function(){
     var $parent = $(this).parent();

     if($parent.hasClass("added-menu")) {

       $parent.removeClass("added-menu");

     }else {

       $("#shopify-section-footer .grid__item-listd").removeClass("added-menu");
       $parent.addClass("added-menu");

     }

   });

   $(".site-header #SiteNav .site-nave-parent.site-nav--has-dropdown").hover(function(){

     $(".site-header #SiteNav").addClass("hovering");
   }, function(){

     $(".site-header #SiteNav").removeClass("hovering");
   });

   $(".sticky-menu #SiteNav .site-nave-parent.site-nav--has-dropdown").hover(function(){

     $(".sticky-menu #SiteNav").addClass("hovering");
   }, function(){

     $(".sticky-menu #SiteNav").removeClass("hovering");
   });

   $(".close-anno-bar").click(function(){
      var headerHeight = $('.site-header').outerHeight() - $('.announcement-bar_open').outerHeight();
    $('.page-container').css("padding-top", headerHeight);
     $(".announcement-bar").hide();
     $(".close-anno-bar").hide();
   });

   $("ul._faq>ul>li").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("active")) {

       $("ul._faq li").each(function(){
         $(this).removeClass("active");
       });

       $(".ul._faq>ul ul").each(function(){
         $(this).removeClass("active-panel");
       });

     }else {

       $("ul._faq li").each(function(){
         $(this).removeClass("active");
       });

       $("ul._faq>ul ul").each(function(){
         $(this).removeClass("active-panel");
       });

       elem.addClass("active");
       elem.next().addClass("active-panel");

     }

   });

   $("ul._faq>li").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("faq-active")) {

       $(".faq-active").each(function(){
         $(this).removeClass("faq-active");
       });

       $(".faq-panel").each(function(){
         $(this).removeClass("faq-panel");
       });

     }else {

       $(".faq-active").each(function(){
         $(this).removeClass("faq-active");
       });

       $(".faq-panel").each(function(){
         $(this).removeClass("faq-panel");
       });

       elem.addClass("faq-active");
       elem.next().addClass("faq-panel");

     }

   });

   $(".help-page-template .shipping-template>h2").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("shipping-active")) {

       $(".help-page-template .shipping-active").each(function(){
         $(this).removeClass("shipping-active");
       });

       $(".help-page-template .shipping-panel").each(function(){
         $(this).removeClass("shipping-panel");
       });

     }else {

       $(".help-page-template .shipping-active").each(function(){
         $(this).removeClass("shipping-active");
       });

       $(".help-page-template .shipping-panel").each(function(){
         $(this).removeClass("shipping-panel");
       });

       elem.addClass("shipping-active");
       elem.next().addClass("shipping-panel");

     }

   });
  
  
     $(".christmas-shipping .christmas-template>h2").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("shipping-active")) {

       $(".christmas-shipping .shipping-active").each(function(){
         $(this).removeClass("shipping-active");
       });

       $(".christmas-shipping .shipping-panel").each(function(){
         $(this).removeClass("shipping-panel");
       });

     }else {

       $(".christmas-shipping .shipping-active").each(function(){
         $(this).removeClass("shipping-active");
       });

       $(".christmas-shipping .shipping-panel").each(function(){
         $(this).removeClass("shipping-panel");
       });

       elem.addClass("shipping-active");
       elem.next().addClass("shipping-panel");

     }

   });

     $(".christmas-shipping .christmas-template .christmas>h2").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("panel-active")) {

       $(".christmas-shipping .panel-active").each(function(){
         $(this).removeClass("panel-active");
       });

       $(".christmas-shipping .christmas-panel").each(function(){
         $(this).removeClass("christmas-panel");
       });

     }else {

       $(".christmas-shipping .panel-active").each(function(){
         $(this).removeClass("panel-active");
       });

       $(".christmas-shipping .christmas-panel").each(function(){
         $(this).removeClass("christmas-panel");
       });

       elem.addClass("panel-active");
       elem.next().addClass("christmas-panel");

     }

   });
  
   $(".help-page-template .return-contents>h2").click(function(){

     var elem = jQuery(this);

     if(elem.hasClass("return-active")) {

       $(".help-page-template .return-active").each(function(){
         $(this).removeClass("return-active");
       });

       $(".help-page-template .return-panel").each(function(){
         $(this).removeClass("return-panel");
       });

     }else {

       $(".help-page-template .return-active").each(function(){
         $(this).removeClass("return-active");
       });

       $(".help-page-template .return-panel").each(function(){
         $(this).removeClass("return-panel");
       });

       elem.addClass("return-active");
       elem.next().addClass("return-panel");

     }

   });

   $(".product-descrp a").each(function(){
     var target = $(this).children();

     if(target.is("img")) {
       $(this).addClass("not-border");
     }
   });

   $(document).on('click', '.slider-footer-section .calculate-title', function(){

     var ele = $(this).parent();
     if(ele.hasClass('active')){
       ele.removeClass('active');
     }else {
       ele.addClass('active');
     }
   });

   $(".chat-btn").click(function() {
     if (window.zE) {
       window.zE.activate();
     }
   });

   $(document).on('click', '.product-free-shipping-action li span:first-child', function(){
     if($(this).hasClass("active-method")) {
       $(this).removeClass("active-method");
     }else {
       $(".product-free-shipping-action .active-method").removeClass("active-method");
       $(this).addClass("active-method");
     }
   });

   document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

   /*================================================================
   slick in slider-cart.liquid
   ==================================================================*/
   custom_reChargeGetCookie('cart')
   function custom_reChargeGetCookie(name) {
     return (document.cookie.match('(^|; )' + name + '=([^;]*)')||0)[2];
   }
   $(".cart-slider-close").click(function(){
     $("#slider_cart-sec").removeClass("slider-cart-open");
     $("#slider_cart-sec").addClass("slider-cart-close");
     setTimeout(function(){
       $(".slider-cart-overlay").hide();
     }, 500);
   });

   $(".slider-cart-overlay").click(function(){
     $("#slider_cart-sec").removeClass("slider-cart-open");
     $("#slider_cart-sec").addClass("slider-cart-close");
     setTimeout(function(){
       $(".slider-cart-overlay").hide();
     }, 500);
   });

   $(".site-header__cart").click(function(e){
     e.preventDefault();

     $("#slider_cart-sec").addClass("slider-cart-open");
     $("#slider_cart-sec").removeClass("slider-cart-close");
     $(".slider-cart-overlay").show();

     window.viselyCartProductIds = window.viselyCartProductIds || $('[data-visely-recommendation-type=POPUP_CART_FREQUENTLY_BOUGHT_TOGETHER]').data('visely-frequently-bought-together');
     if (window.viselyCartProductIds) {
     document.dispatchEvent( new CustomEvent('viselyWidgetInit', {
       detail: { 
         widgetType: 'POPUP_CART_FREQUENTLY_BOUGHT_TOGETHER',
         render: true,
         productIds: window.viselyCartProductIds
       }}));
     } else {
       document.dispatchEvent( new CustomEvent('viselyWidgetInit', {
         detail: { 
           widgetType: 'POPUP_CART_TRENDING_NOW',
           render: true
         }}));
     }
   });

   $(document).on("click",".btn-checkout-btn",function() {
     $(".btn-checkout-slider").click();
     $(this).addClass("clicked");
   });

   $(".slider-footer-section .calculate-title").click(function(){
     var $body = $(".slider-footer-section");
     if($body.hasClass("active-footer")) {
       $body.removeClass("active-footer");
     }else {
       $body.addClass("active-footer");
     }
   });

   $(".cartslider").slick({
     dots: false,
     infinite: true,
     autoplay:true,
     autoplaySpeed:2500,
     initialSlide: 0,
     slidesToShow: 2,
     slidesToScroll: 1
   });
});

$(document).on("click",".next_btn",function(event) {
  event.preventDefault();  
  if ($('#ispbxii_4').val() == '') {
    return false;
  }
  else {
    $(".chkbtn").click();  
  }
  
//   if (localStorage.getItem('storedDiscount')){   
//     var discountStored = localStorage.getItem('storedDiscount');   
//     $('input[name="discount"]').val(localStorage.getItem('storedDiscount'));     
//   }  
//   var $discountCode = $('input[name="discount"]').val(); 
//   localStorage.setItem('storedDiscount', $discountCode);   
  // return false;  
  //$(".cart-desktop").submit();
  //$(".cart-desktop")[0].submit();       
});

$(document).ready(function() {
  if( typeof(productOptions ) != "undefined" ){
    for(i=0;i<productOptions.length;i++) {
      $('.single-option-selector.variant-option:eq('+ i +')')
      .filter(function() {
        return $(this).find('option').length > 1
      })
      .prepend('<option value="">Choose an option...</option>')
      .val('')
      .trigger('change');
    }
    //.prepend('<option value="">Pick a ' + productOptions[i][i].toLowerCase() + '</option>')    
  }
});

setInterval(function(){   
  	if ($('iframe').length > 0) {
    //  console.log($('iframe').contents().find('body').children().length);  
      if($('iframe').contents().find('body').children().length > 0){
        //setTimeout(function(){
          $(".zippay-or").show();
          if($(".cart-item-list").length > 0)
          {
              $(".zippay-sidebar-or").show();
          }
       // }, 500);
      } 
    }
}
, 500);

$('.single-option-selector').on('change',function(){

});






//   $(document).ready(function(){
//     var variant = "";
//     var str2 = " / ";
//     var selected_data = [];
//      var selected_swatch ;
//     var flag ='true';

//     if($('.color-list-mul').hasClass('selected'))
//     {
//       var selected_swatch = $('.color-list-mul.selected').attr('value');
//     } 

//     $('.color-list-mul').on('click',function(){
//       flag ='flase';
//     });




//     $('.single-option-selector').change(function() {
//       if(flag == 'true')
//       {
       
//         var sel_val = $(this).val();

//         $('.product-form__variants > option').removeAttr('selected');
//         var selected_variant = selected_swatch+str2+sel_val;
//         $(".product-form__variants > option").each(function() {
//           var text = $(this).text();
//           if(text == selected_variant)
//           {
//             //$(this).attr("selected");
//             $(this).attr('selected','selected');

//           }
//         });
//       }
//     });

    
//   });