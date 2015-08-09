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
