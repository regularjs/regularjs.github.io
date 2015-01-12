
# API Reference


[Improve this page >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

<!-- t -->

## Static API

 __Warn:__ 

- `Component` means the method belongs to both 'Regular' and its subClass. 
- `Regular` means the method only belongs to 'Regular' itself.


<a  name="extend"></a>
### Component.extend(options)





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
|options|Object|options for Component. see [__options__](#options)|

__Return__ 

Component[Function]: Component self



<!-- t -->




### Component.implement(options)

<!-- t -->



__Usage__: 

`Component.extend(options)`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|options for Component. see [__options__](#options)|


<!-- t -->



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
|options|Object|options for Component. see [__options__](#options)|



__Return__

Instance of Component: [see instance api 



<!-- t -->

options passed during initialize time will become the __instance property__, means they will override the options passed by `Component.extend` and `Component.implement`. It should be noted that if you pass a Function, you can't call `this.supr()` any more.




<a href="#" name="options"></a>
### options *

the options for define a Component. all property we don't 

- type: Object


<!-- t -->



#### template


- type: String | Selector | AST






#### config( data )


- type: Function

<!-- t -->


#### init

- type: Function

<!-- t -->


#### destory: 

- type: Function





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



register this Component to its SuperComponent , make it composite in other component inherit from SuperComponent. 


```js
var Component = SuperComponent.extend({
  //other options
  name: 'foo1'
})

var Component2 = SuperComponent.extend({
  template: "<foo1></foo1>"
})

```


it is a shortcut for `SuperComponent.component(name, Component)`, example above equals to





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




__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String|directive name|
|factory|Function| Factory function for creating new eventType|







<a id="filter"></a>

### Component.filter


__Usage__

`Component.filter(name, factory)`







<!-- t -->


__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String| filter name|
|factory|Function| Factory function for creating new filter |

__Example >__

dateformat filter

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

then

```html
<p>{time| format: 'yyyy-MM-dd HH:mm'}</p>

```

output

```html
<p>2014-12-31 12:30</p>

```



<a href="#" name="event"></a>

### Component.event

__Usage__

`Component.event(name, factory)`


<!-- t -->


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








#### common feature of directive,events,animation and filter

- multi extending 

```js

Component.directive({
  "r-directive1": factory1,
  "r-directive2": factory2
})

```

- if only pass `name`, it will return the target factory .

```js
Component.filter("format": factory1);

alert(Component.filter("format") === factory1) // -> true

```


- extending is Only affect Component self and its SubClass 

[see modular >](#module)




### Component.use

__Usage__

`Component.use(factory)`


All methods introduced above(animation, directive,filter, event, implement) will have tightly dependence with particular Component, __but for reusing, a plugin must be Compnent-independent, the connection should be created during the using of plugin__.

so, the general plugin will be written like this:




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


For consistency, every Component have a method named `use` to active a plugin. you can use the `FooPlugin` like this.




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


```javascript

Regular.config({
  BEGIN: "{{", 
  END: "}}" 
})

```



### Regular.expression

Creating a Expression, almost an internal methods.



__Usage__

`Regular.expression( expressionString )`

```javascript

```


__Return__

Expression


### Regular.parse


Parse a String to AST, almost an internal methods.



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



## instance API 



if method has prefix `$`, it can't be rewritten. 




### component.$inject


Injects, or inserts, the component at a particular place relative to the element.



__Usage__

`component.$inject(element[, direction])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|element|`Node` `false` | reference element, if __false__ be passed, the component will be removed from document|
|direction_(optional default:'bottom')_|String| The place to inject this component. Can be 'top', 'bottom', 'after', or 'before'.|

__Example >__

imagine you already have a component like:

```js
var component = new Component({
  template: "<h2>{title}</h2>",
  data: { title : "Example" }
})
var div = document.getElementById("#div");
```
and a html fragment 

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

- __`component.$inject( false )`__(assume this component has been injected)

  __entirely remove component from previous place(doesn't destory it, you can $inject it again) __

  __resulting html__

  ```javascript
  <div id="div">
    <div class='child'></div>
  </div>
  ```

__Tips__


you can call `$inject` many times to move component from one place to another. 









### component.$watch


Registers a listener callback to be executed whenever the watched expression changes.



__Usage__

`component.$watch(expression, callback [, options])`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|expression|Expression|epression that is evaluated on each dirty-check loop. once change is detected ,it triggers a call to the listener.|
|callback(newValue, oldValue)|Function| callback accept two param. <br/>__1. newValue__: the current value of the expression; <br/>2.oldValue: contains the previous value of expression|

__Return__

watchid [Number]: the watcher's id, used for [$unwatch](#unwatch)


- expression is called on every call to $digest() ,see [dirty-check in regularjs](#dirty) for more information
- The listener is called only when the value from the current expression and the previous call to expression are not equal. Inequality is determined according to reference inequality, strict comparison via the !== Javascript operator. if expression is evaluated to a [Array], regularjs will use [Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance) to computed the differrence between oldValue and newValue.





```js
component.$watch("user.name", function(newValue, oldValue){
  alert("user.name changed from " + oldValue + " to " + newValue) ; 
})
```


<a name="unwatch"></a>
### component.$unwatch


use watchid to unbind a watched Expression. generally speaking, it is rarely used, beacuse all watchers will be automatically destroied by regularjs. 


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


do updating operation, and force entering the `digest` phase. you can use $update to update computed's value.


__Arguments__



* expr [Expression| Function | String] -
  - Expression: The Expression must be expr, see more in [Expression](../syntax/expression.md)
  - String: String will be passed to Expression
  - Function expr(data): just like angular's `$apply`, you can batch update-operation in one passed handler
    - data: equal to component.data
  - Object: multiple setting operation.
* value - value assigned to the field pointed by the Expression `expr`. if `expr` is a Function, it will be ignored.




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




> Warning:
> whatever param you passed, the digest phase will always be triggered.









### component.$get

__Usage__

`component.$get(Expression|String)`





__Example >__

```js
component.data.username = "leeluolee"
component.data.job = "developer"

component.$get('username + ":" + job') // => leeluolee:developer

```

### component.$refs

- type: Object



you can use attribute [ref] to mark a __Node__ or __Component__, after compiling, you can use `component.$refs.someRef` to find them.


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

Emit an event with variable option args.



__Usage__

`component.$emit(event [, args...])`



__Arguments__


### component emitter and dom event


Regularjs has a simple Emitter implement to provide `$on`、`$off` and `$emit`.

emitter event is very similar with dom event.



- botn of them can be used in template.

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


- both of them can be redirect to another component event. 

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








### component.$mute


you can disable a component, make it away from dirty-check. In most case, you will combine it with [`$inject(false)`](#inject) to remove it from document and make it disable. if you pass `false` to it, it will be actived again with a `digest` to make view and data synchronize.



__Usage__

`component.$mute( isMute )`

__Argument__

|Param|Type|Detail|
|--|--|--|
|mute|Boolean|whether to disable this component(you can active it later use $mute(false))|

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




create binding with another component.
__it isn't a recommended method. __. 


__Usage__

`component.$bind(component2, expr1[, expr2])`



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







## Directive





### on-[eventName]

### r-model

### r-html

### r-hide

### r-class

### r-style

### r-animation






## LifeCycle



<!-- t -->



### when `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.


## Other


### Regular.dom



Regularjs implement some cross-platform method for internal implementation needs. 



#### Regular.dom.on(element, event, handle)


add a eventlisener on specifed element. the following property on event object has been fixed. you can use them at IE6-8. the `this` in handle is point to element.


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


unbind a eventListener



#### Regular.dom.addClass(element, className)


addClassName to specified element.





#### Regular.dom.delClass(element, className)

removeClassName at specified element.


#### Regular.dom.hasClass(element, className)


detect whether element has some className. 



```javascript
<div class='class1 class2'></div>

dom.hasClass(element, 'class1') // => true

```


#### Regular.dom.text(element[, value])


set the content of element to the specified text. if value is not passed, return the combined text contents of element 


#### Regular.dom.html(element[, value])


set or get the innerHTML of element.




#### Regular.dom.attr(element, name [ , value])


Set or Get the value of an attribute for the  element.






