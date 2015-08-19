Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    this.panel = atom.workspace.addBottomPanel({ item: this.element, visible: false, priority: 500 });
    this.visibility = false;
    this.scope = scope;
    this.messages = new Map();

    this.subscriptions.add(atom.config.observe('linter.showErrorPanel', function (value) {
      _this.configVisibility = value;
      _this.setVisibility(true);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.setVisibility(true);
    }));
  }

  _createClass(BottomPanel, [{
    key: 'refresh',
    value: function refresh(scope) {
      this.scope = scope;
      for (var message of this.messages) {
        message[1].updateVisibility(scope);
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;

      if (removed.length) this.removeMessages(removed);
      for (var message of added) {
        var messageElement = _messageElement.Message.fromMessage(message);
        this.element.appendChild(messageElement);
        messageElement.updateVisibility(this.scope);
        this.messages.set(message, messageElement);
      }
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(removed) {
      for (var message of removed) {
        if (this.messages.has(message)) {
          this.element.removeChild(this.messages.get(message));
          this.messages['delete'](message);
        }
      }
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'setVisibility',
    value: function setVisibility(value) {
      this.visibility = value && this.configVisibility && this.paneVisibility;
      if (this.visibility) {
        this.panel.show();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      this.panel.destroy();
    }
  }]);

  return BottomPanel;
})();

exports.BottomPanel = BottomPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWtDLE1BQU07OzhCQUNsQixtQkFBbUI7O0FBSHpDLFdBQVcsQ0FBQTs7SUFLRSxXQUFXO0FBQ1gsV0FEQSxXQUFXLENBQ1YsS0FBSyxFQUFFOzs7MEJBRFIsV0FBVzs7QUFFcEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBdUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDckQsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUE7QUFDL0YsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7QUFDdkIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUV6QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxVQUFBLEtBQUssRUFBSTtBQUMzRSxZQUFLLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtBQUM3QixZQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6QixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDdEUsWUFBSyxjQUFjLEdBQUcsUUFBUSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUN2RSxZQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6QixDQUFDLENBQUMsQ0FBQTtHQUNKOztlQWpCVSxXQUFXOztXQWtCZixpQkFBQyxLQUFLLEVBQUU7QUFDYixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixXQUFLLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakMsZUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ25DO0tBQ0Y7OztXQUNVLHFCQUFDLElBQWdCLEVBQUU7VUFBakIsS0FBSyxHQUFOLElBQWdCLENBQWYsS0FBSztVQUFFLE9BQU8sR0FBZixJQUFnQixDQUFSLE9BQU87O0FBQ3pCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFDaEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM5QixXQUFLLElBQUksT0FBTyxJQUFJLEtBQUssRUFBRTtBQUN6QixZQUFNLGNBQWMsR0FBRyx3QkFBUSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDbkQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDeEMsc0JBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDM0MsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO09BQzNDO0tBQ0Y7OztXQUNhLHdCQUFDLE9BQU8sRUFBRTtBQUN0QixXQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtBQUMzQixZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzlCLGNBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDcEQsY0FBSSxDQUFDLFFBQVEsVUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQzlCO09BQ0Y7S0FDRjs7O1dBQ1kseUJBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztXQUNZLHVCQUFDLEtBQUssRUFBQztBQUNsQixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQTtBQUN2RSxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCOzs7U0F6RFUsV0FBVyIsImZpbGUiOiIvVXNlcnMvTHVjYXp6Ly5kb3RmaWxlcy8uYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2UtZWxlbWVudCdcblxuZXhwb3J0IGNsYXNzIEJvdHRvbVBhbmVsIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1wYW5lbCcpIC8vIFRPRE8oc3RlZWxicmFpbik6IE1ha2UgdGhpcyBhIGBkaXZgXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiB0aGlzLmVsZW1lbnQsIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwfSlcbiAgICB0aGlzLnZpc2liaWxpdHkgPSBmYWxzZVxuICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnNob3dFcnJvclBhbmVsJywgdmFsdWUgPT4ge1xuICAgICAgdGhpcy5jb25maWdWaXNpYmlsaXR5ID0gdmFsdWVcbiAgICAgIHRoaXMuc2V0VmlzaWJpbGl0eSh0cnVlKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIHRoaXMucGFuZVZpc2liaWxpdHkgPSBwYW5lSXRlbSA9PT0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB0aGlzLnNldFZpc2liaWxpdHkodHJ1ZSlcbiAgICB9KSlcbiAgfVxuICByZWZyZXNoKHNjb3BlKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiB0aGlzLm1lc3NhZ2VzKSB7XG4gICAgICBtZXNzYWdlWzFdLnVwZGF0ZVZpc2liaWxpdHkoc2NvcGUpXG4gICAgfVxuICB9XG4gIHNldE1lc3NhZ2VzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBpZiAocmVtb3ZlZC5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpXG4gICAgZm9yIChsZXQgbWVzc2FnZSBvZiBhZGRlZCkge1xuICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpXG4gICAgICBtZXNzYWdlRWxlbWVudC51cGRhdGVWaXNpYmlsaXR5KHRoaXMuc2NvcGUpXG4gICAgICB0aGlzLm1lc3NhZ2VzLnNldChtZXNzYWdlLCBtZXNzYWdlRWxlbWVudClcbiAgICB9XG4gIH1cbiAgcmVtb3ZlTWVzc2FnZXMocmVtb3ZlZCkge1xuICAgIGZvciAobGV0IG1lc3NhZ2Ugb2YgcmVtb3ZlZCkge1xuICAgICAgaWYgKHRoaXMubWVzc2FnZXMuaGFzKG1lc3NhZ2UpKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLm1lc3NhZ2VzLmdldChtZXNzYWdlKSlcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0VmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy52aXNpYmlsaXR5XG4gIH1cbiAgc2V0VmlzaWJpbGl0eSh2YWx1ZSl7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdmFsdWUgJiYgdGhpcy5jb25maWdWaXNpYmlsaXR5ICYmIHRoaXMucGFuZVZpc2liaWxpdHlcbiAgICBpZiAodGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICB9XG59XG4iXX0=