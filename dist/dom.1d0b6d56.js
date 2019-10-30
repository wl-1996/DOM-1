// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  //创建一个新元素，并返回这个元素
  create: function create(string) {
    var container = document.createElement("template");
    container.innerHTML = string.trim(); //trim的作用就是把字符串两边的空格给去掉

    return container.content.firstChild;
  },
  after: function after(node, node2) {
    console.log(node.nextSibling);
    node.parentNode.insertBefore(node2, node.nextSibling); // 找到节点的爸爸，调用爸爸的insertBefore,把node2插到node.nextSibling的前面
  },
  //把node2插入到node的前面
  before: function before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  //新增一个儿子
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  //新增一个爸爸
  wrap: function wrap(node, parent) {
    dom.before(node, parent); //先把parent放到node的前面

    dom.append(parent, node); //再把node追加到parent里面
  },
  //删除一个节点
  remove: function remove(node) {
    // node.remove();//这个接口太新，IE可能不支持
    node.parentNode.removeChild(node);
    return node; //return一下，还可以用这个删掉的节点，保留一个引用
  },
  //给我一个节点，干掉它的儿子
  empty: function empty(node) {
    // node.innerHTML = "";//可以删掉node节点的儿子，但是删掉后无法再引用了，所以不用这个，用下边的
    var childNodes = node.childNodes; //高级语法：从node获取node的子节点
    //上边这个高级语法相当于： const childNodes = node.childNodes

    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild)); //把删掉的node节点的大儿子放到数组里

      x = node.firstChild; //刚才的大儿子已经没有了，重新赋值一次，原来node的二儿子是删除后的大儿子
    }

    return array;
  },
  //读写节点的属性
  attr: function attr(node, name, value) {
    //重载
    if (arguments.length === 3) {
      //如果有三个参数，就是改属性
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      //如果有两个参数，就是读属性
      return node.getAttribute(name);
    }
  },
  //读写文本内容
  text: function text(node, string) {
    //如果参数为两个，说明是要改文本内容
    if (arguments.length === 2) {
      //下边这种写代码的方法就叫适配，适配不同的浏览器
      //判断一下，如果innerText在node里说明是IE浏览器，而老版本IE浏览器只支持innerText这个接口
      if ("innerText" in node) {
        node.innerText = string;
      } else {
        //否则就是别的浏览器，用textContent
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      //如果参数为一个，说明是读文本内容
      if ("innerText" in node) {
        //判断是否是IE浏览器
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  //读写HTML内容：
  html: function html(node, string) {
    //重载：根据参数的长度不同实现不同的效果：
    if (arguments.length === 2) {
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      return node.innerHTML;
    }
  },
  // //读写style:
  // style(node, object) {
  //   //遍历object，读到object里所有的key：
  //   for (let key in object) {
  //     //key : border / color / ...
  //     //node.style.border = ...
  //     //node.style.color = ...
  //     //由于不知道现在的key是什么，key是变量，变量做key的话必须放到中括号里面：
  //     node.style[key] = object[key];
  //   }
  // }
  //读写style:
  style: function style(node, name, value) {
    //如果参数为三，即类似：dom.style(test,"color","red"),说明是改样式：
    if (arguments.length === 3) {
      node.style[name] = value; //如果参数为二，再分两种情况讨论：
    } else if (arguments.length === 2) {
      //情况一：dom.style(test,'color'),如果name参数是字符串，读属性：
      if (typeof name === "string") {
        return node.style[name];
      } else if (name instanceof Object) {
        //情况二：dom.style(test,{color: 'red'}),如果name参数是一个对象，改属性
        var object = name; //遍历object，读到object里所有的key

        for (var key in object) {
          node.style[key] = object[key];
        }
      }
    }
  },
  //增删类:
  class: {
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    //node有无节点xx?:
    contains: function contains(node, className) {
      return node.classList.contains(className);
    }
  },
  //添加时间监听
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  //移除时间监听
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //查：
  find: function find(selector, scope) {
    //如果有scope，就在scope元素里查；如果没有scope，就在document文档里查
    return (scope || document).querySelectorAll(selector);
  },
  //查爸爸
  parent: function parent(node) {
    return node.parentNode;
  },
  //查儿子
  children: function children(node) {
    return node.children; //children不包括文本节点，childNodes包括文本节点
  },
  //查兄弟姐妹
  siblings: function siblings(node) {
    //找到兄弟姐妹后转变为数组，再用filter过滤掉自己
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
  },
  //查弟弟
  next: function next(node) {
    //令x 等于node的下一个兄弟节点
    var x = node.nextSibling; //当x存在且x的类型是文本节点时，就再另node的下一个节点为x，最终找到不是文本节点的弟弟并返回它

    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }

    return x;
  },
  //查哥哥
  previous: function previous(node) {
    //令x 等于node的上一个兄弟节点:
    var x = node.previousSibling; //当x存在且x的类型是文本节点时，就再另node的上一个节点为x，最终找到不是文本节点的哥哥并返回它

    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }

    return x;
  },
  //遍历
  each: function each(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //获取元素排行老几
  index: function index(node) {
    //找到node的父亲的孩子并赋值给list
    var list = dom.children(node.parentNode); //遍历这些孩子

    var i;

    for (i = 0; i < list.length; i++) {
      //如果某个孩子等于节点node，就停止
      if (list[i] === node) {
        break;
      }
    } //返回i的值，因为此时list[i] === node，说明node节点就是list[i]


    return i;
  }
};
},{}],"../../../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56050" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","dom.js"], null)
//# sourceMappingURL=/dom.1d0b6d56.js.map