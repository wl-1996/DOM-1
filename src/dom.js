window.dom = {
  //创建一个新元素，并返回这个元素
  create(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    //trim的作用就是把字符串两边的空格给去掉
    return container.content.firstChild;
  },
  after(node, node2) {
    console.log(node.nextSibling);
    node.parentNode.insertBefore(node2, node.nextSibling);
    // 找到节点的爸爸，调用爸爸的insertBefore,把node2插到node.nextSibling的前面
  },
  //把node2插入到node的前面
  before(node, node2) {
    node.parentNode.insertBefore(node2, node);
  },
  //新增一个儿子
  append(parent, node) {
    parent.appendChild(node);
  },
  //新增一个爸爸
  wrap(node, parent) {
    dom.before(node, parent); //先把parent放到node的前面
    dom.append(parent, node); //再把node追加到parent里面
  },
  //删除一个节点
  remove(node) {
    // node.remove();//这个接口太新，IE可能不支持
    node.parentNode.removeChild(node);
    return node; //return一下，还可以用这个删掉的节点，保留一个引用
  },
  //给我一个节点，干掉它的儿子
  empty(node) {
    // node.innerHTML = "";//可以删掉node节点的儿子，但是删掉后无法再引用了，所以不用这个，用下边的
    const { childNodes } = node; //高级语法：从node获取node的子节点
    //上边这个高级语法相当于： const childNodes = node.childNodes
    const array = [];
    let x = node.firstChild;
    while (x) {
      array.push(dom.remove(node.firstChild)); //把删掉的node节点的大儿子放到数组里
      x = node.firstChild; //刚才的大儿子已经没有了，重新赋值一次，原来node的二儿子是删除后的大儿子
    }
    return array;
  },
  //读写节点的属性
  attr(node, name, value) {
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
  text(node, string) {
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
  html(node, string) {
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
  style(node, name, value) {
    //如果参数为三，即类似：dom.style(test,"color","red"),说明是改样式：
    if (arguments.length === 3) {
      node.style[name] = value;
      //如果参数为二，再分两种情况讨论：
    } else if (arguments.length === 2) {
      //情况一：dom.style(test,'color'),如果name参数是字符串，读属性：
      if (typeof name === "string") {
        return node.style[name];
      } else if (name instanceof Object) {
        //情况二：dom.style(test,{color: 'red'}),如果name参数是一个对象，改属性
        const object = name;
        //遍历object，读到object里所有的key
        for (let key in object) {
          node.style[key] = object[key];
        }
      }
    }
  },
  //增删类:
  class: {
    add(node, className) {
      node.classList.add(className);
    },
    remove(node, className) {
      node.classList.remove(className);
    },
    //node有无节点xx?:
    contains(node, className) {
      return node.classList.contains(className);
    }
  },
  //添加时间监听
  on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  //移除时间监听
  off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  //查：
  find(selector, scope) {
    //如果有scope，就在scope元素里查；如果没有scope，就在document文档里查
    return (scope || document).querySelectorAll(selector);
  },
  //查爸爸
  parent(node) {
    return node.parentNode;
  },
  //查儿子
  children(node) {
    return node.children; //children不包括文本节点，childNodes包括文本节点
  },
  //查兄弟姐妹
  siblings(node) {
    //找到兄弟姐妹后转变为数组，再用filter过滤掉自己
    return Array.from(node.parentNode.children).filter(n => n !== node);
  },
  //查弟弟
  next(node) {
    //令x 等于node的下一个兄弟节点
    let x = node.nextSibling;
    //当x存在且x的类型是文本节点时，就再另node的下一个节点为x，最终找到不是文本节点的弟弟并返回它
    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }
    return x;
  },
  //查哥哥
  previous(node) {
    //令x 等于node的上一个兄弟节点:
    let x = node.previousSibling;
    //当x存在且x的类型是文本节点时，就再另node的上一个节点为x，最终找到不是文本节点的哥哥并返回它
    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }
    return x;
  },
  //遍历
  each(nodeList, fn) {
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i]);
    }
  },
  //获取元素排行老几
  index(node) {
    //找到node的父亲的孩子并赋值给list
    const list = dom.children(node.parentNode);
    //遍历这些孩子
    let i;
    for (i = 0; i < list.length; i++) {
      //如果某个孩子等于节点node，就停止
      if (list[i] === node) {
        break;
      }
    }
    //返回i的值，因为此时list[i] === node，说明node节点就是list[i]
    return i;
  }
};
