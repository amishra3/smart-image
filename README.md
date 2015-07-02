# Smart Image

This showcases the frontend for a generic image component that has following features:

* Loads the rendition in the best possible size, based on the element size
* Knows from the server which rendition sizes are available
* Offers lazy loading as an option (enabled by default)
* Does not load hidden images
* Provides update function and event for forcing a refresh
* Post-init and post-update hooks for customizations
* Automatic initialization by a component manager (```cqComponent```)

## Usage

To display an image that benefits of all the above mentioned features, following is the recommended markup:
```html
<div class="cq-image" data-component='{"component":"cqImage","smartSizes":[100,200,400,800,1000,1400,1800],"smartSources":["img/lighthouse-100.jpg","img/lighthouse-200.jpg","img/lighthouse-400.jpg","img/lighthouse-800.jpg","img/lighthouse-1000.jpg","img/lighthouse-1400.jpg","img/lighthouse-1800.jpg"]}'>
    <noscript><img src="img/lighthouse-800.jpg" width="800" height="535" alt="Lighthouse"/></noscript>
</div>
```

The only mandatory part is the ```data-component``` attribute with a component for the component manager to load for this markup: ```{"component":"cqImage"}```

The other parts of this data attribute specifies are two arrays that provide the image sizes are available from the server for this asset, as well as the corresponding image paths.

The actual image is placed within a ```<noscript>``` element, in order to avoid the browser to load it before the actual ```src``` attribute, while still being SEO friendly, as well as functionnal if scripts are not executed.

It's not required, but improves the lazy loading behavior if the width and a height properties are set, so that the script can know the aspect-ratio of the image.

But the above markup can be customized to quite some extend, and the script should still function. For instance markup can be added inside or outside the ```<noscript>``` element, and the ```data-component``` attribute can be set on an outer ```<div>``` element, or on the ```<img>``` element itself.

## Options

The image component accepts a number of options, which can either be passed individually along in the ```data-component``` JSON, or set globally with a script.

* **loadHidden:** Determines if hidden images are to be loaded. (type: boolean, default: false)
* **noscriptSelector:** The selector for the noscript element to be removed (type: string, default: "noscript")
* **imageSelector:** The selector for the image element (type: string, default: "img")
* **sourceAttribute:** The attribute name for the image source (type: string, default: "src")
* **smartSizes:** If an array of possible sizes is provided, this also enables the smart image loader. (type: array of integers, default: undefined)
* **smartSources:** If smartSizes has been provided, this array must contain exactly the same number of items with the corresponding image URLs (type: array of strings, default: undefined)
* **lazyEnabled:** Determines if smart image loading is active (type: boolean, default: true)
* **lazyThreshold:** Number of pixels below the viewport that images start loading (type: integer, default: 100)
* **lazyEmptyPixel:** URL of an empty pixel image to hide the image while lazy loading (type: string, default: a data URL of an empty pixel gif)
* **lazyLoaderClass:** Class name to add to the image while it is lazy loading, for further styling (type: string, default: "loading")
* **lazyLoaderStyle:** CSS styles to add to the image while it is lazy loading, for hiding the image, while keeping the space it takes (type: object)

#### Customizing with the data-component JSON

Works with an ```<object>``` element as well, but the element name and source attributes have to be configured accordingly:
```html
<noscript data-component='{"component":"cqImage","imageSelector":"object","sourceAttribute":"data","smartSizes":[100,200,400,800,1000,1400,1800],"smartSources":["img/lighthouse-100.jpg","img/lighthouse-200.jpg","img/lighthouse-400.jpg","img/lighthouse-800.jpg","img/lighthouse-1000.jpg","img/lighthouse-1400.jpg","img/lighthouse-1800.jpg"]}'>
    <object data="img/lighthouse-800.jpg" width="800" height="535" alt="Lighthouse"></object>
</noscript>
```

A minimal example, without smart loading of the ideal image size, but with lazy loading:
```html
<noscript data-component='{"component":"cqImage"}'>
    <img src="img/lighthouse-800.jpg" width="800" height="535" alt="Lighthouse"/>
</noscript>
```

Not optimal, omitting the ```<noscript>``` element will make the browser to first load the ```lighthouse-800.jpg``` image, making lazy loading pointless (so disabling it in the config), but smart loading could still be performed to load the proper size:
```html
<img data-component='{"component":"cqImage","lazyEnabled":false,"smartSizes":[100,200,400,800,1000,1400,1800],"smartSources":["img/lighthouse-100.jpg","img/lighthouse-200.jpg","img/lighthouse-400.jpg","img/lighthouse-800.jpg","img/lighthouse-1000.jpg","img/lighthouse-1400.jpg","img/lighthouse-1800.jpg"]}' src="img/lighthouse-800.jpg" width="800" height="535" alt="Lighthouse"/>
```

#### Customizing with JavaScript

Disabling lazy loading altogether:
```javascript
cqComponent.fn.cqImage.defaults.lazyEnabled = false;
```

Manually requesting all components to update, for e.g. after some previously hidden images have been revealed:
```javascript
cqComponent.update();
```

Providing some post-initialization or post-update hooks, for e.g. to enrich the images with further behaviors:
```javascript
cqComponent.fn.cqImage.prototype.postInit = function () {
    console.log(this.element[0]);
}
cqComponent.fn.cqImage.prototype.postUpdate = function () {
    console.log("updated " + this.image.attr("src"));
}
```
