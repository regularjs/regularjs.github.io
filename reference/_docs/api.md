
#API Reference


[{Improve this page%完善此页} >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

<!-- t -->

##Static API


__ Naming Convention __

- `Component` means the method belongs to both 'Regular' and its subClass. 
- `Regular` means the method only belongs to 'Regular' itself.
<!-- s -->



## 静态接口


__ 命名约定 __

- `Component` 表示此接口同时属于`Regular`及其子类. 
- `Regular`　表示此接口只属于Regular本身(一般为全局配置参数)

<!-- /t -->

<a  name="extend"></a>
###Component.extend


{
`Component.extend` used to create a SubComponent that inherit from  Component. 
%
`Component.extend` 用来创建一个继承与`Component`的子组件，参数`options`中的所有属性都会成为子组件的__原型属性__. 
}

__Usage:__

`Component.extend(options)`

```js
var Component = Regular.extend({
  template: 
    "<div><h2 on-click={this.changeTitle(title + '1')}>{title}</h2>\
    <div>{content}</div></div>",

  config: function(){},
  init: function(){},
  changeTitle: function(title){
    this.data.title = title;
  }
})

```



__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|{options for Component. see %组件定义和配置,见 }[__options__](#options)|

__Return__ 

SubComponent[Function]: {SubClass inherit from Component %继承自Component的组件}





###Component.implement

<!-- t -->
<!-- s -->

扩展Component自身的__原型方法__. options与`Component.extend`的完全一致.　
<!-- /t -->


__Usage__: 

`Component.extend(options)`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|{options for Component. see %组件定义和配置,见 }[__options__](#options)|

__Return__ 


Component[Function]: {Component self%组件本身}

{
__Tips__

if  extending function by `Component.extend and ` you can use `this.supr()` to invoke the super's function that has the same name.
%

> "Regular's Class is rewrited from awesome [ded/klass](https://github.com/ded/klass)."


%



__小技巧__: 通过__implement__ 与 __extend__ 扩展的方法，都可以通过`this.supr(arg1, arg2..)`调用父类同名函数

> "Regular的类式继承体系来源于著名的[ded/klass](https://github.com/ded/klass)."

}

__Example >__

```js
var SubComponent = Component.extend({
  init: function(){
    this.supr() // call the super init
  }
})

Component.implement({
  hello: function( msg ){
    this.supr( msg ) // call the super hello
  }
})

```






###new Component

__Usage: `new Component(options)`__

```javascript
var component = new Component({
  // ...other options 
  data: {
    username: "leeluolee"
  }
})

component.$inject('#container');

```


__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|{options for Component. see %组件定义和配置,见 }[__options__](#options)|



__Return__

{Instance of Component: [see instance api % Component的实例: [ 查看实例接口}](#instance)



<!-- t -->

options passed during initialize time will become the __instance property__, means they will override the options passed by `Component.extend` and `Component.implement`. It should be noted that if you pass a Function, you can't call `this.supr()` any more.

<!-- s -->
通过实例化传入的options将成为__实例属性__, 意味它将覆盖extend与implement的定义.并且无法调用`this.supr()`

<!-- /t -->


<a href="##" name="options"></a>
###options *

the options for define a Component. all property we don't 

- type: Object


<!-- t -->
<!-- s -->

`new Component`，`Component.extend`, `Component.implement`　都接受一个完全一致的options. 这里对__options__做一个统一说明

下面没有提及的配置项都会自动成为Component的原型属性(或实例属性)

<!-- /t -->


####template


- type: String | Selector | AST


{
%
即传入的Regularjs模板字符串，你需要遵循[模板语法](#template)（放心，比你用过的任何模板都要简单），当然在代码中拼接字符串模板是件肮脏的活，你可以参考[【模板模块化以及预解析模板】](##)来优雅的管理你的模板。
}


####config( data )


- type: Function

<!-- t -->
<!-- s -->
会在模板编译 __之前__ 被调用，__config一般是用来初始化参数__，它接收一个Object类型的参数data, 即你在初始化时传入的data参数.
<!-- /t -->

####init

- type: Function

<!-- t -->
<!-- s -->
会在模板编译 __之后__(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑　
<!-- /t -->

####destory: 

- type: Function

{
%
如果你需要有自定义的回收策略,你可以重写destroy方法(大部分情况并不需要,　只要是定义在模板中的逻辑都无需手动清理) __记得调用__`this.supr()`来调用Regular的自动回收.
}


```javascript
var Component = Regular.extend({
//.....
  destroy: function(){
    this.supr(); // call the super destroy 
    ...other logic
  }
})

var component = new Component();

component.destory();
```



####name: 


{
register this Component to its SuperComponent , make it [composite](?syntax-en#composite) in other component inherit from SuperComponent. 
%

注册组件到父组件的命名空间内，使其可以被[__内嵌使用__](?syntax-zh#composite)
}

```js
var Component = SuperComponent.extend({
  //other options
  name: 'foo1'
})

var Component2 = SuperComponent.extend({
  template: "<foo1></foo1>"
})

```

{
it is a shortcut for `SuperComponent.component(name, Component)`, example above equals to
% 
还有一种更一致的方式是使用[Component.component](#component),　示例实际上等同于:
}




```js

var Component = SuperComponent.extend({});
SuperComponent.component('foo1', Component)
```


{
but method `component` is much powerful than property `name`, because, `component()` can register Component extended from any SuperComponent. 
%  
但是`Component.component`显然更强大，它可以注册任意组件(无论继承自何组件)，而且从模块化角度来讲，在使用时，再决定名字也是一种良好也更安全的实践
}


```js

var Component = Regular.extend({});

SuperComponent.component('foo1', Component)
```


####events

- type: Object

在组件初始化前声明你需要绑定的事件.　__这个在需要绑定一些[内置事件]()时格外有用，因为你无需去重写对应的`init`等方法了.

```javascript

Regular.extend({
  events: {
    "$init": function(){
      // same in component.init
    },
    "$destroy": function(){
      // same in component.destroy
    }
  }
})

```


####data

- type: Object

这个data最终会被merge到实例化传入的data中，你可以将其视为 __缺省data__.　不过仍然建议尽量在config中处理data字段的缺省值.

```javascript
var Component = Regular.extend({
  data: {
    prop1: 1
  }
})

var component = new Component({
  data: {
    prop2: 2
  }
})

console.log(component.data.prop1) // ==> 1

```


<a id="directive"></a>


###Component.directive



{
Directive is similar to angular's directive, but it is more lightweight( in other words, less powerful __`:)`__ ). you can consider it as enhancement for the particular element.
%
设置自定义指令,　类似与Angularjs中的指令, Regularjs可以通过设置指令来增加节点功能. 由于Regularjs本身的组件化思维，以及模板本身已经拥有强大的描述能力，所以指令的功能在这里被弱化。
}



__Usage__

__`Component.directive(name, definition)`__


__Arguments__

|param|type|detail|
|--|--|--|
|name|String| {directive name%指令名}|
|definition|Function Object| { directive definition % 指令定义} |

__definition__

{

- Function definition(elem, value) :
  - elem:  the target element
  - value: the attributeValue. 
  - this:  point to component self

% 

- Function definition(elem, value) 传入参数如下<br>
  - elem 绑定的元素节点
  - value 属性值(可能是字符串或是一个[Expression];
  - this 这里的this指向component组件本身

}


__Example__ (source code of builtin `r-html` )


```javascript

Regular.directive('r-html', function(elem, value){
  this.$watch(value, function(newValue){
    elem.innerHTML = newValue
  })
})

```

{

The directive`r-html` create a unescaped interpolation with innerHTML.
Beacuse [`$watch`](#watch) accepts both [String] and [Expression] as the first param, so you can use `r-html` in two ways.
%
这里由于[$watch](../core/binding.md)同时接受字符串或者Expression, 所以我们可以在模板里传字符串或插值, 最终r-html的效果是一样的
}


```html
  <div class='preview' r-html='content'></div>
  <!-- or -->
  <div class='preview' r-html={content}></div>
```

{

If the directive need some clean work, you can return a destroy function(e.g. dom related operation) . __but you dont need to `$unwatch` the watcher defined in directive , regularjs record it for you and unwatch it automatically__

%

如果必要你也可以在函数返回一个destroy函数做指令的销毁工作(比如绑定了节点事件). 需要注意的是, regular中watch数据是不需要进行销毁的, regular会自动清理对应的数据绑定

}


__Example__

```javascript

Regular.directive('some-directive', function(elem, value){

  return function destroy(){
    ... destroy logic
  }
})

```


<a id="filter"></a>

###Component.filter



{
regularjs supports the concept of "filters", A "filter chain" is a designer friendly api for manipulating data. 

regularjs also support concept called [__two-way filters__](#two-way-filter) 


%
regularjs 当然也支持普遍存在于模板中的过滤器，过滤器支持链式的多重调用. 

regularjs也支持[__双向过滤__](#two-way-filter), 来帮助你解决双向数据流的需求

}

__Usage__

`Component.filter(name, factory)`

__Syntax__

`{Expression|filter1: args.. | filter2: args...}`

__Arguments__

|param|type|detail|
|--|--|--|
|name|string| {filter name%过滤器名称}|
|factory|function object| {factory function for creating new filter %创建新的自定义过滤器}|


__factory__

- `factory.get(origin, args...)` [Function]: 
  { 
  An Function to process the data-flow from origin to destnation
  % 
  数据从终点到源的处理函数. 
  }
- `factory.set(dest, args...) ` [Function]: 
  { 
  the handle to process the data-flow back from destnation to origin .
  % 
  从最终结果反推到源头的处理函数.
  }.


{
_If factory is A Function, it will be automately become the factory.get_
%
_如果传入的factory是函数类型，则自动成为factory.get_
}

__Example1 >__ 

{dateformat filter%一个简单的日期格式化过滤器}

```javascript
// simplest date format
var filter = function(){
  function fix(str){
    str = "" + (str || "");
    return str.length <= 1? "0" + str : str;
  }
  var maps = {
    'yyyy': function(date){return date.getFullYear()},
    'MM': function(date){return fix(date.getMonth() + 1); },
    'dd': function(date){ return fix(date.getDate()) },
    'HH': function(date){ return fix(date.getHours()) },
    'mm': function(date){ return fix(date.getMinutes())}
  }

  var trunk = new RegExp(Object.keys(maps).join('|'),'g');
  return function(value, format){
    format = format || "yyyy-MM-dd HH:mm";
    value = new Date(value);

    return format.replace(trunk, function(capture){
      return maps[capture]? maps[capture](value): "";
    });
  }
}();
Regular.filter("format", filter)
```

{then%然后在模板中使用}

```html
<p>{time| format: 'yyyy-MM-dd HH:mm'}</p>

```

{output%输出}

```html
<p>2014-12-31 12:30</p>

```








<a href="#" id="two-way-filter"></a>
####{Two-way filter % 双向过滤器}


{
Two way filter aim to  help us transform the result when it back to origin data. it is just like filter transform data from origin to result. 

two-way filter is useful in two-way binding. for example, use two-way filter with directive `r-model`.
%


双向过滤器主要是帮助我们实现数据的对流, 对任意数据读或写操作时可以进行过滤操作, 与计算属性不同的是，双向过滤器定义是不与具体的数据进行绑定,它是一种可复用的抽象.

双向过滤器如其名，经常会用在双向绑定上， 由于这个特性， r-model 得以与一个数组类型实现双向绑定。 当然你也可以使用它在其它可能有“数据回流”场合，比如[内嵌组件](?syntax-zh#composite)

}



take `{[1,2,3]|join: '-'}` for example

{filter definition. % 过滤器定义}

```js
Regular.filter('join', {
  //["1","2","3"] - > '1-2-3'
  get: function(origin, split ){
    return origin.join( split || "-" );
  },
  // **Important **
  // "1"-"2"-"3" - > ["1","2","3"]
  set: function(dest, split ){
    return dest.split( split || "-" );
  }
})
```

```html

{array|json}
<input r-model={array|join:'-'} >

```

[【 DEMO : two-way filter】](http://codepen.io/leeluolee/pen/jEGJmy)


####{Builtin Filters %内建过滤器}


#####json

{This is a two-way filter % 这是一个双向过滤器}

__example__

```js

var component = new Regular({
  template: "<h2>{user|json}</h2>"
})

component.$update("user|json", "{'name': 'leeluolee', 'age': 10}")
//console.log(user) --> {'user':'leeluolee', 'age': 10}

```

__Only Browser that support JSON API can get the json filter__


#####last

{last item in array, this is a one-way filter. % 获得数组最后一个元素, 这是一个单向过滤器}

```html
{[1,2,3]|last}  ===>  3
```



<a href="##" id="event"></a>

###Component.event

__Usage__

`Component.event(name, factory)`


<!-- t -->
<!-- s -->
设置自定义dom事件


__Argument__

|Param|Type|Detail|
|--|--|--|
|name|String|the custom event name|
|factory|Function| Factory function for creating event type|
<!-- /t -->



<a href="##" name="animation"></a>
###Component.animation

{
register a new animation command, it is completely designed for directive `r-animation`. 
%
自定义一个动画command. animation接口完全是为`r-animation`指令服务的.
}

{
See [Guide: animation](http://regularjs.github.io/guide/en/animation/README.html) for detail
%
查看 [指南: animation](http://regularjs.github.io/guide/zh/animation/README.html) 了解更多
}


__Usage__

Component.animation(name, factory)


__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String|the custom animation name|
|factory|Function| Factory function for creating command|

__Example__


<a href="##" name="component"></a>
###Component.component

{
resiter a Component, make it nestable in OtherComponent.
%
注册一个组件，使其可以被,　这里类似与在[options](#options)中声明`name`
}

__Usage__

`Component.component(name, factory)`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String|the name used to insert Component in template|
|factory| Component | A Component to be register |


__Example >__

```js

var Pager = Regular.extend({
  // other options
})

Component.component('pager', Pager)

// you can use pager as nested component
Component2 = Component.extend({
  template: "<pager></pager>"
})

```








###Component.use

__Usage__

`Component.use(factory)`

{
All methods introduced above(animation, directive,filter, event, implement) will have tightly dependence with particular Component, __but for reusing, a plugin must be Compnent-independent, the connection should be created during the using of plugin__.

so, the general plugin will be written like this:
%
著名的angular中模块化的解决方案是`angular.module()`和依赖注入, 一个模块可以有factory可以有filter可以有directive等等.

在regular中不可能照搬这种方式, 这是因为

- regular中没有`$rootScope.$digest()`这种全局性的__解药__无脑的促使所有绑定进入数据检查阶段，regular组件的生命周期都是独立的, 这就决定了必须让扩展建立与组件的关系.

  >比如angular的`$timeout`之类的实现只需在定时器完成后`$rootScope.$digest()`即可进入全局的数据检查, 而regular中[timeout](#timeout)之后必须调用组件的`$update()`才进入组件本身的数据检查阶段,即需建立与组件的关系.


- 模块插件应该是与组件无关的, 绑定只应该在被使用时发生, 这样才是可复用的模块插件.


所以一个典型的插件的写法应该是这样的

}



```javascript

function FooPlugin(Componenet){
  Component.implement()// implement method
    .filter()          // define filter
    .directive()       // define directive
    .event()           // define custom event
}

var YourComponent = Regular.extend();

FooPlugin(YourComponent);   // lazy bind
FooPlugin(Regular);         // lazy bind to globals

```

{
For consistency, every Component have a method named `use` to active a plugin. you can use the `FooPlugin` like this.
%
为了更统一, 所有Component都有一个`use`函数来统一'使用'插件, 如上例可以写成
}



```javascript

YourComponent.use(FooPlugin);

// global
Regular.use(FooPlugin);

```



###Regular.config

配置一些全局属性, 目前主要可以用来配置模板的自定义开关符号

__Usage__ 

`Regular.config( settings )`



__Arguments__


|Param|Type|Detail|
|--|--|--|
|settings.BEGIN|String| OPEN_TAG (default: '{')|
|settings.END|String| END_TAG (default: '}') |


__Example >__

<!-- t -->

change the TAG from default `{}` to `{{}}`
<!-- s -->

将默认符号`{}`修改为 `{{}}`.
<!-- /t -->

```javascript

Regular.config({
  BEGIN: "{{", 
  END: "}}" 
})

```


<a id="parse"></a>
###Regular.parse

__Usage__

`Regular.parse(templateString, setting)`

{
Parse a String to AST . you can use it for preparsing rgl template.
%
解析模板字符串为AST, 基本上你不会使用此方法, 你可以使用此方法来预解析你得regularjs模板 
}

__Arguments__

|Param|Type|Detail|
|--|--|--|
|templateString|String| {the template going to be parsed % 要解析的模板字符串}|
|settings.BEGIN|String| {OPEN_TAG % 开符号} (default: '{'|
|settings.END|String| {END_TAG % 关符号} (default: '}')|
|settings.stringify|Boolean| {whether to stringify the AST % 是否stringify 输出的AST} (default: false)|

__Usage__

__Example >__

```javascript
Regular.parse("<h2>{{page.title + page.desc}}</h2>", {
  BEGIN: '{{',
  END: '}}'
})
// output
[
  {
    "type": "element",
    "tag": "h2",
    "attrs": [],
    "children": [
      {
        "type": "expression",
        "body": "_d_['page']['title']+'-'+_d_['page']['desc']",
        "constant": false,
        "setbody": false
      }
    ]
  }
]

```




<a id="instance"></a>
##{instance API %实例接口}


{
If a method has prefix `$`, you should never rewrite it.
%
component即代表组件实例, 注意这些公有都有`$`前缀 意味不建议进行重写
}



###component.$inject

{
Injects, or inserts the component at a particular place relative to the element.
% 
插入组件到指定位置
}


__Usage__

`component.$inject(element[, direction])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|element|`Node` `false` | {reference element, if __false__ be passed, the component will be removed from document%被插入节点，如果传入__false__则代表将此组件从dom中移除}|
|direction_(optional default:'bottom')_|String| {The place to inject this component. Can be%组件的位置插入目标的位置.　可以是} 'top', 'bottom', 'after', or 'before'.|

__Example >__

{imagine you already have a component like:%假设你已经有这样一个组件}

```js
var component = new Component({
  template: "<h2>{title}</h2>",
  data: { title : "Example" }
})
var div = document.getElementById("#div");
```
{and a html fragment % 和一段html片段}

```html
<div id="div">
  <div class='child'></div>
</div>
```


- `compnent.$inject( div )` or `component.$inject( div, 'bottom' )`
  
  __resulting html__

  ```html
  <div id="div">
    <div class='child'></div>
    <h2>Example</h2>
  </div>

  ```

- `compnent.$inject( div, 'top' )` 
  
  __resulting html__

  ```html
  <div id="div">
    <h2>Example</h2>
    <div class='child'></div>
  </div>

  ```

- `compnent.$inject( div, 'after' )`

  __resulting html__

  ```html
  <div id="div">
    <div class='child'></div>
  </div>
  <h2>Example</h2>
  ```

- or `component.$inject( div, 'before' )`
  
  __resulting html__

  ```html
  <h2>Example</h2>
  <div id="div">
    <div class='child'></div>
  </div>
  ```

- __`component.$inject( false )`__({assume this component has been injected%假设我们已经调用了以上方法插入了本组件})

  __{entirely remove component from previous place(doesn't destory it, you can $inject it again) % 完全从原插入位置移除它(但是没有销毁，你仍然可以再次$inject它)}__

  __resulting html__

  ```javascript
  <div id="div">
    <div class='child'></div>
  </div>
  ```

__Tips__

{
you can call `$inject` many times to move component from one place to another. 
%
你通过多次调用`$inject` 将组件有一个位置移动到另外一个位置
}







<a id="watch"></a>
###component.$watch

{
Registers a listener callback to be executed whenever the watched expression changes.
%
注册一个监听回调，一旦绑定的表达式的值发生改变，它将会被调用
}


__Usage__

`component.$watch(expression, callback [, options])`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|expression|Expression|{epression that is evaluated on each dirty-check loop. once change is detected ,it triggers a call to the listener.%一旦表达式求值发生改变，回调会被触发}|
|callback(newValue, oldValue)|Function| {callback accept two param. <br/>__1. newValue__: the current value of the expression; <br/>2.oldValue: contains the previous value of expression%回调接受两个参数. <br/>1. newValue: 表达式的新值. <br/>2.oldValue: 表达式的原值}|

__Return__

watchid [Number]: {the watcher's id, used for%监听id,用于方法} [$unwatch](#unwatch)

{
- expression is called on every call to $digest() ,see [dirty-check in regularjs](#dirty) for more information
- The listener is called only when the value from the current expression and the previous call to expression are not equal. Inequality is determined according to reference inequality, strict comparison via the !== Javascript operator. if expression is evaluated to a [Array], regularjs will use [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) to computed the differrence between oldValue and newValue.
%

- expression 会在每次脏检查时被调用，并比较之前的值
- 当值与上次求值发生变化的判断依据是严格不相等即`!==`.　一种例外就是当求值为数组时，Regularjs会使用[莱文斯坦距离](http://en.wikipedia.org/wiki/Levenshtein_distance)计算数组差异
}




```js
component.$watch("user.name", function(newValue, oldValue){
  alert("user.name changed from " + oldValue + " to " + newValue) ; 
})
```


<a name="unwatch"></a>
###component.$unwatch

{
use watchid to unbind a watched Expression. generally speaking, it is rarely used, beacuse all watchers will be automatically destroied by regularjs. 
%
利用watchid解绑一个数据监听,　一般来讲你很少会用到它，因为所有regularjs中的数据绑定会被自动回收，除非你想在模板回收之前清除某个绑定.
}

__Usage__

```js

var component = new Regular();

component.$watch('b', function(b){
  alert('b watcher 1');
})

var id = component.$watch('b', function(){
  alert('b watcher 2');
})

component.$unwatch(id);
component.$update('b', 100); // only alert 'watcher 1'

```

<a href="##" id="update"></a>
###component.$update

`component.$update` is used to synchronize data and view

{
%
由于regularjs是基于脏检查，所以当不是由regularjs本身控制的操作(如事件、指令)引起的数据操作，可能需要你手动的去同步data与view的数据.
$update方法即帮助将你的data同步到view层.
}

__Usage__

`component.$update([expr] [, value])`

{
do updating operation, and force entering the `digest` phase.
%
更新某个值，并强制进入digest阶段，即脏检查.
}

__Arguments__

{

* expr(Optional) [Expression | String | Object] -
  - Expression: The Expression must be expr, see more in [Expression](../syntax/expression.md)
  - String: String will be passed to Expression
  - Object: multiple setting operation.
* value - value to be assign, if `expr` is a Object, it will be ignored
%
* expr(Optional) [Expression| Function | String] - expression可以有多种参数类型
  - String: 此字符串会先被Regular.expression处理为Expression
  - Expression: 此expression需要有set函数, [查看Expression](../syntax/expression.md)
  - Object: 多重设值

* value - 设置的值

}



__Example >__

```js

var component = new Regular({
  template: "<h2 ref='h2' on-click={title=title.toLowerCase()}>{title}</h2>",
  data: {
    title: "REGULARJS"
  }
});

//=> log 'REGULARJS' , with no doubt
console.log( component.$refs.h2.innerHTML ) 

component.data.title = "LEELUOLEE";

//=> also log 'REGULARJS', regularjs don't know the value is changed.
console.log( component.$refs.h2.innerHTML ) //

// force synchronizing data and view 
component.$update()

//=> also 'REGULARJS'. synchronize now.
console.log( component.$refs.h2.innerHTML ) //


// trigger on-click event  
component.$refs.h2.click();


// should log leeluolee.
// the Expression `title=title.toLowerCase()` is actived.
// when listener is done, regularjs will enter digest phase
console.log( component.$refs.h2.innerHTML ) //

```

you may need check [$refs](#refs) first


Beacuse you may need to set a complex Expression, $update also accept optional params to set the property easily, for Example


```js

// 1. simple
component.$update("user.name", 'leeluolee')

// is equals to

component.data.user.name = 'leeluolee'
component.$update()


// 2. multiple
component.$update({
  "user.name": "leeluolee",
  "user.age": 20
})
// is equlas to
component.data.user.name = 'leeluolee'
component.data.user.age = 20
component.$update()



```

{
you can also use a complex expression. but the expression must be [setable](?syntax-en#setable). but it is not efficient, we are very suggested to avoid doing this. unless you need to set value through two-way fitler. for Example.
% 
你当然也可以使用更复杂的表达式，不过你必须保证你的表达式是可设值的, 不过由于会创建表达式，这显然是不高效的，作者强烈建议不怎么做，　除非你需要通过[双向过滤器](#two-way-filter)来设值.
}

```js

// JSON.parse the title first.
component.$update('title|json', "{'title': 1}");

console.log(component.data.title) // => {title:1};

```







{

> Warning:
> whatever param you passed, the digest phase will always be triggered.
%
> Warning:
> 无论传入什么参数，运行$update之后都会进行组件作用域内的dirty-check

}








###component.$get

__Usage__

`component.$get(Expression|String)`


{
get a evaluated value from particluar Expression
%
获得一个Expression的值,类似于angular的$eval函数 
}

__Example >__

```js
component.data.username = "leeluolee"
component.data.job = "developer"

component.$get('username + ":" + job') // => leeluolee:developer

```


__Arguments__


|Param|Type|Detail|
|--|--|--|
|expression|Expression|String|{Expression%表达式}|

<a id="refs"></a>
###component.$refs

- type: Object


{
you can use attribute [ref] to mark a __Node__ or __Component__, after compiling, you can use `component.$refs.someRef` to find them.
%
在模板中，你可以使用`ref`属性来标记一个节点或组件.　在实例化后，你可以通过component.$refs 来获取你标记的节点
}

__Example >__

```html

component = new Regular({
  template: "<input ref=input> <pager ref=pager></pager>",
  init: function(){
    this.$refs.input // -> the input tag
    this.$refs.pager // -> the pager component
  }
})

```

> The  less reference the better

###component.$on


Register an `event` handler `fn`.

__Usage__

`component.$on(event, fn])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|eventName| Object String | {event name%事件名}|
|fn| Function | {listener % 监听器回调}|

{
_there will be multiple registering, if you pass a `Object`_
%
如果你传入一个Object, 会成为一个多重事件绑定
}



__Example >__

```js
component.$on("hello", fn1)

// multiple
component.$on({
  notify: fn2,
  message: fn3
})

```



###component.$off      

__Usage__

`component.$off([event] [,fn])`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|eventName| Object String | {event name%事件名}|
|fn| Function | {listener % 监听器回调}|

{
- Pass both event and fn to remove a listener.
- Only Pass event to remove all listeners on that event.
- Pass nothing to remove all listeners on all events.
%
- 如果同时传入 event和fn,　则移除指定event类型下的fn函数
- 只传入event, 移除所有event对应的监听器
- 什么都不传，移除所有

}




###component.$emit
{
Emit an event with variable option args.
%
触发指定事件
}


__Usage__

`component.$emit(eventName [, args...])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|eventName| Object String | {event name%事件名}|
|args| Function | {the rest of the params will be passed into the listener % 剩余的参数都会作为参数传入到监听器}|


__Example >__

```javascript
var component = new Regular();

var clickhandler1 = function(arg1){ console.log('clickhandler1:' + arg1)}
var clickhandler2 = function(arg1){ console.log('clickhandler2:' + arg1)}
var clickhandler3 = function(arg1){ console.log('clickhandler3:' + arg1)}

component.$on('hello', clickhandler1);
component.$on('hello', clickhandler2);
component.$on({ 
  'other': clickhandler3 
});


component.$emit('hello', 1); // handler1 handler2 trigger

component.$off('hello', clickhandler1) // hello: handler1 removed

component.$emit('hello', 2); // handler1 handler2 trigger

component.$off('hello') // all hello handler removed

component.$off() // all component's handler removed

component.$emit('other');


```





###component.$mute

{
you can disable a component, make it away from dirty-check. In most case, you will combine it with [`$inject(false)`](#inject) to remove it from document and make it disable. if you pass `false` to it, it will be actived again with a `digest` to make view and data synchronize.
%
你可以使用`$mute(true)`让组件失效，使其不参与到脏检查中. 后续使用 $mute(false)　来重新激活一个被失效的组件,　激活的同时，会自动进行一次数据与ui同步.
}


__Usage__

`component.$mute( isMute )`

__Argument__

|Param|Type|Detail|
|--|--|--|
|mute|Boolean|{whether to disable this component(you can active it later use $mute(false))%是否disable这个组件(可以后续重启它)}|

__Example >__

```js

var component = new Regular({
  template: '<h2>{title}</h2>',
  data: {
    title: "hello"
  }
})

//resulting html

<h2>hello</h2>

component.$mute(true) // disable it

component.data.hello = 'title changed'
component.$update();

// resulting html

<h2>hello</h2>

```


###component.$bind



{
create binding with another component.
__it isn't a recommended method. __. 
%
创建组件之间的双向绑定.

__这已是一个不推荐的方法__. 由于$bind过于灵活的双向绑定，极可能不当使用带来难以维护的对象间关系. 请使用事件通讯来处理组件之间的消息同步。
}

__Usage__

`component.$bind(component2, expr1[, expr2])`


{
__Arguments__

  1. component2<Component>: the target component than need to bind with
  2. expr1 <Expression|String|Object|Array>:
    - Expression|String: the field that component need to bind
    - Object: you can bind multiple fields at one time, the key represents component's field, the value represents target's field.
    - Array: create multiple binding between component and component2 with the same field
  3. expr2 <Expression|String>: the target component's  filed you need to binding. the default is expr1.

> <h5>WARN</h5>
> 1. There is at least one Expression that is setable. If all Expressions are setable, it is a two-way binding. otherwise, it will be a one-way binding.
> 2. If target  is not synchronous with component, it will be synchronized to component immediately.

%

__Arguments__

1. component2<Component>: 要绑定的组件
2. expr1 <Expression|String|Object|Array>: 此参数有多种参数类型
  - Expression|String: 本组件要绑定的表达式
  - Object: 同时绑定多个表达式对
  - Array: 表达式列表,同时实现多个同名表达式(即只传入expr1)
3. expr2 <Expression|String>: 目标组件要绑定的表达式, 缺省为expr1

> <h5>WARN</h5>
> 1. 如果两个表达式都是setable的，可实现双向绑定，否则只能实现单向绑定
> 2. 如果连个组件在bind时是不同步的，component2数据会先同步到component


}

create binding between pager components.

```javascript

 // insert
var pager = new Pager( {data: {total: 100, current:20}} ).$inject('#bind1');
var pager2 = new Pager( {data: {total: 50, current:2}} ).$inject('#bind1');

var pager3 = new Pager({data: {total: 100, current:20} }).$inject('#bind2');
var pager4 = new Pager({data: {total: 50, current:2}}).$inject('#bind2');

var pager5 = new Pager({data: {total: 100, current:2}}).$inject('#bind3');
var pager6 = new Pager({data: {total: 50, current:20}}).$inject('#bind3');


// style 1
pager.$bind(pager2, ['current', 'total']);


// style 2
pager3.$bind(pager4, 'current', 'current')
pager3.$bind(pager4, 'total') // the same as pager3.$bind(pager4, 'total', 'total')

// style 3
pager5.$bind(pager6, {current: "current", total: "total"});


// bind chain
var pager = new Pager({data:{total: 1000, current:1}}).$inject('#bind_chain');
for(var i = 0; i < 10; i++){
  var pager = new Pager({data:{total: 1000, current:1}})
    .$bind(pager, ['total', 'current'])
    .$inject('#bind_chain');
}

```

[Demo here](http://jsfiddle.net/leeluolee/7wgUf/light/)

you may want [the source code of pager ](https://rawgit.com/regularjs/regular/master/example/pager/pager.js)







##{Directive%指令}

{

regularjs provide some basic directive

directive only works for element, you can't use directive to nested component.
%
Regularjs 提供了一些常用的内置指令

指令只能应用与节点，而不能应用与内嵌组件

}


###on-[eventName]

{
you can use `on-**` to bind event on element or component
%
你可以通过`on-**`在模板中绑定元素事件或组件事件
}

__Syntax__

`on-click={expression}` or `on-click=delegateName`

__Arguments__


|Param|Type|Detail|
|--|--|--|
|expression| Expression or Name | {if particular event is triggerd, expression will be evaluated % 每当特定事件触发， 该表达式会被运行, 如果传入的不是表达式， 则该事件被代理到指定的组件事件上}|


{
Event is very important in regularjs, reference is not enough to take it into detail see [Guide:event](http://regularjs.github.io/guide/en/events/README.html) for more information.
%
由于事件系统的重要性， API手册无法完整的描述整个事件系统， 请移步指南[Guide:event](http://regularjs.github.io/guide/zh/events/README.html)
}



###r-model

very similar to `ng-model` in angular, `r-model` can help you to create two-way binding between data and the form element.

you can check the [r-model-example](http://jsfiddle.net/leeluolee/4y25j/) on jsfiddle.

* `input、textarea`:
  simple text binding
  ```
  <textarea  r-model='textarea'>hahah</textarea>
  <input  r-model='input' />
  ```


* `input:checkbox`:
  binding the input's checked state to a boolean type field

  ```
  <input type="checkbox" checked  r-model={checked}> Check me out (value: {checked})
  // checked = true
  ```


* `input:radio`:
  binding to input.value

  ```html
  <input type="radio"value="option1" r-model={radio}>
  ```


* `select`:
  binding to select.value

  ```html
  <!-- city = 1 -->
  <select r-model={city}>
    <option value="1" selected>Hangzhou</option>
    <option value="2">Ningbo</option>
    <option value="3">Guangzhou</option>
  </select>

  ```




###r-style

`r-style` is an enhancement for plain `style` interpolation.


__Exmaple__

```js
var app = new Regular({
    template:
      "<button class='btn'\
        on-click={left=left+10} r-style={ {left: left+'px'} } >\
        left+10 \
       </button>\
      left:  {left}",
    data: {left:1}
}).$inject(document.body)

```


[【DEMO】](http://jsfiddle.net/leeluolee/aaWQ7)

Description

|Param|Type|Details|
|---|---|---|
|r-style | `expression` | `Expression` will eval to an object whose keys are CSS style names and values are corresponding values for those CSS keys.|




> __Warning: if there is already an interpolation on `style`, the `r-style` will be overridden__

> for examle . `<div style='left: {left}px' r-style='{left: left+"px"}'></div>`

###r-class

simmilar to `r-style`. `r-class` is an enhancement for plain `class` interpolation,


__Example__

```html
<div r-class='{"active": page === "home"}'></div>
```

in this example, when `page === 'home'` , the `active` will attach to the node`div` , or vice versa.

Description

|Param|Type|Details|
|---|---|---|
|r-class | `expression` | `Expression` eval to `Object`: a map of class names to boolean values. In the case of a map, the names of the properties whose values are true will be added as css classes to the element.|





> __Warning: just like `r-style`, if there is already an interpolation on `class`, the `r-class` will be overridden__

###r-hide

__Exmaple__

```html
<div r-hide="page !== 'home'"></div>
```

if the Expression `page !== 'home'` is evaluated to true, the `display:none` will attach to the `div`.




###r-html

unescaped interpolation use innerHTML. beware of attack like `xss`.

__Example__

```javascript
<div class='preview' r-html={content}></div>
```


###r-animation


{
%
`r-animation` 用来实现声明式的动画，绝对你看到过的所有动画系统中最强大的一个，它可以以声明式的方式来获得动画序列，并且可以达到多节点的联动
}







##{Other%其它}


###Regular.dom


{
Regularjs implement some cross-platform method for internal implementation needs. 
%
由于内部实现需要，Regular实现了部分常用的跨浏览器的dom方法，如果只是简单的dom处理，你可以直接使用Regular.dom.

}

<a id="dom-inject"></a>
####Regular.dom.inject(element, refer, direction)

{
`component.$inject` is based on this method
%
`component.$inject` 依赖于此方法
}


__Arguments__

|Param|Type|Detail|
|--|--|--|
|element|`Node` `false` | {element be injected%要被插入的节点}|
|refer|`Node` `false` | {reference element%参考节点}|
|direction_(optional default:'bottom')_|String| {The place to inject this component. Can be%组件的位置插入目标的位置.　可以是} 'top', 'bottom', 'after', or 'before'.|


<a id="dom-on"></a>
####Regular.dom.on(element, event, handle)

{
add a eventlisener on specifed element. the following property on event object has been fixed. you can use them at IE6-8. the `this` in handle is point to element.
%
绑定节点事件,　下列事件对象中的属性已经被修正，你可以在IE6-8使用它们. 回调的this对象也修正为element本身.
}

- event.target
- event.which 
- event.pageX
- event.pageY
- event.stopPropagation();
- event.preventDefault();

__Example >__

```javascript
var dom = Regular.dom;

dom.on(element, 'click', function(ev){
  ev.preventDefault();
})

```

####Regular.dom.off(node, event, handle)

{
unbind a eventListener
%
移除一个事件监听器
}


####Regular.dom.addClass(element, className)

{
addClassName to specified element.
% 
添加节点className
}




####Regular.dom.delClass(element, className)
{
removeClassName at specified element.
%
移除节点的某段className
}

####Regular.dom.hasClass(element, className)

{
detect whether element has some className. 
% 
判断节点是否拥有某个className
}


```javascript
<div class='class1 class2'></div>

dom.hasClass(element, 'class1') // => true

```


####Regular.dom.text(element[, value])

{
set the content of element to the specified text. if value is not passed, return the combined text contents of element 
%
根据浏览器和节点, 设置节点的textContent　或　innerText
}

####Regular.dom.html(element[, value])

{
set or get the innerHTML of element.
%
设置或获取节点的innerHTML值
}



####Regular.dom.attr(element, name [ , value])

{
Set or Get the value of an attribute for the  element.
%
设置或获取节点的指定属性
}





