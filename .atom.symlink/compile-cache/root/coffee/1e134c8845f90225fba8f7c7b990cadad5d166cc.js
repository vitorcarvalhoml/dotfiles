(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, deprecate, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  deprecate = require('grim').deprecate;

  Linter = (function() {
    function Linter(state) {
      var _base;
      this.state = state;
      if ((_base = this.state).scope == null) {
        _base.scope = 'File';
      }
      this.lintOnFly = true;
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.linters = new (require('./linter-registry'))();
      this.editors = new (require('./editor-registry'))();
      this.messages = new (require('./message-registry'))();
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this.subscriptions.add(this.linters.onDidUpdateMessages((function(_this) {
        return function(info) {
          return _this.messages.set(info);
        };
      })(this)));
      this.subscriptions.add(this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.createEditorLinter(editor);
        };
      })(this)));
    }

    Linter.prototype.serialize = function() {
      return this.state;
    };

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      return this.linters.deleteLinter(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.hasLinter(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters.getLinters();
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set({
        linter: linter,
        messages: messages
      });
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages.deleteMessages(linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.publicMessages;
    };

    Linter.prototype.onDidUpdateMessages = function(callback) {
      return this.messages.onDidUpdateMessages(callback);
    };

    Linter.prototype.onDidChangeMessages = function(callback) {
      deprecate("Linter::onDidChangeMessages is deprecated, use Linter::onDidUpdateMessages instead");
      return this.onDidUpdateMessages(callback);
    };

    Linter.prototype.onDidChangeProjectMessages = function(callback) {
      deprecate("Linter::onDidChangeProjectMessages is deprecated, use Linter::onDidChangeMessages instead");
      return this.onDidChangeMessages(callback);
    };

    Linter.prototype.getProjectMessages = function() {
      deprecate("Linter::getProjectMessages is deprecated, use Linter::getMessages instead");
      return this.getMessages();
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      deprecate("Linter::setProjectMessages is deprecated, use Linter::setMessages instead");
      return this.setMessages(linter, messages);
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      deprecate("Linter::deleteProjectMessages is deprecated, use Linter::deleteMessages instead");
      return this.deleteMessages(linter);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble();
        };
      })(this));
      editorLinter.onShouldUpdateLineMessages((function(_this) {
        return function() {
          return _this.views.renderLineMessages(true);
        };
      })(this));
      editorLinter.onShouldLint((function(_this) {
        return function(onChange) {
          return _this.linters.lint({
            onChange: onChange,
            editorLinter: editorLinter
          });
        };
      })(this));
      return editorLinter.onDidDestroy((function(_this) {
        return function() {
          editorLinter.deactivate();
          return _this.messages.deleteEditorMessages(editor);
        };
      })(this));
    };

    Linter.prototype.deactivate = function() {
      this.subscriptions.dispose();
      this.views.destroy();
      this.editors.deactivate();
      this.linters.deactivate();
      this.commands.destroy();
      return this.messages.deactivate();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUR0QixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FMWCxDQUFBOztBQUFBLEVBTUMsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBTkQsQ0FBQTs7QUFBQSxFQVFNO0FBRVMsSUFBQSxnQkFBRSxLQUFGLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTs7YUFBTSxDQUFDLFFBQVM7T0FBaEI7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFIYixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBTmpCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BUFgsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBUmYsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLENBQUMsT0FBQSxDQUFRLG1CQUFSLENBQUQsQ0FBQSxDQUFBLENBVGYsQ0FBQTtB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/linter-plus.coffee