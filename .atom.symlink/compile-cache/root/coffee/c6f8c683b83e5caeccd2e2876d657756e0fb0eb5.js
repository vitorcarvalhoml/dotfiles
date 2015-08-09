(function() {
  var CompositeDisposable, Emitter, MessageRegistry, TextEditor, helpers, validate, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  validate = require('./validate');

  helpers = require('./helpers');

  MessageRegistry = (function() {
    function MessageRegistry() {
      this.updated = false;
      this.publicMessages = [];
      this.subscriptions = new CompositeDisposable();
      this.emitter = new Emitter;
      this.linterResponses = new Map();
      this.editorMessages = new Map();
      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', (function(_this) {
        return function(ignoredMessageTypes) {
          return _this.ignoredMessageTypes = ignoredMessageTypes;
        };
      })(this)));
      this.shouldUpdatePublic = true;
      helpers.requestUpdateFrame((function(_this) {
        return function() {
          return _this.updatePublic();
        };
      })(this));
    }

    MessageRegistry.prototype.set = function(_arg) {
      var e, editor, linter, messages;
      linter = _arg.linter, messages = _arg.messages, editor = _arg.editor;
      try {
        validate.messages(messages);
      } catch (_error) {
        e = _error;
        return helpers.error(e);
      }
      messages = messages.filter((function(_this) {
        return function(entry) {
          return _this.ignoredMessageTypes.indexOf(entry.type) === -1;
        };
      })(this));
      if (linter.scope === 'project') {
        this.linterResponses.set(linter, messages);
      } else {
        if (!editor.alive) {
          return;
        }
        if (!(editor instanceof TextEditor)) {
          throw new Error("Given editor isn't really an editor");
        }
        if (!this.editorMessages.has(editor)) {
          this.editorMessages.set(editor, new Map());
        }
        this.editorMessages.get(editor).set(linter, messages);
      }
      return this.updated = true;
    };

    MessageRegistry.prototype.updatePublic = function() {
      var added, currentKeys, lastKeys, publicMessages, removed;
      if (!this.shouldUpdatePublic) {
        return;
      }
      if (this.updated) {
        this.updated = false;
        publicMessages = [];
        added = [];
        removed = [];
        this.linterResponses.forEach(function(messages) {
          return publicMessages = publicMessages.concat(messages);
        });
        this.editorMessages.forEach(function(linters) {
          return linters.forEach(function(messages) {
            return publicMessages = publicMessages.concat(messages);
          });
        });
        currentKeys = publicMessages.map(function(i) {
          return i.key;
        });
        lastKeys = publicMessages.map(function(i) {
          return i.key;
        });
        publicMessages.forEach(function(i) {
          if (lastKeys.indexOf(i) === -1) {
            return added.push(i);
          }
        });
        this.publicMessages.forEach(function(i) {
          if (currentKeys.indexOf(i) === -1) {
            return removed.push(i);
          }
        });
        this.publicMessages = publicMessages;
        this.emitter.emit('did-update-messages', {
          added: added,
          removed: removed,
          messages: publicMessages
        });
      }
      return helpers.requestUpdateFrame((function(_this) {
        return function() {
          return _this.updatePublic();
        };
      })(this));
    };

    MessageRegistry.prototype.onDidUpdateMessages = function(callback) {
      return this.emitter.on('did-update-messages', callback);
    };

    MessageRegistry.prototype.deleteMessages = function(linter) {
      if (this.linterResponses.has(linter)) {
        this.updated = true;
        return this.linterResponses["delete"](linter);
      }
    };

    MessageRegistry.prototype.deleteEditorMessages = function(editor) {
      if (this.editorMessages.has(editor)) {
        this.updated = true;
        return this.editorMessages["delete"](editor);
      }
    };

    MessageRegistry.prototype.deactivate = function() {
      this.shouldUpdatePublic = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      return this.editorMessages.clear();
    };

    return MessageRegistry;

  })();

  module.exports = MessageRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBNkMsT0FBQSxDQUFRLE1BQVIsQ0FBN0MsRUFBQyxlQUFBLE9BQUQsRUFBVSxrQkFBQSxVQUFWLEVBQXNCLDJCQUFBLG1CQUF0QixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUZWLENBQUE7O0FBQUEsRUFJTTtBQUNTLElBQUEseUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEVBRGxCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsbUJBQUEsQ0FBQSxDQUZyQixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUhYLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsR0FBQSxDQUFBLENBSnZCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsR0FBQSxDQUFBLENBTHRCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBcEIsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDRCQUFwQixFQUFrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxtQkFBRCxHQUFBO2lCQUNuRSxLQUFDLENBQUEsbUJBQUQsR0FBdUIsb0JBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEs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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/message-registry.coffee