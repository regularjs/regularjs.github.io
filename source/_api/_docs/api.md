
# API {Reference%指南}


[{Improve this page%完善此页} >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

<!-- t -->

## Static API

 __Warn:__ 

- `Component` means the method belongs to both 'Regular' and its subClass. 
- `Regular` means the method only belongs to 'Regular' itself.
<!-- s -->


## 静态接口


__注意:__ 

- `Component` 表示此接口同时属于`Regular`及其子类. 
- `Regular`　表示此接口只属于Regular本身(一般为全局配置参数)

<!-- /t -->

<a  name="extend"></a>
### Component.extend(options)


{
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

  changeTitle: function(newTitle){
    this.data.title = newtiTle;
  }
})

```



__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|{options for Component. see %组件定义和配置,见 }[__options__](#options)|

__Return__ 

Component[Function]: {Component self%组件本身}



<!-- t -->

<!-- s -->


<!-- /t -->


### Component.implement(options)

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


<!-- t -->
<!-- s -->


__小技巧__: 通过__implement__ 与 __extend__ 扩展的方法，都可以通过`this.supr(arg1, arg2..)`调用父类同名函数

> "Regular的类式继承体系来源于著名的[ded/klass](https://github.com/ded/klass)."

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



<!-- /t -->


### new Component(options)

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

{Instance of Component: [see instance api % Component的实例: 查看实例接口](#instance)}



<!-- t -->

options passed during initialize time will become the __instance property__, means they will override the options passed by `Component.extend` and `Component.implement`. It should be noted that if you pass a Function, you can't call `this.supr()` any more.

<!-- s -->
通过实例化传入的options将成为__实例属性__, 意味它将覆盖extend与implement的定义.并且无法调用`this.supr()`

<!-- /t -->


<a href="#" name="options"></a>
### options *

the options for define a Component. all property we don't 

- type: Object


<!-- t -->
<!-- s -->

`new Component`，`Component.extend`, `Component.implement`　都接受一个完全一致的options. 这里对__options__做一个统一说明

下面没有提及的配置项都会自动成为Component的原型属性(或实例属性)

<!-- /t -->


#### template


- type: String | Selector | AST


{
%
即传入的Regularjs模板字符串，你需要遵循[模板语法](#template)（放心，比你用过的任何模板都要简单），当然在代码中拼接字符串模板是件肮脏的活，你可以参考[【模板模块化以及预解析模板】](#)来优雅的管理你的模板。
}


#### config( data )


- type: Function

<!-- t -->
<!-- s -->
会在模板编译 __之前__ 被调用，__config一般是用来初始化参数__，它接收一个Object类型的参数data, 即你在初始化时传入的data参数.
<!-- /t -->

#### init

- type: Function

<!-- t -->
<!-- s -->
会在模板编译 __之后__(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑　
<!-- /t -->

#### destory: 

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



#### name: 


{
register this Component to its SuperComponent , make it composite in other component inherit from SuperComponent. 
%

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
这是[component](#component)
}




```js

var Component = SuperComponent.extend({});
SuperComponent.component('foo1', Component)
```

but method `component` is much powerful than property `name`, because, `component()` can register Component extended from whatever SuperComponent. 

```js

var Component = Regular.extend({});

SuperComponent.component('foo1', Component)
```


#### computed: 


- type: Object| Function | String


你可以定义计算属性,　来避免在模板中描述复杂的表达式. 具体请参阅[【计算属性】](#)

一个典型的例子: 列表项的全选功能，我们可以利用计算属性来实现此功能.

```js
Regular.extend({
  computed: {
   allCompleted: {
      get: function( data ){
        return data.todos.length === this.getList('completed').length
      },
      set: function( checked, data ){
        data.todos.forEach( function(item){
          item.completed = checked;
        })
      }
    }
  }
})

```

#### events

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


#### data

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


### Component.directive

__Usage__

`Component.directive(name, factory)`


<!-- t -->


<!-- s -->
设置自定义指令,　类似与Angularjs中的指令, Regularjs可以通过设置指令来增加节点功能. 由于Regularjs本身的组件化思维，以及模板本身已经拥有强大的描述能力，所以指令的功能在这里被弱化。



<!-- /t -->

__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String|{directive name% 指令名称}|
|factory|Function| {Factory function for creating new eventType%创建新的自定义事件}|







<a id="filter"></a>

### Component.filter


__Usage__

`Component.filter(name, factory)`







<!-- t -->
<!-- s -->
设置自定义过滤器
<!-- /t -->

__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String| {filter name%过滤器名称}|
|factory|Function| {Factory function for creating new filter %创建新的自定义过滤器}|

__Example >__

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



<a href="#" name="event"></a>

### Component.event

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


__Example >__
<!-- t -->
<!-- s -->
当按下ESC时，触发on-exit事件
<!-- /t -->

```js

