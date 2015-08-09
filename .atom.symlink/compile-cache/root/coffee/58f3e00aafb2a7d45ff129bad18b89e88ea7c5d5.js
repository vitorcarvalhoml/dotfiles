(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
      default:
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
    }
  })();

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this));
    },
    deactivate: function() {
      return this.unsubscribe();
    },
    _handleLoad: function(editor) {
      var editorBuffer, editorComponent, editorElement, hijackMouseEvent, mouseEndPos, mouseStartPos, onBlur, onMouseDown, onMouseMove, onRangeChange, resetState, _keyDown, _mainMouseAndKeyDown, _mainMouseDown, _middleMouseDown, _screenPositionForMouseEvent, _selectBoxAroundCursors;
      editorBuffer = editor.displayBuffer;
      editorElement = atom.views.getView(editor);
      editorComponent = editorElement.component;
      mouseStartPos = null;
      mouseEndPos = null;
      resetState = function() {
        mouseStartPos = null;
        return mouseEndPos = null;
      };
      onMouseDown = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
        if (_middleMouseDown(e) || _mainMouseAndKeyDown(e)) {
          resetState();
          mouseStartPos = _screenPositionForMouseEvent(e);
          mouseEndPos = mouseStartPos;
          e.preventDefault();
          return false;
        }
      };
      onMouseMove = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          if (_middleMouseDown(e) || _mainMouseDown(e)) {
            mouseEndPos = _screenPositionForMouseEvent(e);
            _selectBoxAroundCursors();
            return false;
          }
          if (e.which === 0) {
            return resetState();
          }
        }
      };
      hijackMouseEvent = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
      };
      onBlur = function(e) {
        return resetState();
      };
      onRangeChange = function(newVal) {
        if (mouseStartPos && !newVal.selection.isSingleScreenLine()) {
          newVal.selection.destroy();
          return _selectBoxAroundCursors();
        }
      };
      _screenPositionForMouseEvent = function(e) {
        var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
        pixelPosition = editorComponent.pixelPositionForMouseEvent(e);
        targetTop = pixelPosition.top;
        targetLeft = pixelPosition.left;
        defaultCharWidth = editorBuffer.defaultCharWidth;
        row = Math.floor(targetTop / editorBuffer.getLineHeightInPixels());
        if (row > editorBuffer.getLastRow()) {
          targetLeft = Infinity;
        }
        row = Math.min(row, editorBuffer.getLastRow());
        row = Math.max(0, row);
        column = Math.round(targetLeft / defaultCharWidth);
        return {
          row: row,
          column: column
        };
      };
      _middleMouseDown = function(e) {
        return inputCfg.enableMiddleMouse && e.which === inputCfg.middleMouseNum;
      };
      _mainMouseDown = function(e) {
        return e.which === inputCfg.mainMouseNum;
      };
      _keyDown = function(e) {
        return e[inputCfg.selectKey];
      };
      _mainMouseAndKeyDown = function(e) {
        return _mainMouseDown(e) && e[inputCfg.selectKey];
      };
      _selectBoxAroundCursors = function() {
        var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
        if (mouseStartPos && mouseEndPos) {
          allRanges = [];
          rangesWithLength = [];
          for (row = _i = _ref = mouseStartPos.row, _ref1 = mouseEndPos.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            range = [[row, mouseStartPos.column], [row, mouseEndPos.column]];
            allRanges.push(range);
            if (editor.getTextInBufferRange(range).length > 0) {
              rangesWithLength.push(range);
            }
          }
          if (rangesWithLength.length) {
            return editor.setSelectedScreenRanges(rangesWithLength);
          } else if (allRanges.length) {
            return editor.setSelectedScreenRanges(allRanges);
          }
        }
      };
      editor.onDidChangeSelectionRange(onRangeChange);
      editorElement.onmousedown = onMouseDown;
      editorElement.onmousemove = onMouseMove;
      editorElement.onmouseup = hijackMouseEvent;
      editorElement.onmouseleave = hijackMouseEvent;
      editorElement.onmouseenter = hijackMouseEvent;
      editorElement.oncontextmenu = hijackMouseEvent;
      return editorElement.onblur = onBlur;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsUUFBQTtBQUFXLFlBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFQO0FBQUEsV0FDSixPQURJO2VBRVA7QUFBQSxVQUFBLFNBQUEsRUFBVyxRQUFYO0FBQUEsVUFDQSxZQUFBLEVBQWMsQ0FEZDtBQUFBLFVBRUEsY0FBQSxFQUFnQixDQUZoQjtBQUFBLFVBR0EsaUJBQUEsRUFBbUIsSUFIbkI7VUFGTztBQUFBLFdBTUosUUFOSTtlQU9QO0FBQUEsVUFBQSxTQUFBLEVBQVcsUUFBWDtBQUFBLFVBQ0EsWUFBQSxFQUFjLENBRGQ7QUFBQSxVQUVBLGNBQUEsRUFBZ0IsQ0FGaEI7QUFBQSxVQUdBLGlCQUFBLEVBQW1CLElBSG5CO1VBUE87QUFBQSxXQVdKLE9BWEk7ZUFZUDtBQUFBLFVBQUEsU0FBQSxFQUFXLFVBQVg7QUFBQSxVQUNBLFlBQUEsRUFBYyxDQURkO0FBQUEsVUFFQSxjQUFBLEVBQWdCLENBRmhCO0FBQUEsVUFHQSxpQkFBQSxFQUFtQixLQUhuQjtVQVpPO0FBQUE7ZUFpQlA7QUFBQSxVQUFBLFNBQUEsRUFBVyxVQUFYO0FBQUEsVUFDQSxZQUFBLEVBQWMsQ0FEZDtBQUFBLFVBRUEsY0FBQSxFQUFnQixDQUZoQjtBQUFBLFVBR0EsaUJBQUEsRUFBbUIsS0FIbkI7VUFqQk87QUFBQTtNQUZYLENBQUE7O0FBQUEsRUF3QkEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee