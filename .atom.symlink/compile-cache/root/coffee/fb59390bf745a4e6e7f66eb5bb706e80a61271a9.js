(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = null;

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
      return Decoration != null ? Decoration : Decoration = require('../decoration');
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorationsForScreenRowRangeByTypeThenRows = function(startScreenRow, endScreenRow) {
      var decoration, decorations, decorationsByMarkerType, marker, range, row, rows, type, _base, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      decorationsByMarkerType = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          range = marker.getScreenRange();
          rows = (function() {
            _results = [];
            for (var _j = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; _ref1 <= _ref2 ? _j++ : _j--){ _results.push(_j); }
            return _results;
          }).apply(this);
          for (_k = 0, _len1 = decorations.length; _k < _len1; _k++) {
            decoration = decorations[_k];
            type = decoration.getProperties().type;
            if (decorationsByMarkerType[type] == null) {
              decorationsByMarkerType[type] = {};
            }
            for (_l = 0, _len2 = rows.length; _l < _len2; _l++) {
              row = rows[_l];
              if ((_base = decorationsByMarkerType[type])[row] == null) {
                _base[row] = [];
              }
              decorationsByMarkerType[type][row].push(decoration);
            }
          }
        }
      }
      return decorationsByMarkerType;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (this.destroyed) {
        return;
      }
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, newEnd, newStart, oldEnd, oldStart, rangesDiffs, start, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
            decorations = _this.decorationsByMarkerId[marker.id];
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            oldStart = event.oldTailScreenPosition;
            oldEnd = event.oldHeadScreenPosition;
            newStart = event.newTailScreenPosition;
            newEnd = event.newHeadScreenPosition;
            if (oldStart.row > oldEnd.row) {
              _ref = [oldEnd, oldStart], oldStart = _ref[0], oldEnd = _ref[1];
            }
            if (newStart.row > newEnd.row) {
              _ref1 = [newEnd, newStart], newStart = _ref1[0], newEnd = _ref1[1];
            }
            rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);
            _results = [];
            for (_j = 0, _len1 = rangesDiffs.length; _j < _len1; _j++) {
              _ref2 = rangesDiffs[_j], start = _ref2[0], end = _ref2[1];
              _results.push(_this.emitRangeChanges({
                start: start,
                end: end
              }, 0));
            }
            return _results;
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.computeRangesDiffs = function(oldStart, oldEnd, newStart, newEnd) {
      var diffs;
      diffs = [];
      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }
      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }
      return diffs;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range, 0);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range, screenDelta) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      if (screenDelta == null) {
        screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      this.decorationUpdatedSubscriptions[decoration.id].dispose();
      this.decorationDestroyedSubscriptions[decoration.id].dispose();
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        delete this.decorationsById[decoration.id];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.removeAllDecorations = function() {
      var decoration, id, sub, _ref, _ref1, _ref2, _ref3, _ref4;
      _ref = this.decorationMarkerChangedSubscriptions;
      for (id in _ref) {
        sub = _ref[id];
        sub.dispose();
      }
      _ref1 = this.decorationMarkerDestroyedSubscriptions;
      for (id in _ref1) {
        sub = _ref1[id];
        sub.dispose();
      }
      _ref2 = this.decorationUpdatedSubscriptions;
      for (id in _ref2) {
        sub = _ref2[id];
        sub.dispose();
      }
      _ref3 = this.decorationDestroyedSubscriptions;
      for (id in _ref3) {
        sub = _ref3[id];
        sub.dispose();
      }
      _ref4 = this.decorationsById;
      for (id in _ref4) {
        decoration = _ref4[id];
        decoration.destroy();
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.decorationDidChangeType = function(decoration) {};

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVDLFVBQVcsT0FBQSxDQUFRLFdBQVIsRUFBWCxPQUZELENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsSUFIYixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLG1DQUdBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTs7UUFDckIsSUFBQyxDQUFBLFVBQVcsR0FBQSxDQUFBO09BQVo7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBRG5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsb0NBQUQsR0FBd0MsRUFIeEMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNDQUFELEdBQTBDLEVBSjFDLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSw4QkFBRCxHQUFrQyxFQUxsQyxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsZ0NBQUQsR0FBb0MsRUFOcEMsQ0FBQTtrQ0FRQSxhQUFBLGFBQWMsT0FBQSxDQUFRLGVBQVIsRUFUTztJQUFBLENBSHZCLENBQUE7O0FBQUEsbUNBcUJBLGtCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLG9CQUFaLEVBQWtDLFFBQWxDLEVBRGtCO0lBQUEsQ0FyQnBCLENBQUE7O0FBQUEsbUNBZ0NBLHFCQUFBLEdB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/minimap/lib/mixins/decoration-management.coffee