(function() {
  var CompositeDisposable, DecorationManagement, Emitter, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  nextModelId = 1;

  module.exports = Minimap = (function() {
    DecorationManagement.includeInto(Minimap);


    /* Public */

    function Minimap(options) {
      var subs;
      if (options == null) {
        options = {};
      }
      this.textEditor = options.textEditor;
      if (this.textEditor == null) {
        throw new Error('Cannot create a minimap without an editor');
      }
      this.id = nextModelId++;
      this.emitter = new Emitter;
      this.subscriptions = subs = new CompositeDisposable;
      this.initializeDecorations();
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.charHeight
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.charWidth
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.interline
          });
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollTop((function(_this) {
        return function(scrollTop) {
          return _this.emitter.emit('did-change-scroll-top', scrollTop);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollLeft((function(_this) {
        return function(scrollLeft) {
          return _this.emitter.emit('did-change-scroll-left', scrollLeft);
        };
      })(this)));
      subs.add(this.textEditor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      subs.add(this.textEditor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.emitter.emit('did-change-config');
        };
      })(this)));
    }

    Minimap.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      this.removeAllDecorations();
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      return this.destroyed = true;
    };

    Minimap.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Minimap.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Minimap.prototype.onDidChangeConfig = function(callback) {
      return this.emitter.on('did-change-config', callback);
    };

    Minimap.prototype.onDidChangeScrollTop = function(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    };

    Minimap.prototype.onDidChangeScrollLeft = function(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    };

    Minimap.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    Minimap.prototype.getTextEditor = function() {
      return this.textEditor;
    };

    Minimap.prototype.getTextEditorScaledHeight = function() {
      return this.textEditor.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.textEditor.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.textEditor.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.displayBuffer.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.textEditor.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.textEditor.getScrollTop() / (this.getTextEditorMaxScrollTop() || 1);
    };

    Minimap.prototype.getCapedTextEditorScrollRatio = function() {
      return Math.min(1, this.getTextEditorScrollRatio());
    };

    Minimap.prototype.getHeight = function() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    };

    Minimap.prototype.getVisibleHeight = function() {
      return Math.min(this.textEditor.getHeight(), this.getHeight());
    };

    Minimap.prototype.getVerticalScaleFactor = function() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    };

    Minimap.prototype.getHorizontalScaleFactor = function() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    };

    Minimap.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    Minimap.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    Minimap.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    Minimap.prototype.getInterline = function() {
      return this.interline;
    };

    Minimap.prototype.getFirstVisibleScreenRow = function() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    };

    Minimap.prototype.getLastVisibleScreenRow = function() {
      return Math.ceil((this.getScrollTop() + this.textEditor.getHeight()) / this.getLineHeight());
    };

    Minimap.prototype.getScrollTop = function() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
    };

    Minimap.prototype.getMaxScrollTop = function() {
      return Math.max(0, this.getHeight() - this.textEditor.getHeight());
    };

    Minimap.prototype.canScroll = function() {
      return this.getMaxScrollTop() > 0;
    };

    Minimap.prototype.getMarker = function(id) {
      return this.textEditor.getMarker(id);
    };

    Minimap.prototype.findMarkers = function(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (_error) {
        return [];
      }
    };

    Minimap.prototype.markBufferRange = function(range) {
      return this.textEditor.markBufferRange(range);
    };

    Minimap.prototype.emitChanges = function(changes) {
      return this.emitter.emit('did-change', changes);
    };

    return Minimap;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGdDQUFSLENBRHZCLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsQ0FIZCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsT0FBakMsQ0FBQSxDQUFBOztBQUVBO0FBQUEsZ0JBRkE7O0FBUWEsSUFBQSxpQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7O1FBRFksVUFBUTtPQUNwQjtBQUFBLE1BQUMsSUFBQyxDQUFBLGFBQWMsUUFBZCxVQUFGLENBQUE7QUFDQSxNQUFBLElBQU8sdUJBQVA7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLDJDQUFOLENBQVYsQ0FERjtPQURBO0FBQUEsTUFJQSxJQUFDLENBQUEsRUFBRCxHQUFNLFdBQUEsRUFKTixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUxYLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUEsR0FBTyxHQUFBLENBQUEsbUJBTnhCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXBCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLGFBQUYsR0FBQTtBQUNuRCxVQURvRCxLQUFDLENBQUEsZ0JBQUEsYUFDckQsQ0FB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/minimap/lib/minimap.coffee