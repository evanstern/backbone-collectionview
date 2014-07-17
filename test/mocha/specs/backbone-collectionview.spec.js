/* global expect, define, describe, it, sinon */
define(function(require) {
  'use strict';

  var CollectionView = require('backbone-collectionview');
  var BackboneLayout = require('backbone-layout');
  var Backbone = require('backbone');
  var _ = require('underscore');
  var TestView = BackboneLayout.extend();

  describe('CollectionView', function() {
    it('imports without throwing', function() {
      expect(CollectionView).not.to.be.undefined;
    });

    it('should default to a `<ul>` tag', function() {
      CollectionView.prototype.tagName.should.equal('ul');
    });

    describe('when initializing', function() {
      it('should use the `ElementView` defined', function() {
        var CView = CollectionView.extend({ElementView: TestView});
        var cView = new CView();
        cView.ElementView.should.equal(TestView);
      });

      it('should have a collection even if none was specified', function() {
        var CView = CollectionView.extend();
        var cView = new CView();
        cView.should.have.property('collection');
        cView.collection.should.be.an.instanceOf(Backbone.Collection);
      });
    });

    describe('when adding a new model', function() {
      var model = new Backbone.Model({foo: 'bar'});
      var CV = CollectionView.extend({ ElementView: TestView });
      var cview = new CV();
      var view = cview.add(model);

      it('should add a new view to the list of views', function() {
        cview.viewManager.getViews().length.should.equal(1);
      });

      it('should return the correct view', function() {
        expect(view).to.be.an.instanceOf(TestView);
      });

      it('should add the model to the collection', function() {
        var _model = cview.collection.last();
        expect(_model).to.equal(model);
      });

      it('should render the view to the end of the list of views', function() {
        cview.$el.children().length.should.equal(1);
      });
    });

    describe('when removing an existing model', function() {
      var CV = CollectionView.extend({ ElementView: TestView });
      var cview = new CV();
      var modelOne = new Backbone.Model({id: 1, foo: 'bar'});
      var modelTwo = new Backbone.Model({id: 2, foo: 'baz'});

      var viewOne = cview.add(modelOne);
      var viewTwo = cview.add(modelTwo);

      var view = cview.remove(modelOne);

      it('should remove the view from the DOM', function() {
        cview.$el.children().length.should.equal(1);
      });

      it('should unregister the view', function() {
        var views = cview.viewManager.getViewsByModel(modelOne);
        views.length.should.equal(0);
      });

      it('should return the removed view', function() {
        expect(view).to.equal(viewOne);
      });
    });

    describe('when emptying the view', function() {
      var CV = CollectionView.extend({ ElementView: TestView });
      var cview = new CV();
      var model = new Backbone.Model({id: 1, foo: 'bar'});
      cview.add(model);

      cview.empty();

      it('should empty the collection', function() {
        cview.collection.length.should.equal(0);
      });

      it('should unregister all views', function() {
        cview.viewManager.getViews().length.should.equal(0);
      });

      it('should remove all views from the DOM', function() {
        cview.$el.children().length.should.equal(0);
      });
    });

    describe('when adding multiple models', function() {
      var modelOne = new Backbone.Model({id: 1, foo: 'bar'});
      var modelTwo = new Backbone.Model({id: 2, foo: 'baz'});
      var CV = CollectionView.extend({ ElementView: TestView });
      var cview = new CV();

      var views = cview.add([modelOne, modelTwo]);

      it('should add the models to the collection', function() {
        cview.collection.length.should.equal(2);
      });

      it('should register the views', function() {
        cview.viewManager.getViews().length.should.equal(2);
      });

      it('should return the correct views', function() {
        var models = _.map(views, function(view) {
          return view.model;
        });
        views.length.should.equal(2);
        models.should.contain(modelOne);
        models.should.contain(modelTwo);
      });
    });

    describe('when using a viewMapper', function() {
      var ViewOne = BackboneLayout.extend();
      var ViewTwo = BackboneLayout.extend();
      var modelOne = new Backbone.Model({id: 1, name: 'modelOne'});
      var modelTwo = new Backbone.Model({id: 2, name: 'modelTwo'});

      var CV = CollectionView.extend({
        viewMapper: function(model) {
          if (model.get('name') === 'modelOne') {
            return ViewOne;
          } else {
            return ViewTwo;
          }
        }
      });

      var cview = new CV();
      var viewMapperSpy = sinon.spy(cview, 'viewMapper');

      cview.add([modelOne, modelTwo]);

      it('should construct the correct views via `viewMapper`', function() {
        viewMapperSpy.returnValues.length.should.equal(2);
        viewMapperSpy.returnValues[0].should.equal(ViewOne);
        viewMapperSpy.returnValues[1].should.equal(ViewTwo);
      });

      it('should register the correct views', function() {
        var view;

        view = cview.viewManager.getViewsByModel(modelOne);
        view.length.should.equal(1);
        view[0].should.be.an.instanceOf(ViewOne);

        view = cview.viewManager.getViewsByModel(modelTwo);
        view.length.should.equal(1);
        view[0].should.be.an.instanceOf(ViewTwo);
      });
    });
  });
});
