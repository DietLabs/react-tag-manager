import debug from 'debug';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var warn = debug('gtm:api:warning');
var log = debug('gtm:api:log');

var Api = function Api() {
  var _this = this;

  classCallCheck(this, Api);
  this.queue = [];
  this.dataLayer = {};

  this.init = function (dataLayerName) {
    _this.dataLayerName = dataLayerName;
  };

  this.loaded = function () {
    var gtm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _this.gtm = gtm || window[_this.dataLayerName];

    if (_this.queue.length > 0) {
      _this.queue.forEach(_this.trigger);
    }
  };

  this.setDataLayer = function (data) {
    _this.dataLayer = _extends({}, _this.dataLayer, data);
  };

  this.trigger = function (data) {
    if (_this.gtm) {
      var eventData = _extends({}, _this.dataLayer, data);

      _this.gtm.push(eventData);

      log('Event triggered', _extends({}, eventData));
    } else {
      warn('"gtm" not loaded! Event added to the queue');
      _this.queue.push(data);
    }
  };
};

var GtmContext = React.createContext({
  api: null
});

var canUseDom = function canUseDom() {
  return typeof window !== 'undefined';
};

var hasScriptWithSrc = function hasScriptWithSrc(src) {
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i += 1) {
    if (scripts[i].src === src) {
      return true;
    }
  }
  return false;
};

var loadScript = function loadScript(_ref, dataLayerName, loadCallback) {
  var id = _ref.id,
      auth = _ref.auth,
      preview = _ref.preview;

  var src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
  if (auth) {
    src += '&gtm_auth=' + auth;
  }

  if (preview) {
    src += '&gtm_preview=' + preview;
  }

  if (hasScriptWithSrc(src)) {
    window[dataLayerName] = window[dataLayerName] || [];
    loadCallback();
    return;
  }

  var script = document.createElement('SCRIPT');
  script.async = true;
  script.src = src;

  script.onload = function () {
    window[dataLayerName].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    loadCallback();
  };

  script.onerror = function () {
    throw new Error('Google Tag Manager could not be loaded.');
  };

  document.head.appendChild(script);
};

var loadNoScript = function loadNoScript(gtmID) {
  document.body.appendChild('<iframe src="//www.googletagmanager.com/ns.html?id=' + gtmID + '"\n        height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>');
};

var loadScripts = (function (gtm, dataLayerName, loadCallback) {
  // Check if we can use the dom just to be sure
  if (canUseDom()) {
    loadScript(gtm, dataLayerName, loadCallback);
  }
});

var scripts = /*#__PURE__*/Object.freeze({
  loadScript: loadScript,
  loadNoScript: loadNoScript,
  default: loadScripts
});

var shape = PropTypes.shape,
    func = PropTypes.func;


var GTMShape = shape({
  api: shape({
    trigger: func.isRequired,
    setDataLayer: func.isRequired
  }).isRequired
});

var withGTM = (function (Component) {
  return React.forwardRef(function (props, ref) {
    return React.createElement(
      GtmContext.Consumer,
      null,
      function (GTM) {
        return React.createElement(Component, _extends({}, props, { GTM: GTM, ref: ref }));
      }
    );
  });
});

var PageView = function (_React$Component) {
  inherits(PageView, _React$Component);

  function PageView() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, PageView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = PageView.__proto__ || Object.getPrototypeOf(PageView)).call.apply(_ref, [this].concat(args))), _this), _this.sendPageView = false, _this.triggerPageView = function () {
      if (!_this.sendPageView) {
        return;
      }

      _this.sendPageView = false;

      var _this$props = _this.props,
          eventData = _this$props.data,
          event = _this$props.event,
          GTM = _this$props.GTM,
          location = _this$props.location,
          settings = _this$props.settings;


      var data = _extends({}, eventData, defineProperty({}, settings.sendAs, location[settings.locationProp]));

      if (event && !data.event) {
        data.event = event;
      }

      GTM.api.trigger(data);
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(PageView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.sendPageView = true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var newPathName = this.props.location.pathname;
      var oldPathName = prevProps.location.pathname;


      if (newPathName !== oldPathName) {
        this.sendPageView = true;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      /**
       * We use Helmet's 'onChangeClientState' so we are sure the dom data is updated before sending the PageView
       */
      return React.createElement(Helmet, { onChangeClientState: function onChangeClientState() {
          return _this2.triggerPageView();
        } });
    }
  }]);
  return PageView;
}(React.Component);

PageView.propTypes = {
  event: PropTypes.string,
  data: PropTypes.object,

  location: PropTypes.object.isRequired,

  settings: PropTypes.shape({
    locationProp: PropTypes.string,
    sendAs: PropTypes.string
  }),

  GTM: GTMShape.isRequired
};
PageView.defaultProps = {
  event: 'pageview',
  data: {},

  settings: {
    locationProp: 'pathname',
    sendAs: 'url'
  }
};
PageView.displayName = 'PageView';
var PageView$1 = withRouter(withGTM(PageView));

