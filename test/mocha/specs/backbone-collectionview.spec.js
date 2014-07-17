/* global expect, define, describe, it */
define(function(require) {
  'use strict';

  var CollectionView = require('backbone-collectionview');

  describe('CollectionView', function() {
    it('imports without throwing', function() {
      expect(CollectionView).not.to.be.undefined;
    });
  });
});