Component.event()

```



<!-- /t -->


<a href="#" name="animation"></a>
### Component.animation

自定义一个动画command

<a href="#" name="component"></a>
### Component.component

注册一个组件，使其可以被,　这里等同于在[options](#options)中声明`name`

__Example >__

```js

var Pager = Regular.extend({
  // other options
})

Component.component('pager', Pager)

```


{

%
`component`函数比要`name`属性更灵活，因为它可以注册继承于任意组件的
}



#### {common feature of directive,events,animation and filter% directive,events,animation和filter的共性}

- {multi extending %传入Object可以进行多个factory的扩展}

```js

Component.directive({
  "r-directive1": factory1,
  "r-directive2": factory2
})

```

- {if only pass `name`, it will return the target factory % 如果只传入name, 可获取对应的factory }.

```js
Component.filter("format": factory1);

alert(Component.filter("format") === factory1) // -> true

```


- {extending is Only affect Component self and its SubClass %扩展只影响到Component及其子类}

[see {modular%封装和模块化} >](#module)




### Component.use

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



### Regular.config

配置一些全局属性, 目前主要可以用来配置模板的自定义开关符号

__Usage__ 

`Regular.config( settings )`



__Arguments__


|Param|Type|Detail|
|--|--|--|
|settings.BEGIN|String| OPEN_TAG|
|settings.END|Function| END_TAG|


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



### Regular.expression
{
Creating a Expression, almost an internal methods.
%
创建一个表达式，基本上你不会使用此方法
}


__Usage__

`Regular.expression( expressionString )`

```javascript

```


__Return__

Expression


### Regular.parse

{
Parse a String to AST, almost an internal methods.
%
解析模板字符串为AST, 基本上你不会使用此方法。
}


__Usage__

`Regular.parse( templateString )`

__Example >__

```javascript
Regular.parse("<h2>{title}</h2>")
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



## {instance API %实例接口}


{
if method has prefix `$`, it can't be rewritten. 
%
component即代表组件实例, 注意这些公有都有`$`前缀 意味不建议进行重写
}



### component.$inject

