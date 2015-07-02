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
                noscriptReplace = " " + options.renamedSourceAttribute + "=",
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
            if (options.enableLazy) {
                addLazyLoader();
                if (isLazyVisible()) {
                    initSmart();
                } else {
                    image.addClass(options.lazyLoaderClass);
                    updateMode = "lazy";
                    setTimeout(that.update, 200);
                    $window.bind("scroll.imageLazy resize.imageLazy update.imageLazy", that.update);
                }
            } else {
                initSmart();
            }
        }

        function initSmart() {
            if (options.enableSmart) {
                updateMode = "smart";
                that.update();
                $window.bind("resize.imageSmart update.imageSmart", that.update);
            } else {
                image
                    .attr(options.sourceAttribute, image.attr(options.renamedSourceAttribute))
                    .removeAttr(options.renamedSourceAttribute);
            }

            if (showsLazyLoader) {
                image.load(removeLazyLoader);
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
                    $window.unbind(".imageLazy", that.update);
                    initSmart();
                }
            } else if (updateMode === "smart") {
                if (element.is(":visible")) {
                    var optimalSize = element.width() * devicePixelRatio,
                        len = options.sizes.length,
                        key = 0;

                    while ((key < len-1) && (options.sizes[key] < optimalSize)) {
                        key++;
                    }

                    if (image.attr(options.sourceAttribute) !== options.images[key]) {
                        image.attr(options.sourceAttribute, options.images[key]);

                        if (e && "postUpdate" in that) {
                            that.postUpdate(e);
                        }
                    }
                }
            }
        }

        element = $(element);
        options = $.extend({}, cqImage.defaults, options);
        init();
    }

    cqImage.defaults = {
        enableSmart: true,
        enableLazy: true,
        noscriptSelector: "noscript",
        imageSelector: "img",
        sourceAttribute: "src",
        renamedSourceAttribute: "data-src-disabled",
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