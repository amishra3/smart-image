(function ($) {
    "use strict";

    var $window = $(window),
        devicePixelRatio = window.devicePixelRatio || 1;

    function cqImage(element, options) {
        var that = this,
            showsLazyLoader = false,
            image,
            updateMode;

        function init() {
            var noscript = element.find(options.noscriptSelector),
                noscriptSearch = " " + options.sourceAttribute + "=",
                noscriptReplace = " data-src-disabled=",
                noscriptText = noscript.text().replace(noscriptSearch, noscriptReplace);

            noscript.replaceWith(noscriptText);

            if (element.is(options.imageSelector)) {
                image = element;
            } else {
                image = element.find(options.imageSelector);
            }

            that.element = element;
            that.options = options;
            that.image = image;

            initLazy();
        }

        function initLazy() {
            if (options.lazyEnabled) {
                addLazyLoader();
                if (isLazyVisible()) {
                    initSmart();
                } else {
                    image.addClass(options.lazyLoaderClass);
                    updateMode = "lazy";
                    setTimeout(that.update, 200);
                    $window.bind("scroll.cqImage resize.cqImage update.cqImage", that.update);
                }
            } else {
                initSmart();
            }
        }

        function initSmart() {
            if (options.smartSizes && options.smartImages) {
                if (console && options.smartSizes.length !== options.smartImages.length) {
                    console.warn("The size of the smartSizes and of the smartImages arrays don't match!");
                } else {
                    updateMode = "smart";
                    that.update();
                    $window.bind("resize.cqImage update.cqImage", that.update);
                }
            } else if (options.loadHidden || element.is(":visible")) {
                image
                    .attr(options.sourceAttribute, image.attr("data-src-disabled"))
                    .removeAttr("data-src-disabled");
            }

            if (showsLazyLoader) {
                image.bind("load.cqImage", removeLazyLoader);
            }

            if ("postInit" in that) {
                that.postInit();
            }
        }

        function addLazyLoader() {
            var width = image.attr("width"),
                height = image.attr("height");

            if (width && height) {
                var ratio = (height / width) * 100,
                    styles = options.lazyLoaderStyle;

                styles["padding-bottom"] = ratio + "%";
                image.css(styles);
            }

            image.attr(options.sourceAttribute, options.lazyEmptyPixel);
            showsLazyLoader = true;
        }

        function removeLazyLoader() {
            image.removeClass(options.lazyLoaderClass);
            $.each(options.lazyLoaderStyle, function (property) {
                image.css(property, ""); // removes the loader styles
            });
            image.unbind(".cqImage", removeLazyLoader);
            showsLazyLoader = false;
        }

        function isLazyVisible() {
            var windowHeight = $window.height(),
                scrollTop = $window.scrollTop(),
                offsetTop = element.offset().top;

            return (windowHeight + scrollTop + options.lazyThreshold > offsetTop);
        }

        that.update = function (e) {
            if (updateMode === "lazy") {
                if (isLazyVisible()) {
                    $window.unbind(".cqImage", that.update);
                    initSmart();
                }
            } else if (updateMode === "smart" && (options.loadHidden || element.is(":visible"))) {
                var optimalSize = element.width() * devicePixelRatio,
                    len = options.smartSizes.length,
                    key = 0;

                while ((key < len-1) && (options.smartSizes[key] < optimalSize)) {
                    key++;
                }

                if (image.attr(options.sourceAttribute) !== options.smartImages[key]) {
                    image.attr(options.sourceAttribute, options.smartImages[key]);

                    if (e && "postUpdate" in that) {
                        that.postUpdate(e);
                    }
                }
            }
        }

        element = $(element);
        options = $.extend({}, cqImage.defaults, options);
        init();
    }

    cqImage.defaults = {
        loadHidden: false,
        noscriptSelector: "noscript",
        imageSelector: "img",
        sourceAttribute: "src",
        lazyEnabled: true,
        lazyThreshold: 100,
        lazyEmptyPixel: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        lazyLoaderClass: "loading",
        lazyLoaderStyle: {
            "height": 0,
            "padding-bottom": "" // will get replaced with ratio in %
        }
    };

    window.cqComponent.fn.cqImage = cqImage;

})(jQuery);