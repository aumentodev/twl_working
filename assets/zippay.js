! function(e, t) {
    "function" == typeof define && define.amd ? (define(t), "undefined" != e.ResizeSensor && (e.ResizeSensor = t())) : "object" == typeof exports ? module.exports = t() : e.ResizeSensor = t()
}(this, function() {
    function e(e, t) {
        var i = Object.prototype.toString.call(e),
            n = "[object Array]" === i || "[object NodeList]" === i || "[object HTMLCollection]" === i || "[object Object]" === i || "undefined" != typeof jQuery && e instanceof jQuery || "undefined" != typeof Elements && e instanceof Elements,
            s = 0,
            o = e.length;
        if (n)
            for (; s < o; s++) t(e[s]);
        else t(e)
    }
    if ("undefined" == typeof window) return null;
    var t = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(e) {
            return window.setTimeout(e, 20)
        },
        i = function(n, s) {
            function o() {
                var e = [];
                this.add = function(t) {
                    e.push(t)
                };
                var t, i;
                this.call = function() {
                    for (t = 0, i = e.length; t < i; t++) e[t].call()
                }, this.remove = function(n) {
                    var s = [];
                    for (t = 0, i = e.length; t < i; t++) e[t] !== n && s.push(e[t]);
                    e = s
                }, this.length = function() {
                    return e.length
                }
            }

            function a(e, t) {
                return e.currentStyle ? e.currentStyle[t] : window.getComputedStyle ? window.getComputedStyle(e, null).getPropertyValue(t) : e.style[t]
            }

            function r(e, i) {
                if (e.resizedAttached) return void e.resizedAttached.add(i);
                e.resizedAttached = new o, e.resizedAttached.add(i), e.resizeSensor = document.createElement("div"), e.resizeSensor.className = "resize-sensor";
                var n = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",
                    s = "position: absolute; left: 0; top: 0; transition: 0s;";
                e.resizeSensor.style.cssText = n, e.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + n + '"><div style="' + s + '"></div></div><div class="resize-sensor-shrink" style="' + n + '"><div style="' + s + ' width: 200%; height: 200%"></div></div>', e.appendChild(e.resizeSensor), "static" == a(e, "position") && (e.style.position = "relative");
                var r, l, c, p, d = e.resizeSensor.childNodes[0],
                    u = d.childNodes[0],
                    h = e.resizeSensor.childNodes[1],
                    f = e.offsetWidth,
                    m = e.offsetHeight,
                    g = function() {
                        u.style.width = "100000px", u.style.height = "100000px", d.scrollLeft = 1e5, d.scrollTop = 1e5, h.scrollLeft = 1e5, h.scrollTop = 1e5
                    };
                g();
                var y = function() {
                        l = 0, r && (f = c, m = p, e.resizedAttached && e.resizedAttached.call())
                    },
                    _ = function() {
                        c = e.offsetWidth, p = e.offsetHeight, r = c != f || p != m, r && !l && (l = t(y)), g()
                    },
                    z = function(e, t, i) {
                        e.attachEvent ? e.attachEvent("on" + t, i) : e.addEventListener(t, i)
                    };
                z(d, "scroll", _), z(h, "scroll", _)
            }
            e(n, function(e) {
                r(e, s)
            }), this.detach = function(e) {
                i.detach(n, e)
            }
        };
    return i.detach = function(t, i) {
        e(t, function(e) {
            e.resizedAttached && "function" == typeof i && (e.resizedAttached.remove(i), e.resizedAttached.length()) || e.resizeSensor && (e.contains(e.resizeSensor) && e.removeChild(e.resizeSensor), delete e.resizeSensor, delete e.resizedAttached)
        })
    }, i
}),
function(e, t, i) {
    "use strict";
    if (e.console === i && (e.console = {}, e.console.log = function() {}), t === i) return void console.log("zipMoney JS Library requires jQuery");
    if (e.ZIPMONEYLOADED) return void console.log("zipMoney JS Library is already Loaded.");
    if (t.zepto !== i) console.log("Loaded zipMoney Widget JS. Using Zepto Js");
    else {
        if (t.fn.jquery < 1.7) return void console.log("zipMoney JS Library requires at least jQuery 1.7 ");
    }
    e.ZIPMONEYLOADED = !0;
    var n = function() {};
    n.prototype = {
        options: {
            widgets: [],
            assets: {},
            popupGroup: [],
            assetsCache: [],
            asset_values: {}
        },
        _allowedAttributes: ["zm-asset", "zm-widget", "zm-asset-file"],
        _widgetAttributeAssetKey: "zm-asset",
        _widgetAttributeType: "zm-widget",
        _widgets: [],
        _rootEl: null,
        _merchantId: null,
        _merchant_GA_Enable: null,
        _environment: ["dev", "sandbox", "production"],
        _apiEndpoint: {
            dev: "http://api.dev1.zipmoney.com.au/v1/",
            sandbox: "https://api.sandbox.zipmoney.com.au/v1/",
            production: "https://api.zipmoney.com.au/v1/"
        },
        _iframeLib: {
            dev: "https://account.dev1.zipmoney.com.au/scripts/iframe/zipmoney-checkout.js",
            sandbox: "https://account.sandbox.zipmoney.com.au/scripts/iframe/zipmoney-checkout.js",
            production: "https://account.zipmoney.com.au/scripts/iframe/zipmoney-checkout.js"
        },
        _apiEndpointUrl: null,
        _iframeLibUrl: null,
        _zipMoneyCheckout: null,
        _loadFancybox: null,
        _init: function(e, i) {
            this.options = t.extend({}, this.options, e);
            var n = this;
            this._rootEl = i, n._ready(n)
        },
        registerWidget: function(e, i, n) {
            this._widgets.push({
                "class": e,
                name: i,
                attributes: n
            });
            var s = this;
            t.each(n, function(e, t) {
                s._allowedAttributes.push(t)
            })
        },
        _ready: function(e) {
            var n, s = t(e._rootEl),
                o = t("[zm-merchant] , [data-zm-merchant]"),
                a = t("[zm-asset-path] , [data-zm-asset-path]");
            try {
                if (s.length) e._merchantId = s.attr("merchant");
                else if (o && o.length) e._merchantId = o.attr("zm-merchant"), e._merchantId || (e._merchantId = o.attr("data-zm-merchant")), s = o;
                else if (a && a.length) {
                    var r = a.attr("zm-asset-path");
                    r || (r = a.attr("data-zm-asset-path")), s = a, n = t.get(r, function(t) {
                        e._assets = t.assets, e._assetValues = t.asset_values
                    })
                } else console.log("zipMoney Merchant Id not provided");
                if (e._merchantId) {
                    var l = s.attr("data-fancybox");
                    l = !l || "false" !== l, e._loadFancybox = l;
                    var c = s.attr("env"),
                        p = s.attr("data-require-checkout");
                    c || (c = s.attr("data-env")), p = !p || "false" !== p;
                    var d = e._apiEndpoint.dev,
                        u = e._iframeLib.dev;
                    c && t.inArray(c, e._environment) >= 0 && (d = e._apiEndpoint[c], u = e._iframeLib[c]), e._apiEndpointUrl = d, p && t.getScript(u, function() {
                        e._zipMoneyCheckout = zipMoney
                    }), n = t.ajax({
                        url: d + "assets?merchantid=" + e._merchantId,
                        jsonp: "callback",
                        dataType: "jsonp",
                        cache: !0,
                        jsonpCallback: "zipJsonpCallback",
                        success: function(t) {
                            e._assets = t.assets, e._assetValues = t.asset_values, e._settings = t.settings
                        }
                    })
                }
                n !== i ? n.done(function() {
                    e._collectWidgetsEl(e), t.each(e._assetValues, function(t, i) {
                        "{MerchantName}" === i.key && (e._merchantName = i.value)
                    })
                }) : console.log("Cannot load the assets")
            } catch (h) {
                console.log(h)
            }
        },
        _collectWidgetsEl: function(e) {
            e._widgetElList = t("[" + e._widgetAttributeType + "],[data-" + e._widgetAttributeType + "]"), e._widgetElList.each(function(t, i) {
                e._createWidget(i, e)
            })
        },
        _createWidget: function(e, n) {
            var s, o, a;
            o = t(e).attr(n._widgetAttributeType), o || (o = t(e).attr("data-" + n._widgetAttributeType)), o === i && console.log("ZipMoney Widget type is not defined");
            var r, l = n._getWidgetClass(o);
            s = {};
            for (var c = 0; c < n._allowedAttributes.length; c++) r = t(e).attr(n._allowedAttributes[c]), r || (r = t(e).attr("data-" + n._allowedAttributes[c])), r !== i && (s[n._allowedAttributes[c].replace(new RegExp("zm-", "g"), "").replace(new RegExp("-", "g"), "_")] = r);
            a = new l["class"](s, e, n), a._render()
        },
        _getWidgetClass: function(e) {
            var i;
            return t.each(this._widgets, function(t, n) {
                n.name === e && (i = n)
            }), i
        },
        addPopupToGroup: function(e) {
            e.type = "iframe", this.options.popupGroup.push(e)
        },
        _getAsset: function(e) {
            var i, n = [],
                s = this,
                o = 0;
            return (i = this._getAssetFromCache(e)) ? i : ("undefined" != typeof this._assets && (t.each(this._assets, function(t, i) {
                i.type === e && (n[o] = i, o++)
            }), o = 0, n = n.sort(function(e, t) {
                return e.sequence - t.sequence
            }), t.each(n, function(e, t) {
                switch (t.content_type) {
                    case "html":
                        n[e] = s._processHtml(t);
                        break;
                    case "text":
                        n[e] = s._processText(t);
                        break;
                    case "image":
                        n[e] = s._processImage(t)
                }
            }), this.options.assetsCache[e] = n), n)
        },
        _getAssetFromCache: function(e) {
            return this.options.assetsCache[e] !== i && this.options.assetsCache[e]
        },
        _processImage: function(e) {
            var t = '<img src="' + e.url.replace(new RegExp("http:", "g"), "") + '">';
            return e.value = t, e.is_promise = !1, e
        },
        _processHtml: function(e) {
            var i = this;
            return e.is_promise = !1, e.url && (e.promise = t.get(e.url.replace(new RegExp("http:", "g"), "")).then(function(n) {
                return t.each(i._getReplaceValues(e.asset_values), function(e, t) {
                    t.key && t.value && (n = n.replace(new RegExp(t.key, "g"), t.value), n = n.replace(new RegExp("http:", "g"), ""))
                }), e.value = n, e
            }), e.is_promise = !0), e
        },
        _processText: function(e) {
            var i = this;
            return e.value && t.each(i._getReplaceValues(e.asset_values), function(t, i) {
                i.key && i.value && (e.value = e.value.replace(i.key, i.value))
            }), e.is_promise = !1, e
        },
        _getReplaceValues: function(e) {
            var n, s, o, a;
            return e && t.isArray(e) || (e = []), this._assetValues && t.isArray(this._assetValues) || (this._assetValues = []), !e || e === i || e.length <= 0 ? n = this._assetValues : (o = [], a = 0, t.each(e, function(e, i) {
                s = !1, t.each(this._assetValues, function(e, n) {
                    i.key === n.key && (this._assetValues[e] = t.merge(n, i), s = !0, a++)
                }), s && (o[a] = i)
            }), n = t.merge(this._assetValues, o)), n
        },
        _renderInIframe: function(e, i) {
            var n = t("<iframe>", {
                frameborder: 0,
                scrolling: "no",
                width: "100%",
                height: "auto"
            });
            const s = function() {
                var e = t(n).contents().find("body").css("height");
                e && t(n).height(e)
            };
            return n.on("load", function() {
                t(this).contents().find("body").attr({
                    style: "height: auto !important;"
                }).append(e);
                setTimeout(function() {
                    s()
                }, 100)
            }), i.append(n), t(n).contents().find("img,script,style").on("load", n, function() {
                s()
            }), new ResizeSensor(t(n).contents().find("body"), function() {
                s()
            }), n
        },
        setup: function(e, t) {
            this._init(e, t)
        }
    }, e.$zmJs = new n, t(function() {
        e.$zmJs.setup({}, "zipmoney")
    })
}(window, window.jQuery),
function(e, t, i) {
    "use strict";
    var n = function(e, n, s) {
        this.options = e, this.superObj = s, this.el = n, this._render = function() {
            try {
                var e = "https://static.zipmoney.com.au/logo/90px/zip.png",
                    n = "",
                    s = "zipPay",
                    o = "own it now, pay later",
                    a = this.superObj._assets;
                this.superObj._settings && this.superObj._settings.product_classification && (s = this.superObj._settings.product_classification, "zipmoney" === s.toLowerCase() && (e = "https://static.zipmoney.com.au/logo/90px/zip.png")), this.options.logo !== i && (e = this.options.logo), this.options.tagline !== i && (o = this.options.tagline), t.each(a, function(e, t) {
                    "checkouttitle" === t.type && (o = t.value)
                }), t(this.el).removeAttr("data-zm-widget"), t(this.el).removeAttr("data-zm-popup-asset"), t(this.el).removeAttr("data-zm-amount"), t(this.el).removeAttr("zm-widget"), t(this.el).removeAttr("zm-popup-asset"), t(this.el).removeAttr("zm-amount"), t(this.el).addClass("zip_tagline"), t(this.el).attr("data-zm-widget", "popup"), t(this.el).attr("data-zm-popup-asset", "termsdialog"), e && (n = "<img src='" + e + "' height='30' style='vertical-align:middle;height:30px !important' alt='zip'>");
                var r = n + "<span style='min-width:2px;background:#00aeb8;border-radius:2px;margin-left:8px;margin-right:8px;height:27px;display:inline-block;vertical-align:middle'></span><span class='zip_tagline_text'>" + o + " </span>",
                    l = /learn more/i,
                    c = /more/i,
                    p = /more info/i;
                !(l.test(t(this.el).next().text()) || c.test(t(this.el).next().text()) || p.test(t(this.el).next().text())) || "popup" !== t(this.el).next().attr("zm-widget") && "popup" !== t(this.el).next().attr("data-zm-widget") || (this.options.info = "true", t(this.el).next().remove()), this.options.info !== i && "true" === this.options.info && (r += "<a class='zip-info' style='padding-left:5px;font-size:11px;display:inline !important;cursor:pointer;text-decoration:underline'>learn more</a>");
                var d = t(this.el).append(r);
                this.superObj._createWidget(t(this.el), this.superObj), t(this.el).css("display", "inline"), this.options.info !== i && "true" === this.options.info && d.children(".zip-info").css("display", "inline")
            } catch (u) {
                console.log(u)
            }
        }
    };
    e.$zmJs !== i && e.$zmJs.registerWidget(n, "repaycalc", ["zm-min-monthly-payment", "zm-amount", "zm-logo", "zm-info", "zm-tagline"])
}(window, window.jQuery),
function(e, t, i) {
    "use strict";
    var n = function(e, i, n) {
        this.options = e, this.superObj = n, this.el = i, this._render = function() {
            try {
                var e, i = this.superObj._getAsset(this.options.asset),
                    n = this;
                t.each(i, function(i, s) {
                    s.is_promise ? s.promise.done(function() {
                        "html" === s.content_type && "false" !== n.options.iframe ? (e = n.superObj._renderInIframe(s.value, t(n.el)), n.bindApp(e)) : t(n.el).html(s.value)
                    }) : "html" === s.content_type && "false" !== n.options.iframe ? (e = n.superObj._renderInIframe(s.value, t(n.el)), n.bindApp(e)) : t(n.el).html(s.value)
                })
            } catch (s) {
                console.log(s)
            }
        }, this.bindApp = function(e) {
            var i = this;
            e.contents().find("body a.button").click(function(e) {
                "false" !== t(this).data("iframe") && (i.superObj._zipMoneyCheckout.checkout(this.href), e.preventDefault())
            })
        }
    };
    e.$zmJs !== i && e.$zmJs.registerWidget(n, "inline", ["zm-iframe"])
}(window, window.jQuery),
function(e, t, i) {
    "use strict";
    if (t === i) return void console.log("zipMoney Popup widget requires jQuery");
    if (!(t.fn.jquery < 1.7)) {
        var n, s;
        t.fancybox && (n = t.extend(!0, t.fancybox, {})), t.fn.fancybox && (s = t.extend(!0, t.fn.fancybox, {}));
        var o = function() {
                var e, o;
                t.fn.zipModal = t.extend(!0, t.fn.fancybox, {}), t.zipModal = t.extend(!0, t.fancybox, {}), s && (t.fn.fancybox = t.extend(!0, s, {})), n && (t.fancybox = t.extend(!0, n, {})), t.zipModal !== i ? (e = t.zipModal, o = document.createTouch !== i, console.log("Fancybox Version:- " + e.version)) : console.log("Zipmoney Widgets:- Fancybox is not defined"), t.zipModal = t.extend(!0, e, {
                    _loadIframeFancy: function() {
                        this._loadIframe()
                    },
                    _loadIframe: function() {
                        var i = e.coming,
                            n = t(i.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", o ? "auto" : i.iframe.scrolling);
                        "zipmoney-widgets-fancybox" !== i.wrapCSS && n.attr("src", i.href), t(i.wrap).bind("onReset", function() {
                            try {
                                t(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                            } catch (e) {}
                        }), i.iframe.preload && (e.showLoading(), n.one("load", function() {
                            t(this).attr("data-ready", 1), i.content = t(this), "zipmoney-widgets-fancybox" === i.wrapCSS && (t(this).contents().find("body").html(t(i.href).contents().find("body").html()), t(i.href).hide()), o || t(this).bind("load.fb", e.update), t(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), e._afterLoad()
                        })), i.content = n.appendTo(i.inner), i.iframe.preload || e._afterLoad()
                    }
                })
            },
            a = function(e, n, s) {

                this.options = e, this.superObj = s, this.el = n, this.superObj._loadFancybox ? (this.superObj._loadFancybox = !1, t("<link>").appendTo("head").attr({
                    type: "text/css",
                    rel: "stylesheet"
                }).attr("href", "//d3k1w8lx8mqizo.cloudfront.net/lib/js/fancybox/dist/css/jquery.fancybox.css"), t.fancybox === i || "3.2.10" !== t.fancybox.version ? t.getScript("//d3k1w8lx8mqizo.cloudfront.net/lib/js/fancybox/dist/js/jquery.fancybox.pack11.js", o) : (console.log("Skipping fancybox loading. Fancybox already loaded."), o())) : t.fancybox !== i && o(), this.popupGroup = [], this.addPopupToGroup = function(e) {
                    e.type = "iframe", this.popupGroup.push(e)
                }, this._render = function() {
                    try {
                        var e, i = this.superObj._getAsset(this.options.asset),
                            n = this.superObj._getAsset(this.options.popup_asset),
                            s = this;
                        t.each(i, function(i, n) {
                            n.is_promise ? n.promise.done(function() {
                                "html" === n.content_type && "false" !== s.options.iframe ? (e = s.superObj._renderInIframe(n.value, t(s.el)), e.contents().find("body").on("click", function() {
                                    s._fancybox(s)
                                })) : t(s.el).append(n.value)
                            }) : "html" === n.content_type && "false" !== s.options.iframe ? (e = s.superObj._renderInIframe(n.value, t(s.el)), e.contents().find("body").on("click", function() {
                                s._fancybox(s)
                            })) : t(s.el).append(n.value)
                        });
                        var o, a;
                        t.each(n, function(e, i) {
                            i.is_promise && i.promise.done(function() {
                                a = s.options.popup_asset + "-" + e, o = t("#" + a), o.length || (o = t("<iframe>", {
                                    frameborder: 0,
                                    scrolling: "no",
                                    width: "100%",
                                    height: "auto"
                                }), o.attr("id", a), o.on("load", function() {
                                    t(this).contents().find("body").append(i.value);
                                    var e = t(this).contents().find("body").outerHeight(),
                                        n = t(this).contents().find("body").outerWidth();
                                    t(this).width(n), t(this).height(e)
                                }), o.hide(), t("body").append(o)), i.childEl = o, i.childId = a, s.addPopupToGroup({
                                    href: "#" + a,
                                    autoSize: !0,
                                    autoResize: !0,
                                    fitToView: !0,
                                    wrapCSS: "zipmoney-widgets-fancybox",
                                    childEl: o,
                                    asset: i
                                })
                            })
                        }), t(s.el).css("display", "block"), t(s.el).click(function() {
                            s._fancybox(s)
                        })
                    } catch (r) {
                        console.log(r)
                    }
                }, this._fancybox = function(e) {

                  t.fancybox.open({
                    src  : '#zippay',
                    type : 'inline',
                    opts : {
                      afterShow : function( instance, current ) {
                        console.info('done!');
                      }
                    }
                  });

                    //t.zipModal !== i ? (console.log("Rendering fancybox using fancybox version:- " + t.zipModal.version), t.zipModal(e.popupGroup)) : console.log("Zipmoney Widgets:- Fancybox is not defined")
                }
            };
        e.$zmJs !== i && e.$zmJs.registerWidget(a, "popup", ["zm-popup-asset"])
    }
}(window, window.jQuery),
function(e, t, i) {
    "use strict";
    var n = function(e, n, s) {
        this.options = e, this.superObj = s, this.el = n, this._render = function() {
            try {
                var e = this.superObj._assets,
                    n = "https://static.zipmoney.com.au/logo/90px/zip.png",
                    s = "",
                    o = "zipPay",
                    a = "Own it now, pay later";
                this.superObj._settings && this.superObj._settings.product_classification && (o = this.superObj._settings.product_classification, "zipmoney" === o.toLowerCase() && (n = "https://static.zipmoney.com.au/logo/90px/zip.png")), this.options.logo !== i && (n = this.options.logo), this.options.tagline !== i && (a = this.options.tagline), t.each(e, function(e, t) {
                    "checkouttitle" === t.type && (a = t.value)
                }), t(this.el).removeAttr("data-zm-widget"), t(this.el).removeAttr("data-zm-popup-asset"), t(this.el).removeAttr("data-zm-amount"), t(this.el).removeAttr("zm-widget"), t(this.el).removeAttr("zm-popup-asset"), t(this.el).removeAttr("zm-amount"), t(this.el).addClass("zip_tagline"), t(this.el).attr("data-zm-widget", "popup"), t(this.el).attr("data-zm-popup-asset", "termsdialog"), n && (s = "<img src='" + n + "' height='30' style='vertical-align:middle;height:30px !important' alt='zip'>");
                var r = s + "<span style='min-width:2px;background:#00aeb8;border-radius:2px;margin-left:8px;margin-right:8px;height:27px;display:inline-block;vertical-align:middle'></span><span class='zip_tagline_text'>" + a + " </span>";
                this.options.info !== i && "true" === this.options.info && (r += "<a class='zip-info' style='padding-left:5px;font-size:11px;display:inline !important;cursor:pointer;text-decoration:underline'>learn more</a>");
                var l = t(this.el).append(r);
                this.superObj._createWidget(t(this.el), this.superObj), t(this.el).css("display", "inline"), this.options.info !== i && "true" === this.options.info && l.children(".zip-info").css("display", "inline")
            } catch (c) {
                //console.log(c)
            }
        }
    };
    e.$zmJs !== i && e.$zmJs.registerWidget(n, "tagline", ["zm-logo", "zm-info", "zm-tagline"])
}(window, window.jQuery);
