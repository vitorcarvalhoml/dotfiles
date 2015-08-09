function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require("./spec-helpers");

var _libLatex = require("../lib/latex");

var _libLatex2 = _interopRequireDefault(_libLatex);

var _stubs = require("./stubs");

"use babel";

describe("Latex", function () {
  var latex = undefined,
      globalLatex = undefined;

  beforeEach(function () {
    globalLatex = global.latex;
    delete global.latex;
    latex = new _libLatex2["default"]();
  });

  afterEach(function () {
    global.latex = globalLatex;
  });

  describe("initialize", function () {
    it("initializes all properties", function () {
      spyOn(latex, "resolveOpenerImplementation").andReturn(_stubs.NullOpener);

      expect(latex.builder).toBeDefined();
      expect(latex.logger).toBeDefined();
      expect(latex.opener).toBeDefined();
    });
  });

  describe("getDefaultBuilder", function () {
    it("returns an instance of LatexmkBuilder by default", function () {
      spyOn(latex, "useLatexmk").andReturn(true);
      var defaultBuilder = latex.getDefaultBuilder();
      expect(defaultBuilder.constructor.name).toBe("LatexmkBuilder");
    });

    it("returns an instance of TexifyBuilder when chosen", function () {
      spyOn(latex, "useLatexmk").andReturn(false);
      var defaultBuilder = latex.getDefaultBuilder();
      expect(defaultBuilder.constructor.name).toBe("TexifyBuilder");
    });
  });

  describe("getDefaultLogger", function () {
    it("returns an instance of ConsoleLogger", function () {
      var defaultLogger = latex.getDefaultLogger();

      expect(defaultLogger.constructor.name).toBe("ConsoleLogger");
    });
  });

  describe("getDefaultOpener", function () {
    it("returns an instance of a resolved implementation of Opener", function () {
      spyOn(latex, "resolveOpenerImplementation").andReturn(_stubs.NullOpener);
      var defaultOpener = latex.getDefaultOpener();

      expect(defaultOpener.constructor.name).toBe(_stubs.NullOpener.name);
    });
  });

  describe("Logger proxy", function () {
    var logger = undefined;

    beforeEach(function () {
      logger = jasmine.createSpyObj("MockLogger", ["error", "warning", "info"]);
      latex.setLogger(logger);
      latex.createLogProxy();
    });

    it("correctly proxies error to error", function () {
      var statusCode = 0;
      var result = { foo: "bar" };
      var builder = { run: function run() {
          return "";
        } };
      latex.log.error(statusCode, result, builder);

      expect(logger.error).toHaveBeenCalledWith(statusCode, result, builder);
    });

    it("correctly proxies warning to warning", function () {
      var message = "foo";
      latex.log.warning(message);

      expect(logger.warning).toHaveBeenCalledWith(message);
    });

    it("correctly proxies info to info", function () {
      var message = "foo";
      latex.log.info(message);

      expect(logger.info).toHaveBeenCalledWith(message);
    });
  });

  describe("resolveOpenerImplementation", function () {
    it("returns SkimOpener when installed, and running on OS X", function () {
      spyOn(latex, "skimExecutableExists").andReturn(true);
      var opener = latex.resolveOpenerImplementation("darwin");

      expect(opener.name).toBe("SkimOpener");
    });

    it("returns PreviewOpener when Skim is not installed, and running on OS X", function () {
      spyOn(latex, "skimExecutableExists").andReturn(false);
      var opener = latex.resolveOpenerImplementation("darwin");

      expect(opener.name).toBe("PreviewOpener");
    });

    it("returns SumatraOpener when installed, and running on Windows", function () {
      spyOn(latex, "sumatraExecutableExists").andReturn(true);
      var opener = latex.resolveOpenerImplementation("win32");

      expect(opener.name).toBe("SumatraOpener");
    });

    it("returns AtomPdfOpener as a fallback, if the pdf-view package is installed", function () {
      spyOn(latex, "hasPdfViewerPackage").andReturn(true);
      var opener = latex.resolveOpenerImplementation("foo");

      expect(opener.name).toBe("AtomPdfOpener");
    });

    it("always returns AtomPdfOpener if alwaysOpenResultInAtom is enabled and pdf-view is installed", function () {
      spyOn(latex, "hasPdfViewerPackage").andReturn(true);
      spyOn(latex, "shouldOpenResultInAtom").andReturn(true);
      spyOn(latex, "skimExecutableExists").andCallThrough();

      var opener = latex.resolveOpenerImplementation("darwin");

      expect(opener.name).toBe("AtomPdfOpener");
      expect(latex.skimExecutableExists).not.toHaveBeenCalled();
    });

    it("responds to changes in configuration", function () {
      spyOn(latex, "hasPdfViewerPackage").andReturn(true);
      spyOn(latex, "shouldOpenResultInAtom").andReturn(false);
      spyOn(latex, "skimExecutableExists").andReturn(true);

      var opener = latex.resolveOpenerImplementation("darwin");
      expect(opener.name).toBe("SkimOpener");

      latex.shouldOpenResultInAtom.andReturn(true);
      opener = latex.resolveOpenerImplementation("darwin");
      expect(opener.name).toBe("AtomPdfOpener");

      latex.shouldOpenResultInAtom.andReturn(false);
      opener = latex.resolveOpenerImplementation("darwin");
      expect(opener.name).toBe("SkimOpener");
    });

    it("does not support GNU/Linux", function () {
      spyOn(latex, "hasPdfViewerPackage").andReturn(false);
      var opener = latex.resolveOpenerImplementation("linux");

      expect(opener).toBeNull();
    });

    it("does not support unknown operating systems without pdf-view package", function () {
      spyOn(latex, "hasPdfViewerPackage").andReturn(false);
      var opener = latex.resolveOpenerImplementation("foo");

      expect(opener).toBeNull();
    });

    it("returns CustomOpener when custom viewer exists and alwaysOpenResultInAtom is disabled", function () {
      spyOn(latex, "viewerExecutableExists").andReturn(true);
      spyOn(latex, "shouldOpenResultInAtom").andReturn(false);
      var opener = latex.resolveOpenerImplementation("foo");

      expect(opener.name).toBe("CustomOpener");
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9MdWNhenovLmRvdGZpbGVzLy5hdG9tLnN5bWxpbmsvcGFja2FnZXMvbGF0ZXgvc3BlYy9sYXRleC1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O1FBRU8sZ0JBQWdCOzt3QkFDTCxjQUFjOzs7O3FCQUNQLFNBQVM7O0FBSmxDLFdBQVcsQ0FBQzs7QUFNWixRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDM0IsTUFBSSxLQUFLLFlBQUE7TUFBRSxXQUFXLFlBQUEsQ0FBQzs7QUFFdkIsWUFBVSxDQUFDLFlBQVc7QUFDcEIsZUFBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDM0IsV0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3BCLFNBQUssR0FBRywyQkFBVyxDQUFDO0dBQ3JCLENBQUMsQ0FBQzs7QUFFSCxXQUFTLENBQUMsWUFBVztBQUNuQixVQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztHQUM1QixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFXO0FBQ2hDLE1BQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFXO0FBQzFDLFdBQUssQ0FBQyxLQUFLLEVBQUUsNkJBQTZCLENBQUMsQ0FBQyxTQUFTLFFBakJuRCxVQUFVLENBaUJxRCxDQUFDOztBQUVsRSxZQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3BDLFlBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsWUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNwQyxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQVc7QUFDdkMsTUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQVc7QUFDaEUsV0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQyxT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QUcsS0FBSyxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4RCxZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDM0IsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx1RkFBdUYsRUFBRSxZQUFXO0FBQ3JHLFdBQUssQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkQsV0FBSyxDQUFDLEtBQUssRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4RCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsMkJBQTJCLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhELFlBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzFDLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvTHVjYXp6Ly5kb3RmaWxlcy8uYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xhdGV4L3NwZWMvbGF0ZXgtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBcIi4vc3BlYy1oZWxwZXJzXCI7XG5pbXBvcnQgTGF0ZXggZnJvbSBcIi4uL2xpYi9sYXRleFwiO1xuaW1wb3J0IHtOdWxsT3BlbmVyfSBmcm9tIFwiLi9zdHVic1wiO1xuXG5kZXNjcmliZShcIkxhdGV4XCIsIGZ1bmN0aW9uKCkge1xuICBsZXQgbGF0ZXgsIGdsb2JhbExhdGV4O1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgZ2xvYmFsTGF0ZXggPSBnbG9iYWwubGF0ZXg7XG4gICAgZGVsZXRlIGdsb2JhbC5sYXRleDtcbiAgICBsYXRleCA9IG5ldyBMYXRleCgpO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgZ2xvYmFsLmxhdGV4ID0gZ2xvYmFsTGF0ZXg7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiaW5pdGlhbGl6ZVwiLCBmdW5jdGlvbigpIHtcbiAgICBpdChcImluaXRpYWxpemVzIGFsbCBwcm9wZXJ0aWVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwicmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uXCIpLmFuZFJldHVybihOdWxsT3BlbmVyKTtcblxuICAgICAgZXhwZWN0KGxhdGV4LmJ1aWxkZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBleHBlY3QobGF0ZXgubG9nZ2VyKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KGxhdGV4Lm9wZW5lcikudG9CZURlZmluZWQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJnZXREZWZhdWx0QnVpbGRlclwiLCBmdW5jdGlvbigpIHtcbiAgICBpdChcInJldHVybnMgYW4gaW5zdGFuY2Ugb2YgTGF0ZXhta0J1aWxkZXIgYnkgZGVmYXVsdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHNweU9uKGxhdGV4LCBcInVzZUxhdGV4bWtcIikuYW5kUmV0dXJuKHRydWUpO1xuICAgICAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBsYXRleC5nZXREZWZhdWx0QnVpbGRlcigpO1xuICAgICAgZXhwZWN0KGRlZmF1bHRCdWlsZGVyLmNvbnN0cnVjdG9yLm5hbWUpLnRvQmUoXCJMYXRleG1rQnVpbGRlclwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmV0dXJucyBhbiBpbnN0YW5jZSBvZiBUZXhpZnlCdWlsZGVyIHdoZW4gY2hvc2VuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwidXNlTGF0ZXhta1wiKS5hbmRSZXR1cm4oZmFsc2UpO1xuICAgICAgY29uc3QgZGVmYXVsdEJ1aWxkZXIgPSBsYXRleC5nZXREZWZhdWx0QnVpbGRlcigpO1xuICAgICAgZXhwZWN0KGRlZmF1bHRCdWlsZGVyLmNvbnN0cnVjdG9yLm5hbWUpLnRvQmUoXCJUZXhpZnlCdWlsZGVyXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImdldERlZmF1bHRMb2dnZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgaXQoXCJyZXR1cm5zIGFuIGluc3RhbmNlIG9mIENvbnNvbGVMb2dnZXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBkZWZhdWx0TG9nZ2VyID0gbGF0ZXguZ2V0RGVmYXVsdExvZ2dlcigpO1xuXG4gICAgICBleHBlY3QoZGVmYXVsdExvZ2dlci5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKFwiQ29uc29sZUxvZ2dlclwiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJnZXREZWZhdWx0T3BlbmVyXCIsIGZ1bmN0aW9uKCkge1xuICAgIGl0KFwicmV0dXJucyBhbiBpbnN0YW5jZSBvZiBhIHJlc29sdmVkIGltcGxlbWVudGF0aW9uIG9mIE9wZW5lclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHNweU9uKGxhdGV4LCBcInJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvblwiKS5hbmRSZXR1cm4oTnVsbE9wZW5lcik7XG4gICAgICBjb25zdCBkZWZhdWx0T3BlbmVyID0gbGF0ZXguZ2V0RGVmYXVsdE9wZW5lcigpO1xuXG4gICAgICBleHBlY3QoZGVmYXVsdE9wZW5lci5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKE51bGxPcGVuZXIubmFtZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiTG9nZ2VyIHByb3h5XCIsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBsb2dnZXI7XG5cbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgbG9nZ2VyID0gamFzbWluZS5jcmVhdGVTcHlPYmooXCJNb2NrTG9nZ2VyXCIsIFtcImVycm9yXCIsIFwid2FybmluZ1wiLCBcImluZm9cIl0pO1xuICAgICAgbGF0ZXguc2V0TG9nZ2VyKGxvZ2dlcik7XG4gICAgICBsYXRleC5jcmVhdGVMb2dQcm94eSgpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJjb3JyZWN0bHkgcHJveGllcyBlcnJvciB0byBlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSAwO1xuICAgICAgY29uc3QgcmVzdWx0ID0ge2ZvbzogXCJiYXJcIn07XG4gICAgICBjb25zdCBidWlsZGVyID0ge3J1bigpIHsgcmV0dXJuIFwiXCI7IH19O1xuICAgICAgbGF0ZXgubG9nLmVycm9yKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG5cbiAgICAgIGV4cGVjdChsb2dnZXIuZXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHN0YXR1c0NvZGUsIHJlc3VsdCwgYnVpbGRlcik7XG4gICAgfSk7XG5cbiAgICBpdChcImNvcnJlY3RseSBwcm94aWVzIHdhcm5pbmcgdG8gd2FybmluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcImZvb1wiO1xuICAgICAgbGF0ZXgubG9nLndhcm5pbmcobWVzc2FnZSk7XG5cbiAgICAgIGV4cGVjdChsb2dnZXIud2FybmluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgobWVzc2FnZSk7XG4gICAgfSk7XG5cbiAgICBpdChcImNvcnJlY3RseSBwcm94aWVzIGluZm8gdG8gaW5mb1wiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcImZvb1wiO1xuICAgICAgbGF0ZXgubG9nLmluZm8obWVzc2FnZSk7XG5cbiAgICAgIGV4cGVjdChsb2dnZXIuaW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGgobWVzc2FnZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwicmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgIGl0KFwicmV0dXJucyBTa2ltT3BlbmVyIHdoZW4gaW5zdGFsbGVkLCBhbmQgcnVubmluZyBvbiBPUyBYXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwic2tpbUV4ZWN1dGFibGVFeGlzdHNcIikuYW5kUmV0dXJuKHRydWUpO1xuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKFwiZGFyd2luXCIpO1xuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoXCJTa2ltT3BlbmVyXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXR1cm5zIFByZXZpZXdPcGVuZXIgd2hlbiBTa2ltIGlzIG5vdCBpbnN0YWxsZWQsIGFuZCBydW5uaW5nIG9uIE9TIFhcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihsYXRleCwgXCJza2ltRXhlY3V0YWJsZUV4aXN0c1wiKS5hbmRSZXR1cm4oZmFsc2UpO1xuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKFwiZGFyd2luXCIpO1xuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoXCJQcmV2aWV3T3BlbmVyXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXR1cm5zIFN1bWF0cmFPcGVuZXIgd2hlbiBpbnN0YWxsZWQsIGFuZCBydW5uaW5nIG9uIFdpbmRvd3NcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihsYXRleCwgXCJzdW1hdHJhRXhlY3V0YWJsZUV4aXN0c1wiKS5hbmRSZXR1cm4odHJ1ZSk7XG4gICAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24oXCJ3aW4zMlwiKTtcblxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKFwiU3VtYXRyYU9wZW5lclwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmV0dXJucyBBdG9tUGRmT3BlbmVyIGFzIGEgZmFsbGJhY2ssIGlmIHRoZSBwZGYtdmlldyBwYWNrYWdlIGlzIGluc3RhbGxlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIHNweU9uKGxhdGV4LCBcImhhc1BkZlZpZXdlclBhY2thZ2VcIikuYW5kUmV0dXJuKHRydWUpO1xuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKFwiZm9vXCIpO1xuXG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoXCJBdG9tUGRmT3BlbmVyXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJhbHdheXMgcmV0dXJucyBBdG9tUGRmT3BlbmVyIGlmIGFsd2F5c09wZW5SZXN1bHRJbkF0b20gaXMgZW5hYmxlZCBhbmQgcGRmLXZpZXcgaXMgaW5zdGFsbGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwiaGFzUGRmVmlld2VyUGFja2FnZVwiKS5hbmRSZXR1cm4odHJ1ZSk7XG4gICAgICBzcHlPbihsYXRleCwgXCJzaG91bGRPcGVuUmVzdWx0SW5BdG9tXCIpLmFuZFJldHVybih0cnVlKTtcbiAgICAgIHNweU9uKGxhdGV4LCBcInNraW1FeGVjdXRhYmxlRXhpc3RzXCIpLmFuZENhbGxUaHJvdWdoKCk7XG5cbiAgICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbihcImRhcndpblwiKTtcblxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKFwiQXRvbVBkZk9wZW5lclwiKTtcbiAgICAgIGV4cGVjdChsYXRleC5za2ltRXhlY3V0YWJsZUV4aXN0cykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmVzcG9uZHMgdG8gY2hhbmdlcyBpbiBjb25maWd1cmF0aW9uXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwiaGFzUGRmVmlld2VyUGFja2FnZVwiKS5hbmRSZXR1cm4odHJ1ZSk7XG4gICAgICBzcHlPbihsYXRleCwgXCJzaG91bGRPcGVuUmVzdWx0SW5BdG9tXCIpLmFuZFJldHVybihmYWxzZSk7XG4gICAgICBzcHlPbihsYXRleCwgXCJza2ltRXhlY3V0YWJsZUV4aXN0c1wiKS5hbmRSZXR1cm4odHJ1ZSk7XG5cbiAgICAgIGxldCBvcGVuZXIgPSBsYXRleC5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24oXCJkYXJ3aW5cIik7XG4gICAgICBleHBlY3Qob3BlbmVyLm5hbWUpLnRvQmUoXCJTa2ltT3BlbmVyXCIpO1xuXG4gICAgICBsYXRleC5zaG91bGRPcGVuUmVzdWx0SW5BdG9tLmFuZFJldHVybih0cnVlKTtcbiAgICAgIG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbihcImRhcndpblwiKTtcbiAgICAgIGV4cGVjdChvcGVuZXIubmFtZSkudG9CZShcIkF0b21QZGZPcGVuZXJcIik7XG5cbiAgICAgIGxhdGV4LnNob3VsZE9wZW5SZXN1bHRJbkF0b20uYW5kUmV0dXJuKGZhbHNlKTtcbiAgICAgIG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbihcImRhcndpblwiKTtcbiAgICAgIGV4cGVjdChvcGVuZXIubmFtZSkudG9CZShcIlNraW1PcGVuZXJcIik7XG4gICAgfSk7XG5cbiAgICBpdChcImRvZXMgbm90IHN1cHBvcnQgR05VL0xpbnV4XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgc3B5T24obGF0ZXgsIFwiaGFzUGRmVmlld2VyUGFja2FnZVwiKS5hbmRSZXR1cm4oZmFsc2UpO1xuICAgICAgY29uc3Qgb3BlbmVyID0gbGF0ZXgucmVzb2x2ZU9wZW5lckltcGxlbWVudGF0aW9uKFwibGludXhcIik7XG5cbiAgICAgIGV4cGVjdChvcGVuZXIpLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdChcImRvZXMgbm90IHN1cHBvcnQgdW5rbm93biBvcGVyYXRpbmcgc3lzdGVtcyB3aXRob3V0IHBkZi12aWV3IHBhY2thZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihsYXRleCwgXCJoYXNQZGZWaWV3ZXJQYWNrYWdlXCIpLmFuZFJldHVybihmYWxzZSk7XG4gICAgICBjb25zdCBvcGVuZXIgPSBsYXRleC5yZXNvbHZlT3BlbmVySW1wbGVtZW50YXRpb24oXCJmb29cIik7XG5cbiAgICAgIGV4cGVjdChvcGVuZXIpLnRvQmVOdWxsKCk7XG4gICAgfSk7XG5cbiAgICBpdChcInJldHVybnMgQ3VzdG9tT3BlbmVyIHdoZW4gY3VzdG9tIHZpZXdlciBleGlzdHMgYW5kIGFsd2F5c09wZW5SZXN1bHRJbkF0b20gaXMgZGlzYWJsZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBzcHlPbihsYXRleCwgXCJ2aWV3ZXJFeGVjdXRhYmxlRXhpc3RzXCIpLmFuZFJldHVybih0cnVlKTtcbiAgICAgIHNweU9uKGxhdGV4LCBcInNob3VsZE9wZW5SZXN1bHRJbkF0b21cIikuYW5kUmV0dXJuKGZhbHNlKTtcbiAgICAgIGNvbnN0IG9wZW5lciA9IGxhdGV4LnJlc29sdmVPcGVuZXJJbXBsZW1lbnRhdGlvbihcImZvb1wiKTtcblxuICAgICAgZXhwZWN0KG9wZW5lci5uYW1lKS50b0JlKFwiQ3VzdG9tT3BlbmVyXCIpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19