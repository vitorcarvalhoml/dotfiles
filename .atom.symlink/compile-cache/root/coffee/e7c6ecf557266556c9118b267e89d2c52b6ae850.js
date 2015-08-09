(function() {
  var path;

  path = require('path');

  module.exports = {
    config: {
      filters: {
        type: 'string',
        "default": ''
      },
      extensions: {
        type: 'string',
        "default": 'c++,cc,cpp,cu,cuh,h,hpp'
      },
      cpplintExecutablePath: {
        type: 'string',
        "default": path.join(__dirname, '..', 'bin')
      }
    },
    activate: function() {
      return console.log('activate linter-cpplint');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQURGO0FBQUEsTUFHQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMseUJBRFQ7T0FKRjtBQUFBLE1BTUEscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsS0FBM0IsQ0FEVDtPQVBGO0tBREY7QUFBQSxJQVdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFDUixPQUFPLENBQUMsR0FBUixDQUFZLHlCQUFaLEVBRFE7SUFBQSxDQVhWO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/linter-cpplint/lib/init.coffee