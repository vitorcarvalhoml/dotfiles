Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

"use babel";

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.envPathKey = this.getEnvironmentPathKey(process.platform);
  }

  _createClass(Builder, [{
    key: "run",
    value: function run() /* filePath */{}
  }, {
    key: "constructArgs",
    value: function constructArgs() /* filePath */{}
  }, {
    key: "parseLogFile",
    value: function parseLogFile() /* texFilePath */{}
  }, {
    key: "constructChildProcessOptions",
    value: function constructChildProcessOptions() {
      var env = _lodash2["default"].clone(process.env);
      var childPath = this.constructPath();
      if (childPath) {
        env[this.envPathKey] = childPath;
      }

      return { env: env };
    }
  }, {
    key: "constructPath",
    value: function constructPath() {
      var texPath = (atom.config.get("latex.texPath") || "").trim();
      if (texPath.length === 0) {
        texPath = this.defaultTexPath(process.platform);
      }

      var processPath = process.env[this.envPathKey];
      var match = texPath.match(/^(.*)(\$PATH)(.*)$/);
      if (match) {
        return "" + match[1] + processPath + match[3];
      }

      return [texPath, processPath].filter(function (str) {
        return str && str.length > 0;
      }).join(_path2["default"].delimiter);
    }
  }, {
    key: "defaultTexPath",
    value: function defaultTexPath(platform) {
      if (platform === "win32") {
        return ["C:\\texlive\\2014\\bin\\win32", "C:\\Program Files\\MiKTeX 2.9\\miktex\\bin\\x64", "C:\\Program Files (x86)\\MiKTeX 2.9\\miktex\\bin"].join(";");
      }

      return "/usr/texbin";
    }
  }, {
    key: "resolveLogFilePath",
    value: function resolveLogFilePath(texFilePath) {
      var outputDirectory = atom.config.get("latex.outputDirectory") || "";
      var currentDirectory = _path2["default"].dirname(texFilePath);
      var fileName = _path2["default"].basename(texFilePath).replace(/\.\w+$/, ".log");

      return _path2["default"].join(currentDirectory, outputDirectory, fileName);
    }
  }, {
    key: "getEnvironmentPathKey",
    value: function getEnvironmentPathKey(platform) {
      if (platform === "win32") {
        return "Path";
      }
      return "PATH";
    }
  }]);

  return Builder;
})();

