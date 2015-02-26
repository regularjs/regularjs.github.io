
#API Reference


[Improve this page >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

<!-- t -->

##Static API


__ Naming Convention __

- `Component` means the method belongs to both 'Regular' and its subClass. 
- `Regular` means the method only belongs to 'Regular' itself.


<a  name="extend"></a>
###Component.extend



`Component.extend` used to create a SubComponent that inherit from  Component. 


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
|options|Object|options for Component. see [__options__](#options)|

__Return__ 

SubComponent[Function]: SubClass inherit from Component 





###Component.implement

<!-- t -->



__Usage__: 

`Component.extend(options)`

__Arguments__

|Param|Type|Detail|
|--|--|--|
|options|Object|options for Component. see [__options__](#options)|

__Return__ 


Component[Function]: Component self


__Tips__

if  extending function by `Component.extend and ` you can use `this.supr()` to invoke the super's function that has the same name.
%

> "Regular's Class is rewrited from awesome [ded/klass](https://github.com/ded/klass)."




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
|options|Object|options for Component. see [__options__](#options)|



__Return__

Instance of Component: [see instance api ](#instance)



<!-- t -->

options passed during initialize time will become the __instance property__, means they will override the options passed by `Component.extend` and `Component.implement`. It should be noted that if you pass a Function, you can't call `this.supr()` any more.




<a href="##" name="options"></a>
###options *

the options for define a Component. all property we don't 

- type: Object


<!-- t -->



####template


- type: String | Selector | AST






####config( data )


- type: Function

<!-- t -->


####init

- type: Function

<!-- t -->


####destory: 

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



####name: 



register this Component to its SuperComponent , make it [composite](?syntax-en#composite) in other component inherit from SuperComponent. 


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



but method `component` is much powerful than property `name`, because, `component()` can register Component extended from any SuperComponent. 



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




Directive is similar to angular's directive, but it is more lightweight( in other words, less powerful __`:)`__ ). you can consider it as enhancement for the particular element.




__Usage__

__`Component.directive(name, definition)`__


__Arguments__

|param|type|detail|
|--|--|--|
|name|String| directive name|
|definition|Function Object|  directive definition  |

__definition__



- Function definition(elem, value) :
  - elem:  the target element
  - value: the attributeValue. 
  - this:  point to component self




__Example__ (source code of builtin `r-html` )


```javascript

Regular.directive('r-html', function(elem, value){
  this.$watch(value, function(newValue){
    elem.innerHTML = newValue
  })
})

```



The directive`r-html` create a unescaped interpolation with innerHTML.
Beacuse [`$watch`](#watch) accepts both [String] and [Expression] as the first param, so you can use `r-html` in two ways.



```html
  <div class='preview' r-html='content'></div>
  <!-- or -->
  <div class='preview' r-html={content}></div>
```



If the directive need some clean work, you can return a destroy function(e.g. dom related operation) . __but you dont need to `$unwatch` the watcher defined in directive , regularjs record it for you and unwatch it automatically__




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




regularjs supports the concept of "filters", A "filter chain" is a designer friendly api for manipulating data. 

regularjs also support concept called [__two-way filters__](#two-way-filter) 




__Usage__

`Component.filter(name, factory)`

__Syntax__

`{Expression|filter1: args.. | filter2: args...}`

__Arguments__

|param|type|detail|
|--|--|--|
|name|string| filter name|
|factory|function object| factory function for creating new filter |


__factory__

- `factory.get(origin, args...)` [Function]: 
   
  An Function to process the data-flow from origin to destnation
  
- `factory.set(dest, args...) ` [Function]: 
   
  the handle to process the data-flow back from destnation to origin .
  .



_If factory is A Function, it will be automately become the factory.get_


__Example1 >__ 

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








<a href="#" id="two-way-filter"></a>
####Two-way filter 



Two way filter aim to  help us transform the result when it back to origin data. it is just like filter transform data from origin to result. 

two-way filter is useful in two-way binding. for example, use two-way filter with directive `r-model`.




take `{[1,2,3]|join: '-'}` for example

filter definition. 

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


####Builtin Filters 


#####json

This is a two-way filter 

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

last item in array, this is a one-way filter. 

```html
{[1,2,3]|last}  ===>  3
```



<a href="##" id="event"></a>

###Component.event

__Usage__

`Component.event(name, factory)`


<!-- t -->




<a href="##" name="animation"></a>
###Component.animation


register a new animation command, it is completely designed for directive `r-animation`. 



See [Guide: animation](http://regularjs.github.io/guide/en/animation/README.html) for detail



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


resiter a Component, make it nestable in OtherComponent.


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


Parse a String to AST . you can use it for preparsing rgl template.


__Arguments__

|Param|Type|Detail|
|--|--|--|
|templateString|String| the template going to be parsed |
|settings.BEGIN|String| OPEN_TAG  (default: '{'|
|settings.END|String| END_TAG  (default: '}')|
|settings.stringify|Boolean| whether to stringify the AST  (default: false)|

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
##instance API 



If a method has prefix `$`, you should never rewrite it.




###component.$inject


Injects, or inserts the component at a particular place relative to the element.



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








<a id="watch"></a>
###component.$watch


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
###component.$unwatch


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

<a href="##" id="update"></a>
###component.$update

`component.$update` is used to synchronize data and view




__Usage__

`component.$update([expr] [, value])`


do updating operation, and force entering the `digest` phase.


__Arguments__



* expr(Optional) [Expression | String | Object] -
  - Expression: The Expression must be expr, see more in [Expression](../syntax/expression.md)
  - String: String will be passed to Expression
  - Object: multiple setting operation.
* value - value to be assign, if `expr` is a Object, it will be ignored




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


you can also use a complex expression. but the expression must be [setable](?syntax-en#setable). but it is not efficient, we are very suggested to avoid doing this. unless you need to set value through two-way fitler. for Example.


```js

// JSON.parse the title first.
component.$update('title|json', "{'title': 1}");

console.log(component.data.title) // => {title:1};

```









> Warning:
> whatever param you passed, the digest phase will always be triggered.









###component.$get

__Usage__

`component.$get(Expression|String)`



get a evaluated value from particluar Expression


__Example >__

```js
component.data.username = "leeluolee"
component.data.job = "developer"

component.$get('username + ":" + job') // => leeluolee:developer

```


__Arguments__


|Param|Type|Detail|
|--|--|--|
|expression|Expression|String|Expression|

<a id="refs"></a>
###component.$refs

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

###component.$on


Register an `event` handler `fn`.

__Usage__

`component.$on(event, fn])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|eventName| Object String | event name|
|fn| Function | listener |


_there will be multiple registering, if you pass a `Object`_




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
|eventName| Object String | event name|
|fn| Function | listener |


- Pass both event and fn to remove a listener.
- Only Pass event to remove all listeners on that event.
- Pass nothing to remove all listeners on all events.





###component.$emit

Emit an event with variable option args.



__Usage__

`component.$emit(eventName [, args...])`


__Arguments__

|Param|Type|Detail|
|--|--|--|
|eventName| Object String | event name|
|args| Function | the rest of the params will be passed into the listener |


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


###component.$bind




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







##Directive



regularjs provide some basic directive

directive only works for element, you can't use directive to nested component.



###on-[eventName]


you can use `on-**` to bind event on element or component


__Syntax__

`on-click={expression}` or `on-click=delegateName`

__Arguments__


|Param|Type|Detail|
|--|--|--|
|expression| Expression or Name | if particular event is triggerd, expression will be evaluated |



Event is very important in regularjs, reference is not enough to take it into detail see [Guide:event](http://regularjs.github.io/guide/en/events/README.html) for more information.




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











##Other


###Regular.dom



Regularjs implement some cross-platform method for internal implementation needs. 


<a id="dom-inject"></a>
####Regular.dom.inject(element, refer, direction)


`component.$inject` is based on this method



__Arguments__

|Param|Type|Detail|
|--|--|--|
|element|`Node` `false` | element be injected|
|refer|`Node` `false` | reference element|
|direction_(optional default:'bottom')_|String| The place to inject this component. Can be 'top', 'bottom', 'after', or 'before'.|


<a id="dom-on"></a>
####Regular.dom.on(element, event, handle)


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

####Regular.dom.off(node, event, handle)


unbind a eventListener



####Regular.dom.addClass(element, className)


addClassName to specified element.





####Regular.dom.delClass(element, className)

removeClassName at specified element.


####Regular.dom.hasClass(element, className)


detect whether element has some className. 



```javascript
<div class='class1 class2'></div>

dom.hasClass(element, 'class1') // => true

```


####Regular.dom.text(element[, value])


set the content of element to the specified text. if value is not passed, return the combined text contents of element 


####Regular.dom.html(element[, value])


set or get the innerHTML of element.




####Regular.dom.attr(element, name [ , value])


Set or Get the value of an attribute for the  element.






