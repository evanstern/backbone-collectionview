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
    ], factory);
  } else {
    // Browser global
    root.BackboneCollectionView = factory(
      root._, root.Backbone, root.BackboneLayout, root.jQuery);
  }
}(this, function(_, Backbone, BackboneLayout, $) {
  'use strict';

  var CollectionView = BackboneLayout.extend({
    // ##tagName
    //
    // By default, the tag is `<ul>`.
    tagName: 'ul',

    // ##initialize
    //
    // There are several special options:
    //
    // * ElementView
    //
    //     A constructor function for the views associated with
    //     this collection's children.
    //
    //     Can be overridden via `viewMapper`.
    //
    // * viewMapper
    //
    //     A function that returns a constructor for a view.
    //
    //     new CollectionView({
    //       viewMapper: function(model) {
    //         if (model.get('name') == 'my-model') {
    //           return MyModelView;
    //         } else {
    //           return AnotherView;
    //         }
    //       }
    //     });/
    initialize: function(options) {
      options = (options || {});
      BackboneLayout.prototype.initialize.call(this, options);

      options.ElementView && (this.ElementView = options.ElementView);
      options.viewMapper && (this.viewMapper = options.viewMapper);

      this.listenTo(this.collection, 'add', this._add);
      this.listenTo(this.collection, 'remove', this._remove);
      this.listenTo(this.collection, 'reset', this._remove);
    },

    // ##_add
    //
    // Creates a view based on the model, registers it, and renders it.
    //
    // It is not advisable to call this method directly.
    _add: function(model, collection, options) {
      var view = this.createView(model);
      this.registerView(view);
      this.renderElement(view);
    },

    // ##_remove
    //
    // Removes a model from the collection and closes/unregisters any related
    // views.
    //
    // It is not advisable to call this method directly.
    _remove: function(/*model, collection, options*/) {
      var views;

      if (arguments.length === 2) {
        views = this.viewManager.getViews();
      } else {
        var model = arguments[0];
        views = this.viewManager.getViewsByModel(model);
      }

      _.each(views, function(view) {
        this.unRegisterView(view);
        this.removeElement(view);
      }, this);
    },

    // ##registerView
    //
    // Extend default functionality to also add the model to the collection if
    // one exists.
    registerView: function(view, options) {
      BackboneLayout.prototype.registerView.call(this, view, options);
      if (view.model) {
        this.collection.add(view.model);
      }
    },

    // ##defaults
    //
    // By default all `CollectionView` objects will contain a reference to a
    // `Backbone.Collection` instance.
    defaults: function() {
      return {
        'collection': new (Backbone.Collection.extend())()
      };
    },

    // ##_getView
    //
    // Return the appropriate view for this model depending on whether or not a
    // `viewMapper` method has been defined.
    _getView: function(model) {
      if (this.viewMapper) {
        return this.viewMapper(model);
      } else {
        return this.ElementView;
      }
    },

    // ##getViewArgs
    //
    // Return the arguments that will be passed to an `ElementView`
    // constructor for the given model.
    //
    // This method is commonly overridden in order to provide customized
    // arguments to `ElementView` instances as they are created by the
    // `createView` method.
    getViewArgs: function(model) {
      return {model: model};
    },

    // ##createView
    //
    // Create the `ElementView` of this model. Delegates the view arguments to
    // the `getViewArgs` method.
    //
    // If a `viewMapper` option was passed in during the initialization then it
    // will be used to figure out what view to display.
    //
    // This method is commonly overridden by sub classes when custom work
    // needs to be done before or after the `ElementView` is created (or if
    // the view needs to be created in some special way).
    createView: function(model) {
      var View = this._getView(model);
      return new View(this.getViewArgs(model));
    },

    // ##add
    //
    // Add a model to the collection.
    //
    // A view of the model will be created, rendered (by default appened to
    // the end of the CollectionView) and the view (if one was created) will
    // be returned.
    add: function(model) {
      this.collection.add(model);

      var views = [];
      if (model.length) {
        _.each(model, function(m) {
          views.push(this.viewManager.getViewsByModel(m));
        }, this);
        views = _.flatten(views);
      } else {
        views = this.viewManager.getViewsByModel(model);
      }
      return views.length === 1 ? views[0] : views;
    },

    // ##remove
    //
    // Removes the model from the collection.
    //
    // The related view (if one exists) will be closed and removed from the
    // DOM.
    remove: function(model) {
      var views = this.viewManager.getViewsByModel(model);
      this.collection.remove(model);
      return views.length === 1 ? views[0] : views;
    },

    // ##empty
    //
    // Remove all models from the collection via `reset`.
    //
    // Unregisters all views. Removes all views from the DOM.
    empty: function() {
      this.collection.reset();
    },

    // ##renderElement
    //
    // Render a view element. By default the view is just added to the end of
    // the parent DOM element, but this can be overridden.
    renderElement: function(view) {
      this.$el.append(view.render().el);
    },

    // ##removeElement
    //
    // Removes the element from the DOM
    removeElement: function(view) {
      if (view.close) {
        view.close();
      } else {
        view.remove();
      }
    }
  });

  CollectionView.VERSION = '0.0.0';

  return CollectionView;
}));

