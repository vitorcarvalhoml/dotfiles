(function() {
  var path;

  path = require('path');

  module.exports = {
    activate: function() {},
    provideLinter: function() {
      var provider, yaml;
      yaml = require('js-yaml');
      return provider = {
        grammarScopes: ['source.yaml'],
        scope: 'file',
        lintOnFly: true,
        processMessage: function(type, path, message) {
          var point;
          point = [message.mark.line, message.mark.column];
          return {
            type: type,
            text: message.reason,
            filePath: path,
            range: [point, point]
          };
        },
        lint: function(textEditor) {
          return new Promise(function(resolve) {
            var error, messages;
            messages = [];
            try {
              yaml.safeLoad(textEditor.getText(), {
                onWarning: function(warning) {
                  return messages.push(provider.processMessage('Warning', textEditor.getPath(), warning));
                }
              });
            } catch (_error) {
              error = _error;
              messages.push(provider.processMessage('Error', textEditor.getPath(), error));
            }
            return resolve(messages);
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQSxDQUFWO0FBQUEsSUFFQSxhQUFBLEVBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxjQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FBUCxDQUFBO2FBQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQyxhQUFELENBQWY7QUFBQSxRQUNBLEtBQUEsRUFBTyxNQURQO0FBQUEsUUFFQSxTQUFBLEVBQVcsSUFGWDtBQUFBLFFBR0EsY0FBQSxFQUFnQixTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsT0FBYixHQUFBO0FBQ2QsY0FBQSxLQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQWQsRUFBb0IsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFqQyxDQUFSLENBQUE7aUJBQ0E7QUFBQSxZQUNFLElBQUEsRUFBTSxJQURSO0FBQUEsWUFFRSxJQUFBLEVBQU0sT0FBTyxDQUFDLE1BRmhCO0FBQUEsWUFHRSxRQUFBLEVBQVUsSUFIWjtBQUFBLFlBSUUsS0FBQSxFQUFPLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FKVDtZQUZjO1FBQUEsQ0FIaEI7QUFBQSxRQVdBLElBQUEsRUFBTSxTQUFDLFVBQUQsR0FBQTtBQUNKLGlCQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxHQUFBO0FBQ2pCLGdCQUFBLGVBQUE7QUFBQSxZQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFDQTtBQUNFLGNBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQWQsRUFBb0M7QUFBQSxnQkFBQSxTQUFBLEVBQVcsU0FBQyxPQUFELEdBQUE7eUJBQzdDLFFBQVEsQ0FBQyxJQUFULENBQWMsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsU0FBeEIsRUFBbUMsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFuQyxFQUF5RCxPQUF6RCxDQUFkLEVBRDZDO2dCQUFBLENBQVg7ZUFBcEMsQ0FBQSxDQURGO2FBQUEsY0FBQTtBQUlFLGNBREksY0FDSixDQUFBO0FBQUEsY0FBQSxRQUFRLENBQUMsSUFBVCxDQUFjLFFBQVEsQ0FBQyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBakMsRUFBdUQsS0FBdkQsQ0FBZCxDQUFBLENBSkY7YUFEQTttQkFNQSxPQUFBLENBQVEsUUFBUixFQVBpQjtVQUFBLENBQVIsQ0FBWCxDQURJO1FBQUEsQ0FYTjtRQUhXO0lBQUEsQ0FGZjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter-js-yaml/lib/linter-js-yaml.coffee