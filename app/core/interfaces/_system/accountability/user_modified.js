//  Accountability - Update User Interface component
//  Directus 6.0

//  (c) RANGER
//  Directus may be freely distributed under the GNU license.
//  For all details and documentation:
//  http://www.getdirectus.com

define([
  'app',
  'core/UIComponent',
  'core/UIView'
], function (app, UIComponent, UIView) {

  'use strict';

  return UIComponent.extend({
    id: 'user_modified',
    dataTypes: ['INT', 'BIGINT'],
    Input: UIView
  });
});