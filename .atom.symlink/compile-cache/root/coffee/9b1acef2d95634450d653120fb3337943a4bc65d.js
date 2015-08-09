(function() {
  var CompositeDisposable, ProjectsAddView, ProjectsListView, Settings, fs,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  Settings = null;

  ProjectsListView = null;

  ProjectsAddView = null;

  module.exports = {
    config: {
      showPath: {
        type: 'boolean',
        "default": true
      },
      closeCurrent: {
        type: 'boolean',
        "default": false,
        description: "Currently disabled since it's broken. Waiting for a better way to implement it."
      },
      environmentSpecificProjects: {
        type: 'boolean',
        "default": false
      },
      sortBy: {
        type: 'string',
        description: 'Default sorting is the order in which the projects are',
        "default": 'default',
        "enum": ['default', 'title', 'group']
      }
    },
    projectManagerAddView: null,
    filepath: null,
    subscriptions: null,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.handleEvents();
      fs.exists(this.file(), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create " + (this.file())
                }) : void 0;
              }
            });
          } else {
            _this.subscribeToProjectsFile();
            return _this.loadCurrentProject();
          }
        };
      })(this));
      return atom.config.observe('project-manager.environmentSpecificProjects', (function(_this) {
        return function(newValue, obj) {
          var previous;
          if (obj == null) {
            obj = {};
          }
          previous = obj.previous != null ? obj.previous : newValue;
          if (newValue !== previous) {
            _this.updateFile();
            return _this.subscribeToProjectsFile();
          }
        };
      })(this));
    },
    handleEvents: function(state) {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'project-manager:toggle': (function(_this) {
          return function() {
            var projectsListView;
            if (ProjectsListView == null) {
              ProjectsListView = require('./project-manager-view');
            }
            projectsListView = new ProjectsListView();
            return projectsListView.toggle(_this);
          };
        })(this),
        'project-manager:save-project': (function(_this) {
          return function() {
            var projectsAddView;
            if (ProjectsAddView == null) {
              ProjectsAddView = require('./project-manager-add-view');
            }
            projectsAddView = new ProjectsAddView();
            return projectsAddView.toggle(_this);
          };
        })(this),
        'project-manager:edit-projects': (function(_this) {
          return function() {
            return atom.workspace.open(_this.file());
          };
        })(this),
        'project-manager:reload-project-settings': (function(_this) {
          return function() {
            return _this.loadCurrentProject();
          };
        })(this)
      }));
    },
    file: function(update) {
      var filedir, filename, hostname, os;
      if (update == null) {
        update = false;
      }
      if (update) {
        this.filepath = null;
      }
      if (this.filepath == null) {
        filename = 'projects.cson';
        filedir = atom.getConfigDirPath();
        if (atom.config.get('project-manager.environmentSpecificProjects')) {
          os = require('os');
          hostname = os.hostname().split('.').shift().toLowerCase();
          filename = "projects." + hostname + ".cson";
        }
        this.filepath = "" + filedir + "/" + filename;
      }
      return this.filepath;
    },
    updateFile: function() {
      return fs.exists(this.file(true), (function(_this) {
        return function(exists) {
          if (!exists) {
            return fs.writeFile(_this.file(), '{}', function(error) {
              var options, _ref;
              if (error) {
                return (_ref = atom.notifications) != null ? _ref.addError("Project Manager", options = {
                  details: "Could not create " + (this.file())
                }) : void 0;
              }
            });
          }
        };
      })(this));
    },
    subscribeToProjectsFile: function() {
      if (this.fileWatcher != null) {
        this.fileWatcher.close();
      }
      return this.fileWatcher = fs.watch(this.file(), (function(_this) {
        return function(event, filename) {
          return _this.loadCurrentProject();
        };
      })(this));
    },
    loadCurrentProject: function(done) {
      var CSON, _;
      CSON = require('season');
      _ = require('underscore-plus');
      return CSON.readFile(this.file(), (function(_this) {
        return function(error, data) {
          var project;
          if (!error) {
            project = _this.getCurrentProject(data);
            if (project) {
              if ((project.template != null) && (data[project.template] != null)) {
                project = _.deepExtend(project, data[project.template]);
              }
              if (Settings == null) {
                Settings = require('./settings');
              }
              if (project.settings != null) {
                Settings.enable(project.settings);
              }
            }
          }
          return typeof done === "function" ? done() : void 0;
        };
      })(this));
    },
    getCurrentProject: function(projects) {
      var path, project, title, _i, _len, _ref;
      for (title in projects) {
        project = projects[title];
        if (project.paths == null) {
          continue;
        }
        _ref = project.paths;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          if (__indexOf.call(atom.project.getPaths(), path) >= 0) {
            return project;
          }
        }
      }
      return false;
    },
    addProject: function(project) {
      var CSON, errorMessage, projects, successMessage;
      CSON = require('season');
      projects = CSON.readFileSync(this.file()) || {};
      projects[project.title] = project;
      successMessage = "" + project.title + " has been added";
      errorMessage = "" + project.title + " could not be saved to " + (this.file());
      return CSON.writeFile(this.file(), projects, function(err) {
        var _ref, _ref1;
        if (!err) {
          return (_ref = atom.notifications) != null ? _ref.addSuccess(successMessage) : void 0;
        } else {
          return (_ref1 = atom.notifications) != null ? _ref1.addError(errorMessage) : void 0;
        }
      });
    },
    openProject: function(project) {
      var options;
      return atom.open(options = {
        pathsToOpen: project.paths,
        devMode: project.devMode
      });
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsSUFIbkIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsSUFKbEIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FERjtBQUFBLE1BSUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFDRSxpRkFIRjtPQUxGO0FBQUEsTUFXQSwyQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FaRjtBQUFBLE1BZUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsV0FBQSxFQUFhLHdEQURiO0FBQUEsUUFFQSxTQUFBLEVBQVMsU0FGVDtBQUFBLFFBR0EsTUFBQSxFQUFNLENBQ0osU0FESSxFQUVKLE9BRkksRUFHSixPQUhJLENBSE47T0FoQkY7S0FERjtBQUFBLElBMEJBLHFCQUFBLEVBQXVCLElBMUJ2QjtBQUFBLElBMkJBLFFBQUEsRUFBVSxJQTNCVjtBQUFBLElBNEJBLGFBQUEsRUFBZSxJQTVCZjtBQUFBLElBOEJBLFFBQUEs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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/project-manager/lib/project-manager.coffee