{
Injects, or inserts, the component at a particular place relative to the element.
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








### component.$watch

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
### component.$unwatch

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

### component.$update

__Usage__

`component.$update([expr] [, value])`

{
do updating operation, and force entering the `digest` phase. you can use $update to update computed's value.
%
更新某个值，并强制进入digest阶段，即脏检查. 你可以使用$update对[计算属性](#computed)进行赋值
}

__Arguments__

{

* expr [Expression| Function | String] -
  - Expression: The Expression must be expr, see more in [Expression](../syntax/expression.md)
  - String: String will be passed to Expression
  - Function expr(data): just like angular's `$apply`, you can batch update-operation in one passed handler
    - data: equal to component.data
  - Object: multiple setting operation.
* value - value assigned to the field pointed by the Expression `expr`. if `expr` is a Function, it will be ignored.
%
* expr [Expression| Function | String] - expression可以有多种参数类型
  - String: 此字符串会先被Regular.expression处理为Expression
  - Expression: 此expression需要有set函数, [查看Expression](../syntax/expression.md)
  - Function: , 类似于angular的$apply,  传入expr的参数如下
    - data: 即组件的数据模型`component.data`

* value - 设置的值，如果expression参数为Function，则被忽略
}



__Example >__

```javascript

var component = new Regular({
  data: {
    a: {}
  }
});

component.$update('a.b', 2); // component.data.a.b = 2;

component.$update('a + b', 1); // !! invalid expression, canot extract set function

component.$update({
  b: 1,
  c: 2
}) // multiply setter

component.$update(function(data){ // data == component.data
  data.a.b = 2;
});

component.$update() // do nothing , just enter digest phase

```


{

> Warning:
> whatever param you passed, the digest phase will always be triggered.
%
> Warning:
> 无论传入什么参数，运行$update之后都会进行组件作用域内的dirty-check

}








### component.$get

__Usage__

`component.$get(Expression|String)`


{
%
获得一个Expression的值,类似于angular的$eval函数.
}

__Example >__

```js
component.data.username = "leeluolee"
component.data.job = "developer"

component.$get('username + ":" + job') // => leeluolee:developer

```

### component.$refs

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

### component.$on


Register an `event` handler `fn`.

__Usage__

### component.$off      

__Usage__

`component.$off([event] [,fn])`

__Arguments__

- Pass both event and fn to remove a listener.
- Only Pass event to remove all listeners on that event.
- Pass nothing to remove all listeners on all events.




### component.$emit
{
Emit an event with variable option args.
%
触发指定事件
}


__Usage__

`component.$emit(event [, args...])`



__Arguments__


### {component emitter and dom event%组件事件和dom事件}

{
Regularjs has a simple Emitter implement to provide `$on`、`$off` and `$emit`.

emitter event is very similar with dom event.

%
Regularjs内置了一个简单Emitter提供了上述的`$on`、`$off`以及`$emit`.

dom事件与emitter事件非常相似

}

- {botn of them can be used in template.%它们都可以在模板中声明}

__example__

```js

var component = new Regular({
  template: 
    '<div on-click={this.say()}></div>\
    <pager on-nav={this.nav($event)}></pager>'
  say: function(){
    console.log("trigger by click on element") 
  },
  nav: function( page ){
    console.log("nav to page "+ )
  }
})

```

__the `$event` trigger by Emitter is the first param passed to `$emit`__.

[【DEMO】](#)


- {both of them can be redirect to another component event. %它们都可以被代理到其它组件事件中.}

__example__


```js

var component = new Regular({
  template: 
    "<div on-click='save'></div>\
     <pager on-nav='nav'></pager>"
  init: function(){
    this.$on("save", function(){
      console.log("event delegated from click")
    })
    this.$on("nav", function(){
      console.log("event delegated from pager's 'nav' event")
    })

  }
})

```
```javascript


```

[【DEMO】](#)


{

%
你可以利用这种相似性来方便的将内联组件的事件传递到外层组件

}



### component.$mute

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


### component.$bind



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







## {Directive%指令}

{

%
Regularjs 提供了一些常用的内置指令
}

### on-[eventName]

### r-model

### r-html

### r-hide

### r-class

### r-style

### r-animation






## {LifeCycle%组件生命周期}



<!-- t -->
<!-- s -->

### when `new Component(options)`

当你实例化组件时，将会发生以下剧情

> 对应的源码来源于[Regularjs.js](https://github.com/regularjs/regular/blob/master/src/Regular.js#L31)

##### 1 options将合并原型中的 [events](#events), [data](#events), [computed](#computed)配置

```js
options = options || {};
options.data = options.data || {};
options.computed = options.computed || {};
options.events = options.events || {};
if(this.data) _.extend(options.data, this.data);
if(this.computed) _.extend(options.computed, this.computed);
if(this.events) _.extend(options.events, this.events);

```

##### 2 将options合并到this中

由于传入了参数true, 实例化中传入的属性会覆盖原型属性.

```js
_.extend(this, options, true);
```


##### 3  解析模板

模板本身已经被解析过了(AST)，这步跳过.

```js
if(typeof template === 'string') this.template = new Parser(template).parse();
```

##### 4. 根据传入的options.events 注册事件

注册事件，可以让我们无需去实现那些声明周期的方法(init, destory等)

```js
if(this.events){
  this.$on(this.events);
}
```

##### 5* 调用config函数.

 一般此函数我们会在config中预处理我们传入的数据

```js
this.config && this.config(this.data);
```

##### 6* __编译模板__, 触发一次组件脏检查

这里的脏检查是为了确保组件视图正确,　__到这里我们已经拥有初始化的dom元素__, 你可以通过$refs来获取你标记的.

```js

if(template){
  this.group = this.$compile(this.template, {namespace: options.namespace});
}

```

##### 7* __触发`$init`事件，　并调用this.init方法. ____

调用init之后我们不会进行自动的脏检查.

```js
this.$emit("$init");
if( this.init ) this.init(this.data);
```



<!-- /t -->


### when `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.


## {Other%其它}


### Regular.dom


{
Regularjs implement some cross-platform method for internal implementation needs. 
%
由于内部实现需要，Regular实现了部分常用的跨浏览器的dom方法，如果只是简单的dom处理，你可以直接使用Regular.dom.

}


#### Regular.dom.on(element, event, handle)

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

#### Regular.dom.off(node, event, handle)

{
unbind a eventListener
%
移除一个事件监听器
}


#### Regular.dom.addClass(element, className)

{
addClassName to specified element.
% 
添加节点className
}




#### Regular.dom.delClass(element, className)
{
removeClassName at specified element.
%
移除节点的某段className
}

#### Regular.dom.hasClass(element, className)

{
detect whether element has some className. 
% 
判断节点是否拥有某个className
}


```javascript
<div class='class1 class2'></div>

dom.hasClass(element, 'class1') // => true

```


#### Regular.dom.text(element[, value])

{
set the content of element to the specified text. if value is not passed, return the combined text contents of element 
%
根据浏览器和节点, 设置节点的textContent　或　innerText
}

#### Regular.dom.html(element[, value])

{
set or get the innerHTML of element.
%
设置或获取节点的innerHTML值
}



#### Regular.dom.attr(element, name [ , value])

{
Set or Get the value of an attribute for the  element.
%
设置或获取节点的指定属性
}





