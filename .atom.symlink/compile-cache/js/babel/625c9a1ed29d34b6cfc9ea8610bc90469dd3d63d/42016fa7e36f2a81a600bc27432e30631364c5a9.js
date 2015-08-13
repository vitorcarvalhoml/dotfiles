Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fsPlus = require("fs-plus");

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _werkzeug = require("./werkzeug");

"use babel";

var Composer = (function () {
  function Composer() {
    _classCallCheck(this, Composer);
  }

  _createClass(Composer, [{
    key: "destroy",
    value: function destroy() {
      this.destroyProgressIndicator();
      this.destroyErrorIndicator();
    }
  }, {
    key: "build",
    value: _asyncToGenerator(function* () {
      var _getEditorDetails = this.getEditorDetails();

      var editor = _getEditorDetails.editor;
      var filePath = _getEditorDetails.filePath;

      if (!filePath) {
        latex.log.warning("File needs to be saved to disk before it can be TeXified.");
        return Promise.reject(false);
      }

      if (!this.isTexFile(filePath)) {
        latex.log.warning((0, _werkzeug.heredoc)("File does not seem to be a TeX file;\n        unsupported extension \"" + _path2["default"].extname(filePath) + "\"."));
        return Promise.reject(false);
      }

      if (editor.isModified()) {
        editor.save(); // TODO: Make this configurable?
      }

      var builder = latex.getBuilder();
      var rootFilePath = this.resolveRootFilePath(filePath);

      this.destroyErrorIndicator();
      this.showProgressIndicator();

      var self = this;
      return new Promise(_asyncToGenerator(function* (resolve, reject) {
        var statusCode = undefined,
            result = undefined;

        var showBuildError = function showBuildError() {
          self.showError(statusCode, result, builder);
          reject(statusCode);
        };

        try {
          statusCode = yield builder.run(rootFilePath);
          result = builder.parseLogFile(rootFilePath);
          if (statusCode > 0 || !result || !result.outputFilePath) {
            showBuildError(statusCode, result, builder);
            return;
          }

          if (self.shouldMoveResult()) {
            self.moveResult(result, rootFilePath);
          }

          self.showResult(result);
          resolve(statusCode);
        } catch (error) {
          console.error(error.message);
          reject(error.message);
        } finally {
          self.destroyProgressIndicator();
        }
      }));
    })
  }, {
    key: "sync",
    value: function sync() {
      var _getEditorDetails2 = this.getEditorDetails();

      var filePath = _getEditorDetails2.filePath;
      var lineNumber = _getEditorDetails2.lineNumber;

      if (!filePath || !this.isTexFile(filePath)) {
        return;
      }

      var outputFilePath = this.resolveOutputFilePath(filePath);
      if (!outputFilePath) {
        latex.log.warning("Could not resolve path to output file associated with the current file.");
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        opener.open(outputFilePath, filePath, lineNumber);
      }
    }

    // NOTE: Does not support `latex.outputDirectory` setting!
  }, {
    key: "clean",
    value: _asyncToGenerator(function* () {
      var _getEditorDetails3 = this.getEditorDetails();

      var filePath = _getEditorDetails3.filePath;

      if (!filePath || !this.isTexFile(filePath)) {
        return Promise.reject();
      }

      var rootFilePath = this.resolveRootFilePath(filePath);
      var rootPath = _path2["default"].dirname(rootFilePath);
      var rootFile = _path2["default"].basename(rootFilePath);
      rootFile = rootFile.substring(0, rootFile.lastIndexOf("."));

      var cleanExtensions = atom.config.get("latex.cleanExtensions");
      return yield Promise.all(cleanExtensions.map(_asyncToGenerator(function* (extension) {
        var candidatePath = _path2["default"].join(rootPath, rootFile + extension);
        return new Promise(_asyncToGenerator(function* (resolve) {
          _fsPlus2["default"].remove(candidatePath, function (error) {
            resolve({ filePath: candidatePath, error: error });
          });
        }));
      })));
    })
  }, {
    key: "setStatusBar",
    value: function setStatusBar(statusBar) {
      this.statusBar = statusBar;
    }
  }, {
    key: "moveResult",
    value: function moveResult(result, filePath) {
      var originalOutputFilePath = result.outputFilePath;
      result.outputFilePath = this.alterParentPath(filePath, originalOutputFilePath);
      if (_fsPlus2["default"].existsSync(originalOutputFilePath)) {
        _fsPlus2["default"].removeSync(result.outputFilePath);
        _fsPlus2["default"].moveSync(originalOutputFilePath, result.outputFilePath);
      }

      var originalSyncFilePath = originalOutputFilePath.replace(/\.pdf$/, ".synctex.gz");
      if (_fsPlus2["default"].existsSync(originalSyncFilePath)) {
        var syncFilePath = this.alterParentPath(filePath, originalSyncFilePath);
        _fsPlus2["default"].removeSync(syncFilePath);
        _fsPlus2["default"].moveSync(originalSyncFilePath, syncFilePath);
      }
    }
  }, {
    key: "resolveRootFilePath",
    value: function resolveRootFilePath(filePath) {
      var MasterTexFinder = require("./master-tex-finder");
      var finder = new MasterTexFinder(filePath);
      return finder.getMasterTexPath();
    }
  }, {
    key: "resolveOutputFilePath",
    value: function resolveOutputFilePath(filePath) {
      var outputFilePath = undefined,
          rootFilePath = undefined;

      if (this.outputLookup) {
        outputFilePath = this.outputLookup[filePath];
      }

      if (!outputFilePath) {
        rootFilePath = this.resolveRootFilePath(filePath);

        var builder = latex.getBuilder();
        var result = builder.parseLogFile(rootFilePath);
        if (!result || !result.outputFilePath) {
          latex.log.warning("Log file parsing failed!");
          return null;
        }

        this.outputLookup = this.outputLookup || {};
        this.outputLookup[filePath] = result.outputFilePath;
      }

      if (this.shouldMoveResult()) {
        outputFilePath = this.alterParentPath(rootFilePath, outputFilePath);
      }

      return outputFilePath;
    }
  }, {
    key: "showResult",
    value: function showResult(result) {
      if (!this.shouldOpenResult()) {
        return;
      }

      var opener = latex.getOpener();
      if (opener) {
        var _getEditorDetails4 = this.getEditorDetails();

        var filePath = _getEditorDetails4.filePath;
        var lineNumber = _getEditorDetails4.lineNumber;

        opener.open(result.outputFilePath, filePath, lineNumber);
      }
    }
  }, {
    key: "showError",
    value: function showError(statusCode, result, builder) {
      this.showErrorIndicator(result);
      latex.log.error(statusCode, result, builder);
    }
  }, {
    key: "showProgressIndicator",
    value: function showProgressIndicator() {
      if (!this.statusBar) {
        return null;
      }
      if (this.indicator) {
        return this.indicator;
      }

      var ProgressIndicatorView = require("./views/progress-indicator-view");
      this.indicator = new ProgressIndicatorView();
      this.statusBar.addRightTile({ item: this.indicator, priority: 9001 });

      return this.indicator;
    }
  }, {
    key: "showErrorIndicator",
    value: function showErrorIndicator(result) {
      if (!this.statusBar) {
        return null;
      }
      if (this.errorIndicator) {
        return this.errorIndicator;
      }

      var ErrorIndicatorView = require("./views/error-indicator-view");
      this.errorIndicator = new ErrorIndicatorView();
      this.errorIndicator.initialize(result);
      this.statusBar.addRightTile({ item: this.errorIndicator, priority: 9001 });

      return this.errorIndicator;
    }
  }, {
    key: "destroyProgressIndicator",
    value: function destroyProgressIndicator() {
      if (this.indicator) {
        this.indicator.remove();
        this.indicator = null;
      }
    }
  }, {
    key: "destroyErrorIndicator",
    value: function destroyErrorIndicator() {
      if (this.errorIndicator) {
        this.errorIndicator.remove();
        this.errorIndicator = null;
      }
    }
  }, {
    key: "isTexFile",
    value: function isTexFile(filePath) {
      // TODO: Improve; will suffice for the time being.
      return !filePath || filePath.search(/\.(tex|lhs)$/) > 0;
    }
  }, {
    key: "getEditorDetails",
    value: function getEditorDetails() {
      var editor = atom.workspace.getActiveTextEditor();
      var filePath = undefined,
          lineNumber = undefined;
      if (editor) {
        filePath = editor.getPath();
        lineNumber = editor.getCursorBufferPosition().row + 1;
      }

      return {
        editor: editor,
        filePath: filePath,
        lineNumber: lineNumber
      };
    }
  }, {
    key: "alterParentPath",
    value: function alterParentPath(targetPath, originalPath) {
      var targetDir = _path2["default"].dirname(targetPath);
      return _path2["default"].join(targetDir, _path2["default"].basename(originalPath));
    }
  }, {
    key: "shouldMoveResult",
    value: function shouldMoveResult() {
      var moveResult = atom.config.get("latex.moveResultToSourceDirectory");
      var outputDirectory = atom.config.get("latex.outputDirectory");
      return moveResult && outputDirectory.length > 0;
    }
  }, {
    key: "shouldOpenResult",
    value: function shouldOpenResult() {
      return atom.config.get("latex.openResultAfterBuild");
    }
  }]);

  return Composer;
})();

