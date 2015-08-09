(function() {
  var Emitter, LinterRegistry, helpers, validate;

  Emitter = require('atom').Emitter;

  validate = require('./validate');

  helpers = require('./helpers');

  LinterRegistry = (function() {
    function LinterRegistry() {
      this.linters = [];
      this.locks = {
        Regular: new WeakSet,
        Fly: new WeakSet
      };
      this.emitter = new Emitter;
    }

    LinterRegistry.prototype.getLinters = function() {
      return this.linters.slice();
    };

    LinterRegistry.prototype.hasLinter = function(linter) {
      return this.linters.indexOf(linter) !== -1;
    };

    LinterRegistry.prototype.addLinter = function(linter) {
      var e;
      try {
        validate.linter(linter);
        return this.linters.push(linter);
      } catch (_error) {
        e = _error;
        return helpers.error(e);
      }
    };

    LinterRegistry.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      return this.linters.splice(this.linters.indexOf(linter), 1);
    };

    LinterRegistry.prototype.lint = function(_arg) {
      var editor, editorLinter, lockKey, onChange, scopes;
      onChange = _arg.onChange, editorLinter = _arg.editorLinter;
      editor = editorLinter.editor;
      lockKey = onChange ? 'Fly' : 'Regular';
      if (onChange && !atom.config.get('linter.lintOnFly')) {
        return;
      }
      if (editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!editor.getPath()) {
        return;
      }
      if (this.locks[lockKey].has(editorLinter)) {
        return;
      }
      this.locks[lockKey].add(editorLinter);
      scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return this.linters.reduce((function(_this) {
        return function(promise, linter) {
          if (!helpers.shouldTriggerLinter(linter, true, onChange, scopes)) {
            return promise;
          }
          return promise.then(function() {
            return _this.triggerLinter(linter, editor, scopes);
          });
        };
      })(this), Promise.resolve()).then((function(_this) {
        return function() {
          var Promises;
          Promises = _this.linters.map(function(linter) {
            if (!helpers.shouldTriggerLinter(linter, false, onChange, scopes)) {
              return;
            }
            return _this.triggerLinter(linter, editor, scopes);
          });
          return Promise.all(Promises);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.locks[lockKey]["delete"](editorLinter);
        };
      })(this));
    };

    LinterRegistry.prototype.triggerLinter = function(linter, editor, scopes) {
      return new Promise(function(resolve) {
        return resolve(linter.lint(editor));
      }).then((function(_this) {
        return function(results) {
          if (results) {
            return _this.emitter.emit('did-update-messages', {
              linter: linter,
              messages: results,
              editor: editor
            });
          }
        };
      })(this))["catch"](function(e) {
        return helpers.error(e);
      });
    };

    LinterRegistry.prototype.onDidUpdateMessages = function(callback) {
      return this.emitter.on('did-update-messages', callback);
    };

    LinterRegistry.prototype.deactivate = function() {
      this.emitter.dispose();
      return this.linters = [];
    };

    return LinterRegistry;

  })();

  module.exports = LinterRegistry;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FGVixDQUFBOztBQUFBLEVBSU07QUFDUyxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsR0FBQSxDQUFBLE9BQVQ7QUFBQSxRQUNBLEdBQUEsRUFBSyxHQUFBLENBQUEsT0FETDtPQUZGLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BSlgsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBT0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLGFBQU8sSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUEsQ0FBUCxDQURVO0lBQUEsQ0FQWixDQUFBOztBQUFBLDZCQVVBLFNBQUEsR0FBVyxTQUFDLE1BQUQsR0FBQTthQUNULElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUFBLEtBQThCLENBQUEsRUFEckI7SUFBQSxDQVZYLENBQUE7O0FBQUEsNkJBYUEsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsVUFBQSxDQUFBO0FBQUE7QUFDRSxRQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLE1BQWhCLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQsRUFGRjtPQUFBLGNBQUE7QUFHYSxRQUFQLFVBQU8sQ0FBQTtlQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsQ0FBZCxFQUhiO09BRFM7SUFBQSxDQWJYLENBQUE7O0FBQUEsNkJBbUJBLFlBQUEsR0FBYyxTQUFDLE1BQUQsR0FBQTtBQUNaLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxTQUFELENBQVcsTUFBWCxDQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQWlCLE1BQWpCLENBQWhCLEVBQTBDLENBQTFDLEVBRlk7SUFBQSxDQW5CZCxDQUFBOztBQUFBLDZCQXVCQSxJQUFBLEdBQU0sU0FBQyxJQUFELEdBQUE7QUFDSixVQUFBLCtDQUFBO0FBQUEsTUFETSxnQkFBQSxVQUFVLG9CQUFBLFlBQ2hCLENBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxZQUFZLENBQUMsTUFBdEIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFhLFFBQUgsR0FBaUIsS0FBakIsR0FBNEIsU0FEdEMsQ0FBQTtBQUVBLE1BQUEsSUFBVSxRQUFBLElBQWEsQ0FBQSxJQUFRLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBQTNCO0FBQUEsY0FBQSxDQUFBO09BRkE7QUFHQSxNQUFBLElBQWMsTUFBQSxLQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUF4QjtBQUFBLGNBQUEsQ0FBQTtPQUhBO0FBSUEsTUFBQSxJQUFBLENBQUEsTUFBb0IsQ0FBQyxPQUFQLENBQUEsQ0FBZDtBQUFBLGNBQUEsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFVLElBQUMsQ0FBQSxLQUFNLENBQUEsT0FBQSxDQUFRLENBQUMsR0FBaEIsQ0FBb0IsWUFBcEIsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUxBO0FBQUEsTUFPQSxJQUFDLENBQUEsS0FBTSxDQUFBLE9BQUEsQ0FBUSxDQUFDLEdBQWhCLENBQW9CLFlBQXBCLENBUEEsQ0FBQTtBQUFBLE1BUUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUF4QyxDQUF5RSxDQUFDLE1BUm5GLENBQUE7QUFBQSxNQVNBLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQVRBLENBQUE7QUFXQSxhQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ3JCLFVBQUEsSUFBQSxDQUFBLE9BQTZCLENBQUMsbUJBQVIsQ0FBNEIsTUFBNUIsRUFBb0MsSUFBcEMsRUFBMEMsUUFBMUMsRUFBb0QsTUFBcEQsQ0FBdEI7QUFBQSxtQkFBTyxPQUFQLENBQUE7V0FBQTtBQUNBLGlCQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQSxHQUFBO0FBQ2xCLG1CQUFPLEtBQUMsQ0FBQSxhQUFELENBQWUsTUFBZixFQUF1QixNQUF2QixFQUErQixNQUEvQixDQUFQLENBRGtCO1VBQUEsQ0FBYixDQUFQLENBRnFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFJTCxPQUFPLENBQUMsT0FBUixDQUFBLENBSkssQ0FJYSxDQUFDLElBSmQsQ0FJb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QixjQUFBLFFBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxLQUFDLENBQUEsT0FBTyxDQUFDLEdBQVQsQ0FBYSxTQUFDLE1BQUQsR0FBQTtBQUN0QixZQUFBLElBQUEsQ0FBQSxPQUFxQixDQUFDLG1CQUFSLENBQTRCLE1BQTVCLEVBQW9DLEtBQXBDLEVBQTJDLFFBQTNDLEVBQXFELE1BQXJELENBQWQ7QUFBQSxvQkFBQSxDQUFBO2FBQUE7QUFDQSxtQkFBTyxLQUFDLENBQUEsYUFBRCxDQUFlLE1BQWYsRUFBdUIsTUFBdkIsRUFBK0IsTUFBL0IsQ0FBUCxDQUZzQjtVQUFBLENBQWIsQ0FBWCxDQUFBO0FBR0EsaUJBQU8sT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaLENBQVAsQ0FKeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpwQixDQVNOLENBQUMsSUFUSyxDQVNBLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0wsS0FBQyxDQUFBLEtBQU0sQ0FBQSxPQUFBLENBQVEsQ0FBQyxRQUFELENBQWYsQ0FBdUIsWUFBdkIsRUFESztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVEEsQ0FBUCxDQVpJO0lBQUEsQ0F2Qk4sQ0FBQTs7QUFBQSw2QkErQ0EsYUFBQSxHQUFlLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsR0FBQTtBQUNiLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7ZUFDakIsT0FBQSxDQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQUFSLEVBRGlCO01BQUEsQ0FBUixDQUVWLENBQUMsSUFGUyxDQUVKLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNMLFVBQUEsSUFBRyxPQUFIO21CQUFnQixLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxxQkFBZCxFQUFxQztBQUFBLGNBQUMsUUFBQSxNQUFEO0FBQUEsY0FBUyxRQUFBLEVBQVUsT0FBbkI7QUFBQSxjQUE0QixRQUFBLE1BQTVCO2FBQXJDLEVBQWhCO1dBREs7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZJLENBSVYsQ0FBQyxPQUFELENBSlUsQ0FJSCxTQUFDLENBQUQsR0FBQTtlQUFPLE9BQU8sQ0FBQyxLQUFSLENBQWMsQ0FBZCxFQUFQO01BQUEsQ0FKRyxDQUFYLENBRGE7SUFBQSxDQS9DZixDQUFBOztBQUFBLDZCQXNEQSxtQkFBQSxHQUFxQixTQUFDLFFBQUQsR0FBQTtBQUNuQixhQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLHFCQUFaLEVBQW1DLFFBQW5DLENBQVAsQ0FEbUI7SUFBQSxDQXREckIsQ0FBQTs7QUFBQSw2QkF5REEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsQ0FBQSxDQUFBO2FBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUpEO0lBQUEsQ0F6RFosQ0FBQTs7MEJBQUE7O01BTEYsQ0FBQTs7QUFBQSxFQW9FQSxNQUFNLENBQUMsT0FBUCxHQUFpQixjQXBFakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/linter-registry.coffee