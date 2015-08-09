'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = require('./message');

var BottomPanel = (function (_HTMLElement) {
  _inherits(BottomPanel, _HTMLElement);

  function BottomPanel() {
    _classCallCheck(this, BottomPanel);

    _get(Object.getPrototypeOf(BottomPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomPanel, [{
    key: 'prepare',
    value: function prepare() {
      // priority because of https://github.com/atom-community/linter/issues/668
      this.panel = atom.workspace.addBottomPanel({ item: this, visible: false, priority: 500 });
      this.panelVisibility = true;
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'updateMessages',
    value: function updateMessages(messages, isProject) {
      this.clear();
      if (!messages.length) {
        this.visibility = false;
        return;
      }
      this.visibility = true;
      messages.forEach((function (message) {
        this.appendChild(Message.fromMessage(message, { addPath: isProject, cloneNode: true }));
      }).bind(this));
    }
  }, {
    key: 'clear',
    value: function clear() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
  }, {
    key: 'panelVisibility',
    get: function get() {
      return this._panelVisibility;
    },
    set: function set(value) {
      this._panelVisibility = value;
      if (value) this.panel.show();else this.panel.hide();
    }
  }, {
    key: 'visibility',
    get: function get() {
      return this._visibility;
    },
    set: function set(value) {
      this._visibility = value;
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomPanel;
})(HTMLElement);

module.exports = document.registerElement('linter-panel', { prototype: BottomPanel.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFBOzs7Ozs7Ozs7O0FBRVosSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztJQUU1QixXQUFXO1lBQVgsV0FBVzs7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7OztlQUFYLFdBQVc7O1dBRVIsbUJBQUc7O0FBRVIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtBQUN2RixVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQTtBQUMzQixhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDckI7OztXQXlCYSx3QkFBQyxRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNaLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLGNBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxVQUFTLE9BQU8sRUFBRTtBQUNqQyxZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3RGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUNkOzs7V0FFSSxpQkFBRztBQUNOLGFBQU8sSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUN0QixZQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7U0F2Q2tCLGVBQUc7QUFDcEIsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7S0FDN0I7U0FFa0IsYUFBQyxLQUFLLEVBQUU7QUFDekIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtBQUM3QixVQUFJLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBLEtBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDdkI7OztTQUVhLGVBQUc7QUFDZixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7U0FFYSxhQUFDLEtBQUssRUFBRTtBQUNwQixVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN4QixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDL0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ2xDO0tBQ0Y7OztTQWxDRyxXQUFXO0dBQVMsV0FBVzs7QUF3RHJDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL0x1Y2F6ei8uZG90ZmlsZXMvLmF0b20uc3ltbGluay9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1wYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5sZXQgTWVzc2FnZSA9IHJlcXVpcmUoJy4vbWVzc2FnZScpXG5cbmNsYXNzIEJvdHRvbVBhbmVsIGV4dGVuZHMgSFRNTEVsZW1lbnR7XG5cbiAgcHJlcGFyZSgpIHtcbiAgICAvLyBwcmlvcml0eSBiZWNhdXNlIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tLWNvbW11bml0eS9saW50ZXIvaXNzdWVzLzY2OFxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7aXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIHRoaXMucGFuZWxWaXNpYmlsaXR5ID0gdHJ1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gIH1cblxuICBnZXQgcGFuZWxWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbFZpc2liaWxpdHlcbiAgfVxuXG4gIHNldCBwYW5lbFZpc2liaWxpdHkodmFsdWUpIHtcbiAgICB0aGlzLl9wYW5lbFZpc2liaWxpdHkgPSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkgdGhpcy5wYW5lbC5zaG93KClcbiAgICBlbHNlIHRoaXMucGFuZWwuaGlkZSgpXG4gIH1cblxuICBnZXQgdmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eVxuICB9XG5cbiAgc2V0IHZpc2liaWxpdHkodmFsdWUpIHtcbiAgICB0aGlzLl92aXNpYmlsaXR5ID0gdmFsdWVcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVNZXNzYWdlcyhtZXNzYWdlcywgaXNQcm9qZWN0KSB7XG4gICAgdGhpcy5jbGVhcigpXG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdHJ1ZVxuICAgIG1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UsIHthZGRQYXRoOiBpc1Byb2plY3QsIGNsb25lTm9kZTogdHJ1ZX0pKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHdoaWxlICh0aGlzLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQodGhpcy5maXJzdENoaWxkKVxuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItcGFuZWwnLCB7cHJvdG90eXBlOiBCb3R0b21QYW5lbC5wcm90b3R5cGV9KVxuIl19