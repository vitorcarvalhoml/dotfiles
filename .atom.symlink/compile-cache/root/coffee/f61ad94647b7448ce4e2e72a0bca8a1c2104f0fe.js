(function() {
  var Message, MessageElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Message = (function(_super) {
    __extends(Message, _super);

    function Message() {
      return Message.__super__.constructor.apply(this, arguments);
    }

    Message.prototype.initialize = function(message, options) {
      this.message = message;
      this.options = options;
    };

    Message.prototype.attachedCallback = function() {
      this.appendChild(Message.renderRibbon(this.message));
      this.appendChild(Message.renderMessage(this.message, this.options));
      if (this.message.filePath) {
        return this.appendChild(Message.renderLink(this.message, this.options));
      }
    };

    Message.renderLink = function(message, _arg) {
      var addPath, displayFile, el;
      addPath = _arg.addPath;
      displayFile = message.filePath;
      atom.project.getPaths().forEach(function(path) {
        if (message.filePath.indexOf(path) !== 0 || displayFile !== message.filePath) {
          return;
        }
        return displayFile = message.filePath.substr(path.length + 1);
      });
      el = document.createElement('a');
      el.classList.add('linter-message-item');
      el.addEventListener('click', function() {
        return Message.onClick(message.filePath, message.range);
      });
      if (message.range) {
        el.textContent = "at line " + (message.range.start.row + 1) + " col " + (message.range.start.column + 1) + " ";
      }
      if (addPath) {
        el.textContent += "in " + displayFile;
      }
      return el;
    };

    Message.renderRibbon = function(message) {
      var el;
      el = document.createElement('span');
      el.classList.add('linter-message-item');
      el.classList.add('badge');
      el.classList.add('badge-flexible');
      el.classList.add("linter-highlight");
      el.classList.add(message["class"]);
      el.textContent = message.type;
      return el;
    };

    Message.renderMessage = function(message, _arg) {
      var cloneNode, el;
      cloneNode = _arg.cloneNode;
      el = document.createElement('span');
      el.classList.add('linter-message-item');
      if (message.html) {
        if (typeof message.html === 'string') {
          el.innerHTML = message.html;
        } else {
          if (cloneNode) {
            el.appendChild(message.html.cloneNode(true));
          } else {
            el.appendChild(message.html);
          }
        }
      } else if (message.multiline) {
        el.appendChild(Message.processMultiLine(message.text));
      } else {
        el.textContent = message.text;
      }
      return el;
    };

    Message.processMultiLine = function(text) {
      var container, el, line, _i, _len, _ref;
      container = document.createElement('linter-multiline-message');
      _ref = text.split(/\n/);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line) {
          el = document.createElement('linter-message-line');
          el.textContent = line;
          container.appendChild(el);
        }
      }
      return container;
    };

    Message.onClick = function(file, range) {
      return atom.workspace.open(file).then(function() {
        if (!range) {
          return;
        }
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(range.start);
      });
    };

    Message.fromMessage = function(message, options) {
      var MessageLine;
      if (options == null) {
        options = {};
      }
      MessageLine = new MessageElement();
      MessageLine.initialize(message, options);
      return MessageLine;
    };

    return Message;

  })(HTMLElement);

  module.exports = MessageElement = document.registerElement('linter-message', {
    prototype: Message.prototype
  });

  module.exports.fromMessage = Message.fromMessage;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxVQUFBLEdBQVksU0FBRSxPQUFGLEVBQVksT0FBWixHQUFBO0FBQXNCLE1BQXJCLElBQUMsQ0FBQSxVQUFBLE9BQW9CLENBQUE7QUFBQSxNQUFYLElBQUMsQ0FBQSxVQUFBLE9BQVUsQ0FBdEI7SUFBQSxDQUFaLENBQUE7O0FBQUEsc0JBRUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBO0FBQ2hCLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxPQUFPLENBQUMsWUFBUixDQUFxQixJQUFDLENBQUEsT0FBdEIsQ0FBYixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsSUFBQyxDQUFBLE9BQXZCLEVBQWdDLElBQUMsQ0FBQSxPQUFqQyxDQUFiLENBREEsQ0FBQTtBQUVBLE1BQUEsSUFBdUQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQUFoRTtlQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsSUFBQyxDQUFBLE9BQXBCLEVBQTZCLElBQUMsQ0FBQSxPQUE5QixDQUFiLEVBQUE7T0FIZ0I7SUFBQSxDQUZsQixDQUFBOztBQUFBLElBT0EsT0FBQyxDQUFBLFVBQUQsR0FBYSxTQUFDLE9BQUQsRUFBVSxJQUFWLEdBQUE7QUFDWCxVQUFBLHdCQUFBO0FBQUEsTUFEc0IsVUFBRCxLQUFDLE9BQ3RCLENBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxPQUFPLENBQUMsUUFBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxT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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/views/message.coffee