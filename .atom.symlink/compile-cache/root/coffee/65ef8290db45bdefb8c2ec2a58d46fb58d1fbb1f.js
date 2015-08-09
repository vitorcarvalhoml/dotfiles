(function() {
  var CompositeDisposable, EditorLinter, Emitter, TextEditor, _ref;

  _ref = require('atom'), TextEditor = _ref.TextEditor, Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = (function() {
    function EditorLinter(editor) {
      this.editor = editor;
      if (!(this.editor instanceof TextEditor)) {
        throw new Error("Given editor isn't really an editor");
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.emitter.emit('did-destroy');
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.emitter.emit('should-lint', false);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition, oldBufferPosition;
          oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition;
          if (newBufferPosition.row !== oldBufferPosition.row) {
            _this.emitter.emit('should-update-line-messages');
          }
          return _this.emitter.emit('should-update-bubble');
        };
      })(this)));
      setImmediate((function(_this) {
        return function() {
          return _this.subscriptions.add(_this.editor.onDidStopChanging(function() {
            return setImmediate(function() {
              return _this.emitter.emit('should-lint', true);
            });
          }));
        };
      })(this));
    }

    EditorLinter.prototype.lint = function(onChange) {
      if (onChange == null) {
        onChange = false;
      }
      return this.emitter.emit('should-lint', onChange);
    };

    EditorLinter.prototype.onShouldUpdateBubble = function(callback) {
      return this.emitter.on('should-update-bubble', callback);
    };

    EditorLinter.prototype.onShouldUpdateLineMessages = function(callback) {
      return this.emitter.on('should-update-line-messages', callback);
    };

    EditorLinter.prototype.onShouldLint = function(callback) {
      return this.emitter.on('should-lint', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      return this.deactivate();
    };

    EditorLinter.prototype.deactivate = function() {
      this.emitter.dispose();
      return this.subscriptions.dispose();
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUEsT0FBNkMsT0FBQSxDQUFRLE1BQVIsQ0FBN0MsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQUFiLEVBQXNCLDJCQUFBLG1CQUF0QixDQUFBOztBQUFBLEVBRU07QUFDUyxJQUFBLHNCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBOEQsSUFBQyxDQUFBLE1BQUQsWUFBbUIsVUFBakYsQ0FBQTtBQUFBLGNBQVUsSUFBQSxLQUFBLENBQU0scUNBQU4sQ0FBVixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BRFgsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUZqQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RDLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGFBQWQsRUFEc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFuQixDQUhBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBa0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkLEVBQTZCLEtBQTdCLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxD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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/editor-linter.coffee