exports["default"] = Composer;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGF0ZXgvbGliL2NvbXBvc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFZSxTQUFTOzs7O29CQUNQLE1BQU07Ozs7d0JBQ0QsWUFBWTs7QUFKbEMsV0FBVyxDQUFDOztJQU1TLFFBQVE7V0FBUixRQUFROzBCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBQ3BCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7S0FDOUI7Ozs2QkFFVSxhQUFHOzhCQUNlLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7VUFBM0MsTUFBTSxxQkFBTixNQUFNO1VBQUUsUUFBUSxxQkFBUixRQUFROztBQUV2QixVQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkRBQTJELENBQUMsQ0FBQztBQUMvRSxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDN0IsYUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0dBQ1Msa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFLLENBQUMsQ0FBQztBQUN4RCxlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdkIsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2Y7O0FBRUQsVUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ25DLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFeEQsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDN0IsVUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTdCLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQixhQUFPLElBQUksT0FBTyxtQkFBQyxXQUFlLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDakQsWUFBSSxVQUFVLFlBQUE7WUFBRSxNQUFNLFlBQUEsQ0FBQzs7QUFFdkIsWUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFjO0FBQ2hDLGNBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3BCLENBQUM7O0FBRUYsWUFBSTtBQUNGLG9CQUFVLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLGdCQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1QyxjQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3ZELDBCQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxtQkFBTztXQUNSOztBQUVELGNBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFDM0IsZ0JBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1dBQ3ZDOztBQUVELGNBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsaUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyQixDQUNELE9BQU8sS0FBSyxFQUFFO0FBQ1osaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCLFNBQ087QUFDTixjQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztPQUNGLEVBQUMsQ0FBQztLQUNKOzs7V0FFRyxnQkFBRzsrQkFDMEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztVQUEvQyxRQUFRLHNCQUFSLFFBQVE7VUFBRSxVQUFVLHNCQUFWLFVBQVU7O0FBQzNCLFVBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzFDLGVBQU87T0FDUjs7QUFFRCxVQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUQsVUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixhQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO0FBQzdGLGVBQU87T0FDUjs7QUFFRCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDakMsVUFBSSxNQUFNLEVBQUU7QUFDVixjQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7T0FDbkQ7S0FDRjs7Ozs7NkJBR1UsYUFBRzsrQkFDTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O1VBQW5DLFFBQVEsc0JBQVIsUUFBUTs7QUFDZixVQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMxQyxlQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUN6Qjs7QUFFRCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEQsVUFBTSxRQUFRLEdBQUcsa0JBQUssT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVDLFVBQUksUUFBUSxHQUFHLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMzQyxjQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUU1RCxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pFLGFBQU8sa0JBQU8sZUFBZSxDQUFDLEdBQUcsbUJBQUMsV0FBZSxTQUFTLEVBQUU7QUFDMUQsWUFBTSxhQUFhLEdBQUcsa0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDaEUsZUFBTyxJQUFJLE9BQU8sbUJBQUMsV0FBZSxPQUFPLEVBQUU7QUFDekMsOEJBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNsQyxtQkFBTyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztXQUNsRCxDQUFDLENBQUM7U0FDSixFQUFDLENBQUM7T0FDSixFQUFDLENBQUEsQ0FBQztLQUNKOzs7V0FFVyxzQkFBQyxTQUFTLEVBQUU7QUFDdEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDNUI7OztXQUVTLG9CQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDM0IsVUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQ3JELFlBQU0sQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUMvRSxVQUFJLG9CQUFHLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO0FBQ3pDLDRCQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckMsNEJBQUcsUUFBUSxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztPQUM1RDs7QUFFRCxVQUFNLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDckYsVUFBSSxvQkFBRyxVQUFVLENBQUMsb0JBQW9CLENBQUMsRUFBRTtBQUN2QyxZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFFLDRCQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1Qiw0QkFBRyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLENBQUM7T0FDakQ7S0FDRjs7O1dBRWtCLDZCQUFDLFFBQVEsRUFBRTtBQUM1QixVQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN2RCxVQUFNLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QyxhQUFPLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ2xDOzs7V0FFb0IsK0JBQUMsUUFBUSxFQUFFO0FBQzlCLFVBQUksY0FBYyxZQUFBO1VBQUUsWUFBWSxZQUFBLENBQUM7O0FBRWpDLFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixzQkFBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDOUM7O0FBRUQsVUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixvQkFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbEQsWUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ25DLFlBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7QUFDckMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUM5QyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxZQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDO0FBQzVDLFlBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztPQUNyRDs7QUFFRCxVQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO0FBQzNCLHNCQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7T0FDckU7O0FBRUQsYUFBTyxjQUFjLENBQUM7S0FDdkI7OztXQUVTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRXpDLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNqQyxVQUFJLE1BQU0sRUFBRTtpQ0FDcUIsSUFBSSxDQUFDLGdCQUFnQixFQUFFOztZQUEvQyxRQUFRLHNCQUFSLFFBQVE7WUFBRSxVQUFVLHNCQUFWLFVBQVU7O0FBQzNCLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7T0FDMUQ7S0FDRjs7O1dBRVEsbUJBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDckMsVUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLFdBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7OztXQUVvQixpQ0FBRztBQUN0QixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUFFLGVBQU8sSUFBSSxDQUFDO09BQUU7QUFDckMsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO09BQUU7O0FBRTlDLFVBQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDekUsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFxQixFQUFFLENBQUM7QUFDN0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzs7QUFFcEUsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0tBQ3ZCOzs7V0FFaUIsNEJBQUMsTUFBTSxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQUUsZUFBTyxJQUFJLENBQUM7T0FBRTtBQUNyQyxVQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFBRSxlQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7T0FBRTs7QUFFeEQsVUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNuRSxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUMvQyxVQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDOztBQUV6RSxhQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDNUI7OztXQUV1QixvQ0FBRztBQUN6QixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN4QixZQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztPQUN2QjtLQUNGOzs7V0FFb0IsaUNBQUc7QUFDdEIsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDN0IsWUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7T0FDNUI7S0FDRjs7O1dBRVEsbUJBQUMsUUFBUSxFQUFFOztBQUVsQixhQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3pEOzs7V0FFZSw0QkFBRztBQUNqQixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDcEQsVUFBSSxRQUFRLFlBQUE7VUFBRSxVQUFVLFlBQUEsQ0FBQztBQUN6QixVQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLGtCQUFVLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUN2RDs7QUFFRCxhQUFPO0FBQ0wsY0FBTSxFQUFFLE1BQU07QUFDZCxnQkFBUSxFQUFFLFFBQVE7QUFDbEIsa0JBQVUsRUFBRSxVQUFVO09BQ3ZCLENBQUM7S0FDSDs7O1dBRWMseUJBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtBQUN4QyxVQUFNLFNBQVMsR0FBRyxrQkFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0MsYUFBTyxrQkFBSyxJQUFJLENBQUMsU0FBUyxFQUFFLGtCQUFLLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQzFEOzs7V0FFZSw0QkFBRztBQUNqQixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3hFLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDakUsYUFBTyxVQUFVLElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDakQ7OztXQUVlLDRCQUFHO0FBQUUsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQUU7OztTQWxQekQsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL0x1Y2F6ei8uZG90ZmlsZXMvLmF0b20uc3ltbGluay9wYWNrYWdlcy9sYXRleC9saWIvY29tcG9zZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgZnMgZnJvbSBcImZzLXBsdXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge2hlcmVkb2N9IGZyb20gXCIuL3dlcmt6ZXVnXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBvc2VyIHtcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lQcm9ncmVzc0luZGljYXRvcigpO1xuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKCk7XG4gIH1cblxuICBhc3luYyBidWlsZCgpIHtcbiAgICBjb25zdCB7ZWRpdG9yLCBmaWxlUGF0aH0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcblxuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiRmlsZSBuZWVkcyB0byBiZSBzYXZlZCB0byBkaXNrIGJlZm9yZSBpdCBjYW4gYmUgVGVYaWZpZWQuXCIpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNUZXhGaWxlKGZpbGVQYXRoKSkge1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcoaGVyZWRvYyhgRmlsZSBkb2VzIG5vdCBzZWVtIHRvIGJlIGEgVGVYIGZpbGU7XG4gICAgICAgIHVuc3VwcG9ydGVkIGV4dGVuc2lvbiBcIiR7cGF0aC5leHRuYW1lKGZpbGVQYXRoKX1cIi5gKSk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZmFsc2UpO1xuICAgIH1cblxuICAgIGlmIChlZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBlZGl0b3Iuc2F2ZSgpOyAvLyBUT0RPOiBNYWtlIHRoaXMgY29uZmlndXJhYmxlP1xuICAgIH1cblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBsYXRleC5nZXRCdWlsZGVyKCk7XG4gICAgY29uc3Qgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKTtcblxuICAgIHRoaXMuZGVzdHJveUVycm9ySW5kaWNhdG9yKCk7XG4gICAgdGhpcy5zaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyBmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGxldCBzdGF0dXNDb2RlLCByZXN1bHQ7XG5cbiAgICAgIGNvbnN0IHNob3dCdWlsZEVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuc2hvd0Vycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gICAgICAgIHJlamVjdChzdGF0dXNDb2RlKTtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXR1c0NvZGUgPSBhd2FpdCBidWlsZGVyLnJ1bihyb290RmlsZVBhdGgpO1xuICAgICAgICByZXN1bHQgPSBidWlsZGVyLnBhcnNlTG9nRmlsZShyb290RmlsZVBhdGgpO1xuICAgICAgICBpZiAoc3RhdHVzQ29kZSA+IDAgfHwgIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgICAgc2hvd0J1aWxkRXJyb3Ioc3RhdHVzQ29kZSwgcmVzdWx0LCBidWlsZGVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgICAgICBzZWxmLm1vdmVSZXN1bHQocmVzdWx0LCByb290RmlsZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5zaG93UmVzdWx0KHJlc3VsdCk7XG4gICAgICAgIHJlc29sdmUoc3RhdHVzQ29kZSk7XG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmVqZWN0KGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIHNlbGYuZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzeW5jKCkge1xuICAgIGNvbnN0IHtmaWxlUGF0aCwgbGluZU51bWJlcn0gPSB0aGlzLmdldEVkaXRvckRldGFpbHMoKTtcbiAgICBpZiAoIWZpbGVQYXRoIHx8ICF0aGlzLmlzVGV4RmlsZShmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXRGaWxlUGF0aCA9IHRoaXMucmVzb2x2ZU91dHB1dEZpbGVQYXRoKGZpbGVQYXRoKTtcbiAgICBpZiAoIW91dHB1dEZpbGVQYXRoKSB7XG4gICAgICBsYXRleC5sb2cud2FybmluZyhcIkNvdWxkIG5vdCByZXNvbHZlIHBhdGggdG8gb3V0cHV0IGZpbGUgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXJyZW50IGZpbGUuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LmdldE9wZW5lcigpO1xuICAgIGlmIChvcGVuZXIpIHtcbiAgICAgIG9wZW5lci5vcGVuKG91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgLy8gTk9URTogRG9lcyBub3Qgc3VwcG9ydCBgbGF0ZXgub3V0cHV0RGlyZWN0b3J5YCBzZXR0aW5nIVxuICBhc3luYyBjbGVhbigpIHtcbiAgICBjb25zdCB7ZmlsZVBhdGh9ID0gdGhpcy5nZXRFZGl0b3JEZXRhaWxzKCk7XG4gICAgaWYgKCFmaWxlUGF0aCB8fCAhdGhpcy5pc1RleEZpbGUoZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKTtcbiAgICB9XG5cbiAgICBjb25zdCByb290RmlsZVBhdGggPSB0aGlzLnJlc29sdmVSb290RmlsZVBhdGgoZmlsZVBhdGgpO1xuICAgIGNvbnN0IHJvb3RQYXRoID0gcGF0aC5kaXJuYW1lKHJvb3RGaWxlUGF0aCk7XG4gICAgbGV0IHJvb3RGaWxlID0gcGF0aC5iYXNlbmFtZShyb290RmlsZVBhdGgpO1xuICAgIHJvb3RGaWxlID0gcm9vdEZpbGUuc3Vic3RyaW5nKDAsIHJvb3RGaWxlLmxhc3RJbmRleE9mKFwiLlwiKSk7XG5cbiAgICBjb25zdCBjbGVhbkV4dGVuc2lvbnMgPSBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5jbGVhbkV4dGVuc2lvbnNcIik7XG4gICAgcmV0dXJuIGF3YWl0KiBjbGVhbkV4dGVuc2lvbnMubWFwKGFzeW5jIGZ1bmN0aW9uKGV4dGVuc2lvbikge1xuICAgICAgY29uc3QgY2FuZGlkYXRlUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgcm9vdEZpbGUgKyBleHRlbnNpb24pO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgZnMucmVtb3ZlKGNhbmRpZGF0ZVBhdGgsIChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe2ZpbGVQYXRoOiBjYW5kaWRhdGVQYXRoLCBlcnJvcjogZXJyb3J9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgfVxuXG4gIG1vdmVSZXN1bHQocmVzdWx0LCBmaWxlUGF0aCkge1xuICAgIGNvbnN0IG9yaWdpbmFsT3V0cHV0RmlsZVBhdGggPSByZXN1bHQub3V0cHV0RmlsZVBhdGg7XG4gICAgcmVzdWx0Lm91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgoZmlsZVBhdGgsIG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKG9yaWdpbmFsT3V0cHV0RmlsZVBhdGgpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKHJlc3VsdC5vdXRwdXRGaWxlUGF0aCk7XG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbE91dHB1dEZpbGVQYXRoLCByZXN1bHQub3V0cHV0RmlsZVBhdGgpO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsU3luY0ZpbGVQYXRoID0gb3JpZ2luYWxPdXRwdXRGaWxlUGF0aC5yZXBsYWNlKC9cXC5wZGYkLywgXCIuc3luY3RleC5nelwiKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCkpIHtcbiAgICAgIGNvbnN0IHN5bmNGaWxlUGF0aCA9IHRoaXMuYWx0ZXJQYXJlbnRQYXRoKGZpbGVQYXRoLCBvcmlnaW5hbFN5bmNGaWxlUGF0aCk7XG4gICAgICBmcy5yZW1vdmVTeW5jKHN5bmNGaWxlUGF0aCk7XG4gICAgICBmcy5tb3ZlU3luYyhvcmlnaW5hbFN5bmNGaWxlUGF0aCwgc3luY0ZpbGVQYXRoKTtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKSB7XG4gICAgY29uc3QgTWFzdGVyVGV4RmluZGVyID0gcmVxdWlyZShcIi4vbWFzdGVyLXRleC1maW5kZXJcIik7XG4gICAgY29uc3QgZmluZGVyID0gbmV3IE1hc3RlclRleEZpbmRlcihmaWxlUGF0aCk7XG4gICAgcmV0dXJuIGZpbmRlci5nZXRNYXN0ZXJUZXhQYXRoKCk7XG4gIH1cblxuICByZXNvbHZlT3V0cHV0RmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgICBsZXQgb3V0cHV0RmlsZVBhdGgsIHJvb3RGaWxlUGF0aDtcblxuICAgIGlmICh0aGlzLm91dHB1dExvb2t1cCkge1xuICAgICAgb3V0cHV0RmlsZVBhdGggPSB0aGlzLm91dHB1dExvb2t1cFtmaWxlUGF0aF07XG4gICAgfVxuXG4gICAgaWYgKCFvdXRwdXRGaWxlUGF0aCkge1xuICAgICAgcm9vdEZpbGVQYXRoID0gdGhpcy5yZXNvbHZlUm9vdEZpbGVQYXRoKGZpbGVQYXRoKTtcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGxhdGV4LmdldEJ1aWxkZXIoKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkZXIucGFyc2VMb2dGaWxlKHJvb3RGaWxlUGF0aCk7XG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0Lm91dHB1dEZpbGVQYXRoKSB7XG4gICAgICAgIGxhdGV4LmxvZy53YXJuaW5nKFwiTG9nIGZpbGUgcGFyc2luZyBmYWlsZWQhXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vdXRwdXRMb29rdXAgPSB0aGlzLm91dHB1dExvb2t1cCB8fCB7fTtcbiAgICAgIHRoaXMub3V0cHV0TG9va3VwW2ZpbGVQYXRoXSA9IHJlc3VsdC5vdXRwdXRGaWxlUGF0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRNb3ZlUmVzdWx0KCkpIHtcbiAgICAgIG91dHB1dEZpbGVQYXRoID0gdGhpcy5hbHRlclBhcmVudFBhdGgocm9vdEZpbGVQYXRoLCBvdXRwdXRGaWxlUGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dEZpbGVQYXRoO1xuICB9XG5cbiAgc2hvd1Jlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoIXRoaXMuc2hvdWxkT3BlblJlc3VsdCgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3Qgb3BlbmVyID0gbGF0ZXguZ2V0T3BlbmVyKCk7XG4gICAgaWYgKG9wZW5lcikge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBsaW5lTnVtYmVyfSA9IHRoaXMuZ2V0RWRpdG9yRGV0YWlscygpO1xuICAgICAgb3BlbmVyLm9wZW4ocmVzdWx0Lm91dHB1dEZpbGVQYXRoLCBmaWxlUGF0aCwgbGluZU51bWJlcik7XG4gICAgfVxuICB9XG5cbiAgc2hvd0Vycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcikge1xuICAgIHRoaXMuc2hvd0Vycm9ySW5kaWNhdG9yKHJlc3VsdCk7XG4gICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gIH1cblxuICBzaG93UHJvZ3Jlc3NJbmRpY2F0b3IoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICh0aGlzLmluZGljYXRvcikgeyByZXR1cm4gdGhpcy5pbmRpY2F0b3I7IH1cblxuICAgIGNvbnN0IFByb2dyZXNzSW5kaWNhdG9yVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdzL3Byb2dyZXNzLWluZGljYXRvci12aWV3XCIpO1xuICAgIHRoaXMuaW5kaWNhdG9yID0gbmV3IFByb2dyZXNzSW5kaWNhdG9yVmlldygpO1xuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7aXRlbTogdGhpcy5pbmRpY2F0b3IsIHByaW9yaXR5OiA5MDAxfSk7XG5cbiAgICByZXR1cm4gdGhpcy5pbmRpY2F0b3I7XG4gIH1cblxuICBzaG93RXJyb3JJbmRpY2F0b3IocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLnN0YXR1c0JhcikgeyByZXR1cm4gbnVsbDsgfVxuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7IHJldHVybiB0aGlzLmVycm9ySW5kaWNhdG9yOyB9XG5cbiAgICBjb25zdCBFcnJvckluZGljYXRvclZpZXcgPSByZXF1aXJlKFwiLi92aWV3cy9lcnJvci1pbmRpY2F0b3Itdmlld1wiKTtcbiAgICB0aGlzLmVycm9ySW5kaWNhdG9yID0gbmV3IEVycm9ySW5kaWNhdG9yVmlldygpO1xuICAgIHRoaXMuZXJyb3JJbmRpY2F0b3IuaW5pdGlhbGl6ZShyZXN1bHQpO1xuICAgIHRoaXMuc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZSh7aXRlbTogdGhpcy5lcnJvckluZGljYXRvciwgcHJpb3JpdHk6IDkwMDF9KTtcblxuICAgIHJldHVybiB0aGlzLmVycm9ySW5kaWNhdG9yO1xuICB9XG5cbiAgZGVzdHJveVByb2dyZXNzSW5kaWNhdG9yKCkge1xuICAgIGlmICh0aGlzLmluZGljYXRvcikge1xuICAgICAgdGhpcy5pbmRpY2F0b3IucmVtb3ZlKCk7XG4gICAgICB0aGlzLmluZGljYXRvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUVycm9ySW5kaWNhdG9yKCkge1xuICAgIGlmICh0aGlzLmVycm9ySW5kaWNhdG9yKSB7XG4gICAgICB0aGlzLmVycm9ySW5kaWNhdG9yLnJlbW92ZSgpO1xuICAgICAgdGhpcy5lcnJvckluZGljYXRvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaXNUZXhGaWxlKGZpbGVQYXRoKSB7XG4gICAgLy8gVE9ETzogSW1wcm92ZTsgd2lsbCBzdWZmaWNlIGZvciB0aGUgdGltZSBiZWluZy5cbiAgICByZXR1cm4gIWZpbGVQYXRoIHx8IGZpbGVQYXRoLnNlYXJjaCgvXFwuKHRleHxsaHMpJC8pID4gMDtcbiAgfVxuXG4gIGdldEVkaXRvckRldGFpbHMoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGxldCBmaWxlUGF0aCwgbGluZU51bWJlcjtcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBsaW5lTnVtYmVyID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93ICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWRpdG9yOiBlZGl0b3IsXG4gICAgICBmaWxlUGF0aDogZmlsZVBhdGgsXG4gICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyLFxuICAgIH07XG4gIH1cblxuICBhbHRlclBhcmVudFBhdGgodGFyZ2V0UGF0aCwgb3JpZ2luYWxQYXRoKSB7XG4gICAgY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5kaXJuYW1lKHRhcmdldFBhdGgpO1xuICAgIHJldHVybiBwYXRoLmpvaW4odGFyZ2V0RGlyLCBwYXRoLmJhc2VuYW1lKG9yaWdpbmFsUGF0aCkpO1xuICB9XG5cbiAgc2hvdWxkTW92ZVJlc3VsdCgpIHtcbiAgICBjb25zdCBtb3ZlUmVzdWx0ID0gYXRvbS5jb25maWcuZ2V0KFwibGF0ZXgubW92ZVJlc3VsdFRvU291cmNlRGlyZWN0b3J5XCIpO1xuICAgIGNvbnN0IG91dHB1dERpcmVjdG9yeSA9IGF0b20uY29uZmlnLmdldChcImxhdGV4Lm91dHB1dERpcmVjdG9yeVwiKTtcbiAgICByZXR1cm4gbW92ZVJlc3VsdCAmJiBvdXRwdXREaXJlY3RvcnkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHNob3VsZE9wZW5SZXN1bHQoKSB7IHJldHVybiBhdG9tLmNvbmZpZy5nZXQoXCJsYXRleC5vcGVuUmVzdWx0QWZ0ZXJCdWlsZFwiKTsgfVxufVxuIl19