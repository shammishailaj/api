define([
  'app',
  'backbone',
  'core/PreferenceModel'
],
function(app, Backbone, PreferenceModel) {

  "use strict";

  return Backbone.Layout.extend({
    template: Handlebars.compile('\
    <div class="simple-select vertical-center left"> \
      <span class="icon icon-triangle-down"></span> \
      <select id="visibilitySelect" name="status"> \
        <optgroup label="Status"> \
          <option data-status value="1,2">View All</option> \
          <option data-status value="1">View Active</option> \
          <option data-status value="2">View Inactive</option> \
        </optgroup> \
        <optgroup label="Snapshots"> \
          {{#snapshots}} \
          <option data-snapshot value="{{this}}">{{this}}</option> \
          {{/snapshots}} \
        </optgroup> \
      </select> \
    </div> \
    <div class="action vertical-center left" id="saveSnapshotBtn">Save Snapshot</div> \
    <div style="display:none" class="action vertical-center left snapshotOption" id="pinSnapshotBtn">Pin Snapshot</div> \
    <div style="display:none" class="action vertical-center left snapshotOption" id="deleteSnapshotBtn">Delete Snapshot</div>'),

    tagName: 'div',
    attributes: {
      'class': 'tool div-right'
    },

    events: {
      'change #visibilitySelect': function(e) {
        var $target = $(e.target).find(":selected");
        if($target.attr('data-status') !== undefined && $target.attr('data-status') !== false) {
          var value = $(e.target).val();
          this.collection.setFilter({currentPage: 0, active: value});
          this.collection.preferences.save({active: value});
        } else if($target.attr('data-snapshot') !== undefined && $target.attr('data-snapshot') !== false) {
          this.defaultId = this.collection.preferences.get('id');
          this.collection.preferences.fetch({newTitle: $target.val()});
        }
      },
      'click #saveSnapshotBtn': function(e) {
        var name = prompt("Please enter a name for your Snapshot");
        var that = this;
        var exists = false;
        //Check for Duplicate
        this.options.widgetOptions.snapshots.forEach(function(snapshot) {
          if(name == snapshot) {
            alert('A Snapshot With that name already exists!');
            exists = true;
            return;
          }
        });

        if(exists) {
          return;
        }

        if(name === null || name === "") {
          alert('Please Fill In a Valid Name');
          return;
        }

        this.options.widgetOptions.snapshots.push(name);

        //Save id so it can be reset after render
        this.defaultId = this.collection.preferences.get('id');
        //Unset Id so that it creates new Preference
        this.collection.preferences.unset('id');

        this.collection.preferences.set({title: name});

        this.collection.preferences.save();
      }
    },

    serialize: function() {
      return this.options.widgetOptions;
    },

    afterRender: function() {
      $('.snapshotOption').hide();
      if(this.collection.preferences.get('title') !== null) {
        $('#visibilitySelect').val(this.collection.preferences.get('title'));
        this.snapshotId = this.collection.preferences.get('id');
        $('.snapshotOption').show();
        this.collection.preferences.set({title:null, id: this.defaultId});
      } else {
        $('#visibilitySelect').val(this.collection.preferences.get('active'));
      }
    },
    initialize: function() {
      this.collection.preferences.on('sync', function() {
        this.collection.fetch();
        this.render();
      }, this);

      var activeTable = this.collection.table.id;

      this.options.widgetOptions = {snapshots: []};

      var that = this;
      $.get(app.API_URL + "preferences/" + activeTable, null, function(data) {
        data.forEach(function(preference){
          that.options.widgetOptions.snapshots.push(preference.title);
        });
        that.render();
      });
    }
  });
});