


This page serves some content that not included by [api](?api-en) and [syntax](?syntax-en), but they all important.


[Improve this page >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

# Manage template easily


在文档的所有例子中，为了方便起见, 都是使用了以下两种方式来管理模板

1. 直接在js中声明模板字符串
  
  ```js
  var Component = Regular.extend({
    tempalte: "<h2>{title}</h2>"
  })
  ```

  当模板非常简单时，这样做确实非常方便，但当模板结构稍微复杂点时, 一般也可以使用页面的模板容器节点
2. 引用实现写在页面标签中的内容，如 

  ```javascript
  var Component = Regular.extend({
    tempalte: document.getElementById("app")
  })

  ```

  Where in element `#app`:

  ```html

  <script id='app' type='text/rgl'>
  <nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
      //...
       </div>
    </div>
  </nav>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-3 col-md-2 sidebar">
      //...
      </div>
    </div>
  </div>
  </script>
  ```
  这种方式相较于方式1其实有利有弊. 例在于它解决了在js中拼接字符串模板的肮脏行为, 弊则在于模板本身变成了一个“全局”的东西，组件这个统一的整体也被打碎了, 从项目规模庞大后，维护这些散落在页面中的容器节点也会成为随时引爆的导火索


除此之外，上述两种解决方案都有一个问题： __无法对模板做预解析. __

“是否有解决上述问题的方案呢？” 答案是肯定的, 就是将模板加载集成到模块系统中， regularjs 提供了市面上最常用的两种开发方式的解决方案: requirejs(AMD) 和 browserify(Commonjs), 


## 1 [requirejs-regular](https://github.com/regularjs/requrejs-regular)

__Install__

- `bower install requirejs-regular`
- `npm install requirejs-regular`


__Introdocution__


use prefix `rgl!` to load regularjs template.




__Example__

```js

require(['rgl!foo.html', 'regularjs'], function(foo, haha , Regular){

    var Foo = Regular.extend({
      template: foo
    })

    return Foo;

});
```


See [https://github.com/regularjs/requirejs-regular](https://github.com/regularjs/requirejs-regular) for more information about require-regular and settings.




## 2 regularify (browserify)


we provide a browserify transform named [regularify](https://github.com/regularjs/regularify) for converting template to AST. 


__Install__

- `npm install regularify`


__Usage__

You can simply use extensions `.rgl` and `.rglc`(they do different transform) to load regularjs template or component, the extensions are also configurable



__use `.rgl`__

transform rgl is used to load rgl template

```html
var ast = require("xx.")

var Component = Regular.extend({
  template: ast,
  // ....
})

```


__use `.rglc`__

transform rglc is used to load A reuglarjs Component.

```html
var Component = require("component.rglc")
```

where in `component.rglc`

```html
<h2>{title}</h2>
<div>{content}</div>

<script>
  module.exports = {
    init: function(){

    }
  }
</script>

```

See [regularify] for more information



## 3. "You don't use browserify or requirejs?" 


There is so many module system in the world, we can't support all of them by ourself. But you can use [`Regular.parse`](?api-en#parse) to implement An plugin for you self.







```html
var k = functin()[] 

```







<a id="digest"></a>
# dirty-check: the secret of data-binding 

事实上，regularjs的数据绑定实现非常接近于angularjs: 都是基于脏检查. 

## Digest phase 




```
<div on-click={this.add()}></div>
```






__Example__

```js
var component = new Regular();

component.data.name = 'leeluolee'

// you need call $update to Synchronize data and view 
component.$update(); 


```

# Consistent event system


Event is the most important thing in regularjs. 

Event in regularjs have two types: __Dom Event__ and __Component Event__, let's talk about them  Respectively， and find some similar features between them.


## Dom Event 



Every attribute on element prefixed with `on-` (e.g `on-click`) will be considered as event binding. you can also use it in delegating way via `delegate-*` (e.g. `delegate-click`)

> <h5>tip</h5>
> In fact, event is a special directive, for it accepts RegExp as the first param.





### 1.  Basic DOM Event Support 



you can bind event-handler with `on-xxx` attribute on tag (e.g.  `on-click` `on-mouseover`)



__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


every time you click the button. the `count` will +1.


[【DEMO】 >](http://jsfiddle.net/leeluolee/y8PHE)




<a name="custom-event"></a>

### 2.  Register Custom DOM Event  : Component.event


__USEAGE__

`Component.event(event, fn)` 



You can register a custom event which is not native supported by the browser(e.g. `on-tap` `on-hold`).



__Arguments__

* event: the name of custom event  (no `on-` prefix) 
* fn(elem, fire)
  - elem:    attached element 
  - fire:    the trigger of the custom event. 


> <h5>Tips</h5>
> * similar with directive, if you need some teardown work, you need return a function.




__Example__


define a `on-enter` event, handle the keypressing of Enter key .



```js
var dom = Regular.dom;

Regular.event('enter', function(elem, fire){
  function update(ev){
    if(ev.which == 13){ // ENTER key
      ev.preventDefault();
      fire(ev); // if key is enter , we fire the event;
    }
  }
  dom.on(elem, "keypress", update);
  return function destroy(){ // return a destroy function
    dom.off(elem, "keypress", update);
  }
});

// use in template
<textarea on-enter={this.submit($event)}></textarea>`
```


see [$event](event) for more information.




### 3.  Proxy or Evaluate .


Expreesion and Text is all valid with `on-event`. but they do different logic when event  is triggered.




- Expression (e.g. `on-click={this.remove()}`)
  
  once the event fires. Expression will be evalutated, it is similar with angular.
  
  __Example__
  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```

  where in you Component 

  ```javascript
  var Component = Regular.extend({
    template:'example',
    remove: function(index){
      this.data.list.splice(index ,1);
      // other logic
    }
  })

  ```

  
  It is the most recommend way to use event.
  
  


- Non-Expression (e.g. `on-click="remove"`)

  
  Instead of run Expression directly, if you pass a String, the dom event will be redirected to paticular component event.
  
  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

  then using `$on` to handle event. 

  ```javascript
  var Component = Regular.extend({
    template:'example',
    init: function(){
      this.$on("remove", function($event){
          // your logic here
      })
    }
  })

  ```



### 4. Delegate Event by `delegate-*`



every `on-*` will call `addEventListener` on element.  sometimes, it is not efficient.

you can use `delegate-` insteadof `on-` to avoid the potential performance issue. regularjs will attach single event on component's parentNode(when `$inject` is called), all delegating-event that defined in component will be processed collectively.

From user perspective, `on-` and `delegate-` is almost the same.


__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


__Warning__

1. if the component is large in structure. avoid attaching too much events that is `frequencey triggered` (e.g. mouseover) to component.
2. if the event is a [custom event](custom-event). it need to have the ability to bubble, then the component.parentNode can capture the event. for exampel:  zepto's tap-event [source](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).


<a name="$event"></a>
### 5. `$event`


In some cases, you may need the `Event` object, regularjs created an temporary variable`$event` for it, you can use the variable in the Expression.

if the event is custom event, the `$event` is the param you passed in `fire`.


__Example__

```javascript
new Regular({
  template:
  "<button on-click={this.add(1, $event)}> count+1 </button> \
    <b>{count}</b>",
  data: {count:1}
  add: function(count, $event){
    this.data.count += count;
    alert($event.pageX)
  }
}).$inject(document.body);
```

[DEMO >](http://jsfiddle.net/leeluolee/y8PHE/3/)


`$event` has been patched for you already (ie6+ support), you can use the property below.


0. origin: element that register the event 
1. target: 
2. preventDefault()
3. stopPropgation
4. which
5. pageX
6. pageY
7. wheelDelta
8. event: origin event object.


## Component Event 


Regularjs has a simple Emitter implement that providing `$on`、`$off` and `$emit` they have been introduced in [api event](?api-en?on).




__Example__

```js
var component = new Regular;
component.$on("event1", fn1)// register a listener
component.$trigger("event1", 1, 2) // trigger event1 with two params
component.$off("event1", fn1)  // unregister a listener
```


## Similarities

### both of them can be used in template.

__Example__

```js

var component = new Regular({
  template: 
    '<div on-click={this.say()}></div>\
    <pager on-nav={this.nav($event)}></pager>'
  say: function(){
    console.log("trigger by click on element") 
  },
  nav: function( page ){
    console.log("nav to page "+ page)
  }
})

```

### they all accept Interpolation and Non-Interpolation, and perform consistent 

__Example__

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

## __Differences__


- component event belongs to component and triggered by `component.$emit`.
  but dom event belongs to particular element, in most case, is triggered by user action, except for [custom event](event).
- Object `$event` in template
  - emitter event: the 2nd param passed into `$emit`.
  - dom event: a wrapped native [dom event](dom-on), or the object pass into [`fire`](event) if the event is a custom event.




__the `$event` trigger by Emitter is the first param passed to `$emit`__.

[【DEMO】](#)


- both of them can be redirect to another component event. 

__example__



```javascript


```

[【DEMO】](#)








# Modular

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

# LifeCycle




## when `new Component(options)`

当你实例化组件时，将会发生以下剧情

> 对应的源码来源于[Regularjs.js](https://github.com/regularjs/regular/blob/master/src/Regular.jsL31)

#### 1 options将合并原型中的 [events](events), data

```js
options = options || {};
options.data = options.data || {};
options.events = options.events || {};
if(this.data) _.extend(options.data, this.data);
if(this.events) _.extend(options.events, this.events);

```

#### 2 将options合并到this中

由于传入了参数true, 实例化中传入的属性会覆盖原型属性.

```js
_.extend(this, options, true);
```


#### 3  解析模板

模板本身已经被解析过了(AST)，这步跳过.

```js
if(typeof template === 'string') this.template = new Parser(template).parse();
```

#### 4. 根据传入的options.events 注册事件

注册事件，可以让我们无需去实现那生命的方法(init, destory等)

```js
if(this.events){
  this.$on(this.events);
}
```

#### 5* 调用config函数.

 一般此函数我们会在config中预处理我们传入的数据

```js
this.config && this.config(this.data);
```

#### 6* __编译模板__, 触发一次组件脏检查

这里的脏检查是为了确保组件视图正确,　__到这里我们已经拥有初始化的dom元素__, 你可以通过$refs来获取你标记的.

```js

if(template){
  this.group = this.$compile(this.template, {namespace: options.namespace});
}

```

#### 7* __触发`$init`事件，　并调用this.init方法. ____

调用init之后我们不会进行自动的脏检查.

```js
this.$emit("$init");
if( this.init ) this.init(this.data);
```




## when `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.







# Animation


regularjs's animation is pure declarative, powerful and easily extensible. the animations is chainable and have the ability that connecting other element's animation sequence.

you can using multiple animations via single directive: `r-animation`


To be honest, `r-animation` is the most complex directive in regularjs, but it is worth doing at all.


__Syntax__

```html

<div r-animation="Sequence"></div>

Sequence:
  Command (";"" Command)*

Command:
  CommandName ":"" Param;

CommandName: [-\w]+

Param: [^;]+

```

__Exmaple__

```html

<div r=animation=
   "on: click, 2; 
    class: animated fadeIn; 
    wait: 1000; 
    class: animated fadeOut; 
    style: display none; "></div>

```




The Exmaple means: 

1. when `click` triggered
2. addclass `animated fadeIn`(see[animate.css](https://github.com/daneden/animate.css/blob/master/animate.css)) to element, when `transitionend` (or `animationend`), remove the class.
3. waiting 1000ms.
4. similar with step 2.
5. addStyle `display:none` to element,( if trigger `transition`, this command will waitting for `transitionend`)





## Builtin Command


regularjs provide basic commands for implementing common animations.



### 1. on: event, mode


when particular event is triggered , starting the animation.



__Arguments__



### 2. when: Expression

when the specifed Expression is evaluated to true, starting the animation.



### 3. class: classes, mode




__params__

* classes: the classes is sperated by whitespace
* mode (Number): 

  the behaviour of `Command: class` is depend on `mode`, there is three types of the mode.
  - 1: the default mode, first add the class to element, after `animationend` the remove it
  - 2: the command will first to add classes to element, then add classes-active at nextReflow to trigger animation. when `animationend` remove all of them.
  - 3: similar with mode 1, but mode 3 dont remove classes after animationend

__example__

```html
<div id="box1" r-animation="on:click;class: animated fadeIn, 1">box1</div>
<div id="box2" r-animation="on:click;class: animated fadeIn, 2">box2</div>
<div id="box3" r-animation="on:click;class: animated fadeIn, 3">box3</div>
```

__box1__:
  1. add `animated fadeIn`
  2. when `animationend` remove them
  3. call next animation

__box2__:
  1. add `animated fadeIn`
  2. add `animated-active fadeIn-active` at next event-loop(to trigger the animation)
  3. when `animationend` then remove all of `animated fadeIn animated-active fadeIn-active`
  4. call next animation

__box2__:
  1. add `animated fadeIn`
  2. when `animationend` , call next animation



### 4. call: Expression
  
evaluated the Expression and enter the digest phase. `call` command can be used to notify other element.

```html

<div class='box animated' r-animation=
     "when:test; 
        class: swing ;
        call: otherSwing=true ;
        class: shake">
  box1: trigger by checkbox
</div>
  
<div class='box animated' r-animation=
     "when: otherSwing; 
        class:  swing; 
      ">box2: after box1 swing</div>

```

steps as follow:

1. when `test` is computed to true, start box1's animation
2. swing then call `otherSwing = true`;
3. box2's `otherSwing` is evaluted to `true`. 
4. box2 shakes, meanwhile box1 shakes;
5. done.

> <a href="http://codepen.io/leeluolee/pen/aHwoh/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>






### 5. style: propertyName1 value1, propertyName1 value1 ...

setStyle and waiting the `transitionend` (if the style trigger the `transition`)
  
__example__

```html
<div class='box animated' r-animation=
     "on: click; 
        class:  swing; 
        style: color 333;
        class: bounceOut;
        style: display none;
      ">style: click me </div>
```

you need to add property `transition` to make color fading effect work.

```css
.box.animated{
   transition:  color 1s linear;
}
```

the example above means: once clicking, swing it.  then set `style.color=333`(trigger transition)... 




### 6. wait: duration

set a timer to delay execution of subsequent steps in the animation queue

__param__

- duration: an integer indicating the number of milliseconds to delay execution of the next animation in the queue. 

```html
<div class='box animated' r-animation=
     "on:click; 
        class: swing ;
        wait: 2000 ;
        class: shake">
  wait: click me
</div>


```

> <a href="http://codepen.io/leeluolee/pen/FhwGC/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>






<!--  -->

## Extend Animation

you can extend javascript-based Animation via  `Component.animation(name, handle)`. 


__Param__

- name (String): the name of the commandName
- handle(step): the command definition, you need return a [Function] to act animation. the [Function] accept one param `step`


for example, we need fading animation.

```javascript
Regular.animation("fade", function(step){
  var param = step.param,
    element = step.element,
    fadein = param === "in",
    step = fadein?  1.05: 0.9;
  return function(done){ 
    var start = fadein?  0.01: 1;
    var tid = setInterval(function(){
      start *= step 
      if(fadein && 1- start < 1e-3){
        start = 1; 
        clearInterval(tid);
        done()
      }else if(!fadein && start < 1e-3){
        start = 0;
        clearInterval(tid);
        done()
      }
      element.style.opacity = start;
    }, 1000 / 60) 
  }
})
```

describe in template

```html
<div class='box animated' r-animation=
       "on:click; 
        class: swing ;
        fade: out ;
        fade: in;
         ">
    fade: click me
</div>

```

the thing you only need to do is that: when your animation is compelete, call the function `done`.


> <a href="http://codepen.io/leeluolee/pen/qJvry/"><span class="icon-arrow-right"> <strong>Result on Codepen</span></strong></a>







#  Directive or Component 


- Directive in regularjs is used to enhance element's ability, it just like a decorator on dom element. 
- Component doesn't have any relationship with dom element. It is a small mvvm system, it have data, template and mini controller, you can use Component to realize complex function. and they are combinative.
- All of them are reusable in your application.



