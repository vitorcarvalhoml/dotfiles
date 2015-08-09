Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

var _werkzeug = require("../werkzeug");

"use babel";

var ConsoleLogger = (function (_Logger) {
  _inherits(ConsoleLogger, _Logger);

  function ConsoleLogger() {
    _classCallCheck(this, ConsoleLogger);

    _get(Object.getPrototypeOf(ConsoleLogger.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ConsoleLogger, [{
    key: "error",
    value: function error(statusCode, result, builder) {
      console.group("LaTeX errors");
      switch (statusCode) {
        case 127:
          {
            var executable = builder.executable;
            console.log((0, _werkzeug.heredoc)("\n          %cTeXification failed! Builder executable \"" + executable + "\" not found.\n\n            latex.texPath\n              as configured: " + atom.config.get("latex.texPath") + "\n              when resolved: " + builder.constructPath() + "\n\n          Make sure latex.texPath is configured correctly; either adjust it           via the settings view, or directly in your config.cson file.\n          "), "color: red");
            break;
          }
        default:
          {
            if (result && result.errors) {
              console.group("TeXification failed with status code " + statusCode);
              for (var error of result.errors) {
                console.log("%c" + error.filePath + ":" + error.lineNumber + ": " + error.message, "color: red");
              }
              console.groupEnd();
            } else {
              console.log("%cTeXification failed with status code " + statusCode, "color: red");
            }
          }
      }
      console.groupEnd();
    }
  }, {
    key: "warning",
    value: function warning(message) {
      console.group("LaTeX warnings");
      console.log(message);
      console.groupEnd();
    }
  }]);

  return ConsoleLogger;
})(_logger2["default"]);

exports["default"] = ConsoleLogger;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRW1CLFdBQVc7Ozs7d0JBQ1IsYUFBYTs7QUFIbkMsV0FBVyxDQUFDOztJQUtTLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7MEJBQWIsYUFBYTs7K0JBQWIsYUFBYTs7O2VBQWIsYUFBYTs7V0FDM0IsZUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtBQUNqQyxhQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlCLGNBQVEsVUFBVTtBQUNoQixhQUFLLEdBQUc7QUFBRTtBQUNSLGdCQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQ3RDLG1CQUFPLENBQUMsR0FBRyxDQUFDLGNBUlosT0FBTywrREFTd0MsVUFBVSxpRkFHbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLHVDQUNoQyxPQUFPLENBQUMsYUFBYSxFQUFFLHdLQUkxQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BCLGtCQUFNO1dBQ1A7QUFBQSxBQUNEO0FBQVM7QUFDUCxnQkFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUMzQixxQkFBTyxDQUFDLEtBQUssMkNBQXlDLFVBQVUsQ0FBRyxDQUFDO0FBQ3BFLG1CQUFLLElBQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDakMsdUJBQU8sQ0FBQyxHQUFHLFFBQU0sS0FBSyxDQUFDLFFBQVEsU0FBSSxLQUFLLENBQUMsVUFBVSxVQUFLLEtBQUssQ0FBQyxPQUFPLEVBQUksWUFBWSxDQUFDLENBQUM7ZUFDeEY7QUFDRCxxQkFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ3BCLE1BQ0k7QUFDSCxxQkFBTyxDQUFDLEdBQUcsNkNBQTJDLFVBQVUsRUFBSSxZQUFZLENBQUMsQ0FBQzthQUNuRjtXQUNGO0FBQUEsT0FDRjtBQUNELGFBQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNwQjs7O1dBRU0saUJBQUMsT0FBTyxFQUFFO0FBQ2YsYUFBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hDLGFBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsYUFBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ3BCOzs7U0F0Q2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGF0ZXgvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuLi9sb2dnZXJcIjtcbmltcG9ydCB7aGVyZWRvY30gZnJvbSBcIi4uL3dlcmt6ZXVnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnNvbGVMb2dnZXIgZXh0ZW5kcyBMb2dnZXIge1xuICBlcnJvcihzdGF0dXNDb2RlLCByZXN1bHQsIGJ1aWxkZXIpIHtcbiAgICBjb25zb2xlLmdyb3VwKFwiTGFUZVggZXJyb3JzXCIpO1xuICAgIHN3aXRjaCAoc3RhdHVzQ29kZSkge1xuICAgICAgY2FzZSAxMjc6IHtcbiAgICAgICAgY29uc3QgZXhlY3V0YWJsZSA9IGJ1aWxkZXIuZXhlY3V0YWJsZTtcbiAgICAgICAgY29uc29sZS5sb2coaGVyZWRvYyhgXG4gICAgICAgICAgJWNUZVhpZmljYXRpb24gZmFpbGVkISBCdWlsZGVyIGV4ZWN1dGFibGUgXCIke2V4ZWN1dGFibGV9XCIgbm90IGZvdW5kLlxuXG4gICAgICAgICAgICBsYXRleC50ZXhQYXRoXG4gICAgICAgICAgICAgIGFzIGNvbmZpZ3VyZWQ6ICR7YXRvbS5jb25maWcuZ2V0KFwibGF0ZXgudGV4UGF0aFwiKX1cbiAgICAgICAgICAgICAgd2hlbiByZXNvbHZlZDogJHtidWlsZGVyLmNvbnN0cnVjdFBhdGgoKX1cblxuICAgICAgICAgIE1ha2Ugc3VyZSBsYXRleC50ZXhQYXRoIGlzIGNvbmZpZ3VyZWQgY29ycmVjdGx5OyBlaXRoZXIgYWRqdXN0IGl0IFxcXG4gICAgICAgICAgdmlhIHRoZSBzZXR0aW5ncyB2aWV3LCBvciBkaXJlY3RseSBpbiB5b3VyIGNvbmZpZy5jc29uIGZpbGUuXG4gICAgICAgICAgYCksIFwiY29sb3I6IHJlZFwiKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LmVycm9ycykge1xuICAgICAgICAgIGNvbnNvbGUuZ3JvdXAoYFRlWGlmaWNhdGlvbiBmYWlsZWQgd2l0aCBzdGF0dXMgY29kZSAke3N0YXR1c0NvZGV9YCk7XG4gICAgICAgICAgZm9yIChjb25zdCBlcnJvciBvZiByZXN1bHQuZXJyb3JzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMke2Vycm9yLmZpbGVQYXRofToke2Vycm9yLmxpbmVOdW1iZXJ9OiAke2Vycm9yLm1lc3NhZ2V9YCwgXCJjb2xvcjogcmVkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmdyb3VwRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCVjVGVYaWZpY2F0aW9uIGZhaWxlZCB3aXRoIHN0YXR1cyBjb2RlICR7c3RhdHVzQ29kZX1gLCBcImNvbG9yOiByZWRcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5ncm91cEVuZCgpO1xuICB9XG5cbiAgd2FybmluZyhtZXNzYWdlKSB7XG4gICAgY29uc29sZS5ncm91cChcIkxhVGVYIHdhcm5pbmdzXCIpO1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgfVxufVxuIl19