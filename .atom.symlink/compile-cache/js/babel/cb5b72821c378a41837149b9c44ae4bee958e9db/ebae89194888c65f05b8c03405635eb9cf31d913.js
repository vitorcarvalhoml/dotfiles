'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BottomStatus = (function (_HTMLElement) {
  _inherits(BottomStatus, _HTMLElement);

  function BottomStatus() {
    _classCallCheck(this, BottomStatus);

    _get(Object.getPrototypeOf(BottomStatus.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomStatus, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.classList.add('inline-block');
      this.classList.add('linter-highlight');

      this.iconSpan = document.createElement('span');
      this.iconSpan.classList.add('icon');
      this.appendChild(this.iconSpan);

      this.count = 0;

      this.addEventListener('click', function () {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:next-error');
      });
    }
  }, {
    key: 'count',
    get: function get() {
      return this._count;
    },
    set: function set(Value) {
      this._count = Value;
      if (Value) {
        this.classList.remove('status-success');
        this.iconSpan.classList.remove('icon-check');

        this.classList.add('status-error');
        this.iconSpan.classList.add('icon-x');

        this.iconSpan.textContent = Value === 1 ? '1 Issue' : Value + ' Issues';
      } else {
        this.classList.remove('status-error');
        this.iconSpan.classList.remove('icon-x');

        this.classList.add('status-success');
        this.iconSpan.classList.add('icon-check');

        this.iconSpan.textContent = 'No Issues';
      }
    }
  }]);

  return BottomStatus;
})(HTMLElement);

module.exports = BottomStatus = document.registerElement('linter-bottom-status', { prototype: BottomStatus.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztJQUVQLFlBQVk7WUFBWixZQUFZOztXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O2VBQVosWUFBWTs7V0FFRCwyQkFBRztBQUNoQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBOztBQUV0QyxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25DLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUUvQixVQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQTs7QUFFZCxVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDeEMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUE7T0FDaEYsQ0FBQyxDQUFBO0tBQ0g7OztTQUVRLGVBQUU7QUFDVCxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FDbkI7U0FFUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUN2QyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRTVDLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ2xDLFlBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFckMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxTQUFTLEdBQU0sS0FBSyxZQUFTLENBQUE7T0FDeEUsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3JDLFlBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFeEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUNwQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRXpDLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtPQUN4QztLQUNGOzs7U0F4Q0csWUFBWTtHQUFTLFdBQVc7O0FBNEN0QyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21TdGF0dXMgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbGludGVyLWhpZ2hsaWdodCcpXG5cbiAgICB0aGlzLmljb25TcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5pY29uU3Bhbi5jbGFzc0xpc3QuYWRkKCdpY29uJylcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaWNvblNwYW4pXG5cbiAgICB0aGlzLmNvdW50ID0gMFxuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnbGludGVyOm5leHQtZXJyb3InKVxuICAgIH0pXG4gIH1cblxuICBnZXQgY291bnQoKXtcbiAgICByZXR1cm4gdGhpcy5fY291bnRcbiAgfVxuXG4gIHNldCBjb3VudChWYWx1ZSkge1xuICAgIHRoaXMuX2NvdW50ID0gVmFsdWVcbiAgICBpZiAoVmFsdWUpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdHVzLXN1Y2Nlc3MnKVxuICAgICAgdGhpcy5pY29uU3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLWNoZWNrJylcblxuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtZXJyb3InKVxuICAgICAgdGhpcy5pY29uU3Bhbi5jbGFzc0xpc3QuYWRkKCdpY29uLXgnKVxuXG4gICAgICB0aGlzLmljb25TcGFuLnRleHRDb250ZW50ID0gVmFsdWUgPT09IDEgPyAnMSBJc3N1ZScgOiBgJHtWYWx1ZX0gSXNzdWVzYFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXR1cy1lcnJvcicpXG4gICAgICB0aGlzLmljb25TcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24teCcpXG5cbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLXN1Y2Nlc3MnKVxuICAgICAgdGhpcy5pY29uU3Bhbi5jbGFzc0xpc3QuYWRkKCdpY29uLWNoZWNrJylcblxuICAgICAgdGhpcy5pY29uU3Bhbi50ZXh0Q29udGVudCA9ICdObyBJc3N1ZXMnXG4gICAgfVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb3R0b21TdGF0dXMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tc3RhdHVzJywge3Byb3RvdHlwZTogQm90dG9tU3RhdHVzLnByb3RvdHlwZX0pXG4iXX0=