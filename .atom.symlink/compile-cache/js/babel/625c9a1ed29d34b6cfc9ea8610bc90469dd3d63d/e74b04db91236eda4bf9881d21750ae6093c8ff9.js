'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      this.message = message;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) if (scope === 'Project') this.children[this.children.length - 1].children[0].removeAttribute('hidden');else this.children[this.children.length - 1].children[0].setAttribute('hidden', true);

      if (status) this.removeAttribute('hidden');else this.setAttribute('hidden', true);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message));

      if (this.message.filePath) {
        this.appendChild(Message.getLink(this.message));
      }
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-item';

      for (var path of atom.project.getPaths()) {
        if (displayFile.indexOf(path) === 0) {
          displayFile = displayFile.substr(path.length + 1); // Path + Path Separator
          break;
        }
      }if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + displayFile;
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item';
      if (message.html && typeof message.html !== 'string') {
        el.appendChild(message.html.cloneNode(true));
      } else if (message.multiline || message.html && message.html.match(NewLine) || message.text && message.text.match(NewLine)) {
        return Message.getMultiLineMessage(message.html || message.text);
      } else {
        if (message.html) {
          el.innerHTML = message.html;
        } else if (message.text) {
          el.textContent = message.text;
        }
      }
      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message) {
      var container = document.createElement('linter-multiline-message');
      for (var line of message.split(NewLine)) {
        if (!line) continue;
        var el = document.createElement('linter-message-line');
        el.textContent = line;
        container.appendChild(el);
      }
      return container;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message) {
      return new MessageElement().initialize(message);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi91aS9tZXNzYWdlLWVsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7OztBQUVYLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQTs7SUFFVixPQUFPO1lBQVAsT0FBTzs7V0FBUCxPQUFPOzBCQUFQLE9BQU87OytCQUFQLE9BQU87OztlQUFQLE9BQU87O1dBQ1Isb0JBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ3RCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUNlLDBCQUFDLEtBQUssRUFBRTtBQUN0QixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDakIsVUFBSSxLQUFLLEtBQUssTUFBTSxFQUNsQixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUEsS0FDOUIsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUN2QixNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUE7O0FBRW5DLFVBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQy9DLElBQUksS0FBSyxLQUFLLFNBQVMsRUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBLEtBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRXZGLFVBQUksTUFBTSxF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Q0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNoRDs7O1NBL0ZVLE9BQU87R0FBUyxXQUFXOzs7QUFrR2pDLElBQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkUsV0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO0NBQzdCLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvTHVjYXp6Ly5kb3RmaWxlcy8uYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvbWVzc2FnZS1lbGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgTmV3TGluZSA9IC9cXHI/XFxuL1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgaW5pdGlhbGl6ZShtZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdXBkYXRlVmlzaWJpbGl0eShzY29wZSkge1xuICAgIGxldCBzdGF0dXMgPSB0cnVlXG4gICAgaWYgKHNjb3BlID09PSAnTGluZScpXG4gICAgICBzdGF0dXMgPSB0aGlzLm1lc3NhZ2UuY3VycmVudExpbmVcbiAgICBlbHNlIGlmIChzY29wZSA9PT0gJ0ZpbGUnKVxuICAgICAgc3RhdHVzID0gdGhpcy5tZXNzYWdlLmN1cnJlbnRGaWxlXG5cbiAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggJiYgdGhpcy5tZXNzYWdlLmZpbGVQYXRoKVxuICAgICAgaWYgKHNjb3BlID09PSAnUHJvamVjdCcpXG4gICAgICAgIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXS5jaGlsZHJlblswXS5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICBlbHNlIHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG5cbiAgICBpZiAoc3RhdHVzKVxuICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgZWxzZVxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gIH1cbiAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0UmliYm9uKHRoaXMubWVzc2FnZSkpXG4gICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldE1lc3NhZ2UodGhpcy5tZXNzYWdlKSlcblxuICAgIGlmICh0aGlzLm1lc3NhZ2UuZmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRMaW5rKHRoaXMubWVzc2FnZSkpXG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXRMaW5rKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgIGNvbnN0IHBhdGhFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGxldCBkaXNwbGF5RmlsZSA9IG1lc3NhZ2UuZmlsZVBhdGhcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuXG4gICAgZm9yIChsZXQgcGF0aCBvZiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSlcbiAgICAgIGlmIChkaXNwbGF5RmlsZS5pbmRleE9mKHBhdGgpID09PSAwKSB7XG4gICAgICAgIGRpc3BsYXlGaWxlID0gZGlzcGxheUZpbGUuc3Vic3RyKHBhdGgubGVuZ3RoICsgMSkgLy8gUGF0aCArIFBhdGggU2VwYXJhdG9yXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5yYW5nZSkge1xuICAgICAgZWwudGV4dENvbnRlbnQgPSBgYXQgbGluZSAke21lc3NhZ2UucmFuZ2Uuc3RhcnQucm93ICsgMX0gY29sICR7bWVzc2FnZS5yYW5nZS5zdGFydC5jb2x1bW4gKyAxfWBcbiAgICB9XG4gICAgcGF0aEVsLnRleHRDb250ZW50ID0gJyBpbiAnICsgZGlzcGxheUZpbGVcbiAgICBlbC5hcHBlbmRDaGlsZChwYXRoRWwpXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihtZXNzYWdlLmZpbGVQYXRoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKG1lc3NhZ2UucmFuZ2Uuc3RhcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcbiAgICBpZiAobWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZChtZXNzYWdlLmh0bWwuY2xvbmVOb2RlKHRydWUpKVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBtZXNzYWdlLm11bHRpbGluZSB8fFxuICAgICAgKG1lc3NhZ2UuaHRtbCAmJiBtZXNzYWdlLmh0bWwubWF0Y2goTmV3TGluZSkpIHx8XG4gICAgICAobWVzc2FnZS50ZXh0ICYmIG1lc3NhZ2UudGV4dC5tYXRjaChOZXdMaW5lKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBNZXNzYWdlLmdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZS5odG1sIHx8IG1lc3NhZ2UudGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1lc3NhZ2UuaHRtbCkge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBtZXNzYWdlLmh0bWxcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS50ZXh0KSB7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50ZXh0XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNdWx0aUxpbmVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbXVsdGlsaW5lLW1lc3NhZ2UnKVxuICAgIGZvciAobGV0IGxpbmUgb2YgbWVzc2FnZS5zcGxpdChOZXdMaW5lKSkge1xuICAgICAgaWYgKCFsaW5lKSBjb250aW51ZVxuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcbiAgICAgIGVsLnRleHRDb250ZW50ID0gbGluZVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cbiAgc3RhdGljIGdldFJpYmJvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSBgbGludGVyLW1lc3NhZ2UtaXRlbSBiYWRnZSBiYWRnZS1mbGV4aWJsZSBsaW50ZXItaGlnaGxpZ2h0ICR7bWVzc2FnZS5jbGFzc31gXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnR5cGVcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZnJvbU1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgTWVzc2FnZUVsZW1lbnQoKS5pbml0aWFsaXplKG1lc3NhZ2UpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItbWVzc2FnZScsIHtcbiAgcHJvdG90eXBlOiBNZXNzYWdlLnByb3RvdHlwZVxufSlcbiJdfQ==