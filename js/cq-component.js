(function ($) {
    "use strict";

    function cqComponent(elements, options) {
        options = $.extend({}, cqComponent.defaults, options);
        elements = elements || options.componentSelector;

        $(elements).each(function () {
            var componentElement = $(this),
                componentOptions = componentElement.data(options.dataAttribute),
                componentName = componentOptions.component;

            if (componentName in cqComponent.fn) {
                var component = new cqComponent.fn[componentName](componentElement, componentOptions);

                componentElement.data("component", component);
            }
        });
    }

    cqComponent.defaults = {
        componentSelector: "[data-component]",
        dataAttribute: "component"
    };

    cqComponent.fn = {};

    cqComponent.update = function () {
        $(window).trigger("update");
    };

    window.cqComponent = cqComponent;

    $(function () {
        window.cqComponent();
    });

})(jQuery);