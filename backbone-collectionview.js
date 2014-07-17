// UMD configuration
// @see https://github.com/umdjs/umd

/* global define */

(function(root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. register as an anonymous module.
    define([
      'underscore',
      'backbone',
      'backbone-layout',
      'jquery',
      'exports'
    ], function(_, Backbone, BackboneLayout, $, exports) {
      factory(root, exports, _, Backbone, BackboneLayout, $);
    });
  } else {
    // Browser global
    root.BackboneCollectionView = factory(
      root, {}, root._, root.Backbone, root.BackboneLayout, root.jQuery);
  }
}(this, function(root, CollectionView, _, Backbone, BackboneLayout, $) {
  'use strict';

  // Keep this in sync with `package.json` and `bower.json`
  CollectionView.VERSION = '0.0.0';

  // Blah
  // Blah!
  

  return CollectionView;
}));

