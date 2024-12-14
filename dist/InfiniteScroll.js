"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
class InfiniteScroll extends React.Component {
    constructor(props) {
        super(props);
        this.scrollListener = this.scrollListener.bind(this);
        this.eventListenerOptions = this.eventListenerOptions.bind(this);
        this.mousewheelListener = this.mousewheelListener.bind(this);
    }
    componentDidMount() {
        this.pageLoaded = this.props.pageStart;
        this.options = this.eventListenerOptions();
        this.attachScrollListener();
    }
    componentDidUpdate() {
        if (this.props.isReverse && this.loadMore) {
            const parentElement = this.getParentElement(this.scrollComponent);
            parentElement.scrollTop =
                parentElement.scrollHeight -
                    this.beforeScrollHeight +
                    this.beforeScrollTop;
            this.loadMore = false;
        }
        this.attachScrollListener();
    }
    componentWillUnmount() {
        this.detachScrollListener();
        this.detachMousewheelListener();
    }
    isPassiveSupported() {
        let passive = false;
        const testOptions = {
            get passive() {
                passive = true;
            },
        };
        try {
            document.addEventListener('test', null, testOptions);
            document.removeEventListener('test', null, testOptions);
        }
        catch (e) {
            // ignore
        }
        return passive;
    }
    eventListenerOptions() {
        let options = this.props.useCapture;
        if (this.isPassiveSupported()) {
            options = {
                useCapture: this.props.useCapture,
                passive: true,
            };
        }
        else {
            options = {
                passive: false,
            };
        }
        return options;
    }
    // Set a defaut loader for all your `InfiniteScroll` components
    setDefaultLoader(loader) {
        this.defaultLoader = loader;
    }
    detachMousewheelListener() {
        let scrollEl = window;
        if (this.props.useWindow === false) {
            scrollEl = this.scrollComponent.parentNode;
        }
        scrollEl.removeEventListener('mousewheel', this.mousewheelListener, this.options ? this.options : this.props.useCapture);
    }
    detachScrollListener() {
        let scrollEl = window;
        if (this.props.useWindow === false) {
            scrollEl = this.getParentElement(this.scrollComponent);
        }
        scrollEl.removeEventListener('scroll', this.scrollListener, this.options ? this.options : this.props.useCapture);
        scrollEl.removeEventListener('resize', this.scrollListener, this.options ? this.options : this.props.useCapture);
    }
    getParentElement(el) {
        const scrollParent = this.props.getScrollParent && this.props.getScrollParent();
        if (scrollParent != null) {
            return scrollParent;
        }
        return el && el.parentNode;
    }
    filterProps(props) {
        return props;
    }
    attachScrollListener() {
        const parentElement = this.getParentElement(this.scrollComponent);
        if (!this.props.hasMore || !parentElement) {
            return;
        }
        let scrollEl = window;
        if (this.props.useWindow === false) {
            scrollEl = parentElement;
        }
        scrollEl.addEventListener('mousewheel', this.mousewheelListener, this.options ? this.options : this.props.useCapture);
        scrollEl.addEventListener('scroll', this.scrollListener, this.options ? this.options : this.props.useCapture);
        scrollEl.addEventListener('resize', this.scrollListener, this.options ? this.options : this.props.useCapture);
        if (this.props.initialLoad) {
            this.scrollListener();
        }
    }
    mousewheelListener(e) {
        // Prevents Chrome hangups
        // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
        if (e.deltaY === 1 && !this.isPassiveSupported()) {
            e.preventDefault();
        }
    }
    scrollListener() {
        const el = this.scrollComponent;
        const scrollEl = window;
        const parentNode = this.getParentElement(el);
        let offset;
        if (this.props.useWindow) {
            const doc = document.documentElement || document.body.parentNode || document.body;
            const scrollTop = scrollEl.pageYOffset !== undefined
                ? scrollEl.pageYOffset
                : doc.scrollTop;
            if (this.props.isReverse) {
                offset = scrollTop;
            }
            else {
                offset = this.calculateOffset(el, scrollTop);
            }
        }
        else if (this.props.isReverse) {
            offset = parentNode.scrollTop;
        }
        else {
            offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
        }
        // Here we make sure the element is visible as well as checking the offset
        if (offset < Number(this.props.threshold) &&
            el &&
            el.offsetParent !== null) {
            this.detachScrollListener();
            this.beforeScrollHeight = parentNode.scrollHeight;
            this.beforeScrollTop = parentNode.scrollTop;
            // Call loadMore after detachScrollListener to allow for non-async loadMore functions
            if (typeof this.props.loadMore === 'function') {
                this.props.loadMore((this.pageLoaded += 1));
                this.loadMore = true;
            }
        }
    }
    calculateOffset(el, scrollTop) {
        if (!el) {
            return 0;
        }
        return (this.calculateTopPosition(el) +
            (el.offsetHeight - scrollTop - window.innerHeight));
    }
    calculateTopPosition(el) {
        if (!el) {
            return 0;
        }
        return el.offsetTop + this.calculateTopPosition(el.offsetParent);
    }
    render() {
        const renderProps = this.filterProps(this.props);
        const { children, element: Element, hasMore, initialLoad, isReverse, loader, loadMore, pageStart, ref, threshold, useCapture, useWindow, getScrollParent } = renderProps, props = __rest(renderProps, ["children", "element", "hasMore", "initialLoad", "isReverse", "loader", "loadMore", "pageStart", "ref", "threshold", "useCapture", "useWindow", "getScrollParent"]);
        props.ref = (node) => {
            this.scrollComponent = node;
            if (ref) {
                ref(node);
            }
        };
        const childrenArray = [children];
        if (hasMore) {
            if (loader) {
                isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
            }
            else if (this.defaultLoader) {
                isReverse
                    ? childrenArray.unshift(this.defaultLoader)
                    : childrenArray.push(this.defaultLoader);
            }
        }
        return (0, jsx_runtime_1.jsx)(Element, Object.assign({}, props, { children: childrenArray }));
    }
}
InfiniteScroll.propTypes = {
    children: prop_types_1.default.node.isRequired,
    element: prop_types_1.default.node,
    hasMore: prop_types_1.default.bool,
    initialLoad: prop_types_1.default.bool,
    isReverse: prop_types_1.default.bool,
    loader: prop_types_1.default.node,
    loadMore: prop_types_1.default.func.isRequired,
    pageStart: prop_types_1.default.number,
    ref: prop_types_1.default.func,
    getScrollParent: prop_types_1.default.func,
    threshold: prop_types_1.default.number,
    useCapture: prop_types_1.default.bool,
    useWindow: prop_types_1.default.bool,
};
InfiniteScroll.defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    ref: null,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    useCapture: false,
    loader: null,
    getScrollParent: null,
};
exports.default = InfiniteScroll;
