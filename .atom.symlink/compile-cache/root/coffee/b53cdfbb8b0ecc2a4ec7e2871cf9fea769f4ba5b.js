(function() {
  var CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, EventsDelegation, MinimapElement, MinimapQuickSettingsElement, debounce, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  EventsDelegation = require('atom-utils').EventsDelegation;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsElement = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);

    EventsDelegation.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            return _this.swapMinimapPosition();
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              return _this.measureHeightAndWidth();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.absoluteMode': (function(_this) {
          return function(absoluteMode) {
            _this.absoluteMode = absoluteMode;
            return _this.classList.toggle('absolute', _this.absoluteMode);
          };
        })(this),
        'editor.preferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrap': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'editor.softWrapAtPreferredLineLength': (function(_this) {
          return function() {
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.subscriptions.add(atom.views.pollDocument((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)));
      this.measureHeightAndWidth();
      this.attached = true;
      return this.subscriptions.add(atom.styles.onDidAddStyleElement((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
    };

    MinimapElement.prototype.detachedCallback = function() {
      return this.attached = false;
    };

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function() {
      if (this.attached) {
        return;
      }
      this.getTextEditorElementRoot().appendChild(this);
      this.swapMinimapPosition();
      return this.attached = true;
    };

    MinimapElement.prototype.attachToLeft = function() {
      return this.classList.add('left');
    };

    MinimapElement.prototype.attachToRight = function() {
      return this.classList.remove('left');
    };

    MinimapElement.prototype.swapMinimapPosition = function() {
      if (this.displayMinimapOnLeft) {
        return this.attachToLeft();
      } else {
        return this.attachToRight();
      }
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.detach();
      return this.minimap = null;
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      this.visibleArea.addEventListener('touchstart', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
          return _this.visibleArea.removeEventListener('touchstart', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      if (this.openQuickSettings != null) {
        return;
      }
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettingSubscription = this.subscribeTo(this.openQuickSettings, {
        'mousedown': (function(_this) {
          return function(e) {
            var left, right, top, _ref1;
            e.preventDefault();
            e.stopPropagation();
            if (_this.quickSettingsElement != null) {
              _this.quickSettingsElement.destroy();
              return _this.quickSettingsSubscription.dispose();
            } else {
              if (MinimapQuickSettingsElement == null) {
                MinimapQuickSettingsElement = require('./minimap-quick-settings-element');
              }
              _this.quickSettingsElement = new MinimapQuickSettingsElement;
              _this.quickSettingsElement.setModel(_this);
              _this.quickSettingsSubscription = _this.quickSettingsElement.onDidDestroy(function() {
                return _this.quickSettingsElement = null;
              });
              _ref1 = _this.canvas.getBoundingClientRect(), top = _ref1.top, left = _ref1.left, right = _ref1.right;
              _this.quickSettingsElement.style.top = top + 'px';
              _this.quickSettingsElement.attach();
              if (_this.displayMinimapOnLeft) {
                return _this.quickSettingsElement.style.left = right + 'px';
              } else {
                return _this.quickSettingsElement.style.left = (left - _this.quickSettingsElement.clientWidth) + 'px';
              }
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      if (this.openQuickSettings == null) {
        return;
      }
      this.controls.removeChild(this.openQuickSettings);
      this.openQuickSettingSubscription.dispose();
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref1;
      editorElement = this.getTextEditorElement();
      return (_ref1 = editorElement.shadowRoot) != null ? _ref1 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, editorHeight, indicatorHeight, indicatorScroll, visibleAreaLeft, visibleAreaTop, visibleWidth;
      if (!(this.attached && this.isVisible() && (this.minimap != null))) {
        return;
      }
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      visibleWidth = Math.min(this.canvas.width / devicePixelRatio, this.width);
      this.applyStyles(this.visibleArea, {
        width: visibleWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: visibleWidth + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        editorHeight = this.getTextEditor().getHeight();
        indicatorHeight = editorHeight * (editorHeight / this.minimap.getHeight());
        indicatorScroll = (editorHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pollDOM = function() {
      var visibilityChanged;
      visibilityChanged = this.checkForVisibilityChange();
      if (this.isVisible()) {
        if (!this.wasVisible) {
          this.requestForcedUpdate();
        }
        return this.measureHeightAndWidth(visibilityChanged, false);
      }
    };

    MinimapElement.prototype.checkForVisibilityChange = function() {
      if (this.isVisible()) {
        if (this.wasVisible) {
          return false;
        } else {
          return this.wasVisible = true;
        }
      } else {
        if (this.wasVisible) {
          this.wasVisible = false;
          return true;
        } else {
          return this.wasVisible = false;
        }
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function(visibilityChanged, forceUpdate) {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, wasResized, width;
      if (forceUpdate == null) {
        forceUpdate = true;
      }
      wasResized = this.width !== this.clientWidth || this.height !== this.clientHeight;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (wasResized || visibilityChanged || forceUpdate) {
        this.requestForcedUpdate();
      }
      if (!this.isVisible()) {
        return;
      }
      if (wasResized || forceUpdate) {
        if (this.adjustToSoftWrap) {
          lineLength = atom.config.get('editor.preferredLineLength');
          softWrap = atom.config.get('editor.softWrap');
          softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
          width = lineLength * this.minimap.getCharWidth();
          if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
            this.marginRight = width - this.width;
            canvasWidth = width;
          } else {
            this.marginRight = null;
          }
        } else {
          delete this.marginRight;
        }
        if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
          this.canvas.width = canvasWidth * devicePixelRatio;
          return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
        }
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(e) {
      var height, top, _ref1;
      if (e.which === 1) {
        return this.leftMousePressedOverCanvas(e);
      } else if (e.which === 2) {
        this.middleMousePressedOverCanvas(e);
        _ref1 = this.visibleArea.getBoundingClientRect(), top = _ref1.top, height = _ref1.height;
        return this.startDrag({
          which: 2,
          pageY: top + height / 2
        });
      } else {

      }
    };

    MinimapElement.prototype.leftMousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, textEditor, to, y;
      pageY = _arg.pageY, target = _arg.target;
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      textEditor = this.minimap.getTextEditor();
      scrollTop = row * textEditor.getLineHeightInPixels() - textEditor.getHeight() / 2;
      if (atom.config.get('minimap.scrollAnimation')) {
        from = textEditor.getScrollTop();
        to = scrollTop;
        step = function(now) {
          return textEditor.setScrollTop(now);
        };
        duration = atom.config.get('minimap.scrollAnimationDuration');
        return this.animate({
          from: from,
          to: to,
          duration: duration,
          step: step
        });
      } else {
        return textEditor.setScrollTop(scrollTop);
      }
    };

    MinimapElement.prototype.middleMousePressedOverCanvas = function(_arg) {
      var offsetTop, pageY, ratio, y;
      pageY = _arg.pageY;
      offsetTop = this.getBoundingClientRect().top;
      y = pageY - offsetTop - this.minimap.getTextEditorScaledHeight() / 2;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(e) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = e.which, pageY = e.pageY;
      if (!this.minimap) {
        return;
      }
      if (which !== 1 && which !== 2 && (e.touches == null)) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseleave', mouseupHandler);
      document.body.addEventListener('touchmove', mousemoveHandler);
      document.body.addEventListener('touchend', mouseupHandler);
      return this.dragSubscription = new Disposable(function() {
        document.body.removeEventListener('mousemove', mousemoveHandler);
        document.body.removeEventListener('mouseup', mouseupHandler);
        document.body.removeEventListener('mouseleave', mouseupHandler);
        document.body.removeEventListener('touchmove', mousemoveHandler);
        return document.body.removeEventListener('touchend', mouseupHandler);
      });
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (!this.minimap) {
        return;
      }
      if (e.which !== 1 && e.which !== 2 && (e.touches == null)) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      if (!this.minimap) {
        return;
      }
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.getTime = function() {
      return new Date();
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = this.getTime();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = (function(_this) {
        return function() {
          var delta, passed, progress;
          passed = _this.getTime() - start;
          if (duration === 0) {
            progress = 1;
          } else {
            progress = passed / duration;
          }
          if (progress > 1) {
            progress = 1;
          }
          delta = swing(progress);
          step(from + (to - from) * delta);
          if (progress < 1) {
            return requestAnimationFrame(update);
          }
        };
      })(this);
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQyxtQkFBb0IsT0FBQSxDQUFRLFlBQVIsRUFBcEIsZ0JBRkQsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLDRCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1BLDJCQUFBLEdBQThCLElBTjlCLENBQUE7O0FBQUEsRUFvQk07QUFDSixxQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFBQSxJQUVBLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLGNBQTdCLENBRkEsQ0FBQTs7QUFJQTtBQUFBLGdCQUpBOztBQUFBLDZCQU1BLG9CQUFBLEdBQXNCLEtBTnRCLENBQUE7O0FBQUEsNkJBaUJBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTthQUdBLElBQUMsQ0FBQSxhQUFELENBQ0U7QUFBQSxRQUFBLDhCQUFBLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxvQkFBRCxHQUFB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
//# sourceURL=/Users/Lucazz/.dotfiles/.atom.symlink/packages/minimap/lib/minimap-element.coffee