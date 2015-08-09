(function() {
  var CompositeDisposable, Linter, LinterCpplint, linterPath, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  path = require('path');

  LinterCpplint = (function(_super) {
    __extends(LinterCpplint, _super);

    LinterCpplint.syntax = ['source.cpp'];

    LinterCpplint.prototype.linterName = 'cpplint';

    LinterCpplint.prototype.regex = '.+:(?<line>\\d+):\\s+(?<message>.*).+\\[\\d\\]$';

    LinterCpplint.prototype.regexFlags = 'm';

    LinterCpplint.prototype.defaultLevel = 'warning';

    LinterCpplint.prototype.isNodeExecutable = false;

    LinterCpplint.prototype.errorStream = 'stderr';

    function LinterCpplint(editor) {
      LinterCpplint.__super__.constructor.call(this, editor);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-cpplint.cpplintExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-cpplint.cpplintExecutablePath');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.filters', (function(_this) {
        return function() {
          return _this.updateCommand();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.extensions', (function(_this) {
        return function() {
          return _this.updateCommand();
        };
      })(this)));
    }

    LinterCpplint.prototype.updateCommand = function() {
      var cmd, extensions, filters;
      filters = atom.config.get('linter-cpplint.filters');
      extensions = atom.config.get('linter-cpplint.extensions');
      cmd = "cpplint.py";
      if (filters) {
        cmd = "" + cmd + " --filter=" + filters;
      }
      if (extensions) {
        cmd = "" + cmd + " --extensions=" + extensions;
      }
      return this.cmd = cmd;
    };

    LinterCpplint.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    LinterCpplint.prototype.createMessage = function(match) {
      match.line = match.line > 0 ? match.line : 1;
      return LinterCpplint.__super__.createMessage.call(this, match);
    };

    return LinterCpplint;

  })(Linter);

  module.exports = LinterCpplint;

}).call(this);
