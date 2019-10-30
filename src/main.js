const div = dom.create("<div>newDiv</div>");
console.log(div);

dom.after(test, div);

const div3 = dom.create('<div id= "parent"></div>');
dom.wrap(test, div3);

// dom.remove(test);
const nodes = dom.empty(window.empty); //找到id为empty的元素，干掉它的儿子
console.log(nodes);

dom.attr(test, "title", "Hi,I am Frank"); //三个参数改属性
const title = dom.attr(test, "title"); //两个参数读属性
console.log(`title: ${title}`); //打印出读到的test元素的属性

dom.text(test, "你好，这是新的内容");
dom.text(test);

//读写样式：
dom.style(test, { border: "1px solid red", color: "green" }); //改样式
console.log(dom.style(test, "border")); //读样式
dom.style(test, "border", "5px solid black"); //改样式

//添加class：
dom.class.add(test, "red");
dom.class.add(test, "blue");
console.log(dom.class.contains(test, "yellow"));

const fn = () => {
  console.log("点击了");
};
dom.on(test, "click", fn);
dom.off(test, "click", fn);

//找到id为test的第一个元素并赋值给testDiv:
const testDiv = dom.find("#test")[0];
console.log(testDiv);
//在testDiv2里找到类为.red的元素，并打印出来:
const testDiv2 = dom.find("#test2")[0];
console.log(dom.find(".red", testDiv2)[0]);

console.log(dom.parent(test));

console.log(dom.children(test2)[0]);

console.log(dom.siblings(dom.find("#s2")[0]));

const s2 = dom.find("#s2")[0];
console.log(dom.next(s2));

console.log(dom.previous(s2));

const t = dom.find("#travel")[0];
dom.each(dom.children(t), n => dom.style(n, "color", "red"));

console.log(dom.index(s2));
