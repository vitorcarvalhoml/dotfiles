var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    this.editorMessages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editor = _ref.editor;

      if (linter.deactivated) return;
      try {
        Validate.messages(messages);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        if (!this.editorMessages.has(editor)) this.editorMessages.set(editor, new Map());
        this.editorMessages.get(editor).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.editorMessages.forEach(function (editorMessages) {
        return editorMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.editorMessages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editor) {
      if (!this.editorMessages.has(editor)) return;
      this.editorMessages['delete'](editor);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.editorMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBQ3VELE1BQU07O0FBRDdELFdBQVcsQ0FBQTs7QUFHWCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDdEMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztJQUU5QixlQUFlO0FBQ1IsV0FEUCxlQUFlLEdBQ0w7OzswQkFEVixlQUFlOztBQUVqQixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtBQUN6QixRQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUUvQixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsVUFBQSxLQUFLO2FBQUksTUFBSyxtQkFBbUIsR0FBSSxLQUFLLElBQUksRUFBRSxBQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUE7O0FBRTVILFFBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsR0FBUztBQUMzQixVQUFJLE1BQUssYUFBYSxFQUFFO0FBQ3RCLFlBQUksTUFBSyxVQUFVLEVBQUU7QUFDbkIsZ0JBQUssVUFBVSxHQUFHLEtB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LE1BQU0sRUFBRTtBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTTtBQUM1QyxVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7S0FDdkI7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7QUFDMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDNUI7OztTQS9GRyxlQUFlOzs7QUFrR3JCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbmltcG9ydCB7RW1pdHRlciwgVGV4dEVkaXRvciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcblxuY29uc3QgVmFsaWRhdGUgPSByZXF1aXJlKCcuL3ZhbGlkYXRlJylcbmNvbnN0IEhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuXG5jbGFzcyBNZXNzYWdlUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZVxuICAgIHRoaXMuc2hvdWxkUmVmcmVzaCA9IHRydWVcbiAgICB0aGlzLnB1YmxpY01lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaWdub3JlZE1lc3NhZ2VUeXBlcycsIHZhbHVlID0+IHRoaXMuaWdub3JlZE1lc3NhZ2VUeXBlcyA9ICh2YWx1ZSB8fCBbXSkpKVxuXG4gICAgY29uc3QgVXBkYXRlTWVzc2FnZXMgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zaG91bGRSZWZyZXNoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZVxuICAgICAgICAgIHRoaXMudXBkYXRlUHVibGljKClcbiAgICAgICAgfVxuICAgICAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgICAgIH1cbiAgICB9XG4gICAgSGVscGVycy5yZXF1ZXN0VXBkYXRlRnJhbWUoVXBkYXRlTWVzc2FnZXMpXG4gIH1cbiAgc2V0KHtsaW50ZXIsIG1lc3NhZ2VzLCBlZGl0b3J9KSB7XG4gICAgaWYgKGxpbnRlci5kZWFjdGl2YXRlZCkgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIFZhbGlkYXRlLm1lc3NhZ2VzKG1lc3NhZ2VzKVxuICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIEhlbHBlcnMuZXJyb3IoZSkgfVxuICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKGkgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzLmluZGV4T2YoaS50eXBlKSA9PT0gLTEpXG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICBpZiAoIWVkaXRvci5hbGl2ZSkgcmV0dXJuXG4gICAgICBpZiAoIShlZGl0b3IgaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSkgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4gZWRpdG9yIGlzbid0IHJlYWxseSBhbiBlZGl0b3JcIilcbiAgICAgIGlmICghdGhpcy5lZGl0b3JNZXNzYWdlcy5oYXMoZWRpdG9yKSlcbiAgICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5zZXQoZWRpdG9yLCBuZXcgTWFwKCkpXG4gICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmdldChlZGl0b3IpLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH0gZWxzZSB7IC8vIEl0J3MgcHJvamVjdFxuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICB1cGRhdGVQdWJsaWMoKSB7XG4gICAgbGV0IGxhdGVzdE1lc3NhZ2VzID0gW11cbiAgICBsZXQgcHVibGljTWVzc2FnZXMgPSBbXVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHJlbW92ZWQgPSBbXVxuICAgIGxldCBjdXJyZW50S2V5c1xuICAgIGxldCBsYXN0S2V5c1xuXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKGVkaXRvck1lc3NhZ2VzID0+XG4gICAgICBlZGl0b3JNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICApXG5cbiAgICBjdXJyZW50S2V5cyA9IGxhdGVzdE1lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuICAgIGxhc3RLZXlzID0gdGhpcy5wdWJsaWNNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcblxuICAgIGZvciAobGV0IGkgb2YgbGF0ZXN0TWVzc2FnZXMpIHtcbiAgICAgIGlmIChsYXN0S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYWRkZWQucHVzaChpKVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnB1YmxpY01lc3NhZ2VzKVxuICAgICAgaWYgKGN1cnJlbnRLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSlcbiAgICAgICAgcmVtb3ZlZC5wdXNoKGkpXG4gICAgICBlbHNlXG4gICAgICAgIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcblxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBwdWJsaWNNZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlczogcHVibGljTWVzc2FnZXN9KVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlTWVzc2FnZXMobGludGVyKSB7XG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2gociA9PiByLmRlbGV0ZShsaW50ZXIpKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSBpZih0aGlzLmxpbnRlclJlc3BvbnNlcy5oYXMobGludGVyKSkge1xuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZGVsZXRlKGxpbnRlcilcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGVsZXRlRWRpdG9yTWVzc2FnZXMoZWRpdG9yKSB7XG4gICAgaWYgKCF0aGlzLmVkaXRvck1lc3NhZ2VzLmhhcyhlZGl0b3IpKSByZXR1cm5cbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmRlbGV0ZShlZGl0b3IpXG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuY2xlYXIoKVxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=