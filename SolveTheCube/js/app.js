webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaQuery = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default set of media queries
var defaultQueries = {
  'default': 'only screen',
  landscape: 'only screen and (orientation: landscape)',
  portrait: 'only screen and (orientation: portrait)',
  retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 'only screen and (min--moz-device-pixel-ratio: 2),' + 'only screen and (-o-min-device-pixel-ratio: 2/1),' + 'only screen and (min-device-pixel-ratio: 2),' + 'only screen and (min-resolution: 192dpi),' + 'only screen and (min-resolution: 2dppx)'
};

// matchMedia() polyfill - Test a CSS media type/query in JS.
// Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
var matchMedia = window.matchMedia || function () {
  'use strict';

  // For browsers that support matchMedium api such as IE 9 and webkit

  var styleMedia = window.styleMedia || window.media;

  // For those that don't support matchMedium
  if (!styleMedia) {
    var style = document.createElement('style'),
        script = document.getElementsByTagName('script')[0],
        info = null;

    style.type = 'text/css';
    style.id = 'matchmediajs-test';

    script && script.parentNode && script.parentNode.insertBefore(style, script);

    // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
    info = 'getComputedStyle' in window && window.getComputedStyle(style, null) || style.currentStyle;

    styleMedia = {
      matchMedium: function matchMedium(media) {
        var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

        // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
        if (style.styleSheet) {
          style.styleSheet.cssText = text;
        } else {
          style.textContent = text;
        }

        // Test if media query is true or false
        return info.width === '1px';
      }
    };
  }

  return function (media) {
    return {
      matches: styleMedia.matchMedium(media || 'all'),
      media: media || 'all'
    };
  };
}();

var MediaQuery = {
  queries: [],

  current: '',

  /**
   * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
   * @function
   * @private
   */
  _init: function _init() {
    var self = this;
    var $meta = (0, _jquery2.default)('meta.foundation-mq');
    if (!$meta.length) {
      (0, _jquery2.default)('<meta class="foundation-mq">').appendTo(document.head);
    }

    var extractedStyles = (0, _jquery2.default)('.foundation-mq').css('font-family');
    var namedQueries;

    namedQueries = parseStyleToObject(extractedStyles);

    for (var key in namedQueries) {
      if (namedQueries.hasOwnProperty(key)) {
        self.queries.push({
          name: key,
          value: 'only screen and (min-width: ' + namedQueries[key] + ')'
        });
      }
    }

    this.current = this._getCurrentSize();

    this._watcher();
  },


  /**
   * Checks if the screen is at least as wide as a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
   */
  atLeast: function atLeast(size) {
    var query = this.get(size);

    if (query) {
      return matchMedia(query).matches;
    }

    return false;
  },


  /**
   * Checks if the screen matches to a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to check, either 'small only' or 'small'. Omitting 'only' falls back to using atLeast() method.
   * @returns {Boolean} `true` if the breakpoint matches, `false` if it does not.
   */
  is: function is(size) {
    size = size.trim().split(' ');
    if (size.length > 1 && size[1] === 'only') {
      if (size[0] === this._getCurrentSize()) return true;
    } else {
      return this.atLeast(size[0]);
    }
    return false;
  },


  /**
   * Gets the media query of a breakpoint.
   * @function
   * @param {String} size - Name of the breakpoint to get.
   * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
   */
  get: function get(size) {
    for (var i in this.queries) {
      if (this.queries.hasOwnProperty(i)) {
        var query = this.queries[i];
        if (size === query.name) return query.value;
      }
    }

    return null;
  },


  /**
   * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
   * @function
   * @private
   * @returns {String} Name of the current breakpoint.
   */
  _getCurrentSize: function _getCurrentSize() {
    var matched;

    for (var i = 0; i < this.queries.length; i++) {
      var query = this.queries[i];

      if (matchMedia(query.value).matches) {
        matched = query;
      }
    }

    if ((typeof matched === 'undefined' ? 'undefined' : _typeof(matched)) === 'object') {
      return matched.name;
    } else {
      return matched;
    }
  },


  /**
   * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
   * @function
   * @private
   */
  _watcher: function _watcher() {
    var _this = this;

    (0, _jquery2.default)(window).off('resize.zf.mediaquery').on('resize.zf.mediaquery', function () {
      var newSize = _this._getCurrentSize(),
          currentSize = _this.current;

      if (newSize !== currentSize) {
        // Change the current media query
        _this.current = newSize;

        // Broadcast the media query change on the window
        (0, _jquery2.default)(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
      }
    });
  }
};

// Thank you: https://github.com/sindresorhus/query-string
function parseStyleToObject(str) {
  var styleObject = {};

  if (typeof str !== 'string') {
    return styleObject;
  }

  str = str.trim().slice(1, -1); // browsers re-quote string style values

  if (!str) {
    return styleObject;
  }

  styleObject = str.split('&').reduce(function (ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = parts[0];
    var val = parts[1];
    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
    return ret;
  }, {});

  return styleObject;
}

exports.MediaQuery = MediaQuery;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _foundation = __webpack_require__(5);

var _foundationUtil = __webpack_require__(2);

var _fastclick = __webpack_require__(7);

var _fastclick2 = _interopRequireDefault(_fastclick);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(11);

__webpack_require__(13);

__webpack_require__(14);

__webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'foundation-sites/js/foundation.util.box';
// import 'foundation-sites/js/foundation.util.imageLoader';
// import 'foundation-sites/js/foundation.util.keyboard';
_foundation.Foundation.addToJquery($);
// import 'foundation-sites/js/foundation.util.motion';
// import 'foundation-sites/js/foundation.util.nest';
// import 'foundation-sites/js/foundation.util.touch';
// import 'foundation-sites/js/foundation.util.triggers';

// import 'foundation-sites/js/foundation.abide';
// import 'foundation-sites/js/foundation.accordion';
// import 'foundation-sites/js/foundation.accordionMenu';
// import 'foundation-sites/js/foundation.drilldown';
// import 'foundation-sites/js/foundation.dropdown';
// import 'foundation-sites/js/foundation.dropdownMenu';
// import 'foundation-sites/js/foundation.equalizer';
// import 'foundation-sites/js/foundation.interchange';
// import 'foundation-sites/js/foundation.magellan';
// import 'foundation-sites/js/foundation.offcanvas';
// import 'foundation-sites/js/foundation.orbit';
// import 'foundation-sites/js/foundation.responsiveAccordionTabs';
// import 'foundation-sites/js/foundation.responsiveMenu';
// import 'foundation-sites/js/foundation.responsiveToggle';
// import 'foundation-sites/js/foundation.reveal';
// import 'foundation-sites/js/foundation.slider';
// import 'foundation-sites/js/foundation.smoothScroll';
// import 'foundation-sites/js/foundation.sticky';
// import 'foundation-sites/js/foundation.tabs';
// import 'foundation-sites/js/foundation.toggler';
// import 'foundation-sites/js/foundation.tooltip';

_foundation.Foundation.MediaQuery = _foundationUtil.MediaQuery;

$(document).foundation();

// FastClick
if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function () {
		_fastclick2.default.attach(document.body);
	}, false);
}

// Back to top button
var $topbutton = $('#topbutton');
$topbutton.click(function () {
	$('html, body').animate({ scrollTop: 0 }, 'fast');
});

// Hide back to top button at top of document
$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		$topbutton.fadeIn('fast');
	} else {
		$topbutton.fadeOut('fast');
	}
});

window.rachel = window.harry = function () {
	// If you're reading this, type rachel()
	// harry() also works!
	var secrets = window.atob('ICAgICAgIF9fX19fX19fX19fX19fX19fXw0KICAgICAgLyAgICAgLyAgICAgLyAgICAgL3wNCiAgICAgL19fX19fL19fX19fL19fX19fLyB8DQogICAgLyAgICAgLyAgICAgLyAgICAgL3wgfA0KICAgL19fX19fL19fX19fL19fX19fLyB8L3wNCiAgLyAgICAgLyAgICAgLyAgICAgL3wgLyB8DQogL19fX19fL19fX19fL19fX19fLyB8L3wgfA0KfCAgICAgfCAgICAgfCAgICAgfCAgLyB8L3wNCnwgIE0gIHwgIEUgIHwgIFIgIHwgL3wgLyB8DQp8X19fX198X19fX198X19fX198LyB8L3wgfA0KfCAgICAgfCAgICAgfCAgICAgfCAgLyB8Lw0KfCAgMTQgfCAgMDkgfCAgMTQgfCAvfCAvDQp8X19fX198X19fX198X19fX198LyB8Lw0KfCAgUiAgfCAgRSAgfCAgUyAgfCAgLw0KfCAgJiAgfCBIIEIgfA==');
	secrets += decodeURI('%CA%95%E2%80%A2%E1%B4%A5%E2%80%A2%CA%94');
	secrets += atob('fCAvDQp8X19fX198X19fX198X19fX198Lw0KDQpUcnkgc2VsZWN0aW5nIHRleHQgOyk=');

	console.log(secrets);

	var div = $('<div />', {
		html: atob('PHN0eWxlPio6Oi1tb3otc2VsZWN0aW9uIHsgYmFja2dyb3VuZDogI2ZlNTdhMSB9ICo6OnNlbGVjdGlvbiB7IGJhY2tncm91bmQ6ICNmZTU3YTEgfTwvc3R5bGU+')
	}).appendTo('body');
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Foundation = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _foundationUtil = __webpack_require__(6);

var _foundationUtil2 = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOUNDATION_VERSION = '6.4.3';

// Global Foundation object
// This is attached to the window, or used as a module for AMD/Browserify
var Foundation = {
  version: FOUNDATION_VERSION,

  /**
   * Stores initialized plugins.
   */
  _plugins: {},

  /**
   * Stores generated unique ids for plugin instances
   */
  _uuids: [],

  /**
   * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
   * @param {Object} plugin - The constructor of the plugin.
   */
  plugin: function plugin(_plugin, name) {
    // Object key to use when adding to global Foundation object
    // Examples: Foundation.Reveal, Foundation.OffCanvas
    var className = name || functionName(_plugin);
    // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
    // Examples: data-reveal, data-off-canvas
    var attrName = hyphenate(className);

    // Add to the Foundation object and the plugins list (for reflowing)
    this._plugins[attrName] = this[className] = _plugin;
  },
  /**
   * @function
   * Populates the _uuids array with pointers to each individual plugin instance.
   * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
   * Also fires the initialization event for each plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @param {String} name - the name of the plugin, passed as a camelCased string.
   * @fires Plugin#init
   */
  registerPlugin: function registerPlugin(plugin, name) {
    var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
    plugin.uuid = (0, _foundationUtil.GetYoDigits)(6, pluginName);

    if (!plugin.$element.attr('data-' + pluginName)) {
      plugin.$element.attr('data-' + pluginName, plugin.uuid);
    }
    if (!plugin.$element.data('zfPlugin')) {
      plugin.$element.data('zfPlugin', plugin);
    }
    /**
     * Fires when the plugin has initialized.
     * @event Plugin#init
     */
    plugin.$element.trigger('init.zf.' + pluginName);

    this._uuids.push(plugin.uuid);

    return;
  },
  /**
   * @function
   * Removes the plugins uuid from the _uuids array.
   * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
   * Also fires the destroyed event for the plugin, consolidating repetitive code.
   * @param {Object} plugin - an instance of a plugin, usually `this` in context.
   * @fires Plugin#destroyed
   */
  unregisterPlugin: function unregisterPlugin(plugin) {
    var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));

    this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
    plugin.$element.removeAttr('data-' + pluginName).removeData('zfPlugin')
    /**
     * Fires when the plugin has been destroyed.
     * @event Plugin#destroyed
     */
    .trigger('destroyed.zf.' + pluginName);
    for (var prop in plugin) {
      plugin[prop] = null; //clean up script to prep for garbage collection.
    }
    return;
  },

  /**
   * @function
   * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
   * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
   * @default If no argument is passed, reflow all currently active plugins.
   */
  reInit: function reInit(plugins) {
    var isJQ = plugins instanceof _jquery2.default;
    try {
      if (isJQ) {
        plugins.each(function () {
          (0, _jquery2.default)(this).data('zfPlugin')._init();
        });
      } else {
        var type = typeof plugins === 'undefined' ? 'undefined' : _typeof(plugins),
            _this = this,
            fns = {
          'object': function object(plgs) {
            plgs.forEach(function (p) {
              p = hyphenate(p);
              (0, _jquery2.default)('[data-' + p + ']').foundation('_init');
            });
          },
          'string': function string() {
            plugins = hyphenate(plugins);
            (0, _jquery2.default)('[data-' + plugins + ']').foundation('_init');
          },
          'undefined': function undefined() {
            this['object'](Object.keys(_this._plugins));
          }
        };
        fns[type](plugins);
      }
    } catch (err) {
      console.error(err);
    } finally {
      return plugins;
    }
  },

  /**
   * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
   * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
   * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
   */
  reflow: function reflow(elem, plugins) {

    // If plugins is undefined, just grab everything
    if (typeof plugins === 'undefined') {
      plugins = Object.keys(this._plugins);
    }
    // If plugins is a string, convert it to an array with one item
    else if (typeof plugins === 'string') {
        plugins = [plugins];
      }

    var _this = this;

    // Iterate through each plugin
    _jquery2.default.each(plugins, function (i, name) {
      // Get the current plugin
      var plugin = _this._plugins[name];

      // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
      var $elem = (0, _jquery2.default)(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');

      // For each plugin found, initialize it
      $elem.each(function () {
        var $el = (0, _jquery2.default)(this),
            opts = {};
        // Don't double-dip on plugins
        if ($el.data('zfPlugin')) {
          console.warn("Tried to initialize " + name + " on an element that already has a Foundation plugin.");
          return;
        }

        if ($el.attr('data-options')) {
          var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
            var opt = e.split(':').map(function (el) {
              return el.trim();
            });
            if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
          });
        }
        try {
          $el.data('zfPlugin', new plugin((0, _jquery2.default)(this), opts));
        } catch (er) {
          console.error(er);
        } finally {
          return;
        }
      });
    });
  },
  getFnName: functionName,

  addToJquery: function addToJquery($) {
    // TODO: consider not making this a jQuery function
    // TODO: need way to reflow vs. re-initialize
    /**
     * The Foundation jQuery method.
     * @param {String|Array} method - An action to perform on the current jQuery object.
     */
    var foundation = function foundation(method) {
      var type = typeof method === 'undefined' ? 'undefined' : _typeof(method),
          $noJS = $('.no-js');

      if ($noJS.length) {
        $noJS.removeClass('no-js');
      }

      if (type === 'undefined') {
        //needs to initialize the Foundation object, or an individual plugin.
        _foundationUtil2.MediaQuery._init();
        Foundation.reflow(this);
      } else if (type === 'string') {
        //an individual method to invoke on a plugin or group of plugins
        var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
        var plugClass = this.data('zfPlugin'); //determine the class of plugin

        if (plugClass !== undefined && plugClass[method] !== undefined) {
          //make sure both the class and method exist
          if (this.length === 1) {
            //if there's only one, call it directly.
            plugClass[method].apply(plugClass, args);
          } else {
            this.each(function (i, el) {
              //otherwise loop through the jQuery collection and invoke the method on each
              plugClass[method].apply($(el).data('zfPlugin'), args);
            });
          }
        } else {
          //error for no class or no method
          throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
        }
      } else {
        //error for invalid argument type
        throw new TypeError('We\'re sorry, ' + type + ' is not a valid parameter. You must use a string representing the method you wish to invoke.');
      }
      return this;
    };
    $.fn.foundation = foundation;
    return $;
  }
};

Foundation.util = {
  /**
   * Function for applying a debounce effect to a function call.
   * @function
   * @param {Function} func - Function to be called at end of timeout.
   * @param {Number} delay - Time in ms to delay the call of `func`.
   * @returns function
   */
  throttle: function throttle(func, delay) {
    var timer = null;

    return function () {
      var context = this,
          args = arguments;

      if (timer === null) {
        timer = setTimeout(function () {
          func.apply(context, args);
          timer = null;
        }, delay);
      }
    };
  }
};

window.Foundation = Foundation;

// Polyfill for requestAnimationFrame
(function () {
  if (!Date.now || !window.Date.now) window.Date.now = Date.now = function () {
    return new Date().getTime();
  };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
  }
  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
  /**
   * Polyfill for performance.now, required by rAF
   */
  if (!window.performance || !window.performance.now) {
    window.performance = {
      start: Date.now(),
      now: function now() {
        return Date.now() - this.start;
      }
    };
  }
})();
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function fNOP() {},
        fBound = function fBound() {
      return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
    };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// Polyfill to get the name of a function in IE9
function functionName(fn) {
  if (Function.prototype.name === undefined) {
    var funcNameRegex = /function\s([^(]{1,})\(/;
    var results = funcNameRegex.exec(fn.toString());
    return results && results.length > 1 ? results[1].trim() : "";
  } else if (fn.prototype === undefined) {
    return fn.constructor.name;
  } else {
    return fn.prototype.constructor.name;
  }
}
function parseValue(str) {
  if ('true' === str) return true;else if ('false' === str) return false;else if (!isNaN(str * 1)) return parseFloat(str);
  return str;
}
// Convert PascalCase to kebab-case
// Thank you: http://stackoverflow.com/a/8955580
function hyphenate(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

exports.Foundation = Foundation;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transitionend = exports.GetYoDigits = exports.rtl = undefined;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Core Foundation Utilities, utilized in a number of places.

/**
 * Returns a boolean for RTL support
 */
function rtl() {
  return (0, _jquery2.default)('html').attr('dir') === 'rtl';
}

/**
 * returns a random base-36 uid with namespacing
 * @function
 * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
 * @param {String} namespace - name of plugin to be incorporated in uid, optional.
 * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
 * @returns {String} - unique id
 */
function GetYoDigits(length, namespace) {
  length = length || 6;
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1) + (namespace ? '-' + namespace : '');
}

function transitionend($elem) {
  var transitions = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'otransitionend'
  };
  var elem = document.createElement('div'),
      end;

  for (var t in transitions) {
    if (typeof elem.style[t] !== 'undefined') {
      end = transitions[t];
    }
  }
  if (end) {
    return end;
  } else {
    end = setTimeout(function () {
      $elem.triggerHandler('transitionend', [$elem]);
    }, 1);
    return 'transitionend';
  }
}

exports.rtl = rtl;
exports.GetYoDigits = GetYoDigits;
exports.transitionend = transitionend;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function () {
	'use strict';

	/**
  * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
  *
  * @codingstandard ftlabs-jsv2
  * @copyright The Financial Times Limited [All Rights Reserved]
  * @license MIT License (see LICENSE.txt)
  */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/

	/**
  * Instantiate fast-clicking listeners on the specified layer.
  *
  * @constructor
  * @param {Element} layer The layer to listen on
  * @param {Object} [options={}] The options to override the defaults
  */

	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
   * Whether a click is currently being tracked.
   *
   * @type boolean
   */
		this.trackingClick = false;

		/**
   * Timestamp for when click tracking started.
   *
   * @type number
   */
		this.trackingClickStart = 0;

		/**
   * The element being tracked for a click.
   *
   * @type EventTarget
   */
		this.targetElement = null;

		/**
   * X-coordinate of touch start event.
   *
   * @type number
   */
		this.touchStartX = 0;

		/**
   * Y-coordinate of touch start event.
   *
   * @type number
   */
		this.touchStartY = 0;

		/**
   * ID of the last touch, retrieved from Touch.identifier.
   *
   * @type number
   */
		this.lastTouchIdentifier = 0;

		/**
   * Touchmove boundary, beyond which a click will be cancelled.
   *
   * @type number
   */
		this.touchBoundary = options.touchBoundary || 10;

		/**
   * The FastClick layer.
   *
   * @type Element
   */
		this.layer = layer;

		/**
   * The minimum time between tap(touchstart and touchend) events
   *
   * @type number
   */
		this.tapDelay = options.tapDelay || 200;

		/**
   * The maximum time for a tap
   *
   * @type number
   */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function () {
				return method.apply(context, arguments);
			};
		}

		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function (type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function (type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function (event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
 * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
 *
 * @type boolean
 */
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
  * Android requires exceptions.
  *
  * @type boolean
  */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

	/**
  * iOS requires exceptions.
  *
  * @type boolean
  */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

	/**
  * iOS 4 requires an exception for select elements.
  *
  * @type boolean
  */
	var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

	/**
  * iOS 6.0-7.* requires the target element to be manually derived
  *
  * @type boolean
  */
	var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

	/**
  * BlackBerry requires exceptions.
  *
  * @type boolean
  */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
  * Determine whether a given element requires a native click.
  *
  * @param {EventTarget|Element} target Target DOM element
  * @returns {boolean} Returns true if the element needs a native click
  */
	FastClick.prototype.needsClick = function (target) {
		switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if (deviceIsIOS && target.type === 'file' || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
		}

		return (/\bneedsclick\b/.test(target.className)
		);
	};

	/**
  * Determine whether a given element requires a call to focus to simulate click into element.
  *
  * @param {EventTarget|Element} target Target DOM element
  * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
  */
	FastClick.prototype.needsFocus = function (target) {
		switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
					case 'button':
					case 'checkbox':
					case 'file':
					case 'image':
					case 'radio':
					case 'submit':
						return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/.test(target.className)
				);
		}
	};

	/**
  * Send a click event to the specified element.
  *
  * @param {EventTarget|Element} targetElement
  * @param {Event} event
  */
	FastClick.prototype.sendClick = function (targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function (targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};

	/**
  * @param {EventTarget|Element} targetElement
  */
	FastClick.prototype.focus = function (targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};

	/**
  * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
  *
  * @param {EventTarget|Element} targetElement
  */
	FastClick.prototype.updateScrollParent = function (targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};

	/**
  * @param {EventTarget} targetElement
  * @returns {Element|EventTarget}
  */
	FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};

	/**
  * On touch start, record the position and scroll offset.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.onTouchStart = function (event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if (event.timeStamp - this.lastClickTime < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};

	/**
  * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.touchHasMoved = function (event) {
		var touch = event.changedTouches[0],
		    boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};

	/**
  * Update the last position.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.onTouchMove = function (event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};

	/**
  * Attempt to find the labelled control for the given label element.
  *
  * @param {EventTarget|HTMLLabelElement} labelElement
  * @returns {Element|null}
  */
	FastClick.prototype.findControl = function (labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};

	/**
  * On touch end, determine whether to send a click event at once.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.onTouchEnd = function (event) {
		var forElement,
		    trackingClickStart,
		    targetTagName,
		    scrollParent,
		    touch,
		    targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if (event.timeStamp - this.lastClickTime < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === 'input') {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};

	/**
  * On touch cancel, stop tracking the click.
  *
  * @returns {void}
  */
	FastClick.prototype.onTouchCancel = function () {
		this.trackingClick = false;
		this.targetElement = null;
	};

	/**
  * Determine mouse events which should be permitted.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.onMouse = function (event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};

	/**
  * On actual clicks, determine whether this is a touch-generated click, a click action occurring
  * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
  * an actual click which should be permitted.
  *
  * @param {Event} event
  * @returns {boolean}
  */
	FastClick.prototype.onClick = function (event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};

	/**
  * Remove all FastClick's event listeners.
  *
  * @returns {void}
  */
	FastClick.prototype.destroy = function () {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};

	/**
  * Check whether FastClick is needed.
  *
  * @param {Element} layer The layer to listen on
  */
	FastClick.notNeeded = function (layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

				// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};

	/**
  * Factory method for creating a FastClick object
  *
  * @param {Element} layer The layer to listen on
  * @param {Object} [options={}] The options to override the defaults
  */
	FastClick.attach = function (layer, options) {
		return new FastClick(layer, options);
	};

	if ("function" === 'function' && _typeof(__webpack_require__(3)) === 'object' && __webpack_require__(3)) {

		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return FastClick;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
})();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
var SHAPE_ORDER = ['cross', '27', '26', '25', '24', '22', '21', '23', 'dot', '1', '2', '4', '3', '19', '18', '17', '20', 'corners', '57', '28', 'line', '55', '52', '51', '56', 't', '45', '33', 'z', '40', '39', 'L', '14', '13', '16', '15', 'c', '46', '34', 'w', '38', '36', 'p', '44', '43', '31', '32', 'square', '35', '37', '5', '6', 'l', '48', '47', '50', '49', '53', '54', 'others', '11', '12', '7', '8', '10', '9', '29', '42', '41', '30'];

var TRIGGER_ORDER = ['red', '45', '48', '44', '51', '43', '47', '11', '12', '4', '3', '2', '16', '15', '40', '39', '57', '20', '56', '34', '9', '29', '25', 'blue', '24', '33', '46', '1', '35', '19', '49', '30', '42', 'green', '38', '36', '52', '53', '17', '5', '18', '54', '7', '10', '41', 'others', '22', '21', '23', '27', '26', '31', '32', '37', '50', '14', '8', '55', '6', '28', '13'];

var CONTROLS_MARGIN = 50;

function sortByArray(orderArray) {
	return function (a, b) {
		var indexA = orderArray.indexOf('' + $(a).data('number'));
		var indexB = orderArray.indexOf('' + $(b).data('number'));

		return indexA < indexB ? -1 : indexA > indexB ? 1 : 0;
	};
}

// Make each alg-table-controls stick to corresponding alg-table
function placeControls() {
	$('.alg-table-controls').each(function () {
		var $this = $(this);
		var $box = $this.find('div');
		var $table = $this.siblings('.alg-table');

		// Stick to bottom of table
		if (window.scrollY > $table.offset().top + $table.outerHeight() - $box.outerHeight() - CONTROLS_MARGIN) {
			$this.addClass('bottom');
			$box.removeClass('fixed').css('left', '');
		}
		// Fixed position while table is visible
		else if (window.scrollY > $table.offset().top - CONTROLS_MARGIN) {
				$this.removeClass('bottom');
				$box.css('left', $box.offset().left).addClass('fixed');
			}
			// Default position
			else {
					$this.removeClass('bottom');
					$box.removeClass('fixed').css('left', '');
				}
	});
}

exports.default = $(document).ready(function () {

	// Place any alg table controls on scroll and resize events
	if ($('.alg-table-controls').length > 0) {
		if (Foundation.MediaQuery.atLeast('medium')) {
			placeControls();
		}

		$(window).scroll(function () {
			if (Foundation.MediaQuery.atLeast('medium')) {
				placeControls();
			}
		});

		$(window).resize(function () {
			$('.alg-table-controls div').css('left', '').removeClass('fixed');
			placeControls();
		});

		// OLL table sorting
		$('.alg-table-controls select').on('change', function () {
			var $this = $(this);
			var $table = $this.closest('.alg-table-controls').siblings('.alg-table');

			if ($this.val() == 'shape') {
				$('.title-trigger, .contents-trigger, .title-number').hide();
				$('.title-shape, .contents-shape').show();

				$table.children('.title-shape, .alg').sort(sortByArray(SHAPE_ORDER)).appendTo($table);
			} else if ($this.val() == 'trigger') {
				$('.title-trigger, .contents-trigger').show();
				$('.title-shape, .contents-shape, .title-number').hide();

				$table.children('.title-trigger, .alg').sort(sortByArray(TRIGGER_ORDER)).appendTo($table);
			} else if ($this.val() == 'number') {
				$('.title-trigger, .contents-trigger').hide();
				$('.title-shape, .contents-shape').hide();
				$('.title-number').show();

				$table.children('.title-trigger, .alg').sort(function (a, b) {
					return $(a).data('number') - $(b).data('number');
				}).appendTo($table);
			}
		});
	}
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _hammerjs = __webpack_require__(10);

var _hammerjs2 = _interopRequireDefault(_hammerjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MENU_WIDTH = 200;

// Helper functions for mobile menu
function menuOpen() {
	$('#menu, .menu-button').addClass('active').css('transform', '');
	$('#navbar').addClass('active');
	$('#menu-close').show();
	menuCloseHammer.set({ enable: true });
}

function menuClose() {
	$('#menu, .menu-button').removeClass('active fixed').css('transform', '');
	$('#navbar').removeClass('active');
	$('#menu-close').hide();
	menuCloseHammer.set({ enable: false });
}

// Mobile menu button click
$('.menu-button').click(function () {
	if ($(this).hasClass('active')) {
		menuClose();
	} else {
		menuOpen();
		$('#header-menu-button').addClass('fixed');
	}
});

// Close menu when user clicks off menu
$('#menu-close').click(function () {
	menuClose();
});

// Show mobile menu button when scrolled away from header mobile menu button
$(window).scroll(function () {
	if ($(this).scrollTop() >= 40) {
		$('#menu-button').css('opacity', 1);
	} else {
		$('#menu-button').css('opacity', '');
	}
});

/*
	Gestures
*/

var $menu = $('#menu');
var $menuButton = $('.menu-button');
var $openButton = $('.menu-button .open');
var $closeButton = $('.menu-button .close');
var translation = void 0;

var menuOpenHammer = new _hammerjs2.default(document.getElementById('menu-open'));
var menuCloseHammer = new _hammerjs2.default(document.getElementById('menu-close'), { enable: false });

// Open menu when swiping from left of screen
menuOpenHammer.on('swiperight', function (e) {
	menuOpen();
});

// On gesture start, remove animated classes to disable transition delays
menuOpenHammer.on('panstart', function (e) {
	$menu.addClass('panning').removeClass('animated');
	$menuButton.removeClass('animated');

	// Also record menu translation
	translation = parseInt($menu.css('transform').split(', ')[4], 10) || 0;
});

// During gesture, translate menu and buttons
menuOpenHammer.on('pan', function (e) {
	var delta = e.deltaX;

	// Limit swipe distance to width of menu
	if (delta > MENU_WIDTH) {
		delta = MENU_WIDTH;
	} else if (delta < -MENU_WIDTH) {
		delta = -MENU_WIDTH;
	}

	if ($menu.hasClass('active')) {
		if (delta > 0) {
			delta = 0;
		}
	} else {
		if (delta < 0) {
			delta = 0;
		}
	}

	// Calculate correct values for menu button rotation and opacity in both directions
	var rotation = Math.abs(delta) * 0.9;
	var opacity = Math.abs(delta) / MENU_WIDTH;

	if ($menu.hasClass('active')) {
		rotation = 180 - rotation;
		opacity = 1 - opacity;
	}

	// Translate the menu and menu button rotates and fades in
	$menu.css('transform', 'translateX(' + (translation + delta) + 'px)');

	$openButton.css({
		'transform': 'rotate(' + rotation + 'deg)',
		'opacity': 1 - opacity
	});
	$closeButton.css({
		'transform': 'rotate(' + rotation + 'deg)',
		'opacity': opacity
	});
});

// When gesture ends, restore animations and open/close the menu depending on menu position
menuOpenHammer.on('panend', function (e) {
	$menu.removeClass('panning').addClass('animated');
	$menuButton.addClass('animated');

	// Complete menu open if the gesture was over half the menu width
	if (e.deltaX >= MENU_WIDTH / 2) {
		menuOpen();
		window.setTimeout(function () {
			$('#header-menu-button').addClass('fixed');
		}, 300);
	} else {
		menuClose();
	}

	$('.menu-button > div').css({
		'transform': '',
		'opacity': ''
	});
});

// Close menu on swipe left anywhere
menuCloseHammer.on('swipeleft', function (e) {
	menuClose();
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function (window, document, exportName, undefined) {
    'use strict';

    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var TEST_ELEMENT = document.createElement('div');

    var TYPE_FUNCTION = 'function';

    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;

    /**
     * set a timeout with a given scope
     * @param {Function} fn
     * @param {Number} timeout
     * @param {Object} context
     * @returns {number}
     */
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }

    /**
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {*|Array} arg
     * @param {String} fn
     * @param {Object} [context]
     * @returns {Boolean}
     */
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }

    /**
     * walk objects and arrays
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
     */
    function each(obj, iterator, context) {
        var i;

        if (!obj) {
            return;
        }

        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length !== undefined) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        } else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }

    /**
     * wrap a method with a deprecation warning and stack trace
     * @param {Function} method
     * @param {String} name
     * @param {String} message
     * @returns {Function} A new function wrapping the supplied method.
     */
    function deprecate(method, name, message) {
        var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
        return function () {
            var e = new Error('get-stack-trace');
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

            var log = window.console && (window.console.warn || window.console.log);
            if (log) {
                log.call(window.console, deprecationMessage, stack);
            }
            return method.apply(this, arguments);
        };
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} target
     * @param {...Object} objects_to_assign
     * @returns {Object} target
     */
    var assign;
    if (typeof Object.assign !== 'function') {
        assign = function assign(target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    } else {
        assign = Object.assign;
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} dest
     * @param {Object} src
     * @param {Boolean} [merge=false]
     * @returns {Object} dest
     */
    var extend = deprecate(function extend(dest, src, merge) {
        var keys = Object.keys(src);
        var i = 0;
        while (i < keys.length) {
            if (!merge || merge && dest[keys[i]] === undefined) {
                dest[keys[i]] = src[keys[i]];
            }
            i++;
        }
        return dest;
    }, 'extend', 'Use `assign`.');

    /**
     * merge the values from src in the dest.
     * means that properties that exist in dest will not be overwritten by src
     * @param {Object} dest
     * @param {Object} src
     * @returns {Object} dest
     */
    var merge = deprecate(function merge(dest, src) {
        return extend(dest, src, true);
    }, 'merge', 'Use `assign`.');

    /**
     * simple class inheritance
     * @param {Function} child
     * @param {Function} base
     * @param {Object} [properties]
     */
    function inherit(child, base, properties) {
        var baseP = base.prototype,
            childP;

        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;

        if (properties) {
            assign(childP, properties);
        }
    }

    /**
     * simple function bind
     * @param {Function} fn
     * @param {Object} context
     * @returns {Function}
     */
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }

    /**
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {Boolean|Function} val
     * @param {Array} [args]
     * @returns {Boolean}
     */
    function boolOrFn(val, args) {
        if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined : undefined, args);
        }
        return val;
    }

    /**
     * use the val2 when val1 is undefined
     * @param {*} val1
     * @param {*} val2
     * @returns {*}
     */
    function ifUndefined(val1, val2) {
        return val1 === undefined ? val2 : val1;
    }

    /**
     * addEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function addEventListeners(target, types, handler) {
        each(splitStr(types), function (type) {
            target.addEventListener(type, handler, false);
        });
    }

    /**
     * removeEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function removeEventListeners(target, types, handler) {
        each(splitStr(types), function (type) {
            target.removeEventListener(type, handler, false);
        });
    }

    /**
     * find if a node is in the given parent
     * @method hasParent
     * @param {HTMLElement} node
     * @param {HTMLElement} parent
     * @return {Boolean} found
     */
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * small indexOf wrapper
     * @param {String} str
     * @param {String} find
     * @returns {Boolean} found
     */
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }

    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }

    /**
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {Array} src
     * @param {String} find
     * @param {String} [findByKey]
     * @return {Boolean|Number} false when not found, or the index
     */
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        } else {
            var i = 0;
            while (i < src.length) {
                if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
                    return i;
                }
                i++;
            }
            return -1;
        }
    }

    /**
     * convert array-like objects to real arrays
     * @param {Object} obj
     * @returns {Array}
     */
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }

    /**
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {Array} src [{id:1},{id:2},{id:1}]
     * @param {String} [key]
     * @param {Boolean} [sort=False]
     * @returns {Array} [{id:1},{id:2}]
     */
    function uniqueArray(src, key, sort) {
        var results = [];
        var values = [];
        var i = 0;

        while (i < src.length) {
            var val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key];
                });
            }
        }

        return results;
    }

    /**
     * get the prefixed property
     * @param {Object} obj
     * @param {String} property
     * @returns {String|Undefined} prefixed
     */
    function prefixed(obj, property) {
        var prefix, prop;
        var camelProp = property[0].toUpperCase() + property.slice(1);

        var i = 0;
        while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;

            if (prop in obj) {
                return prop;
            }
            i++;
        }
        return undefined;
    }

    /**
     * get a unique id
     * @returns {number} uniqueId
     */
    var _uniqueId = 1;
    function uniqueId() {
        return _uniqueId++;
    }

    /**
     * get the window object of an element
     * @param {HTMLElement} element
     * @returns {DocumentView|Window}
     */
    function getWindowForElement(element) {
        var doc = element.ownerDocument || element;
        return doc.defaultView || doc.parentWindow || window;
    }

    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

    var SUPPORT_TOUCH = 'ontouchstart' in window;
    var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    var INPUT_TYPE_TOUCH = 'touch';
    var INPUT_TYPE_PEN = 'pen';
    var INPUT_TYPE_MOUSE = 'mouse';
    var INPUT_TYPE_KINECT = 'kinect';

    var COMPUTE_INTERVAL = 25;

    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;

    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;

    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

    /**
     * create new input type manager
     * @param {Manager} manager
     * @param {Function} callback
     * @returns {Input}
     * @constructor
     */
    function Input(manager, callback) {
        var self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;

        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function (ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
                self.handler(ev);
            }
        };

        this.init();
    }

    Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler: function handler() {},

        /**
         * bind the events
         */
        init: function init() {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        },

        /**
         * unbind the events
         */
        destroy: function destroy() {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
        }
    };

    /**
     * create new input type manager
     * called by the Manager constructor
     * @param {Hammer} manager
     * @returns {Input}
     */
    function createInputInstance(manager) {
        var Type;
        var inputClass = manager.options.inputClass;

        if (inputClass) {
            Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
        } else {
            Type = TouchMouseInput;
        }
        return new Type(manager, inputHandler);
    }

    /**
     * handle input events
     * @param {Manager} manager
     * @param {String} eventType
     * @param {Object} input
     */
    function inputHandler(manager, eventType, input) {
        var pointersLen = input.pointers.length;
        var changedPointersLen = input.changedPointers.length;
        var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
        var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;

        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;

        if (isFirst) {
            manager.session = {};
        }

        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;

        // compute scale, rotation etc
        computeInputData(manager, input);

        // emit secret event
        manager.emit('hammer.input', input);

        manager.recognize(input);
        manager.session.prevInput = input;
    }

    /**
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {Object} manager
     * @param {Object} input
     */
    function computeInputData(manager, input) {
        var session = manager.session;
        var pointers = input.pointers;
        var pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        var firstInput = session.firstInput;
        var firstMultiple = session.firstMultiple;
        var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

        var center = input.center = getCenter(pointers);
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);

        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

        var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;

        input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
        input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

        input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;

        computeIntervalInputData(session, input);

        // find the correct target
        var target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    }

    function computeDeltaXY(session, input) {
        var center = input.center;
        var offset = session.offsetDelta || {};
        var prevDelta = session.prevDelta || {};
        var prevInput = session.prevInput || {};

        if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
    }

    /**
     * velocity is calculated every x ms
     * @param {Object} session
     * @param {Object} input
     */
    function computeIntervalInputData(session, input) {
        var last = session.lastInterval || input,
            deltaTime = input.timeStamp - last.timeStamp,
            velocity,
            velocityX,
            velocityY,
            direction;

        if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;

            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);

            session.lastInterval = input;
        } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    }

    /**
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {Object} input
     * @returns {Object} clonedInputData
     */
    function simpleCloneInputData(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        var pointers = [];
        var i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: round(input.pointers[i].clientX),
                clientY: round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    }

    /**
     * get the center of all the pointers
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */
    function getCenter(pointers) {
        var pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: round(pointers[0].clientX),
                y: round(pointers[0].clientY)
            };
        }

        var x = 0,
            y = 0,
            i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
        };
    }

    /**
     * calculate the velocity between two points. unit is in px per ms.
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    function getVelocity(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    }

    /**
     * get the direction between two points
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */
    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }

        if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    /**
     * calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];

        return Math.sqrt(x * x + y * y);
    }

    /**
     * calculate the angle between two coordinates
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]],
            y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    /**
     * calculate the rotation degrees between two pointersets
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }

    /**
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }

    var MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
    };

    var MOUSE_ELEMENT_EVENTS = 'mousedown';
    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

    /**
     * Mouse events input
     * @constructor
     * @extends Input
     */
    function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;

        this.pressed = false; // mousedown state

        Input.apply(this, arguments);
    }

    inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type];

            // on start we want to have the left mouse button down
            if (eventType & INPUT_START && ev.button === 0) {
                this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
                eventType = INPUT_END;
            }

            // mouse must be down
            if (!this.pressed) {
                return;
            }

            if (eventType & INPUT_END) {
                this.pressed = false;
            }

            this.callback(this.manager, eventType, {
                pointers: [ev],
                changedPointers: [ev],
                pointerType: INPUT_TYPE_MOUSE,
                srcEvent: ev
            });
        }
    });

    var POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
    };

    // in IE10 the pointer types is defined as an enum
    var IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };

    var POINTER_ELEMENT_EVENTS = 'pointerdown';
    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

    // IE10 has prefixed support, and case-sensitive
    if (window.MSPointerEvent && !window.PointerEvent) {
        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }

    /**
     * Pointer events input
     * @constructor
     * @extends Input
     */
    function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;

        Input.apply(this, arguments);

        this.store = this.manager.session.pointerEvents = [];
    }

    inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;

            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

            var isTouch = pointerType == INPUT_TYPE_TOUCH;

            // get index of the event in the store
            var storeIndex = inArray(store, ev.pointerId, 'pointerId');

            // start and mouse must be down
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                if (storeIndex < 0) {
                    store.push(ev);
                    storeIndex = store.length - 1;
                }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                removePointer = true;
            }

            // it not found, so the pointer hasn't been down (so it's probably a hover)
            if (storeIndex < 0) {
                return;
            }

            // update the event in the store
            store[storeIndex] = ev;

            this.callback(this.manager, eventType, {
                pointers: store,
                changedPointers: [ev],
                pointerType: pointerType,
                srcEvent: ev
            });

            if (removePointer) {
                // remove from the store
                store.splice(storeIndex, 1);
            }
        }
    });

    var SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Touch events input
     * @constructor
     * @extends Input
     */
    function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;

        Input.apply(this, arguments);
    }

    inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

            // should we handle the touch events?
            if (type === INPUT_START) {
                this.started = true;
            }

            if (!this.started) {
                return;
            }

            var touches = normalizeSingleTouches.call(this, ev, type);

            // when done, reset the started state
            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
                this.started = false;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function normalizeSingleTouches(ev, type) {
        var all = toArray(ev.touches);
        var changed = toArray(ev.changedTouches);

        if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
        }

        return [all, changed];
    }

    var TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */
    function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};

        Input.apply(this, arguments);
    }

    inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);
            if (!touches) {
                return;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function getTouches(ev, type) {
        var allTouches = toArray(ev.touches);
        var targetIds = this.targetIds;

        // when there is only one touch, the process can be simplified
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }

        var i,
            targetTouches,
            changedTouches = toArray(ev.changedTouches),
            changedTargetTouches = [],
            target = this.target;

        // get target touches from touches
        targetTouches = allTouches.filter(function (touch) {
            return hasParent(touch.target, target);
        });

        // collect touches
        if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }

        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }

            // cleanup removed touches
            if (type & (INPUT_END | INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }

        if (!changedTargetTouches.length) {
            return;
        }

        return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
    }

    /**
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @constructor
     * @extends Input
     */

    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;

    function TouchMouseInput() {
        Input.apply(this, arguments);

        var handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);

        this.primaryTouch = null;
        this.lastTouches = [];
    }

    inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
                isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
                return;
            }

            // when we're in a touch event, record touches to  de-dupe synthetic mouse event
            if (isTouch) {
                recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
                return;
            }

            this.callback(manager, inputEvent, inputData);
        },

        /**
         * remove the event listeners
         */
        destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
        }
    });

    function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
        }
    }

    function setLastTouch(eventData) {
        var touch = eventData.changedPointers[0];

        if (touch.identifier === this.primaryTouch) {
            var lastTouch = { x: touch.clientX, y: touch.clientY };
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;
            var removeLastTouch = function removeLastTouch() {
                var i = lts.indexOf(lastTouch);
                if (i > -1) {
                    lts.splice(i, 1);
                }
            };
            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
    }

    function isSyntheticEvent(eventData) {
        var x = eventData.srcEvent.clientX,
            y = eventData.srcEvent.clientY;
        for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x),
                dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                return true;
            }
        }
        return false;
    }

    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

    // magical touchAction value
    var TOUCH_ACTION_COMPUTE = 'compute';
    var TOUCH_ACTION_AUTO = 'auto';
    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    var TOUCH_ACTION_NONE = 'none';
    var TOUCH_ACTION_PAN_X = 'pan-x';
    var TOUCH_ACTION_PAN_Y = 'pan-y';
    var TOUCH_ACTION_MAP = getTouchActionProps();

    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */
    function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
    }

    TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set: function set(value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }

            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        },

        /**
         * just re-set the touchAction value
         */
        update: function update() {
            this.set(this.manager.options.touchAction);
        },

        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute: function compute() {
            var actions = [];
            each(this.manager.recognizers, function (recognizer) {
                if (boolOrFn(recognizer.options.enable, [recognizer])) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        },

        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults: function preventDefaults(input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection;

            // if the touch action did prevented once this session
            if (this.manager.session.prevented) {
                srcEvent.preventDefault();
                return;
            }

            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
                //do not prevent defaults if this is a tap gesture

                var isTapPointer = input.pointers.length === 1;
                var isTapMovement = input.distance < 2;
                var isTapTouchTime = input.deltaTime < 250;

                if (isTapPointer && isTapMovement && isTapTouchTime) {
                    return;
                }
            }

            if (hasPanX && hasPanY) {
                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                return;
            }

            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
                return this.preventSrc(srcEvent);
            }
        },

        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc: function preventSrc(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
        }
    };

    /**
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {String} actions
     * @returns {*}
     */
    function cleanTouchActions(actions) {
        // none
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
        }

        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

        // if both pan-x and pan-y are set (different recognizers
        // for different directions, e.g. horizontal pan but vertical swipe?)
        // we need none (as otherwise with pan-x pan-y combined none of these
        // recognizers will work, since the browser would handle all panning
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
        }

        // pan-x OR pan-y
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }

        // manipulation
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
        }

        return TOUCH_ACTION_AUTO;
    }

    function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
            return false;
        }
        var touchMap = {};
        var cssSupports = window.CSS && window.CSS.supports;
        ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {

            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
        });
        return touchMap;
    }

    /**
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */
    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;

    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     * @param {Object} options
     */
    function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});

        this.id = uniqueId();

        this.manager = null;

        // default is enable true
        this.options.enable = ifUndefined(this.options.enable, true);

        this.state = STATE_POSSIBLE;

        this.simultaneous = {};
        this.requireFail = [];
    }

    Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},

        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set: function set(options) {
            assign(this.options, options);

            // also update the touchAction, in case something changed about the directions/enabled state
            this.manager && this.manager.touchAction.update();
            return this;
        },

        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith: function recognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                return this;
            }

            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        },

        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith: function dropRecognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        },

        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure: function requireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                return this;
            }

            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            if (inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        },

        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure: function dropRequireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        },

        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures: function hasRequireFailures() {
            return this.requireFail.length > 0;
        },

        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith: function canRecognizeWith(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        },

        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit: function emit(input) {
            var self = this;
            var state = this.state;

            function emit(event) {
                self.manager.emit(event, input);
            }

            // 'panstart' and 'panmove'
            if (state < STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) {
                // additional event(panleft, panright, pinchin, pinchout...)
                emit(input.additionalEvent);
            }

            // panend and pancancel
            if (state >= STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
        },

        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit: function tryEmit(input) {
            if (this.canEmit()) {
                return this.emit(input);
            }
            // it's failing anyway
            this.state = STATE_FAILED;
        },

        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit: function canEmit() {
            var i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        },

        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize: function recognize(inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var inputDataClone = assign({}, inputData);

            // is is enabled and allow recognizing?
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                this.reset();
                this.state = STATE_FAILED;
                return;
            }

            // reset when we've reached the end
            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
                this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone);

            // the recognizer has recognized a gesture
            // so trigger an event
            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
                this.tryEmit(inputDataClone);
            }
        },

        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process: function process(inputData) {}, // jshint ignore:line

        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction: function getTouchAction() {},

        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset: function reset() {}
    };

    /**
     * get a usable string, used as event postfix
     * @param {Const} state
     * @returns {String} state
     */
    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return 'cancel';
        } else if (state & STATE_ENDED) {
            return 'end';
        } else if (state & STATE_CHANGED) {
            return 'move';
        } else if (state & STATE_BEGAN) {
            return 'start';
        }
        return '';
    }

    /**
     * direction cons to string
     * @param {Const} direction
     * @returns {String}
     */
    function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
            return 'down';
        } else if (direction == DIRECTION_UP) {
            return 'up';
        } else if (direction == DIRECTION_LEFT) {
            return 'left';
        } else if (direction == DIRECTION_RIGHT) {
            return 'right';
        }
        return '';
    }

    /**
     * get a recognizer by name if it is bound to a manager
     * @param {Recognizer|String} otherRecognizer
     * @param {Recognizer} recognizer
     * @returns {Recognizer}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        var manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer);
        }
        return otherRecognizer;
    }

    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */
    function AttrRecognizer() {
        Recognizer.apply(this, arguments);
    }

    inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
        },

        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest: function attrTest(input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
        },

        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process: function process(input) {
            var state = this.state;
            var eventType = input.eventType;

            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input);

            // on cancel input and we've recognized before, return STATE_CANCELLED
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
                if (eventType & INPUT_END) {
                    return state | STATE_ENDED;
                } else if (!(state & STATE_BEGAN)) {
                    return STATE_BEGAN;
                }
                return state | STATE_CHANGED;
            }
            return STATE_FAILED;
        }
    });

    /**
     * Pan
     * Recognized when the pointer is down and moved in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);

        this.pX = null;
        this.pY = null;
    }

    inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
        },

        getTouchAction: function getTouchAction() {
            var direction = this.options.direction;
            var actions = [];
            if (direction & DIRECTION_HORIZONTAL) {
                actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & DIRECTION_VERTICAL) {
                actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
        },

        directionTest: function directionTest(input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY;

            // lock to axis?
            if (!(direction & options.direction)) {
                if (options.direction & DIRECTION_HORIZONTAL) {
                    direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.deltaX);
                } else {
                    direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.deltaY);
                }
            }
            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
        },

        attrTest: function attrTest(input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
        },

        emit: function emit(input) {

            this.pX = input.deltaX;
            this.pY = input.deltaY;

            var direction = directionStr(input.direction);

            if (direction) {
                input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @constructor
     * @extends AttrRecognizer
     */
    function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function attrTest(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
        },

        emit: function emit(input) {
            if (input.scale !== 1) {
                var inOut = input.scale < 1 ? 'in' : 'out';
                input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @constructor
     * @extends Recognizer
     */
    function PressRecognizer() {
        Recognizer.apply(this, arguments);

        this._timer = null;
        this._input = null;
    }

    inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
            event: 'press',
            pointers: 1,
            time: 251, // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low
        },

        getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_AUTO];
        },

        process: function process(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;

            this._input = input;

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
                this.reset();
            } else if (input.eventType & INPUT_START) {
                this.reset();
                this._timer = setTimeoutContext(function () {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                }, options.time, this);
            } else if (input.eventType & INPUT_END) {
                return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
        },

        reset: function reset() {
            clearTimeout(this._timer);
        },

        emit: function emit(input) {
            if (this.state !== STATE_RECOGNIZED) {
                return;
            }

            if (input && input.eventType & INPUT_END) {
                this.manager.emit(this.options.event + 'up', input);
            } else {
                this._input.timeStamp = now();
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Rotate
     * Recognized when two or more pointer are moving in a circular motion.
     * @constructor
     * @extends AttrRecognizer
     */
    function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
        },

        getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest: function attrTest(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
        }
    });

    /**
     * Swipe
     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
        },

        getTouchAction: function getTouchAction() {
            return PanRecognizer.prototype.getTouchAction.call(this);
        },

        attrTest: function attrTest(input) {
            var direction = this.options.direction;
            var velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
                velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
                velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
                velocity = input.overallVelocityY;
            }

            return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
        },

        emit: function emit(input) {
            var direction = directionStr(input.offsetDirection);
            if (direction) {
                this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
        }
    });

    /**
     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
     * a single tap.
     *
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @constructor
     * @extends Recognizer
     */
    function TapRecognizer() {
        Recognizer.apply(this, arguments);

        // previous time and center,
        // used for tap counting
        this.pTime = false;
        this.pCenter = false;

        this._timer = null;
        this._input = null;
        this.count = 0;
    }

    inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300, // max time between the multi-tap taps
            time: 250, // max time of the pointer to be down (like finger on the screen)
            threshold: 9, // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        },

        getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_MANIPULATION];
        },

        process: function process(input) {
            var options = this.options;

            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;

            this.reset();

            if (input.eventType & INPUT_START && this.count === 0) {
                return this.failTimeout();
            }

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (validMovement && validTouchTime && validPointers) {
                if (input.eventType != INPUT_END) {
                    return this.failTimeout();
                }

                var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
                var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

                this.pTime = input.timeStamp;
                this.pCenter = input.center;

                if (!validMultiTap || !validInterval) {
                    this.count = 1;
                } else {
                    this.count += 1;
                }

                this._input = input;

                // if tap count matches we have recognized it,
                // else it has began recognizing...
                var tapCount = this.count % options.taps;
                if (tapCount === 0) {
                    // no failing requirements, immediately trigger the tap event
                    // or wait as long as the multitap interval to trigger
                    if (!this.hasRequireFailures()) {
                        return STATE_RECOGNIZED;
                    } else {
                        this._timer = setTimeoutContext(function () {
                            this.state = STATE_RECOGNIZED;
                            this.tryEmit();
                        }, options.interval, this);
                        return STATE_BEGAN;
                    }
                }
            }
            return STATE_FAILED;
        },

        failTimeout: function failTimeout() {
            this._timer = setTimeoutContext(function () {
                this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
        },

        reset: function reset() {
            clearTimeout(this._timer);
        },

        emit: function emit() {
            if (this.state == STATE_RECOGNIZED) {
                this._input.tapCount = this.count;
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Simple way to create a manager with a default set of recognizers.
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Hammer(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
        return new Manager(element, options);
    }

    /**
     * @const {string}
     */
    Hammer.VERSION = '2.0.7';

    /**
     * default settings
     * @namespace
     */
    Hammer.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,

        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,

        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,

        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,

        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,

        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, { enable: false }], [PinchRecognizer, { enable: false }, ['rotate']], [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }], [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']], [TapRecognizer], [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']], [PressRecognizer]],

        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
        }
    };

    var STOP = 1;
    var FORCED_STOP = 2;

    /**
     * Manager
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Manager(element, options) {
        this.options = assign({}, Hammer.defaults, options || {});

        this.options.inputTarget = this.options.inputTarget || element;

        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};

        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);

        toggleCssProps(this, true);

        each(this.options.recognizers, function (item) {
            var recognizer = this.add(new item[0](item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
        }, this);
    }

    Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set: function set(options) {
            assign(this.options, options);

            // Options that need a little more setup
            if (options.touchAction) {
                this.touchAction.update();
            }
            if (options.inputTarget) {
                // Clean up existing event listeners and reinitialize
                this.input.destroy();
                this.input.target = options.inputTarget;
                this.input.init();
            }
            return this;
        },

        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop: function stop(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        },

        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize: function recognize(inputData) {
            var session = this.session;
            if (session.stopped) {
                return;
            }

            // run the touch-action polyfill
            this.touchAction.preventDefaults(inputData);

            var recognizer;
            var recognizers = this.recognizers;

            // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`
            var curRecognizer = session.curRecognizer;

            // reset when the last recognizer is recognized
            // or when we're in a new session
            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
                curRecognizer = session.curRecognizer = null;
            }

            var i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];

                // find out if we are allowed try to recognize the input for this one.
                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                //      that is being recognized.
                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                //      this can be setup with the `recognizeWith()` method on the recognizer.
                if (session.stopped !== FORCED_STOP && ( // 1
                !curRecognizer || recognizer == curRecognizer || // 2
                recognizer.canRecognizeWith(curRecognizer))) {
                    // 3
                    recognizer.recognize(inputData);
                } else {
                    recognizer.reset();
                }

                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                // current active recognizer. but only if we don't already have an active recognizer
                if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        },

        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get: function get(recognizer) {
            if (recognizer instanceof Recognizer) {
                return recognizer;
            }

            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
                if (recognizers[i].options.event == recognizer) {
                    return recognizers[i];
                }
            }
            return null;
        },

        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add: function add(recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
                return this;
            }

            // remove existing
            var existing = this.get(recognizer.options.event);
            if (existing) {
                this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;

            this.touchAction.update();
            return recognizer;
        },

        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove: function remove(recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
                return this;
            }

            recognizer = this.get(recognizer);

            // let's make sure this recognizer exists
            if (recognizer) {
                var recognizers = this.recognizers;
                var index = inArray(recognizers, recognizer);

                if (index !== -1) {
                    recognizers.splice(index, 1);
                    this.touchAction.update();
                }
            }

            return this;
        },

        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on: function on(events, handler) {
            if (events === undefined) {
                return;
            }
            if (handler === undefined) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        },

        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off: function off(events, handler) {
            if (events === undefined) {
                return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
                if (!handler) {
                    delete handlers[event];
                } else {
                    handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
                }
            });
            return this;
        },

        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit: function emit(event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
                triggerDomEvent(event, data);
            }

            // no handlers, so skip it all
            var handlers = this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
                return;
            }

            data.type = event;
            data.preventDefault = function () {
                data.srcEvent.preventDefault();
            };

            var i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        },

        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy: function destroy() {
            this.element && toggleCssProps(this, false);

            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
        }
    };

    /**
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {Manager} manager
     * @param {Boolean} add
     */
    function toggleCssProps(manager, add) {
        var element = manager.element;
        if (!element.style) {
            return;
        }
        var prop;
        each(manager.options.cssProps, function (value, name) {
            prop = prefixed(element.style, name);
            if (add) {
                manager.oldCssProps[prop] = element.style[prop];
                element.style[prop] = value;
            } else {
                element.style[prop] = manager.oldCssProps[prop] || '';
            }
        });
        if (!add) {
            manager.oldCssProps = {};
        }
    }

    /**
     * trigger dom event
     * @param {String} event
     * @param {Object} data
     */
    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
    }

    assign(Hammer, {
        INPUT_START: INPUT_START,
        INPUT_MOVE: INPUT_MOVE,
        INPUT_END: INPUT_END,
        INPUT_CANCEL: INPUT_CANCEL,

        STATE_POSSIBLE: STATE_POSSIBLE,
        STATE_BEGAN: STATE_BEGAN,
        STATE_CHANGED: STATE_CHANGED,
        STATE_ENDED: STATE_ENDED,
        STATE_RECOGNIZED: STATE_RECOGNIZED,
        STATE_CANCELLED: STATE_CANCELLED,
        STATE_FAILED: STATE_FAILED,

        DIRECTION_NONE: DIRECTION_NONE,
        DIRECTION_LEFT: DIRECTION_LEFT,
        DIRECTION_RIGHT: DIRECTION_RIGHT,
        DIRECTION_UP: DIRECTION_UP,
        DIRECTION_DOWN: DIRECTION_DOWN,
        DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL: DIRECTION_VERTICAL,
        DIRECTION_ALL: DIRECTION_ALL,

        Manager: Manager,
        Input: Input,
        TouchAction: TouchAction,

        TouchInput: TouchInput,
        MouseInput: MouseInput,
        PointerEventInput: PointerEventInput,
        TouchMouseInput: TouchMouseInput,
        SingleTouchInput: SingleTouchInput,

        Recognizer: Recognizer,
        AttrRecognizer: AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,

        on: addEventListeners,
        off: removeEventListeners,
        each: each,
        merge: merge,
        extend: extend,
        assign: assign,
        inherit: inherit,
        bindFn: bindFn,
        prefixed: prefixed
    });

    // this prevents errors when Hammer is loaded in the presence of an AMD
    //  style loader but by script tag, not by the loader.
    var freeGlobal = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}; // jshint ignore:line
    freeGlobal.Hammer = Hammer;

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return Hammer;
        }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = Hammer;
    } else {
        window[exportName] = Hammer;
    }
})(window, document, 'Hammer');

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jquery = __webpack_require__(12);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = $(document).ready(function () {

	// Navbar circles click
	var navbarClicked = false;

	$('#navbar a').click(function (e) {
		var $this = $(this);

		e.preventDefault();

		// Set boolean so waypoints are ignored
		navbarClicked = true;

		// Remove all active classes from circles
		$('#navbar a').removeClass('active');

		// Set clicked circle as active and visited before anything else
		$this.addClass('active visited');

		// Set previous to visited, set next as not visited
		$this.parent().prevAll().find('a').addClass('visited');
		$this.parent().nextAll().find('a').removeClass('visited');

		// Scroll document to top of clicked section
		$('html,body').animate({ scrollTop: $($this.attr('href')).offset().top }, 'fast', function () {
			window.location.hash = $this.attr('href');

			// Remove boolean check after delay, so waypoints doesn't get there first
			window.setTimeout(function () {
				navbarClicked = false;
			}, 100);
		});
	});

	// Waypoints for navbar circles
	$('h2').waypoint({
		handler: function handler(direction) {
			// Don't fire if navbar has been clicked
			if (!navbarClicked) {
				var $navcircle = $('#navbar a[href="#' + this.element.id + '"');
				var $previousNavcircle = $navcircle.parent().prev().find('a');

				if (direction == 'down') {
					$('#navbar a').removeClass('active');
					$navcircle.addClass('active visited');
				} else {
					$previousNavcircle.addClass('active');
					$navcircle.removeClass('active visited');
				}
			}
		},
		offset: '40%'
	});
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {

/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
(function () {
  'use strict';

  var keyCounter = 0;
  var allWaypoints = {};

  /* http://imakewebthings.com/waypoints/api/waypoint */
  function Waypoint(options) {
    if (!options) {
      throw new Error('No options passed to Waypoint constructor');
    }
    if (!options.element) {
      throw new Error('No element option passed to Waypoint constructor');
    }
    if (!options.handler) {
      throw new Error('No handler option passed to Waypoint constructor');
    }

    this.key = 'waypoint-' + keyCounter;
    this.options = Waypoint.Adapter.extend({}, Waypoint.defaults, options);
    this.element = this.options.element;
    this.adapter = new Waypoint.Adapter(this.element);
    this.callback = options.handler;
    this.axis = this.options.horizontal ? 'horizontal' : 'vertical';
    this.enabled = this.options.enabled;
    this.triggerPoint = null;
    this.group = Waypoint.Group.findOrCreate({
      name: this.options.group,
      axis: this.axis
    });
    this.context = Waypoint.Context.findOrCreateByElement(this.options.context);

    if (Waypoint.offsetAliases[this.options.offset]) {
      this.options.offset = Waypoint.offsetAliases[this.options.offset];
    }
    this.group.add(this);
    this.context.add(this);
    allWaypoints[this.key] = this;
    keyCounter += 1;
  }

  /* Private */
  Waypoint.prototype.queueTrigger = function (direction) {
    this.group.queueTrigger(this, direction);
  };

  /* Private */
  Waypoint.prototype.trigger = function (args) {
    if (!this.enabled) {
      return;
    }
    if (this.callback) {
      this.callback.apply(this, args);
    }
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy */
  Waypoint.prototype.destroy = function () {
    this.context.remove(this);
    this.group.remove(this);
    delete allWaypoints[this.key];
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable */
  Waypoint.prototype.disable = function () {
    this.enabled = false;
    return this;
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable */
  Waypoint.prototype.enable = function () {
    this.context.refresh();
    this.enabled = true;
    return this;
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/next */
  Waypoint.prototype.next = function () {
    return this.group.next(this);
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/previous */
  Waypoint.prototype.previous = function () {
    return this.group.previous(this);
  };

  /* Private */
  Waypoint.invokeAll = function (method) {
    var allWaypointsArray = [];
    for (var waypointKey in allWaypoints) {
      allWaypointsArray.push(allWaypoints[waypointKey]);
    }
    for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
      allWaypointsArray[i][method]();
    }
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/destroy-all */
  Waypoint.destroyAll = function () {
    Waypoint.invokeAll('destroy');
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/disable-all */
  Waypoint.disableAll = function () {
    Waypoint.invokeAll('disable');
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/enable-all */
  Waypoint.enableAll = function () {
    Waypoint.Context.refreshAll();
    for (var waypointKey in allWaypoints) {
      allWaypoints[waypointKey].enabled = true;
    }
    return this;
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/refresh-all */
  Waypoint.refreshAll = function () {
    Waypoint.Context.refreshAll();
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-height */
  Waypoint.viewportHeight = function () {
    return window.innerHeight || document.documentElement.clientHeight;
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/viewport-width */
  Waypoint.viewportWidth = function () {
    return document.documentElement.clientWidth;
  };

  Waypoint.adapters = [];

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    group: 'default',
    horizontal: false,
    offset: 0
  };

  Waypoint.offsetAliases = {
    'bottom-in-view': function bottomInView() {
      return this.context.innerHeight() - this.adapter.outerHeight();
    },
    'right-in-view': function rightInView() {
      return this.context.innerWidth() - this.adapter.outerWidth();
    }
  };

  window.Waypoint = Waypoint;
})();(function () {
  'use strict';

  function requestAnimationFrameShim(callback) {
    window.setTimeout(callback, 1000 / 60);
  }

  var keyCounter = 0;
  var contexts = {};
  var Waypoint = window.Waypoint;
  var oldWindowLoad = window.onload;

  /* http://imakewebthings.com/waypoints/api/context */
  function Context(element) {
    this.element = element;
    this.Adapter = Waypoint.Adapter;
    this.adapter = new this.Adapter(element);
    this.key = 'waypoint-context-' + keyCounter;
    this.didScroll = false;
    this.didResize = false;
    this.oldScroll = {
      x: this.adapter.scrollLeft(),
      y: this.adapter.scrollTop()
    };
    this.waypoints = {
      vertical: {},
      horizontal: {}
    };

    element.waypointContextKey = this.key;
    contexts[element.waypointContextKey] = this;
    keyCounter += 1;
    if (!Waypoint.windowContext) {
      Waypoint.windowContext = true;
      Waypoint.windowContext = new Context(window);
    }

    this.createThrottledScrollHandler();
    this.createThrottledResizeHandler();
  }

  /* Private */
  Context.prototype.add = function (waypoint) {
    var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical';
    this.waypoints[axis][waypoint.key] = waypoint;
    this.refresh();
  };

  /* Private */
  Context.prototype.checkEmpty = function () {
    var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal);
    var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical);
    var isWindow = this.element == this.element.window;
    if (horizontalEmpty && verticalEmpty && !isWindow) {
      this.adapter.off('.waypoints');
      delete contexts[this.key];
    }
  };

  /* Private */
  Context.prototype.createThrottledResizeHandler = function () {
    var self = this;

    function resizeHandler() {
      self.handleResize();
      self.didResize = false;
    }

    this.adapter.on('resize.waypoints', function () {
      if (!self.didResize) {
        self.didResize = true;
        Waypoint.requestAnimationFrame(resizeHandler);
      }
    });
  };

  /* Private */
  Context.prototype.createThrottledScrollHandler = function () {
    var self = this;
    function scrollHandler() {
      self.handleScroll();
      self.didScroll = false;
    }

    this.adapter.on('scroll.waypoints', function () {
      if (!self.didScroll || Waypoint.isTouch) {
        self.didScroll = true;
        Waypoint.requestAnimationFrame(scrollHandler);
      }
    });
  };

  /* Private */
  Context.prototype.handleResize = function () {
    Waypoint.Context.refreshAll();
  };

  /* Private */
  Context.prototype.handleScroll = function () {
    var triggeredGroups = {};
    var axes = {
      horizontal: {
        newScroll: this.adapter.scrollLeft(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left'
      },
      vertical: {
        newScroll: this.adapter.scrollTop(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up'
      }
    };

    for (var axisKey in axes) {
      var axis = axes[axisKey];
      var isForward = axis.newScroll > axis.oldScroll;
      var direction = isForward ? axis.forward : axis.backward;

      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey];
        if (waypoint.triggerPoint === null) {
          continue;
        }
        var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint;
        var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint;
        var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint;
        var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint;
        if (crossedForward || crossedBackward) {
          waypoint.queueTrigger(direction);
          triggeredGroups[waypoint.group.id] = waypoint.group;
        }
      }
    }

    for (var groupKey in triggeredGroups) {
      triggeredGroups[groupKey].flushTriggers();
    }

    this.oldScroll = {
      x: axes.horizontal.newScroll,
      y: axes.vertical.newScroll
    };
  };

  /* Private */
  Context.prototype.innerHeight = function () {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportHeight();
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerHeight();
  };

  /* Private */
  Context.prototype.remove = function (waypoint) {
    delete this.waypoints[waypoint.axis][waypoint.key];
    this.checkEmpty();
  };

  /* Private */
  Context.prototype.innerWidth = function () {
    /*eslint-disable eqeqeq */
    if (this.element == this.element.window) {
      return Waypoint.viewportWidth();
    }
    /*eslint-enable eqeqeq */
    return this.adapter.innerWidth();
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-destroy */
  Context.prototype.destroy = function () {
    var allWaypoints = [];
    for (var axis in this.waypoints) {
      for (var waypointKey in this.waypoints[axis]) {
        allWaypoints.push(this.waypoints[axis][waypointKey]);
      }
    }
    for (var i = 0, end = allWaypoints.length; i < end; i++) {
      allWaypoints[i].destroy();
    }
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-refresh */
  Context.prototype.refresh = function () {
    /*eslint-disable eqeqeq */
    var isWindow = this.element == this.element.window;
    /*eslint-enable eqeqeq */
    var contextOffset = isWindow ? undefined : this.adapter.offset();
    var triggeredGroups = {};
    var axes;

    this.handleScroll();
    axes = {
      horizontal: {
        contextOffset: isWindow ? 0 : contextOffset.left,
        contextScroll: isWindow ? 0 : this.oldScroll.x,
        contextDimension: this.innerWidth(),
        oldScroll: this.oldScroll.x,
        forward: 'right',
        backward: 'left',
        offsetProp: 'left'
      },
      vertical: {
        contextOffset: isWindow ? 0 : contextOffset.top,
        contextScroll: isWindow ? 0 : this.oldScroll.y,
        contextDimension: this.innerHeight(),
        oldScroll: this.oldScroll.y,
        forward: 'down',
        backward: 'up',
        offsetProp: 'top'
      }
    };

    for (var axisKey in axes) {
      var axis = axes[axisKey];
      for (var waypointKey in this.waypoints[axisKey]) {
        var waypoint = this.waypoints[axisKey][waypointKey];
        var adjustment = waypoint.options.offset;
        var oldTriggerPoint = waypoint.triggerPoint;
        var elementOffset = 0;
        var freshWaypoint = oldTriggerPoint == null;
        var contextModifier, wasBeforeScroll, nowAfterScroll;
        var triggeredBackward, triggeredForward;

        if (waypoint.element !== waypoint.element.window) {
          elementOffset = waypoint.adapter.offset()[axis.offsetProp];
        }

        if (typeof adjustment === 'function') {
          adjustment = adjustment.apply(waypoint);
        } else if (typeof adjustment === 'string') {
          adjustment = parseFloat(adjustment);
          if (waypoint.options.offset.indexOf('%') > -1) {
            adjustment = Math.ceil(axis.contextDimension * adjustment / 100);
          }
        }

        contextModifier = axis.contextScroll - axis.contextOffset;
        waypoint.triggerPoint = Math.floor(elementOffset + contextModifier - adjustment);
        wasBeforeScroll = oldTriggerPoint < axis.oldScroll;
        nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll;
        triggeredBackward = wasBeforeScroll && nowAfterScroll;
        triggeredForward = !wasBeforeScroll && !nowAfterScroll;

        if (!freshWaypoint && triggeredBackward) {
          waypoint.queueTrigger(axis.backward);
          triggeredGroups[waypoint.group.id] = waypoint.group;
        } else if (!freshWaypoint && triggeredForward) {
          waypoint.queueTrigger(axis.forward);
          triggeredGroups[waypoint.group.id] = waypoint.group;
        } else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
          waypoint.queueTrigger(axis.forward);
          triggeredGroups[waypoint.group.id] = waypoint.group;
        }
      }
    }

    Waypoint.requestAnimationFrame(function () {
      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers();
      }
    });

    return this;
  };

  /* Private */
  Context.findOrCreateByElement = function (element) {
    return Context.findByElement(element) || new Context(element);
  };

  /* Private */
  Context.refreshAll = function () {
    for (var contextId in contexts) {
      contexts[contextId].refresh();
    }
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/context-find-by-element */
  Context.findByElement = function (element) {
    return contexts[element.waypointContextKey];
  };

  window.onload = function () {
    if (oldWindowLoad) {
      oldWindowLoad();
    }
    Context.refreshAll();
  };

  Waypoint.requestAnimationFrame = function (callback) {
    var requestFn = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || requestAnimationFrameShim;
    requestFn.call(window, callback);
  };
  Waypoint.Context = Context;
})();(function () {
  'use strict';

  function byTriggerPoint(a, b) {
    return a.triggerPoint - b.triggerPoint;
  }

  function byReverseTriggerPoint(a, b) {
    return b.triggerPoint - a.triggerPoint;
  }

  var groups = {
    vertical: {},
    horizontal: {}
  };
  var Waypoint = window.Waypoint;

  /* http://imakewebthings.com/waypoints/api/group */
  function Group(options) {
    this.name = options.name;
    this.axis = options.axis;
    this.id = this.name + '-' + this.axis;
    this.waypoints = [];
    this.clearTriggerQueues();
    groups[this.axis][this.name] = this;
  }

  /* Private */
  Group.prototype.add = function (waypoint) {
    this.waypoints.push(waypoint);
  };

  /* Private */
  Group.prototype.clearTriggerQueues = function () {
    this.triggerQueues = {
      up: [],
      down: [],
      left: [],
      right: []
    };
  };

  /* Private */
  Group.prototype.flushTriggers = function () {
    for (var direction in this.triggerQueues) {
      var waypoints = this.triggerQueues[direction];
      var reverse = direction === 'up' || direction === 'left';
      waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint);
      for (var i = 0, end = waypoints.length; i < end; i += 1) {
        var waypoint = waypoints[i];
        if (waypoint.options.continuous || i === waypoints.length - 1) {
          waypoint.trigger([direction]);
        }
      }
    }
    this.clearTriggerQueues();
  };

  /* Private */
  Group.prototype.next = function (waypoint) {
    this.waypoints.sort(byTriggerPoint);
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
    var isLast = index === this.waypoints.length - 1;
    return isLast ? null : this.waypoints[index + 1];
  };

  /* Private */
  Group.prototype.previous = function (waypoint) {
    this.waypoints.sort(byTriggerPoint);
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
    return index ? this.waypoints[index - 1] : null;
  };

  /* Private */
  Group.prototype.queueTrigger = function (waypoint, direction) {
    this.triggerQueues[direction].push(waypoint);
  };

  /* Private */
  Group.prototype.remove = function (waypoint) {
    var index = Waypoint.Adapter.inArray(waypoint, this.waypoints);
    if (index > -1) {
      this.waypoints.splice(index, 1);
    }
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/first */
  Group.prototype.first = function () {
    return this.waypoints[0];
  };

  /* Public */
  /* http://imakewebthings.com/waypoints/api/last */
  Group.prototype.last = function () {
    return this.waypoints[this.waypoints.length - 1];
  };

  /* Private */
  Group.findOrCreate = function (options) {
    return groups[options.axis][options.name] || new Group(options);
  };

  Waypoint.Group = Group;
})();(function () {
  'use strict';

  var $ = __webpack_provided_window_dot_jQuery;
  var Waypoint = window.Waypoint;

  function JQueryAdapter(element) {
    this.$element = $(element);
  }

  $.each(['innerHeight', 'innerWidth', 'off', 'offset', 'on', 'outerHeight', 'outerWidth', 'scrollLeft', 'scrollTop'], function (i, method) {
    JQueryAdapter.prototype[method] = function () {
      var args = Array.prototype.slice.call(arguments);
      return this.$element[method].apply(this.$element, args);
    };
  });

  $.each(['extend', 'inArray', 'isEmptyObject'], function (i, method) {
    JQueryAdapter[method] = $[method];
  });

  Waypoint.adapters.push({
    name: 'jquery',
    Adapter: JQueryAdapter
  });
  Waypoint.Adapter = JQueryAdapter;
})();(function () {
  'use strict';

  var Waypoint = window.Waypoint;

  function createExtension(framework) {
    return function () {
      var waypoints = [];
      var overrides = arguments[0];

      if (framework.isFunction(arguments[0])) {
        overrides = framework.extend({}, arguments[1]);
        overrides.handler = arguments[0];
      }

      this.each(function () {
        var options = framework.extend({}, overrides, {
          element: this
        });
        if (typeof options.context === 'string') {
          options.context = framework(this).closest(options.context)[0];
        }
        waypoints.push(new Waypoint(options));
      });

      return waypoints;
    };
  }

  if (__webpack_provided_window_dot_jQuery) {
    __webpack_provided_window_dot_jQuery.fn.waypoint = createExtension(__webpack_provided_window_dot_jQuery);
  }
  if (window.Zepto) {
    window.Zepto.fn.waypoint = createExtension(window.Zepto);
  }
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
var moves = {};

exports.default = $(document).ready(function () {

	// Notation page buttons
	$('.notation-buttons a').click(function () {
		var $this = $(this);
		var roofpigId = $this.parent().siblings('.roofpig').data('cube-id') - 1;

		// Use data-move if available
		var move = $this.data('move') ? $this.data('move') : $this.text();

		// Record moves for reset button
		if (!moves[roofpigId]) {
			moves[roofpigId] = [];
		}

		moves[roofpigId].push(move);

		var cubeMove = new CompositeMove(move, roofpigs[roofpigId].world3d, 400).show_do();
		roofpigs[roofpigId].add_changer('pieces', cubeMove);
	});

	// Reset button
	$('.notation-buttons button').click(function () {
		var roofpigId = $(this).siblings('.roofpig').data('cube-id') - 1;

		// First check if any moves have been performed on the cube
		if (moves[roofpigId] && moves[roofpigId].length > 0) {
			// Reverse each recorded move to reset back to default state
			moves[roofpigId].reverse().forEach(function (move) {
				var cubeMove = new CompositeMove(move, roofpigs[roofpigId].world3d, 400).undo();
				roofpigs[roofpigId].add_changer('pieces', cubeMove);
			});

			// Reset recorded moves
			moves[roofpigId] = [];
		}
	});
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _whatInput = __webpack_require__(15);

var _whatInput2 = _interopRequireDefault(_whatInput);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Places the popup above the given span, ensuring it stays within document bounds
function placePopup(span) {
	if ($('body').hasClass('show-popup')) {
		var $popup = $('#popup');

		// Set popup title to hovered text
		$('#popup span').text(span.text());

		// Set image from data-popup
		$('#popup img').attr('src', 'img/cubes/' + span.data('popup') + '.png');

		// Left align popup above text so it doesn't overlap algorithm images
		var left = span.offset().left;

		// Ensure popup doesn't go over edge of window
		if (left + $popup.outerWidth() + 2 > $(window).width()) {
			left = $(window).width() - $popup.outerWidth() - 2;
		}

		// Show the popup and set position
		$popup.addClass('show').css('left', left).css('top', span.offset().top + span.outerHeight() + 5);
	}
}

// Moves the popup to the given algorithm step and highlights
function algorithmStep(span) {
	if (span.prop('tagName') == 'SPAN') {
		$('.alg span.highlighted').removeClass('highlighted');
		span.addClass('highlighted');
		placePopup(span);
	}
}

exports.default = $(document).ready(function () {

	// Algorithm helper switch
	$('#popupSwitch').click(function () {
		if (this.checked) {
			$('body').addClass('show-popup');
		} else {
			$('body').removeClass('show-popup');
		}
	});

	var $hoveredAlg = void 0;
	var popupTimeout = void 0;

	// Algorithm helper popup
	$('.alg .steps span').hover(function () {
		var $this = $(this);

		// Save reference to hovered span for keybindings
		$hoveredAlg = $this;

		clearTimeout(popupTimeout);

		// Place popup only if no algs are highlighted, to stop popup from moving on mouseout
		if ($('.alg span.highlighted').length === 0) {
			placePopup($this);
		}
	}).mouseout(function () {
		// Hide popup and remove image on mouseout
		popupTimeout = window.setTimeout(function () {
			if (!$('#popup').hasClass('hovered')) {
				$('#popup').removeClass('show');
				$('#popup img').attr('src', '');
				$('.alg span.highlighted').removeClass('highlighted');
			}
		}, 300);
	});

	// Left/right keybindings for moving popup through algorithm
	$(document).keyup(function (e) {
		if ($('#popup').hasClass('show')) {
			var $span = void 0;

			// Left
			if (e.which == 37) {
				$span = $hoveredAlg.prev();
			}
			// Right
			else if (e.which == 39) {
					$span = $hoveredAlg.next();
				}

			if ($span.length) {
				$hoveredAlg = $span;
				algorithmStep($span);
			}
		}
	});

	// If input is touch, clicking on popup moves through algorithm
	$('#popup').hover(function () {
		if (_whatInput2.default.ask() === 'touch') {
			$('#popup').addClass('hovered');
		}
	}).click(function () {
		if (_whatInput2.default.ask() === 'touch') {
			var $next = $hoveredAlg.next();

			if ($next.length) {
				$hoveredAlg = $next;
				algorithmStep($next);
			}
		}
	}).mouseout(function () {
		$('#popup').removeClass('show');
		$('#popup img').attr('src', '');
		$('.alg span.highlighted').removeClass('highlighted');
	});
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * what-input - A global utility for tracking the current input method (mouse, keyboard or touch).
 * @version v4.3.1
 * @link https://github.com/ten1seven/what-input
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("whatInput", [], factory);
	else if(typeof exports === 'object')
		exports["whatInput"] = factory();
	else
		root["whatInput"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  /*
	   * variables
	   */

	  // last used input type
	  var currentInput = 'initial';

	  // last used input intent
	  var currentIntent = null;

	  // cache document.documentElement
	  var doc = document.documentElement;

	  // form input types
	  var formInputs = ['input', 'select', 'textarea'];

	  var functionList = [];

	  // list of modifier keys commonly used with the mouse and
	  // can be safely ignored to prevent false keyboard detection
	  var ignoreMap = [16, // shift
	  17, // control
	  18, // alt
	  91, // Windows key / left Apple cmd
	  93 // Windows menu / right Apple cmd
	  ];

	  // list of keys for which we change intent even for form inputs
	  var changeIntentMap = [9 // tab
	  ];

	  // mapping of events to input types
	  var inputMap = {
	    keydown: 'keyboard',
	    keyup: 'keyboard',
	    mousedown: 'mouse',
	    mousemove: 'mouse',
	    MSPointerDown: 'pointer',
	    MSPointerMove: 'pointer',
	    pointerdown: 'pointer',
	    pointermove: 'pointer',
	    touchstart: 'touch'
	  };

	  // array of all used input types
	  var inputTypes = [];

	  // boolean: true if touch buffer is active
	  var isBuffering = false;

	  // boolean: true if the page is being scrolled
	  var isScrolling = false;

	  // store current mouse position
	  var mousePos = {
	    x: null,
	    y: null
	  };

	  // map of IE 10 pointer events
	  var pointerMap = {
	    2: 'touch',
	    3: 'touch', // treat pen like touch
	    4: 'mouse'
	  };

	  var supportsPassive = false;

	  try {
	    var opts = Object.defineProperty({}, 'passive', {
	      get: function get() {
	        supportsPassive = true;
	      }
	    });

	    window.addEventListener('test', null, opts);
	  } catch (e) {}

	  /*
	   * set up
	   */

	  var setUp = function setUp() {
	    // add correct mouse wheel event mapping to `inputMap`
	    inputMap[detectWheel()] = 'mouse';

	    addListeners();
	    setInput();
	  };

	  /*
	   * events
	   */

	  var addListeners = function addListeners() {
	    // `pointermove`, `MSPointerMove`, `mousemove` and mouse wheel event binding
	    // can only demonstrate potential, but not actual, interaction
	    // and are treated separately
	    var options = supportsPassive ? { passive: true } : false;

	    // pointer events (mouse, pen, touch)
	    if (window.PointerEvent) {
	      doc.addEventListener('pointerdown', updateInput);
	      doc.addEventListener('pointermove', setIntent);
	    } else if (window.MSPointerEvent) {
	      doc.addEventListener('MSPointerDown', updateInput);
	      doc.addEventListener('MSPointerMove', setIntent);
	    } else {
	      // mouse events
	      doc.addEventListener('mousedown', updateInput);
	      doc.addEventListener('mousemove', setIntent);

	      // touch events
	      if ('ontouchstart' in window) {
	        doc.addEventListener('touchstart', touchBuffer, options);
	        doc.addEventListener('touchend', touchBuffer);
	      }
	    }

	    // mouse wheel
	    doc.addEventListener(detectWheel(), setIntent, options);

	    // keyboard events
	    doc.addEventListener('keydown', updateInput);
	    doc.addEventListener('keyup', updateInput);
	  };

	  // checks conditions before updating new input
	  var updateInput = function updateInput(event) {
	    // only execute if the touch buffer timer isn't running
	    if (!isBuffering) {
	      var eventKey = event.which;
	      var value = inputMap[event.type];
	      if (value === 'pointer') value = pointerType(event);

	      if (currentInput !== value || currentIntent !== value) {
	        var activeElem = document.activeElement;
	        var activeInput = false;
	        var notFormInput = activeElem && activeElem.nodeName && formInputs.indexOf(activeElem.nodeName.toLowerCase()) === -1;

	        if (notFormInput || changeIntentMap.indexOf(eventKey) !== -1) {
	          activeInput = true;
	        }

	        if (value === 'touch' ||
	        // ignore mouse modifier keys
	        value === 'mouse' ||
	        // don't switch if the current element is a form input
	        value === 'keyboard' && eventKey && activeInput && ignoreMap.indexOf(eventKey) === -1) {
	          // set the current and catch-all variable
	          currentInput = currentIntent = value;

	          setInput();
	        }
	      }
	    }
	  };

	  // updates the doc and `inputTypes` array with new input
	  var setInput = function setInput() {
	    doc.setAttribute('data-whatinput', currentInput);
	    doc.setAttribute('data-whatintent', currentInput);

	    if (inputTypes.indexOf(currentInput) === -1) {
	      inputTypes.push(currentInput);
	      doc.className += ' whatinput-types-' + currentInput;
	    }

	    fireFunctions('input');
	  };

	  // updates input intent for `mousemove` and `pointermove`
	  var setIntent = function setIntent(event) {
	    // test to see if `mousemove` happened relative to the screen
	    // to detect scrolling versus mousemove
	    if (mousePos['x'] !== event.screenX || mousePos['y'] !== event.screenY) {
	      isScrolling = false;

	      mousePos['x'] = event.screenX;
	      mousePos['y'] = event.screenY;
	    } else {
	      isScrolling = true;
	    }

	    // only execute if the touch buffer timer isn't running
	    // or scrolling isn't happening
	    if (!isBuffering && !isScrolling) {
	      var value = inputMap[event.type];
	      if (value === 'pointer') value = pointerType(event);

	      if (currentIntent !== value) {
	        currentIntent = value;

	        doc.setAttribute('data-whatintent', currentIntent);

	        fireFunctions('intent');
	      }
	    }
	  };

	  // buffers touch events because they frequently also fire mouse events
	  var touchBuffer = function touchBuffer(event) {
	    if (event.type === 'touchstart') {
	      isBuffering = false;

	      // set the current input
	      updateInput(event);
	    } else {
	      isBuffering = true;
	    }
	  };

	  var fireFunctions = function fireFunctions(type) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].type === type) {
	        functionList[i].fn.call(undefined, currentIntent);
	      }
	    }
	  };

	  /*
	   * utilities
	   */

	  var pointerType = function pointerType(event) {
	    if (typeof event.pointerType === 'number') {
	      return pointerMap[event.pointerType];
	    } else {
	      // treat pen like touch
	      return event.pointerType === 'pen' ? 'touch' : event.pointerType;
	    }
	  };

	  // detect version of mouse wheel event to use
	  // via https://developer.mozilla.org/en-US/docs/Web/Events/wheel
	  var detectWheel = function detectWheel() {
	    var wheelType = void 0;

	    // Modern browsers support "wheel"
	    if ('onwheel' in document.createElement('div')) {
	      wheelType = 'wheel';
	    } else {
	      // Webkit and IE support at least "mousewheel"
	      // or assume that remaining browsers are older Firefox
	      wheelType = document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
	    }

	    return wheelType;
	  };

	  var objPos = function objPos(match) {
	    for (var i = 0, len = functionList.length; i < len; i++) {
	      if (functionList[i].fn === match) {
	        return i;
	      }
	    }
	  };

	  /*
	   * init
	   */

	  // don't start script unless browser cuts the mustard
	  // (also passes if polyfills are used)
	  if ('addEventListener' in window && Array.prototype.indexOf) {
	    setUp();
	  }

	  /*
	   * api
	   */

	  return {
	    // returns string: the current input type
	    // opt: 'loose'|'strict'
	    // 'strict' (default): returns the same value as the `data-whatinput` attribute
	    // 'loose': includes `data-whatintent` value if it's more current than `data-whatinput`
	    ask: function ask(opt) {
	      return opt === 'loose' ? currentIntent : currentInput;
	    },

	    // returns array: all the detected input types
	    types: function types() {
	      return inputTypes;
	    },

	    // overwrites ignored keys with provided array
	    ignoreKeys: function ignoreKeys(arr) {
	      ignoreMap = arr;
	    },

	    // attach functions to input and intent "events"
	    // funct: function to fire on change
	    // eventType: 'input'|'intent'
	    registerOnChange: function registerOnChange(fn, eventType) {
	      functionList.push({
	        fn: fn,
	        type: eventType || 'input'
	      });
	    },

	    unRegisterOnChange: function unRegisterOnChange(fn) {
	      var position = objPos(fn);

	      if (position) {
	        functionList.splice(position, 1);
	      }
	    }
	  };
	}();

/***/ }
/******/ ])
});
;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scramble = __webpack_require__(17);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stopwatch = function () {
	function Stopwatch() {
		_classCallCheck(this, Stopwatch);

		this.startedAt = 0;
		this.running = false;
	}

	_createClass(Stopwatch, [{
		key: 'start',
		value: function start() {
			this.startedAt = Date.now();
			this.running = true;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.startedAt = 0;
		}
	}, {
		key: 'elapsedTime',
		get: function get() {
			return this.startedAt ? Date.now() - this.startedAt : 0;
		}
	}]);

	return Stopwatch;
}();

var DELETE_TIME_LINK = '<a title="Delete this time">&#x2716;</a>';

var stopwatch = new Stopwatch();
var times = [];
var displayInterval = void 0;
var inspectionInterval = void 0;

var $display = $('#time');
var $times = $('#times ol');

var shortBeep = new Audio('sounds/shortbeep.wav');
var longBeep = new Audio('sounds/longbeep.wav');

// User interaction with timer
function activateTimer() {
	// If timer is running, stop and record time
	if (stopwatch.running) {
		// First save recorded time
		var time = stopwatch.elapsedTime;

		// Set new scramble
		$('#scramble').text((0, _scramble.generateScramble)());

		// Only record time if >0, so after inspection time
		if (time > 0) {
			clearInterval(displayInterval);
			// Update display to recorded time to avoid incongruity
			updateDisplay(time);
			stopwatch.running = false;

			// Add to times list and scroll to bottom
			times.push(time);
			$times.append('<li>' + formatTime(time) + DELETE_TIME_LINK + '</li>');
			$times[0].scrollTop = $times[0].scrollHeight;

			updateStats();
			saveTimes();
		}
		// Stop inspection time and grey display
		else {
				stopwatch.running = false;
				clearInterval(inspectionInterval);
				$display.addClass('paused');
			}
	}
	// If not already running, ungrey display and check for inspection time
	else {
			$display.removeClass('paused');

			var inspection = $('#inspection').val();
			if (inspection != '0') {
				// Reset timer
				stopwatch.reset();

				// Briefly clear display before showing inspection time
				$display.html('&nbsp;');
				setTimeout(function () {
					$display.text(inspection);
				}, 80);

				// Play first beep if starting at 3 seconds
				if (inspection == 3) {
					playSound(shortBeep);
				}

				// Start timer counting down inspection time
				stopwatch.running = true;
				inspectionInterval = setInterval(function () {
					var newTime = $display.text() - 1;
					$display.text(newTime);

					// At 0, stop inspection time and start stopwatch
					if (newTime == 0) {
						clearInterval(inspectionInterval);
						startStopwatch();
						playSound(longBeep);
					} else if (newTime <= 3) {
						playSound(shortBeep);
					}
				}, 1000);
			} else {
				startStopwatch();
			}
		}
}

// Start timing and update display every 10 milliseconds
function startStopwatch() {
	stopwatch.reset();
	stopwatch.start();
	displayInterval = setInterval(updateDisplay, 10);
}

// Update main timer display to either given time or elapsed time
function updateDisplay(time) {
	var time = parseTime(time || stopwatch.elapsedTime);

	$display.html(time.m + '<span class="colon">:</span>' + zeroPad(time.s, 2) + '<span class="small">' + zeroPad(time.ms, 2) + '</span>');
}

// Use list of times to calculate stats
function updateStats() {
	var defaultTime = '&ndash;:&ndash;&ndash;.&ndash;&ndash;';
	if (times.length == 0) {
		$('#stats td[id]').html(defaultTime);
	} else {
		var total = 0,
		    minimum = times[0],
		    maximum = times[0],
		    trimmedTotal = 0;

		for (var i = 0; i < times.length; i++) {
			total += times[i];

			if (times[i] < minimum) {
				minimum = times[i];
			} else if (times[i] > maximum) {
				maximum = times[i];
			}
		}

		// Calculate trimmed average
		if (times.length >= 3) {
			// Copy and sort times and remove first and last
			var trimmedTimes = times.slice(0).sort(function (a, b) {
				return a - b;
			}).slice(1, -1);

			for (var i = 0; i < trimmedTimes.length; i++) {
				trimmedTotal += trimmedTimes[i];
			}

			$('#trimmed').html(formatTime(trimmedTotal / trimmedTimes.length));
		}
		// If too few times, reset timed average
		else {
				$('#trimmed').html(defaultTime);
			}

		$('#average').html(formatTime(total / times.length));
		$('#best').html(formatTime(minimum));
		$('#worst').html(formatTime(maximum));
	}
}

// Play given sound if enabled
function playSound(sound) {
	if (document.getElementById('soundToggle').checked) {
		sound.play();
	}
}

// Split time int into object containing minutes, seconds, and milliseconds
function parseTime(time) {
	var m = 0;
	var s = 0;
	var ms = 0;

	m = Math.floor(time / (60 * 1000));
	time = time % (60 * 1000);

	s = Math.floor(time / 1000);
	time = time % 1000;

	ms = Math.floor(time / 10);

	return {
		'm': m,
		's': s,
		'ms': ms
	};
}

// Returns formatted time string
function formatTime(time) {
	var parsedTime = parseTime(time);
	return parsedTime.m + ':' + zeroPad(parsedTime.s, 2) + '.' + zeroPad(parsedTime.ms, 2);
}

// Left pad number with zeroes to given size
function zeroPad(num, size) {
	var s = '00000' + num;
	return s.substr(s.length - size);
}

// Save times into local storage
function saveTimes() {
	localStorage.setItem('times', JSON.stringify(times));
}

exports.default = $(document).ready(function () {

	if ($('#timer').length > 0) {

		// Set initial scramble
		$('#scramble').text((0, _scramble.generateScramble)());

		// Activate timer on click
		$('#time').click(function () {
			activateTimer();
		});

		// Activate timer on spacebar
		$(document).keyup(function (e) {
			if (e.which == 32) {
				e.preventDefault();
				activateTimer();
			}
		});

		// Prevent spacebar from scrolling page
		$(document).keydown(function (e) {
			if (e.which == 32) {
				e.preventDefault();
			}
		});

		// Fullscreen button
		$('#fullscreen').click(function () {
			var $timeWrapper = document.getElementById('time-wrapper');

			if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
				if ($timeWrapper.requestFullscreen) {
					$timeWrapper.requestFullscreen();
				} else if ($timeWrapper.msRequestFullscreen) {
					$timeWrapper.msRequestFullscreen();
				} else if ($timeWrapper.mozRequestFullScreen) {
					$timeWrapper.mozRequestFullScreen();
				} else if ($timeWrapper.webkitRequestFullscreen) {
					$timeWrapper.webkitRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		});

		// Remove specific time
		$('#times').on('click', 'a', function () {
			var $li = $(this).parent();
			times.splice($li.index(), 1);
			$li.remove();
			updateStats();
			saveTimes();
		});

		// Clear times log
		$('#cleartimes').click(function () {
			if (times.length > 0 && confirm('Clear all times from log?')) {
				times = [];
				$('#times ol').empty();
				updateStats();
				saveTimes();
			}
		});

		// Restore saved times
		$(document).ready(function () {
			var storedTimes = localStorage.getItem('times');
			if (storedTimes) {
				times = JSON.parse(storedTimes);
				for (var i = 0; i < times.length; i++) {
					$times.append('<li>' + formatTime(times[i]) + DELETE_TIME_LINK + '</li>');
				}
				updateStats();
			}
		});
	}
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var MOVES = ['U', 'D', 'R', 'L', 'F', 'B'];
var MODIFIERS = ['', '2', "'"];
var SCRAMBLE_LENGTH = 20;

// Generate string of random-ish moves with random modifiers
function generateScramble() {
	var scramble = [];

	for (var i = 0; i < SCRAMBLE_LENGTH; i++) {
		// Remove last move from available moves before choosing
		var lastMove = scramble.length > 0 ? scramble[scramble.length - 1].charAt(0) : false;

		var availableMoves = MOVES.slice();
		if (lastMove) {
			// Remove last move from available choices
			availableMoves.splice(availableMoves.indexOf(lastMove), 1);

			// If last two moves are opposites of each other, remove both from available choices
			var penultimateMove = scramble.length >= 2 ? scramble[scramble.length - 2].charAt(0) : false;

			if (penultimateMove && oppositeFace(lastMove) == penultimateMove) {
				availableMoves.splice(availableMoves.indexOf(penultimateMove), 1);
			}
		}

		scramble.push(chooseRandom(availableMoves) + chooseRandom(MODIFIERS));
	}

	return scramble.join(' ');
}

// Helper function to choose a random item from an array
function chooseRandom(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Return opposite of given face
function oppositeFace(face) {
	var opposites = {
		U: 'D',
		D: 'U',
		R: 'L',
		L: 'R',
		F: 'B',
		B: 'F'
	};
	return opposites[face];
}

exports.generateScramble = generateScramble;

/***/ })
],[4]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLm1lZGlhUXVlcnkuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzIiwid2VicGFjazovLy8uL2FwcC5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi5jb3JlLmpzIiwid2VicGFjazovLy8vaG9tZS9tYXJrL1NpdGVzL3NvbHZldGhlY3ViZS9ub2RlX21vZHVsZXMvZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnV0aWwuY29yZS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2Zhc3RjbGljay9saWIvZmFzdGNsaWNrLmpzIiwid2VicGFjazovLy8uL21vZHVsZXMvYWxndGFibGVzLmpzIiwid2VicGFjazovLy8uL21vZHVsZXMvbWVudS5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2hhbW1lcmpzL2hhbW1lci5qcyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL25hdmJhci5qcyIsIndlYnBhY2s6Ly8vL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL3dheXBvaW50cy9saWIvanF1ZXJ5LndheXBvaW50cy5qcyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL25vdGF0aW9uLmpzIiwid2VicGFjazovLy8uL21vZHVsZXMvcG9wdXAuanMiLCJ3ZWJwYWNrOi8vLy9ob21lL21hcmsvU2l0ZXMvc29sdmV0aGVjdWJlL25vZGVfbW9kdWxlcy93aGF0LWlucHV0L2Rpc3Qvd2hhdC1pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9tb2R1bGVzL3RpbWVyLmpzIiwid2VicGFjazovLy8uL21vZHVsZXMvc2NyYW1ibGUuanMiXSwibmFtZXMiOlsiZGVmYXVsdFF1ZXJpZXMiLCJsYW5kc2NhcGUiLCJwb3J0cmFpdCIsInJldGluYSIsIm1hdGNoTWVkaWEiLCJ3aW5kb3ciLCJzdHlsZU1lZGlhIiwibWVkaWEiLCJzdHlsZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNjcmlwdCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaW5mbyIsInR5cGUiLCJpZCIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJnZXRDb21wdXRlZFN0eWxlIiwiY3VycmVudFN0eWxlIiwibWF0Y2hNZWRpdW0iLCJ0ZXh0Iiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJ0ZXh0Q29udGVudCIsIndpZHRoIiwibWF0Y2hlcyIsIk1lZGlhUXVlcnkiLCJxdWVyaWVzIiwiY3VycmVudCIsIl9pbml0Iiwic2VsZiIsIiRtZXRhIiwibGVuZ3RoIiwiYXBwZW5kVG8iLCJoZWFkIiwiZXh0cmFjdGVkU3R5bGVzIiwiY3NzIiwibmFtZWRRdWVyaWVzIiwicGFyc2VTdHlsZVRvT2JqZWN0Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJwdXNoIiwibmFtZSIsInZhbHVlIiwiX2dldEN1cnJlbnRTaXplIiwiX3dhdGNoZXIiLCJhdExlYXN0Iiwic2l6ZSIsInF1ZXJ5IiwiZ2V0IiwiaXMiLCJ0cmltIiwic3BsaXQiLCJpIiwibWF0Y2hlZCIsIm9mZiIsIm9uIiwibmV3U2l6ZSIsImN1cnJlbnRTaXplIiwidHJpZ2dlciIsInN0ciIsInN0eWxlT2JqZWN0Iiwic2xpY2UiLCJyZWR1Y2UiLCJyZXQiLCJwYXJhbSIsInBhcnRzIiwicmVwbGFjZSIsInZhbCIsImRlY29kZVVSSUNvbXBvbmVudCIsInVuZGVmaW5lZCIsIkFycmF5IiwiaXNBcnJheSIsImFkZFRvSnF1ZXJ5IiwiJCIsImZvdW5kYXRpb24iLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoIiwiYm9keSIsIiR0b3BidXR0b24iLCJjbGljayIsImFuaW1hdGUiLCJzY3JvbGxUb3AiLCJzY3JvbGwiLCJmYWRlSW4iLCJmYWRlT3V0IiwicmFjaGVsIiwiaGFycnkiLCJzZWNyZXRzIiwiYXRvYiIsImRlY29kZVVSSSIsImNvbnNvbGUiLCJsb2ciLCJkaXYiLCJodG1sIiwiRk9VTkRBVElPTl9WRVJTSU9OIiwiRm91bmRhdGlvbiIsInZlcnNpb24iLCJfcGx1Z2lucyIsIl91dWlkcyIsInBsdWdpbiIsImNsYXNzTmFtZSIsImZ1bmN0aW9uTmFtZSIsImF0dHJOYW1lIiwiaHlwaGVuYXRlIiwicmVnaXN0ZXJQbHVnaW4iLCJwbHVnaW5OYW1lIiwiY29uc3RydWN0b3IiLCJ0b0xvd2VyQ2FzZSIsInV1aWQiLCIkZWxlbWVudCIsImF0dHIiLCJkYXRhIiwidW5yZWdpc3RlclBsdWdpbiIsInNwbGljZSIsImluZGV4T2YiLCJyZW1vdmVBdHRyIiwicmVtb3ZlRGF0YSIsInByb3AiLCJyZUluaXQiLCJwbHVnaW5zIiwiaXNKUSIsImVhY2giLCJfdGhpcyIsImZucyIsInBsZ3MiLCJmb3JFYWNoIiwicCIsIk9iamVjdCIsImtleXMiLCJlcnIiLCJlcnJvciIsInJlZmxvdyIsImVsZW0iLCIkZWxlbSIsImZpbmQiLCJhZGRCYWNrIiwiJGVsIiwib3B0cyIsIndhcm4iLCJ0aGluZyIsImUiLCJvcHQiLCJtYXAiLCJlbCIsInBhcnNlVmFsdWUiLCJlciIsImdldEZuTmFtZSIsIm1ldGhvZCIsIiRub0pTIiwicmVtb3ZlQ2xhc3MiLCJhcmdzIiwicHJvdG90eXBlIiwiY2FsbCIsImFyZ3VtZW50cyIsInBsdWdDbGFzcyIsImFwcGx5IiwiUmVmZXJlbmNlRXJyb3IiLCJUeXBlRXJyb3IiLCJmbiIsInV0aWwiLCJ0aHJvdHRsZSIsImZ1bmMiLCJkZWxheSIsInRpbWVyIiwiY29udGV4dCIsInNldFRpbWVvdXQiLCJEYXRlIiwibm93IiwiZ2V0VGltZSIsInZlbmRvcnMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ2cCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImxhc3RUaW1lIiwiY2FsbGJhY2siLCJuZXh0VGltZSIsIk1hdGgiLCJtYXgiLCJjbGVhclRpbWVvdXQiLCJwZXJmb3JtYW5jZSIsInN0YXJ0IiwiRnVuY3Rpb24iLCJiaW5kIiwib1RoaXMiLCJhQXJncyIsImZUb0JpbmQiLCJmTk9QIiwiZkJvdW5kIiwiY29uY2F0IiwiZnVuY05hbWVSZWdleCIsInJlc3VsdHMiLCJleGVjIiwidG9TdHJpbmciLCJpc05hTiIsInBhcnNlRmxvYXQiLCJydGwiLCJHZXRZb0RpZ2l0cyIsIm5hbWVzcGFjZSIsInJvdW5kIiwicG93IiwicmFuZG9tIiwidHJhbnNpdGlvbmVuZCIsInRyYW5zaXRpb25zIiwiZW5kIiwidCIsInRyaWdnZXJIYW5kbGVyIiwiRmFzdENsaWNrIiwibGF5ZXIiLCJvcHRpb25zIiwib2xkT25DbGljayIsInRyYWNraW5nQ2xpY2siLCJ0cmFja2luZ0NsaWNrU3RhcnQiLCJ0YXJnZXRFbGVtZW50IiwidG91Y2hTdGFydFgiLCJ0b3VjaFN0YXJ0WSIsImxhc3RUb3VjaElkZW50aWZpZXIiLCJ0b3VjaEJvdW5kYXJ5IiwidGFwRGVsYXkiLCJ0YXBUaW1lb3V0Iiwibm90TmVlZGVkIiwibWV0aG9kcyIsImwiLCJkZXZpY2VJc0FuZHJvaWQiLCJvbk1vdXNlIiwib25DbGljayIsIm9uVG91Y2hTdGFydCIsIm9uVG91Y2hNb3ZlIiwib25Ub3VjaEVuZCIsIm9uVG91Y2hDYW5jZWwiLCJFdmVudCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjYXB0dXJlIiwicm12IiwiTm9kZSIsImhpamFja2VkIiwiYWR2IiwiZXZlbnQiLCJwcm9wYWdhdGlvblN0b3BwZWQiLCJvbmNsaWNrIiwiZGV2aWNlSXNXaW5kb3dzUGhvbmUiLCJkZXZpY2VJc0lPUyIsImRldmljZUlzSU9TNCIsImRldmljZUlzSU9TV2l0aEJhZFRhcmdldCIsImRldmljZUlzQmxhY2tCZXJyeTEwIiwibmVlZHNDbGljayIsInRhcmdldCIsIm5vZGVOYW1lIiwiZGlzYWJsZWQiLCJuZWVkc0ZvY3VzIiwicmVhZE9ubHkiLCJzZW5kQ2xpY2siLCJjbGlja0V2ZW50IiwidG91Y2giLCJhY3RpdmVFbGVtZW50IiwiYmx1ciIsImNoYW5nZWRUb3VjaGVzIiwiY3JlYXRlRXZlbnQiLCJpbml0TW91c2VFdmVudCIsImRldGVybWluZUV2ZW50VHlwZSIsInNjcmVlblgiLCJzY3JlZW5ZIiwiY2xpZW50WCIsImNsaWVudFkiLCJmb3J3YXJkZWRUb3VjaEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInRhZ05hbWUiLCJmb2N1cyIsInNldFNlbGVjdGlvblJhbmdlIiwidXBkYXRlU2Nyb2xsUGFyZW50Iiwic2Nyb2xsUGFyZW50IiwicGFyZW50RWxlbWVudCIsImZhc3RDbGlja1Njcm9sbFBhcmVudCIsImNvbnRhaW5zIiwic2Nyb2xsSGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiZmFzdENsaWNrTGFzdFNjcm9sbFRvcCIsImdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQiLCJldmVudFRhcmdldCIsIm5vZGVUeXBlIiwiVEVYVF9OT0RFIiwic2VsZWN0aW9uIiwidGFyZ2V0VG91Y2hlcyIsImdldFNlbGVjdGlvbiIsInJhbmdlQ291bnQiLCJpc0NvbGxhcHNlZCIsImlkZW50aWZpZXIiLCJwcmV2ZW50RGVmYXVsdCIsInRpbWVTdGFtcCIsInBhZ2VYIiwicGFnZVkiLCJsYXN0Q2xpY2tUaW1lIiwidG91Y2hIYXNNb3ZlZCIsImJvdW5kYXJ5IiwiYWJzIiwiZmluZENvbnRyb2wiLCJsYWJlbEVsZW1lbnQiLCJjb250cm9sIiwiaHRtbEZvciIsImdldEVsZW1lbnRCeUlkIiwicXVlcnlTZWxlY3RvciIsImZvckVsZW1lbnQiLCJ0YXJnZXRUYWdOYW1lIiwiY2FuY2VsTmV4dENsaWNrIiwiZWxlbWVudEZyb21Qb2ludCIsInBhZ2VYT2Zmc2V0IiwicGFnZVlPZmZzZXQiLCJ0b3AiLCJjYW5jZWxhYmxlIiwic3RvcFByb3BhZ2F0aW9uIiwicGVybWl0dGVkIiwiZGV0YWlsIiwiZGVzdHJveSIsIm1ldGFWaWV3cG9ydCIsImNocm9tZVZlcnNpb24iLCJibGFja2JlcnJ5VmVyc2lvbiIsImZpcmVmb3hWZXJzaW9uIiwib250b3VjaHN0YXJ0IiwiY29udGVudCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbFdpZHRoIiwib3V0ZXJXaWR0aCIsIm1hdGNoIiwibXNUb3VjaEFjdGlvbiIsInRvdWNoQWN0aW9uIiwiZGVmaW5lIiwibW9kdWxlIiwiZXhwb3J0cyIsIlNIQVBFX09SREVSIiwiVFJJR0dFUl9PUkRFUiIsIkNPTlRST0xTX01BUkdJTiIsInNvcnRCeUFycmF5Iiwib3JkZXJBcnJheSIsImEiLCJiIiwiaW5kZXhBIiwiaW5kZXhCIiwicGxhY2VDb250cm9scyIsIiR0aGlzIiwiJGJveCIsIiR0YWJsZSIsInNpYmxpbmdzIiwic2Nyb2xsWSIsIm9mZnNldCIsIm91dGVySGVpZ2h0IiwiYWRkQ2xhc3MiLCJsZWZ0IiwicmVhZHkiLCJyZXNpemUiLCJjbG9zZXN0IiwiaGlkZSIsInNob3ciLCJjaGlsZHJlbiIsInNvcnQiLCJNRU5VX1dJRFRIIiwibWVudU9wZW4iLCJtZW51Q2xvc2VIYW1tZXIiLCJzZXQiLCJlbmFibGUiLCJtZW51Q2xvc2UiLCJoYXNDbGFzcyIsIiRtZW51IiwiJG1lbnVCdXR0b24iLCIkb3BlbkJ1dHRvbiIsIiRjbG9zZUJ1dHRvbiIsInRyYW5zbGF0aW9uIiwibWVudU9wZW5IYW1tZXIiLCJwYXJzZUludCIsImRlbHRhIiwiZGVsdGFYIiwicm90YXRpb24iLCJvcGFjaXR5IiwiZXhwb3J0TmFtZSIsIlZFTkRPUl9QUkVGSVhFUyIsIlRFU1RfRUxFTUVOVCIsIlRZUEVfRlVOQ1RJT04iLCJzZXRUaW1lb3V0Q29udGV4dCIsInRpbWVvdXQiLCJiaW5kRm4iLCJpbnZva2VBcnJheUFyZyIsImFyZyIsIm9iaiIsIml0ZXJhdG9yIiwiZGVwcmVjYXRlIiwibWVzc2FnZSIsImRlcHJlY2F0aW9uTWVzc2FnZSIsIkVycm9yIiwic3RhY2siLCJhc3NpZ24iLCJvdXRwdXQiLCJpbmRleCIsInNvdXJjZSIsIm5leHRLZXkiLCJleHRlbmQiLCJkZXN0Iiwic3JjIiwibWVyZ2UiLCJpbmhlcml0IiwiY2hpbGQiLCJiYXNlIiwicHJvcGVydGllcyIsImJhc2VQIiwiY2hpbGRQIiwiY3JlYXRlIiwiX3N1cGVyIiwiYm91bmRGbiIsImJvb2xPckZuIiwiaWZVbmRlZmluZWQiLCJ2YWwxIiwidmFsMiIsImFkZEV2ZW50TGlzdGVuZXJzIiwidHlwZXMiLCJoYW5kbGVyIiwic3BsaXRTdHIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsImhhc1BhcmVudCIsIm5vZGUiLCJwYXJlbnQiLCJpblN0ciIsImluQXJyYXkiLCJmaW5kQnlLZXkiLCJ0b0FycmF5IiwidW5pcXVlQXJyYXkiLCJ2YWx1ZXMiLCJzb3J0VW5pcXVlQXJyYXkiLCJwcmVmaXhlZCIsInByb3BlcnR5IiwicHJlZml4IiwiY2FtZWxQcm9wIiwidG9VcHBlckNhc2UiLCJfdW5pcXVlSWQiLCJ1bmlxdWVJZCIsImdldFdpbmRvd0ZvckVsZW1lbnQiLCJlbGVtZW50IiwiZG9jIiwib3duZXJEb2N1bWVudCIsImRlZmF1bHRWaWV3IiwicGFyZW50V2luZG93IiwiTU9CSUxFX1JFR0VYIiwiU1VQUE9SVF9UT1VDSCIsIlNVUFBPUlRfUE9JTlRFUl9FVkVOVFMiLCJTVVBQT1JUX09OTFlfVE9VQ0giLCJJTlBVVF9UWVBFX1RPVUNIIiwiSU5QVVRfVFlQRV9QRU4iLCJJTlBVVF9UWVBFX01PVVNFIiwiSU5QVVRfVFlQRV9LSU5FQ1QiLCJDT01QVVRFX0lOVEVSVkFMIiwiSU5QVVRfU1RBUlQiLCJJTlBVVF9NT1ZFIiwiSU5QVVRfRU5EIiwiSU5QVVRfQ0FOQ0VMIiwiRElSRUNUSU9OX05PTkUiLCJESVJFQ1RJT05fTEVGVCIsIkRJUkVDVElPTl9SSUdIVCIsIkRJUkVDVElPTl9VUCIsIkRJUkVDVElPTl9ET1dOIiwiRElSRUNUSU9OX0hPUklaT05UQUwiLCJESVJFQ1RJT05fVkVSVElDQUwiLCJESVJFQ1RJT05fQUxMIiwiUFJPUFNfWFkiLCJQUk9QU19DTElFTlRfWFkiLCJJbnB1dCIsIm1hbmFnZXIiLCJpbnB1dFRhcmdldCIsImRvbUhhbmRsZXIiLCJldiIsImluaXQiLCJldkVsIiwiZXZUYXJnZXQiLCJldldpbiIsImNyZWF0ZUlucHV0SW5zdGFuY2UiLCJUeXBlIiwiaW5wdXRDbGFzcyIsIlBvaW50ZXJFdmVudElucHV0IiwiVG91Y2hJbnB1dCIsIk1vdXNlSW5wdXQiLCJUb3VjaE1vdXNlSW5wdXQiLCJpbnB1dEhhbmRsZXIiLCJldmVudFR5cGUiLCJpbnB1dCIsInBvaW50ZXJzTGVuIiwicG9pbnRlcnMiLCJjaGFuZ2VkUG9pbnRlcnNMZW4iLCJjaGFuZ2VkUG9pbnRlcnMiLCJpc0ZpcnN0IiwiaXNGaW5hbCIsInNlc3Npb24iLCJjb21wdXRlSW5wdXREYXRhIiwiZW1pdCIsInJlY29nbml6ZSIsInByZXZJbnB1dCIsInBvaW50ZXJzTGVuZ3RoIiwiZmlyc3RJbnB1dCIsInNpbXBsZUNsb25lSW5wdXREYXRhIiwiZmlyc3RNdWx0aXBsZSIsIm9mZnNldENlbnRlciIsImNlbnRlciIsImdldENlbnRlciIsImRlbHRhVGltZSIsImFuZ2xlIiwiZ2V0QW5nbGUiLCJkaXN0YW5jZSIsImdldERpc3RhbmNlIiwiY29tcHV0ZURlbHRhWFkiLCJvZmZzZXREaXJlY3Rpb24iLCJnZXREaXJlY3Rpb24iLCJkZWx0YVkiLCJvdmVyYWxsVmVsb2NpdHkiLCJnZXRWZWxvY2l0eSIsIm92ZXJhbGxWZWxvY2l0eVgiLCJ4Iiwib3ZlcmFsbFZlbG9jaXR5WSIsInkiLCJzY2FsZSIsImdldFNjYWxlIiwiZ2V0Um90YXRpb24iLCJtYXhQb2ludGVycyIsImNvbXB1dGVJbnRlcnZhbElucHV0RGF0YSIsInNyY0V2ZW50Iiwib2Zmc2V0RGVsdGEiLCJwcmV2RGVsdGEiLCJsYXN0IiwibGFzdEludGVydmFsIiwidmVsb2NpdHkiLCJ2ZWxvY2l0eVgiLCJ2ZWxvY2l0eVkiLCJkaXJlY3Rpb24iLCJ2IiwicDEiLCJwMiIsInByb3BzIiwic3FydCIsImF0YW4yIiwiUEkiLCJNT1VTRV9JTlBVVF9NQVAiLCJtb3VzZWRvd24iLCJtb3VzZW1vdmUiLCJtb3VzZXVwIiwiTU9VU0VfRUxFTUVOVF9FVkVOVFMiLCJNT1VTRV9XSU5ET1dfRVZFTlRTIiwicHJlc3NlZCIsIk1FaGFuZGxlciIsImJ1dHRvbiIsIndoaWNoIiwicG9pbnRlclR5cGUiLCJQT0lOVEVSX0lOUFVUX01BUCIsInBvaW50ZXJkb3duIiwicG9pbnRlcm1vdmUiLCJwb2ludGVydXAiLCJwb2ludGVyY2FuY2VsIiwicG9pbnRlcm91dCIsIklFMTBfUE9JTlRFUl9UWVBFX0VOVU0iLCJQT0lOVEVSX0VMRU1FTlRfRVZFTlRTIiwiUE9JTlRFUl9XSU5ET1dfRVZFTlRTIiwiTVNQb2ludGVyRXZlbnQiLCJQb2ludGVyRXZlbnQiLCJzdG9yZSIsInBvaW50ZXJFdmVudHMiLCJQRWhhbmRsZXIiLCJyZW1vdmVQb2ludGVyIiwiZXZlbnRUeXBlTm9ybWFsaXplZCIsImlzVG91Y2giLCJzdG9yZUluZGV4IiwicG9pbnRlcklkIiwiU0lOR0xFX1RPVUNIX0lOUFVUX01BUCIsInRvdWNoc3RhcnQiLCJ0b3VjaG1vdmUiLCJ0b3VjaGVuZCIsInRvdWNoY2FuY2VsIiwiU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMiLCJTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUyIsIlNpbmdsZVRvdWNoSW5wdXQiLCJzdGFydGVkIiwiVEVoYW5kbGVyIiwidG91Y2hlcyIsIm5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMiLCJhbGwiLCJjaGFuZ2VkIiwiVE9VQ0hfSU5QVVRfTUFQIiwiVE9VQ0hfVEFSR0VUX0VWRU5UUyIsInRhcmdldElkcyIsIk1URWhhbmRsZXIiLCJnZXRUb3VjaGVzIiwiYWxsVG91Y2hlcyIsImNoYW5nZWRUYXJnZXRUb3VjaGVzIiwiZmlsdGVyIiwiREVEVVBfVElNRU9VVCIsIkRFRFVQX0RJU1RBTkNFIiwibW91c2UiLCJwcmltYXJ5VG91Y2giLCJsYXN0VG91Y2hlcyIsIlRNRWhhbmRsZXIiLCJpbnB1dEV2ZW50IiwiaW5wdXREYXRhIiwiaXNNb3VzZSIsInNvdXJjZUNhcGFiaWxpdGllcyIsImZpcmVzVG91Y2hFdmVudHMiLCJyZWNvcmRUb3VjaGVzIiwiaXNTeW50aGV0aWNFdmVudCIsImV2ZW50RGF0YSIsInNldExhc3RUb3VjaCIsImxhc3RUb3VjaCIsImx0cyIsInJlbW92ZUxhc3RUb3VjaCIsImR4IiwiZHkiLCJQUkVGSVhFRF9UT1VDSF9BQ1RJT04iLCJOQVRJVkVfVE9VQ0hfQUNUSU9OIiwiVE9VQ0hfQUNUSU9OX0NPTVBVVEUiLCJUT1VDSF9BQ1RJT05fQVVUTyIsIlRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04iLCJUT1VDSF9BQ1RJT05fTk9ORSIsIlRPVUNIX0FDVElPTl9QQU5fWCIsIlRPVUNIX0FDVElPTl9QQU5fWSIsIlRPVUNIX0FDVElPTl9NQVAiLCJnZXRUb3VjaEFjdGlvblByb3BzIiwiVG91Y2hBY3Rpb24iLCJjb21wdXRlIiwiYWN0aW9ucyIsInVwZGF0ZSIsInJlY29nbml6ZXJzIiwicmVjb2duaXplciIsImdldFRvdWNoQWN0aW9uIiwiY2xlYW5Ub3VjaEFjdGlvbnMiLCJqb2luIiwicHJldmVudERlZmF1bHRzIiwicHJldmVudGVkIiwiaGFzTm9uZSIsImhhc1BhblkiLCJoYXNQYW5YIiwiaXNUYXBQb2ludGVyIiwiaXNUYXBNb3ZlbWVudCIsImlzVGFwVG91Y2hUaW1lIiwicHJldmVudFNyYyIsInRvdWNoTWFwIiwiY3NzU3VwcG9ydHMiLCJDU1MiLCJzdXBwb3J0cyIsIlNUQVRFX1BPU1NJQkxFIiwiU1RBVEVfQkVHQU4iLCJTVEFURV9DSEFOR0VEIiwiU1RBVEVfRU5ERUQiLCJTVEFURV9SRUNPR05JWkVEIiwiU1RBVEVfQ0FOQ0VMTEVEIiwiU1RBVEVfRkFJTEVEIiwiUmVjb2duaXplciIsImRlZmF1bHRzIiwic3RhdGUiLCJzaW11bHRhbmVvdXMiLCJyZXF1aXJlRmFpbCIsInJlY29nbml6ZVdpdGgiLCJvdGhlclJlY29nbml6ZXIiLCJnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyIiwiZHJvcFJlY29nbml6ZVdpdGgiLCJyZXF1aXJlRmFpbHVyZSIsImRyb3BSZXF1aXJlRmFpbHVyZSIsImhhc1JlcXVpcmVGYWlsdXJlcyIsImNhblJlY29nbml6ZVdpdGgiLCJzdGF0ZVN0ciIsImFkZGl0aW9uYWxFdmVudCIsInRyeUVtaXQiLCJjYW5FbWl0IiwiaW5wdXREYXRhQ2xvbmUiLCJyZXNldCIsInByb2Nlc3MiLCJkaXJlY3Rpb25TdHIiLCJBdHRyUmVjb2duaXplciIsImF0dHJUZXN0Iiwib3B0aW9uUG9pbnRlcnMiLCJpc1JlY29nbml6ZWQiLCJpc1ZhbGlkIiwiUGFuUmVjb2duaXplciIsInBYIiwicFkiLCJ0aHJlc2hvbGQiLCJkaXJlY3Rpb25UZXN0IiwiaGFzTW92ZWQiLCJQaW5jaFJlY29nbml6ZXIiLCJpbk91dCIsIlByZXNzUmVjb2duaXplciIsIl90aW1lciIsIl9pbnB1dCIsInRpbWUiLCJ2YWxpZFBvaW50ZXJzIiwidmFsaWRNb3ZlbWVudCIsInZhbGlkVGltZSIsIlJvdGF0ZVJlY29nbml6ZXIiLCJTd2lwZVJlY29nbml6ZXIiLCJUYXBSZWNvZ25pemVyIiwicFRpbWUiLCJwQ2VudGVyIiwiY291bnQiLCJ0YXBzIiwiaW50ZXJ2YWwiLCJwb3NUaHJlc2hvbGQiLCJ2YWxpZFRvdWNoVGltZSIsImZhaWxUaW1lb3V0IiwidmFsaWRJbnRlcnZhbCIsInZhbGlkTXVsdGlUYXAiLCJ0YXBDb3VudCIsIkhhbW1lciIsInByZXNldCIsIk1hbmFnZXIiLCJWRVJTSU9OIiwiZG9tRXZlbnRzIiwiY3NzUHJvcHMiLCJ1c2VyU2VsZWN0IiwidG91Y2hTZWxlY3QiLCJ0b3VjaENhbGxvdXQiLCJjb250ZW50Wm9vbWluZyIsInVzZXJEcmFnIiwidGFwSGlnaGxpZ2h0Q29sb3IiLCJTVE9QIiwiRk9SQ0VEX1NUT1AiLCJoYW5kbGVycyIsIm9sZENzc1Byb3BzIiwidG9nZ2xlQ3NzUHJvcHMiLCJpdGVtIiwiYWRkIiwic3RvcCIsImZvcmNlIiwic3RvcHBlZCIsImN1clJlY29nbml6ZXIiLCJleGlzdGluZyIsInJlbW92ZSIsImV2ZW50cyIsInRyaWdnZXJEb21FdmVudCIsImdlc3R1cmVFdmVudCIsImluaXRFdmVudCIsImdlc3R1cmUiLCJUYXAiLCJQYW4iLCJTd2lwZSIsIlBpbmNoIiwiUm90YXRlIiwiUHJlc3MiLCJmcmVlR2xvYmFsIiwibmF2YmFyQ2xpY2tlZCIsInByZXZBbGwiLCJuZXh0QWxsIiwibG9jYXRpb24iLCJoYXNoIiwid2F5cG9pbnQiLCIkbmF2Y2lyY2xlIiwiJHByZXZpb3VzTmF2Y2lyY2xlIiwicHJldiIsImtleUNvdW50ZXIiLCJhbGxXYXlwb2ludHMiLCJXYXlwb2ludCIsIkFkYXB0ZXIiLCJhZGFwdGVyIiwiYXhpcyIsImhvcml6b250YWwiLCJlbmFibGVkIiwidHJpZ2dlclBvaW50IiwiZ3JvdXAiLCJHcm91cCIsImZpbmRPckNyZWF0ZSIsIkNvbnRleHQiLCJmaW5kT3JDcmVhdGVCeUVsZW1lbnQiLCJvZmZzZXRBbGlhc2VzIiwicXVldWVUcmlnZ2VyIiwiZGlzYWJsZSIsInJlZnJlc2giLCJuZXh0IiwicHJldmlvdXMiLCJpbnZva2VBbGwiLCJhbGxXYXlwb2ludHNBcnJheSIsIndheXBvaW50S2V5IiwiZGVzdHJveUFsbCIsImRpc2FibGVBbGwiLCJlbmFibGVBbGwiLCJyZWZyZXNoQWxsIiwidmlld3BvcnRIZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsInZpZXdwb3J0V2lkdGgiLCJjbGllbnRXaWR0aCIsImFkYXB0ZXJzIiwiY29udGludW91cyIsImlubmVyV2lkdGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWVTaGltIiwiY29udGV4dHMiLCJvbGRXaW5kb3dMb2FkIiwib25sb2FkIiwiZGlkU2Nyb2xsIiwiZGlkUmVzaXplIiwib2xkU2Nyb2xsIiwic2Nyb2xsTGVmdCIsIndheXBvaW50cyIsInZlcnRpY2FsIiwid2F5cG9pbnRDb250ZXh0S2V5Iiwid2luZG93Q29udGV4dCIsImNyZWF0ZVRocm90dGxlZFNjcm9sbEhhbmRsZXIiLCJjcmVhdGVUaHJvdHRsZWRSZXNpemVIYW5kbGVyIiwiY2hlY2tFbXB0eSIsImhvcml6b250YWxFbXB0eSIsImlzRW1wdHlPYmplY3QiLCJ2ZXJ0aWNhbEVtcHR5IiwiaXNXaW5kb3ciLCJyZXNpemVIYW5kbGVyIiwiaGFuZGxlUmVzaXplIiwic2Nyb2xsSGFuZGxlciIsImhhbmRsZVNjcm9sbCIsInRyaWdnZXJlZEdyb3VwcyIsImF4ZXMiLCJuZXdTY3JvbGwiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJheGlzS2V5IiwiaXNGb3J3YXJkIiwid2FzQmVmb3JlVHJpZ2dlclBvaW50Iiwibm93QWZ0ZXJUcmlnZ2VyUG9pbnQiLCJjcm9zc2VkRm9yd2FyZCIsImNyb3NzZWRCYWNrd2FyZCIsImdyb3VwS2V5IiwiZmx1c2hUcmlnZ2VycyIsImNvbnRleHRPZmZzZXQiLCJjb250ZXh0U2Nyb2xsIiwiY29udGV4dERpbWVuc2lvbiIsIm9mZnNldFByb3AiLCJhZGp1c3RtZW50Iiwib2xkVHJpZ2dlclBvaW50IiwiZWxlbWVudE9mZnNldCIsImZyZXNoV2F5cG9pbnQiLCJjb250ZXh0TW9kaWZpZXIiLCJ3YXNCZWZvcmVTY3JvbGwiLCJub3dBZnRlclNjcm9sbCIsInRyaWdnZXJlZEJhY2t3YXJkIiwidHJpZ2dlcmVkRm9yd2FyZCIsImNlaWwiLCJmbG9vciIsImZpbmRCeUVsZW1lbnQiLCJjb250ZXh0SWQiLCJyZXF1ZXN0Rm4iLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJieVRyaWdnZXJQb2ludCIsImJ5UmV2ZXJzZVRyaWdnZXJQb2ludCIsImdyb3VwcyIsImNsZWFyVHJpZ2dlclF1ZXVlcyIsInRyaWdnZXJRdWV1ZXMiLCJ1cCIsImRvd24iLCJyaWdodCIsInJldmVyc2UiLCJpc0xhc3QiLCJmaXJzdCIsIkpRdWVyeUFkYXB0ZXIiLCJjcmVhdGVFeHRlbnNpb24iLCJmcmFtZXdvcmsiLCJvdmVycmlkZXMiLCJpc0Z1bmN0aW9uIiwiWmVwdG8iLCJtb3ZlcyIsInJvb2ZwaWdJZCIsIm1vdmUiLCJjdWJlTW92ZSIsIkNvbXBvc2l0ZU1vdmUiLCJyb29mcGlncyIsIndvcmxkM2QiLCJzaG93X2RvIiwiYWRkX2NoYW5nZXIiLCJ1bmRvIiwicGxhY2VQb3B1cCIsInNwYW4iLCIkcG9wdXAiLCJhbGdvcml0aG1TdGVwIiwiY2hlY2tlZCIsIiRob3ZlcmVkQWxnIiwicG9wdXBUaW1lb3V0IiwiaG92ZXIiLCJtb3VzZW91dCIsImtleXVwIiwiJHNwYW4iLCJhc2siLCIkbmV4dCIsIlN0b3B3YXRjaCIsInN0YXJ0ZWRBdCIsInJ1bm5pbmciLCJERUxFVEVfVElNRV9MSU5LIiwic3RvcHdhdGNoIiwidGltZXMiLCJkaXNwbGF5SW50ZXJ2YWwiLCJpbnNwZWN0aW9uSW50ZXJ2YWwiLCIkZGlzcGxheSIsIiR0aW1lcyIsInNob3J0QmVlcCIsIkF1ZGlvIiwibG9uZ0JlZXAiLCJhY3RpdmF0ZVRpbWVyIiwiZWxhcHNlZFRpbWUiLCJjbGVhckludGVydmFsIiwidXBkYXRlRGlzcGxheSIsImFwcGVuZCIsImZvcm1hdFRpbWUiLCJ1cGRhdGVTdGF0cyIsInNhdmVUaW1lcyIsImluc3BlY3Rpb24iLCJwbGF5U291bmQiLCJzZXRJbnRlcnZhbCIsIm5ld1RpbWUiLCJzdGFydFN0b3B3YXRjaCIsInBhcnNlVGltZSIsIm0iLCJ6ZXJvUGFkIiwicyIsIm1zIiwiZGVmYXVsdFRpbWUiLCJ0b3RhbCIsIm1pbmltdW0iLCJtYXhpbXVtIiwidHJpbW1lZFRvdGFsIiwidHJpbW1lZFRpbWVzIiwic291bmQiLCJwbGF5IiwicGFyc2VkVGltZSIsIm51bSIsInN1YnN0ciIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5Iiwia2V5ZG93biIsIiR0aW1lV3JhcHBlciIsImZ1bGxzY3JlZW5FbGVtZW50IiwibW96RnVsbFNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1zRnVsbHNjcmVlbkVsZW1lbnQiLCJyZXF1ZXN0RnVsbHNjcmVlbiIsIm1zUmVxdWVzdEZ1bGxzY3JlZW4iLCJtb3pSZXF1ZXN0RnVsbFNjcmVlbiIsIndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuIiwiZXhpdEZ1bGxzY3JlZW4iLCJtc0V4aXRGdWxsc2NyZWVuIiwibW96Q2FuY2VsRnVsbFNjcmVlbiIsIndlYmtpdEV4aXRGdWxsc2NyZWVuIiwiJGxpIiwiY29uZmlybSIsImVtcHR5Iiwic3RvcmVkVGltZXMiLCJnZXRJdGVtIiwicGFyc2UiLCJNT1ZFUyIsIk1PRElGSUVSUyIsIlNDUkFNQkxFX0xFTkdUSCIsImdlbmVyYXRlU2NyYW1ibGUiLCJzY3JhbWJsZSIsImxhc3RNb3ZlIiwiY2hhckF0IiwiYXZhaWxhYmxlTW92ZXMiLCJwZW51bHRpbWF0ZU1vdmUiLCJvcHBvc2l0ZUZhY2UiLCJjaG9vc2VSYW5kb20iLCJhcnJheSIsImZhY2UiLCJvcHBvc2l0ZXMiLCJVIiwiRCIsIlIiLCJMIiwiRiIsIkIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7O0FBRUE7Ozs7OztBQUVBO0FBQ0EsSUFBTUEsaUJBQWlCO0FBQ3JCLGFBQVksYUFEUztBQUVyQkMsYUFBWSwwQ0FGUztBQUdyQkMsWUFBVyx5Q0FIVTtBQUlyQkMsVUFBUyx5REFDUCxtREFETyxHQUVQLG1EQUZPLEdBR1AsOENBSE8sR0FJUCwyQ0FKTyxHQUtQO0FBVG1CLENBQXZCOztBQWFBO0FBQ0E7QUFDQSxJQUFJQyxhQUFhQyxPQUFPRCxVQUFQLElBQXNCLFlBQVc7QUFDaEQ7O0FBRUE7O0FBQ0EsTUFBSUUsYUFBY0QsT0FBT0MsVUFBUCxJQUFxQkQsT0FBT0UsS0FBOUM7O0FBRUE7QUFDQSxNQUFJLENBQUNELFVBQUwsRUFBaUI7QUFDZixRQUFJRSxRQUFVQyxTQUFTQyxhQUFULENBQXVCLE9BQXZCLENBQWQ7QUFBQSxRQUNBQyxTQUFjRixT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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxnQkFBZ0I7O0FBRXREO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0MsU0FBUztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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R0FMYztBQU1qQkMsS0FBRztBQU5jLEVBQWxCO0FBUUEsUUFBT04sVUFBVUQsSUFBVixDQUFQO0FBQ0E7O1FBRVFULGdCLEdBQUFBLGdCIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuLy8gRGVmYXVsdCBzZXQgb2YgbWVkaWEgcXVlcmllc1xuY29uc3QgZGVmYXVsdFF1ZXJpZXMgPSB7XG4gICdkZWZhdWx0JyA6ICdvbmx5IHNjcmVlbicsXG4gIGxhbmRzY2FwZSA6ICdvbmx5IHNjcmVlbiBhbmQgKG9yaWVudGF0aW9uOiBsYW5kc2NhcGUpJyxcbiAgcG9ydHJhaXQgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcbiAgcmV0aW5hIDogJ29ubHkgc2NyZWVuIGFuZCAoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwnICtcbiAgICAnb25seSBzY3JlZW4gYW5kIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCcgK1xuICAgICdvbmx5IHNjcmVlbiBhbmQgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIvMSksJyArXG4gICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLWRldmljZS1waXhlbC1yYXRpbzogMiksJyArXG4gICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDE5MmRwaSksJyArXG4gICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLXJlc29sdXRpb246IDJkcHB4KSdcbiAgfTtcblxuXG4vLyBtYXRjaE1lZGlhKCkgcG9seWZpbGwgLSBUZXN0IGEgQ1NTIG1lZGlhIHR5cGUvcXVlcnkgaW4gSlMuXG4vLyBBdXRob3JzICYgY29weXJpZ2h0IChjKSAyMDEyOiBTY290dCBKZWhsLCBQYXVsIElyaXNoLCBOaWNob2xhcyBaYWthcywgRGF2aWQgS25pZ2h0LiBEdWFsIE1JVC9CU0QgbGljZW5zZVxubGV0IG1hdGNoTWVkaWEgPSB3aW5kb3cubWF0Y2hNZWRpYSB8fCAoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBGb3IgYnJvd3NlcnMgdGhhdCBzdXBwb3J0IG1hdGNoTWVkaXVtIGFwaSBzdWNoIGFzIElFIDkgYW5kIHdlYmtpdFxuICB2YXIgc3R5bGVNZWRpYSA9ICh3aW5kb3cuc3R5bGVNZWRpYSB8fCB3aW5kb3cubWVkaWEpO1xuXG4gIC8vIEZvciB0aG9zZSB0aGF0IGRvbid0IHN1cHBvcnQgbWF0Y2hNZWRpdW1cbiAgaWYgKCFzdHlsZU1lZGlhKSB7XG4gICAgdmFyIHN0eWxlICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgIHNjcmlwdCAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuICAgIGluZm8gICAgICAgID0gbnVsbDtcblxuICAgIHN0eWxlLnR5cGUgID0gJ3RleHQvY3NzJztcbiAgICBzdHlsZS5pZCAgICA9ICdtYXRjaG1lZGlhanMtdGVzdCc7XG5cbiAgICBzY3JpcHQgJiYgc2NyaXB0LnBhcmVudE5vZGUgJiYgc2NyaXB0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN0eWxlLCBzY3JpcHQpO1xuXG4gICAgLy8gJ3N0eWxlLmN1cnJlbnRTdHlsZScgaXMgdXNlZCBieSBJRSA8PSA4IGFuZCAnd2luZG93LmdldENvbXB1dGVkU3R5bGUnIGZvciBhbGwgb3RoZXIgYnJvd3NlcnNcbiAgICBpbmZvID0gKCdnZXRDb21wdXRlZFN0eWxlJyBpbiB3aW5kb3cpICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHN0eWxlLCBudWxsKSB8fCBzdHlsZS5jdXJyZW50U3R5bGU7XG5cbiAgICBzdHlsZU1lZGlhID0ge1xuICAgICAgbWF0Y2hNZWRpdW0obWVkaWEpIHtcbiAgICAgICAgdmFyIHRleHQgPSBgQG1lZGlhICR7bWVkaWF9eyAjbWF0Y2htZWRpYWpzLXRlc3QgeyB3aWR0aDogMXB4OyB9IH1gO1xuXG4gICAgICAgIC8vICdzdHlsZS5zdHlsZVNoZWV0JyBpcyB1c2VkIGJ5IElFIDw9IDggYW5kICdzdHlsZS50ZXh0Q29udGVudCcgZm9yIGFsbCBvdGhlciBicm93c2Vyc1xuICAgICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGVzdCBpZiBtZWRpYSBxdWVyeSBpcyB0cnVlIG9yIGZhbHNlXG4gICAgICAgIHJldHVybiBpbmZvLndpZHRoID09PSAnMXB4JztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24obWVkaWEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF0Y2hlczogc3R5bGVNZWRpYS5tYXRjaE1lZGl1bShtZWRpYSB8fCAnYWxsJyksXG4gICAgICBtZWRpYTogbWVkaWEgfHwgJ2FsbCdcbiAgICB9O1xuICB9XG59KSgpO1xuXG52YXIgTWVkaWFRdWVyeSA9IHtcbiAgcXVlcmllczogW10sXG5cbiAgY3VycmVudDogJycsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBtZWRpYSBxdWVyeSBoZWxwZXIsIGJ5IGV4dHJhY3RpbmcgdGhlIGJyZWFrcG9pbnQgbGlzdCBmcm9tIHRoZSBDU1MgYW5kIGFjdGl2YXRpbmcgdGhlIGJyZWFrcG9pbnQgd2F0Y2hlci5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyICRtZXRhID0gJCgnbWV0YS5mb3VuZGF0aW9uLW1xJyk7XG4gICAgaWYoISRtZXRhLmxlbmd0aCl7XG4gICAgICAkKCc8bWV0YSBjbGFzcz1cImZvdW5kYXRpb24tbXFcIj4nKS5hcHBlbmRUbyhkb2N1bWVudC5oZWFkKTtcbiAgICB9XG5cbiAgICB2YXIgZXh0cmFjdGVkU3R5bGVzID0gJCgnLmZvdW5kYXRpb24tbXEnKS5jc3MoJ2ZvbnQtZmFtaWx5Jyk7XG4gICAgdmFyIG5hbWVkUXVlcmllcztcblxuICAgIG5hbWVkUXVlcmllcyA9IHBhcnNlU3R5bGVUb09iamVjdChleHRyYWN0ZWRTdHlsZXMpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG5hbWVkUXVlcmllcykge1xuICAgICAgaWYobmFtZWRRdWVyaWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgc2VsZi5xdWVyaWVzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICB2YWx1ZTogYG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAke25hbWVkUXVlcmllc1trZXldfSlgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY3VycmVudCA9IHRoaXMuX2dldEN1cnJlbnRTaXplKCk7XG5cbiAgICB0aGlzLl93YXRjaGVyKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgc2NyZWVuIGlzIGF0IGxlYXN0IGFzIHdpZGUgYXMgYSBicmVha3BvaW50LlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpemUgLSBOYW1lIG9mIHRoZSBicmVha3BvaW50IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBicmVha3BvaW50IG1hdGNoZXMsIGBmYWxzZWAgaWYgaXQncyBzbWFsbGVyLlxuICAgKi9cbiAgYXRMZWFzdChzaXplKSB7XG4gICAgdmFyIHF1ZXJ5ID0gdGhpcy5nZXQoc2l6ZSk7XG5cbiAgICBpZiAocXVlcnkpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKHF1ZXJ5KS5tYXRjaGVzO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBzY3JlZW4gbWF0Y2hlcyB0byBhIGJyZWFrcG9pbnQuXG4gICAqIEBmdW5jdGlvblxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2l6ZSAtIE5hbWUgb2YgdGhlIGJyZWFrcG9pbnQgdG8gY2hlY2ssIGVpdGhlciAnc21hbGwgb25seScgb3IgJ3NtYWxsJy4gT21pdHRpbmcgJ29ubHknIGZhbGxzIGJhY2sgdG8gdXNpbmcgYXRMZWFzdCgpIG1ldGhvZC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgYnJlYWtwb2ludCBtYXRjaGVzLCBgZmFsc2VgIGlmIGl0IGRvZXMgbm90LlxuICAgKi9cbiAgaXMoc2l6ZSkge1xuICAgIHNpemUgPSBzaXplLnRyaW0oKS5zcGxpdCgnICcpO1xuICAgIGlmKHNpemUubGVuZ3RoID4gMSAmJiBzaXplWzFdID09PSAnb25seScpIHtcbiAgICAgIGlmKHNpemVbMF0gPT09IHRoaXMuX2dldEN1cnJlbnRTaXplKCkpIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5hdExlYXN0KHNpemVbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1lZGlhIHF1ZXJ5IG9mIGEgYnJlYWtwb2ludC5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaXplIC0gTmFtZSBvZiB0aGUgYnJlYWtwb2ludCB0byBnZXQuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd8bnVsbH0gLSBUaGUgbWVkaWEgcXVlcnkgb2YgdGhlIGJyZWFrcG9pbnQsIG9yIGBudWxsYCBpZiB0aGUgYnJlYWtwb2ludCBkb2Vzbid0IGV4aXN0LlxuICAgKi9cbiAgZ2V0KHNpemUpIHtcbiAgICBmb3IgKHZhciBpIGluIHRoaXMucXVlcmllcykge1xuICAgICAgaWYodGhpcy5xdWVyaWVzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcmllc1tpXTtcbiAgICAgICAgaWYgKHNpemUgPT09IHF1ZXJ5Lm5hbWUpIHJldHVybiBxdWVyeS52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBicmVha3BvaW50IG5hbWUgYnkgdGVzdGluZyBldmVyeSBicmVha3BvaW50IGFuZCByZXR1cm5pbmcgdGhlIGxhc3Qgb25lIHRvIG1hdGNoICh0aGUgYmlnZ2VzdCBvbmUpLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge1N0cmluZ30gTmFtZSBvZiB0aGUgY3VycmVudCBicmVha3BvaW50LlxuICAgKi9cbiAgX2dldEN1cnJlbnRTaXplKCkge1xuICAgIHZhciBtYXRjaGVkO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcmllc1tpXTtcblxuICAgICAgaWYgKG1hdGNoTWVkaWEocXVlcnkudmFsdWUpLm1hdGNoZXMpIHtcbiAgICAgICAgbWF0Y2hlZCA9IHF1ZXJ5O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbWF0Y2hlZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBtYXRjaGVkLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtYXRjaGVkO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQWN0aXZhdGVzIHRoZSBicmVha3BvaW50IHdhdGNoZXIsIHdoaWNoIGZpcmVzIGFuIGV2ZW50IG9uIHRoZSB3aW5kb3cgd2hlbmV2ZXIgdGhlIGJyZWFrcG9pbnQgY2hhbmdlcy5cbiAgICogQGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfd2F0Y2hlcigpIHtcbiAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuemYubWVkaWFxdWVyeScpLm9uKCdyZXNpemUuemYubWVkaWFxdWVyeScsICgpID0+IHtcbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5fZ2V0Q3VycmVudFNpemUoKSwgY3VycmVudFNpemUgPSB0aGlzLmN1cnJlbnQ7XG5cbiAgICAgIGlmIChuZXdTaXplICE9PSBjdXJyZW50U2l6ZSkge1xuICAgICAgICAvLyBDaGFuZ2UgdGhlIGN1cnJlbnQgbWVkaWEgcXVlcnlcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbmV3U2l6ZTtcblxuICAgICAgICAvLyBCcm9hZGNhc3QgdGhlIG1lZGlhIHF1ZXJ5IGNoYW5nZSBvbiB0aGUgd2luZG93XG4gICAgICAgICQod2luZG93KS50cmlnZ2VyKCdjaGFuZ2VkLnpmLm1lZGlhcXVlcnknLCBbbmV3U2l6ZSwgY3VycmVudFNpemVdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuXG5cbi8vIFRoYW5rIHlvdTogaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9xdWVyeS1zdHJpbmdcbmZ1bmN0aW9uIHBhcnNlU3R5bGVUb09iamVjdChzdHIpIHtcbiAgdmFyIHN0eWxlT2JqZWN0ID0ge307XG5cbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0eWxlT2JqZWN0O1xuICB9XG5cbiAgc3RyID0gc3RyLnRyaW0oKS5zbGljZSgxLCAtMSk7IC8vIGJyb3dzZXJzIHJlLXF1b3RlIHN0cmluZyBzdHlsZSB2YWx1ZXNcblxuICBpZiAoIXN0cikge1xuICAgIHJldHVybiBzdHlsZU9iamVjdDtcbiAgfVxuXG4gIHN0eWxlT2JqZWN0ID0gc3RyLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uKHJldCwgcGFyYW0pIHtcbiAgICB2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBwYXJ0c1swXTtcbiAgICB2YXIgdmFsID0gcGFydHNbMV07XG4gICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XG5cbiAgICAvLyBtaXNzaW5nIGA9YCBzaG91bGQgYmUgYG51bGxgOlxuICAgIC8vIGh0dHA6Ly93My5vcmcvVFIvMjAxMi9XRC11cmwtMjAxMjA1MjQvI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcbiAgICB2YWwgPSB2YWwgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcblxuICAgIGlmICghcmV0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXRba2V5XSkpIHtcbiAgICAgIHJldFtrZXldLnB1c2godmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0W2tleV0gPSBbcmV0W2tleV0sIHZhbF07XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sIHt9KTtcblxuICByZXR1cm4gc3R5bGVPYmplY3Q7XG59XG5cbmV4cG9ydCB7TWVkaWFRdWVyeX07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLm1lZGlhUXVlcnkuanMiLCIvKiBnbG9iYWxzIF9fd2VicGFja19hbWRfb3B0aW9uc19fICovXHJcbm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX2FtZF9vcHRpb25zX187XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2FtZC1vcHRpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEZvdW5kYXRpb24gfSBmcm9tICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uY29yZSc7XG5cbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnV0aWwuYm94Jztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnV0aWwuaW1hZ2VMb2FkZXInO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24udXRpbC5rZXlib2FyZCc7XG5pbXBvcnQgeyBNZWRpYVF1ZXJ5IH0gZnJvbSAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnV0aWwubWVkaWFRdWVyeSc7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLm1vdGlvbic7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLm5lc3QnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24udXRpbC50b3VjaCc7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLnRyaWdnZXJzJztcblxuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uYWJpZGUnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uYWNjb3JkaW9uJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLmFjY29yZGlvbk1lbnUnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uZHJpbGxkb3duJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLmRyb3Bkb3duJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLmRyb3Bkb3duTWVudSc7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi5lcXVhbGl6ZXInO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uaW50ZXJjaGFuZ2UnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24ubWFnZWxsYW4nO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24ub2ZmY2FudmFzJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLm9yYml0Jztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnJlc3BvbnNpdmVBY2NvcmRpb25UYWJzJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnJlc3BvbnNpdmVNZW51Jztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnJlc3BvbnNpdmVUb2dnbGUnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24ucmV2ZWFsJztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnNsaWRlcic7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi5zbW9vdGhTY3JvbGwnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uc3RpY2t5Jztcbi8vIGltcG9ydCAnZm91bmRhdGlvbi1zaXRlcy9qcy9mb3VuZGF0aW9uLnRhYnMnO1xuLy8gaW1wb3J0ICdmb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24udG9nZ2xlcic7XG4vLyBpbXBvcnQgJ2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi50b29sdGlwJztcblxuaW1wb3J0IEZhc3RDbGljayBmcm9tICdmYXN0Y2xpY2snO1xuXG5pbXBvcnQgJy4vbW9kdWxlcy9hbGd0YWJsZXMnO1xuaW1wb3J0ICcuL21vZHVsZXMvbWVudSc7XG5pbXBvcnQgJy4vbW9kdWxlcy9uYXZiYXInO1xuaW1wb3J0ICcuL21vZHVsZXMvbm90YXRpb24nO1xuaW1wb3J0ICcuL21vZHVsZXMvcG9wdXAnO1xuaW1wb3J0ICcuL21vZHVsZXMvdGltZXInO1xuXG5Gb3VuZGF0aW9uLmFkZFRvSnF1ZXJ5KCQpO1xuRm91bmRhdGlvbi5NZWRpYVF1ZXJ5ID0gTWVkaWFRdWVyeTtcblxuJChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG4vLyBGYXN0Q2xpY2tcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiBkb2N1bWVudCkge1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdFx0RmFzdENsaWNrLmF0dGFjaChkb2N1bWVudC5ib2R5KTtcblx0fSwgZmFsc2UpO1xufVxuXG4vLyBCYWNrIHRvIHRvcCBidXR0b25cbmNvbnN0ICR0b3BidXR0b24gPSAkKCcjdG9wYnV0dG9uJyk7XG4kdG9wYnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAnZmFzdCcpO1xufSk7XG5cbi8vIEhpZGUgYmFjayB0byB0b3AgYnV0dG9uIGF0IHRvcCBvZiBkb2N1bWVudFxuJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0aWYoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gMzAwKSB7XG5cdFx0JHRvcGJ1dHRvbi5mYWRlSW4oJ2Zhc3QnKTtcblx0fVxuXHRlbHNlIHtcblx0XHQkdG9wYnV0dG9uLmZhZGVPdXQoJ2Zhc3QnKTtcblx0fVxufSk7XG5cbndpbmRvdy5yYWNoZWwgPSB3aW5kb3cuaGFycnkgPSBmdW5jdGlvbigpIHtcblx0Ly8gSWYgeW91J3JlIHJlYWRpbmcgdGhpcywgdHlwZSByYWNoZWwoKVxuXHQvLyBoYXJyeSgpIGFsc28gd29ya3MhXG5cdGxldCBzZWNyZXRzID0gd2luZG93LmF0b2IoJ0lDQWdJQ0FnSUY5ZlgxOWZYMTlmWDE5ZlgxOWZYMTlmWHcwS0lDQWdJQ0FnTHlBZ0lDQWdMeUFnSUNBZ0x5QWdJQ0FnTDN3TkNpQWdJQ0FnTDE5ZlgxOWZMMTlmWDE5ZkwxOWZYMTlmTHlCOERRb2dJQ0FnTHlBZ0lDQWdMeUFnSUNBZ0x5QWdJQ0FnTDN3Z2ZBMEtJQ0FnTDE5ZlgxOWZMMTlmWDE5ZkwxOWZYMTlmTHlCOEwzd05DaUFnTHlBZ0lDQWdMeUFnSUNBZ0x5QWdJQ0FnTDN3Z0x5QjhEUW9nTDE5ZlgxOWZMMTlmWDE5ZkwxOWZYMTlmTHlCOEwzd2dmQTBLZkNBZ0lDQWdmQ0FnSUNBZ2ZDQWdJQ0FnZkNBZ0x5QjhMM3dOQ253Z0lFMGdJSHdnSUVVZ0lId2dJRklnSUh3Z0wzd2dMeUI4RFFwOFgxOWZYMTk4WDE5ZlgxOThYMTlmWDE5OEx5QjhMM3dnZkEwS2ZDQWdJQ0FnZkNBZ0lDQWdmQ0FnSUNBZ2ZDQWdMeUI4THcwS2ZDQWdNVFFnZkNBZ01Ea2dmQ0FnTVRRZ2ZDQXZmQ0F2RFFwOFgxOWZYMTk4WDE5ZlgxOThYMTlmWDE5OEx5QjhMdzBLZkNBZ1VpQWdmQ0FnUlNBZ2ZDQWdVeUFnZkNBZ0x3MEtmQ0FnSmlBZ2ZDQklJRUlnZkE9PScpO1xuXHRzZWNyZXRzICs9IGRlY29kZVVSSSgnJUNBJTk1JUUyJTgwJUEyJUUxJUI0JUE1JUUyJTgwJUEyJUNBJTk0Jyk7XG5cdHNlY3JldHMgKz0gYXRvYignZkNBdkRRcDhYMTlmWDE5OFgxOWZYMTk4WDE5ZlgxOThMdzBLRFFwVWNua2djMlZzWldOMGFXNW5JSFJsZUhRZ095az0nKTtcblxuXHRjb25zb2xlLmxvZyhzZWNyZXRzKTtcblxuXHRjb25zdCBkaXYgPSAkKCc8ZGl2IC8+Jywge1xuXHRcdGh0bWw6IGF0b2IoJ1BITjBlV3hsUGlvNk9pMXRiM290YzJWc1pXTjBhVzl1SUhzZ1ltRmphMmR5YjNWdVpEb2dJMlpsTlRkaE1TQjlJQ282T25ObGJHVmpkR2x2YmlCN0lHSmhZMnRuY205MWJtUTZJQ05tWlRVM1lURWdmVHd2YzNSNWJHVSsnKVxuXHR9KS5hcHBlbmRUbygnYm9keScpO1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FwcC5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0IHsgR2V0WW9EaWdpdHMgfSBmcm9tICcuL2ZvdW5kYXRpb24udXRpbC5jb3JlJztcbmltcG9ydCB7IE1lZGlhUXVlcnkgfSBmcm9tICcuL2ZvdW5kYXRpb24udXRpbC5tZWRpYVF1ZXJ5JztcblxudmFyIEZPVU5EQVRJT05fVkVSU0lPTiA9ICc2LjQuMyc7XG5cbi8vIEdsb2JhbCBGb3VuZGF0aW9uIG9iamVjdFxuLy8gVGhpcyBpcyBhdHRhY2hlZCB0byB0aGUgd2luZG93LCBvciB1c2VkIGFzIGEgbW9kdWxlIGZvciBBTUQvQnJvd3NlcmlmeVxudmFyIEZvdW5kYXRpb24gPSB7XG4gIHZlcnNpb246IEZPVU5EQVRJT05fVkVSU0lPTixcblxuICAvKipcbiAgICogU3RvcmVzIGluaXRpYWxpemVkIHBsdWdpbnMuXG4gICAqL1xuICBfcGx1Z2luczoge30sXG5cbiAgLyoqXG4gICAqIFN0b3JlcyBnZW5lcmF0ZWQgdW5pcXVlIGlkcyBmb3IgcGx1Z2luIGluc3RhbmNlc1xuICAgKi9cbiAgX3V1aWRzOiBbXSxcblxuICAvKipcbiAgICogRGVmaW5lcyBhIEZvdW5kYXRpb24gcGx1Z2luLCBhZGRpbmcgaXQgdG8gdGhlIGBGb3VuZGF0aW9uYCBuYW1lc3BhY2UgYW5kIHRoZSBsaXN0IG9mIHBsdWdpbnMgdG8gaW5pdGlhbGl6ZSB3aGVuIHJlZmxvd2luZy5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBsdWdpbiAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgcGx1Z2luLlxuICAgKi9cbiAgcGx1Z2luOiBmdW5jdGlvbihwbHVnaW4sIG5hbWUpIHtcbiAgICAvLyBPYmplY3Qga2V5IHRvIHVzZSB3aGVuIGFkZGluZyB0byBnbG9iYWwgRm91bmRhdGlvbiBvYmplY3RcbiAgICAvLyBFeGFtcGxlczogRm91bmRhdGlvbi5SZXZlYWwsIEZvdW5kYXRpb24uT2ZmQ2FudmFzXG4gICAgdmFyIGNsYXNzTmFtZSA9IChuYW1lIHx8IGZ1bmN0aW9uTmFtZShwbHVnaW4pKTtcbiAgICAvLyBPYmplY3Qga2V5IHRvIHVzZSB3aGVuIHN0b3JpbmcgdGhlIHBsdWdpbiwgYWxzbyB1c2VkIHRvIGNyZWF0ZSB0aGUgaWRlbnRpZnlpbmcgZGF0YSBhdHRyaWJ1dGUgZm9yIHRoZSBwbHVnaW5cbiAgICAvLyBFeGFtcGxlczogZGF0YS1yZXZlYWwsIGRhdGEtb2ZmLWNhbnZhc1xuICAgIHZhciBhdHRyTmFtZSAgPSBoeXBoZW5hdGUoY2xhc3NOYW1lKTtcblxuICAgIC8vIEFkZCB0byB0aGUgRm91bmRhdGlvbiBvYmplY3QgYW5kIHRoZSBwbHVnaW5zIGxpc3QgKGZvciByZWZsb3dpbmcpXG4gICAgdGhpcy5fcGx1Z2luc1thdHRyTmFtZV0gPSB0aGlzW2NsYXNzTmFtZV0gPSBwbHVnaW47XG4gIH0sXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogUG9wdWxhdGVzIHRoZSBfdXVpZHMgYXJyYXkgd2l0aCBwb2ludGVycyB0byBlYWNoIGluZGl2aWR1YWwgcGx1Z2luIGluc3RhbmNlLlxuICAgKiBBZGRzIHRoZSBgemZQbHVnaW5gIGRhdGEtYXR0cmlidXRlIHRvIHByb2dyYW1tYXRpY2FsbHkgY3JlYXRlZCBwbHVnaW5zIHRvIGFsbG93IHVzZSBvZiAkKHNlbGVjdG9yKS5mb3VuZGF0aW9uKG1ldGhvZCkgY2FsbHMuXG4gICAqIEFsc28gZmlyZXMgdGhlIGluaXRpYWxpemF0aW9uIGV2ZW50IGZvciBlYWNoIHBsdWdpbiwgY29uc29saWRhdGluZyByZXBldGl0aXZlIGNvZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwbHVnaW4gLSBhbiBpbnN0YW5jZSBvZiBhIHBsdWdpbiwgdXN1YWxseSBgdGhpc2AgaW4gY29udGV4dC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgcGx1Z2luLCBwYXNzZWQgYXMgYSBjYW1lbENhc2VkIHN0cmluZy5cbiAgICogQGZpcmVzIFBsdWdpbiNpbml0XG4gICAqL1xuICByZWdpc3RlclBsdWdpbjogZnVuY3Rpb24ocGx1Z2luLCBuYW1lKXtcbiAgICB2YXIgcGx1Z2luTmFtZSA9IG5hbWUgPyBoeXBoZW5hdGUobmFtZSkgOiBmdW5jdGlvbk5hbWUocGx1Z2luLmNvbnN0cnVjdG9yKS50b0xvd2VyQ2FzZSgpO1xuICAgIHBsdWdpbi51dWlkID0gR2V0WW9EaWdpdHMoNiwgcGx1Z2luTmFtZSk7XG5cbiAgICBpZighcGx1Z2luLiRlbGVtZW50LmF0dHIoYGRhdGEtJHtwbHVnaW5OYW1lfWApKXsgcGx1Z2luLiRlbGVtZW50LmF0dHIoYGRhdGEtJHtwbHVnaW5OYW1lfWAsIHBsdWdpbi51dWlkKTsgfVxuICAgIGlmKCFwbHVnaW4uJGVsZW1lbnQuZGF0YSgnemZQbHVnaW4nKSl7IHBsdWdpbi4kZWxlbWVudC5kYXRhKCd6ZlBsdWdpbicsIHBsdWdpbik7IH1cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGaXJlcyB3aGVuIHRoZSBwbHVnaW4gaGFzIGluaXRpYWxpemVkLlxuICAgICAgICAgICAqIEBldmVudCBQbHVnaW4jaW5pdFxuICAgICAgICAgICAqL1xuICAgIHBsdWdpbi4kZWxlbWVudC50cmlnZ2VyKGBpbml0LnpmLiR7cGx1Z2luTmFtZX1gKTtcblxuICAgIHRoaXMuX3V1aWRzLnB1c2gocGx1Z2luLnV1aWQpO1xuXG4gICAgcmV0dXJuO1xuICB9LFxuICAvKipcbiAgICogQGZ1bmN0aW9uXG4gICAqIFJlbW92ZXMgdGhlIHBsdWdpbnMgdXVpZCBmcm9tIHRoZSBfdXVpZHMgYXJyYXkuXG4gICAqIFJlbW92ZXMgdGhlIHpmUGx1Z2luIGRhdGEgYXR0cmlidXRlLCBhcyB3ZWxsIGFzIHRoZSBkYXRhLXBsdWdpbi1uYW1lIGF0dHJpYnV0ZS5cbiAgICogQWxzbyBmaXJlcyB0aGUgZGVzdHJveWVkIGV2ZW50IGZvciB0aGUgcGx1Z2luLCBjb25zb2xpZGF0aW5nIHJlcGV0aXRpdmUgY29kZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBsdWdpbiAtIGFuIGluc3RhbmNlIG9mIGEgcGx1Z2luLCB1c3VhbGx5IGB0aGlzYCBpbiBjb250ZXh0LlxuICAgKiBAZmlyZXMgUGx1Z2luI2Rlc3Ryb3llZFxuICAgKi9cbiAgdW5yZWdpc3RlclBsdWdpbjogZnVuY3Rpb24ocGx1Z2luKXtcbiAgICB2YXIgcGx1Z2luTmFtZSA9IGh5cGhlbmF0ZShmdW5jdGlvbk5hbWUocGx1Z2luLiRlbGVtZW50LmRhdGEoJ3pmUGx1Z2luJykuY29uc3RydWN0b3IpKTtcblxuICAgIHRoaXMuX3V1aWRzLnNwbGljZSh0aGlzLl91dWlkcy5pbmRleE9mKHBsdWdpbi51dWlkKSwgMSk7XG4gICAgcGx1Z2luLiRlbGVtZW50LnJlbW92ZUF0dHIoYGRhdGEtJHtwbHVnaW5OYW1lfWApLnJlbW92ZURhdGEoJ3pmUGx1Z2luJylcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGaXJlcyB3aGVuIHRoZSBwbHVnaW4gaGFzIGJlZW4gZGVzdHJveWVkLlxuICAgICAgICAgICAqIEBldmVudCBQbHVnaW4jZGVzdHJveWVkXG4gICAgICAgICAgICovXG4gICAgICAgICAgLnRyaWdnZXIoYGRlc3Ryb3llZC56Zi4ke3BsdWdpbk5hbWV9YCk7XG4gICAgZm9yKHZhciBwcm9wIGluIHBsdWdpbil7XG4gICAgICBwbHVnaW5bcHJvcF0gPSBudWxsOy8vY2xlYW4gdXAgc2NyaXB0IHRvIHByZXAgZm9yIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAgICB9XG4gICAgcmV0dXJuO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb25cbiAgICogQ2F1c2VzIG9uZSBvciBtb3JlIGFjdGl2ZSBwbHVnaW5zIHRvIHJlLWluaXRpYWxpemUsIHJlc2V0dGluZyBldmVudCBsaXN0ZW5lcnMsIHJlY2FsY3VsYXRpbmcgcG9zaXRpb25zLCBldGMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVnaW5zIC0gb3B0aW9uYWwgc3RyaW5nIG9mIGFuIGluZGl2aWR1YWwgcGx1Z2luIGtleSwgYXR0YWluZWQgYnkgY2FsbGluZyBgJChlbGVtZW50KS5kYXRhKCdwbHVnaW5OYW1lJylgLCBvciBzdHJpbmcgb2YgYSBwbHVnaW4gY2xhc3MgaS5lLiBgJ2Ryb3Bkb3duJ2BcbiAgICogQGRlZmF1bHQgSWYgbm8gYXJndW1lbnQgaXMgcGFzc2VkLCByZWZsb3cgYWxsIGN1cnJlbnRseSBhY3RpdmUgcGx1Z2lucy5cbiAgICovXG4gICByZUluaXQ6IGZ1bmN0aW9uKHBsdWdpbnMpe1xuICAgICB2YXIgaXNKUSA9IHBsdWdpbnMgaW5zdGFuY2VvZiAkO1xuICAgICB0cnl7XG4gICAgICAgaWYoaXNKUSl7XG4gICAgICAgICBwbHVnaW5zLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgJCh0aGlzKS5kYXRhKCd6ZlBsdWdpbicpLl9pbml0KCk7XG4gICAgICAgICB9KTtcbiAgICAgICB9ZWxzZXtcbiAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHBsdWdpbnMsXG4gICAgICAgICBfdGhpcyA9IHRoaXMsXG4gICAgICAgICBmbnMgPSB7XG4gICAgICAgICAgICdvYmplY3QnOiBmdW5jdGlvbihwbGdzKXtcbiAgICAgICAgICAgICBwbGdzLmZvckVhY2goZnVuY3Rpb24ocCl7XG4gICAgICAgICAgICAgICBwID0gaHlwaGVuYXRlKHApO1xuICAgICAgICAgICAgICAgJCgnW2RhdGEtJysgcCArJ10nKS5mb3VuZGF0aW9uKCdfaW5pdCcpO1xuICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICB9LFxuICAgICAgICAgICAnc3RyaW5nJzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICBwbHVnaW5zID0gaHlwaGVuYXRlKHBsdWdpbnMpO1xuICAgICAgICAgICAgICQoJ1tkYXRhLScrIHBsdWdpbnMgKyddJykuZm91bmRhdGlvbignX2luaXQnKTtcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgJ3VuZGVmaW5lZCc6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgdGhpc1snb2JqZWN0J10oT2JqZWN0LmtleXMoX3RoaXMuX3BsdWdpbnMpKTtcbiAgICAgICAgICAgfVxuICAgICAgICAgfTtcbiAgICAgICAgIGZuc1t0eXBlXShwbHVnaW5zKTtcbiAgICAgICB9XG4gICAgIH1jYXRjaChlcnIpe1xuICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgfWZpbmFsbHl7XG4gICAgICAgcmV0dXJuIHBsdWdpbnM7XG4gICAgIH1cbiAgIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgcGx1Z2lucyBvbiBhbnkgZWxlbWVudHMgd2l0aGluIGBlbGVtYCAoYW5kIGBlbGVtYCBpdHNlbGYpIHRoYXQgYXJlbid0IGFscmVhZHkgaW5pdGlhbGl6ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtIC0galF1ZXJ5IG9iamVjdCBjb250YWluaW5nIHRoZSBlbGVtZW50IHRvIGNoZWNrIGluc2lkZS4gQWxzbyBjaGVja3MgdGhlIGVsZW1lbnQgaXRzZWxmLCB1bmxlc3MgaXQncyB0aGUgYGRvY3VtZW50YCBvYmplY3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwbHVnaW5zIC0gQSBsaXN0IG9mIHBsdWdpbnMgdG8gaW5pdGlhbGl6ZS4gTGVhdmUgdGhpcyBvdXQgdG8gaW5pdGlhbGl6ZSBldmVyeXRoaW5nLlxuICAgKi9cbiAgcmVmbG93OiBmdW5jdGlvbihlbGVtLCBwbHVnaW5zKSB7XG5cbiAgICAvLyBJZiBwbHVnaW5zIGlzIHVuZGVmaW5lZCwganVzdCBncmFiIGV2ZXJ5dGhpbmdcbiAgICBpZiAodHlwZW9mIHBsdWdpbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwbHVnaW5zID0gT2JqZWN0LmtleXModGhpcy5fcGx1Z2lucyk7XG4gICAgfVxuICAgIC8vIElmIHBsdWdpbnMgaXMgYSBzdHJpbmcsIGNvbnZlcnQgaXQgdG8gYW4gYXJyYXkgd2l0aCBvbmUgaXRlbVxuICAgIGVsc2UgaWYgKHR5cGVvZiBwbHVnaW5zID09PSAnc3RyaW5nJykge1xuICAgICAgcGx1Z2lucyA9IFtwbHVnaW5zXTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggcGx1Z2luXG4gICAgJC5lYWNoKHBsdWdpbnMsIGZ1bmN0aW9uKGksIG5hbWUpIHtcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCBwbHVnaW5cbiAgICAgIHZhciBwbHVnaW4gPSBfdGhpcy5fcGx1Z2luc1tuYW1lXTtcblxuICAgICAgLy8gTG9jYWxpemUgdGhlIHNlYXJjaCB0byBhbGwgZWxlbWVudHMgaW5zaWRlIGVsZW0sIGFzIHdlbGwgYXMgZWxlbSBpdHNlbGYsIHVubGVzcyBlbGVtID09PSBkb2N1bWVudFxuICAgICAgdmFyICRlbGVtID0gJChlbGVtKS5maW5kKCdbZGF0YS0nK25hbWUrJ10nKS5hZGRCYWNrKCdbZGF0YS0nK25hbWUrJ10nKTtcblxuICAgICAgLy8gRm9yIGVhY2ggcGx1Z2luIGZvdW5kLCBpbml0aWFsaXplIGl0XG4gICAgICAkZWxlbS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJGVsID0gJCh0aGlzKSxcbiAgICAgICAgICAgIG9wdHMgPSB7fTtcbiAgICAgICAgLy8gRG9uJ3QgZG91YmxlLWRpcCBvbiBwbHVnaW5zXG4gICAgICAgIGlmICgkZWwuZGF0YSgnemZQbHVnaW4nKSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIlRyaWVkIHRvIGluaXRpYWxpemUgXCIrbmFtZStcIiBvbiBhbiBlbGVtZW50IHRoYXQgYWxyZWFkeSBoYXMgYSBGb3VuZGF0aW9uIHBsdWdpbi5cIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoJGVsLmF0dHIoJ2RhdGEtb3B0aW9ucycpKXtcbiAgICAgICAgICB2YXIgdGhpbmcgPSAkZWwuYXR0cignZGF0YS1vcHRpb25zJykuc3BsaXQoJzsnKS5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpe1xuICAgICAgICAgICAgdmFyIG9wdCA9IGUuc3BsaXQoJzonKS5tYXAoZnVuY3Rpb24oZWwpeyByZXR1cm4gZWwudHJpbSgpOyB9KTtcbiAgICAgICAgICAgIGlmKG9wdFswXSkgb3B0c1tvcHRbMF1dID0gcGFyc2VWYWx1ZShvcHRbMV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAkZWwuZGF0YSgnemZQbHVnaW4nLCBuZXcgcGx1Z2luKCQodGhpcyksIG9wdHMpKTtcbiAgICAgICAgfWNhdGNoKGVyKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVyKTtcbiAgICAgICAgfWZpbmFsbHl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0Rm5OYW1lOiBmdW5jdGlvbk5hbWUsXG5cbiAgYWRkVG9KcXVlcnk6IGZ1bmN0aW9uKCQpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBub3QgbWFraW5nIHRoaXMgYSBqUXVlcnkgZnVuY3Rpb25cbiAgICAvLyBUT0RPOiBuZWVkIHdheSB0byByZWZsb3cgdnMuIHJlLWluaXRpYWxpemVcbiAgICAvKipcbiAgICAgKiBUaGUgRm91bmRhdGlvbiBqUXVlcnkgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBtZXRob2QgLSBBbiBhY3Rpb24gdG8gcGVyZm9ybSBvbiB0aGUgY3VycmVudCBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciBmb3VuZGF0aW9uID0gZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICB2YXIgdHlwZSA9IHR5cGVvZiBtZXRob2QsXG4gICAgICAgICAgJG5vSlMgPSAkKCcubm8tanMnKTtcblxuICAgICAgaWYoJG5vSlMubGVuZ3RoKXtcbiAgICAgICAgJG5vSlMucmVtb3ZlQ2xhc3MoJ25vLWpzJyk7XG4gICAgICB9XG5cbiAgICAgIGlmKHR5cGUgPT09ICd1bmRlZmluZWQnKXsvL25lZWRzIHRvIGluaXRpYWxpemUgdGhlIEZvdW5kYXRpb24gb2JqZWN0LCBvciBhbiBpbmRpdmlkdWFsIHBsdWdpbi5cbiAgICAgICAgTWVkaWFRdWVyeS5faW5pdCgpO1xuICAgICAgICBGb3VuZGF0aW9uLnJlZmxvdyh0aGlzKTtcbiAgICAgIH1lbHNlIGlmKHR5cGUgPT09ICdzdHJpbmcnKXsvL2FuIGluZGl2aWR1YWwgbWV0aG9kIHRvIGludm9rZSBvbiBhIHBsdWdpbiBvciBncm91cCBvZiBwbHVnaW5zXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTsvL2NvbGxlY3QgYWxsIHRoZSBhcmd1bWVudHMsIGlmIG5lY2Vzc2FyeVxuICAgICAgICB2YXIgcGx1Z0NsYXNzID0gdGhpcy5kYXRhKCd6ZlBsdWdpbicpOy8vZGV0ZXJtaW5lIHRoZSBjbGFzcyBvZiBwbHVnaW5cblxuICAgICAgICBpZihwbHVnQ2xhc3MgIT09IHVuZGVmaW5lZCAmJiBwbHVnQ2xhc3NbbWV0aG9kXSAhPT0gdW5kZWZpbmVkKXsvL21ha2Ugc3VyZSBib3RoIHRoZSBjbGFzcyBhbmQgbWV0aG9kIGV4aXN0XG4gICAgICAgICAgaWYodGhpcy5sZW5ndGggPT09IDEpey8vaWYgdGhlcmUncyBvbmx5IG9uZSwgY2FsbCBpdCBkaXJlY3RseS5cbiAgICAgICAgICAgICAgcGx1Z0NsYXNzW21ldGhvZF0uYXBwbHkocGx1Z0NsYXNzLCBhcmdzKTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpLCBlbCl7Ly9vdGhlcndpc2UgbG9vcCB0aHJvdWdoIHRoZSBqUXVlcnkgY29sbGVjdGlvbiBhbmQgaW52b2tlIHRoZSBtZXRob2Qgb24gZWFjaFxuICAgICAgICAgICAgICBwbHVnQ2xhc3NbbWV0aG9kXS5hcHBseSgkKGVsKS5kYXRhKCd6ZlBsdWdpbicpLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7Ly9lcnJvciBmb3Igbm8gY2xhc3Mgb3Igbm8gbWV0aG9kXG4gICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwiV2UncmUgc29ycnksICdcIiArIG1ldGhvZCArIFwiJyBpcyBub3QgYW4gYXZhaWxhYmxlIG1ldGhvZCBmb3IgXCIgKyAocGx1Z0NsYXNzID8gZnVuY3Rpb25OYW1lKHBsdWdDbGFzcykgOiAndGhpcyBlbGVtZW50JykgKyAnLicpO1xuICAgICAgICB9XG4gICAgICB9ZWxzZXsvL2Vycm9yIGZvciBpbnZhbGlkIGFyZ3VtZW50IHR5cGVcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgV2UncmUgc29ycnksICR7dHlwZX0gaXMgbm90IGEgdmFsaWQgcGFyYW1ldGVyLiBZb3UgbXVzdCB1c2UgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBtZXRob2QgeW91IHdpc2ggdG8gaW52b2tlLmApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAkLmZuLmZvdW5kYXRpb24gPSBmb3VuZGF0aW9uO1xuICAgIHJldHVybiAkO1xuICB9XG59O1xuXG5Gb3VuZGF0aW9uLnV0aWwgPSB7XG4gIC8qKlxuICAgKiBGdW5jdGlvbiBmb3IgYXBwbHlpbmcgYSBkZWJvdW5jZSBlZmZlY3QgdG8gYSBmdW5jdGlvbiBjYWxsLlxuICAgKiBAZnVuY3Rpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyAtIEZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBhdCBlbmQgb2YgdGltZW91dC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IC0gVGltZSBpbiBtcyB0byBkZWxheSB0aGUgY2FsbCBvZiBgZnVuY2AuXG4gICAqIEByZXR1cm5zIGZ1bmN0aW9uXG4gICAqL1xuICB0aHJvdHRsZTogZnVuY3Rpb24gKGZ1bmMsIGRlbGF5KSB7XG4gICAgdmFyIHRpbWVyID0gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgIGlmICh0aW1lciA9PT0gbnVsbCkge1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufTtcblxud2luZG93LkZvdW5kYXRpb24gPSBGb3VuZGF0aW9uO1xuXG4vLyBQb2x5ZmlsbCBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4oZnVuY3Rpb24oKSB7XG4gIGlmICghRGF0ZS5ub3cgfHwgIXdpbmRvdy5EYXRlLm5vdylcbiAgICB3aW5kb3cuRGF0ZS5ub3cgPSBEYXRlLm5vdyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgdmFyIHZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKytpKSB7XG4gICAgICB2YXIgdnAgPSB2ZW5kb3JzW2ldO1xuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2cCsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSAod2luZG93W3ZwKydDYW5jZWxBbmltYXRpb25GcmFtZSddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdnArJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddKTtcbiAgfVxuICBpZiAoL2lQKGFkfGhvbmV8b2QpLipPUyA2Ly50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KVxuICAgIHx8ICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8ICF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB2YXIgbGFzdFRpbWUgPSAwO1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdmFyIG5leHRUaW1lID0gTWF0aC5tYXgobGFzdFRpbWUgKyAxNiwgbm93KTtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKGxhc3RUaW1lID0gbmV4dFRpbWUpOyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGltZSAtIG5vdyk7XG4gICAgfTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBjbGVhclRpbWVvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIFBvbHlmaWxsIGZvciBwZXJmb3JtYW5jZS5ub3csIHJlcXVpcmVkIGJ5IHJBRlxuICAgKi9cbiAgaWYoIXdpbmRvdy5wZXJmb3JtYW5jZSB8fCAhd2luZG93LnBlcmZvcm1hbmNlLm5vdyl7XG4gICAgd2luZG93LnBlcmZvcm1hbmNlID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBub3c6IGZ1bmN0aW9uKCl7IHJldHVybiBEYXRlLm5vdygpIC0gdGhpcy5zdGFydDsgfVxuICAgIH07XG4gIH1cbn0pKCk7XG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnKTtcbiAgICB9XG5cbiAgICB2YXIgYUFyZ3MgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXG4gICAgICAgIGZUb0JpbmQgPSB0aGlzLFxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgZkJvdW5kICA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QXG4gICAgICAgICAgICAgICAgID8gdGhpc1xuICAgICAgICAgICAgICAgICA6IG9UaGlzLFxuICAgICAgICAgICAgICAgICBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICB9O1xuXG4gICAgaWYgKHRoaXMucHJvdG90eXBlKSB7XG4gICAgICAvLyBuYXRpdmUgZnVuY3Rpb25zIGRvbid0IGhhdmUgYSBwcm90b3R5cGVcbiAgICAgIGZOT1AucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xuXG4gICAgcmV0dXJuIGZCb3VuZDtcbiAgfTtcbn1cbi8vIFBvbHlmaWxsIHRvIGdldCB0aGUgbmFtZSBvZiBhIGZ1bmN0aW9uIGluIElFOVxuZnVuY3Rpb24gZnVuY3Rpb25OYW1lKGZuKSB7XG4gIGlmIChGdW5jdGlvbi5wcm90b3R5cGUubmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb25cXHMoW14oXXsxLH0pXFwoLztcbiAgICB2YXIgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKChmbikudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkgPyByZXN1bHRzWzFdLnRyaW0oKSA6IFwiXCI7XG4gIH1cbiAgZWxzZSBpZiAoZm4ucHJvdG90eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZm4uY29uc3RydWN0b3IubmFtZTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZm4ucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cbn1cbmZ1bmN0aW9uIHBhcnNlVmFsdWUoc3RyKXtcbiAgaWYgKCd0cnVlJyA9PT0gc3RyKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSBpZiAoJ2ZhbHNlJyA9PT0gc3RyKSByZXR1cm4gZmFsc2U7XG4gIGVsc2UgaWYgKCFpc05hTihzdHIgKiAxKSkgcmV0dXJuIHBhcnNlRmxvYXQoc3RyKTtcbiAgcmV0dXJuIHN0cjtcbn1cbi8vIENvbnZlcnQgUGFzY2FsQ2FzZSB0byBrZWJhYi1jYXNlXG4vLyBUaGFuayB5b3U6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzg5NTU1ODBcbmZ1bmN0aW9uIGh5cGhlbmF0ZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xufVxuXG5leHBvcnQge0ZvdW5kYXRpb259O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC9ob21lL21hcmsvU2l0ZXMvc29sdmV0aGVjdWJlL25vZGVfbW9kdWxlcy9mb3VuZGF0aW9uLXNpdGVzL2pzL2ZvdW5kYXRpb24uY29yZS5qcyIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuXG4vLyBDb3JlIEZvdW5kYXRpb24gVXRpbGl0aWVzLCB1dGlsaXplZCBpbiBhIG51bWJlciBvZiBwbGFjZXMuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIGZvciBSVEwgc3VwcG9ydFxuICAgKi9cbmZ1bmN0aW9uIHJ0bCgpIHtcbiAgcmV0dXJuICQoJ2h0bWwnKS5hdHRyKCdkaXInKSA9PT0gJ3J0bCc7XG59XG5cbi8qKlxuICogcmV0dXJucyBhIHJhbmRvbSBiYXNlLTM2IHVpZCB3aXRoIG5hbWVzcGFjaW5nXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggLSBudW1iZXIgb2YgcmFuZG9tIGJhc2UtMzYgZGlnaXRzIGRlc2lyZWQuIEluY3JlYXNlIGZvciBtb3JlIHJhbmRvbSBzdHJpbmdzLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSAtIG5hbWUgb2YgcGx1Z2luIHRvIGJlIGluY29ycG9yYXRlZCBpbiB1aWQsIG9wdGlvbmFsLlxuICogQGRlZmF1bHQge1N0cmluZ30gJycgLSBpZiBubyBwbHVnaW4gbmFtZSBpcyBwcm92aWRlZCwgbm90aGluZyBpcyBhcHBlbmRlZCB0byB0aGUgdWlkLlxuICogQHJldHVybnMge1N0cmluZ30gLSB1bmlxdWUgaWRcbiAqL1xuZnVuY3Rpb24gR2V0WW9EaWdpdHMobGVuZ3RoLCBuYW1lc3BhY2Upe1xuICBsZW5ndGggPSBsZW5ndGggfHwgNjtcbiAgcmV0dXJuIE1hdGgucm91bmQoKE1hdGgucG93KDM2LCBsZW5ndGggKyAxKSAtIE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgbGVuZ3RoKSkpLnRvU3RyaW5nKDM2KS5zbGljZSgxKSArIChuYW1lc3BhY2UgPyBgLSR7bmFtZXNwYWNlfWAgOiAnJyk7XG59XG5cbmZ1bmN0aW9uIHRyYW5zaXRpb25lbmQoJGVsZW0pe1xuICB2YXIgdHJhbnNpdGlvbnMgPSB7XG4gICAgJ3RyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgJ01velRyYW5zaXRpb24nOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgJ09UcmFuc2l0aW9uJzogJ290cmFuc2l0aW9uZW5kJ1xuICB9O1xuICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgZW5kO1xuXG4gIGZvciAodmFyIHQgaW4gdHJhbnNpdGlvbnMpe1xuICAgIGlmICh0eXBlb2YgZWxlbS5zdHlsZVt0XSAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgZW5kID0gdHJhbnNpdGlvbnNbdF07XG4gICAgfVxuICB9XG4gIGlmKGVuZCl7XG4gICAgcmV0dXJuIGVuZDtcbiAgfWVsc2V7XG4gICAgZW5kID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgJGVsZW0udHJpZ2dlckhhbmRsZXIoJ3RyYW5zaXRpb25lbmQnLCBbJGVsZW1dKTtcbiAgICB9LCAxKTtcbiAgICByZXR1cm4gJ3RyYW5zaXRpb25lbmQnO1xuICB9XG59XG5cbmV4cG9ydCB7cnRsLCBHZXRZb0RpZ2l0cywgdHJhbnNpdGlvbmVuZH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2ZvdW5kYXRpb24tc2l0ZXMvanMvZm91bmRhdGlvbi51dGlsLmNvcmUuanMiLCI7KGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qKlxuXHQgKiBAcHJlc2VydmUgRmFzdENsaWNrOiBwb2x5ZmlsbCB0byByZW1vdmUgY2xpY2sgZGVsYXlzIG9uIGJyb3dzZXJzIHdpdGggdG91Y2ggVUlzLlxuXHQgKlxuXHQgKiBAY29kaW5nc3RhbmRhcmQgZnRsYWJzLWpzdjJcblx0ICogQGNvcHlyaWdodCBUaGUgRmluYW5jaWFsIFRpbWVzIExpbWl0ZWQgW0FsbCBSaWdodHMgUmVzZXJ2ZWRdXG5cdCAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlIChzZWUgTElDRU5TRS50eHQpXG5cdCAqL1xuXG5cdC8qanNsaW50IGJyb3dzZXI6dHJ1ZSwgbm9kZTp0cnVlKi9cblx0LypnbG9iYWwgZGVmaW5lLCBFdmVudCwgTm9kZSovXG5cblxuXHQvKipcblx0ICogSW5zdGFudGlhdGUgZmFzdC1jbGlja2luZyBsaXN0ZW5lcnMgb24gdGhlIHNwZWNpZmllZCBsYXllci5cblx0ICpcblx0ICogQGNvbnN0cnVjdG9yXG5cdCAqIEBwYXJhbSB7RWxlbWVudH0gbGF5ZXIgVGhlIGxheWVyIHRvIGxpc3RlbiBvblxuXHQgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xuXHQgKi9cblx0ZnVuY3Rpb24gRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKSB7XG5cdFx0dmFyIG9sZE9uQ2xpY2s7XG5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFdoZXRoZXIgYSBjbGljayBpcyBjdXJyZW50bHkgYmVpbmcgdHJhY2tlZC5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIGJvb2xlYW5cblx0XHQgKi9cblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblxuXG5cdFx0LyoqXG5cdFx0ICogVGltZXN0YW1wIGZvciB3aGVuIGNsaWNrIHRyYWNraW5nIHN0YXJ0ZWQuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XG5cblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBlbGVtZW50IGJlaW5nIHRyYWNrZWQgZm9yIGEgY2xpY2suXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBFdmVudFRhcmdldFxuXHRcdCAqL1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cblxuXHRcdC8qKlxuXHRcdCAqIFgtY29vcmRpbmF0ZSBvZiB0b3VjaCBzdGFydCBldmVudC5cblx0XHQgKlxuXHRcdCAqIEB0eXBlIG51bWJlclxuXHRcdCAqL1xuXHRcdHRoaXMudG91Y2hTdGFydFggPSAwO1xuXG5cblx0XHQvKipcblx0XHQgKiBZLWNvb3JkaW5hdGUgb2YgdG91Y2ggc3RhcnQgZXZlbnQuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLnRvdWNoU3RhcnRZID0gMDtcblxuXG5cdFx0LyoqXG5cdFx0ICogSUQgb2YgdGhlIGxhc3QgdG91Y2gsIHJldHJpZXZlZCBmcm9tIFRvdWNoLmlkZW50aWZpZXIuXG5cdFx0ICpcblx0XHQgKiBAdHlwZSBudW1iZXJcblx0XHQgKi9cblx0XHR0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIgPSAwO1xuXG5cblx0XHQvKipcblx0XHQgKiBUb3VjaG1vdmUgYm91bmRhcnksIGJleW9uZCB3aGljaCBhIGNsaWNrIHdpbGwgYmUgY2FuY2VsbGVkLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUgbnVtYmVyXG5cdFx0ICovXG5cdFx0dGhpcy50b3VjaEJvdW5kYXJ5ID0gb3B0aW9ucy50b3VjaEJvdW5kYXJ5IHx8IDEwO1xuXG5cblx0XHQvKipcblx0XHQgKiBUaGUgRmFzdENsaWNrIGxheWVyLlxuXHRcdCAqXG5cdFx0ICogQHR5cGUgRWxlbWVudFxuXHRcdCAqL1xuXHRcdHRoaXMubGF5ZXIgPSBsYXllcjtcblxuXHRcdC8qKlxuXHRcdCAqIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiB0YXAodG91Y2hzdGFydCBhbmQgdG91Y2hlbmQpIGV2ZW50c1xuXHRcdCAqXG5cdFx0ICogQHR5cGUgbnVtYmVyXG5cdFx0ICovXG5cdFx0dGhpcy50YXBEZWxheSA9IG9wdGlvbnMudGFwRGVsYXkgfHwgMjAwO1xuXG5cdFx0LyoqXG5cdFx0ICogVGhlIG1heGltdW0gdGltZSBmb3IgYSB0YXBcblx0XHQgKlxuXHRcdCAqIEB0eXBlIG51bWJlclxuXHRcdCAqL1xuXHRcdHRoaXMudGFwVGltZW91dCA9IG9wdGlvbnMudGFwVGltZW91dCB8fCA3MDA7XG5cblx0XHRpZiAoRmFzdENsaWNrLm5vdE5lZWRlZChsYXllcikpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBTb21lIG9sZCB2ZXJzaW9ucyBvZiBBbmRyb2lkIGRvbid0IGhhdmUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcblx0XHRmdW5jdGlvbiBiaW5kKG1ldGhvZCwgY29udGV4dCkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gbWV0aG9kLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7IH07XG5cdFx0fVxuXG5cblx0XHR2YXIgbWV0aG9kcyA9IFsnb25Nb3VzZScsICdvbkNsaWNrJywgJ29uVG91Y2hTdGFydCcsICdvblRvdWNoTW92ZScsICdvblRvdWNoRW5kJywgJ29uVG91Y2hDYW5jZWwnXTtcblx0XHR2YXIgY29udGV4dCA9IHRoaXM7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGwgPSBtZXRob2RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHRcdFx0Y29udGV4dFttZXRob2RzW2ldXSA9IGJpbmQoY29udGV4dFttZXRob2RzW2ldXSwgY29udGV4dCk7XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHVwIGV2ZW50IGhhbmRsZXJzIGFzIHJlcXVpcmVkXG5cdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlLCB0cnVlKTtcblx0XHR9XG5cblx0XHRsYXllci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbGljaywgdHJ1ZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMub25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSwgZmFsc2UpO1xuXHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vblRvdWNoRW5kLCBmYWxzZSk7XG5cdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uVG91Y2hDYW5jZWwsIGZhbHNlKTtcblxuXHRcdC8vIEhhY2sgaXMgcmVxdWlyZWQgZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3Qgc3VwcG9ydCBFdmVudCNzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gKGUuZy4gQW5kcm9pZCAyKVxuXHRcdC8vIHdoaWNoIGlzIGhvdyBGYXN0Q2xpY2sgbm9ybWFsbHkgc3RvcHMgY2xpY2sgZXZlbnRzIGJ1YmJsaW5nIHRvIGNhbGxiYWNrcyByZWdpc3RlcmVkIG9uIHRoZSBGYXN0Q2xpY2tcblx0XHQvLyBsYXllciB3aGVuIHRoZXkgYXJlIGNhbmNlbGxlZC5cblx0XHRpZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0XHR2YXIgcm12ID0gTm9kZS5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0XHRybXYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgY2FsbGJhY2ssIGNhcHR1cmUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJtdi5jYWxsKGxheWVyLCB0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdGxheWVyLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaywgY2FwdHVyZSkge1xuXHRcdFx0XHR2YXIgYWR2ID0gTm9kZS5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRcdFx0aWYgKHR5cGUgPT09ICdjbGljaycpIHtcblx0XHRcdFx0XHRhZHYuY2FsbChsYXllciwgdHlwZSwgY2FsbGJhY2suaGlqYWNrZWQgfHwgKGNhbGxiYWNrLmhpamFja2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdFx0XHRcdGlmICghZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKGV2ZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KSwgY2FwdHVyZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YWR2LmNhbGwobGF5ZXIsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBJZiBhIGhhbmRsZXIgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGUgZWxlbWVudCdzIG9uY2xpY2sgYXR0cmlidXRlLCBpdCB3aWxsIGJlIGZpcmVkIGJlZm9yZVxuXHRcdC8vIEZhc3RDbGljaydzIG9uQ2xpY2sgaGFuZGxlci4gRml4IHRoaXMgYnkgcHVsbGluZyBvdXQgdGhlIHVzZXItZGVmaW5lZCBoYW5kbGVyIGZ1bmN0aW9uIGFuZFxuXHRcdC8vIGFkZGluZyBpdCBhcyBsaXN0ZW5lci5cblx0XHRpZiAodHlwZW9mIGxheWVyLm9uY2xpY2sgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0Ly8gQW5kcm9pZCBicm93c2VyIG9uIGF0IGxlYXN0IDMuMiByZXF1aXJlcyBhIG5ldyByZWZlcmVuY2UgdG8gdGhlIGZ1bmN0aW9uIGluIGxheWVyLm9uY2xpY2tcblx0XHRcdC8vIC0gdGhlIG9sZCBvbmUgd29uJ3Qgd29yayBpZiBwYXNzZWQgdG8gYWRkRXZlbnRMaXN0ZW5lciBkaXJlY3RseS5cblx0XHRcdG9sZE9uQ2xpY2sgPSBsYXllci5vbmNsaWNrO1xuXHRcdFx0bGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuXHRcdFx0XHRvbGRPbkNsaWNrKGV2ZW50KTtcblx0XHRcdH0sIGZhbHNlKTtcblx0XHRcdGxheWVyLm9uY2xpY2sgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQqIFdpbmRvd3MgUGhvbmUgOC4xIGZha2VzIHVzZXIgYWdlbnQgc3RyaW5nIHRvIGxvb2sgbGlrZSBBbmRyb2lkIGFuZCBpUGhvbmUuXG5cdCpcblx0KiBAdHlwZSBib29sZWFuXG5cdCovXG5cdHZhciBkZXZpY2VJc1dpbmRvd3NQaG9uZSA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIldpbmRvd3MgUGhvbmVcIikgPj0gMDtcblxuXHQvKipcblx0ICogQW5kcm9pZCByZXF1aXJlcyBleGNlcHRpb25zLlxuXHQgKlxuXHQgKiBAdHlwZSBib29sZWFuXG5cdCAqL1xuXHR2YXIgZGV2aWNlSXNBbmRyb2lkID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdBbmRyb2lkJykgPiAwICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgcmVxdWlyZXMgZXhjZXB0aW9ucy5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dmFyIGRldmljZUlzSU9TID0gL2lQKGFkfGhvbmV8b2QpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmICFkZXZpY2VJc1dpbmRvd3NQaG9uZTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgNCByZXF1aXJlcyBhbiBleGNlcHRpb24gZm9yIHNlbGVjdCBlbGVtZW50cy5cblx0ICpcblx0ICogQHR5cGUgYm9vbGVhblxuXHQgKi9cblx0dmFyIGRldmljZUlzSU9TNCA9IGRldmljZUlzSU9TICYmICgvT1MgNF9cXGQoX1xcZCk/LykudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuXG5cdC8qKlxuXHQgKiBpT1MgNi4wLTcuKiByZXF1aXJlcyB0aGUgdGFyZ2V0IGVsZW1lbnQgdG8gYmUgbWFudWFsbHkgZGVyaXZlZFxuXHQgKlxuXHQgKiBAdHlwZSBib29sZWFuXG5cdCAqL1xuXHR2YXIgZGV2aWNlSXNJT1NXaXRoQmFkVGFyZ2V0ID0gZGV2aWNlSXNJT1MgJiYgKC9PUyBbNi03XV9cXGQvKS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cdC8qKlxuXHQgKiBCbGFja0JlcnJ5IHJlcXVpcmVzIGV4Y2VwdGlvbnMuXG5cdCAqXG5cdCAqIEB0eXBlIGJvb2xlYW5cblx0ICovXG5cdHZhciBkZXZpY2VJc0JsYWNrQmVycnkxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQkIxMCcpID4gMDtcblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIHdoZXRoZXIgYSBnaXZlbiBlbGVtZW50IHJlcXVpcmVzIGEgbmF0aXZlIGNsaWNrLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCBuZWVkcyBhIG5hdGl2ZSBjbGlja1xuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0NsaWNrID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXG5cdFx0Ly8gRG9uJ3Qgc2VuZCBhIHN5bnRoZXRpYyBjbGljayB0byBkaXNhYmxlZCBpbnB1dHMgKGlzc3VlICM2Milcblx0XHRjYXNlICdidXR0b24nOlxuXHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0Y2FzZSAndGV4dGFyZWEnOlxuXHRcdFx0aWYgKHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnaW5wdXQnOlxuXG5cdFx0XHQvLyBGaWxlIGlucHV0cyBuZWVkIHJlYWwgY2xpY2tzIG9uIGlPUyA2IGR1ZSB0byBhIGJyb3dzZXIgYnVnIChpc3N1ZSAjNjgpXG5cdFx0XHRpZiAoKGRldmljZUlzSU9TICYmIHRhcmdldC50eXBlID09PSAnZmlsZScpIHx8IHRhcmdldC5kaXNhYmxlZCkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbGFiZWwnOlxuXHRcdGNhc2UgJ2lmcmFtZSc6IC8vIGlPUzggaG9tZXNjcmVlbiBhcHBzIGNhbiBwcmV2ZW50IGV2ZW50cyBidWJibGluZyBpbnRvIGZyYW1lc1xuXHRcdGNhc2UgJ3ZpZGVvJzpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiAoL1xcYm5lZWRzY2xpY2tcXGIvKS50ZXN0KHRhcmdldC5jbGFzc05hbWUpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIERldGVybWluZSB3aGV0aGVyIGEgZ2l2ZW4gZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgY2xpY2sgaW50byBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fEVsZW1lbnR9IHRhcmdldCBUYXJnZXQgRE9NIGVsZW1lbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgZWxlbWVudCByZXF1aXJlcyBhIGNhbGwgdG8gZm9jdXMgdG8gc2ltdWxhdGUgbmF0aXZlIGNsaWNrLlxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5uZWVkc0ZvY3VzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG5cdFx0c3dpdGNoICh0YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuXHRcdGNhc2UgJ3RleHRhcmVhJzpcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhc2UgJ3NlbGVjdCc6XG5cdFx0XHRyZXR1cm4gIWRldmljZUlzQW5kcm9pZDtcblx0XHRjYXNlICdpbnB1dCc6XG5cdFx0XHRzd2l0Y2ggKHRhcmdldC50eXBlKSB7XG5cdFx0XHRjYXNlICdidXR0b24nOlxuXHRcdFx0Y2FzZSAnY2hlY2tib3gnOlxuXHRcdFx0Y2FzZSAnZmlsZSc6XG5cdFx0XHRjYXNlICdpbWFnZSc6XG5cdFx0XHRjYXNlICdyYWRpbyc6XG5cdFx0XHRjYXNlICdzdWJtaXQnOlxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE5vIHBvaW50IGluIGF0dGVtcHRpbmcgdG8gZm9jdXMgZGlzYWJsZWQgaW5wdXRzXG5cdFx0XHRyZXR1cm4gIXRhcmdldC5kaXNhYmxlZCAmJiAhdGFyZ2V0LnJlYWRPbmx5O1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZXR1cm4gKC9cXGJuZWVkc2ZvY3VzXFxiLykudGVzdCh0YXJnZXQuY2xhc3NOYW1lKTtcblx0XHR9XG5cdH07XG5cblxuXHQvKipcblx0ICogU2VuZCBhIGNsaWNrIGV2ZW50IHRvIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxFbGVtZW50fSB0YXJnZXRFbGVtZW50XG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLnNlbmRDbGljayA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQsIGV2ZW50KSB7XG5cdFx0dmFyIGNsaWNrRXZlbnQsIHRvdWNoO1xuXG5cdFx0Ly8gT24gc29tZSBBbmRyb2lkIGRldmljZXMgYWN0aXZlRWxlbWVudCBuZWVkcyB0byBiZSBibHVycmVkIG90aGVyd2lzZSB0aGUgc3ludGhldGljIGNsaWNrIHdpbGwgaGF2ZSBubyBlZmZlY3QgKCMyNClcblx0XHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0YXJnZXRFbGVtZW50KSB7XG5cdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0XHR9XG5cblx0XHR0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuXG5cdFx0Ly8gU3ludGhlc2lzZSBhIGNsaWNrIGV2ZW50LCB3aXRoIGFuIGV4dHJhIGF0dHJpYnV0ZSBzbyBpdCBjYW4gYmUgdHJhY2tlZFxuXHRcdGNsaWNrRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcblx0XHRjbGlja0V2ZW50LmluaXRNb3VzZUV2ZW50KHRoaXMuZGV0ZXJtaW5lRXZlbnRUeXBlKHRhcmdldEVsZW1lbnQpLCB0cnVlLCB0cnVlLCB3aW5kb3csIDEsIHRvdWNoLnNjcmVlblgsIHRvdWNoLnNjcmVlblksIHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFksIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcblx0XHRjbGlja0V2ZW50LmZvcndhcmRlZFRvdWNoRXZlbnQgPSB0cnVlO1xuXHRcdHRhcmdldEVsZW1lbnQuZGlzcGF0Y2hFdmVudChjbGlja0V2ZW50KTtcblx0fTtcblxuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmRldGVybWluZUV2ZW50VHlwZSA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblxuXHRcdC8vSXNzdWUgIzE1OTogQW5kcm9pZCBDaHJvbWUgU2VsZWN0IEJveCBkb2VzIG5vdCBvcGVuIHdpdGggYSBzeW50aGV0aWMgY2xpY2sgZXZlbnRcblx0XHRpZiAoZGV2aWNlSXNBbmRyb2lkICYmIHRhcmdldEVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0Jykge1xuXHRcdFx0cmV0dXJuICdtb3VzZWRvd24nO1xuXHRcdH1cblxuXHRcdHJldHVybiAnY2xpY2snO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHRhcmdldEVsZW1lbnQpIHtcblx0XHR2YXIgbGVuZ3RoO1xuXG5cdFx0Ly8gSXNzdWUgIzE2MDogb24gaU9TIDcsIHNvbWUgaW5wdXQgZWxlbWVudHMgKGUuZy4gZGF0ZSBkYXRldGltZSBtb250aCkgdGhyb3cgYSB2YWd1ZSBUeXBlRXJyb3Igb24gc2V0U2VsZWN0aW9uUmFuZ2UuIFRoZXNlIGVsZW1lbnRzIGRvbid0IGhhdmUgYW4gaW50ZWdlciB2YWx1ZSBmb3IgdGhlIHNlbGVjdGlvblN0YXJ0IGFuZCBzZWxlY3Rpb25FbmQgcHJvcGVydGllcywgYnV0IHVuZm9ydHVuYXRlbHkgdGhhdCBjYW4ndCBiZSB1c2VkIGZvciBkZXRlY3Rpb24gYmVjYXVzZSBhY2Nlc3NpbmcgdGhlIHByb3BlcnRpZXMgYWxzbyB0aHJvd3MgYSBUeXBlRXJyb3IuIEp1c3QgY2hlY2sgdGhlIHR5cGUgaW5zdGVhZC4gRmlsZWQgYXMgQXBwbGUgYnVnICMxNTEyMjcyNC5cblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgdGFyZ2V0RWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZSAmJiB0YXJnZXRFbGVtZW50LnR5cGUuaW5kZXhPZignZGF0ZScpICE9PSAwICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ3RpbWUnICYmIHRhcmdldEVsZW1lbnQudHlwZSAhPT0gJ21vbnRoJykge1xuXHRcdFx0bGVuZ3RoID0gdGFyZ2V0RWxlbWVudC52YWx1ZS5sZW5ndGg7XG5cdFx0XHR0YXJnZXRFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGxlbmd0aCwgbGVuZ3RoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0RWxlbWVudC5mb2N1cygpO1xuXHRcdH1cblx0fTtcblxuXG5cdC8qKlxuXHQgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB0YXJnZXQgZWxlbWVudCBpcyBhIGNoaWxkIG9mIGEgc2Nyb2xsYWJsZSBsYXllciBhbmQgaWYgc28sIHNldCBhIGZsYWcgb24gaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR8RWxlbWVudH0gdGFyZ2V0RWxlbWVudFxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS51cGRhdGVTY3JvbGxQYXJlbnQgPSBmdW5jdGlvbih0YXJnZXRFbGVtZW50KSB7XG5cdFx0dmFyIHNjcm9sbFBhcmVudCwgcGFyZW50RWxlbWVudDtcblxuXHRcdHNjcm9sbFBhcmVudCA9IHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50O1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byBkaXNjb3ZlciB3aGV0aGVyIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgc2Nyb2xsYWJsZSBsYXllci4gUmUtY2hlY2sgaWYgdGhlXG5cdFx0Ly8gdGFyZ2V0IGVsZW1lbnQgd2FzIG1vdmVkIHRvIGFub3RoZXIgcGFyZW50LlxuXHRcdGlmICghc2Nyb2xsUGFyZW50IHx8ICFzY3JvbGxQYXJlbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCkpIHtcblx0XHRcdHBhcmVudEVsZW1lbnQgPSB0YXJnZXRFbGVtZW50O1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHRpZiAocGFyZW50RWxlbWVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkge1xuXHRcdFx0XHRcdHNjcm9sbFBhcmVudCA9IHBhcmVudEVsZW1lbnQ7XG5cdFx0XHRcdFx0dGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQgPSBwYXJlbnRFbGVtZW50O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcblx0XHRcdH0gd2hpbGUgKHBhcmVudEVsZW1lbnQpO1xuXHRcdH1cblxuXHRcdC8vIEFsd2F5cyB1cGRhdGUgdGhlIHNjcm9sbCB0b3AgdHJhY2tlciBpZiBwb3NzaWJsZS5cblx0XHRpZiAoc2Nyb2xsUGFyZW50KSB7XG5cdFx0XHRzY3JvbGxQYXJlbnQuZmFzdENsaWNrTGFzdFNjcm9sbFRvcCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3A7XG5cdFx0fVxuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldEVsZW1lbnRcblx0ICogQHJldHVybnMge0VsZW1lbnR8RXZlbnRUYXJnZXR9XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQgPSBmdW5jdGlvbihldmVudFRhcmdldCkge1xuXG5cdFx0Ly8gT24gc29tZSBvbGRlciBicm93c2VycyAobm90YWJseSBTYWZhcmkgb24gaU9TIDQuMSAtIHNlZSBpc3N1ZSAjNTYpIHRoZSBldmVudCB0YXJnZXQgbWF5IGJlIGEgdGV4dCBub2RlLlxuXHRcdGlmIChldmVudFRhcmdldC5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcblx0XHRcdHJldHVybiBldmVudFRhcmdldC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdHJldHVybiBldmVudFRhcmdldDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBPbiB0b3VjaCBzdGFydCwgcmVjb3JkIHRoZSBwb3NpdGlvbiBhbmQgc2Nyb2xsIG9mZnNldC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hTdGFydCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRhcmdldEVsZW1lbnQsIHRvdWNoLCBzZWxlY3Rpb247XG5cblx0XHQvLyBJZ25vcmUgbXVsdGlwbGUgdG91Y2hlcywgb3RoZXJ3aXNlIHBpbmNoLXRvLXpvb20gaXMgcHJldmVudGVkIGlmIGJvdGggZmluZ2VycyBhcmUgb24gdGhlIEZhc3RDbGljayBlbGVtZW50IChpc3N1ZSAjMTExKS5cblx0XHRpZiAoZXZlbnQudGFyZ2V0VG91Y2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHR0YXJnZXRFbGVtZW50ID0gdGhpcy5nZXRUYXJnZXRFbGVtZW50RnJvbUV2ZW50VGFyZ2V0KGV2ZW50LnRhcmdldCk7XG5cdFx0dG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzWzBdO1xuXG5cdFx0aWYgKGRldmljZUlzSU9TKSB7XG5cblx0XHRcdC8vIE9ubHkgdHJ1c3RlZCBldmVudHMgd2lsbCBkZXNlbGVjdCB0ZXh0IG9uIGlPUyAoaXNzdWUgIzQ5KVxuXHRcdFx0c2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuXHRcdFx0aWYgKHNlbGVjdGlvbi5yYW5nZUNvdW50ICYmICFzZWxlY3Rpb24uaXNDb2xsYXBzZWQpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZGV2aWNlSXNJT1M0KSB7XG5cblx0XHRcdFx0Ly8gV2VpcmQgdGhpbmdzIGhhcHBlbiBvbiBpT1Mgd2hlbiBhbiBhbGVydCBvciBjb25maXJtIGRpYWxvZyBpcyBvcGVuZWQgZnJvbSBhIGNsaWNrIGV2ZW50IGNhbGxiYWNrIChpc3N1ZSAjMjMpOlxuXHRcdFx0XHQvLyB3aGVuIHRoZSB1c2VyIG5leHQgdGFwcyBhbnl3aGVyZSBlbHNlIG9uIHRoZSBwYWdlLCBuZXcgdG91Y2hzdGFydCBhbmQgdG91Y2hlbmQgZXZlbnRzIGFyZSBkaXNwYXRjaGVkXG5cdFx0XHRcdC8vIHdpdGggdGhlIHNhbWUgaWRlbnRpZmllciBhcyB0aGUgdG91Y2ggZXZlbnQgdGhhdCBwcmV2aW91c2x5IHRyaWdnZXJlZCB0aGUgY2xpY2sgdGhhdCB0cmlnZ2VyZWQgdGhlIGFsZXJ0LlxuXHRcdFx0XHQvLyBTYWRseSwgdGhlcmUgaXMgYW4gaXNzdWUgb24gaU9TIDQgdGhhdCBjYXVzZXMgc29tZSBub3JtYWwgdG91Y2ggZXZlbnRzIHRvIGhhdmUgdGhlIHNhbWUgaWRlbnRpZmllciBhcyBhblxuXHRcdFx0XHQvLyBpbW1lZGlhdGVseSBwcmVjZWVkaW5nIHRvdWNoIGV2ZW50IChpc3N1ZSAjNTIpLCBzbyB0aGlzIGZpeCBpcyB1bmF2YWlsYWJsZSBvbiB0aGF0IHBsYXRmb3JtLlxuXHRcdFx0XHQvLyBJc3N1ZSAxMjA6IHRvdWNoLmlkZW50aWZpZXIgaXMgMCB3aGVuIENocm9tZSBkZXYgdG9vbHMgJ0VtdWxhdGUgdG91Y2ggZXZlbnRzJyBpcyBzZXQgd2l0aCBhbiBpT1MgZGV2aWNlIFVBIHN0cmluZyxcblx0XHRcdFx0Ly8gd2hpY2ggY2F1c2VzIGFsbCB0b3VjaCBldmVudHMgdG8gYmUgaWdub3JlZC4gQXMgdGhpcyBibG9jayBvbmx5IGFwcGxpZXMgdG8gaU9TLCBhbmQgaU9TIGlkZW50aWZpZXJzIGFyZSBhbHdheXMgbG9uZyxcblx0XHRcdFx0Ly8gcmFuZG9tIGludGVnZXJzLCBpdCdzIHNhZmUgdG8gdG8gY29udGludWUgaWYgdGhlIGlkZW50aWZpZXIgaXMgMCBoZXJlLlxuXHRcdFx0XHRpZiAodG91Y2guaWRlbnRpZmllciAmJiB0b3VjaC5pZGVudGlmaWVyID09PSB0aGlzLmxhc3RUb3VjaElkZW50aWZpZXIpIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMubGFzdFRvdWNoSWRlbnRpZmllciA9IHRvdWNoLmlkZW50aWZpZXI7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHRhcmdldCBlbGVtZW50IGlzIGEgY2hpbGQgb2YgYSBzY3JvbGxhYmxlIGxheWVyICh1c2luZyAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2gpIGFuZDpcblx0XHRcdFx0Ly8gMSkgdGhlIHVzZXIgZG9lcyBhIGZsaW5nIHNjcm9sbCBvbiB0aGUgc2Nyb2xsYWJsZSBsYXllclxuXHRcdFx0XHQvLyAyKSB0aGUgdXNlciBzdG9wcyB0aGUgZmxpbmcgc2Nyb2xsIHdpdGggYW5vdGhlciB0YXBcblx0XHRcdFx0Ly8gdGhlbiB0aGUgZXZlbnQudGFyZ2V0IG9mIHRoZSBsYXN0ICd0b3VjaGVuZCcgZXZlbnQgd2lsbCBiZSB0aGUgZWxlbWVudCB0aGF0IHdhcyB1bmRlciB0aGUgdXNlcidzIGZpbmdlclxuXHRcdFx0XHQvLyB3aGVuIHRoZSBmbGluZyBzY3JvbGwgd2FzIHN0YXJ0ZWQsIGNhdXNpbmcgRmFzdENsaWNrIHRvIHNlbmQgYSBjbGljayBldmVudCB0byB0aGF0IGxheWVyIC0gdW5sZXNzIGEgY2hlY2tcblx0XHRcdFx0Ly8gaXMgbWFkZSB0byBlbnN1cmUgdGhhdCBhIHBhcmVudCBsYXllciB3YXMgbm90IHNjcm9sbGVkIGJlZm9yZSBzZW5kaW5nIGEgc3ludGhldGljIGNsaWNrIChpc3N1ZSAjNDIpLlxuXHRcdFx0XHR0aGlzLnVwZGF0ZVNjcm9sbFBhcmVudCh0YXJnZXRFbGVtZW50KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSB0cnVlO1xuXHRcdHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0ID0gZXZlbnQudGltZVN0YW1wO1xuXHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XG5cblx0XHR0aGlzLnRvdWNoU3RhcnRYID0gdG91Y2gucGFnZVg7XG5cdFx0dGhpcy50b3VjaFN0YXJ0WSA9IHRvdWNoLnBhZ2VZO1xuXG5cdFx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIEJhc2VkIG9uIGEgdG91Y2htb3ZlIGV2ZW50IG9iamVjdCwgY2hlY2sgd2hldGhlciB0aGUgdG91Y2ggaGFzIG1vdmVkIHBhc3QgYSBib3VuZGFyeSBzaW5jZSBpdCBzdGFydGVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdEZhc3RDbGljay5wcm90b3R5cGUudG91Y2hIYXNNb3ZlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0dmFyIHRvdWNoID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sIGJvdW5kYXJ5ID0gdGhpcy50b3VjaEJvdW5kYXJ5O1xuXG5cdFx0aWYgKE1hdGguYWJzKHRvdWNoLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0WCkgPiBib3VuZGFyeSB8fCBNYXRoLmFicyh0b3VjaC5wYWdlWSAtIHRoaXMudG91Y2hTdGFydFkpID4gYm91bmRhcnkpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBVcGRhdGUgdGhlIGxhc3QgcG9zaXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYgKCF0aGlzLnRyYWNraW5nQ2xpY2spIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIElmIHRoZSB0b3VjaCBoYXMgbW92ZWQsIGNhbmNlbCB0aGUgY2xpY2sgdHJhY2tpbmdcblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50ICE9PSB0aGlzLmdldFRhcmdldEVsZW1lbnRGcm9tRXZlbnRUYXJnZXQoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLnRvdWNoSGFzTW92ZWQoZXZlbnQpKSB7XG5cdFx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH07XG5cblxuXHQvKipcblx0ICogQXR0ZW1wdCB0byBmaW5kIHRoZSBsYWJlbGxlZCBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbGFiZWwgZWxlbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudFRhcmdldHxIVE1MTGFiZWxFbGVtZW50fSBsYWJlbEVsZW1lbnRcblx0ICogQHJldHVybnMge0VsZW1lbnR8bnVsbH1cblx0ICovXG5cdEZhc3RDbGljay5wcm90b3R5cGUuZmluZENvbnRyb2wgPSBmdW5jdGlvbihsYWJlbEVsZW1lbnQpIHtcblxuXHRcdC8vIEZhc3QgcGF0aCBmb3IgbmV3ZXIgYnJvd3NlcnMgc3VwcG9ydGluZyB0aGUgSFRNTDUgY29udHJvbCBhdHRyaWJ1dGVcblx0XHRpZiAobGFiZWxFbGVtZW50LmNvbnRyb2wgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0cmV0dXJuIGxhYmVsRWxlbWVudC5jb250cm9sO1xuXHRcdH1cblxuXHRcdC8vIEFsbCBicm93c2VycyB1bmRlciB0ZXN0IHRoYXQgc3VwcG9ydCB0b3VjaCBldmVudHMgYWxzbyBzdXBwb3J0IHRoZSBIVE1MNSBodG1sRm9yIGF0dHJpYnV0ZVxuXHRcdGlmIChsYWJlbEVsZW1lbnQuaHRtbEZvcikge1xuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxhYmVsRWxlbWVudC5odG1sRm9yKTtcblx0XHR9XG5cblx0XHQvLyBJZiBubyBmb3IgYXR0cmlidXRlIGV4aXN0cywgYXR0ZW1wdCB0byByZXRyaWV2ZSB0aGUgZmlyc3QgbGFiZWxsYWJsZSBkZXNjZW5kYW50IGVsZW1lbnRcblx0XHQvLyB0aGUgbGlzdCBvZiB3aGljaCBpcyBkZWZpbmVkIGhlcmU6IGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGFiZWxcblx0XHRyZXR1cm4gbGFiZWxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbiwgaW5wdXQ6bm90KFt0eXBlPWhpZGRlbl0pLCBrZXlnZW4sIG1ldGVyLCBvdXRwdXQsIHByb2dyZXNzLCBzZWxlY3QsIHRleHRhcmVhJyk7XG5cdH07XG5cblxuXHQvKipcblx0ICogT24gdG91Y2ggZW5kLCBkZXRlcm1pbmUgd2hldGhlciB0byBzZW5kIGEgY2xpY2sgZXZlbnQgYXQgb25jZS5cblx0ICpcblx0ICogQHBhcmFtIHtFdmVudH0gZXZlbnRcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRGYXN0Q2xpY2sucHJvdG90eXBlLm9uVG91Y2hFbmQgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdHZhciBmb3JFbGVtZW50LCB0cmFja2luZ0NsaWNrU3RhcnQsIHRhcmdldFRhZ05hbWUsIHNjcm9sbFBhcmVudCwgdG91Y2gsIHRhcmdldEVsZW1lbnQgPSB0aGlzLnRhcmdldEVsZW1lbnQ7XG5cblx0XHRpZiAoIXRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUHJldmVudCBwaGFudG9tIGNsaWNrcyBvbiBmYXN0IGRvdWJsZS10YXAgKGlzc3VlICMzNilcblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMubGFzdENsaWNrVGltZSkgPCB0aGlzLnRhcERlbGF5KSB7XG5cdFx0XHR0aGlzLmNhbmNlbE5leHRDbGljayA9IHRydWU7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAoKGV2ZW50LnRpbWVTdGFtcCAtIHRoaXMudHJhY2tpbmdDbGlja1N0YXJ0KSA+IHRoaXMudGFwVGltZW91dCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUmVzZXQgdG8gcHJldmVudCB3cm9uZyBjbGljayBjYW5jZWwgb24gaW5wdXQgKGlzc3VlICMxNTYpLlxuXHRcdHRoaXMuY2FuY2VsTmV4dENsaWNrID0gZmFsc2U7XG5cblx0XHR0aGlzLmxhc3RDbGlja1RpbWUgPSBldmVudC50aW1lU3RhbXA7XG5cblx0XHR0cmFja2luZ0NsaWNrU3RhcnQgPSB0aGlzLnRyYWNraW5nQ2xpY2tTdGFydDtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2sgPSBmYWxzZTtcblx0XHR0aGlzLnRyYWNraW5nQ2xpY2tTdGFydCA9IDA7XG5cblx0XHQvLyBPbiBzb21lIGlPUyBkZXZpY2VzLCB0aGUgdGFyZ2V0RWxlbWVudCBzdXBwbGllZCB3aXRoIHRoZSBldmVudCBpcyBpbnZhbGlkIGlmIHRoZSBsYXllclxuXHRcdC8vIGlzIHBlcmZvcm1pbmcgYSB0cmFuc2l0aW9uIG9yIHNjcm9sbCwgYW5kIGhhcyB0byBiZSByZS1kZXRlY3RlZCBtYW51YWxseS4gTm90ZSB0aGF0XG5cdFx0Ly8gZm9yIHRoaXMgdG8gZnVuY3Rpb24gY29ycmVjdGx5LCBpdCBtdXN0IGJlIGNhbGxlZCAqYWZ0ZXIqIHRoZSBldmVudCB0YXJnZXQgaXMgY2hlY2tlZCFcblx0XHQvLyBTZWUgaXNzdWUgIzU3OyBhbHNvIGZpbGVkIGFzIHJkYXI6Ly8xMzA0ODU4OSAuXG5cdFx0aWYgKGRldmljZUlzSU9TV2l0aEJhZFRhcmdldCkge1xuXHRcdFx0dG91Y2ggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXTtcblxuXHRcdFx0Ly8gSW4gY2VydGFpbiBjYXNlcyBhcmd1bWVudHMgb2YgZWxlbWVudEZyb21Qb2ludCBjYW4gYmUgbmVnYXRpdmUsIHNvIHByZXZlbnQgc2V0dGluZyB0YXJnZXRFbGVtZW50IHRvIG51bGxcblx0XHRcdHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHRvdWNoLnBhZ2VYIC0gd2luZG93LnBhZ2VYT2Zmc2V0LCB0b3VjaC5wYWdlWSAtIHdpbmRvdy5wYWdlWU9mZnNldCkgfHwgdGFyZ2V0RWxlbWVudDtcblx0XHRcdHRhcmdldEVsZW1lbnQuZmFzdENsaWNrU2Nyb2xsUGFyZW50ID0gdGhpcy50YXJnZXRFbGVtZW50LmZhc3RDbGlja1Njcm9sbFBhcmVudDtcblx0XHR9XG5cblx0XHR0YXJnZXRUYWdOYW1lID0gdGFyZ2V0RWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0aWYgKHRhcmdldFRhZ05hbWUgPT09ICdsYWJlbCcpIHtcblx0XHRcdGZvckVsZW1lbnQgPSB0aGlzLmZpbmRDb250cm9sKHRhcmdldEVsZW1lbnQpO1xuXHRcdFx0aWYgKGZvckVsZW1lbnQpIHtcblx0XHRcdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHRcdFx0aWYgKGRldmljZUlzQW5kcm9pZCkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRhcmdldEVsZW1lbnQgPSBmb3JFbGVtZW50O1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodGhpcy5uZWVkc0ZvY3VzKHRhcmdldEVsZW1lbnQpKSB7XG5cblx0XHRcdC8vIENhc2UgMTogSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgYSB3aGlsZSBhZ28gKGJlc3QgZ3Vlc3MgaXMgMTAwbXMgYmFzZWQgb24gdGVzdHMgZm9yIGlzc3VlICMzNikgdGhlbiBmb2N1cyB3aWxsIGJlIHRyaWdnZXJlZCBhbnl3YXkuIFJldHVybiBlYXJseSBhbmQgdW5zZXQgdGhlIHRhcmdldCBlbGVtZW50IHJlZmVyZW5jZSBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IGNsaWNrIHdpbGwgYmUgYWxsb3dlZCB0aHJvdWdoLlxuXHRcdFx0Ly8gQ2FzZSAyOiBXaXRob3V0IHRoaXMgZXhjZXB0aW9uIGZvciBpbnB1dCBlbGVtZW50cyB0YXBwZWQgd2hlbiB0aGUgZG9jdW1lbnQgaXMgY29udGFpbmVkIGluIGFuIGlmcmFtZSwgdGhlbiBhbnkgaW5wdXR0ZWQgdGV4dCB3b24ndCBiZSB2aXNpYmxlIGV2ZW4gdGhvdWdoIHRoZSB2YWx1ZSBhdHRyaWJ1dGUgaXMgdXBkYXRlZCBhcyB0aGUgdXNlciB0eXBlcyAoaXNzdWUgIzM3KS5cblx0XHRcdGlmICgoZXZlbnQudGltZVN0YW1wIC0gdHJhY2tpbmdDbGlja1N0YXJ0KSA+IDEwMCB8fCAoZGV2aWNlSXNJT1MgJiYgd2luZG93LnRvcCAhPT0gd2luZG93ICYmIHRhcmdldFRhZ05hbWUgPT09ICdpbnB1dCcpKSB7XG5cdFx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5mb2N1cyh0YXJnZXRFbGVtZW50KTtcblx0XHRcdHRoaXMuc2VuZENsaWNrKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcblxuXHRcdFx0Ly8gU2VsZWN0IGVsZW1lbnRzIG5lZWQgdGhlIGV2ZW50IHRvIGdvIHRocm91Z2ggb24gaU9TIDQsIG90aGVyd2lzZSB0aGUgc2VsZWN0b3IgbWVudSB3b24ndCBvcGVuLlxuXHRcdFx0Ly8gQWxzbyB0aGlzIGJyZWFrcyBvcGVuaW5nIHNlbGVjdHMgd2hlbiBWb2ljZU92ZXIgaXMgYWN0aXZlIG9uIGlPUzYsIGlPUzcgKGFuZCBwb3NzaWJseSBvdGhlcnMpXG5cdFx0XHRpZiAoIWRldmljZUlzSU9TIHx8IHRhcmdldFRhZ05hbWUgIT09ICdzZWxlY3QnKSB7XG5cdFx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IG51bGw7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoZGV2aWNlSXNJT1MgJiYgIWRldmljZUlzSU9TNCkge1xuXG5cdFx0XHQvLyBEb24ndCBzZW5kIGEgc3ludGhldGljIGNsaWNrIGV2ZW50IGlmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBjb250YWluZWQgd2l0aGluIGEgcGFyZW50IGxheWVyIHRoYXQgd2FzIHNjcm9sbGVkXG5cdFx0XHQvLyBhbmQgdGhpcyB0YXAgaXMgYmVpbmcgdXNlZCB0byBzdG9wIHRoZSBzY3JvbGxpbmcgKHVzdWFsbHkgaW5pdGlhdGVkIGJ5IGEgZmxpbmcgLSBpc3N1ZSAjNDIpLlxuXHRcdFx0c2Nyb2xsUGFyZW50ID0gdGFyZ2V0RWxlbWVudC5mYXN0Q2xpY2tTY3JvbGxQYXJlbnQ7XG5cdFx0XHRpZiAoc2Nyb2xsUGFyZW50ICYmIHNjcm9sbFBhcmVudC5mYXN0Q2xpY2tMYXN0U2Nyb2xsVG9wICE9PSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFByZXZlbnQgdGhlIGFjdHVhbCBjbGljayBmcm9tIGdvaW5nIHRob3VnaCAtIHVubGVzcyB0aGUgdGFyZ2V0IG5vZGUgaXMgbWFya2VkIGFzIHJlcXVpcmluZ1xuXHRcdC8vIHJlYWwgY2xpY2tzIG9yIGlmIGl0IGlzIGluIHRoZSB3aGl0ZWxpc3QgaW4gd2hpY2ggY2FzZSBvbmx5IG5vbi1wcm9ncmFtbWF0aWMgY2xpY2tzIGFyZSBwZXJtaXR0ZWQuXG5cdFx0aWYgKCF0aGlzLm5lZWRzQ2xpY2sodGFyZ2V0RWxlbWVudCkpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLnNlbmRDbGljayh0YXJnZXRFbGVtZW50LCBldmVudCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIE9uIHRvdWNoIGNhbmNlbCwgc3RvcCB0cmFja2luZyB0aGUgY2xpY2suXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vblRvdWNoQ2FuY2VsID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50cmFja2luZ0NsaWNrID0gZmFsc2U7XG5cdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgbW91c2UgZXZlbnRzIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vbk1vdXNlID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdC8vIElmIGEgdGFyZ2V0IGVsZW1lbnQgd2FzIG5ldmVyIHNldCAoYmVjYXVzZSBhIHRvdWNoIGV2ZW50IHdhcyBuZXZlciBmaXJlZCkgYWxsb3cgdGhlIGV2ZW50XG5cdFx0aWYgKCF0aGlzLnRhcmdldEVsZW1lbnQpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChldmVudC5mb3J3YXJkZWRUb3VjaEV2ZW50KSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBQcm9ncmFtbWF0aWNhbGx5IGdlbmVyYXRlZCBldmVudHMgdGFyZ2V0aW5nIGEgc3BlY2lmaWMgZWxlbWVudCBzaG91bGQgYmUgcGVybWl0dGVkXG5cdFx0aWYgKCFldmVudC5jYW5jZWxhYmxlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBEZXJpdmUgYW5kIGNoZWNrIHRoZSB0YXJnZXQgZWxlbWVudCB0byBzZWUgd2hldGhlciB0aGUgbW91c2UgZXZlbnQgbmVlZHMgdG8gYmUgcGVybWl0dGVkO1xuXHRcdC8vIHVubGVzcyBleHBsaWNpdGx5IGVuYWJsZWQsIHByZXZlbnQgbm9uLXRvdWNoIGNsaWNrIGV2ZW50cyBmcm9tIHRyaWdnZXJpbmcgYWN0aW9ucyxcblx0XHQvLyB0byBwcmV2ZW50IGdob3N0L2RvdWJsZWNsaWNrcy5cblx0XHRpZiAoIXRoaXMubmVlZHNDbGljayh0aGlzLnRhcmdldEVsZW1lbnQpIHx8IHRoaXMuY2FuY2VsTmV4dENsaWNrKSB7XG5cblx0XHRcdC8vIFByZXZlbnQgYW55IHVzZXItYWRkZWQgbGlzdGVuZXJzIGRlY2xhcmVkIG9uIEZhc3RDbGljayBlbGVtZW50IGZyb20gYmVpbmcgZmlyZWQuXG5cdFx0XHRpZiAoZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG5cdFx0XHRcdGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBQYXJ0IG9mIHRoZSBoYWNrIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgRXZlbnQjc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uIChlLmcuIEFuZHJvaWQgMilcblx0XHRcdFx0ZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2FuY2VsIHRoZSBldmVudFxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIG1vdXNlIGV2ZW50IGlzIHBlcm1pdHRlZCwgcmV0dXJuIHRydWUgZm9yIHRoZSBhY3Rpb24gdG8gZ28gdGhyb3VnaC5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiBPbiBhY3R1YWwgY2xpY2tzLCBkZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGEgdG91Y2gtZ2VuZXJhdGVkIGNsaWNrLCBhIGNsaWNrIGFjdGlvbiBvY2N1cnJpbmdcblx0ICogbmF0dXJhbGx5IGFmdGVyIGEgZGVsYXkgYWZ0ZXIgYSB0b3VjaCAod2hpY2ggbmVlZHMgdG8gYmUgY2FuY2VsbGVkIHRvIGF2b2lkIGR1cGxpY2F0aW9uKSwgb3Jcblx0ICogYW4gYWN0dWFsIGNsaWNrIHdoaWNoIHNob3VsZCBiZSBwZXJtaXR0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50XG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHR2YXIgcGVybWl0dGVkO1xuXG5cdFx0Ly8gSXQncyBwb3NzaWJsZSBmb3IgYW5vdGhlciBGYXN0Q2xpY2stbGlrZSBsaWJyYXJ5IGRlbGl2ZXJlZCB3aXRoIHRoaXJkLXBhcnR5IGNvZGUgdG8gZmlyZSBhIGNsaWNrIGV2ZW50IGJlZm9yZSBGYXN0Q2xpY2sgZG9lcyAoaXNzdWUgIzQ0KS4gSW4gdGhhdCBjYXNlLCBzZXQgdGhlIGNsaWNrLXRyYWNraW5nIGZsYWcgYmFjayB0byBmYWxzZSBhbmQgcmV0dXJuIGVhcmx5LiBUaGlzIHdpbGwgY2F1c2Ugb25Ub3VjaEVuZCB0byByZXR1cm4gZWFybHkuXG5cdFx0aWYgKHRoaXMudHJhY2tpbmdDbGljaykge1xuXHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gbnVsbDtcblx0XHRcdHRoaXMudHJhY2tpbmdDbGljayA9IGZhbHNlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gVmVyeSBvZGQgYmVoYXZpb3VyIG9uIGlPUyAoaXNzdWUgIzE4KTogaWYgYSBzdWJtaXQgZWxlbWVudCBpcyBwcmVzZW50IGluc2lkZSBhIGZvcm0gYW5kIHRoZSB1c2VyIGhpdHMgZW50ZXIgaW4gdGhlIGlPUyBzaW11bGF0b3Igb3IgY2xpY2tzIHRoZSBHbyBidXR0b24gb24gdGhlIHBvcC11cCBPUyBrZXlib2FyZCB0aGUgYSBraW5kIG9mICdmYWtlJyBjbGljayBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB3aXRoIHRoZSBzdWJtaXQtdHlwZSBpbnB1dCBlbGVtZW50IGFzIHRoZSB0YXJnZXQuXG5cdFx0aWYgKGV2ZW50LnRhcmdldC50eXBlID09PSAnc3VibWl0JyAmJiBldmVudC5kZXRhaWwgPT09IDApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHBlcm1pdHRlZCA9IHRoaXMub25Nb3VzZShldmVudCk7XG5cblx0XHQvLyBPbmx5IHVuc2V0IHRhcmdldEVsZW1lbnQgaWYgdGhlIGNsaWNrIGlzIG5vdCBwZXJtaXR0ZWQuIFRoaXMgd2lsbCBlbnN1cmUgdGhhdCB0aGUgY2hlY2sgZm9yICF0YXJnZXRFbGVtZW50IGluIG9uTW91c2UgZmFpbHMgYW5kIHRoZSBicm93c2VyJ3MgY2xpY2sgZG9lc24ndCBnbyB0aHJvdWdoLlxuXHRcdGlmICghcGVybWl0dGVkKSB7XG5cdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIElmIGNsaWNrcyBhcmUgcGVybWl0dGVkLCByZXR1cm4gdHJ1ZSBmb3IgdGhlIGFjdGlvbiB0byBnbyB0aHJvdWdoLlxuXHRcdHJldHVybiBwZXJtaXR0ZWQ7XG5cdH07XG5cblxuXHQvKipcblx0ICogUmVtb3ZlIGFsbCBGYXN0Q2xpY2sncyBldmVudCBsaXN0ZW5lcnMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmFzdENsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGxheWVyID0gdGhpcy5sYXllcjtcblxuXHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2UsIHRydWUpO1xuXHRcdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZSwgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0bGF5ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRydWUpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLm9uVG91Y2hTdGFydCwgZmFsc2UpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUsIGZhbHNlKTtcblx0XHRsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Ub3VjaEVuZCwgZmFsc2UpO1xuXHRcdGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vblRvdWNoQ2FuY2VsLCBmYWxzZSk7XG5cdH07XG5cblxuXHQvKipcblx0ICogQ2hlY2sgd2hldGhlciBGYXN0Q2xpY2sgaXMgbmVlZGVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cblx0ICovXG5cdEZhc3RDbGljay5ub3ROZWVkZWQgPSBmdW5jdGlvbihsYXllcikge1xuXHRcdHZhciBtZXRhVmlld3BvcnQ7XG5cdFx0dmFyIGNocm9tZVZlcnNpb247XG5cdFx0dmFyIGJsYWNrYmVycnlWZXJzaW9uO1xuXHRcdHZhciBmaXJlZm94VmVyc2lvbjtcblxuXHRcdC8vIERldmljZXMgdGhhdCBkb24ndCBzdXBwb3J0IHRvdWNoIGRvbid0IG5lZWQgRmFzdENsaWNrXG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cub250b3VjaHN0YXJ0ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hyb21lIHZlcnNpb24gLSB6ZXJvIGZvciBvdGhlciBicm93c2Vyc1xuXHRcdGNocm9tZVZlcnNpb24gPSArKC9DaHJvbWVcXC8oWzAtOV0rKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KSB8fCBbLDBdKVsxXTtcblxuXHRcdGlmIChjaHJvbWVWZXJzaW9uKSB7XG5cblx0XHRcdGlmIChkZXZpY2VJc0FuZHJvaWQpIHtcblx0XHRcdFx0bWV0YVZpZXdwb3J0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPXZpZXdwb3J0XScpO1xuXG5cdFx0XHRcdGlmIChtZXRhVmlld3BvcnQpIHtcblx0XHRcdFx0XHQvLyBDaHJvbWUgb24gQW5kcm9pZCB3aXRoIHVzZXItc2NhbGFibGU9XCJub1wiIGRvZXNuJ3QgbmVlZCBGYXN0Q2xpY2sgKGlzc3VlICM4OSlcblx0XHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0LmNvbnRlbnQuaW5kZXhPZigndXNlci1zY2FsYWJsZT1ubycpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIENocm9tZSAzMiBhbmQgYWJvdmUgd2l0aCB3aWR0aD1kZXZpY2Utd2lkdGggb3IgbGVzcyBkb24ndCBuZWVkIEZhc3RDbGlja1xuXHRcdFx0XHRcdGlmIChjaHJvbWVWZXJzaW9uID4gMzEgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoIDw9IHdpbmRvdy5vdXRlcldpZHRoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hyb21lIGRlc2t0b3AgZG9lc24ndCBuZWVkIEZhc3RDbGljayAoaXNzdWUgIzE1KVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGRldmljZUlzQmxhY2tCZXJyeTEwKSB7XG5cdFx0XHRibGFja2JlcnJ5VmVyc2lvbiA9IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC8oWzAtOV0qKVxcLihbMC05XSopLyk7XG5cblx0XHRcdC8vIEJsYWNrQmVycnkgMTAuMysgZG9lcyBub3QgcmVxdWlyZSBGYXN0Y2xpY2sgbGlicmFyeS5cblx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mdGxhYnMvZmFzdGNsaWNrL2lzc3Vlcy8yNTFcblx0XHRcdGlmIChibGFja2JlcnJ5VmVyc2lvblsxXSA+PSAxMCAmJiBibGFja2JlcnJ5VmVyc2lvblsyXSA+PSAzKSB7XG5cdFx0XHRcdG1ldGFWaWV3cG9ydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT12aWV3cG9ydF0nKTtcblxuXHRcdFx0XHRpZiAobWV0YVZpZXdwb3J0KSB7XG5cdFx0XHRcdFx0Ly8gdXNlci1zY2FsYWJsZT1ubyBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRcdGlmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gd2lkdGg9ZGV2aWNlLXdpZHRoIChvciBsZXNzIHRoYW4gZGV2aWNlLXdpZHRoKSBlbGltaW5hdGVzIGNsaWNrIGRlbGF5LlxuXHRcdFx0XHRcdGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGggPD0gd2luZG93Lm91dGVyV2lkdGgpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElFMTAgd2l0aCAtbXMtdG91Y2gtYWN0aW9uOiBub25lIG9yIG1hbmlwdWxhdGlvbiwgd2hpY2ggZGlzYWJsZXMgZG91YmxlLXRhcC10by16b29tIChpc3N1ZSAjOTcpXG5cdFx0aWYgKGxheWVyLnN0eWxlLm1zVG91Y2hBY3Rpb24gPT09ICdub25lJyB8fCBsYXllci5zdHlsZS50b3VjaEFjdGlvbiA9PT0gJ21hbmlwdWxhdGlvbicpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIEZpcmVmb3ggdmVyc2lvbiAtIHplcm8gZm9yIG90aGVyIGJyb3dzZXJzXG5cdFx0ZmlyZWZveFZlcnNpb24gPSArKC9GaXJlZm94XFwvKFswLTldKykvLmV4ZWMobmF2aWdhdG9yLnVzZXJBZ2VudCkgfHwgWywwXSlbMV07XG5cblx0XHRpZiAoZmlyZWZveFZlcnNpb24gPj0gMjcpIHtcblx0XHRcdC8vIEZpcmVmb3ggMjcrIGRvZXMgbm90IGhhdmUgdGFwIGRlbGF5IGlmIHRoZSBjb250ZW50IGlzIG5vdCB6b29tYWJsZSAtIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTkyMjg5NlxuXG5cdFx0XHRtZXRhVmlld3BvcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9dmlld3BvcnRdJyk7XG5cdFx0XHRpZiAobWV0YVZpZXdwb3J0ICYmIChtZXRhVmlld3BvcnQuY29udGVudC5pbmRleE9mKCd1c2VyLXNjYWxhYmxlPW5vJykgIT09IC0xIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCA8PSB3aW5kb3cub3V0ZXJXaWR0aCkpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSUUxMTogcHJlZml4ZWQgLW1zLXRvdWNoLWFjdGlvbiBpcyBubyBsb25nZXIgc3VwcG9ydGVkIGFuZCBpdCdzIHJlY29tZW5kZWQgdG8gdXNlIG5vbi1wcmVmaXhlZCB2ZXJzaW9uXG5cdFx0Ly8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L3dpbmRvd3MvYXBwcy9IaDc2NzMxMy5hc3B4XG5cdFx0aWYgKGxheWVyLnN0eWxlLnRvdWNoQWN0aW9uID09PSAnbm9uZScgfHwgbGF5ZXIuc3R5bGUudG91Y2hBY3Rpb24gPT09ICdtYW5pcHVsYXRpb24nKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblxuXHQvKipcblx0ICogRmFjdG9yeSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgRmFzdENsaWNrIG9iamVjdFxuXHQgKlxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IGxheWVyIFRoZSBsYXllciB0byBsaXN0ZW4gb25cblx0ICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHNcblx0ICovXG5cdEZhc3RDbGljay5hdHRhY2ggPSBmdW5jdGlvbihsYXllciwgb3B0aW9ucykge1xuXHRcdHJldHVybiBuZXcgRmFzdENsaWNrKGxheWVyLCBvcHRpb25zKTtcblx0fTtcblxuXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG5cblx0XHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdFx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEZhc3RDbGljaztcblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gRmFzdENsaWNrLmF0dGFjaDtcblx0XHRtb2R1bGUuZXhwb3J0cy5GYXN0Q2xpY2sgPSBGYXN0Q2xpY2s7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LkZhc3RDbGljayA9IEZhc3RDbGljaztcblx0fVxufSgpKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS9tYXJrL1NpdGVzL3NvbHZldGhlY3ViZS9ub2RlX21vZHVsZXMvZmFzdGNsaWNrL2xpYi9mYXN0Y2xpY2suanMiLCJjb25zdCBTSEFQRV9PUkRFUiA9IFtcblx0J2Nyb3NzJyxcblx0JzI3Jyxcblx0JzI2Jyxcblx0JzI1Jyxcblx0JzI0Jyxcblx0JzIyJyxcblx0JzIxJyxcblx0JzIzJyxcblx0J2RvdCcsXG5cdCcxJyxcblx0JzInLFxuXHQnNCcsXG5cdCczJyxcblx0JzE5Jyxcblx0JzE4Jyxcblx0JzE3Jyxcblx0JzIwJyxcblx0J2Nvcm5lcnMnLFxuXHQnNTcnLFxuXHQnMjgnLFxuXHQnbGluZScsXG5cdCc1NScsXG5cdCc1MicsXG5cdCc1MScsXG5cdCc1NicsXG5cdCd0Jyxcblx0JzQ1Jyxcblx0JzMzJyxcblx0J3onLFxuXHQnNDAnLFxuXHQnMzknLFxuXHQnTCcsXG5cdCcxNCcsXG5cdCcxMycsXG5cdCcxNicsXG5cdCcxNScsXG5cdCdjJyxcblx0JzQ2Jyxcblx0JzM0Jyxcblx0J3cnLFxuXHQnMzgnLFxuXHQnMzYnLFxuXHQncCcsXG5cdCc0NCcsXG5cdCc0MycsXG5cdCczMScsXG5cdCczMicsXG5cdCdzcXVhcmUnLFxuXHQnMzUnLFxuXHQnMzcnLFxuXHQnNScsXG5cdCc2Jyxcblx0J2wnLFxuXHQnNDgnLFxuXHQnNDcnLFxuXHQnNTAnLFxuXHQnNDknLFxuXHQnNTMnLFxuXHQnNTQnLFxuXHQnb3RoZXJzJyxcblx0JzExJyxcblx0JzEyJyxcblx0JzcnLFxuXHQnOCcsXG5cdCcxMCcsXG5cdCc5Jyxcblx0JzI5Jyxcblx0JzQyJyxcblx0JzQxJyxcblx0JzMwJ1xuXTtcblxuY29uc3QgVFJJR0dFUl9PUkRFUiA9IFtcblx0J3JlZCcsXG5cdCc0NScsXG5cdCc0OCcsXG5cdCc0NCcsXG5cdCc1MScsXG5cdCc0MycsXG5cdCc0NycsXG5cdCcxMScsXG5cdCcxMicsXG5cdCc0Jyxcblx0JzMnLFxuXHQnMicsXG5cdCcxNicsXG5cdCcxNScsXG5cdCc0MCcsXG5cdCczOScsXG5cdCc1NycsXG5cdCcyMCcsXG5cdCc1NicsXG5cdCczNCcsXG5cdCc5Jyxcblx0JzI5Jyxcblx0JzI1Jyxcblx0J2JsdWUnLFxuXHQnMjQnLFxuXHQnMzMnLFxuXHQnNDYnLFxuXHQnMScsXG5cdCczNScsXG5cdCcxOScsXG5cdCc0OScsXG5cdCczMCcsXG5cdCc0MicsXG5cdCdncmVlbicsXG5cdCczOCcsXG5cdCczNicsXG5cdCc1MicsXG5cdCc1MycsXG5cdCcxNycsXG5cdCc1Jyxcblx0JzE4Jyxcblx0JzU0Jyxcblx0JzcnLFxuXHQnMTAnLFxuXHQnNDEnLFxuXHQnb3RoZXJzJyxcblx0JzIyJyxcblx0JzIxJyxcblx0JzIzJyxcblx0JzI3Jyxcblx0JzI2Jyxcblx0JzMxJyxcblx0JzMyJyxcblx0JzM3Jyxcblx0JzUwJyxcblx0JzE0Jyxcblx0JzgnLFxuXHQnNTUnLFxuXHQnNicsXG5cdCcyOCcsXG5cdCcxMydcbl07XG5cbmNvbnN0IENPTlRST0xTX01BUkdJTiA9IDUwO1xuXG5mdW5jdGlvbiBzb3J0QnlBcnJheShvcmRlckFycmF5KSB7XG5cdHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG5cdFx0Y29uc3QgaW5kZXhBID0gb3JkZXJBcnJheS5pbmRleE9mKCcnICsgJChhKS5kYXRhKCdudW1iZXInKSk7XG5cdFx0Y29uc3QgaW5kZXhCID0gb3JkZXJBcnJheS5pbmRleE9mKCcnICsgJChiKS5kYXRhKCdudW1iZXInKSk7XG5cblx0XHRyZXR1cm4gKGluZGV4QSA8IGluZGV4QikgPyAtMSA6IChpbmRleEEgPiBpbmRleEIpID8gMSA6IDA7XG5cdH07XG59XG5cbi8vIE1ha2UgZWFjaCBhbGctdGFibGUtY29udHJvbHMgc3RpY2sgdG8gY29ycmVzcG9uZGluZyBhbGctdGFibGVcbmZ1bmN0aW9uIHBsYWNlQ29udHJvbHMoKSB7XG5cdCQoJy5hbGctdGFibGUtY29udHJvbHMnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzICA9ICQodGhpcyk7XG5cdFx0Y29uc3QgJGJveCAgID0gJHRoaXMuZmluZCgnZGl2Jyk7XG5cdFx0Y29uc3QgJHRhYmxlID0gJHRoaXMuc2libGluZ3MoJy5hbGctdGFibGUnKTtcblxuXHRcdC8vIFN0aWNrIHRvIGJvdHRvbSBvZiB0YWJsZVxuXHRcdGlmKHdpbmRvdy5zY3JvbGxZID4gJHRhYmxlLm9mZnNldCgpLnRvcCArICR0YWJsZS5vdXRlckhlaWdodCgpIC0gJGJveC5vdXRlckhlaWdodCgpIC0gQ09OVFJPTFNfTUFSR0lOKSB7XG5cdFx0XHQkdGhpcy5hZGRDbGFzcygnYm90dG9tJyk7XG5cdFx0XHQkYm94LnJlbW92ZUNsYXNzKCdmaXhlZCcpLmNzcygnbGVmdCcsICcnKTtcblx0XHR9XG5cdFx0Ly8gRml4ZWQgcG9zaXRpb24gd2hpbGUgdGFibGUgaXMgdmlzaWJsZVxuXHRcdGVsc2UgaWYod2luZG93LnNjcm9sbFkgPiAkdGFibGUub2Zmc2V0KCkudG9wIC0gQ09OVFJPTFNfTUFSR0lOKSB7XG5cdFx0XHQkdGhpcy5yZW1vdmVDbGFzcygnYm90dG9tJyk7XG5cdFx0XHQkYm94LmNzcygnbGVmdCcsICRib3gub2Zmc2V0KCkubGVmdCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG5cdFx0fVxuXHRcdC8vIERlZmF1bHQgcG9zaXRpb25cblx0XHRlbHNlIHtcblx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKCdib3R0b20nKTtcblx0XHRcdCRib3gucmVtb3ZlQ2xhc3MoJ2ZpeGVkJykuY3NzKCdsZWZ0JywgJycpO1xuXHRcdH1cblx0fSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0ICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdC8vIFBsYWNlIGFueSBhbGcgdGFibGUgY29udHJvbHMgb24gc2Nyb2xsIGFuZCByZXNpemUgZXZlbnRzXG5cdGlmKCQoJy5hbGctdGFibGUtY29udHJvbHMnKS5sZW5ndGggPiAwKSB7XG5cdFx0aWYoRm91bmRhdGlvbi5NZWRpYVF1ZXJ5LmF0TGVhc3QoJ21lZGl1bScpKSB7XG5cdFx0XHRwbGFjZUNvbnRyb2xzKCk7XG5cdFx0fVxuXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdGlmKEZvdW5kYXRpb24uTWVkaWFRdWVyeS5hdExlYXN0KCdtZWRpdW0nKSkge1xuXHRcdFx0XHRwbGFjZUNvbnRyb2xzKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdFx0JCgnLmFsZy10YWJsZS1jb250cm9scyBkaXYnKS5jc3MoJ2xlZnQnLCAnJykucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG5cdFx0XHRwbGFjZUNvbnRyb2xzKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBPTEwgdGFibGUgc29ydGluZ1xuXHRcdCQoJy5hbGctdGFibGUtY29udHJvbHMgc2VsZWN0Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc3QgJHRoaXMgID0gJCh0aGlzKTtcblx0XHRcdGNvbnN0ICR0YWJsZSA9ICR0aGlzLmNsb3Nlc3QoJy5hbGctdGFibGUtY29udHJvbHMnKS5zaWJsaW5ncygnLmFsZy10YWJsZScpO1xuXG5cdFx0XHRpZigkdGhpcy52YWwoKSA9PSAnc2hhcGUnKSB7XG5cdFx0XHRcdCQoJy50aXRsZS10cmlnZ2VyLCAuY29udGVudHMtdHJpZ2dlciwgLnRpdGxlLW51bWJlcicpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnRpdGxlLXNoYXBlLCAuY29udGVudHMtc2hhcGUnKS5zaG93KCk7XG5cblx0XHRcdFx0JHRhYmxlLmNoaWxkcmVuKCcudGl0bGUtc2hhcGUsIC5hbGcnKS5zb3J0KHNvcnRCeUFycmF5KFNIQVBFX09SREVSKSkuYXBwZW5kVG8oJHRhYmxlKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoJHRoaXMudmFsKCkgPT0gJ3RyaWdnZXInKSB7XG5cdFx0XHRcdCQoJy50aXRsZS10cmlnZ2VyLCAuY29udGVudHMtdHJpZ2dlcicpLnNob3coKTtcblx0XHRcdFx0JCgnLnRpdGxlLXNoYXBlLCAuY29udGVudHMtc2hhcGUsIC50aXRsZS1udW1iZXInKS5oaWRlKCk7XG5cblx0XHRcdFx0JHRhYmxlLmNoaWxkcmVuKCcudGl0bGUtdHJpZ2dlciwgLmFsZycpLnNvcnQoc29ydEJ5QXJyYXkoVFJJR0dFUl9PUkRFUikpLmFwcGVuZFRvKCR0YWJsZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCR0aGlzLnZhbCgpID09ICdudW1iZXInKSB7XG5cdFx0XHRcdCQoJy50aXRsZS10cmlnZ2VyLCAuY29udGVudHMtdHJpZ2dlcicpLmhpZGUoKTtcblx0XHRcdFx0JCgnLnRpdGxlLXNoYXBlLCAuY29udGVudHMtc2hhcGUnKS5oaWRlKCk7XG5cdFx0XHRcdCQoJy50aXRsZS1udW1iZXInKS5zaG93KCk7XG5cblx0XHRcdFx0JHRhYmxlLmNoaWxkcmVuKCcudGl0bGUtdHJpZ2dlciwgLmFsZycpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRcdHJldHVybiAkKGEpLmRhdGEoJ251bWJlcicpIC0gJChiKS5kYXRhKCdudW1iZXInKTtcblx0XHRcdFx0fSkuYXBwZW5kVG8oJHRhYmxlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21vZHVsZXMvYWxndGFibGVzLmpzIiwiaW1wb3J0IEhhbW1lciBmcm9tICdoYW1tZXJqcyc7XG5cbmNvbnN0IE1FTlVfV0lEVEggPSAyMDA7XG5cbi8vIEhlbHBlciBmdW5jdGlvbnMgZm9yIG1vYmlsZSBtZW51XG5mdW5jdGlvbiBtZW51T3BlbigpIHtcblx0JCgnI21lbnUsIC5tZW51LWJ1dHRvbicpLmFkZENsYXNzKCdhY3RpdmUnKS5jc3MoJ3RyYW5zZm9ybScsICcnKTtcblx0JCgnI25hdmJhcicpLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0JCgnI21lbnUtY2xvc2UnKS5zaG93KCk7XG5cdG1lbnVDbG9zZUhhbW1lci5zZXQoe2VuYWJsZTogdHJ1ZX0pO1xufVxuXG5mdW5jdGlvbiBtZW51Q2xvc2UoKSB7XG5cdCQoJyNtZW51LCAubWVudS1idXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlIGZpeGVkJykuY3NzKCd0cmFuc2Zvcm0nLCAnJyk7XG5cdCQoJyNuYXZiYXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdCQoJyNtZW51LWNsb3NlJykuaGlkZSgpO1xuXHRtZW51Q2xvc2VIYW1tZXIuc2V0KHtlbmFibGU6IGZhbHNlfSk7XG59XG5cbi8vIE1vYmlsZSBtZW51IGJ1dHRvbiBjbGlja1xuJCgnLm1lbnUtYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdGlmKCQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0bWVudUNsb3NlKCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bWVudU9wZW4oKTtcblx0XHQkKCcjaGVhZGVyLW1lbnUtYnV0dG9uJykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG5cdH1cbn0pO1xuXG4vLyBDbG9zZSBtZW51IHdoZW4gdXNlciBjbGlja3Mgb2ZmIG1lbnVcbiQoJyNtZW51LWNsb3NlJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdG1lbnVDbG9zZSgpO1xufSk7XG5cbi8vIFNob3cgbW9iaWxlIG1lbnUgYnV0dG9uIHdoZW4gc2Nyb2xsZWQgYXdheSBmcm9tIGhlYWRlciBtb2JpbGUgbWVudSBidXR0b25cbiQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG5cdGlmKCQodGhpcykuc2Nyb2xsVG9wKCkgPj0gNDApIHtcblx0XHQkKCcjbWVudS1idXR0b24nKS5jc3MoJ29wYWNpdHknLCAxKTtcblx0fVxuXHRlbHNlIHtcblx0XHQkKCcjbWVudS1idXR0b24nKS5jc3MoJ29wYWNpdHknLCAnJyk7XG5cdH1cbn0pO1xuXG4vKlxuXHRHZXN0dXJlc1xuKi9cblxuY29uc3QgJG1lbnUgICAgICAgID0gJCgnI21lbnUnKTtcbmNvbnN0ICRtZW51QnV0dG9uICA9ICQoJy5tZW51LWJ1dHRvbicpO1xuY29uc3QgJG9wZW5CdXR0b24gID0gJCgnLm1lbnUtYnV0dG9uIC5vcGVuJyk7XG5jb25zdCAkY2xvc2VCdXR0b24gPSAkKCcubWVudS1idXR0b24gLmNsb3NlJyk7XG5sZXQgdHJhbnNsYXRpb247XG5cbmNvbnN0IG1lbnVPcGVuSGFtbWVyICA9IG5ldyBIYW1tZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtb3BlbicpKTtcbmNvbnN0IG1lbnVDbG9zZUhhbW1lciA9IG5ldyBIYW1tZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lbnUtY2xvc2UnKSwgeyBlbmFibGU6IGZhbHNlIH0pO1xuXG4vLyBPcGVuIG1lbnUgd2hlbiBzd2lwaW5nIGZyb20gbGVmdCBvZiBzY3JlZW5cbm1lbnVPcGVuSGFtbWVyLm9uKCdzd2lwZXJpZ2h0JywgZnVuY3Rpb24oZSkge1xuXHRtZW51T3BlbigpO1xufSk7XG5cbi8vIE9uIGdlc3R1cmUgc3RhcnQsIHJlbW92ZSBhbmltYXRlZCBjbGFzc2VzIHRvIGRpc2FibGUgdHJhbnNpdGlvbiBkZWxheXNcbm1lbnVPcGVuSGFtbWVyLm9uKCdwYW5zdGFydCcsIGZ1bmN0aW9uKGUpIHtcblx0JG1lbnUuYWRkQ2xhc3MoJ3Bhbm5pbmcnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZWQnKTtcblx0JG1lbnVCdXR0b24ucmVtb3ZlQ2xhc3MoJ2FuaW1hdGVkJyk7XG5cblx0Ly8gQWxzbyByZWNvcmQgbWVudSB0cmFuc2xhdGlvblxuXHR0cmFuc2xhdGlvbiA9IHBhcnNlSW50KCRtZW51LmNzcygndHJhbnNmb3JtJykuc3BsaXQoJywgJylbNF0sIDEwKSB8fCAwO1xufSk7XG5cbi8vIER1cmluZyBnZXN0dXJlLCB0cmFuc2xhdGUgbWVudSBhbmQgYnV0dG9uc1xubWVudU9wZW5IYW1tZXIub24oJ3BhbicsIGZ1bmN0aW9uKGUpIHtcblx0bGV0IGRlbHRhID0gZS5kZWx0YVg7XG5cblx0Ly8gTGltaXQgc3dpcGUgZGlzdGFuY2UgdG8gd2lkdGggb2YgbWVudVxuXHRpZihkZWx0YSA+IE1FTlVfV0lEVEgpIHtcblx0XHRkZWx0YSA9IE1FTlVfV0lEVEg7XG5cdH1cblx0ZWxzZSBpZihkZWx0YSA8IC1NRU5VX1dJRFRIKSB7XG5cdFx0ZGVsdGEgPSAtTUVOVV9XSURUSDtcblx0fVxuXG5cdGlmKCRtZW51Lmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuXHRcdGlmKGRlbHRhID4gMCkge1xuXHRcdFx0ZGVsdGEgPSAwO1xuXHRcdH1cblx0fVxuXHRlbHNlIHtcblx0XHRpZihkZWx0YSA8IDApIHtcblx0XHRcdGRlbHRhID0gMDtcblx0XHR9XG5cdH1cblxuXHQvLyBDYWxjdWxhdGUgY29ycmVjdCB2YWx1ZXMgZm9yIG1lbnUgYnV0dG9uIHJvdGF0aW9uIGFuZCBvcGFjaXR5IGluIGJvdGggZGlyZWN0aW9uc1xuXHRsZXQgcm90YXRpb24gPSBNYXRoLmFicyhkZWx0YSkgKiAwLjk7XG5cdGxldCBvcGFjaXR5ICA9IE1hdGguYWJzKGRlbHRhKSAvIE1FTlVfV0lEVEg7XG5cblx0aWYoJG1lbnUuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG5cdFx0cm90YXRpb24gPSAxODAgLSByb3RhdGlvbjtcblx0XHRvcGFjaXR5ICA9IDEgLSBvcGFjaXR5O1xuXHR9XG5cblx0Ly8gVHJhbnNsYXRlIHRoZSBtZW51IGFuZCBtZW51IGJ1dHRvbiByb3RhdGVzIGFuZCBmYWRlcyBpblxuXHQkbWVudS5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKCcgKyAodHJhbnNsYXRpb24gKyBkZWx0YSkgKyAncHgpJyk7XG5cblx0JG9wZW5CdXR0b24uY3NzKHtcblx0XHQndHJhbnNmb3JtJzogJ3JvdGF0ZSgnICsgcm90YXRpb24gKyAnZGVnKScsXG5cdFx0J29wYWNpdHknOiAxIC0gb3BhY2l0eVxuXHR9KTtcblx0JGNsb3NlQnV0dG9uLmNzcyh7XG5cdFx0J3RyYW5zZm9ybSc6ICdyb3RhdGUoJyArIHJvdGF0aW9uICsgJ2RlZyknLFxuXHRcdCdvcGFjaXR5Jzogb3BhY2l0eVxuXHR9KTtcbn0pO1xuXG4vLyBXaGVuIGdlc3R1cmUgZW5kcywgcmVzdG9yZSBhbmltYXRpb25zIGFuZCBvcGVuL2Nsb3NlIHRoZSBtZW51IGRlcGVuZGluZyBvbiBtZW51IHBvc2l0aW9uXG5tZW51T3BlbkhhbW1lci5vbigncGFuZW5kJywgZnVuY3Rpb24oZSkge1xuXHQkbWVudS5yZW1vdmVDbGFzcygncGFubmluZycpLmFkZENsYXNzKCdhbmltYXRlZCcpO1xuXHQkbWVudUJ1dHRvbi5hZGRDbGFzcygnYW5pbWF0ZWQnKTtcblxuXHQvLyBDb21wbGV0ZSBtZW51IG9wZW4gaWYgdGhlIGdlc3R1cmUgd2FzIG92ZXIgaGFsZiB0aGUgbWVudSB3aWR0aFxuXHRpZihlLmRlbHRhWCA+PSBNRU5VX1dJRFRIIC8gMikge1xuXHRcdG1lbnVPcGVuKCk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcjaGVhZGVyLW1lbnUtYnV0dG9uJykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG5cdFx0fSwgMzAwKTtcblx0fVxuXHRlbHNlIHtcblx0XHRtZW51Q2xvc2UoKTtcblx0fVxuXG5cdCQoJy5tZW51LWJ1dHRvbiA+IGRpdicpLmNzcyh7XG5cdFx0J3RyYW5zZm9ybSc6ICcnLFxuXHRcdCdvcGFjaXR5JzogJydcblx0fSk7XG59KTtcblxuLy8gQ2xvc2UgbWVudSBvbiBzd2lwZSBsZWZ0IGFueXdoZXJlXG5tZW51Q2xvc2VIYW1tZXIub24oJ3N3aXBlbGVmdCcsIGZ1bmN0aW9uKGUpIHtcblx0bWVudUNsb3NlKCk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21vZHVsZXMvbWVudS5qcyIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjcgLSAyMDE2LTA0LTIyXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVORE9SX1BSRUZJWEVTID0gWycnLCAnd2Via2l0JywgJ01veicsICdNUycsICdtcycsICdvJ107XG52YXIgVEVTVF9FTEVNRU5UID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbnZhciBUWVBFX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJztcblxudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbnZhciBhYnMgPSBNYXRoLmFicztcbnZhciBub3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBzZXQgYSB0aW1lb3V0IHdpdGggYSBnaXZlbiBzY29wZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gc2V0VGltZW91dENvbnRleHQoZm4sIHRpbWVvdXQsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChiaW5kRm4oZm4sIGNvbnRleHQpLCB0aW1lb3V0KTtcbn1cblxuLyoqXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxuICogaWYgaXQgYWludCBhbiBhcnJheSB3ZSBkb24ndCB3YW50IHRvIGRvIGEgdGhpbmcuXG4gKiB0aGlzIGlzIHVzZWQgYnkgYWxsIHRoZSBtZXRob2RzIHRoYXQgYWNjZXB0IGEgc2luZ2xlIGFuZCBhcnJheSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpbnZva2VBcnJheUFyZyhhcmcsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBlYWNoKGFyZywgY29udGV4dFtmbl0sIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHdhbGsgb2JqZWN0cyBhbmQgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiB3cmFwIGEgbWV0aG9kIHdpdGggYSBkZXByZWNhdGlvbiB3YXJuaW5nIGFuZCBzdGFjayB0cmFjZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIHN1cHBsaWVkIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gZGVwcmVjYXRlKG1ldGhvZCwgbmFtZSwgbWVzc2FnZSkge1xuICAgIHZhciBkZXByZWNhdGlvbk1lc3NhZ2UgPSAnREVQUkVDQVRFRCBNRVRIT0Q6ICcgKyBuYW1lICsgJ1xcbicgKyBtZXNzYWdlICsgJyBBVCBcXG4nO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ2dldC1zdGFjay10cmFjZScpO1xuICAgICAgICB2YXIgc3RhY2sgPSBlICYmIGUuc3RhY2sgPyBlLnN0YWNrLnJlcGxhY2UoL15bXlxcKF0rP1tcXG4kXS9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxccythdFxccysvZ20sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLCAne2Fub255bW91c30oKUAnKSA6ICdVbmtub3duIFN0YWNrIFRyYWNlJztcblxuICAgICAgICB2YXIgbG9nID0gd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLndhcm4gfHwgd2luZG93LmNvbnNvbGUubG9nKTtcbiAgICAgICAgaWYgKGxvZykge1xuICAgICAgICAgICAgbG9nLmNhbGwod2luZG93LmNvbnNvbGUsIGRlcHJlY2F0aW9uTWVzc2FnZSwgc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzX3RvX2Fzc2lnblxuICogQHJldHVybnMge09iamVjdH0gdGFyZ2V0XG4gKi9cbnZhciBhc3NpZ247XG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgICBhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbn1cblxuLyoqXG4gKiBleHRlbmQgb2JqZWN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIGluIGRlc3Qgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGUgb25lcyBpbiBzcmMuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHBhcmFtIHtCb29sZWFufSBbbWVyZ2U9ZmFsc2VdXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBleHRlbmQgPSBkZXByZWNhdGUoZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFtZXJnZSB8fCAobWVyZ2UgJiYgZGVzdFtrZXlzW2ldXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgZGVzdFtrZXlzW2ldXSA9IHNyY1trZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBkZXN0O1xufSwgJ2V4dGVuZCcsICdVc2UgYGFzc2lnbmAuJyk7XG5cbi8qKlxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyB0aGF0IGV4aXN0IGluIGRlc3Qgd2lsbCBub3QgYmUgb3ZlcndyaXR0ZW4gYnkgc3JjXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHJldHVybnMge09iamVjdH0gZGVzdFxuICovXG52YXIgbWVyZ2UgPSBkZXByZWNhdGUoZnVuY3Rpb24gbWVyZ2UoZGVzdCwgc3JjKSB7XG4gICAgcmV0dXJuIGV4dGVuZChkZXN0LCBzcmMsIHRydWUpO1xufSwgJ21lcmdlJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBzaW1wbGUgY2xhc3MgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgYmFzZVAgPSBiYXNlLnByb3RvdHlwZSxcbiAgICAgICAgY2hpbGRQO1xuXG4gICAgY2hpbGRQID0gY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlUCk7XG4gICAgY2hpbGRQLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG4gICAgY2hpbGRQLl9zdXBlciA9IGJhc2VQO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgYXNzaWduKGNoaWxkUCwgcHJvcGVydGllcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIHNpbXBsZSBmdW5jdGlvbiBiaW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gYmluZEZuKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kRm4oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogbGV0IGEgYm9vbGVhbiB2YWx1ZSBhbHNvIGJlIGEgZnVuY3Rpb24gdGhhdCBtdXN0IHJldHVybiBhIGJvb2xlYW5cbiAqIHRoaXMgZmlyc3QgaXRlbSBpbiBhcmdzIHdpbGwgYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSB2YWxcbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGJvb2xPckZuKHZhbCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgdmFsID09IFRZUEVfRlVOQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIHZhbC5hcHBseShhcmdzID8gYXJnc1swXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG4vKipcbiAqIHVzZSB0aGUgdmFsMiB3aGVuIHZhbDEgaXMgdW5kZWZpbmVkXG4gKiBAcGFyYW0geyp9IHZhbDFcbiAqIEBwYXJhbSB7Kn0gdmFsMlxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGlmVW5kZWZpbmVkKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKHZhbDEgPT09IHVuZGVmaW5lZCkgPyB2YWwyIDogdmFsMTtcbn1cblxuLyoqXG4gKiBhZGRFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogcmVtb3ZlRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyh0YXJnZXQsIHR5cGVzLCBoYW5kbGVyKSB7XG4gICAgZWFjaChzcGxpdFN0cih0eXBlcyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcbiAqIEBtZXRob2QgaGFzUGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGhhc1BhcmVudChub2RlLCBwYXJlbnQpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzbWFsbCBpbmRleE9mIHdyYXBwZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaW5TdHIoc3RyLCBmaW5kKSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKGZpbmQpID4gLTE7XG59XG5cbi8qKlxuICogc3BsaXQgc3RyaW5nIG9uIHdoaXRlc3BhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtBcnJheX0gd29yZHNcbiAqL1xuZnVuY3Rpb24gc3BsaXRTdHIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoL1xccysvZyk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIGFycmF5IGNvbnRhaW5zIHRoZSBvYmplY3QgdXNpbmcgaW5kZXhPZiBvciBhIHNpbXBsZSBwb2x5RmlsbFxuICogQHBhcmFtIHtBcnJheX0gc3JjXG4gKiBAcGFyYW0ge1N0cmluZ30gZmluZFxuICogQHBhcmFtIHtTdHJpbmd9IFtmaW5kQnlLZXldXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxuICovXG5mdW5jdGlvbiBpbkFycmF5KHNyYywgZmluZCwgZmluZEJ5S2V5KSB7XG4gICAgaWYgKHNyYy5pbmRleE9mICYmICFmaW5kQnlLZXkpIHtcbiAgICAgICAgcmV0dXJuIHNyYy5pbmRleE9mKGZpbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoKGZpbmRCeUtleSAmJiBzcmNbaV1bZmluZEJ5S2V5XSA9PSBmaW5kKSB8fCAoIWZpbmRCeUtleSAmJiBzcmNbaV0gPT09IGZpbmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChvYmosIDApO1xufVxuXG4vKipcbiAqIHVuaXF1ZSBhcnJheSB3aXRoIG9iamVjdHMgYmFzZWQgb24gYSBrZXkgKGxpa2UgJ2lkJykgb3IganVzdCBieSB0aGUgYXJyYXkncyB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gc3JjIFt7aWQ6MX0se2lkOjJ9LHtpZDoxfV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICogQHBhcmFtIHtCb29sZWFufSBbc29ydD1GYWxzZV1cbiAqIEByZXR1cm5zIHtBcnJheX0gW3tpZDoxfSx7aWQ6Mn1dXG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUFycmF5KHNyYywga2V5LCBzb3J0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWwgPSBrZXkgPyBzcmNbaV1ba2V5XSA6IHNyY1tpXTtcbiAgICAgICAgaWYgKGluQXJyYXkodmFsdWVzLCB2YWwpIDwgMCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2ldID0gdmFsO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gc29ydFVuaXF1ZUFycmF5KGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtrZXldID4gYltrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHByZWZpeGVkIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcbiAqIEByZXR1cm5zIHtTdHJpbmd8VW5kZWZpbmVkfSBwcmVmaXhlZFxuICovXG5mdW5jdGlvbiBwcmVmaXhlZChvYmosIHByb3BlcnR5KSB7XG4gICAgdmFyIHByZWZpeCwgcHJvcDtcbiAgICB2YXIgY2FtZWxQcm9wID0gcHJvcGVydHlbMF0udG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgVkVORE9SX1BSRUZJWEVTLmxlbmd0aCkge1xuICAgICAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XG4gICAgICAgIHByb3AgPSAocHJlZml4KSA/IHByZWZpeCArIGNhbWVsUHJvcCA6IHByb3BlcnR5O1xuXG4gICAgICAgIGlmIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIGdldCBhIHVuaXF1ZSBpZFxuICogQHJldHVybnMge251bWJlcn0gdW5pcXVlSWRcbiAqL1xudmFyIF91bmlxdWVJZCA9IDE7XG5mdW5jdGlvbiB1bmlxdWVJZCgpIHtcbiAgICByZXR1cm4gX3VuaXF1ZUlkKys7XG59XG5cbi8qKlxuICogZ2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtEb2N1bWVudFZpZXd8V2luZG93fVxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3dGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB2YXIgZG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQ7XG4gICAgcmV0dXJuIChkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cpO1xufVxuXG52YXIgTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pO1xuXG52YXIgU1VQUE9SVF9UT1VDSCA9ICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpO1xudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xudmFyIFNVUFBPUlRfT05MWV9UT1VDSCA9IFNVUFBPUlRfVE9VQ0ggJiYgTU9CSUxFX1JFR0VYLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcbnZhciBJTlBVVF9UWVBFX1BFTiA9ICdwZW4nO1xudmFyIElOUFVUX1RZUEVfTU9VU0UgPSAnbW91c2UnO1xudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XG5cbnZhciBDT01QVVRFX0lOVEVSVkFMID0gMjU7XG5cbnZhciBJTlBVVF9TVEFSVCA9IDE7XG52YXIgSU5QVVRfTU9WRSA9IDI7XG52YXIgSU5QVVRfRU5EID0gNDtcbnZhciBJTlBVVF9DQU5DRUwgPSA4O1xuXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xudmFyIERJUkVDVElPTl9MRUZUID0gMjtcbnZhciBESVJFQ1RJT05fUklHSFQgPSA0O1xudmFyIERJUkVDVElPTl9VUCA9IDg7XG52YXIgRElSRUNUSU9OX0RPV04gPSAxNjtcblxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XG52YXIgRElSRUNUSU9OX1ZFUlRJQ0FMID0gRElSRUNUSU9OX1VQIHwgRElSRUNUSU9OX0RPV047XG52YXIgRElSRUNUSU9OX0FMTCA9IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMO1xuXG52YXIgUFJPUFNfWFkgPSBbJ3gnLCAneSddO1xudmFyIFBST1BTX0NMSUVOVF9YWSA9IFsnY2xpZW50WCcsICdjbGllbnRZJ107XG5cbi8qKlxuICogY3JlYXRlIG5ldyBpbnB1dCB0eXBlIG1hbmFnZXJcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtJbnB1dH1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dChtYW5hZ2VyLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmVsZW1lbnQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXQgPSBtYW5hZ2VyLm9wdGlvbnMuaW5wdXRUYXJnZXQ7XG5cbiAgICAvLyBzbWFsbGVyIHdyYXBwZXIgYXJvdW5kIHRoZSBoYW5kbGVyLCBmb3IgdGhlIHNjb3BlIGFuZCB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgbWFuYWdlcixcbiAgICAvLyBzbyB3aGVuIGRpc2FibGVkIHRoZSBpbnB1dCBldmVudHMgYXJlIGNvbXBsZXRlbHkgYnlwYXNzZWQuXG4gICAgdGhpcy5kb21IYW5kbGVyID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgaWYgKGJvb2xPckZuKG1hbmFnZXIub3B0aW9ucy5lbmFibGUsIFttYW5hZ2VyXSkpIHtcbiAgICAgICAgICAgIHNlbGYuaGFuZGxlcihldik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuSW5wdXQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNob3VsZCBoYW5kbGUgdGhlIGlucHV0RXZlbnQgZGF0YSBhbmQgdHJpZ2dlciB0aGUgY2FsbGJhY2tcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiBhZGRFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVuYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiByZW1vdmVFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogY2FsbGVkIGJ5IHRoZSBNYW5hZ2VyIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hhbW1lcn0gbWFuYWdlclxuICogQHJldHVybnMge0lucHV0fVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEluc3RhbmNlKG1hbmFnZXIpIHtcbiAgICB2YXIgVHlwZTtcbiAgICB2YXIgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuXG4gICAgaWYgKGlucHV0Q2xhc3MpIHtcbiAgICAgICAgVHlwZSA9IGlucHV0Q2xhc3M7XG4gICAgfSBlbHNlIGlmIChTVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG4gICAgICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfT05MWV9UT1VDSCkge1xuICAgICAgICBUeXBlID0gVG91Y2hJbnB1dDtcbiAgICB9IGVsc2UgaWYgKCFTVVBQT1JUX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBNb3VzZUlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgKFR5cGUpKG1hbmFnZXIsIGlucHV0SGFuZGxlcik7XG59XG5cbi8qKlxuICogaGFuZGxlIGlucHV0IGV2ZW50c1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gaW5wdXRIYW5kbGVyKG1hbmFnZXIsIGV2ZW50VHlwZSwgaW5wdXQpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGNoYW5nZWRQb2ludGVyc0xlbiA9IGlucHV0LmNoYW5nZWRQb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGlzRmlyc3QgPSAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG4gICAgdmFyIGlzRmluYWwgPSAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG5cbiAgICBpbnB1dC5pc0ZpcnN0ID0gISFpc0ZpcnN0O1xuICAgIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XG5cbiAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgZXZlbnQgaXMgdGhlIG5vcm1hbGl6ZWQgdmFsdWUgb2YgdGhlIGRvbUV2ZW50c1xuICAgIC8vIGxpa2UgJ3RvdWNoc3RhcnQsIG1vdXNldXAsIHBvaW50ZXJkb3duJ1xuICAgIGlucHV0LmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8vIGNvbXB1dGUgc2NhbGUsIHJvdGF0aW9uIGV0Y1xuICAgIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpO1xuXG4gICAgLy8gZW1pdCBzZWNyZXQgZXZlbnRcbiAgICBtYW5hZ2VyLmVtaXQoJ2hhbW1lci5pbnB1dCcsIGlucHV0KTtcblxuICAgIG1hbmFnZXIucmVjb2duaXplKGlucHV0KTtcbiAgICBtYW5hZ2VyLnNlc3Npb24ucHJldklucHV0ID0gaW5wdXQ7XG59XG5cbi8qKlxuICogZXh0ZW5kIHRoZSBkYXRhIHdpdGggc29tZSB1c2FibGUgcHJvcGVydGllcyBsaWtlIHNjYWxlLCByb3RhdGUsIHZlbG9jaXR5IGV0Y1xuICogQHBhcmFtIHtPYmplY3R9IG1hbmFnZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW5wdXREYXRhKG1hbmFnZXIsIGlucHV0KSB7XG4gICAgdmFyIHNlc3Npb24gPSBtYW5hZ2VyLnNlc3Npb247XG4gICAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gc3RvcmUgdGhlIGZpcnN0IGlucHV0IHRvIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYW5kIGRpcmVjdGlvblxuICAgIGlmICghc2Vzc2lvbi5maXJzdElucHV0KSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RJbnB1dCA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9XG5cbiAgICAvLyB0byBjb21wdXRlIHNjYWxlIGFuZCByb3RhdGlvbiB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBtdWx0aXBsZSB0b3VjaGVzXG4gICAgaWYgKHBvaW50ZXJzTGVuZ3RoID4gMSAmJiAhc2Vzc2lvbi5maXJzdE11bHRpcGxlKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJzTGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBmaXJzdElucHV0ID0gc2Vzc2lvbi5maXJzdElucHV0O1xuICAgIHZhciBmaXJzdE11bHRpcGxlID0gc2Vzc2lvbi5maXJzdE11bHRpcGxlO1xuICAgIHZhciBvZmZzZXRDZW50ZXIgPSBmaXJzdE11bHRpcGxlID8gZmlyc3RNdWx0aXBsZS5jZW50ZXIgOiBmaXJzdElucHV0LmNlbnRlcjtcblxuICAgIHZhciBjZW50ZXIgPSBpbnB1dC5jZW50ZXIgPSBnZXRDZW50ZXIocG9pbnRlcnMpO1xuICAgIGlucHV0LnRpbWVTdGFtcCA9IG5vdygpO1xuICAgIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xuXG4gICAgaW5wdXQuYW5nbGUgPSBnZXRBbmdsZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG4gICAgaW5wdXQuZGlzdGFuY2UgPSBnZXREaXN0YW5jZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG5cbiAgICBjb21wdXRlRGVsdGFYWShzZXNzaW9uLCBpbnB1dCk7XG4gICAgaW5wdXQub2Zmc2V0RGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcblxuICAgIHZhciBvdmVyYWxsVmVsb2NpdHkgPSBnZXRWZWxvY2l0eShpbnB1dC5kZWx0YVRpbWUsIGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYID0gb3ZlcmFsbFZlbG9jaXR5Lng7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5WSA9IG92ZXJhbGxWZWxvY2l0eS55O1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eSA9IChhYnMob3ZlcmFsbFZlbG9jaXR5LngpID4gYWJzKG92ZXJhbGxWZWxvY2l0eS55KSkgPyBvdmVyYWxsVmVsb2NpdHkueCA6IG92ZXJhbGxWZWxvY2l0eS55O1xuXG4gICAgaW5wdXQuc2NhbGUgPSBmaXJzdE11bHRpcGxlID8gZ2V0U2NhbGUoZmlyc3RNdWx0aXBsZS5wb2ludGVycywgcG9pbnRlcnMpIDogMTtcbiAgICBpbnB1dC5yb3RhdGlvbiA9IGZpcnN0TXVsdGlwbGUgPyBnZXRSb3RhdGlvbihmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAwO1xuXG4gICAgaW5wdXQubWF4UG9pbnRlcnMgPSAhc2Vzc2lvbi5wcmV2SW5wdXQgPyBpbnB1dC5wb2ludGVycy5sZW5ndGggOiAoKGlucHV0LnBvaW50ZXJzLmxlbmd0aCA+XG4gICAgICAgIHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKSA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6IHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKTtcblxuICAgIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCk7XG5cbiAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IHRhcmdldFxuICAgIHZhciB0YXJnZXQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gaW5wdXQuc3JjRXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpbnB1dC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlcjtcbiAgICB2YXIgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XG4gICAgdmFyIHByZXZJbnB1dCA9IHNlc3Npb24ucHJldklucHV0IHx8IHt9O1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfU1RBUlQgfHwgcHJldklucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfRU5EKSB7XG4gICAgICAgIHByZXZEZWx0YSA9IHNlc3Npb24ucHJldkRlbHRhID0ge1xuICAgICAgICAgICAgeDogcHJldklucHV0LmRlbHRhWCB8fCAwLFxuICAgICAgICAgICAgeTogcHJldklucHV0LmRlbHRhWSB8fCAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IGNlbnRlci54LFxuICAgICAgICAgICAgeTogY2VudGVyLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcbiAgICBpbnB1dC5kZWx0YVkgPSBwcmV2RGVsdGEueSArIChjZW50ZXIueSAtIG9mZnNldC55KTtcbn1cblxuLyoqXG4gKiB2ZWxvY2l0eSBpcyBjYWxjdWxhdGVkIGV2ZXJ5IHggbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGxhc3QgPSBzZXNzaW9uLmxhc3RJbnRlcnZhbCB8fCBpbnB1dCxcbiAgICAgICAgZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gbGFzdC50aW1lU3RhbXAsXG4gICAgICAgIHZlbG9jaXR5LCB2ZWxvY2l0eVgsIHZlbG9jaXR5WSwgZGlyZWN0aW9uO1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9DQU5DRUwgJiYgKGRlbHRhVGltZSA+IENPTVBVVEVfSU5URVJWQUwgfHwgbGFzdC52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICB2YXIgZGVsdGFYID0gaW5wdXQuZGVsdGFYIC0gbGFzdC5kZWx0YVg7XG4gICAgICAgIHZhciBkZWx0YVkgPSBpbnB1dC5kZWx0YVkgLSBsYXN0LmRlbHRhWTtcblxuICAgICAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xuICAgICAgICB2ZWxvY2l0eVggPSB2Lng7XG4gICAgICAgIHZlbG9jaXR5WSA9IHYueTtcbiAgICAgICAgdmVsb2NpdHkgPSAoYWJzKHYueCkgPiBhYnModi55KSkgPyB2LnggOiB2Lnk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICAgICAgc2Vzc2lvbi5sYXN0SW50ZXJ2YWwgPSBpbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2UgbGF0ZXN0IHZlbG9jaXR5IGluZm8gaWYgaXQgZG9lc24ndCBvdmVydGFrZSBhIG1pbmltdW0gcGVyaW9kXG4gICAgICAgIHZlbG9jaXR5ID0gbGFzdC52ZWxvY2l0eTtcbiAgICAgICAgdmVsb2NpdHlYID0gbGFzdC52ZWxvY2l0eVg7XG4gICAgICAgIHZlbG9jaXR5WSA9IGxhc3QudmVsb2NpdHlZO1xuICAgICAgICBkaXJlY3Rpb24gPSBsYXN0LmRpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIGlucHV0LnZlbG9jaXR5WCA9IHZlbG9jaXR5WDtcbiAgICBpbnB1dC52ZWxvY2l0eVkgPSB2ZWxvY2l0eVk7XG4gICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBhIHNpbXBsZSBjbG9uZSBmcm9tIHRoZSBpbnB1dCB1c2VkIGZvciBzdG9yYWdlIG9mIGZpcnN0SW5wdXQgYW5kIGZpcnN0TXVsdGlwbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICogQHJldHVybnMge09iamVjdH0gY2xvbmVkSW5wdXREYXRhXG4gKi9cbmZ1bmN0aW9uIHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KSB7XG4gICAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XG4gICAgLy8gd2Ugb25seSBuZWVkIGNsaWVudFhZIGZvciB0aGUgY2FsY3VsYXRpb25zXG4gICAgdmFyIHBvaW50ZXJzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgaW5wdXQucG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHBvaW50ZXJzW2ldID0ge1xuICAgICAgICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXG4gICAgICAgICAgICBjbGllbnRZOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGltZVN0YW1wOiBub3coKSxcbiAgICAgICAgcG9pbnRlcnM6IHBvaW50ZXJzLFxuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXG4gICAgICAgIGRlbHRhWDogaW5wdXQuZGVsdGFYLFxuICAgICAgICBkZWx0YVk6IGlucHV0LmRlbHRhWVxuICAgIH07XG59XG5cbi8qKlxuICogZ2V0IHRoZSBjZW50ZXIgb2YgYWxsIHRoZSBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gcG9pbnRlcnNcbiAqIEByZXR1cm4ge09iamVjdH0gY2VudGVyIGNvbnRhaW5zIGB4YCBhbmQgYHlgIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50ZXJzKSB7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHdoZW4gb25seSBvbmUgdG91Y2hcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHJvdW5kKHBvaW50ZXJzWzBdLmNsaWVudFgpLFxuICAgICAgICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgeCA9IDAsIHkgPSAwLCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHBvaW50ZXJzTGVuZ3RoKSB7XG4gICAgICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcbiAgICAgICAgeSArPSBwb2ludGVyc1tpXS5jbGllbnRZO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogcm91bmQoeCAvIHBvaW50ZXJzTGVuZ3RoKSxcbiAgICAgICAgeTogcm91bmQoeSAvIHBvaW50ZXJzTGVuZ3RoKVxuICAgIH07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSB2ZWxvY2l0eSBiZXR3ZWVuIHR3byBwb2ludHMuIHVuaXQgaXMgaW4gcHggcGVyIG1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhVGltZVxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtPYmplY3R9IHZlbG9jaXR5IGB4YCBhbmQgYHlgXG4gKi9cbmZ1bmN0aW9uIGdldFZlbG9jaXR5KGRlbHRhVGltZSwgeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggLyBkZWx0YVRpbWUgfHwgMCxcbiAgICAgICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHJldHVybiB7TnVtYmVyfSBkaXJlY3Rpb25cbiAqL1xuZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKHgsIHkpIHtcbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICByZXR1cm4gRElSRUNUSU9OX05PTkU7XG4gICAgfVxuXG4gICAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgfVxuICAgIHJldHVybiB5IDwgMCA/IERJUkVDVElPTl9VUCA6IERJUkVDVElPTl9ET1dOO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gcDEge3gsIHl9XG4gKiBAcGFyYW0ge09iamVjdH0gcDIge3gsIHl9XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHNdIGNvbnRhaW5pbmcgeCBhbmQgeSBrZXlzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMiwgcHJvcHMpIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XG4gICAgfVxuICAgIHZhciB4ID0gcDJbcHJvcHNbMF1dIC0gcDFbcHJvcHNbMF1dLFxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IHAxXG4gKiBAcGFyYW0ge09iamVjdH0gcDJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gZGVncmVlcyBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSByb3RhdGlvblxuICovXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldEFuZ2xlKGVuZFsxXSwgZW5kWzBdLCBQUk9QU19DTElFTlRfWFkpICsgZ2V0QW5nbGUoc3RhcnRbMV0sIHN0YXJ0WzBdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgc2NhbGUgZmFjdG9yIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBlbmQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcbiAqL1xuZnVuY3Rpb24gZ2V0U2NhbGUoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBnZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSwgUFJPUFNfQ0xJRU5UX1hZKSAvIGdldERpc3RhbmNlKHN0YXJ0WzBdLCBzdGFydFsxXSwgUFJPUFNfQ0xJRU5UX1hZKTtcbn1cblxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcbiAgICBtb3VzZWRvd246IElOUFVUX1NUQVJULFxuICAgIG1vdXNlbW92ZTogSU5QVVRfTU9WRSxcbiAgICBtb3VzZXVwOiBJTlBVVF9FTkRcbn07XG5cbnZhciBNT1VTRV9FTEVNRU5UX0VWRU5UUyA9ICdtb3VzZWRvd24nO1xudmFyIE1PVVNFX1dJTkRPV19FVkVOVFMgPSAnbW91c2Vtb3ZlIG1vdXNldXAnO1xuXG4vKipcbiAqIE1vdXNlIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBNb3VzZUlucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBNT1VTRV9XSU5ET1dfRVZFTlRTO1xuXG4gICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7IC8vIG1vdXNlZG93biBzdGF0ZVxuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBNRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IE1PVVNFX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBvbiBzdGFydCB3ZSB3YW50IHRvIGhhdmUgdGhlIGxlZnQgbW91c2UgYnV0dG9uIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIGV2LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XG4gICAgICAgICAgICBldmVudFR5cGUgPSBJTlBVVF9FTkQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKCF0aGlzLnByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9NT1VTRSxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxudmFyIFBPSU5URVJfSU5QVVRfTUFQID0ge1xuICAgIHBvaW50ZXJkb3duOiBJTlBVVF9TVEFSVCxcbiAgICBwb2ludGVybW92ZTogSU5QVVRfTU9WRSxcbiAgICBwb2ludGVydXA6IElOUFVUX0VORCxcbiAgICBwb2ludGVyY2FuY2VsOiBJTlBVVF9DQU5DRUwsXG4gICAgcG9pbnRlcm91dDogSU5QVVRfQ0FOQ0VMXG59O1xuXG4vLyBpbiBJRTEwIHRoZSBwb2ludGVyIHR5cGVzIGlzIGRlZmluZWQgYXMgYW4gZW51bVxudmFyIElFMTBfUE9JTlRFUl9UWVBFX0VOVU0gPSB7XG4gICAgMjogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAzOiBJTlBVVF9UWVBFX1BFTixcbiAgICA0OiBJTlBVVF9UWVBFX01PVVNFLFxuICAgIDU6IElOUFVUX1RZUEVfS0lORUNUIC8vIHNlZSBodHRwczovL3R3aXR0ZXIuY29tL2phY29icm9zc2kvc3RhdHVzLzQ4MDU5NjQzODQ4OTg5MDgxNlxufTtcblxudmFyIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAncG9pbnRlcmRvd24nO1xudmFyIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCc7XG5cbi8vIElFMTAgaGFzIHByZWZpeGVkIHN1cHBvcnQsIGFuZCBjYXNlLXNlbnNpdGl2ZVxuaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJiAhd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAnTVNQb2ludGVyRG93bic7XG4gICAgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ01TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsJztcbn1cblxuLyoqXG4gKiBQb2ludGVyIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBQb2ludGVyRXZlbnRJbnB1dCgpIHtcbiAgICB0aGlzLmV2RWwgPSBQT0lOVEVSX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBQT0lOVEVSX1dJTkRPV19FVkVOVFM7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zdG9yZSA9ICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzID0gW10pO1xufVxuXG5pbmhlcml0KFBvaW50ZXJFdmVudElucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBQRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgICAgdmFyIHJlbW92ZVBvaW50ZXIgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnRUeXBlTm9ybWFsaXplZCA9IGV2LnR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdtcycsICcnKTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IFBPSU5URVJfSU5QVVRfTUFQW2V2ZW50VHlwZU5vcm1hbGl6ZWRdO1xuICAgICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcblxuICAgICAgICB2YXIgaXNUb3VjaCA9IChwb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX1RPVUNIKTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGV2ZW50IGluIHRoZSBzdG9yZVxuICAgICAgICB2YXIgc3RvcmVJbmRleCA9IGluQXJyYXkoc3RvcmUsIGV2LnBvaW50ZXJJZCwgJ3BvaW50ZXJJZCcpO1xuXG4gICAgICAgIC8vIHN0YXJ0IGFuZCBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIChldi5idXR0b24gPT09IDAgfHwgaXNUb3VjaCkpIHtcbiAgICAgICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0b3JlLnB1c2goZXYpO1xuICAgICAgICAgICAgICAgIHN0b3JlSW5kZXggPSBzdG9yZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgICAgICByZW1vdmVQb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG5vdCBmb3VuZCwgc28gdGhlIHBvaW50ZXIgaGFzbid0IGJlZW4gZG93biAoc28gaXQncyBwcm9iYWJseSBhIGhvdmVyKVxuICAgICAgICBpZiAoc3RvcmVJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHN0b3JlW3N0b3JlSW5kZXhdID0gZXY7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHN0b3JlLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZW1vdmVQb2ludGVyKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmVcbiAgICAgICAgICAgIHN0b3JlLnNwbGljZShzdG9yZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG52YXIgU0lOR0xFX1RPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMgPSAndG91Y2hzdGFydCc7XG52YXIgU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFMgPSAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnO1xuXG4vKipcbiAqIFRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLmV2V2luID0gU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFM7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFNpbmdsZVRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVEVoYW5kbGVyKGV2KSB7XG4gICAgICAgIHZhciB0eXBlID0gU0lOR0xFX1RPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBzaG91bGQgd2UgaGFuZGxlIHRoZSB0b3VjaCBldmVudHM/XG4gICAgICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG91Y2hlcyA9IG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XG5cbiAgICAgICAgLy8gd2hlbiBkb25lLCByZXNldCB0aGUgc3RhcnRlZCBzdGF0ZVxuICAgICAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHRvdWNoZXNbMF0ubGVuZ3RoIC0gdG91Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHR5cGUsIHtcbiAgICAgICAgICAgIHBvaW50ZXJzOiB0b3VjaGVzWzBdLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfVE9VQ0gsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQHRoaXMge1RvdWNoSW5wdXR9XG4gKiBAcGFyYW0ge09iamVjdH0gZXZcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIGZsYWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR8QXJyYXl9IFthbGwsIGNoYW5nZWRdXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMoZXYsIHR5cGUpIHtcbiAgICB2YXIgYWxsID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpO1xuXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBhbGwgPSB1bmlxdWVBcnJheShhbGwuY29uY2F0KGNoYW5nZWQpLCAnaWRlbnRpZmllcicsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBbYWxsLCBjaGFuZ2VkXTtcbn1cblxudmFyIFRPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogTXVsdGktdXNlciB0b3VjaCBldmVudHMgaW5wdXRcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuZnVuY3Rpb24gVG91Y2hJbnB1dCgpIHtcbiAgICB0aGlzLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLnRhcmdldElkcyA9IHt9O1xuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChUb3VjaElucHV0LCBJbnB1dCwge1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1URWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBUT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG4gICAgICAgIHZhciB0b3VjaGVzID0gZ2V0VG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcbiAgICAgICAgaWYgKCF0b3VjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGxUb3VjaGVzID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgdGFyZ2V0SWRzID0gdGhpcy50YXJnZXRJZHM7XG5cbiAgICAvLyB3aGVuIHRoZXJlIGlzIG9ubHkgb25lIHRvdWNoLCB0aGUgcHJvY2VzcyBjYW4gYmUgc2ltcGxpZmllZFxuICAgIGlmICh0eXBlICYgKElOUFVUX1NUQVJUIHwgSU5QVVRfTU9WRSkgJiYgYWxsVG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGFyZ2V0SWRzW2FsbFRvdWNoZXNbMF0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICB0YXJnZXRUb3VjaGVzLFxuICAgICAgICBjaGFuZ2VkVG91Y2hlcyA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyA9IFtdLFxuICAgICAgICB0YXJnZXQgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcbiAgICB0YXJnZXRUb3VjaGVzID0gYWxsVG91Y2hlcy5maWx0ZXIoZnVuY3Rpb24odG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhcmVudCh0b3VjaC50YXJnZXQsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvLyBjb2xsZWN0IHRvdWNoZXNcbiAgICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldElkc1t0YXJnZXRUb3VjaGVzW2ldLmlkZW50aWZpZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbHRlciBjaGFuZ2VkIHRvdWNoZXMgdG8gb25seSBjb250YWluIHRvdWNoZXMgdGhhdCBleGlzdCBpbiB0aGUgY29sbGVjdGVkIHRhcmdldCBpZHNcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGNoYW5nZWRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFudXAgcmVtb3ZlZCB0b3VjaGVzXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmICghY2hhbmdlZFRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICAvLyBtZXJnZSB0YXJnZXRUb3VjaGVzIHdpdGggY2hhbmdlZFRhcmdldFRvdWNoZXMgc28gaXQgY29udGFpbnMgQUxMIHRvdWNoZXMsIGluY2x1ZGluZyAnZW5kJyBhbmQgJ2NhbmNlbCdcbiAgICAgICAgdW5pcXVlQXJyYXkodGFyZ2V0VG91Y2hlcy5jb25jYXQoY2hhbmdlZFRhcmdldFRvdWNoZXMpLCAnaWRlbnRpZmllcicsIHRydWUpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlc1xuICAgIF07XG59XG5cbi8qKlxuICogQ29tYmluZWQgdG91Y2ggYW5kIG1vdXNlIGlucHV0XG4gKlxuICogVG91Y2ggaGFzIGEgaGlnaGVyIHByaW9yaXR5IHRoZW4gbW91c2UsIGFuZCB3aGlsZSB0b3VjaGluZyBubyBtb3VzZSBldmVudHMgYXJlIGFsbG93ZWQuXG4gKiBUaGlzIGJlY2F1c2UgdG91Y2ggZGV2aWNlcyBhbHNvIGVtaXQgbW91c2UgZXZlbnRzIHdoaWxlIGRvaW5nIGEgdG91Y2guXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5cbnZhciBERURVUF9USU1FT1VUID0gMjUwMDtcbnZhciBERURVUF9ESVNUQU5DRSA9IDI1O1xuXG5mdW5jdGlvbiBUb3VjaE1vdXNlSW5wdXQoKSB7XG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBoYW5kbGVyID0gYmluZEZuKHRoaXMuaGFuZGxlciwgdGhpcyk7XG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaElucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZUlucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG5cbiAgICB0aGlzLnByaW1hcnlUb3VjaCA9IG51bGw7XG4gICAgdGhpcy5sYXN0VG91Y2hlcyA9IFtdO1xufVxuXG5pbmhlcml0KFRvdWNoTW91c2VJbnB1dCwgSW5wdXQsIHtcbiAgICAvKipcbiAgICAgKiBoYW5kbGUgbW91c2UgYW5kIHRvdWNoIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0RXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXREYXRhXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVE1FaGFuZGxlcihtYW5hZ2VyLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpIHtcbiAgICAgICAgdmFyIGlzVG91Y2ggPSAoaW5wdXREYXRhLnBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpLFxuICAgICAgICAgICAgaXNNb3VzZSA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9NT1VTRSk7XG5cbiAgICAgICAgaWYgKGlzTW91c2UgJiYgaW5wdXREYXRhLnNvdXJjZUNhcGFiaWxpdGllcyAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZW4gd2UncmUgaW4gYSB0b3VjaCBldmVudCwgcmVjb3JkIHRvdWNoZXMgdG8gIGRlLWR1cGUgc3ludGhldGljIG1vdXNlIGV2ZW50XG4gICAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgICAgICByZWNvcmRUb3VjaGVzLmNhbGwodGhpcywgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdXNlICYmIGlzU3ludGhldGljRXZlbnQuY2FsbCh0aGlzLCBpbnB1dERhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy50b3VjaC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMubW91c2UuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiByZWNvcmRUb3VjaGVzKGV2ZW50VHlwZSwgZXZlbnREYXRhKSB7XG4gICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeVRvdWNoID0gZXZlbnREYXRhLmNoYW5nZWRQb2ludGVyc1swXS5pZGVudGlmaWVyO1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgc2V0TGFzdFRvdWNoLmNhbGwodGhpcywgZXZlbnREYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldExhc3RUb3VjaChldmVudERhdGEpIHtcbiAgICB2YXIgdG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdO1xuXG4gICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMucHJpbWFyeVRvdWNoKSB7XG4gICAgICAgIHZhciBsYXN0VG91Y2ggPSB7eDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WX07XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXMucHVzaChsYXN0VG91Y2gpO1xuICAgICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgICAgdmFyIHJlbW92ZUxhc3RUb3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBsdHMuaW5kZXhPZihsYXN0VG91Y2gpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQocmVtb3ZlTGFzdFRvdWNoLCBERURVUF9USU1FT1VUKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3ludGhldGljRXZlbnQoZXZlbnREYXRhKSB7XG4gICAgdmFyIHggPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WCwgeSA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRZO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sYXN0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdCA9IHRoaXMubGFzdFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpLCBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVEFOQ0UgJiYgZHkgPD0gREVEVVBfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIFBSRUZJWEVEX1RPVUNIX0FDVElPTiA9IHByZWZpeGVkKFRFU1RfRUxFTUVOVC5zdHlsZSwgJ3RvdWNoQWN0aW9uJyk7XG52YXIgTkFUSVZFX1RPVUNIX0FDVElPTiA9IFBSRUZJWEVEX1RPVUNIX0FDVElPTiAhPT0gdW5kZWZpbmVkO1xuXG4vLyBtYWdpY2FsIHRvdWNoQWN0aW9uIHZhbHVlXG52YXIgVE9VQ0hfQUNUSU9OX0NPTVBVVEUgPSAnY29tcHV0ZSc7XG52YXIgVE9VQ0hfQUNUSU9OX0FVVE8gPSAnYXV0byc7XG52YXIgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTiA9ICdtYW5pcHVsYXRpb24nOyAvLyBub3QgaW1wbGVtZW50ZWRcbnZhciBUT1VDSF9BQ1RJT05fTk9ORSA9ICdub25lJztcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1ggPSAncGFuLXgnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWSA9ICdwYW4teSc7XG52YXIgVE9VQ0hfQUNUSU9OX01BUCA9IGdldFRvdWNoQWN0aW9uUHJvcHMoKTtcblxuLyoqXG4gKiBUb3VjaCBBY3Rpb25cbiAqIHNldHMgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IG9yIHVzZXMgdGhlIGpzIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvdWNoQWN0aW9uKG1hbmFnZXIsIHZhbHVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnNldCh2YWx1ZSk7XG59XG5cblRvdWNoQWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlIG9uIHRoZSBlbGVtZW50IG9yIGVuYWJsZSB0aGUgcG9seWZpbGxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIGZpbmQgb3V0IHRoZSB0b3VjaC1hY3Rpb24gYnkgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmICh2YWx1ZSA9PSBUT1VDSF9BQ1RJT05fQ09NUFVURSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXB1dGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOQVRJVkVfVE9VQ0hfQUNUSU9OICYmIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlICYmIFRPVUNIX0FDVElPTl9NQVBbdmFsdWVdKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtQUkVGSVhFRF9UT1VDSF9BQ1RJT05dID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGp1c3QgcmUtc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZVxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY29tcHV0ZSB0aGUgdmFsdWUgZm9yIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcmVjb2duaXplcidzIHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBjb21wdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIGlmIChib29sT3JGbihyZWNvZ25pemVyLm9wdGlvbnMuZW5hYmxlLCBbcmVjb2duaXplcl0pKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMuY29uY2F0KHJlY29nbml6ZXIuZ2V0VG91Y2hBY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucy5qb2luKCcgJykpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gZWFjaCBpbnB1dCBjeWNsZSBhbmQgcHJvdmlkZXMgdGhlIHByZXZlbnRpbmcgb2YgdGhlIGJyb3dzZXIgYmVoYXZpb3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBwcmV2ZW50RGVmYXVsdHM6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzcmNFdmVudCA9IGlucHV0LnNyY0V2ZW50O1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xuXG4gICAgICAgIC8vIGlmIHRoZSB0b3VjaCBhY3Rpb24gZGlkIHByZXZlbnRlZCBvbmNlIHRoaXMgc2Vzc2lvblxuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkKSB7XG4gICAgICAgICAgICBzcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSB0aGlzLmFjdGlvbnM7XG4gICAgICAgIHZhciBoYXNOb25lID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICAgICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWV07XG4gICAgICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKSAmJiAhVE9VQ0hfQUNUSU9OX01BUFtUT1VDSF9BQ1RJT05fUEFOX1hdO1xuXG4gICAgICAgIGlmIChoYXNOb25lKSB7XG4gICAgICAgICAgICAvL2RvIG5vdCBwcmV2ZW50IGRlZmF1bHRzIGlmIHRoaXMgaXMgYSB0YXAgZ2VzdHVyZVxuXG4gICAgICAgICAgICB2YXIgaXNUYXBQb2ludGVyID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSAxO1xuICAgICAgICAgICAgdmFyIGlzVGFwTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IDI7XG4gICAgICAgICAgICB2YXIgaXNUYXBUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCAyNTA7XG5cbiAgICAgICAgICAgIGlmIChpc1RhcFBvaW50ZXIgJiYgaXNUYXBNb3ZlbWVudCAmJiBpc1RhcFRvdWNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgICAgIC8vIGBwYW4teCBwYW4teWAgbWVhbnMgYnJvd3NlciBoYW5kbGVzIGFsbCBzY3JvbGxpbmcvcGFubmluZywgZG8gbm90IHByZXZlbnRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNOb25lIHx8XG4gICAgICAgICAgICAoaGFzUGFuWSAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkgfHxcbiAgICAgICAgICAgIChoYXNQYW5YICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZlbnRTcmMoc3JjRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGwgcHJldmVudERlZmF1bHQgdG8gcHJldmVudCB0aGUgYnJvd3NlcidzIGRlZmF1bHQgYmVoYXZpb3IgKHNjcm9sbGluZyBpbiBtb3N0IGNhc2VzKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNFdmVudFxuICAgICAqL1xuICAgIHByZXZlbnRTcmM6IGZ1bmN0aW9uKHNyY0V2ZW50KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiB3aGVuIHRoZSB0b3VjaEFjdGlvbnMgYXJlIGNvbGxlY3RlZCB0aGV5IGFyZSBub3QgYSB2YWxpZCB2YWx1ZSwgc28gd2UgbmVlZCB0byBjbGVhbiB0aGluZ3MgdXAuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucykge1xuICAgIC8vIG5vbmVcbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpO1xuXG4gICAgLy8gaWYgYm90aCBwYW4teCBhbmQgcGFuLXkgYXJlIHNldCAoZGlmZmVyZW50IHJlY29nbml6ZXJzXG4gICAgLy8gZm9yIGRpZmZlcmVudCBkaXJlY3Rpb25zLCBlLmcuIGhvcml6b250YWwgcGFuIGJ1dCB2ZXJ0aWNhbCBzd2lwZT8pXG4gICAgLy8gd2UgbmVlZCBub25lIChhcyBvdGhlcndpc2Ugd2l0aCBwYW4teCBwYW4teSBjb21iaW5lZCBub25lIG9mIHRoZXNlXG4gICAgLy8gcmVjb2duaXplcnMgd2lsbCB3b3JrLCBzaW5jZSB0aGUgYnJvd3NlciB3b3VsZCBoYW5kbGUgYWxsIHBhbm5pbmdcbiAgICBpZiAoaGFzUGFuWCAmJiBoYXNQYW5ZKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICAvLyBwYW4teCBPUiBwYW4teVxuICAgIGlmIChoYXNQYW5YIHx8IGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhblggPyBUT1VDSF9BQ1RJT05fUEFOX1ggOiBUT1VDSF9BQ1RJT05fUEFOX1k7XG4gICAgfVxuXG4gICAgLy8gbWFuaXB1bGF0aW9uXG4gICAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OO1xuICAgIH1cblxuICAgIHJldHVybiBUT1VDSF9BQ1RJT05fQVVUTztcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpIHtcbiAgICBpZiAoIU5BVElWRV9UT1VDSF9BQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdG91Y2hNYXAgPSB7fTtcbiAgICB2YXIgY3NzU3VwcG9ydHMgPSB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1Muc3VwcG9ydHM7XG4gICAgWydhdXRvJywgJ21hbmlwdWxhdGlvbicsICdwYW4teScsICdwYW4teCcsICdwYW4teCBwYW4teScsICdub25lJ10uZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAvLyBJZiBjc3Muc3VwcG9ydHMgaXMgbm90IHN1cHBvcnRlZCBidXQgdGhlcmUgaXMgbmF0aXZlIHRvdWNoLWFjdGlvbiBhc3N1bWUgaXQgc3VwcG9ydHNcbiAgICAgICAgLy8gYWxsIHZhbHVlcy4gVGhpcyBpcyB0aGUgY2FzZSBmb3IgSUUgMTAgYW5kIDExLlxuICAgICAgICB0b3VjaE1hcFt2YWxdID0gY3NzU3VwcG9ydHMgPyB3aW5kb3cuQ1NTLnN1cHBvcnRzKCd0b3VjaC1hY3Rpb24nLCB2YWwpIDogdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdG91Y2hNYXA7XG59XG5cbi8qKlxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxuICogQWxsIHJlY29nbml6ZXJzIGhhdmUgdGhlIGluaXRpYWwgc3RhdGUgb2YgUE9TU0lCTEUgd2hlbiBhIGlucHV0IHNlc3Npb24gc3RhcnRzLlxuICogVGhlIGRlZmluaXRpb24gb2YgYSBpbnB1dCBzZXNzaW9uIGlzIGZyb20gdGhlIGZpcnN0IGlucHV0IHVudGlsIHRoZSBsYXN0IGlucHV0LCB3aXRoIGFsbCBpdCdzIG1vdmVtZW50IGluIGl0LiAqXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcbiAqXG4gKiBPbiBlYWNoIHJlY29nbml6aW5nIGN5Y2xlIChzZWUgTWFuYWdlci5yZWNvZ25pemUpIHRoZSAucmVjb2duaXplKCkgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxuICpcbiAqIElmIHRoZSByZWNvZ25pemVyIGhhcyB0aGUgc3RhdGUgRkFJTEVELCBDQU5DRUxMRUQgb3IgUkVDT0dOSVpFRCAoZXF1YWxzIEVOREVEKSwgaXQgaXMgcmVzZXQgdG9cbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXG4gKlxuICogICAgICAgICAgICAgICBQb3NzaWJsZVxuICogICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICstLS0tLSstLS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XG4gKiAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICB8XG4gKiAgIEZhaWxlZCAgICAgIENhbmNlbGxlZCAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgIFJlY29nbml6ZWQgICAgICAgQmVnYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcbiAqL1xudmFyIFNUQVRFX1BPU1NJQkxFID0gMTtcbnZhciBTVEFURV9CRUdBTiA9IDI7XG52YXIgU1RBVEVfQ0hBTkdFRCA9IDQ7XG52YXIgU1RBVEVfRU5ERUQgPSA4O1xudmFyIFNUQVRFX1JFQ09HTklaRUQgPSBTVEFURV9FTkRFRDtcbnZhciBTVEFURV9DQU5DRUxMRUQgPSAxNjtcbnZhciBTVEFURV9GQUlMRUQgPSAzMjtcblxuLyoqXG4gKiBSZWNvZ25pemVyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIFJlY29nbml6ZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcblxuICAgIHRoaXMubWFuYWdlciA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGlzIGVuYWJsZSB0cnVlXG4gICAgdGhpcy5vcHRpb25zLmVuYWJsZSA9IGlmVW5kZWZpbmVkKHRoaXMub3B0aW9ucy5lbmFibGUsIHRydWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuXG4gICAgdGhpcy5zaW11bHRhbmVvdXMgPSB7fTtcbiAgICB0aGlzLnJlcXVpcmVGYWlsID0gW107XG59XG5cblJlY29nbml6ZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBkZWZhdWx0czoge30sXG5cbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybiB7UmVjb2duaXplcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gYWxzbyB1cGRhdGUgdGhlIHRvdWNoQWN0aW9uLCBpbiBjYXNlIHNvbWV0aGluZyBjaGFuZ2VkIGFib3V0IHRoZSBkaXJlY3Rpb25zL2VuYWJsZWQgc3RhdGVcbiAgICAgICAgdGhpcy5tYW5hZ2VyICYmIHRoaXMubWFuYWdlci50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2ltdWx0YW5lb3VzID0gdGhpcy5zaW11bHRhbmVvdXM7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKCFzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSkge1xuICAgICAgICAgICAgc2ltdWx0YW5lb3VzW290aGVyUmVjb2duaXplci5pZF0gPSBvdGhlclJlY29nbml6ZXI7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIGRyb3BSZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZWNvZ25pemVXaXRoJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZXIgY2FuIG9ubHkgcnVuIHdoZW4gYW4gb3RoZXIgaXMgZmFpbGluZ1xuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZXF1aXJlRmFpbHVyZTogZnVuY3Rpb24ob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhvdGhlclJlY29nbml6ZXIsICdyZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXF1aXJlRmFpbCA9IHRoaXMucmVxdWlyZUZhaWw7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKGluQXJyYXkocmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXF1aXJlRmFpbC5wdXNoKG90aGVyUmVjb2duaXplcik7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRyb3AgdGhlIHJlcXVpcmVGYWlsdXJlIGxpbmsuIGl0IGRvZXMgbm90IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheSh0aGlzLnJlcXVpcmVGYWlsLCBvdGhlclJlY29nbml6ZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1aXJlRmFpbC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBoYXMgcmVxdWlyZSBmYWlsdXJlcyBib29sZWFuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUmVxdWlyZUZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5SZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXG4gICAgICogdGhhdCBhbGwgdGhlIG5lZWRlZCByZWNvZ25pemVycyBoYXMgZmFpbGVkIGJlZm9yZSBlbWl0dGluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5tYW5hZ2VyLmVtaXQoZXZlbnQsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdwYW5zdGFydCcgYW5kICdwYW5tb3ZlJ1xuICAgICAgICBpZiAoc3RhdGUgPCBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQpOyAvLyBzaW1wbGUgJ2V2ZW50TmFtZScgZXZlbnRzXG5cbiAgICAgICAgaWYgKGlucHV0LmFkZGl0aW9uYWxFdmVudCkgeyAvLyBhZGRpdGlvbmFsIGV2ZW50KHBhbmxlZnQsIHBhbnJpZ2h0LCBwaW5jaGluLCBwaW5jaG91dC4uLilcbiAgICAgICAgICAgIGVtaXQoaW5wdXQuYWRkaXRpb25hbEV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBhbmVuZCBhbmQgcGFuY2FuY2VsXG4gICAgICAgIGlmIChzdGF0ZSA+PSBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoYXQgYWxsIHRoZSByZXF1aXJlIGZhaWx1cmUgcmVjb2duaXplcnMgaGFzIGZhaWxlZCxcbiAgICAgKiBpZiB0cnVlLCBpdCBlbWl0cyBhIGdlc3R1cmUgZXZlbnQsXG4gICAgICogb3RoZXJ3aXNlLCBzZXR1cCB0aGUgc3RhdGUgdG8gRkFJTEVELlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHRyeUVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbkVtaXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXQncyBmYWlsaW5nIGFueXdheVxuICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjYW4gd2UgZW1pdD9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5FbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzLnJlcXVpcmVGYWlsW2ldLnN0YXRlICYgKFNUQVRFX0ZBSUxFRCB8IFNUQVRFX1BPU1NJQkxFKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICAvLyBtYWtlIGEgbmV3IGNvcHkgb2YgdGhlIGlucHV0RGF0YVxuICAgICAgICAvLyBzbyB3ZSBjYW4gY2hhbmdlIHRoZSBpbnB1dERhdGEgd2l0aG91dCBtZXNzaW5nIHVwIHRoZSBvdGhlciByZWNvZ25pemVyc1xuICAgICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBhc3NpZ24oe30sIGlucHV0RGF0YSk7XG5cbiAgICAgICAgLy8gaXMgaXMgZW5hYmxlZCBhbmQgYWxsb3cgcmVjb2duaXppbmc/XG4gICAgICAgIGlmICghYm9vbE9yRm4odGhpcy5vcHRpb25zLmVuYWJsZSwgW3RoaXMsIGlucHV0RGF0YUNsb25lXSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9SRUNPR05JWkVEIHwgU1RBVEVfQ0FOQ0VMTEVEIHwgU1RBVEVfRkFJTEVEKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMucHJvY2VzcyhpbnB1dERhdGFDbG9uZSk7XG5cbiAgICAgICAgLy8gdGhlIHJlY29nbml6ZXIgaGFzIHJlY29nbml6ZWQgYSBnZXN0dXJlXG4gICAgICAgIC8vIHNvIHRyaWdnZXIgYW4gZXZlbnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQgfCBTVEFURV9DQU5DRUxMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnRyeUVtaXQoaW5wdXREYXRhQ2xvbmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcbiAgICAgKiB0aGUgYWN0dWFsIHJlY29nbml6aW5nIGhhcHBlbnMgaW4gdGhpcyBtZXRob2RcbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29uc3R9IFNUQVRFXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXREYXRhKSB7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBwcmVmZXJyZWQgdG91Y2gtYWN0aW9uXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbGVkIHdoZW4gdGhlIGdlc3R1cmUgaXNuJ3QgYWxsb3dlZCB0byByZWNvZ25pemVcbiAgICAgKiBsaWtlIHdoZW4gYW5vdGhlciBpcyBiZWluZyByZWNvZ25pemVkIG9yIGl0IGlzIGRpc2FibGVkXG4gICAgICogQHZpcnR1YWxcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7IH1cbn07XG5cbi8qKlxuICogZ2V0IGEgdXNhYmxlIHN0cmluZywgdXNlZCBhcyBldmVudCBwb3N0Zml4XG4gKiBAcGFyYW0ge0NvbnN0fSBzdGF0ZVxuICogQHJldHVybnMge1N0cmluZ30gc3RhdGVcbiAqL1xuZnVuY3Rpb24gc3RhdGVTdHIoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgJiBTVEFURV9DQU5DRUxMRUQpIHtcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9FTkRFRCkge1xuICAgICAgICByZXR1cm4gJ2VuZCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0NIQU5HRUQpIHtcbiAgICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQkVHQU4pIHtcbiAgICAgICAgcmV0dXJuICdzdGFydCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBkaXJlY3Rpb24gY29ucyB0byBzdHJpbmdcbiAqIEBwYXJhbSB7Q29uc3R9IGRpcmVjdGlvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZGlyZWN0aW9uU3RyKGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0RPV04pIHtcbiAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fVVApIHtcbiAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0xFRlQpIHtcbiAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fUklHSFQpIHtcbiAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBnZXQgYSByZWNvZ25pemVyIGJ5IG5hbWUgaWYgaXQgaXMgYm91bmQgdG8gYSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSBvdGhlclJlY29nbml6ZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICogQHJldHVybnMge1JlY29nbml6ZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCByZWNvZ25pemVyKSB7XG4gICAgdmFyIG1hbmFnZXIgPSByZWNvZ25pemVyLm1hbmFnZXI7XG4gICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0KG90aGVyUmVjb2duaXplcik7XG4gICAgfVxuICAgIHJldHVybiBvdGhlclJlY29nbml6ZXI7XG59XG5cbi8qKlxuICogVGhpcyByZWNvZ25pemVyIGlzIGp1c3QgdXNlZCBhcyBhIGJhc2UgZm9yIHRoZSBzaW1wbGUgYXR0cmlidXRlIHJlY29nbml6ZXJzLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIEF0dHJSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChBdHRyUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgQXR0clJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRlcnM6IDFcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byBjaGVjayBpZiBpdCB0aGUgcmVjb2duaXplciByZWNlaXZlcyB2YWxpZCBpbnB1dCwgbGlrZSBpbnB1dC5kaXN0YW5jZSA+IDEwLlxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSByZWNvZ25pemVkXG4gICAgICovXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25Qb2ludGVycyA9IHRoaXMub3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgcmV0dXJuIG9wdGlvblBvaW50ZXJzID09PSAwIHx8IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9uUG9pbnRlcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgdGhlIGlucHV0IGFuZCByZXR1cm4gdGhlIHN0YXRlIGZvciB0aGUgcmVjb2duaXplclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHsqfSBTdGF0ZVxuICAgICAqL1xuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XG5cbiAgICAgICAgdmFyIGlzUmVjb2duaXplZCA9IHN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCk7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5hdHRyVGVzdChpbnB1dCk7XG5cbiAgICAgICAgLy8gb24gY2FuY2VsIGlucHV0IGFuZCB3ZSd2ZSByZWNvZ25pemVkIGJlZm9yZSwgcmV0dXJuIFNUQVRFX0NBTkNFTExFRFxuICAgICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9DQU5DRUxMRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNSZWNvZ25pemVkIHx8IGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9FTkRFRDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIShzdGF0ZSAmIFNUQVRFX0JFR0FOKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NIQU5HRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQYW5cbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGFuZCBtb3ZlZCBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBhblJlY29nbml6ZXIoKSB7XG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucFggPSBudWxsO1xuICAgIHRoaXMucFkgPSBudWxsO1xufVxuXG5pbmhlcml0KFBhblJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQYW5SZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwYW4nLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgZGlyZWN0aW9uOiBESVJFQ1RJT05fQUxMXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvblRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBpbnB1dC5kaXN0YW5jZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGlucHV0LmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHZhciB5ID0gaW5wdXQuZGVsdGFZO1xuXG4gICAgICAgIC8vIGxvY2sgdG8gYXhpcz9cbiAgICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICh4ID09PSAwKSA/IERJUkVDVElPTl9OT05FIDogKHggPCAwKSA/IERJUkVDVElPTl9MRUZUIDogRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICAgICAgICAgIGhhc01vdmVkID0geCAhPSB0aGlzLnBYO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFYKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHkgPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeSA8IDApID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB5ICE9IHRoaXMucFk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gQXR0clJlY29nbml6ZXIucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICAodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOIHx8ICghKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTikgJiYgdGhpcy5kaXJlY3Rpb25UZXN0KGlucHV0KSkpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuXG4gICAgICAgIHRoaXMucFggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5kaXJlY3Rpb24pO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcywgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBpbmNoXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlcnMgYXJlIG1vdmluZyB0b3dhcmQgKHpvb20taW4pIG9yIGF3YXkgZnJvbSBlYWNoIG90aGVyICh6b29tLW91dCkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFBpbmNoUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAncGluY2gnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHZhciBpbk91dCA9IGlucHV0LnNjYWxlIDwgMSA/ICdpbicgOiAnb3V0JztcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGluT3V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUHJlc3NcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFByZXNzUmVjb2duaXplcigpIHtcbiAgICBSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xufVxuXG5pbmhlcml0KFByZXNzUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUHJlc3NSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwcmVzcycsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICB0aW1lOiAyNTEsIC8vIG1pbmltYWwgdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBwcmVzc2VkXG4gICAgICAgIHRocmVzaG9sZDogOSAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX0FVVE9dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICAgIHZhciB2YWxpZE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCBvcHRpb25zLnRocmVzaG9sZDtcbiAgICAgICAgdmFyIHZhbGlkVGltZSA9IGlucHV0LmRlbHRhVGltZSA+IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKCF2YWxpZE1vdmVtZW50IHx8ICF2YWxpZFBvaW50ZXJzIHx8IChpbnB1dC5ldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAhdmFsaWRUaW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXRDb250ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dCAmJiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSkge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgJ3VwJywgaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFJvdGF0ZVxuICogUmVjb2duaXplZCB3aGVuIHR3byBvciBtb3JlIHBvaW50ZXIgYXJlIG1vdmluZyBpbiBhIGNpcmN1bGFyIG1vdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFJvdGF0ZVJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBSb3RhdGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdyb3RhdGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU3dpcGVcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBtb3ZpbmcgZmFzdCAodmVsb2NpdHkpLCB3aXRoIGVub3VnaCBkaXN0YW5jZSBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFN3aXBlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFN3aXBlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFN3aXBlUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAnc3dpcGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICB2ZWxvY2l0eTogMC4zLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciB2ZWxvY2l0eTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgKERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX0hPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgZGlyZWN0aW9uICYgaW5wdXQub2Zmc2V0RGlyZWN0aW9uICYmXG4gICAgICAgICAgICBpbnB1dC5kaXN0YW5jZSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgJiZcbiAgICAgICAgICAgIGlucHV0Lm1heFBvaW50ZXJzID09IHRoaXMub3B0aW9ucy5wb2ludGVycyAmJlxuICAgICAgICAgICAgYWJzKHZlbG9jaXR5KSA+IHRoaXMub3B0aW9ucy52ZWxvY2l0eSAmJiBpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQ7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQub2Zmc2V0RGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHRhcCBpcyBlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb2luZyBhIHNtYWxsIHRhcC9jbGljay4gTXVsdGlwbGUgdGFwcyBhcmUgcmVjb2duaXplZCBpZiB0aGV5IG9jY3VyXG4gKiBiZXR3ZWVuIHRoZSBnaXZlbiBpbnRlcnZhbCBhbmQgcG9zaXRpb24uIFRoZSBkZWxheSBvcHRpb24gY2FuIGJlIHVzZWQgdG8gcmVjb2duaXplIG11bHRpLXRhcHMgd2l0aG91dCBmaXJpbmdcbiAqIGEgc2luZ2xlIHRhcC5cbiAqXG4gKiBUaGUgZXZlbnREYXRhIGZyb20gdGhlIGVtaXR0ZWQgZXZlbnQgY29udGFpbnMgdGhlIHByb3BlcnR5IGB0YXBDb3VudGAsIHdoaWNoIGNvbnRhaW5zIHRoZSBhbW91bnQgb2ZcbiAqIG11bHRpLXRhcHMgYmVpbmcgcmVjb2duaXplZC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBUYXBSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8vIHByZXZpb3VzIHRpbWUgYW5kIGNlbnRlcixcbiAgICAvLyB1c2VkIGZvciB0YXAgY291bnRpbmdcbiAgICB0aGlzLnBUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5wQ2VudGVyID0gZmFsc2U7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIHRoaXMuY291bnQgPSAwO1xufVxuXG5pbmhlcml0KFRhcFJlY29nbml6ZXIsIFJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAndGFwJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRhcHM6IDEsXG4gICAgICAgIGludGVydmFsOiAzMDAsIC8vIG1heCB0aW1lIGJldHdlZW4gdGhlIG11bHRpLXRhcCB0YXBzXG4gICAgICAgIHRpbWU6IDI1MCwgLy8gbWF4IHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgZG93biAobGlrZSBmaW5nZXIgb24gdGhlIHNjcmVlbilcbiAgICAgICAgdGhyZXNob2xkOiA5LCAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgICAgICBwb3NUaHJlc2hvbGQ6IDEwIC8vIGEgbXVsdGktdGFwIGNhbiBiZSBhIGJpdCBvZmYgdGhlIGluaXRpYWwgcG9zaXRpb25cbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCBvcHRpb25zLnRpbWU7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIGlmICgoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpICYmICh0aGlzLmNvdW50ID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKHZhbGlkTW92ZW1lbnQgJiYgdmFsaWRUb3VjaFRpbWUgJiYgdmFsaWRQb2ludGVycykge1xuICAgICAgICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWRJbnRlcnZhbCA9IHRoaXMucFRpbWUgPyAoaW5wdXQudGltZVN0YW1wIC0gdGhpcy5wVGltZSA8IG9wdGlvbnMuaW50ZXJ2YWwpIDogdHJ1ZTtcbiAgICAgICAgICAgIHZhciB2YWxpZE11bHRpVGFwID0gIXRoaXMucENlbnRlciB8fCBnZXREaXN0YW5jZSh0aGlzLnBDZW50ZXIsIGlucHV0LmNlbnRlcikgPCBvcHRpb25zLnBvc1RocmVzaG9sZDtcblxuICAgICAgICAgICAgdGhpcy5wVGltZSA9IGlucHV0LnRpbWVTdGFtcDtcbiAgICAgICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZE11bHRpVGFwIHx8ICF2YWxpZEludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblxuICAgICAgICAgICAgLy8gaWYgdGFwIGNvdW50IG1hdGNoZXMgd2UgaGF2ZSByZWNvZ25pemVkIGl0LFxuICAgICAgICAgICAgLy8gZWxzZSBpdCBoYXMgYmVnYW4gcmVjb2duaXppbmcuLi5cbiAgICAgICAgICAgIHZhciB0YXBDb3VudCA9IHRoaXMuY291bnQgJSBvcHRpb25zLnRhcHM7XG4gICAgICAgICAgICBpZiAodGFwQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBubyBmYWlsaW5nIHJlcXVpcmVtZW50cywgaW1tZWRpYXRlbHkgdHJpZ2dlciB0aGUgdGFwIGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gb3Igd2FpdCBhcyBsb25nIGFzIHRoZSBtdWx0aXRhcCBpbnRlcnZhbCB0byB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1JlcXVpcmVGYWlsdXJlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUkVDT0dOSVpFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmludGVydmFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICBmYWlsVGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSBTVEFURV9SRUNPR05JWkVEKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50YXBDb3VudCA9IHRoaXMuY291bnQ7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFNpbXBsZSB3YXkgdG8gY3JlYXRlIGEgbWFuYWdlciB3aXRoIGEgZGVmYXVsdCBzZXQgb2YgcmVjb2duaXplcnMuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFtbWVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLnJlY29nbml6ZXJzID0gaWZVbmRlZmluZWQob3B0aW9ucy5yZWNvZ25pemVycywgSGFtbWVyLmRlZmF1bHRzLnByZXNldCk7XG4gICAgcmV0dXJuIG5ldyBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEBjb25zdCB7c3RyaW5nfVxuICovXG5IYW1tZXIuVkVSU0lPTiA9ICcyLjAuNyc7XG5cbi8qKlxuICogZGVmYXVsdCBzZXR0aW5nc1xuICogQG5hbWVzcGFjZVxuICovXG5IYW1tZXIuZGVmYXVsdHMgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IGlmIERPTSBldmVudHMgYXJlIGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBCdXQgdGhpcyBpcyBzbG93ZXIgYW5kIHVudXNlZCBieSBzaW1wbGUgaW1wbGVtZW50YXRpb25zLCBzbyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZG9tRXZlbnRzOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxuICAgICAqIFdoZW4gc2V0IHRvIGBjb21wdXRlYCBpdCB3aWxsIG1hZ2ljYWxseSBzZXQgdGhlIGNvcnJlY3QgdmFsdWUgYmFzZWQgb24gdGhlIGFkZGVkIHJlY29nbml6ZXJzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgY29tcHV0ZVxuICAgICAqL1xuICAgIHRvdWNoQWN0aW9uOiBUT1VDSF9BQ1RJT05fQ09NUFVURSxcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmFibGU6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBFWFBFUklNRU5UQUwgRkVBVFVSRSAtLSBjYW4gYmUgcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICogQ2hhbmdlIHRoZSBwYXJlbnQgaW5wdXQgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICogSWYgTnVsbCwgdGhlbiBpdCBpcyBiZWluZyBzZXQgdGhlIHRvIG1haW4gZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVsbHxFdmVudFRhcmdldH1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgaW5wdXRUYXJnZXQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBmb3JjZSBhbiBpbnB1dCBjbGFzc1xuICAgICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dENsYXNzOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCByZWNvZ25pemVyIHNldHVwIHdoZW4gY2FsbGluZyBgSGFtbWVyKClgXG4gICAgICogV2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyIHRoZXNlIHdpbGwgYmUgc2tpcHBlZC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgcHJlc2V0OiBbXG4gICAgICAgIC8vIFJlY29nbml6ZXJDbGFzcywgb3B0aW9ucywgW3JlY29nbml6ZVdpdGgsIC4uLl0sIFtyZXF1aXJlRmFpbHVyZSwgLi4uXVxuICAgICAgICBbUm90YXRlUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9XSxcbiAgICAgICAgW1BpbmNoUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9LCBbJ3JvdGF0ZSddXSxcbiAgICAgICAgW1N3aXBlUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9XSxcbiAgICAgICAgW1BhblJlY29nbml6ZXIsIHtkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMfSwgWydzd2lwZSddXSxcbiAgICAgICAgW1RhcFJlY29nbml6ZXJdLFxuICAgICAgICBbVGFwUmVjb2duaXplciwge2V2ZW50OiAnZG91YmxldGFwJywgdGFwczogMn0sIFsndGFwJ11dLFxuICAgICAgICBbUHJlc3NSZWNvZ25pemVyXVxuICAgIF0sXG5cbiAgICAvKipcbiAgICAgKiBTb21lIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgdGhlIHdvcmtpbmcgb2YgSGFtbWVyLlxuICAgICAqIEFkZCB0aGVtIHRvIHRoaXMgbWV0aG9kIGFuZCB0aGV5IHdpbGwgYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgTWFuYWdlci5cbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG4gICAgY3NzUHJvcHM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRleHQgc2VsZWN0aW9uIHRvIGltcHJvdmUgdGhlIGRyYWdnaW5nIGdlc3R1cmUuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGUgdGhlIFdpbmRvd3MgUGhvbmUgZ3JpcHBlcnMgd2hlbiBwcmVzc2luZyBhbiBlbGVtZW50LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBkZWZhdWx0IGNhbGxvdXQgc2hvd24gd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQuXG4gICAgICAgICAqIE9uIGlPUywgd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQgc3VjaCBhcyBhIGxpbmssIFNhZmFyaSBkaXNwbGF5c1xuICAgICAgICAgKiBhIGNhbGxvdXQgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGluay4gVGhpcyBwcm9wZXJ0eSBhbGxvd3MgeW91IHRvIGRpc2FibGUgdGhhdCBjYWxsb3V0LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgd2hldGhlciB6b29taW5nIGlzIGVuYWJsZWQuIFVzZWQgYnkgSUUxMD5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICBjb250ZW50Wm9vbWluZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgdGhhdCBhbiBlbnRpcmUgZWxlbWVudCBzaG91bGQgYmUgZHJhZ2dhYmxlIGluc3RlYWQgb2YgaXRzIGNvbnRlbnRzLiBNYWlubHkgZm9yIGRlc2t0b3AgYnJvd3NlcnMuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdXNlckRyYWc6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3ZlcnJpZGVzIHRoZSBoaWdobGlnaHQgY29sb3Igc2hvd24gd2hlbiB0aGUgdXNlciB0YXBzIGEgbGluayBvciBhIEphdmFTY3JpcHRcbiAgICAgICAgICogY2xpY2thYmxlIGVsZW1lbnQgaW4gaU9TLiBUaGlzIHByb3BlcnR5IG9iZXlzIHRoZSBhbHBoYSB2YWx1ZSwgaWYgc3BlY2lmaWVkLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAncmdiYSgwLDAsMCwwKSdcbiAgICAgICAgICovXG4gICAgICAgIHRhcEhpZ2hsaWdodENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9XG59O1xuXG52YXIgU1RPUCA9IDE7XG52YXIgRk9SQ0VEX1NUT1AgPSAyO1xuXG4vKipcbiAqIE1hbmFnZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBhc3NpZ24oe30sIEhhbW1lci5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgPSB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICB0aGlzLnJlY29nbml6ZXJzID0gW107XG4gICAgdGhpcy5vbGRDc3NQcm9wcyA9IHt9O1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gY3JlYXRlSW5wdXRJbnN0YW5jZSh0aGlzKTtcbiAgICB0aGlzLnRvdWNoQWN0aW9uID0gbmV3IFRvdWNoQWN0aW9uKHRoaXMsIHRoaXMub3B0aW9ucy50b3VjaEFjdGlvbik7XG5cbiAgICB0b2dnbGVDc3NQcm9wcyh0aGlzLCB0cnVlKTtcblxuICAgIGVhY2godGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciByZWNvZ25pemVyID0gdGhpcy5hZGQobmV3IChpdGVtWzBdKShpdGVtWzFdKSk7XG4gICAgICAgIGl0ZW1bMl0gJiYgcmVjb2duaXplci5yZWNvZ25pemVXaXRoKGl0ZW1bMl0pO1xuICAgICAgICBpdGVtWzNdICYmIHJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUoaXRlbVszXSk7XG4gICAgfSwgdGhpcyk7XG59XG5cbk1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyB0aGF0IG5lZWQgYSBsaXR0bGUgbW9yZSBzZXR1cFxuICAgICAgICBpZiAob3B0aW9ucy50b3VjaEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJzIGFuZCByZWluaXRpYWxpemVcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC50YXJnZXQgPSBvcHRpb25zLmlucHV0VGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHN0b3AgcmVjb2duaXppbmcgZm9yIHRoaXMgc2Vzc2lvbi5cbiAgICAgKiBUaGlzIHNlc3Npb24gd2lsbCBiZSBkaXNjYXJkZWQsIHdoZW4gYSBuZXcgW2lucHV0XXN0YXJ0IGV2ZW50IGlzIGZpcmVkLlxuICAgICAqIFdoZW4gZm9yY2VkLCB0aGUgcmVjb2duaXplciBjeWNsZSBpcyBzdG9wcGVkIGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZvcmNlXVxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zdG9wcGVkID0gZm9yY2UgPyBGT1JDRURfU1RPUCA6IFNUT1A7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJ1biB0aGUgcmVjb2duaXplcnMhXG4gICAgICogY2FsbGVkIGJ5IHRoZSBpbnB1dEhhbmRsZXIgZnVuY3Rpb24gb24gZXZlcnkgbW92ZW1lbnQgb2YgdGhlIHBvaW50ZXJzICh0b3VjaGVzKVxuICAgICAqIGl0IHdhbGtzIHRocm91Z2ggYWxsIHRoZSByZWNvZ25pemVycyBhbmQgdHJpZXMgdG8gZGV0ZWN0IHRoZSBnZXN0dXJlIHRoYXQgaXMgYmVpbmcgbWFkZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcbiAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcnVuIHRoZSB0b3VjaC1hY3Rpb24gcG9seWZpbGxcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoaW5wdXREYXRhKTtcblxuICAgICAgICB2YXIgcmVjb2duaXplcjtcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgICAvLyB0aGlzIGhvbGRzIHRoZSByZWNvZ25pemVyIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cbiAgICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxuICAgICAgICAvLyBpZiBubyByZWNvZ25pemVyIGlzIGRldGVjdGluZyBhIHRoaW5nLCBpdCBpcyBzZXQgdG8gYG51bGxgXG4gICAgICAgIHZhciBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyO1xuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gdGhlIGxhc3QgcmVjb2duaXplciBpcyByZWNvZ25pemVkXG4gICAgICAgIC8vIG9yIHdoZW4gd2UncmUgaW4gYSBuZXcgc2Vzc2lvblxuICAgICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgKGN1clJlY29nbml6ZXIgJiYgY3VyUmVjb2duaXplci5zdGF0ZSAmIFNUQVRFX1JFQ09HTklaRUQpKSB7XG4gICAgICAgICAgICBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCByZWNvZ25pemVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXIgPSByZWNvZ25pemVyc1tpXTtcblxuICAgICAgICAgICAgLy8gZmluZCBvdXQgaWYgd2UgYXJlIGFsbG93ZWQgdHJ5IHRvIHJlY29nbml6ZSB0aGUgaW5wdXQgZm9yIHRoaXMgb25lLlxuICAgICAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXG4gICAgICAgICAgICAvLyAyLiAgIGFsbG93IGlmIHdlIHN0aWxsIGhhdmVuJ3QgcmVjb2duaXplZCBhIGdlc3R1cmUgaW4gdGhpcyBzZXNzaW9uLCBvciB0aGUgdGhpcyByZWNvZ25pemVyIGlzIHRoZSBvbmVcbiAgICAgICAgICAgIC8vICAgICAgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXG4gICAgICAgICAgICAvLyAgICAgIHRoaXMgY2FuIGJlIHNldHVwIHdpdGggdGhlIGByZWNvZ25pemVXaXRoKClgIG1ldGhvZCBvbiB0aGUgcmVjb2duaXplci5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uLnN0b3BwZWQgIT09IEZPUkNFRF9TVE9QICYmICggLy8gMVxuICAgICAgICAgICAgICAgICAgICAhY3VyUmVjb2duaXplciB8fCByZWNvZ25pemVyID09IGN1clJlY29nbml6ZXIgfHwgLy8gMlxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pemVyLmNhblJlY29nbml6ZVdpdGgoY3VyUmVjb2duaXplcikpKSB7IC8vIDNcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlY29nbml6ZShpbnB1dERhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWNvZ25pemVyIGhhcyBiZWVuIHJlY29nbml6aW5nIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGdlc3R1cmUsIHdlIHdhbnQgdG8gc3RvcmUgdGhpcyBvbmUgYXMgdGhlXG4gICAgICAgICAgICAvLyBjdXJyZW50IGFjdGl2ZSByZWNvZ25pemVyLiBidXQgb25seSBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYW4gYWN0aXZlIHJlY29nbml6ZXJcbiAgICAgICAgICAgIGlmICghY3VyUmVjb2duaXplciAmJiByZWNvZ25pemVyLnN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCB8IFNUQVRFX0VOREVEKSkge1xuICAgICAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSByZWNvZ25pemVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBhIHJlY29nbml6ZXIgYnkgaXRzIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE51bGx9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChyZWNvZ25pemVyIGluc3RhbmNlb2YgUmVjb2duaXplcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY29nbml6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVjb2duaXplcnNbaV0ub3B0aW9ucy5ldmVudCA9PSByZWNvZ25pemVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSByZWNvZ25pemVyIHRvIHRoZSBtYW5hZ2VyXG4gICAgICogZXhpc3RpbmcgcmVjb2duaXplcnMgd2l0aCB0aGUgc2FtZSBldmVudCBuYW1lIHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE1hbmFnZXJ9XG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAnYWRkJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXG4gICAgICAgIHZhciBleGlzdGluZyA9IHRoaXMuZ2V0KHJlY29nbml6ZXIub3B0aW9ucy5ldmVudCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoZXhpc3RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvZ25pemVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgICByZWNvZ25pemVyLm1hbmFnZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgIHJldHVybiByZWNvZ25pemVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvZ25pemVyIGJ5IG5hbWUgb3IgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge01hbmFnZXJ9XG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAncmVtb3ZlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplciA9IHRoaXMuZ2V0KHJlY29nbml6ZXIpO1xuXG4gICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGlzIHJlY29nbml6ZXIgZXhpc3RzXG4gICAgICAgIGlmIChyZWNvZ25pemVyKSB7XG4gICAgICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheShyZWNvZ25pemVycywgcmVjb2duaXplcik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIGV2ZW50LCBsZWF2ZSBlbWl0IGJsYW5rIHRvIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdICYmIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBlbWl0IGV2ZW50IHRvIHRoZSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIHdlIGFsc28gd2FudCB0byB0cmlnZ2VyIGRvbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kb21FdmVudHMpIHtcbiAgICAgICAgICAgIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBoYW5kbGVycywgc28gc2tpcCBpdCBhbGxcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF0gJiYgdGhpcy5oYW5kbGVyc1tldmVudF0uc2xpY2UoKTtcbiAgICAgICAgaWYgKCFoYW5kbGVycyB8fCAhaGFuZGxlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnR5cGUgPSBldmVudDtcbiAgICAgICAgZGF0YS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGF0YS5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzW2ldKGRhdGEpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRlc3Ryb3kgdGhlIG1hbmFnZXIgYW5kIHVuYmluZHMgYWxsIGV2ZW50c1xuICAgICAqIGl0IGRvZXNuJ3QgdW5iaW5kIGRvbSBldmVudHMsIHRoYXQgaXMgdGhlIHVzZXIgb3duIHJlc3BvbnNpYmlsaXR5XG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCAmJiB0b2dnbGVDc3NQcm9wcyh0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgICAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBhZGQvcmVtb3ZlIHRoZSBjc3MgcHJvcGVydGllcyBhcyBkZWZpbmVkIGluIG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wc1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFkZFxuICovXG5mdW5jdGlvbiB0b2dnbGVDc3NQcm9wcyhtYW5hZ2VyLCBhZGQpIHtcbiAgICB2YXIgZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJvcDtcbiAgICBlYWNoKG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wcywgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgcHJvcCA9IHByZWZpeGVkKGVsZW1lbnQuc3R5bGUsIG5hbWUpO1xuICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdID0gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdIHx8ICcnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFhZGQpIHtcbiAgICAgICAgbWFuYWdlci5vbGRDc3NQcm9wcyA9IHt9O1xuICAgIH1cbn1cblxuLyoqXG4gKiB0cmlnZ2VyIGRvbSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICovXG5mdW5jdGlvbiB0cmlnZ2VyRG9tRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgZ2VzdHVyZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZ2VzdHVyZUV2ZW50LmluaXRFdmVudChldmVudCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZ2VzdHVyZUV2ZW50Lmdlc3R1cmUgPSBkYXRhO1xuICAgIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZ2VzdHVyZUV2ZW50KTtcbn1cblxuYXNzaWduKEhhbW1lciwge1xuICAgIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcbiAgICBJTlBVVF9NT1ZFOiBJTlBVVF9NT1ZFLFxuICAgIElOUFVUX0VORDogSU5QVVRfRU5ELFxuICAgIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxuXG4gICAgU1RBVEVfUE9TU0lCTEU6IFNUQVRFX1BPU1NJQkxFLFxuICAgIFNUQVRFX0JFR0FOOiBTVEFURV9CRUdBTixcbiAgICBTVEFURV9DSEFOR0VEOiBTVEFURV9DSEFOR0VELFxuICAgIFNUQVRFX0VOREVEOiBTVEFURV9FTkRFRCxcbiAgICBTVEFURV9SRUNPR05JWkVEOiBTVEFURV9SRUNPR05JWkVELFxuICAgIFNUQVRFX0NBTkNFTExFRDogU1RBVEVfQ0FOQ0VMTEVELFxuICAgIFNUQVRFX0ZBSUxFRDogU1RBVEVfRkFJTEVELFxuXG4gICAgRElSRUNUSU9OX05PTkU6IERJUkVDVElPTl9OT05FLFxuICAgIERJUkVDVElPTl9MRUZUOiBESVJFQ1RJT05fTEVGVCxcbiAgICBESVJFQ1RJT05fUklHSFQ6IERJUkVDVElPTl9SSUdIVCxcbiAgICBESVJFQ1RJT05fVVA6IERJUkVDVElPTl9VUCxcbiAgICBESVJFQ1RJT05fRE9XTjogRElSRUNUSU9OX0RPV04sXG4gICAgRElSRUNUSU9OX0hPUklaT05UQUw6IERJUkVDVElPTl9IT1JJWk9OVEFMLFxuICAgIERJUkVDVElPTl9WRVJUSUNBTDogRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgIERJUkVDVElPTl9BTEw6IERJUkVDVElPTl9BTEwsXG5cbiAgICBNYW5hZ2VyOiBNYW5hZ2VyLFxuICAgIElucHV0OiBJbnB1dCxcbiAgICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXG5cbiAgICBUb3VjaElucHV0OiBUb3VjaElucHV0LFxuICAgIE1vdXNlSW5wdXQ6IE1vdXNlSW5wdXQsXG4gICAgUG9pbnRlckV2ZW50SW5wdXQ6IFBvaW50ZXJFdmVudElucHV0LFxuICAgIFRvdWNoTW91c2VJbnB1dDogVG91Y2hNb3VzZUlucHV0LFxuICAgIFNpbmdsZVRvdWNoSW5wdXQ6IFNpbmdsZVRvdWNoSW5wdXQsXG5cbiAgICBSZWNvZ25pemVyOiBSZWNvZ25pemVyLFxuICAgIEF0dHJSZWNvZ25pemVyOiBBdHRyUmVjb2duaXplcixcbiAgICBUYXA6IFRhcFJlY29nbml6ZXIsXG4gICAgUGFuOiBQYW5SZWNvZ25pemVyLFxuICAgIFN3aXBlOiBTd2lwZVJlY29nbml6ZXIsXG4gICAgUGluY2g6IFBpbmNoUmVjb2duaXplcixcbiAgICBSb3RhdGU6IFJvdGF0ZVJlY29nbml6ZXIsXG4gICAgUHJlc3M6IFByZXNzUmVjb2duaXplcixcblxuICAgIG9uOiBhZGRFdmVudExpc3RlbmVycyxcbiAgICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuICAgIGVhY2g6IGVhY2gsXG4gICAgbWVyZ2U6IG1lcmdlLFxuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIGFzc2lnbjogYXNzaWduLFxuICAgIGluaGVyaXQ6IGluaGVyaXQsXG4gICAgYmluZEZuOiBiaW5kRm4sXG4gICAgcHJlZml4ZWQ6IHByZWZpeGVkXG59KTtcblxuLy8gdGhpcyBwcmV2ZW50cyBlcnJvcnMgd2hlbiBIYW1tZXIgaXMgbG9hZGVkIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTURcbi8vICBzdHlsZSBsb2FkZXIgYnV0IGJ5IHNjcmlwdCB0YWcsIG5vdCBieSB0aGUgbG9hZGVyLlxudmFyIGZyZWVHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuZnJlZUdsb2JhbC5IYW1tZXIgPSBIYW1tZXI7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBIYW1tZXI7XG4gICAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEhhbW1lcjtcbn0gZWxzZSB7XG4gICAgd2luZG93W2V4cG9ydE5hbWVdID0gSGFtbWVyO1xufVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCAnSGFtbWVyJyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL2hhbW1lcmpzL2hhbW1lci5qcyIsImltcG9ydCB3YXlwb2ludCBmcm9tICd3YXlwb2ludHMvbGliL2pxdWVyeS53YXlwb2ludHMnO1xuXG5leHBvcnQgZGVmYXVsdCAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpICB7XG5cblx0Ly8gTmF2YmFyIGNpcmNsZXMgY2xpY2tcblx0bGV0IG5hdmJhckNsaWNrZWQgPSBmYWxzZTtcblxuXHQkKCcjbmF2YmFyIGEnKS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0Y29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0Ly8gU2V0IGJvb2xlYW4gc28gd2F5cG9pbnRzIGFyZSBpZ25vcmVkXG5cdFx0bmF2YmFyQ2xpY2tlZCA9IHRydWU7XG5cblx0XHQvLyBSZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZyb20gY2lyY2xlc1xuXHRcdCQoJyNuYXZiYXIgYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuXHRcdC8vIFNldCBjbGlja2VkIGNpcmNsZSBhcyBhY3RpdmUgYW5kIHZpc2l0ZWQgYmVmb3JlIGFueXRoaW5nIGVsc2Vcblx0XHQkdGhpcy5hZGRDbGFzcygnYWN0aXZlIHZpc2l0ZWQnKTtcblxuXHRcdC8vIFNldCBwcmV2aW91cyB0byB2aXNpdGVkLCBzZXQgbmV4dCBhcyBub3QgdmlzaXRlZFxuXHRcdCR0aGlzLnBhcmVudCgpLnByZXZBbGwoKS5maW5kKCdhJykuYWRkQ2xhc3MoJ3Zpc2l0ZWQnKTtcblx0XHQkdGhpcy5wYXJlbnQoKS5uZXh0QWxsKCkuZmluZCgnYScpLnJlbW92ZUNsYXNzKCd2aXNpdGVkJyk7XG5cblx0XHQvLyBTY3JvbGwgZG9jdW1lbnQgdG8gdG9wIG9mIGNsaWNrZWQgc2VjdGlvblxuXHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDokKCR0aGlzLmF0dHIoJ2hyZWYnKSkub2Zmc2V0KCkudG9wfSwgJ2Zhc3QnLCBmdW5jdGlvbigpIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJHRoaXMuYXR0cignaHJlZicpO1xuXG5cdFx0XHQvLyBSZW1vdmUgYm9vbGVhbiBjaGVjayBhZnRlciBkZWxheSwgc28gd2F5cG9pbnRzIGRvZXNuJ3QgZ2V0IHRoZXJlIGZpcnN0XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bmF2YmFyQ2xpY2tlZCA9IGZhbHNlO1xuXHRcdFx0fSwgMTAwKTtcblx0XHR9KTtcblx0fSk7XG5cblx0Ly8gV2F5cG9pbnRzIGZvciBuYXZiYXIgY2lyY2xlc1xuXHQkKCdoMicpLndheXBvaW50KHtcblx0XHRoYW5kbGVyOiBmdW5jdGlvbihkaXJlY3Rpb24pIHtcblx0XHRcdC8vIERvbid0IGZpcmUgaWYgbmF2YmFyIGhhcyBiZWVuIGNsaWNrZWRcblx0XHRcdGlmKCFuYXZiYXJDbGlja2VkKSB7XG5cdFx0XHRcdGNvbnN0ICRuYXZjaXJjbGUgPSAkKCcjbmF2YmFyIGFbaHJlZj1cIiMnICsgdGhpcy5lbGVtZW50LmlkICsgJ1wiJyk7XG5cdFx0XHRcdGNvbnN0ICRwcmV2aW91c05hdmNpcmNsZSA9ICRuYXZjaXJjbGUucGFyZW50KCkucHJldigpLmZpbmQoJ2EnKTtcblxuXHRcdFx0XHRpZihkaXJlY3Rpb24gPT0gJ2Rvd24nKSB7XG5cdFx0XHRcdFx0JCgnI25hdmJhciBhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdCRuYXZjaXJjbGUuYWRkQ2xhc3MoJ2FjdGl2ZSB2aXNpdGVkJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0JHByZXZpb3VzTmF2Y2lyY2xlLmFkZENsYXNzKCdhY3RpdmUnKTtcblx0XHRcdFx0XHQkbmF2Y2lyY2xlLnJlbW92ZUNsYXNzKCdhY3RpdmUgdmlzaXRlZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRvZmZzZXQ6ICc0MCUnXG5cdH0pO1xuXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL21vZHVsZXMvbmF2YmFyLmpzIiwiLyohXG5XYXlwb2ludHMgLSA0LjAuMVxuQ29weXJpZ2h0IMKpIDIwMTEtMjAxNiBDYWxlYiBUcm91Z2h0b25cbkxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbmh0dHBzOi8vZ2l0aHViLmNvbS9pbWFrZXdlYnRoaW5ncy93YXlwb2ludHMvYmxvYi9tYXN0ZXIvbGljZW5zZXMudHh0XG4qL1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCdcblxuICB2YXIga2V5Q291bnRlciA9IDBcbiAgdmFyIGFsbFdheXBvaW50cyA9IHt9XG5cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL3dheXBvaW50ICovXG4gIGZ1bmN0aW9uIFdheXBvaW50KG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gb3B0aW9ucyBwYXNzZWQgdG8gV2F5cG9pbnQgY29uc3RydWN0b3InKVxuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBlbGVtZW50IG9wdGlvbiBwYXNzZWQgdG8gV2F5cG9pbnQgY29uc3RydWN0b3InKVxuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBoYW5kbGVyIG9wdGlvbiBwYXNzZWQgdG8gV2F5cG9pbnQgY29uc3RydWN0b3InKVxuICAgIH1cblxuICAgIHRoaXMua2V5ID0gJ3dheXBvaW50LScgKyBrZXlDb3VudGVyXG4gICAgdGhpcy5vcHRpb25zID0gV2F5cG9pbnQuQWRhcHRlci5leHRlbmQoe30sIFdheXBvaW50LmRlZmF1bHRzLCBvcHRpb25zKVxuICAgIHRoaXMuZWxlbWVudCA9IHRoaXMub3B0aW9ucy5lbGVtZW50XG4gICAgdGhpcy5hZGFwdGVyID0gbmV3IFdheXBvaW50LkFkYXB0ZXIodGhpcy5lbGVtZW50KVxuICAgIHRoaXMuY2FsbGJhY2sgPSBvcHRpb25zLmhhbmRsZXJcbiAgICB0aGlzLmF4aXMgPSB0aGlzLm9wdGlvbnMuaG9yaXpvbnRhbCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCdcbiAgICB0aGlzLmVuYWJsZWQgPSB0aGlzLm9wdGlvbnMuZW5hYmxlZFxuICAgIHRoaXMudHJpZ2dlclBvaW50ID0gbnVsbFxuICAgIHRoaXMuZ3JvdXAgPSBXYXlwb2ludC5Hcm91cC5maW5kT3JDcmVhdGUoe1xuICAgICAgbmFtZTogdGhpcy5vcHRpb25zLmdyb3VwLFxuICAgICAgYXhpczogdGhpcy5heGlzXG4gICAgfSlcbiAgICB0aGlzLmNvbnRleHQgPSBXYXlwb2ludC5Db250ZXh0LmZpbmRPckNyZWF0ZUJ5RWxlbWVudCh0aGlzLm9wdGlvbnMuY29udGV4dClcblxuICAgIGlmIChXYXlwb2ludC5vZmZzZXRBbGlhc2VzW3RoaXMub3B0aW9ucy5vZmZzZXRdKSB7XG4gICAgICB0aGlzLm9wdGlvbnMub2Zmc2V0ID0gV2F5cG9pbnQub2Zmc2V0QWxpYXNlc1t0aGlzLm9wdGlvbnMub2Zmc2V0XVxuICAgIH1cbiAgICB0aGlzLmdyb3VwLmFkZCh0aGlzKVxuICAgIHRoaXMuY29udGV4dC5hZGQodGhpcylcbiAgICBhbGxXYXlwb2ludHNbdGhpcy5rZXldID0gdGhpc1xuICAgIGtleUNvdW50ZXIgKz0gMVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBXYXlwb2ludC5wcm90b3R5cGUucXVldWVUcmlnZ2VyID0gZnVuY3Rpb24oZGlyZWN0aW9uKSB7XG4gICAgdGhpcy5ncm91cC5xdWV1ZVRyaWdnZXIodGhpcywgZGlyZWN0aW9uKVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBXYXlwb2ludC5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuZW5hYmxlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLmNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgfVxuICB9XG5cbiAgLyogUHVibGljICovXG4gIC8qIGh0dHA6Ly9pbWFrZXdlYnRoaW5ncy5jb20vd2F5cG9pbnRzL2FwaS9kZXN0cm95ICovXG4gIFdheXBvaW50LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb250ZXh0LnJlbW92ZSh0aGlzKVxuICAgIHRoaXMuZ3JvdXAucmVtb3ZlKHRoaXMpXG4gICAgZGVsZXRlIGFsbFdheXBvaW50c1t0aGlzLmtleV1cbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvZGlzYWJsZSAqL1xuICBXYXlwb2ludC5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvZW5hYmxlICovXG4gIFdheXBvaW50LnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNvbnRleHQucmVmcmVzaCgpXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKiBQdWJsaWMgKi9cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL25leHQgKi9cbiAgV2F5cG9pbnQucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ncm91cC5uZXh0KHRoaXMpXG4gIH1cblxuICAvKiBQdWJsaWMgKi9cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL3ByZXZpb3VzICovXG4gIFdheXBvaW50LnByb3RvdHlwZS5wcmV2aW91cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyb3VwLnByZXZpb3VzKHRoaXMpXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIFdheXBvaW50Lmludm9rZUFsbCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIHZhciBhbGxXYXlwb2ludHNBcnJheSA9IFtdXG4gICAgZm9yICh2YXIgd2F5cG9pbnRLZXkgaW4gYWxsV2F5cG9pbnRzKSB7XG4gICAgICBhbGxXYXlwb2ludHNBcnJheS5wdXNoKGFsbFdheXBvaW50c1t3YXlwb2ludEtleV0pXG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBlbmQgPSBhbGxXYXlwb2ludHNBcnJheS5sZW5ndGg7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgYWxsV2F5cG9pbnRzQXJyYXlbaV1bbWV0aG9kXSgpXG4gICAgfVxuICB9XG5cbiAgLyogUHVibGljICovXG4gIC8qIGh0dHA6Ly9pbWFrZXdlYnRoaW5ncy5jb20vd2F5cG9pbnRzL2FwaS9kZXN0cm95LWFsbCAqL1xuICBXYXlwb2ludC5kZXN0cm95QWxsID0gZnVuY3Rpb24oKSB7XG4gICAgV2F5cG9pbnQuaW52b2tlQWxsKCdkZXN0cm95JylcbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvZGlzYWJsZS1hbGwgKi9cbiAgV2F5cG9pbnQuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIFdheXBvaW50Lmludm9rZUFsbCgnZGlzYWJsZScpXG4gIH1cblxuICAvKiBQdWJsaWMgKi9cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL2VuYWJsZS1hbGwgKi9cbiAgV2F5cG9pbnQuZW5hYmxlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgV2F5cG9pbnQuQ29udGV4dC5yZWZyZXNoQWxsKClcbiAgICBmb3IgKHZhciB3YXlwb2ludEtleSBpbiBhbGxXYXlwb2ludHMpIHtcbiAgICAgIGFsbFdheXBvaW50c1t3YXlwb2ludEtleV0uZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvcmVmcmVzaC1hbGwgKi9cbiAgV2F5cG9pbnQucmVmcmVzaEFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIFdheXBvaW50LkNvbnRleHQucmVmcmVzaEFsbCgpXG4gIH1cblxuICAvKiBQdWJsaWMgKi9cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL3ZpZXdwb3J0LWhlaWdodCAqL1xuICBXYXlwb2ludC52aWV3cG9ydEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuICB9XG5cbiAgLyogUHVibGljICovXG4gIC8qIGh0dHA6Ly9pbWFrZXdlYnRoaW5ncy5jb20vd2F5cG9pbnRzL2FwaS92aWV3cG9ydC13aWR0aCAqL1xuICBXYXlwb2ludC52aWV3cG9ydFdpZHRoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxuICB9XG5cbiAgV2F5cG9pbnQuYWRhcHRlcnMgPSBbXVxuXG4gIFdheXBvaW50LmRlZmF1bHRzID0ge1xuICAgIGNvbnRleHQ6IHdpbmRvdyxcbiAgICBjb250aW51b3VzOiB0cnVlLFxuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgZ3JvdXA6ICdkZWZhdWx0JyxcbiAgICBob3Jpem9udGFsOiBmYWxzZSxcbiAgICBvZmZzZXQ6IDBcbiAgfVxuXG4gIFdheXBvaW50Lm9mZnNldEFsaWFzZXMgPSB7XG4gICAgJ2JvdHRvbS1pbi12aWV3JzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmlubmVySGVpZ2h0KCkgLSB0aGlzLmFkYXB0ZXIub3V0ZXJIZWlnaHQoKVxuICAgIH0sXG4gICAgJ3JpZ2h0LWluLXZpZXcnOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuaW5uZXJXaWR0aCgpIC0gdGhpcy5hZGFwdGVyLm91dGVyV2lkdGgoKVxuICAgIH1cbiAgfVxuXG4gIHdpbmRvdy5XYXlwb2ludCA9IFdheXBvaW50XG59KCkpXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCdcblxuICBmdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVTaGltKGNhbGxiYWNrKSB7XG4gICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MClcbiAgfVxuXG4gIHZhciBrZXlDb3VudGVyID0gMFxuICB2YXIgY29udGV4dHMgPSB7fVxuICB2YXIgV2F5cG9pbnQgPSB3aW5kb3cuV2F5cG9pbnRcbiAgdmFyIG9sZFdpbmRvd0xvYWQgPSB3aW5kb3cub25sb2FkXG5cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL2NvbnRleHQgKi9cbiAgZnVuY3Rpb24gQ29udGV4dChlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIHRoaXMuQWRhcHRlciA9IFdheXBvaW50LkFkYXB0ZXJcbiAgICB0aGlzLmFkYXB0ZXIgPSBuZXcgdGhpcy5BZGFwdGVyKGVsZW1lbnQpXG4gICAgdGhpcy5rZXkgPSAnd2F5cG9pbnQtY29udGV4dC0nICsga2V5Q291bnRlclxuICAgIHRoaXMuZGlkU2Nyb2xsID0gZmFsc2VcbiAgICB0aGlzLmRpZFJlc2l6ZSA9IGZhbHNlXG4gICAgdGhpcy5vbGRTY3JvbGwgPSB7XG4gICAgICB4OiB0aGlzLmFkYXB0ZXIuc2Nyb2xsTGVmdCgpLFxuICAgICAgeTogdGhpcy5hZGFwdGVyLnNjcm9sbFRvcCgpXG4gICAgfVxuICAgIHRoaXMud2F5cG9pbnRzID0ge1xuICAgICAgdmVydGljYWw6IHt9LFxuICAgICAgaG9yaXpvbnRhbDoge31cbiAgICB9XG5cbiAgICBlbGVtZW50LndheXBvaW50Q29udGV4dEtleSA9IHRoaXMua2V5XG4gICAgY29udGV4dHNbZWxlbWVudC53YXlwb2ludENvbnRleHRLZXldID0gdGhpc1xuICAgIGtleUNvdW50ZXIgKz0gMVxuICAgIGlmICghV2F5cG9pbnQud2luZG93Q29udGV4dCkge1xuICAgICAgV2F5cG9pbnQud2luZG93Q29udGV4dCA9IHRydWVcbiAgICAgIFdheXBvaW50LndpbmRvd0NvbnRleHQgPSBuZXcgQ29udGV4dCh3aW5kb3cpXG4gICAgfVxuXG4gICAgdGhpcy5jcmVhdGVUaHJvdHRsZWRTY3JvbGxIYW5kbGVyKClcbiAgICB0aGlzLmNyZWF0ZVRocm90dGxlZFJlc2l6ZUhhbmRsZXIoKVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgIHZhciBheGlzID0gd2F5cG9pbnQub3B0aW9ucy5ob3Jpem9udGFsID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJ1xuICAgIHRoaXMud2F5cG9pbnRzW2F4aXNdW3dheXBvaW50LmtleV0gPSB3YXlwb2ludFxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIENvbnRleHQucHJvdG90eXBlLmNoZWNrRW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG9yaXpvbnRhbEVtcHR5ID0gdGhpcy5BZGFwdGVyLmlzRW1wdHlPYmplY3QodGhpcy53YXlwb2ludHMuaG9yaXpvbnRhbClcbiAgICB2YXIgdmVydGljYWxFbXB0eSA9IHRoaXMuQWRhcHRlci5pc0VtcHR5T2JqZWN0KHRoaXMud2F5cG9pbnRzLnZlcnRpY2FsKVxuICAgIHZhciBpc1dpbmRvdyA9IHRoaXMuZWxlbWVudCA9PSB0aGlzLmVsZW1lbnQud2luZG93XG4gICAgaWYgKGhvcml6b250YWxFbXB0eSAmJiB2ZXJ0aWNhbEVtcHR5ICYmICFpc1dpbmRvdykge1xuICAgICAgdGhpcy5hZGFwdGVyLm9mZignLndheXBvaW50cycpXG4gICAgICBkZWxldGUgY29udGV4dHNbdGhpcy5rZXldXG4gICAgfVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5jcmVhdGVUaHJvdHRsZWRSZXNpemVIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgICBmdW5jdGlvbiByZXNpemVIYW5kbGVyKCkge1xuICAgICAgc2VsZi5oYW5kbGVSZXNpemUoKVxuICAgICAgc2VsZi5kaWRSZXNpemUgPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMuYWRhcHRlci5vbigncmVzaXplLndheXBvaW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzZWxmLmRpZFJlc2l6ZSkge1xuICAgICAgICBzZWxmLmRpZFJlc2l6ZSA9IHRydWVcbiAgICAgICAgV2F5cG9pbnQucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlc2l6ZUhhbmRsZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlVGhyb3R0bGVkU2Nyb2xsSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIGZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoKSB7XG4gICAgICBzZWxmLmhhbmRsZVNjcm9sbCgpXG4gICAgICBzZWxmLmRpZFNjcm9sbCA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5hZGFwdGVyLm9uKCdzY3JvbGwud2F5cG9pbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNlbGYuZGlkU2Nyb2xsIHx8IFdheXBvaW50LmlzVG91Y2gpIHtcbiAgICAgICAgc2VsZi5kaWRTY3JvbGwgPSB0cnVlXG4gICAgICAgIFdheXBvaW50LnJlcXVlc3RBbmltYXRpb25GcmFtZShzY3JvbGxIYW5kbGVyKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIENvbnRleHQucHJvdG90eXBlLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIFdheXBvaW50LkNvbnRleHQucmVmcmVzaEFsbCgpXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIENvbnRleHQucHJvdG90eXBlLmhhbmRsZVNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmlnZ2VyZWRHcm91cHMgPSB7fVxuICAgIHZhciBheGVzID0ge1xuICAgICAgaG9yaXpvbnRhbDoge1xuICAgICAgICBuZXdTY3JvbGw6IHRoaXMuYWRhcHRlci5zY3JvbGxMZWZ0KCksXG4gICAgICAgIG9sZFNjcm9sbDogdGhpcy5vbGRTY3JvbGwueCxcbiAgICAgICAgZm9yd2FyZDogJ3JpZ2h0JyxcbiAgICAgICAgYmFja3dhcmQ6ICdsZWZ0J1xuICAgICAgfSxcbiAgICAgIHZlcnRpY2FsOiB7XG4gICAgICAgIG5ld1Njcm9sbDogdGhpcy5hZGFwdGVyLnNjcm9sbFRvcCgpLFxuICAgICAgICBvbGRTY3JvbGw6IHRoaXMub2xkU2Nyb2xsLnksXG4gICAgICAgIGZvcndhcmQ6ICdkb3duJyxcbiAgICAgICAgYmFja3dhcmQ6ICd1cCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBheGlzS2V5IGluIGF4ZXMpIHtcbiAgICAgIHZhciBheGlzID0gYXhlc1theGlzS2V5XVxuICAgICAgdmFyIGlzRm9yd2FyZCA9IGF4aXMubmV3U2Nyb2xsID4gYXhpcy5vbGRTY3JvbGxcbiAgICAgIHZhciBkaXJlY3Rpb24gPSBpc0ZvcndhcmQgPyBheGlzLmZvcndhcmQgOiBheGlzLmJhY2t3YXJkXG5cbiAgICAgIGZvciAodmFyIHdheXBvaW50S2V5IGluIHRoaXMud2F5cG9pbnRzW2F4aXNLZXldKSB7XG4gICAgICAgIHZhciB3YXlwb2ludCA9IHRoaXMud2F5cG9pbnRzW2F4aXNLZXldW3dheXBvaW50S2V5XVxuICAgICAgICBpZiAod2F5cG9pbnQudHJpZ2dlclBvaW50ID09PSBudWxsKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB2YXIgd2FzQmVmb3JlVHJpZ2dlclBvaW50ID0gYXhpcy5vbGRTY3JvbGwgPCB3YXlwb2ludC50cmlnZ2VyUG9pbnRcbiAgICAgICAgdmFyIG5vd0FmdGVyVHJpZ2dlclBvaW50ID0gYXhpcy5uZXdTY3JvbGwgPj0gd2F5cG9pbnQudHJpZ2dlclBvaW50XG4gICAgICAgIHZhciBjcm9zc2VkRm9yd2FyZCA9IHdhc0JlZm9yZVRyaWdnZXJQb2ludCAmJiBub3dBZnRlclRyaWdnZXJQb2ludFxuICAgICAgICB2YXIgY3Jvc3NlZEJhY2t3YXJkID0gIXdhc0JlZm9yZVRyaWdnZXJQb2ludCAmJiAhbm93QWZ0ZXJUcmlnZ2VyUG9pbnRcbiAgICAgICAgaWYgKGNyb3NzZWRGb3J3YXJkIHx8IGNyb3NzZWRCYWNrd2FyZCkge1xuICAgICAgICAgIHdheXBvaW50LnF1ZXVlVHJpZ2dlcihkaXJlY3Rpb24pXG4gICAgICAgICAgdHJpZ2dlcmVkR3JvdXBzW3dheXBvaW50Lmdyb3VwLmlkXSA9IHdheXBvaW50Lmdyb3VwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBncm91cEtleSBpbiB0cmlnZ2VyZWRHcm91cHMpIHtcbiAgICAgIHRyaWdnZXJlZEdyb3Vwc1tncm91cEtleV0uZmx1c2hUcmlnZ2VycygpXG4gICAgfVxuXG4gICAgdGhpcy5vbGRTY3JvbGwgPSB7XG4gICAgICB4OiBheGVzLmhvcml6b250YWwubmV3U2Nyb2xsLFxuICAgICAgeTogYXhlcy52ZXJ0aWNhbC5uZXdTY3JvbGxcbiAgICB9XG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIENvbnRleHQucHJvdG90eXBlLmlubmVySGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cbiAgICBpZiAodGhpcy5lbGVtZW50ID09IHRoaXMuZWxlbWVudC53aW5kb3cpIHtcbiAgICAgIHJldHVybiBXYXlwb2ludC52aWV3cG9ydEhlaWdodCgpXG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cbiAgICByZXR1cm4gdGhpcy5hZGFwdGVyLmlubmVySGVpZ2h0KClcbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgQ29udGV4dC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24od2F5cG9pbnQpIHtcbiAgICBkZWxldGUgdGhpcy53YXlwb2ludHNbd2F5cG9pbnQuYXhpc11bd2F5cG9pbnQua2V5XVxuICAgIHRoaXMuY2hlY2tFbXB0eSgpXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIENvbnRleHQucHJvdG90eXBlLmlubmVyV2lkdGggPSBmdW5jdGlvbigpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuICAgIGlmICh0aGlzLmVsZW1lbnQgPT0gdGhpcy5lbGVtZW50LndpbmRvdykge1xuICAgICAgcmV0dXJuIFdheXBvaW50LnZpZXdwb3J0V2lkdGgoKVxuICAgIH1cbiAgICAvKmVzbGludC1lbmFibGUgZXFlcWVxICovXG4gICAgcmV0dXJuIHRoaXMuYWRhcHRlci5pbm5lcldpZHRoKClcbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvY29udGV4dC1kZXN0cm95ICovXG4gIENvbnRleHQucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWxsV2F5cG9pbnRzID0gW11cbiAgICBmb3IgKHZhciBheGlzIGluIHRoaXMud2F5cG9pbnRzKSB7XG4gICAgICBmb3IgKHZhciB3YXlwb2ludEtleSBpbiB0aGlzLndheXBvaW50c1theGlzXSkge1xuICAgICAgICBhbGxXYXlwb2ludHMucHVzaCh0aGlzLndheXBvaW50c1theGlzXVt3YXlwb2ludEtleV0pXG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBlbmQgPSBhbGxXYXlwb2ludHMubGVuZ3RoOyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIGFsbFdheXBvaW50c1tpXS5kZXN0cm95KClcbiAgICB9XG4gIH1cblxuICAvKiBQdWJsaWMgKi9cbiAgLyogaHR0cDovL2ltYWtld2VidGhpbmdzLmNvbS93YXlwb2ludHMvYXBpL2NvbnRleHQtcmVmcmVzaCAqL1xuICBDb250ZXh0LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cbiAgICB2YXIgaXNXaW5kb3cgPSB0aGlzLmVsZW1lbnQgPT0gdGhpcy5lbGVtZW50LndpbmRvd1xuICAgIC8qZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cbiAgICB2YXIgY29udGV4dE9mZnNldCA9IGlzV2luZG93ID8gdW5kZWZpbmVkIDogdGhpcy5hZGFwdGVyLm9mZnNldCgpXG4gICAgdmFyIHRyaWdnZXJlZEdyb3VwcyA9IHt9XG4gICAgdmFyIGF4ZXNcblxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsKClcbiAgICBheGVzID0ge1xuICAgICAgaG9yaXpvbnRhbDoge1xuICAgICAgICBjb250ZXh0T2Zmc2V0OiBpc1dpbmRvdyA/IDAgOiBjb250ZXh0T2Zmc2V0LmxlZnQsXG4gICAgICAgIGNvbnRleHRTY3JvbGw6IGlzV2luZG93ID8gMCA6IHRoaXMub2xkU2Nyb2xsLngsXG4gICAgICAgIGNvbnRleHREaW1lbnNpb246IHRoaXMuaW5uZXJXaWR0aCgpLFxuICAgICAgICBvbGRTY3JvbGw6IHRoaXMub2xkU2Nyb2xsLngsXG4gICAgICAgIGZvcndhcmQ6ICdyaWdodCcsXG4gICAgICAgIGJhY2t3YXJkOiAnbGVmdCcsXG4gICAgICAgIG9mZnNldFByb3A6ICdsZWZ0J1xuICAgICAgfSxcbiAgICAgIHZlcnRpY2FsOiB7XG4gICAgICAgIGNvbnRleHRPZmZzZXQ6IGlzV2luZG93ID8gMCA6IGNvbnRleHRPZmZzZXQudG9wLFxuICAgICAgICBjb250ZXh0U2Nyb2xsOiBpc1dpbmRvdyA/IDAgOiB0aGlzLm9sZFNjcm9sbC55LFxuICAgICAgICBjb250ZXh0RGltZW5zaW9uOiB0aGlzLmlubmVySGVpZ2h0KCksXG4gICAgICAgIG9sZFNjcm9sbDogdGhpcy5vbGRTY3JvbGwueSxcbiAgICAgICAgZm9yd2FyZDogJ2Rvd24nLFxuICAgICAgICBiYWNrd2FyZDogJ3VwJyxcbiAgICAgICAgb2Zmc2V0UHJvcDogJ3RvcCdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBheGlzS2V5IGluIGF4ZXMpIHtcbiAgICAgIHZhciBheGlzID0gYXhlc1theGlzS2V5XVxuICAgICAgZm9yICh2YXIgd2F5cG9pbnRLZXkgaW4gdGhpcy53YXlwb2ludHNbYXhpc0tleV0pIHtcbiAgICAgICAgdmFyIHdheXBvaW50ID0gdGhpcy53YXlwb2ludHNbYXhpc0tleV1bd2F5cG9pbnRLZXldXG4gICAgICAgIHZhciBhZGp1c3RtZW50ID0gd2F5cG9pbnQub3B0aW9ucy5vZmZzZXRcbiAgICAgICAgdmFyIG9sZFRyaWdnZXJQb2ludCA9IHdheXBvaW50LnRyaWdnZXJQb2ludFxuICAgICAgICB2YXIgZWxlbWVudE9mZnNldCA9IDBcbiAgICAgICAgdmFyIGZyZXNoV2F5cG9pbnQgPSBvbGRUcmlnZ2VyUG9pbnQgPT0gbnVsbFxuICAgICAgICB2YXIgY29udGV4dE1vZGlmaWVyLCB3YXNCZWZvcmVTY3JvbGwsIG5vd0FmdGVyU2Nyb2xsXG4gICAgICAgIHZhciB0cmlnZ2VyZWRCYWNrd2FyZCwgdHJpZ2dlcmVkRm9yd2FyZFxuXG4gICAgICAgIGlmICh3YXlwb2ludC5lbGVtZW50ICE9PSB3YXlwb2ludC5lbGVtZW50LndpbmRvdykge1xuICAgICAgICAgIGVsZW1lbnRPZmZzZXQgPSB3YXlwb2ludC5hZGFwdGVyLm9mZnNldCgpW2F4aXMub2Zmc2V0UHJvcF1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYWRqdXN0bWVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGFkanVzdG1lbnQgPSBhZGp1c3RtZW50LmFwcGx5KHdheXBvaW50KVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhZGp1c3RtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGFkanVzdG1lbnQgPSBwYXJzZUZsb2F0KGFkanVzdG1lbnQpXG4gICAgICAgICAgaWYgKHdheXBvaW50Lm9wdGlvbnMub2Zmc2V0LmluZGV4T2YoJyUnKSA+IC0gMSkge1xuICAgICAgICAgICAgYWRqdXN0bWVudCA9IE1hdGguY2VpbChheGlzLmNvbnRleHREaW1lbnNpb24gKiBhZGp1c3RtZW50IC8gMTAwKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHRNb2RpZmllciA9IGF4aXMuY29udGV4dFNjcm9sbCAtIGF4aXMuY29udGV4dE9mZnNldFxuICAgICAgICB3YXlwb2ludC50cmlnZ2VyUG9pbnQgPSBNYXRoLmZsb29yKGVsZW1lbnRPZmZzZXQgKyBjb250ZXh0TW9kaWZpZXIgLSBhZGp1c3RtZW50KVxuICAgICAgICB3YXNCZWZvcmVTY3JvbGwgPSBvbGRUcmlnZ2VyUG9pbnQgPCBheGlzLm9sZFNjcm9sbFxuICAgICAgICBub3dBZnRlclNjcm9sbCA9IHdheXBvaW50LnRyaWdnZXJQb2ludCA+PSBheGlzLm9sZFNjcm9sbFxuICAgICAgICB0cmlnZ2VyZWRCYWNrd2FyZCA9IHdhc0JlZm9yZVNjcm9sbCAmJiBub3dBZnRlclNjcm9sbFxuICAgICAgICB0cmlnZ2VyZWRGb3J3YXJkID0gIXdhc0JlZm9yZVNjcm9sbCAmJiAhbm93QWZ0ZXJTY3JvbGxcblxuICAgICAgICBpZiAoIWZyZXNoV2F5cG9pbnQgJiYgdHJpZ2dlcmVkQmFja3dhcmQpIHtcbiAgICAgICAgICB3YXlwb2ludC5xdWV1ZVRyaWdnZXIoYXhpcy5iYWNrd2FyZClcbiAgICAgICAgICB0cmlnZ2VyZWRHcm91cHNbd2F5cG9pbnQuZ3JvdXAuaWRdID0gd2F5cG9pbnQuZ3JvdXBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghZnJlc2hXYXlwb2ludCAmJiB0cmlnZ2VyZWRGb3J3YXJkKSB7XG4gICAgICAgICAgd2F5cG9pbnQucXVldWVUcmlnZ2VyKGF4aXMuZm9yd2FyZClcbiAgICAgICAgICB0cmlnZ2VyZWRHcm91cHNbd2F5cG9pbnQuZ3JvdXAuaWRdID0gd2F5cG9pbnQuZ3JvdXBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmcmVzaFdheXBvaW50ICYmIGF4aXMub2xkU2Nyb2xsID49IHdheXBvaW50LnRyaWdnZXJQb2ludCkge1xuICAgICAgICAgIHdheXBvaW50LnF1ZXVlVHJpZ2dlcihheGlzLmZvcndhcmQpXG4gICAgICAgICAgdHJpZ2dlcmVkR3JvdXBzW3dheXBvaW50Lmdyb3VwLmlkXSA9IHdheXBvaW50Lmdyb3VwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBXYXlwb2ludC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBncm91cEtleSBpbiB0cmlnZ2VyZWRHcm91cHMpIHtcbiAgICAgICAgdHJpZ2dlcmVkR3JvdXBzW2dyb3VwS2V5XS5mbHVzaFRyaWdnZXJzKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgQ29udGV4dC5maW5kT3JDcmVhdGVCeUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIENvbnRleHQuZmluZEJ5RWxlbWVudChlbGVtZW50KSB8fCBuZXcgQ29udGV4dChlbGVtZW50KVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBDb250ZXh0LnJlZnJlc2hBbGwgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBjb250ZXh0SWQgaW4gY29udGV4dHMpIHtcbiAgICAgIGNvbnRleHRzW2NvbnRleHRJZF0ucmVmcmVzaCgpXG4gICAgfVxuICB9XG5cbiAgLyogUHVibGljICovXG4gIC8qIGh0dHA6Ly9pbWFrZXdlYnRoaW5ncy5jb20vd2F5cG9pbnRzL2FwaS9jb250ZXh0LWZpbmQtYnktZWxlbWVudCAqL1xuICBDb250ZXh0LmZpbmRCeUVsZW1lbnQgPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgcmV0dXJuIGNvbnRleHRzW2VsZW1lbnQud2F5cG9pbnRDb250ZXh0S2V5XVxuICB9XG5cbiAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChvbGRXaW5kb3dMb2FkKSB7XG4gICAgICBvbGRXaW5kb3dMb2FkKClcbiAgICB9XG4gICAgQ29udGV4dC5yZWZyZXNoQWxsKClcbiAgfVxuXG5cbiAgV2F5cG9pbnQucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgcmVxdWVzdEZuID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lU2hpbVxuICAgIHJlcXVlc3RGbi5jYWxsKHdpbmRvdywgY2FsbGJhY2spXG4gIH1cbiAgV2F5cG9pbnQuQ29udGV4dCA9IENvbnRleHRcbn0oKSlcbjsoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0J1xuXG4gIGZ1bmN0aW9uIGJ5VHJpZ2dlclBvaW50KGEsIGIpIHtcbiAgICByZXR1cm4gYS50cmlnZ2VyUG9pbnQgLSBiLnRyaWdnZXJQb2ludFxuICB9XG5cbiAgZnVuY3Rpb24gYnlSZXZlcnNlVHJpZ2dlclBvaW50KGEsIGIpIHtcbiAgICByZXR1cm4gYi50cmlnZ2VyUG9pbnQgLSBhLnRyaWdnZXJQb2ludFxuICB9XG5cbiAgdmFyIGdyb3VwcyA9IHtcbiAgICB2ZXJ0aWNhbDoge30sXG4gICAgaG9yaXpvbnRhbDoge31cbiAgfVxuICB2YXIgV2F5cG9pbnQgPSB3aW5kb3cuV2F5cG9pbnRcblxuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvZ3JvdXAgKi9cbiAgZnVuY3Rpb24gR3JvdXAob3B0aW9ucykge1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZVxuICAgIHRoaXMuYXhpcyA9IG9wdGlvbnMuYXhpc1xuICAgIHRoaXMuaWQgPSB0aGlzLm5hbWUgKyAnLScgKyB0aGlzLmF4aXNcbiAgICB0aGlzLndheXBvaW50cyA9IFtdXG4gICAgdGhpcy5jbGVhclRyaWdnZXJRdWV1ZXMoKVxuICAgIGdyb3Vwc1t0aGlzLmF4aXNdW3RoaXMubmFtZV0gPSB0aGlzXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIEdyb3VwLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgIHRoaXMud2F5cG9pbnRzLnB1c2god2F5cG9pbnQpXG4gIH1cblxuICAvKiBQcml2YXRlICovXG4gIEdyb3VwLnByb3RvdHlwZS5jbGVhclRyaWdnZXJRdWV1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyaWdnZXJRdWV1ZXMgPSB7XG4gICAgICB1cDogW10sXG4gICAgICBkb3duOiBbXSxcbiAgICAgIGxlZnQ6IFtdLFxuICAgICAgcmlnaHQ6IFtdXG4gICAgfVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBHcm91cC5wcm90b3R5cGUuZmx1c2hUcmlnZ2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGRpcmVjdGlvbiBpbiB0aGlzLnRyaWdnZXJRdWV1ZXMpIHtcbiAgICAgIHZhciB3YXlwb2ludHMgPSB0aGlzLnRyaWdnZXJRdWV1ZXNbZGlyZWN0aW9uXVxuICAgICAgdmFyIHJldmVyc2UgPSBkaXJlY3Rpb24gPT09ICd1cCcgfHwgZGlyZWN0aW9uID09PSAnbGVmdCdcbiAgICAgIHdheXBvaW50cy5zb3J0KHJldmVyc2UgPyBieVJldmVyc2VUcmlnZ2VyUG9pbnQgOiBieVRyaWdnZXJQb2ludClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlbmQgPSB3YXlwb2ludHMubGVuZ3RoOyBpIDwgZW5kOyBpICs9IDEpIHtcbiAgICAgICAgdmFyIHdheXBvaW50ID0gd2F5cG9pbnRzW2ldXG4gICAgICAgIGlmICh3YXlwb2ludC5vcHRpb25zLmNvbnRpbnVvdXMgfHwgaSA9PT0gd2F5cG9pbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICB3YXlwb2ludC50cmlnZ2VyKFtkaXJlY3Rpb25dKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY2xlYXJUcmlnZ2VyUXVldWVzKClcbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgR3JvdXAucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbih3YXlwb2ludCkge1xuICAgIHRoaXMud2F5cG9pbnRzLnNvcnQoYnlUcmlnZ2VyUG9pbnQpXG4gICAgdmFyIGluZGV4ID0gV2F5cG9pbnQuQWRhcHRlci5pbkFycmF5KHdheXBvaW50LCB0aGlzLndheXBvaW50cylcbiAgICB2YXIgaXNMYXN0ID0gaW5kZXggPT09IHRoaXMud2F5cG9pbnRzLmxlbmd0aCAtIDFcbiAgICByZXR1cm4gaXNMYXN0ID8gbnVsbCA6IHRoaXMud2F5cG9pbnRzW2luZGV4ICsgMV1cbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgR3JvdXAucHJvdG90eXBlLnByZXZpb3VzID0gZnVuY3Rpb24od2F5cG9pbnQpIHtcbiAgICB0aGlzLndheXBvaW50cy5zb3J0KGJ5VHJpZ2dlclBvaW50KVxuICAgIHZhciBpbmRleCA9IFdheXBvaW50LkFkYXB0ZXIuaW5BcnJheSh3YXlwb2ludCwgdGhpcy53YXlwb2ludHMpXG4gICAgcmV0dXJuIGluZGV4ID8gdGhpcy53YXlwb2ludHNbaW5kZXggLSAxXSA6IG51bGxcbiAgfVxuXG4gIC8qIFByaXZhdGUgKi9cbiAgR3JvdXAucHJvdG90eXBlLnF1ZXVlVHJpZ2dlciA9IGZ1bmN0aW9uKHdheXBvaW50LCBkaXJlY3Rpb24pIHtcbiAgICB0aGlzLnRyaWdnZXJRdWV1ZXNbZGlyZWN0aW9uXS5wdXNoKHdheXBvaW50KVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBHcm91cC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24od2F5cG9pbnQpIHtcbiAgICB2YXIgaW5kZXggPSBXYXlwb2ludC5BZGFwdGVyLmluQXJyYXkod2F5cG9pbnQsIHRoaXMud2F5cG9pbnRzKVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLndheXBvaW50cy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgLyogUHVibGljICovXG4gIC8qIGh0dHA6Ly9pbWFrZXdlYnRoaW5ncy5jb20vd2F5cG9pbnRzL2FwaS9maXJzdCAqL1xuICBHcm91cC5wcm90b3R5cGUuZmlyc3QgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy53YXlwb2ludHNbMF1cbiAgfVxuXG4gIC8qIFB1YmxpYyAqL1xuICAvKiBodHRwOi8vaW1ha2V3ZWJ0aGluZ3MuY29tL3dheXBvaW50cy9hcGkvbGFzdCAqL1xuICBHcm91cC5wcm90b3R5cGUubGFzdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLndheXBvaW50c1t0aGlzLndheXBvaW50cy5sZW5ndGggLSAxXVxuICB9XG5cbiAgLyogUHJpdmF0ZSAqL1xuICBHcm91cC5maW5kT3JDcmVhdGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgcmV0dXJuIGdyb3Vwc1tvcHRpb25zLmF4aXNdW29wdGlvbnMubmFtZV0gfHwgbmV3IEdyb3VwKG9wdGlvbnMpXG4gIH1cblxuICBXYXlwb2ludC5Hcm91cCA9IEdyb3VwXG59KCkpXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCdcblxuICB2YXIgJCA9IHdpbmRvdy5qUXVlcnlcbiAgdmFyIFdheXBvaW50ID0gd2luZG93LldheXBvaW50XG5cbiAgZnVuY3Rpb24gSlF1ZXJ5QWRhcHRlcihlbGVtZW50KSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICQoZWxlbWVudClcbiAgfVxuXG4gICQuZWFjaChbXG4gICAgJ2lubmVySGVpZ2h0JyxcbiAgICAnaW5uZXJXaWR0aCcsXG4gICAgJ29mZicsXG4gICAgJ29mZnNldCcsXG4gICAgJ29uJyxcbiAgICAnb3V0ZXJIZWlnaHQnLFxuICAgICdvdXRlcldpZHRoJyxcbiAgICAnc2Nyb2xsTGVmdCcsXG4gICAgJ3Njcm9sbFRvcCdcbiAgXSwgZnVuY3Rpb24oaSwgbWV0aG9kKSB7XG4gICAgSlF1ZXJ5QWRhcHRlci5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgICByZXR1cm4gdGhpcy4kZWxlbWVudFttZXRob2RdLmFwcGx5KHRoaXMuJGVsZW1lbnQsIGFyZ3MpXG4gICAgfVxuICB9KVxuXG4gICQuZWFjaChbXG4gICAgJ2V4dGVuZCcsXG4gICAgJ2luQXJyYXknLFxuICAgICdpc0VtcHR5T2JqZWN0J1xuICBdLCBmdW5jdGlvbihpLCBtZXRob2QpIHtcbiAgICBKUXVlcnlBZGFwdGVyW21ldGhvZF0gPSAkW21ldGhvZF1cbiAgfSlcblxuICBXYXlwb2ludC5hZGFwdGVycy5wdXNoKHtcbiAgICBuYW1lOiAnanF1ZXJ5JyxcbiAgICBBZGFwdGVyOiBKUXVlcnlBZGFwdGVyXG4gIH0pXG4gIFdheXBvaW50LkFkYXB0ZXIgPSBKUXVlcnlBZGFwdGVyXG59KCkpXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCdcblxuICB2YXIgV2F5cG9pbnQgPSB3aW5kb3cuV2F5cG9pbnRcblxuICBmdW5jdGlvbiBjcmVhdGVFeHRlbnNpb24oZnJhbWV3b3JrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHdheXBvaW50cyA9IFtdXG4gICAgICB2YXIgb3ZlcnJpZGVzID0gYXJndW1lbnRzWzBdXG5cbiAgICAgIGlmIChmcmFtZXdvcmsuaXNGdW5jdGlvbihhcmd1bWVudHNbMF0pKSB7XG4gICAgICAgIG92ZXJyaWRlcyA9IGZyYW1ld29yay5leHRlbmQoe30sIGFyZ3VtZW50c1sxXSlcbiAgICAgICAgb3ZlcnJpZGVzLmhhbmRsZXIgPSBhcmd1bWVudHNbMF1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IGZyYW1ld29yay5leHRlbmQoe30sIG92ZXJyaWRlcywge1xuICAgICAgICAgIGVsZW1lbnQ6IHRoaXNcbiAgICAgICAgfSlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgb3B0aW9ucy5jb250ZXh0ID0gZnJhbWV3b3JrKHRoaXMpLmNsb3Nlc3Qob3B0aW9ucy5jb250ZXh0KVswXVxuICAgICAgICB9XG4gICAgICAgIHdheXBvaW50cy5wdXNoKG5ldyBXYXlwb2ludChvcHRpb25zKSlcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiB3YXlwb2ludHNcbiAgICB9XG4gIH1cblxuICBpZiAod2luZG93LmpRdWVyeSkge1xuICAgIHdpbmRvdy5qUXVlcnkuZm4ud2F5cG9pbnQgPSBjcmVhdGVFeHRlbnNpb24od2luZG93LmpRdWVyeSlcbiAgfVxuICBpZiAod2luZG93LlplcHRvKSB7XG4gICAgd2luZG93LlplcHRvLmZuLndheXBvaW50ID0gY3JlYXRlRXh0ZW5zaW9uKHdpbmRvdy5aZXB0bylcbiAgfVxufSgpKVxuO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAvaG9tZS9tYXJrL1NpdGVzL3NvbHZldGhlY3ViZS9ub2RlX21vZHVsZXMvd2F5cG9pbnRzL2xpYi9qcXVlcnkud2F5cG9pbnRzLmpzIiwiY29uc3QgbW92ZXMgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSAge1xuXG5cdC8vIE5vdGF0aW9uIHBhZ2UgYnV0dG9uc1xuXHQkKCcubm90YXRpb24tYnV0dG9ucyBhJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0Y29uc3QgJHRoaXMgICAgID0gJCh0aGlzKTtcblx0XHRjb25zdCByb29mcGlnSWQgPSAkdGhpcy5wYXJlbnQoKS5zaWJsaW5ncygnLnJvb2ZwaWcnKS5kYXRhKCdjdWJlLWlkJykgLSAxO1xuXG5cdFx0Ly8gVXNlIGRhdGEtbW92ZSBpZiBhdmFpbGFibGVcblx0XHRjb25zdCBtb3ZlID0gJHRoaXMuZGF0YSgnbW92ZScpID8gJHRoaXMuZGF0YSgnbW92ZScpIDogJHRoaXMudGV4dCgpO1xuXG5cdFx0Ly8gUmVjb3JkIG1vdmVzIGZvciByZXNldCBidXR0b25cblx0XHRpZighbW92ZXNbcm9vZnBpZ0lkXSkge1xuXHRcdFx0bW92ZXNbcm9vZnBpZ0lkXSA9IFtdO1xuXHRcdH1cblxuXHRcdG1vdmVzW3Jvb2ZwaWdJZF0ucHVzaChtb3ZlKTtcblxuXHRcdGNvbnN0IGN1YmVNb3ZlID0gbmV3IENvbXBvc2l0ZU1vdmUobW92ZSwgcm9vZnBpZ3Nbcm9vZnBpZ0lkXS53b3JsZDNkLCA0MDApLnNob3dfZG8oKTtcblx0XHRyb29mcGlnc1tyb29mcGlnSWRdLmFkZF9jaGFuZ2VyKCdwaWVjZXMnLCBjdWJlTW92ZSk7XG5cdH0pO1xuXG5cdC8vIFJlc2V0IGJ1dHRvblxuXHQkKCcubm90YXRpb24tYnV0dG9ucyBidXR0b24nKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRjb25zdCByb29mcGlnSWQgPSAkKHRoaXMpLnNpYmxpbmdzKCcucm9vZnBpZycpLmRhdGEoJ2N1YmUtaWQnKSAtIDE7XG5cblx0XHQvLyBGaXJzdCBjaGVjayBpZiBhbnkgbW92ZXMgaGF2ZSBiZWVuIHBlcmZvcm1lZCBvbiB0aGUgY3ViZVxuXHRcdGlmKG1vdmVzW3Jvb2ZwaWdJZF0gJiYgbW92ZXNbcm9vZnBpZ0lkXS5sZW5ndGggPiAwKSB7XG5cdFx0XHQvLyBSZXZlcnNlIGVhY2ggcmVjb3JkZWQgbW92ZSB0byByZXNldCBiYWNrIHRvIGRlZmF1bHQgc3RhdGVcblx0XHRcdG1vdmVzW3Jvb2ZwaWdJZF0ucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24obW92ZSkge1xuXHRcdFx0XHRjb25zdCBjdWJlTW92ZSA9IG5ldyBDb21wb3NpdGVNb3ZlKG1vdmUsIHJvb2ZwaWdzW3Jvb2ZwaWdJZF0ud29ybGQzZCwgNDAwKS51bmRvKCk7XG5cdFx0XHRcdHJvb2ZwaWdzW3Jvb2ZwaWdJZF0uYWRkX2NoYW5nZXIoJ3BpZWNlcycsIGN1YmVNb3ZlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBSZXNldCByZWNvcmRlZCBtb3Zlc1xuXHRcdFx0bW92ZXNbcm9vZnBpZ0lkXSA9IFtdO1xuXHRcdH1cblx0fSk7XG5cbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbW9kdWxlcy9ub3RhdGlvbi5qcyIsImltcG9ydCB3aGF0SW5wdXQgZnJvbSAnd2hhdC1pbnB1dCc7XG5cbi8vIFBsYWNlcyB0aGUgcG9wdXAgYWJvdmUgdGhlIGdpdmVuIHNwYW4sIGVuc3VyaW5nIGl0IHN0YXlzIHdpdGhpbiBkb2N1bWVudCBib3VuZHNcbmZ1bmN0aW9uIHBsYWNlUG9wdXAoc3Bhbikge1xuXHRpZigkKCdib2R5JykuaGFzQ2xhc3MoJ3Nob3ctcG9wdXAnKSkge1xuXHRcdGNvbnN0ICRwb3B1cCA9ICQoJyNwb3B1cCcpO1xuXG5cdFx0Ly8gU2V0IHBvcHVwIHRpdGxlIHRvIGhvdmVyZWQgdGV4dFxuXHRcdCQoJyNwb3B1cCBzcGFuJykudGV4dChzcGFuLnRleHQoKSk7XG5cblx0XHQvLyBTZXQgaW1hZ2UgZnJvbSBkYXRhLXBvcHVwXG5cdFx0JCgnI3BvcHVwIGltZycpLmF0dHIoJ3NyYycsICdpbWcvY3ViZXMvJyArIHNwYW4uZGF0YSgncG9wdXAnKSArICcucG5nJyk7XG5cblx0XHQvLyBMZWZ0IGFsaWduIHBvcHVwIGFib3ZlIHRleHQgc28gaXQgZG9lc24ndCBvdmVybGFwIGFsZ29yaXRobSBpbWFnZXNcblx0XHRsZXQgbGVmdCA9IHNwYW4ub2Zmc2V0KCkubGVmdDtcblxuXHRcdC8vIEVuc3VyZSBwb3B1cCBkb2Vzbid0IGdvIG92ZXIgZWRnZSBvZiB3aW5kb3dcblx0XHRpZihsZWZ0ICsgJHBvcHVwLm91dGVyV2lkdGgoKSArIDIgPiAkKHdpbmRvdykud2lkdGgoKSkge1xuXHRcdFx0bGVmdCA9ICQod2luZG93KS53aWR0aCgpIC0gJHBvcHVwLm91dGVyV2lkdGgoKSAtIDI7XG5cdFx0fVxuXG5cdFx0Ly8gU2hvdyB0aGUgcG9wdXAgYW5kIHNldCBwb3NpdGlvblxuXHRcdCRwb3B1cC5hZGRDbGFzcygnc2hvdycpXG5cdFx0XHQuY3NzKCdsZWZ0JywgbGVmdClcblx0XHRcdC5jc3MoJ3RvcCcsIHNwYW4ub2Zmc2V0KCkudG9wICsgc3Bhbi5vdXRlckhlaWdodCgpICsgNSk7XG5cdH1cbn1cblxuLy8gTW92ZXMgdGhlIHBvcHVwIHRvIHRoZSBnaXZlbiBhbGdvcml0aG0gc3RlcCBhbmQgaGlnaGxpZ2h0c1xuZnVuY3Rpb24gYWxnb3JpdGhtU3RlcChzcGFuKSB7XG5cdGlmKHNwYW4ucHJvcCgndGFnTmFtZScpID09ICdTUEFOJykge1xuXHRcdCQoJy5hbGcgc3Bhbi5oaWdobGlnaHRlZCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHRlZCcpO1xuXHRcdHNwYW4uYWRkQ2xhc3MoJ2hpZ2hsaWdodGVkJyk7XG5cdFx0cGxhY2VQb3B1cChzcGFuKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHQvLyBBbGdvcml0aG0gaGVscGVyIHN3aXRjaFxuXHQkKCcjcG9wdXBTd2l0Y2gnKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLmNoZWNrZWQpIHtcblx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnc2hvdy1wb3B1cCcpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc2hvdy1wb3B1cCcpO1xuXHRcdH1cblx0fSk7XG5cblx0bGV0ICRob3ZlcmVkQWxnO1xuXHRsZXQgcG9wdXBUaW1lb3V0O1xuXG5cdC8vIEFsZ29yaXRobSBoZWxwZXIgcG9wdXBcblx0JCgnLmFsZyAuc3RlcHMgc3BhbicpLmhvdmVyKGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdC8vIFNhdmUgcmVmZXJlbmNlIHRvIGhvdmVyZWQgc3BhbiBmb3Iga2V5YmluZGluZ3Ncblx0XHQkaG92ZXJlZEFsZyA9ICR0aGlzO1xuXG5cdFx0Y2xlYXJUaW1lb3V0KHBvcHVwVGltZW91dCk7XG5cblx0XHQvLyBQbGFjZSBwb3B1cCBvbmx5IGlmIG5vIGFsZ3MgYXJlIGhpZ2hsaWdodGVkLCB0byBzdG9wIHBvcHVwIGZyb20gbW92aW5nIG9uIG1vdXNlb3V0XG5cdFx0aWYoJCgnLmFsZyBzcGFuLmhpZ2hsaWdodGVkJykubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRwbGFjZVBvcHVwKCR0aGlzKTtcblx0XHR9XG5cdH0pXG5cdC5tb3VzZW91dChmdW5jdGlvbigpIHtcblx0XHQvLyBIaWRlIHBvcHVwIGFuZCByZW1vdmUgaW1hZ2Ugb24gbW91c2VvdXRcblx0XHRwb3B1cFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdGlmKCEkKCcjcG9wdXAnKS5oYXNDbGFzcygnaG92ZXJlZCcpKSB7XG5cdFx0XHRcdCQoJyNwb3B1cCcpLnJlbW92ZUNsYXNzKCdzaG93Jyk7XG5cdFx0XHRcdCQoJyNwb3B1cCBpbWcnKS5hdHRyKCdzcmMnLCAnJyk7XG5cdFx0XHRcdCQoJy5hbGcgc3Bhbi5oaWdobGlnaHRlZCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHRlZCcpO1xuXHRcdFx0fVxuXHRcdH0sIDMwMCk7XG5cdH0pO1xuXG5cdC8vIExlZnQvcmlnaHQga2V5YmluZGluZ3MgZm9yIG1vdmluZyBwb3B1cCB0aHJvdWdoIGFsZ29yaXRobVxuXHQkKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XG5cdFx0aWYoJCgnI3BvcHVwJykuaGFzQ2xhc3MoJ3Nob3cnKSkge1xuXHRcdFx0bGV0ICRzcGFuO1xuXG5cdFx0XHQvLyBMZWZ0XG5cdFx0XHRpZihlLndoaWNoID09IDM3KSB7XG5cdFx0XHRcdCRzcGFuID0gJGhvdmVyZWRBbGcucHJldigpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gUmlnaHRcblx0XHRcdGVsc2UgaWYoZS53aGljaCA9PSAzOSkge1xuXHRcdFx0XHQkc3BhbiA9ICRob3ZlcmVkQWxnLm5leHQoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoJHNwYW4ubGVuZ3RoKSB7XG5cdFx0XHRcdCRob3ZlcmVkQWxnID0gJHNwYW47XG5cdFx0XHRcdGFsZ29yaXRobVN0ZXAoJHNwYW4pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gSWYgaW5wdXQgaXMgdG91Y2gsIGNsaWNraW5nIG9uIHBvcHVwIG1vdmVzIHRocm91Z2ggYWxnb3JpdGhtXG5cdCQoJyNwb3B1cCcpLmhvdmVyKGZ1bmN0aW9uKCkge1xuXHRcdGlmKHdoYXRJbnB1dC5hc2soKSA9PT0gJ3RvdWNoJykge1xuXHRcdFx0JCgnI3BvcHVwJykuYWRkQ2xhc3MoJ2hvdmVyZWQnKTtcblx0XHR9XG5cdH0pXG5cdC5jbGljayhmdW5jdGlvbigpIHtcblx0XHRpZih3aGF0SW5wdXQuYXNrKCkgPT09ICd0b3VjaCcpIHtcblx0XHRcdGNvbnN0ICRuZXh0ID0gJGhvdmVyZWRBbGcubmV4dCgpO1xuXG5cdFx0XHRpZigkbmV4dC5sZW5ndGgpIHtcblx0XHRcdFx0JGhvdmVyZWRBbGcgPSAkbmV4dDtcblx0XHRcdFx0YWxnb3JpdGhtU3RlcCgkbmV4dCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXHQubW91c2VvdXQoZnVuY3Rpb24oKSB7XG5cdFx0JCgnI3BvcHVwJykucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblx0XHQkKCcjcG9wdXAgaW1nJykuYXR0cignc3JjJywgJycpO1xuXHRcdCQoJy5hbGcgc3Bhbi5oaWdobGlnaHRlZCcpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHRlZCcpO1xuXHR9KTtcblxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tb2R1bGVzL3BvcHVwLmpzIiwiLyoqXG4gKiB3aGF0LWlucHV0IC0gQSBnbG9iYWwgdXRpbGl0eSBmb3IgdHJhY2tpbmcgdGhlIGN1cnJlbnQgaW5wdXQgbWV0aG9kIChtb3VzZSwga2V5Ym9hcmQgb3IgdG91Y2gpLlxuICogQHZlcnNpb24gdjQuMy4xXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vdGVuMXNldmVuL3doYXQtaW5wdXRcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4oZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIndoYXRJbnB1dFwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ3aGF0SW5wdXRcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wid2hhdElucHV0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKGZ1bmN0aW9uKG1vZHVsZXMpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbi8qKioqKiovIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4vKioqKioqLyBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4vKioqKioqLyBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4vKioqKioqLyBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuLyoqKioqKi8gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4vKioqKioqLyBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuLyoqKioqKi8gXHRcdFx0ZXhwb3J0czoge30sXG4vKioqKioqLyBcdFx0XHRpZDogbW9kdWxlSWQsXG4vKioqKioqLyBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4vKioqKioqLyBcdFx0fTtcblxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4vKioqKioqLyBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuLyoqKioqKi8gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4vKioqKioqLyBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbi8qKioqKiovIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4vKioqKioqLyBcdH1cblxuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4vKioqKioqLyBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcbi8qKioqKiovIH0pXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gKFtcbi8qIDAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0ICAvKlxuXHQgICAqIHZhcmlhYmxlc1xuXHQgICAqL1xuXG5cdCAgLy8gbGFzdCB1c2VkIGlucHV0IHR5cGVcblx0ICB2YXIgY3VycmVudElucHV0ID0gJ2luaXRpYWwnO1xuXG5cdCAgLy8gbGFzdCB1c2VkIGlucHV0IGludGVudFxuXHQgIHZhciBjdXJyZW50SW50ZW50ID0gbnVsbDtcblxuXHQgIC8vIGNhY2hlIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuXHQgIHZhciBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0ICAvLyBmb3JtIGlucHV0IHR5cGVzXG5cdCAgdmFyIGZvcm1JbnB1dHMgPSBbJ2lucHV0JywgJ3NlbGVjdCcsICd0ZXh0YXJlYSddO1xuXG5cdCAgdmFyIGZ1bmN0aW9uTGlzdCA9IFtdO1xuXG5cdCAgLy8gbGlzdCBvZiBtb2RpZmllciBrZXlzIGNvbW1vbmx5IHVzZWQgd2l0aCB0aGUgbW91c2UgYW5kXG5cdCAgLy8gY2FuIGJlIHNhZmVseSBpZ25vcmVkIHRvIHByZXZlbnQgZmFsc2Uga2V5Ym9hcmQgZGV0ZWN0aW9uXG5cdCAgdmFyIGlnbm9yZU1hcCA9IFsxNiwgLy8gc2hpZnRcblx0ICAxNywgLy8gY29udHJvbFxuXHQgIDE4LCAvLyBhbHRcblx0ICA5MSwgLy8gV2luZG93cyBrZXkgLyBsZWZ0IEFwcGxlIGNtZFxuXHQgIDkzIC8vIFdpbmRvd3MgbWVudSAvIHJpZ2h0IEFwcGxlIGNtZFxuXHQgIF07XG5cblx0ICAvLyBsaXN0IG9mIGtleXMgZm9yIHdoaWNoIHdlIGNoYW5nZSBpbnRlbnQgZXZlbiBmb3IgZm9ybSBpbnB1dHNcblx0ICB2YXIgY2hhbmdlSW50ZW50TWFwID0gWzkgLy8gdGFiXG5cdCAgXTtcblxuXHQgIC8vIG1hcHBpbmcgb2YgZXZlbnRzIHRvIGlucHV0IHR5cGVzXG5cdCAgdmFyIGlucHV0TWFwID0ge1xuXHQgICAga2V5ZG93bjogJ2tleWJvYXJkJyxcblx0ICAgIGtleXVwOiAna2V5Ym9hcmQnLFxuXHQgICAgbW91c2Vkb3duOiAnbW91c2UnLFxuXHQgICAgbW91c2Vtb3ZlOiAnbW91c2UnLFxuXHQgICAgTVNQb2ludGVyRG93bjogJ3BvaW50ZXInLFxuXHQgICAgTVNQb2ludGVyTW92ZTogJ3BvaW50ZXInLFxuXHQgICAgcG9pbnRlcmRvd246ICdwb2ludGVyJyxcblx0ICAgIHBvaW50ZXJtb3ZlOiAncG9pbnRlcicsXG5cdCAgICB0b3VjaHN0YXJ0OiAndG91Y2gnXG5cdCAgfTtcblxuXHQgIC8vIGFycmF5IG9mIGFsbCB1c2VkIGlucHV0IHR5cGVzXG5cdCAgdmFyIGlucHV0VHlwZXMgPSBbXTtcblxuXHQgIC8vIGJvb2xlYW46IHRydWUgaWYgdG91Y2ggYnVmZmVyIGlzIGFjdGl2ZVxuXHQgIHZhciBpc0J1ZmZlcmluZyA9IGZhbHNlO1xuXG5cdCAgLy8gYm9vbGVhbjogdHJ1ZSBpZiB0aGUgcGFnZSBpcyBiZWluZyBzY3JvbGxlZFxuXHQgIHZhciBpc1Njcm9sbGluZyA9IGZhbHNlO1xuXG5cdCAgLy8gc3RvcmUgY3VycmVudCBtb3VzZSBwb3NpdGlvblxuXHQgIHZhciBtb3VzZVBvcyA9IHtcblx0ICAgIHg6IG51bGwsXG5cdCAgICB5OiBudWxsXG5cdCAgfTtcblxuXHQgIC8vIG1hcCBvZiBJRSAxMCBwb2ludGVyIGV2ZW50c1xuXHQgIHZhciBwb2ludGVyTWFwID0ge1xuXHQgICAgMjogJ3RvdWNoJyxcblx0ICAgIDM6ICd0b3VjaCcsIC8vIHRyZWF0IHBlbiBsaWtlIHRvdWNoXG5cdCAgICA0OiAnbW91c2UnXG5cdCAgfTtcblxuXHQgIHZhciBzdXBwb3J0c1Bhc3NpdmUgPSBmYWxzZTtcblxuXHQgIHRyeSB7XG5cdCAgICB2YXIgb3B0cyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG5cdCAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHQgICAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG5cdCAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndGVzdCcsIG51bGwsIG9wdHMpO1xuXHQgIH0gY2F0Y2ggKGUpIHt9XG5cblx0ICAvKlxuXHQgICAqIHNldCB1cFxuXHQgICAqL1xuXG5cdCAgdmFyIHNldFVwID0gZnVuY3Rpb24gc2V0VXAoKSB7XG5cdCAgICAvLyBhZGQgY29ycmVjdCBtb3VzZSB3aGVlbCBldmVudCBtYXBwaW5nIHRvIGBpbnB1dE1hcGBcblx0ICAgIGlucHV0TWFwW2RldGVjdFdoZWVsKCldID0gJ21vdXNlJztcblxuXHQgICAgYWRkTGlzdGVuZXJzKCk7XG5cdCAgICBzZXRJbnB1dCgpO1xuXHQgIH07XG5cblx0ICAvKlxuXHQgICAqIGV2ZW50c1xuXHQgICAqL1xuXG5cdCAgdmFyIGFkZExpc3RlbmVycyA9IGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblx0ICAgIC8vIGBwb2ludGVybW92ZWAsIGBNU1BvaW50ZXJNb3ZlYCwgYG1vdXNlbW92ZWAgYW5kIG1vdXNlIHdoZWVsIGV2ZW50IGJpbmRpbmdcblx0ICAgIC8vIGNhbiBvbmx5IGRlbW9uc3RyYXRlIHBvdGVudGlhbCwgYnV0IG5vdCBhY3R1YWwsIGludGVyYWN0aW9uXG5cdCAgICAvLyBhbmQgYXJlIHRyZWF0ZWQgc2VwYXJhdGVseVxuXHQgICAgdmFyIG9wdGlvbnMgPSBzdXBwb3J0c1Bhc3NpdmUgPyB7IHBhc3NpdmU6IHRydWUgfSA6IGZhbHNlO1xuXG5cdCAgICAvLyBwb2ludGVyIGV2ZW50cyAobW91c2UsIHBlbiwgdG91Y2gpXG5cdCAgICBpZiAod2luZG93LlBvaW50ZXJFdmVudCkge1xuXHQgICAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB1cGRhdGVJbnB1dCk7XG5cdCAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHNldEludGVudCk7XG5cdCAgICB9IGVsc2UgaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCkge1xuXHQgICAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcignTVNQb2ludGVyRG93bicsIHVwZGF0ZUlucHV0KTtcblx0ICAgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ01TUG9pbnRlck1vdmUnLCBzZXRJbnRlbnQpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gbW91c2UgZXZlbnRzXG5cdCAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB1cGRhdGVJbnB1dCk7XG5cdCAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzZXRJbnRlbnQpO1xuXG5cdCAgICAgIC8vIHRvdWNoIGV2ZW50c1xuXHQgICAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG5cdCAgICAgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0b3VjaEJ1ZmZlciwgb3B0aW9ucyk7XG5cdCAgICAgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdG91Y2hCdWZmZXIpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vIG1vdXNlIHdoZWVsXG5cdCAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcihkZXRlY3RXaGVlbCgpLCBzZXRJbnRlbnQsIG9wdGlvbnMpO1xuXG5cdCAgICAvLyBrZXlib2FyZCBldmVudHNcblx0ICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdXBkYXRlSW5wdXQpO1xuXHQgICAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdXBkYXRlSW5wdXQpO1xuXHQgIH07XG5cblx0ICAvLyBjaGVja3MgY29uZGl0aW9ucyBiZWZvcmUgdXBkYXRpbmcgbmV3IGlucHV0XG5cdCAgdmFyIHVwZGF0ZUlucHV0ID0gZnVuY3Rpb24gdXBkYXRlSW5wdXQoZXZlbnQpIHtcblx0ICAgIC8vIG9ubHkgZXhlY3V0ZSBpZiB0aGUgdG91Y2ggYnVmZmVyIHRpbWVyIGlzbid0IHJ1bm5pbmdcblx0ICAgIGlmICghaXNCdWZmZXJpbmcpIHtcblx0ICAgICAgdmFyIGV2ZW50S2V5ID0gZXZlbnQud2hpY2g7XG5cdCAgICAgIHZhciB2YWx1ZSA9IGlucHV0TWFwW2V2ZW50LnR5cGVdO1xuXHQgICAgICBpZiAodmFsdWUgPT09ICdwb2ludGVyJykgdmFsdWUgPSBwb2ludGVyVHlwZShldmVudCk7XG5cblx0ICAgICAgaWYgKGN1cnJlbnRJbnB1dCAhPT0gdmFsdWUgfHwgY3VycmVudEludGVudCAhPT0gdmFsdWUpIHtcblx0ICAgICAgICB2YXIgYWN0aXZlRWxlbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cdCAgICAgICAgdmFyIGFjdGl2ZUlucHV0ID0gZmFsc2U7XG5cdCAgICAgICAgdmFyIG5vdEZvcm1JbnB1dCA9IGFjdGl2ZUVsZW0gJiYgYWN0aXZlRWxlbS5ub2RlTmFtZSAmJiBmb3JtSW5wdXRzLmluZGV4T2YoYWN0aXZlRWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSA9PT0gLTE7XG5cblx0ICAgICAgICBpZiAobm90Rm9ybUlucHV0IHx8IGNoYW5nZUludGVudE1hcC5pbmRleE9mKGV2ZW50S2V5KSAhPT0gLTEpIHtcblx0ICAgICAgICAgIGFjdGl2ZUlucHV0ID0gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBpZiAodmFsdWUgPT09ICd0b3VjaCcgfHxcblx0ICAgICAgICAvLyBpZ25vcmUgbW91c2UgbW9kaWZpZXIga2V5c1xuXHQgICAgICAgIHZhbHVlID09PSAnbW91c2UnIHx8XG5cdCAgICAgICAgLy8gZG9uJ3Qgc3dpdGNoIGlmIHRoZSBjdXJyZW50IGVsZW1lbnQgaXMgYSBmb3JtIGlucHV0XG5cdCAgICAgICAgdmFsdWUgPT09ICdrZXlib2FyZCcgJiYgZXZlbnRLZXkgJiYgYWN0aXZlSW5wdXQgJiYgaWdub3JlTWFwLmluZGV4T2YoZXZlbnRLZXkpID09PSAtMSkge1xuXHQgICAgICAgICAgLy8gc2V0IHRoZSBjdXJyZW50IGFuZCBjYXRjaC1hbGwgdmFyaWFibGVcblx0ICAgICAgICAgIGN1cnJlbnRJbnB1dCA9IGN1cnJlbnRJbnRlbnQgPSB2YWx1ZTtcblxuXHQgICAgICAgICAgc2V0SW5wdXQoKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLy8gdXBkYXRlcyB0aGUgZG9jIGFuZCBgaW5wdXRUeXBlc2AgYXJyYXkgd2l0aCBuZXcgaW5wdXRcblx0ICB2YXIgc2V0SW5wdXQgPSBmdW5jdGlvbiBzZXRJbnB1dCgpIHtcblx0ICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2hhdGlucHV0JywgY3VycmVudElucHV0KTtcblx0ICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2hhdGludGVudCcsIGN1cnJlbnRJbnB1dCk7XG5cblx0ICAgIGlmIChpbnB1dFR5cGVzLmluZGV4T2YoY3VycmVudElucHV0KSA9PT0gLTEpIHtcblx0ICAgICAgaW5wdXRUeXBlcy5wdXNoKGN1cnJlbnRJbnB1dCk7XG5cdCAgICAgIGRvYy5jbGFzc05hbWUgKz0gJyB3aGF0aW5wdXQtdHlwZXMtJyArIGN1cnJlbnRJbnB1dDtcblx0ICAgIH1cblxuXHQgICAgZmlyZUZ1bmN0aW9ucygnaW5wdXQnKTtcblx0ICB9O1xuXG5cdCAgLy8gdXBkYXRlcyBpbnB1dCBpbnRlbnQgZm9yIGBtb3VzZW1vdmVgIGFuZCBgcG9pbnRlcm1vdmVgXG5cdCAgdmFyIHNldEludGVudCA9IGZ1bmN0aW9uIHNldEludGVudChldmVudCkge1xuXHQgICAgLy8gdGVzdCB0byBzZWUgaWYgYG1vdXNlbW92ZWAgaGFwcGVuZWQgcmVsYXRpdmUgdG8gdGhlIHNjcmVlblxuXHQgICAgLy8gdG8gZGV0ZWN0IHNjcm9sbGluZyB2ZXJzdXMgbW91c2Vtb3ZlXG5cdCAgICBpZiAobW91c2VQb3NbJ3gnXSAhPT0gZXZlbnQuc2NyZWVuWCB8fCBtb3VzZVBvc1sneSddICE9PSBldmVudC5zY3JlZW5ZKSB7XG5cdCAgICAgIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cblx0ICAgICAgbW91c2VQb3NbJ3gnXSA9IGV2ZW50LnNjcmVlblg7XG5cdCAgICAgIG1vdXNlUG9zWyd5J10gPSBldmVudC5zY3JlZW5ZO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaXNTY3JvbGxpbmcgPSB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICAvLyBvbmx5IGV4ZWN1dGUgaWYgdGhlIHRvdWNoIGJ1ZmZlciB0aW1lciBpc24ndCBydW5uaW5nXG5cdCAgICAvLyBvciBzY3JvbGxpbmcgaXNuJ3QgaGFwcGVuaW5nXG5cdCAgICBpZiAoIWlzQnVmZmVyaW5nICYmICFpc1Njcm9sbGluZykge1xuXHQgICAgICB2YXIgdmFsdWUgPSBpbnB1dE1hcFtldmVudC50eXBlXTtcblx0ICAgICAgaWYgKHZhbHVlID09PSAncG9pbnRlcicpIHZhbHVlID0gcG9pbnRlclR5cGUoZXZlbnQpO1xuXG5cdCAgICAgIGlmIChjdXJyZW50SW50ZW50ICE9PSB2YWx1ZSkge1xuXHQgICAgICAgIGN1cnJlbnRJbnRlbnQgPSB2YWx1ZTtcblxuXHQgICAgICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2hhdGludGVudCcsIGN1cnJlbnRJbnRlbnQpO1xuXG5cdCAgICAgICAgZmlyZUZ1bmN0aW9ucygnaW50ZW50Jyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLy8gYnVmZmVycyB0b3VjaCBldmVudHMgYmVjYXVzZSB0aGV5IGZyZXF1ZW50bHkgYWxzbyBmaXJlIG1vdXNlIGV2ZW50c1xuXHQgIHZhciB0b3VjaEJ1ZmZlciA9IGZ1bmN0aW9uIHRvdWNoQnVmZmVyKGV2ZW50KSB7XG5cdCAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG5cdCAgICAgIGlzQnVmZmVyaW5nID0gZmFsc2U7XG5cblx0ICAgICAgLy8gc2V0IHRoZSBjdXJyZW50IGlucHV0XG5cdCAgICAgIHVwZGF0ZUlucHV0KGV2ZW50KTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlzQnVmZmVyaW5nID0gdHJ1ZTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgdmFyIGZpcmVGdW5jdGlvbnMgPSBmdW5jdGlvbiBmaXJlRnVuY3Rpb25zKHR5cGUpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmdW5jdGlvbkxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaWYgKGZ1bmN0aW9uTGlzdFtpXS50eXBlID09PSB0eXBlKSB7XG5cdCAgICAgICAgZnVuY3Rpb25MaXN0W2ldLmZuLmNhbGwodW5kZWZpbmVkLCBjdXJyZW50SW50ZW50KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvKlxuXHQgICAqIHV0aWxpdGllc1xuXHQgICAqL1xuXG5cdCAgdmFyIHBvaW50ZXJUeXBlID0gZnVuY3Rpb24gcG9pbnRlclR5cGUoZXZlbnQpIHtcblx0ICAgIGlmICh0eXBlb2YgZXZlbnQucG9pbnRlclR5cGUgPT09ICdudW1iZXInKSB7XG5cdCAgICAgIHJldHVybiBwb2ludGVyTWFwW2V2ZW50LnBvaW50ZXJUeXBlXTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIC8vIHRyZWF0IHBlbiBsaWtlIHRvdWNoXG5cdCAgICAgIHJldHVybiBldmVudC5wb2ludGVyVHlwZSA9PT0gJ3BlbicgPyAndG91Y2gnIDogZXZlbnQucG9pbnRlclR5cGU7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8vIGRldGVjdCB2ZXJzaW9uIG9mIG1vdXNlIHdoZWVsIGV2ZW50IHRvIHVzZVxuXHQgIC8vIHZpYSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9FdmVudHMvd2hlZWxcblx0ICB2YXIgZGV0ZWN0V2hlZWwgPSBmdW5jdGlvbiBkZXRlY3RXaGVlbCgpIHtcblx0ICAgIHZhciB3aGVlbFR5cGUgPSB2b2lkIDA7XG5cblx0ICAgIC8vIE1vZGVybiBicm93c2VycyBzdXBwb3J0IFwid2hlZWxcIlxuXHQgICAgaWYgKCdvbndoZWVsJyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSkge1xuXHQgICAgICB3aGVlbFR5cGUgPSAnd2hlZWwnO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gV2Via2l0IGFuZCBJRSBzdXBwb3J0IGF0IGxlYXN0IFwibW91c2V3aGVlbFwiXG5cdCAgICAgIC8vIG9yIGFzc3VtZSB0aGF0IHJlbWFpbmluZyBicm93c2VycyBhcmUgb2xkZXIgRmlyZWZveFxuXHQgICAgICB3aGVlbFR5cGUgPSBkb2N1bWVudC5vbm1vdXNld2hlZWwgIT09IHVuZGVmaW5lZCA/ICdtb3VzZXdoZWVsJyA6ICdET01Nb3VzZVNjcm9sbCc7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiB3aGVlbFR5cGU7XG5cdCAgfTtcblxuXHQgIHZhciBvYmpQb3MgPSBmdW5jdGlvbiBvYmpQb3MobWF0Y2gpIHtcblx0ICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmdW5jdGlvbkxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0ICAgICAgaWYgKGZ1bmN0aW9uTGlzdFtpXS5mbiA9PT0gbWF0Y2gpIHtcblx0ICAgICAgICByZXR1cm4gaTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvKlxuXHQgICAqIGluaXRcblx0ICAgKi9cblxuXHQgIC8vIGRvbid0IHN0YXJ0IHNjcmlwdCB1bmxlc3MgYnJvd3NlciBjdXRzIHRoZSBtdXN0YXJkXG5cdCAgLy8gKGFsc28gcGFzc2VzIGlmIHBvbHlmaWxscyBhcmUgdXNlZClcblx0ICBpZiAoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyAmJiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuXHQgICAgc2V0VXAoKTtcblx0ICB9XG5cblx0ICAvKlxuXHQgICAqIGFwaVxuXHQgICAqL1xuXG5cdCAgcmV0dXJuIHtcblx0ICAgIC8vIHJldHVybnMgc3RyaW5nOiB0aGUgY3VycmVudCBpbnB1dCB0eXBlXG5cdCAgICAvLyBvcHQ6ICdsb29zZSd8J3N0cmljdCdcblx0ICAgIC8vICdzdHJpY3QnIChkZWZhdWx0KTogcmV0dXJucyB0aGUgc2FtZSB2YWx1ZSBhcyB0aGUgYGRhdGEtd2hhdGlucHV0YCBhdHRyaWJ1dGVcblx0ICAgIC8vICdsb29zZSc6IGluY2x1ZGVzIGBkYXRhLXdoYXRpbnRlbnRgIHZhbHVlIGlmIGl0J3MgbW9yZSBjdXJyZW50IHRoYW4gYGRhdGEtd2hhdGlucHV0YFxuXHQgICAgYXNrOiBmdW5jdGlvbiBhc2sob3B0KSB7XG5cdCAgICAgIHJldHVybiBvcHQgPT09ICdsb29zZScgPyBjdXJyZW50SW50ZW50IDogY3VycmVudElucHV0O1xuXHQgICAgfSxcblxuXHQgICAgLy8gcmV0dXJucyBhcnJheTogYWxsIHRoZSBkZXRlY3RlZCBpbnB1dCB0eXBlc1xuXHQgICAgdHlwZXM6IGZ1bmN0aW9uIHR5cGVzKCkge1xuXHQgICAgICByZXR1cm4gaW5wdXRUeXBlcztcblx0ICAgIH0sXG5cblx0ICAgIC8vIG92ZXJ3cml0ZXMgaWdub3JlZCBrZXlzIHdpdGggcHJvdmlkZWQgYXJyYXlcblx0ICAgIGlnbm9yZUtleXM6IGZ1bmN0aW9uIGlnbm9yZUtleXMoYXJyKSB7XG5cdCAgICAgIGlnbm9yZU1hcCA9IGFycjtcblx0ICAgIH0sXG5cblx0ICAgIC8vIGF0dGFjaCBmdW5jdGlvbnMgdG8gaW5wdXQgYW5kIGludGVudCBcImV2ZW50c1wiXG5cdCAgICAvLyBmdW5jdDogZnVuY3Rpb24gdG8gZmlyZSBvbiBjaGFuZ2Vcblx0ICAgIC8vIGV2ZW50VHlwZTogJ2lucHV0J3wnaW50ZW50J1xuXHQgICAgcmVnaXN0ZXJPbkNoYW5nZTogZnVuY3Rpb24gcmVnaXN0ZXJPbkNoYW5nZShmbiwgZXZlbnRUeXBlKSB7XG5cdCAgICAgIGZ1bmN0aW9uTGlzdC5wdXNoKHtcblx0ICAgICAgICBmbjogZm4sXG5cdCAgICAgICAgdHlwZTogZXZlbnRUeXBlIHx8ICdpbnB1dCdcblx0ICAgICAgfSk7XG5cdCAgICB9LFxuXG5cdCAgICB1blJlZ2lzdGVyT25DaGFuZ2U6IGZ1bmN0aW9uIHVuUmVnaXN0ZXJPbkNoYW5nZShmbikge1xuXHQgICAgICB2YXIgcG9zaXRpb24gPSBvYmpQb3MoZm4pO1xuXG5cdCAgICAgIGlmIChwb3NpdGlvbikge1xuXHQgICAgICAgIGZ1bmN0aW9uTGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfTtcblx0fSgpO1xuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL2hvbWUvbWFyay9TaXRlcy9zb2x2ZXRoZWN1YmUvbm9kZV9tb2R1bGVzL3doYXQtaW5wdXQvZGlzdC93aGF0LWlucHV0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBnZW5lcmF0ZVNjcmFtYmxlIH0gZnJvbSAnLi9zY3JhbWJsZSc7XG5cbmNsYXNzIFN0b3B3YXRjaCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuc3RhcnRlZEF0ID0gMDtcblx0XHR0aGlzLnJ1bm5pbmcgICA9IGZhbHNlO1xuXHR9XG5cblx0c3RhcnQoKSB7XG5cdFx0dGhpcy5zdGFydGVkQXQgPSBEYXRlLm5vdygpO1xuXHRcdHRoaXMucnVubmluZyA9IHRydWU7XG5cdH1cblxuXHRyZXNldCgpIHtcblx0XHR0aGlzLnN0YXJ0ZWRBdCA9IDA7XG5cdH1cblxuXHRnZXQgZWxhcHNlZFRpbWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuc3RhcnRlZEF0ID8gRGF0ZS5ub3coKSAtIHRoaXMuc3RhcnRlZEF0IDogMDtcblx0fVxufVxuXG5jb25zdCBERUxFVEVfVElNRV9MSU5LID0gJzxhIHRpdGxlPVwiRGVsZXRlIHRoaXMgdGltZVwiPiYjeDI3MTY7PC9hPic7XG5cbmxldCBzdG9wd2F0Y2ggPSBuZXcgU3RvcHdhdGNoKCk7XG5sZXQgdGltZXMgICAgID0gW107XG5sZXQgZGlzcGxheUludGVydmFsO1xubGV0IGluc3BlY3Rpb25JbnRlcnZhbDtcblxuY29uc3QgJGRpc3BsYXkgPSAkKCcjdGltZScpO1xuY29uc3QgJHRpbWVzICAgPSAkKCcjdGltZXMgb2wnKTtcblxuY29uc3Qgc2hvcnRCZWVwID0gbmV3IEF1ZGlvKCdzb3VuZHMvc2hvcnRiZWVwLndhdicpO1xuY29uc3QgbG9uZ0JlZXAgID0gbmV3IEF1ZGlvKCdzb3VuZHMvbG9uZ2JlZXAud2F2Jyk7XG5cbi8vIFVzZXIgaW50ZXJhY3Rpb24gd2l0aCB0aW1lclxuZnVuY3Rpb24gYWN0aXZhdGVUaW1lcigpIHtcblx0Ly8gSWYgdGltZXIgaXMgcnVubmluZywgc3RvcCBhbmQgcmVjb3JkIHRpbWVcblx0aWYoc3RvcHdhdGNoLnJ1bm5pbmcpIHtcblx0XHQvLyBGaXJzdCBzYXZlIHJlY29yZGVkIHRpbWVcblx0XHRjb25zdCB0aW1lID0gc3RvcHdhdGNoLmVsYXBzZWRUaW1lO1xuXG5cdFx0Ly8gU2V0IG5ldyBzY3JhbWJsZVxuXHRcdCQoJyNzY3JhbWJsZScpLnRleHQoZ2VuZXJhdGVTY3JhbWJsZSgpKTtcblxuXHRcdC8vIE9ubHkgcmVjb3JkIHRpbWUgaWYgPjAsIHNvIGFmdGVyIGluc3BlY3Rpb24gdGltZVxuXHRcdGlmKHRpbWUgPiAwKSB7XG5cdFx0XHRjbGVhckludGVydmFsKGRpc3BsYXlJbnRlcnZhbCk7XG5cdFx0XHQvLyBVcGRhdGUgZGlzcGxheSB0byByZWNvcmRlZCB0aW1lIHRvIGF2b2lkIGluY29uZ3J1aXR5XG5cdFx0XHR1cGRhdGVEaXNwbGF5KHRpbWUpO1xuXHRcdFx0c3RvcHdhdGNoLnJ1bm5pbmcgPSBmYWxzZTtcblxuXHRcdFx0Ly8gQWRkIHRvIHRpbWVzIGxpc3QgYW5kIHNjcm9sbCB0byBib3R0b21cblx0XHRcdHRpbWVzLnB1c2godGltZSk7XG5cdFx0XHQkdGltZXMuYXBwZW5kKCc8bGk+JyArIGZvcm1hdFRpbWUodGltZSkgKyBERUxFVEVfVElNRV9MSU5LICsgJzwvbGk+Jyk7XG5cdFx0XHQkdGltZXNbMF0uc2Nyb2xsVG9wID0gJHRpbWVzWzBdLnNjcm9sbEhlaWdodDtcblxuXHRcdFx0dXBkYXRlU3RhdHMoKTtcblx0XHRcdHNhdmVUaW1lcygpO1xuXHRcdH1cblx0XHQvLyBTdG9wIGluc3BlY3Rpb24gdGltZSBhbmQgZ3JleSBkaXNwbGF5XG5cdFx0ZWxzZSB7XG5cdFx0XHRzdG9wd2F0Y2gucnVubmluZyA9IGZhbHNlO1xuXHRcdFx0Y2xlYXJJbnRlcnZhbChpbnNwZWN0aW9uSW50ZXJ2YWwpO1xuXHRcdFx0JGRpc3BsYXkuYWRkQ2xhc3MoJ3BhdXNlZCcpO1xuXHRcdH1cblx0fVxuXHQvLyBJZiBub3QgYWxyZWFkeSBydW5uaW5nLCB1bmdyZXkgZGlzcGxheSBhbmQgY2hlY2sgZm9yIGluc3BlY3Rpb24gdGltZVxuXHRlbHNlIHtcblx0XHQkZGlzcGxheS5yZW1vdmVDbGFzcygncGF1c2VkJyk7XG5cblx0XHRjb25zdCBpbnNwZWN0aW9uID0gJCgnI2luc3BlY3Rpb24nKS52YWwoKTtcblx0XHRpZihpbnNwZWN0aW9uICE9ICcwJykge1xuXHRcdFx0Ly8gUmVzZXQgdGltZXJcblx0XHRcdHN0b3B3YXRjaC5yZXNldCgpO1xuXG5cdFx0XHQvLyBCcmllZmx5IGNsZWFyIGRpc3BsYXkgYmVmb3JlIHNob3dpbmcgaW5zcGVjdGlvbiB0aW1lXG5cdFx0XHQkZGlzcGxheS5odG1sKCcmbmJzcDsnKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRkaXNwbGF5LnRleHQoaW5zcGVjdGlvbik7XG5cdFx0XHR9LCA4MCk7XG5cblx0XHRcdC8vIFBsYXkgZmlyc3QgYmVlcCBpZiBzdGFydGluZyBhdCAzIHNlY29uZHNcblx0XHRcdGlmKGluc3BlY3Rpb24gPT0gMykge1xuXHRcdFx0XHRwbGF5U291bmQoc2hvcnRCZWVwKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3RhcnQgdGltZXIgY291bnRpbmcgZG93biBpbnNwZWN0aW9uIHRpbWVcblx0XHRcdHN0b3B3YXRjaC5ydW5uaW5nID0gdHJ1ZTtcblx0XHRcdGluc3BlY3Rpb25JbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBuZXdUaW1lID0gJGRpc3BsYXkudGV4dCgpIC0gMTtcblx0XHRcdFx0JGRpc3BsYXkudGV4dChuZXdUaW1lKTtcblxuXHRcdFx0XHQvLyBBdCAwLCBzdG9wIGluc3BlY3Rpb24gdGltZSBhbmQgc3RhcnQgc3RvcHdhdGNoXG5cdFx0XHRcdGlmKG5ld1RpbWUgPT0gMCkge1xuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoaW5zcGVjdGlvbkludGVydmFsKTtcblx0XHRcdFx0XHRzdGFydFN0b3B3YXRjaCgpO1xuXHRcdFx0XHRcdHBsYXlTb3VuZChsb25nQmVlcCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZihuZXdUaW1lIDw9IDMpIHtcblx0XHRcdFx0XHRwbGF5U291bmQoc2hvcnRCZWVwKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0c3RhcnRTdG9wd2F0Y2goKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gU3RhcnQgdGltaW5nIGFuZCB1cGRhdGUgZGlzcGxheSBldmVyeSAxMCBtaWxsaXNlY29uZHNcbmZ1bmN0aW9uIHN0YXJ0U3RvcHdhdGNoKCkge1xuXHRzdG9wd2F0Y2gucmVzZXQoKTtcblx0c3RvcHdhdGNoLnN0YXJ0KCk7XG5cdGRpc3BsYXlJbnRlcnZhbCA9IHNldEludGVydmFsKHVwZGF0ZURpc3BsYXksIDEwKTtcbn1cblxuLy8gVXBkYXRlIG1haW4gdGltZXIgZGlzcGxheSB0byBlaXRoZXIgZ2l2ZW4gdGltZSBvciBlbGFwc2VkIHRpbWVcbmZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkodGltZSkge1xuXHR2YXIgdGltZSA9IHBhcnNlVGltZSh0aW1lIHx8IHN0b3B3YXRjaC5lbGFwc2VkVGltZSk7XG5cblx0JGRpc3BsYXkuaHRtbCh0aW1lLm0gKyAnPHNwYW4gY2xhc3M9XCJjb2xvblwiPjo8L3NwYW4+JyArIHplcm9QYWQodGltZS5zLCAyKSArICc8c3BhbiBjbGFzcz1cInNtYWxsXCI+JyArIHplcm9QYWQodGltZS5tcywgMikgKyAnPC9zcGFuPicpO1xufVxuXG4vLyBVc2UgbGlzdCBvZiB0aW1lcyB0byBjYWxjdWxhdGUgc3RhdHNcbmZ1bmN0aW9uIHVwZGF0ZVN0YXRzKCkge1xuXHR2YXIgZGVmYXVsdFRpbWUgPSAnJm5kYXNoOzombmRhc2g7Jm5kYXNoOy4mbmRhc2g7Jm5kYXNoOyc7XG5cdGlmKHRpbWVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0JCgnI3N0YXRzIHRkW2lkXScpLmh0bWwoZGVmYXVsdFRpbWUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHZhciB0b3RhbCAgICAgICAgPSAwLFxuXHRcdFx0bWluaW11bSAgICAgID0gdGltZXNbMF0sXG5cdFx0XHRtYXhpbXVtICAgICAgPSB0aW1lc1swXSxcblx0XHRcdHRyaW1tZWRUb3RhbCA9IDA7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGltZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvdGFsICs9IHRpbWVzW2ldO1xuXG5cdFx0XHRpZih0aW1lc1tpXSA8IG1pbmltdW0pIHtcblx0XHRcdFx0bWluaW11bSA9IHRpbWVzW2ldO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZih0aW1lc1tpXSA+IG1heGltdW0pIHtcblx0XHRcdFx0bWF4aW11bSA9IHRpbWVzW2ldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSB0cmltbWVkIGF2ZXJhZ2Vcblx0XHRpZih0aW1lcy5sZW5ndGggPj0gMykge1xuXHRcdFx0Ly8gQ29weSBhbmQgc29ydCB0aW1lcyBhbmQgcmVtb3ZlIGZpcnN0IGFuZCBsYXN0XG5cdFx0XHR2YXIgdHJpbW1lZFRpbWVzID0gdGltZXMuc2xpY2UoMCkuc29ydChmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRcdHJldHVybiBhIC0gYjtcblx0XHRcdH0pLnNsaWNlKDEsIC0xKTtcblxuXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRyaW1tZWRUaW1lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR0cmltbWVkVG90YWwgKz0gdHJpbW1lZFRpbWVzW2ldO1xuXHRcdFx0fVxuXG5cdFx0XHQkKCcjdHJpbW1lZCcpLmh0bWwoZm9ybWF0VGltZSh0cmltbWVkVG90YWwgLyB0cmltbWVkVGltZXMubGVuZ3RoKSk7XG5cdFx0fVxuXHRcdC8vIElmIHRvbyBmZXcgdGltZXMsIHJlc2V0IHRpbWVkIGF2ZXJhZ2Vcblx0XHRlbHNlIHtcblx0XHRcdCQoJyN0cmltbWVkJykuaHRtbChkZWZhdWx0VGltZSk7XG5cdFx0fVxuXG5cdFx0JCgnI2F2ZXJhZ2UnKS5odG1sKGZvcm1hdFRpbWUodG90YWwgLyB0aW1lcy5sZW5ndGgpKTtcblx0XHQkKCcjYmVzdCcpLmh0bWwoZm9ybWF0VGltZShtaW5pbXVtKSk7XG5cdFx0JCgnI3dvcnN0JykuaHRtbChmb3JtYXRUaW1lKG1heGltdW0pKTtcblx0fVxufVxuXG4vLyBQbGF5IGdpdmVuIHNvdW5kIGlmIGVuYWJsZWRcbmZ1bmN0aW9uIHBsYXlTb3VuZChzb3VuZCkge1xuXHRpZihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291bmRUb2dnbGUnKS5jaGVja2VkKSB7XG5cdFx0c291bmQucGxheSgpO1xuXHR9XG59XG5cbi8vIFNwbGl0IHRpbWUgaW50IGludG8gb2JqZWN0IGNvbnRhaW5pbmcgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kc1xuZnVuY3Rpb24gcGFyc2VUaW1lKHRpbWUpIHtcblx0bGV0IG0gID0gMDtcblx0bGV0IHMgID0gMDtcblx0bGV0IG1zID0gMDtcblxuXHRtICAgID0gTWF0aC5mbG9vcih0aW1lIC8gKDYwICogMTAwMCkpO1xuXHR0aW1lID0gdGltZSAlICg2MCAqIDEwMDApO1xuXG5cdHMgICAgPSBNYXRoLmZsb29yKHRpbWUgLyAxMDAwKTtcblx0dGltZSA9IHRpbWUgJSAxMDAwO1xuXG5cdG1zICAgPSBNYXRoLmZsb29yKHRpbWUgLyAxMCk7XG5cblx0cmV0dXJuIHtcblx0XHQnbSc6IG0sXG5cdFx0J3MnOiBzLFxuXHRcdCdtcyc6IG1zXG5cdH07XG59XG5cbi8vIFJldHVybnMgZm9ybWF0dGVkIHRpbWUgc3RyaW5nXG5mdW5jdGlvbiBmb3JtYXRUaW1lKHRpbWUpIHtcblx0Y29uc3QgcGFyc2VkVGltZSA9IHBhcnNlVGltZSh0aW1lKTtcblx0cmV0dXJuIHBhcnNlZFRpbWUubSArICc6JyArIHplcm9QYWQocGFyc2VkVGltZS5zLCAyKSArICcuJyArIHplcm9QYWQocGFyc2VkVGltZS5tcywgMik7XG59XG5cbi8vIExlZnQgcGFkIG51bWJlciB3aXRoIHplcm9lcyB0byBnaXZlbiBzaXplXG5mdW5jdGlvbiB6ZXJvUGFkKG51bSwgc2l6ZSkge1xuXHRsZXQgcyA9ICcwMDAwMCcgKyBudW07XG5cdHJldHVybiBzLnN1YnN0cihzLmxlbmd0aCAtIHNpemUpO1xufVxuXG4vLyBTYXZlIHRpbWVzIGludG8gbG9jYWwgc3RvcmFnZVxuZnVuY3Rpb24gc2F2ZVRpbWVzKCkge1xuXHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGltZXMnLCBKU09OLnN0cmluZ2lmeSh0aW1lcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRpZigkKCcjdGltZXInKS5sZW5ndGggPiAwKSB7XG5cblx0XHQvLyBTZXQgaW5pdGlhbCBzY3JhbWJsZVxuXHRcdCQoJyNzY3JhbWJsZScpLnRleHQoZ2VuZXJhdGVTY3JhbWJsZSgpKTtcblxuXHRcdC8vIEFjdGl2YXRlIHRpbWVyIG9uIGNsaWNrXG5cdFx0JCgnI3RpbWUnKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGFjdGl2YXRlVGltZXIoKTtcblx0XHR9KTtcblxuXHRcdC8vIEFjdGl2YXRlIHRpbWVyIG9uIHNwYWNlYmFyXG5cdFx0JChkb2N1bWVudCkua2V5dXAoZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS53aGljaCA9PSAzMikge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGFjdGl2YXRlVGltZXIoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIFByZXZlbnQgc3BhY2ViYXIgZnJvbSBzY3JvbGxpbmcgcGFnZVxuXHRcdCQoZG9jdW1lbnQpLmtleWRvd24oZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS53aGljaCA9PSAzMikge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBGdWxsc2NyZWVuIGJ1dHRvblxuXHRcdCQoJyNmdWxsc2NyZWVuJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkdGltZVdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZS13cmFwcGVyJyk7XG5cblx0XHRcdGlmKCFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCAmJiAhZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgJiYgIWRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50ICYmICFkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50KSB7XG5cdFx0XHRcdGlmKCR0aW1lV3JhcHBlci5yZXF1ZXN0RnVsbHNjcmVlbikge1xuXHRcdFx0XHRcdCR0aW1lV3JhcHBlci5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHRpbWVXcmFwcGVyLm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHRcdFx0XHQkdGltZVdyYXBwZXIubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoJHRpbWVXcmFwcGVyLm1velJlcXVlc3RGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0JHRpbWVXcmFwcGVyLm1velJlcXVlc3RGdWxsU2NyZWVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZigkdGltZVdyYXBwZXIud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcblx0XHRcdFx0XHQkdGltZVdyYXBwZXIud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcblx0XHRcdFx0XHRkb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZihkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQubW96Q2FuY2VsRnVsbFNjcmVlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcblx0XHRcdFx0XHRkb2N1bWVudC53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBSZW1vdmUgc3BlY2lmaWMgdGltZVxuXHRcdCQoJyN0aW1lcycpLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zdCAkbGkgPSAkKHRoaXMpLnBhcmVudCgpO1xuXHRcdFx0dGltZXMuc3BsaWNlKCRsaS5pbmRleCgpLCAxKTtcblx0XHRcdCRsaS5yZW1vdmUoKTtcblx0XHRcdHVwZGF0ZVN0YXRzKCk7XG5cdFx0XHRzYXZlVGltZXMoKTtcblx0XHR9KTtcblxuXHRcdC8vIENsZWFyIHRpbWVzIGxvZ1xuXHRcdCQoJyNjbGVhcnRpbWVzJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aW1lcy5sZW5ndGggPiAwICYmIGNvbmZpcm0oJ0NsZWFyIGFsbCB0aW1lcyBmcm9tIGxvZz8nKSkge1xuXHRcdFx0XHR0aW1lcyA9IFtdO1xuXHRcdFx0XHQkKCcjdGltZXMgb2wnKS5lbXB0eSgpO1xuXHRcdFx0XHR1cGRhdGVTdGF0cygpO1xuXHRcdFx0XHRzYXZlVGltZXMoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdC8vIFJlc3RvcmUgc2F2ZWQgdGltZXNcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHN0b3JlZFRpbWVzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RpbWVzJyk7XG5cdFx0XHRpZihzdG9yZWRUaW1lcykge1xuXHRcdFx0XHR0aW1lcyA9IEpTT04ucGFyc2Uoc3RvcmVkVGltZXMpO1xuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGltZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHQkdGltZXMuYXBwZW5kKCc8bGk+JyArIGZvcm1hdFRpbWUodGltZXNbaV0pICsgREVMRVRFX1RJTUVfTElOSyArICc8L2xpPicpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHVwZGF0ZVN0YXRzKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tb2R1bGVzL3RpbWVyLmpzIiwiY29uc3QgTU9WRVMgICAgICAgICAgID0gWydVJywgJ0QnLCAnUicsICdMJywgJ0YnLCAnQiddO1xuY29uc3QgTU9ESUZJRVJTICAgICAgID0gWycnLCAnMicsIFwiJ1wiXTtcbmNvbnN0IFNDUkFNQkxFX0xFTkdUSCA9IDIwO1xuXG4vLyBHZW5lcmF0ZSBzdHJpbmcgb2YgcmFuZG9tLWlzaCBtb3ZlcyB3aXRoIHJhbmRvbSBtb2RpZmllcnNcbmZ1bmN0aW9uIGdlbmVyYXRlU2NyYW1ibGUoKSB7XG5cdGNvbnN0IHNjcmFtYmxlID0gW107XG5cblx0Zm9yKGxldCBpID0gMDsgaSA8IFNDUkFNQkxFX0xFTkdUSDsgaSsrKSB7XG5cdFx0Ly8gUmVtb3ZlIGxhc3QgbW92ZSBmcm9tIGF2YWlsYWJsZSBtb3ZlcyBiZWZvcmUgY2hvb3Npbmdcblx0XHRjb25zdCBsYXN0TW92ZSA9IHNjcmFtYmxlLmxlbmd0aCA+IDAgPyBzY3JhbWJsZVtzY3JhbWJsZS5sZW5ndGggLSAxXS5jaGFyQXQoMCkgOiBmYWxzZTtcblxuXHRcdGNvbnN0IGF2YWlsYWJsZU1vdmVzID0gTU9WRVMuc2xpY2UoKTtcblx0XHRpZihsYXN0TW92ZSkge1xuXHRcdFx0Ly8gUmVtb3ZlIGxhc3QgbW92ZSBmcm9tIGF2YWlsYWJsZSBjaG9pY2VzXG5cdFx0XHRhdmFpbGFibGVNb3Zlcy5zcGxpY2UoYXZhaWxhYmxlTW92ZXMuaW5kZXhPZihsYXN0TW92ZSksIDEpO1xuXG5cdFx0XHQvLyBJZiBsYXN0IHR3byBtb3ZlcyBhcmUgb3Bwb3NpdGVzIG9mIGVhY2ggb3RoZXIsIHJlbW92ZSBib3RoIGZyb20gYXZhaWxhYmxlIGNob2ljZXNcblx0XHRcdGNvbnN0IHBlbnVsdGltYXRlTW92ZSA9IHNjcmFtYmxlLmxlbmd0aCA+PSAyID8gc2NyYW1ibGVbc2NyYW1ibGUubGVuZ3RoIC0gMl0uY2hhckF0KDApIDogZmFsc2U7XG5cblx0XHRcdGlmKHBlbnVsdGltYXRlTW92ZSAmJiBvcHBvc2l0ZUZhY2UobGFzdE1vdmUpID09IHBlbnVsdGltYXRlTW92ZSkge1xuXHRcdFx0XHRhdmFpbGFibGVNb3Zlcy5zcGxpY2UoYXZhaWxhYmxlTW92ZXMuaW5kZXhPZihwZW51bHRpbWF0ZU1vdmUpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRzY3JhbWJsZS5wdXNoKGNob29zZVJhbmRvbShhdmFpbGFibGVNb3ZlcykgKyBjaG9vc2VSYW5kb20oTU9ESUZJRVJTKSk7XG5cdH1cblxuXHRyZXR1cm4gc2NyYW1ibGUuam9pbignICcpO1xufVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gY2hvb3NlIGEgcmFuZG9tIGl0ZW0gZnJvbSBhbiBhcnJheVxuZnVuY3Rpb24gY2hvb3NlUmFuZG9tKGFycmF5KSB7XG5cdHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnJheS5sZW5ndGgpXTtcbn1cblxuLy8gUmV0dXJuIG9wcG9zaXRlIG9mIGdpdmVuIGZhY2VcbmZ1bmN0aW9uIG9wcG9zaXRlRmFjZShmYWNlKSB7XG5cdGNvbnN0IG9wcG9zaXRlcyA9IHtcblx0XHRVOiAnRCcsXG5cdFx0RDogJ1UnLFxuXHRcdFI6ICdMJyxcblx0XHRMOiAnUicsXG5cdFx0RjogJ0InLFxuXHRcdEI6ICdGJ1xuXHR9O1xuXHRyZXR1cm4gb3Bwb3NpdGVzW2ZhY2VdO1xufVxuXG5leHBvcnQgeyBnZW5lcmF0ZVNjcmFtYmxlIH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9tb2R1bGVzL3NjcmFtYmxlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==