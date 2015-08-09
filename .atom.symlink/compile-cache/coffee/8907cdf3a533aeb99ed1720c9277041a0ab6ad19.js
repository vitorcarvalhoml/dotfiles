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
