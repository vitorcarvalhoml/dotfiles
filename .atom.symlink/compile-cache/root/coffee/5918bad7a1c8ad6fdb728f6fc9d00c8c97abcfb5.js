(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
      linter.modifiesBuffer = Boolean(linter.modifiesBuffer);
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
      }
      if (linter.lint == null) {
        throw new Error("Missing linter.lint");
      }
      if (typeof linter.lint !== 'function') {
        throw new Error("linter.lint isn't a function");
      }
      return true;
    },
    messages: function(messages) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      messages.forEach(function(result) {
        if (!result.type) {
          throw new Error("Missing type field on Linter Response");
        }
        if (!(result.html || result.text)) {
          throw new Error("Missing html/text field on Linter Response");
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        if (result.trace) {
          return Validate.messages(result.trace);
        }
      });
      return void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBRWY7QUFBQSxJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQTtBQUVOLE1BQUEsTUFBTSxDQUFDLGNBQVAsR0FBd0IsT0FBQSxDQUFRLE1BQU0sQ0FBQyxjQUFmLENBQXhCLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLFlBQWdDLEtBQXZDLENBQUE7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFPLHNDQUFBLEdBQXNDLE1BQU0sQ0FBQyxhQUFwRCxDQUFWLENBREY7T0FEQTtBQUdBLE1BQUEsSUFBTyxtQkFBUDtBQUNFLGNBQVUsSUFBQSxLQUFBLENBQU0scUJBQU4sQ0FBVixDQURGO09BSEE7QUFLQSxNQUFBLElBQUcsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFVBQTNCO0FBQ0UsY0FBVSxJQUFBLEtBQUEsQ0FBTSw4QkFBTixDQUFWLENBREY7T0FMQTtBQU9BLGFBQU8sSUFBUCxDQVRNO0lBQUEsQ0FBUjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUMsUUFBRCxHQUFBO0FBQ1IsTUFBQSxJQUFBLENBQUEsQ0FBTyxRQUFBLFlBQW9CLEtBQTNCLENBQUE7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFPLDJDQUFBLEdBQTBDLENBQUMsTUFBQSxDQUFBLFFBQUQsQ0FBakQsQ0FBVixDQURGO09BQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQUMsTUFBRCxHQUFBO0FBQ2YsUUFBQSxJQUFBLENBQUEsTUFBYSxDQUFDLElBQWQ7QUFDRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSx1Q0FBTixDQUFWLENBREY7U0FBQTtBQUVBLFFBQUEsSUFBQSxDQUFBLENBQU8sTUFBTSxDQUFDLElBQVAsSUFBZSxNQUFNLENBQUMsSUFBN0IsQ0FBQTtBQUNFLGdCQUFVLElBQUEsS0FBQSxDQUFNLDRDQUFOLENBQVYsQ0FERjtTQUZBO0FBSUEsUUFBQSxJQUFnRCxvQkFBaEQ7QUFBQSxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsTUFBTSxDQUFDLEtBQXhCLENBQWYsQ0FBQTtTQUpBO0FBQUEsUUFLQSxNQUFNLENBQUMsR0FBUCxHQUFhLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQUxiLENBQUE7QUFBQSxRQU1BLE1BQU0sQ0FBQyxPQUFELENBQU4sR0FBZSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVosQ0FBQSxDQUF5QixDQUFDLE9BQTFCLENBQWtDLEdBQWxDLEVBQXVDLEdBQXZDLENBTmYsQ0FBQTtBQU9BLFFBQUEsSUFBbUMsTUFBTSxDQUFDLEtBQTFDO2lCQUFBLFFBQVEsQ0FBQyxRQUFULENBQWtCLE1BQU0sQ0FBQyxLQUF6QixFQUFBO1NBUmU7TUFBQSxDQUFqQixDQUZBLENBQUE7QUFXQSxhQUFPLE1BQVAsQ0FaUTtJQUFBLENBWFY7R0FMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter/lib/validate.coffee