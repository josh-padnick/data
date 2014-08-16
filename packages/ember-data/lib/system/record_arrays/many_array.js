import RecordArray from "ember-data/system/record_arrays/record_array";

/**
  @module ember-data
*/

var get = Ember.get, set = Ember.set;
var map = Ember.EnumerableUtils.map;

function sync(change) {
  change.sync();
}

/**
  A `ManyArray` is a `RecordArray` that represents the contents of a has-many
  relationship.

  The `ManyArray` is instantiated lazily the first time the relationship is
  requested.

  ### Inverses

  Often, the relationships in Ember Data applications will have
  an inverse. For example, imagine the following models are
  defined:

  ```javascript
  App.Post = DS.Model.extend({
    comments: DS.hasMany('comment')
  });

  App.Comment = DS.Model.extend({
    post: DS.belongsTo('post')
  });
  ```

  If you created a new instance of `App.Post` and added
  a `App.Comment` record to its `comments` has-many
  relationship, you would expect the comment's `post`
  property to be set to the post that contained
  the has-many.

  We call the record to which a relationship belongs the
  relationship's _owner_.

  @class ManyArray
  @namespace DS
  @extends DS.RecordArray
*/
export default RecordArray.extend({
  init: function() {
    this._super.apply(this, arguments);
  },

  /**
    The property name of the relationship

    @property {String} name
    @private
  */
  name: null,

  /**
    The record to which this relationship belongs.

    @property {DS.Model} owner
    @private
  */
  owner: null,

  /**
    `true` if the relationship is polymorphic, `false` otherwise.

    @property {Boolean} isPolymorphic
    @private
  */
  isPolymorphic: false,

  // LOADING STATE

  isLoaded: false,

   /**
     The relationship which manages this array.

     @property {DS.Model} owner
     @private
   */

  relationship: null,


  /**
    Used for async `hasMany` arrays
    to keep track of when they will resolve.

    @property {Ember.RSVP.Promise} promise
    @private
  */
  promise: null,

  /**
    @method loadingRecordsCount
    @param {Number} count
    @private
  */
  loadingRecordsCount: function(count) {
    this.loadingRecordsCount = count;
  },

  /**
    @method loadedRecord
    @private
  */
  loadedRecord: function() {
    this.loadingRecordsCount--;
    if (this.loadingRecordsCount === 0) {
      set(this, 'isLoaded', true);
      this.trigger('didLoad');
    }
  },

  replaceContent: function(idx, amt, objects){
    var records;
    if (amt > 0){
      records = get(this, 'content').slice(idx, idx+amt);
      this.get('relationship').removeRecords(records);
    }
    if (objects){
      this.get('relationship').addRecords(objects);
    }
  },

  arrangedContentDidChange: function(index, removed, added) {
    var records = get(this, 'content').slice(index, index+added);
    this.get('relationship').addRecords(records);
    //this._super.apply(this, arguments);
  },

  arrangedContentWillChange: function(index, removed, added) {
     return this._super.apply(this, arguments);
  },



  /**
    Create a child record within the owner

    @method createRecord
    @private
    @param {Object} hash
    @return {DS.Model} record
  */
  createRecord: function(hash) {
    var owner = get(this, 'owner');
    var store = get(owner, 'store');
    var type = get(this, 'type');
    var record;

    Ember.assert("You cannot add '" + type.typeKey + "' records to this polymorphic relationship.", !get(this, 'isPolymorphic'));

    record = store.createRecord.call(store, type, hash);
    this.pushObject(record);

    return record;
  }
});