var GTM = function (_React$Component) {
  inherits(GTM, _React$Component);

  function GTM(props) {
    classCallCheck(this, GTM);

    var _this = possibleConstructorReturn(this, (GTM.__proto__ || Object.getPrototypeOf(GTM)).call(this, props));

    _this.getValue = function () {
      return { api: _this.api };
    };

    _this.api = new Api();
    return _this;
  }

  createClass(GTM, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          gtm = _props.gtm,
          dataLayerName = _props.dataLayerName,
          dataLayer = _props.dataLayer;


      if (gtm && gtm.id) {
        this.api.init(dataLayerName);
        this.api.setDataLayer(dataLayer);

        loadScripts(gtm, dataLayerName, function () {
          _this2.api.loaded();
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          children = _props2.children,
          _props2$settings = _props2.settings,
          sendPageView = _props2$settings.sendPageView,
          pageView = _props2$settings.pageView;


      return React.createElement(
        GtmContext.Provider,
        { value: this.getValue() },
        React.createElement(
          React.Fragment,
          null,
          sendPageView && React.createElement(PageView$1, pageView),
          children
        )
      );
    }
  }]);
  return GTM;
}(React.Component);

GTM.propTypes = {
  dataLayerName: PropTypes.string,
  dataLayer: PropTypes.object,

  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,

  gtm: PropTypes.shape({
    id: PropTypes.string,
    auth: PropTypes.string,
    preview: PropTypes.string
  }),

  settings: PropTypes.shape({
    sendPageView: PropTypes.bool,
    pageView: PropTypes.object
  })
};
GTM.defaultProps = {
  dataLayerName: 'dataLayer',
  dataLayer: {},

  gtm: {
    id: null,
    auth: null,
    preview: null
  },

  settings: {
    sendPageView: false,
    pageview: null
  }
};
GTM.displayName = 'GTM';

var DataLayer = function (_React$Component) {
  inherits(DataLayer, _React$Component);

  function DataLayer(props) {
    classCallCheck(this, DataLayer);

    var _this = possibleConstructorReturn(this, (DataLayer.__proto__ || Object.getPrototypeOf(DataLayer)).call(this, props));

    _initialiseProps.call(_this);

    _this.updateDataLayer();
    return _this;
  }

  createClass(DataLayer, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateDataLayer();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          GTM = _props.GTM,
          settings = _props.settings,
          children = _props.children,
          _props$settings = _props.settings,
          passProps = _props$settings.passProps,
          withGTM$$1 = _props$settings.withGTM,
          rest = objectWithoutProperties(_props, ['GTM', 'settings', 'children', 'settings']);


      if (!passProps) {
        return children;
      }

      var props = _extends({}, rest);

      if (withGTM$$1) props.GTM = GTM;

      return React.createElement(
        React.Fragment,
        null,
        children && React.Children.map(children, function (child) {
          return React.cloneElement(child, props);
        })
      );
    }
  }]);
  return DataLayer;
}(React.Component);

DataLayer.propTypes = {
  GTM: PropTypes.shape({
    api: PropTypes.shape({
      setDataLayer: PropTypes.func.isRequired
    }).isRequired
  }).isRequired,

  settings: PropTypes.shape({
    passProps: PropTypes.bool,
    withGTM: PropTypes.bool
  }),

  children: PropTypes.oneOf([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
};
DataLayer.defaultProps = {
  settings: {
    passProps: false,
    withGTM: false
  },

  children: null
};

var _initialiseProps = function _initialiseProps() {
  this.updateDataLayer = function () {
    var _props2 = props,
        GTM = _props2.GTM,
        data = objectWithoutProperties(_props2, ['GTM']);


    GTM.api.setDataLayer(data);
  };
};

DataLayer.displayName = 'DataLayer';
var DataLayer$1 = withGTM(DataLayer);

var Click = function (_React$Component) {
  inherits(Click, _React$Component);

  function Click() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, Click);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = Click.__proto__ || Object.getPrototypeOf(Click)).call.apply(_ref, [this].concat(args))), _this), _this.handleOnClick = function (e) {
      var _this$props = _this.props,
          data = _this$props.data,
          event = _this$props.event,
          onClick = _this$props.onClick,
          GTM = _this$props.GTM;


      if (event && !data.event) {
        data.event = event;
      }

      GTM.api.trigger(data);

      if (onClick) {
        onClick(e);
      }
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(Click, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          onClick = _props.onClick,
          event = _props.event,
          GTM = _props.GTM,
          props = objectWithoutProperties(_props, ['children', 'onClick', 'event', 'GTM']);


      return React.createElement(
        React.Fragment,
        null,
        React.Children.map(children, function (child) {
          return React.cloneElement(child, _extends({
            onClick: _this2.handleOnClick
          }, props));
        })
      );
    }
  }]);
  return Click;
}(React.Component);

Click.propTypes = {
  onClick: PropTypes.func,
  event: PropTypes.string,
  data: PropTypes.object,

  GTM: GTMShape.isRequired,

  children: PropTypes.element.isRequired
};
Click.defaultProps = {
  event: null,
  data: {},
  onClick: null
};
Click.displayName = 'Click';
var Click$1 = withGTM(Click);

export default GTM;
export { scripts, DataLayer$1 as DataLayer, withGTM, PageView$1 as PageView, Click$1 as Click, GTMShape };
