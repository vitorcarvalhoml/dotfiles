(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./views/bottom-panel');

  BottomContainer = require('./views/bottom-container');

  BottomStatus = require('./views/bottom-status');

  Message = require('./views/message');

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.markers = new Map();
      this.panel = new BottomPanel().prepare();
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.count = {
        File: 0,
        Line: 0,
        Project: 0
      };
      this.subscriptions.add(atom.config.observe('linter.underlineIssues', (function(_this) {
        return function(underlineIssues) {
          return _this.underlineIssues = underlineIssues;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.showBubble = showBubble;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorPanel', (function(_this) {
        return function(showPanel) {
          return _this.panel.panelVisibility = showPanel;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(paneItem) {
          var isTextEditor;
          isTextEditor = (paneItem != null ? paneItem.getPath : void 0) != null;
          _this.bottomContainer.setVisibility(isTextEditor);
          _this.panel.panelVisibility = atom.config.get('linter.showErrorPanel') && isTextEditor;
          return _this.render({
            added: [],
            removed: [],
            messages: _this.linter.messages.publicMessages
          });
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          return _this.renderPanelMessages();
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onShouldTogglePanel((function(_this) {
        return function() {
          _this.panel.panelVisibility = !_this.panel.panelVisibility;
          return atom.config.set('linter.showErrorPanel', _this.panel.panelVisibility);
        };
      })(this)));
    }

    LinterViews.prototype.render = function(_arg) {
      var added, messages, removed;
      added = _arg.added, removed = _arg.removed, messages = _arg.messages;
      this.messages = this.classifyMessages(messages);
      this.renderPanelMessages();
      this.renderPanelMarkers({
        added: added,
        removed: removed
      });
      this.renderBubble();
      return this.renderCount();
    };

    LinterViews.prototype.renderLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.classifyMessagesByLine(this.messages);
      if (render) {
        this.renderCount();
        return this.renderPanelMessages();
      }
    };

    LinterViews.prototype.classifyMessages = function(messages) {
      var filePath, key, message, _ref;
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      this.count.File = 0;
      this.count.Project = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentFile = filePath && message.filePath === filePath) {
          this.count.File++;
        }
        this.count.Project++;
      }
      return this.classifyMessagesByLine(messages);
    };

    LinterViews.prototype.classifyMessagesByLine = function(messages) {
      var key, message, row, _ref;
      row = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition().row : void 0;
      this.count.Line = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentLine = message.currentFile && message.range && message.range.intersectsRow(row)) {
          this.count.Line++;
        }
      }
      return messages;
    };

    LinterViews.prototype.renderBubble = function() {
      var activeEditor, message, point, _i, _len, _ref, _results;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = activeEditor.getCursorBufferPosition();
      _ref = this.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentLine) {
          continue;
        }
        if (!message.range.containsPoint(point)) {
          continue;
        }
        this.bubble = activeEditor.markBufferRange([point, point], {
          invalidate: 'inside'
        });
        activeEditor.decorateMarker(this.bubble, {
          type: 'overlay',
          position: 'tail',
          item: this.renderBubbleContent(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.renderBubbleContent = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          return bubble.appendChild(Message.fromMessage(trace, {
            addPath: true
          }));
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      return this.bottomContainer.setCount(this.count);
    };

    LinterViews.prototype.renderPanelMessages = function() {
      var messages;
      messages = null;
      if (this.state.scope === 'Project') {
        messages = this.messages;
      } else if (this.state.scope === 'File') {
        messages = this.messages.filter(function(message) {
          return message.currentFile;
        });
      } else if (this.state.scope === 'Line') {
        messages = this.messages.filter(function(message) {
          return message.currentLine;
        });
      }
      return this.panel.updateMessages(messages, this.state.scope === 'Project');
    };

    LinterViews.prototype.renderPanelMarkers = function(_arg) {
      var activeEditor, added, removed;
      added = _arg.added, removed = _arg.removed;
      this.removeMarkers(removed);
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      return added.forEach((function(_this) {
        return function(message) {
          var marker;
          if (!message.currentFile) {
            return;
          }
          _this.markers.set(message.key, marker = activeEditor.markBufferRange(message.range, {
            invalidate: 'inside'
          }));
          activeEditor.decorateMarker(marker, {
            type: 'line-number',
            "class": "linter-highlight " + message["class"]
          });
          if (_this.underlineIssues) {
            return activeEditor.decorateMarker(marker, {
              type: 'highlight',
              "class": "linter-highlight " + message["class"]
            });
          }
        };
      })(this));
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      return this.bottomBar = statusBar.addLeftTile({
        item: this.bottomContainer,
        priority: -100
      });
    };

    LinterViews.prototype.removeMarkers = function(messages) {
      if (messages == null) {
        messages = this.messages;
      }
      return messages.forEach((function(_this) {
        return function(message) {
          var marker;
          marker = _this.markers.get(message.key);
          try {
            marker.destroy();
          } catch (_error) {}
          return _this.markers["delete"](message.key);
        };
      })(this));
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.destroy = function() {
      this.removeMarkers();
      this.removeBubble();
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      return this.panel.destroy();
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHNCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDBCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQUtBLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FMVixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLHFCQUFFLE1BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQUQsR0FBZSxJQUFBLEdBQUEsQ0FBQSxDQUhmLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxXQUFBLENBQUEsQ0FBYSxDQUFDLE9BQWQsQ0FBQSxDQUpiLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsZUFBQSxDQUFBLENBQWlCLENBQUMsT0FBbEIsQ0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFsQyxDQUx2QixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBTmIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE1BQUQsR0FB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/linter-views.coffee