exports["default"] = Builder;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGF0ZXgvbGliL2J1aWxkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7O29CQUNMLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFDOztJQUtTLE9BQU87QUFDZixXQURRLE9BQU8sR0FDWjswQkFESyxPQUFPOztBQUV4QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEU7O2VBSGtCLE9BQU87O1dBS3ZCLDZCQUFpQixFQUFFOzs7V0FDVCx1Q0FBaUIsRUFBRTs7O1dBQ3BCLHlDQUFvQixFQUFFOzs7V0FFTix3Q0FBRztBQUM3QixVQUFNLEdBQUcsR0FBRyxvQkFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN2QyxVQUFJLFNBQVMsRUFBRTtBQUNiLFdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsU0FBUyxDQUFDO09BQ2xDOztBQUVELGFBQU8sRUFBQyxHQUFHLEVBQUgsR0FBRyxFQUFDLENBQUM7S0FDZDs7O1dBRVkseUJBQUc7QUFDZCxVQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLElBQUksRUFBRSxDQUFDO0FBQzlELFVBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDeEIsZUFBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2pEOztBQUVELFVBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsRCxVQUFJLEtBQUssRUFBRTtBQUNULG9CQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFHO09BQy9DOztBQUVELGFBQU8sQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQzFCLE1BQU0sQ0FBQyxVQUFBLEdBQUc7ZUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUNwQyxJQUFJLENBQUMsa0JBQUssU0FBUyxDQUFDLENBQUM7S0FDekI7OztXQUVhLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFDeEIsZUFBTyxDQUNMLCtCQUErQixFQUMvQixpREFBaUQsRUFDakQsa0RBQWtELENBQ25ELENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2I7O0FBRUQsYUFBTyxhQUFhLENBQUM7S0FDdEI7OztXQUVpQiw0QkFBQyxXQUFXLEVBQUU7QUFDOUIsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkUsVUFBTSxnQkFBZ0IsR0FBRyxrQkFBSyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkQsVUFBTSxRQUFRLEdBQUcsa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXRFLGFBQU8sa0JBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMvRDs7O1dBRW9CLCtCQUFDLFFBQVEsRUFBRTtBQUM5QixVQUFJLFFBQVEsS0FBSyxPQUFPLEVBQUU7QUFBRSxlQUFPLE1BQU0sQ0FBQztPQUFFO0FBQzVDLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztTQTNEa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL0x1Y2F6ei8uZG90ZmlsZXMvLmF0b20uc3ltbGluay9wYWNrYWdlcy9sYXRleC9saWIvYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVudlBhdGhLZXkgPSB0aGlzLmdldEVudmlyb25tZW50UGF0aEtleShwcm9jZXNzLnBsYXRmb3JtKTtcbiAgfVxuXG4gIHJ1bigvKiBmaWxlUGF0aCAqLykge31cbiAgY29uc3RydWN0QXJncygvKiBmaWxlUGF0aCAqLykge31cbiAgcGFyc2VMb2dGaWxlKC8qIHRleEZpbGVQYXRoICovKSB7fVxuXG4gIGNvbnN0cnVjdENoaWxkUHJvY2Vzc09wdGlvbnMoKSB7XG4gICAgY29uc3QgZW52ID0gXy5jbG9uZShwcm9jZXNzLmVudik7XG4gICAgY29uc3QgY2hpbGRQYXRoID0gdGhpcy5jb25zdHJ1Y3RQYXRoKCk7XG4gICAgaWYgKGNoaWxkUGF0aCkge1xuICAgICAgZW52W3RoaXMuZW52UGF0aEtleV0gPSBjaGlsZFBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtlbnZ9O1xuICB9XG5cbiAgY29uc3RydWN0UGF0aCgpIHtcbiAgICBsZXQgdGV4UGF0aCA9IChhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC50ZXhQYXRoXCIpIHx8IFwiXCIpLnRyaW0oKTtcbiAgICBpZiAodGV4UGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRleFBhdGggPSB0aGlzLmRlZmF1bHRUZXhQYXRoKHByb2Nlc3MucGxhdGZvcm0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByb2Nlc3NQYXRoID0gcHJvY2Vzcy5lbnZbdGhpcy5lbnZQYXRoS2V5XTtcbiAgICBjb25zdCBtYXRjaCA9IHRleFBhdGgubWF0Y2goL14oLiopKFxcJFBBVEgpKC4qKSQvKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiBgJHttYXRjaFsxXX0ke3Byb2Nlc3NQYXRofSR7bWF0Y2hbM119YDtcbiAgICB9XG5cbiAgICByZXR1cm4gW3RleFBhdGgsIHByb2Nlc3NQYXRoXVxuICAgICAgLmZpbHRlcihzdHIgPT4gc3RyICYmIHN0ci5sZW5ndGggPiAwKVxuICAgICAgLmpvaW4ocGF0aC5kZWxpbWl0ZXIpO1xuICB9XG5cbiAgZGVmYXVsdFRleFBhdGgocGxhdGZvcm0pIHtcbiAgICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgXCJDOlxcXFx0ZXhsaXZlXFxcXDIwMTRcXFxcYmluXFxcXHdpbjMyXCIsXG4gICAgICAgIFwiQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cXFxceDY0XCIsXG4gICAgICAgIFwiQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxNaUtUZVggMi45XFxcXG1pa3RleFxcXFxiaW5cIixcbiAgICAgIF0uam9pbihcIjtcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiL3Vzci90ZXhiaW5cIjtcbiAgfVxuXG4gIHJlc29sdmVMb2dGaWxlUGF0aCh0ZXhGaWxlUGF0aCkge1xuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKSB8fCBcIlwiO1xuICAgIGNvbnN0IGN1cnJlbnREaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUodGV4RmlsZVBhdGgpO1xuICAgIGNvbnN0IGZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZSh0ZXhGaWxlUGF0aCkucmVwbGFjZSgvXFwuXFx3KyQvLCBcIi5sb2dcIik7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKGN1cnJlbnREaXJlY3RvcnksIG91dHB1dERpcmVjdG9yeSwgZmlsZU5hbWUpO1xuICB9XG5cbiAgZ2V0RW52aXJvbm1lbnRQYXRoS2V5KHBsYXRmb3JtKSB7XG4gICAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHsgcmV0dXJuIFwiUGF0aFwiOyB9XG4gICAgcmV0dXJuIFwiUEFUSFwiO1xuICB9XG59XG4iXX0=