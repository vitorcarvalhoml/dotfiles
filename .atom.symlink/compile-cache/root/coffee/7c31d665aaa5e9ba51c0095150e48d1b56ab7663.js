(function() {
  var CompositeDisposable, EditorLinter, EditorRegistry, Emitter, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = require('./editor-linter');

  EditorRegistry = (function() {
    function EditorRegistry() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.editorLinters = new Map();
    }

    EditorRegistry.prototype.create = function(textEditor) {
      var editorLinter;
      this.editorLinters.set(textEditor, editorLinter = new EditorLinter(textEditor));
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          _this.editorLinters["delete"](textEditor);
          return editorLinter.deactivate();
        };
      })(this));
      this.emitter.emit('observe', editorLinter);
      return editorLinter;
    };

    EditorRegistry.prototype.forEach = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    EditorRegistry.prototype.ofTextEditor = function(editor) {
      return this.editorLinters.get(editor);
    };

    EditorRegistry.prototype.ofActiveTextEditor = function() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    };

    EditorRegistry.prototype.observe = function(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    };

    EditorRegistry.prototype.deactivate = function() {
      this.emitter.dispose();
      this.subscriptions.dispose();
      this.editorLinters.forEach(function(editorLinter) {
        return editorLinter.deactivate();
      });
      return this.editorLinters.clear();
    };

    return EditorRegistry;

  })();

  module.exports = EditorRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLE1BQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFHTTtBQUNTLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsR0FBQSxDQUFBLENBRnJCLENBRFc7SUFBQSxDQUFiOztBQUFBLDZCQUtBLE1BQUEsR0FBUSxTQUFDLFVBQUQsR0FBQTtBQUNOLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLFVBQW5CLEVBQStCLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsVUFBYixDQUFsRCxDQUFBLENBQUE7QUFBQSxNQUNBLFlBQVksQ0FBQyxZQUFiLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDeEIsVUFBQSxLQUFDLENBQUEsYUFBYSxDQUFDLFFBQUQsQ0FBZCxDQUFzQixVQUF0QixDQUFBLENBQUE7aUJBQ0EsWUFBWSxDQUFDLFVBQWIsQ0FBQSxFQUZ3QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsU0FBZCxFQUF5QixZQUF6QixDQUpBLENBQUE7QUFLQSxhQUFPLFlBQVAsQ0FOTTtJQUFBLENBTFIsQ0FBQTs7QUFBQSw2QkFhQSxPQUFBLEdBQVMsU0FBQyxRQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBdUIsUUFBdkIsRUFETztJQUFBLENBYlQsQ0FBQTs7QUFBQSw2QkFnQkEsWUFBQSxHQUFjLFNBQUMsTUFBRCxHQUFBO0FBQ1osYUFBTyxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsTUFBbkIsQ0FBUCxDQURZO0lBQUEsQ0FoQmQsQ0FBQTs7QUFBQSw2QkFtQkEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLGFBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBZCxDQUFQLENBRGtCO0lBQUEsQ0FuQnBCLENBQUE7O0FBQUEsNkJBc0JBLE9BQUEsR0FBUyxTQUFDLFFBQUQsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFULENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFNBQVosRUFBdUIsUUFBdkIsRUFGTztJQUFBLENBdEJULENBQUE7O0FBQUEsNkJBMEJBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBdUIsU0FBQyxZQUFELEdBQUE7ZUFDckIsWUFBWSxDQUFDLFVBQWIsQ0FBQSxFQURxQjtNQUFBLENBQXZCLENBRkEsQ0FBQTthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBZixDQUFBLEVBTFU7SUFBQSxDQTFCWixDQUFBOzswQkFBQTs7TUFKRixDQUFBOztBQUFBLEVBcUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGNBckNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/editor-registry.coffee