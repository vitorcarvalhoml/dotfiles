(function() {
  var Decoration, Emitter, idCounter, nextId, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  Emitter = require('event-kit').Emitter;

  idCounter = 0;

  nextId = function() {
    return idCounter++;
  };

  module.exports = Decoration = (function() {
    Decoration.isType = function(decorationProperties, type) {
      if (_.isArray(decorationProperties.type)) {
        if (__indexOf.call(decorationProperties.type, type) >= 0) {
          return true;
        }
        return false;
      } else {
        return type === decorationProperties.type;
      }
    };


    /*
    Section: Construction and Destruction
     */

    function Decoration(marker, minimap, properties) {
      this.marker = marker;
      this.minimap = minimap;
      this.emitter = new Emitter;
      this.id = nextId();
      this.setProperties(properties);
      this.properties.id = this.id;
      this.destroyed = false;
      this.markerDestroyDisposable = this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    }

    Decoration.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.markerDestroyDisposable.dispose();
      this.markerDestroyDisposable = null;
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    Decoration.prototype.isDestroyed = function() {
      return this.destroyed;
    };


    /*
    Section: Event Subscription
     */

    Decoration.prototype.onDidChangeProperties = function(callback) {
      return this.emitter.on('did-change-properties', callback);
    };

    Decoration.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };


    /*
    Section: Decoration Details
     */

    Decoration.prototype.getId = function() {
      return this.id;
    };

    Decoration.prototype.getMarker = function() {
      return this.marker;
    };

    Decoration.prototype.isType = function(type) {
      return Decoration.isType(this.properties, type);
    };


    /*
    Section: Properties
     */

    Decoration.prototype.getProperties = function() {
      return this.properties;
    };

    Decoration.prototype.setProperties = function(newProperties) {
      var oldProperties;
      if (this.destroyed) {
        return;
      }
      oldProperties = this.properties;
      this.properties = newProperties;
      this.properties.id = this.id;
      if (newProperties.type != null) {
        this.minimap.decorationDidChangeType(this);
      }
      return this.emitter.emit('did-change-properties', {
        oldProperties: oldProperties,
        newProperties: newProperties
      });
    };


    /*
    Section: Private methods
     */

    Decoration.prototype.matchesPattern = function(decorationPattern) {
      var key, value;
      if (decorationPattern == null) {
        return false;
      }
      for (key in decorationPattern) {
        value = decorationPattern[key];
        if (this.properties[key] !== value) {
          return false;
        }
      }
      return true;
    };

    return Decoration;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksQ0FIWixDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLFNBQUEsR0FBQTtXQUFHLFNBQUEsR0FBSDtFQUFBLENBSlQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFZSixJQUFBLFVBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxvQkFBRCxFQUF1QixJQUF2QixHQUFBO0FBRVAsTUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsb0JBQW9CLENBQUMsSUFBL0IsQ0FBSDtBQUNFLFFBQUEsSUFBZSxlQUFRLG9CQUFvQixDQUFDLElBQTdCLEVBQUEsSUFBQSxNQUFmO0FBQUEsaUJBQU8sSUFBUCxDQUFBO1NBQUE7QUFDQSxlQUFPLEtBQVAsQ0FGRjtPQUFBLE1BQUE7ZUFJRSxJQUFBLEtBQVEsb0JBQW9CLENBQUMsS0FKL0I7T0FGTztJQUFBLENBQVQsQ0FBQTs7QUFRQTtBQUFBOztPQVJBOztBQVlhLElBQUEsb0JBQUUsTUFBRixFQUFXLE9BQVgsRUFBb0IsVUFBcEIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFVBQUEsT0FDdEIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsRUFBRCxHQUFNLE1BQUEsQ0FBQSxDQUROLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELENB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/minimap/lib/decoration.coffee