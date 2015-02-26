


这个页面主要是一些无法放到[api](?api-zh) and [syntax](?syntax-zh)但是又非常重要的概念


[完善此页 >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)

# 如何优雅的管理你的模板


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


使用`rgl!`前缀来标明此资源为regularjs模板, 会在加载的同时将其解析为ast.




__Example__

```js

require(['rgl!foo.html', 'regularjs'], function(foo, haha , Regular){

    var Foo = Regular.extend({
      template: foo
    })

    return Foo;

});
```


点击 [https://github.com/regularjs/requirejs-regular](https://github.com/regularjs/requirejs-regular) 查看requirejs的使用和optimizer的配置




## 2 regularify (browserify)


reuglarjs 提供一个 browserify 的 transform ([regularify](https://github.com/regularjs/regularify) ) 用来转换模板


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



## 3.  不使用requirejs或browserify，怎么办? 


如果以上两种模块体系都是不是你得选择，也许你需要自己实现一个处理插件了， 不用担心由于regularjs本身本打包为了umd模块，它可以同时在node和browser环境被使用。
使用 [Regular.parse](?api-zhparse) 来 处理你得



```html
var k = functin()[] 

```


## 4. NEJ
特别对于网易的同事， regularjs目前已经集成到[NEJ](http://nej.netease.com)得模块体系中， 使用中有疑问可以私泡我 (杭州研究院|前台技术中新|郑海波)





<a id="digest"></a>
#  脏检查: 数据绑定的秘密

事实上，regularjs的数据绑定实现非常接近于angularjs: 都是基于脏检查. 

##  Digest阶段


这里要提到内部的一个非常重要的阶段——digest阶段,  每当进入digest阶段, regularjs会处理以下步骤:

1. 标记dirty = false;
2. 遍历所有通过`component.$watch`绑定的数据观察者, 对比它们当前求值(基于你传入的表达式)与之前的值, 如果值发生改变, 运行绑定的监听器(可能会有一些view的操作).
任何一个观察者发生改变, 都会导致`dirty=true`.
3. 如果dirty===true, 我们重新进入步骤1. 否则进入步骤4.
4. 完成脏检查

## 为什么使用脏检查

1. 脏检查完全不关心你改变数据的方式, 而常规的set, get的方式则会强加许多限制
2. 脏检查可以实现批处理完数据之后，再去统一更新view.
3. 脏检查可以实现任意复杂度的表达式支持.

正因为如此，你可能需要手动进入digest阶段去同步的数据与视图. 值得庆幸的是，大部分内建特性都会自动进入digest阶段.比如事件、timeout模块等等. 



```
<div on-click={this.add()}></div>
```


对于在regularjs控制范围之外的情形你需要通过[component.$update](?api-zhupdate)手动进入digest.



__Example__

```js
var component = new Regular();

component.data.name = 'leeluolee'

// you need call $update to Synchronize data and view 
component.$update(); 


```

# 一致的事件系统



由于声明式描述的特性，事件几乎是regularjs最为重要的一环。

Regularjs 中包含两种事件大类: Dom事件以及组件事件，它们触发手段截然不同，但是在模板中得表现又是如此相似.


##  DOM 事件



所有的`on-`开头的属性都会被作为ui事件处理 

__tip__: 由于Component.directive支持正则匹配属性名, 所以内部实现中ui事件绑定其实是一种特殊的指令, 它以/on-\w+/作为指令名，从而匹配出以on-开头的作为事件处理.





### 1.  基本Dom事件 



与ractive类似，事件指令会默认在指令所在节点绑定对应事件，比如`on-click=xx`会在节点绑定`click`事件. 但与ractive不同的是， regularjs绑定的是表达式 每次ui事件触发时， __与angular一样，运会行一次表达式__.



__Example__:

```html
<button on-click={count = count + 1}> count+1 </button> <b>{count}</b>,
```


每次你点击按钮， count都会增加1


[【DEMO】 >](http://jsfiddle.net/leeluolee/y8PHE)




<a name="custom-event"></a>

### 2.  注册自定义事件  : Component.event


__USEAGE__

`Component.event(event, fn)` 


你可以注册一些dom原生并不支持的事件，比如`on-tap`, `on-hold`



__Arguments__

* event:  自定义事件名  (no `on-` prefix) 
* fn(elem, fire)
  - elem:    绑定节点
  - fire:    触发器 



注意如果需要做 __销毁工作__ ，与指令一样，你需要返回一个销毁函数



__Example__


定义`on-enter`事件处理回车逻辑



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


查看 [$event]($event)了解更多




### 3.  代理事件还是直接运行.



取决于你传入的值是表达式插值还是普通属性，regularjs会做不同的响应处理，例如



- 表达式(e.g. `on-click={this.remove()}`)
  
  如果传入的是表达式，与angular类似，一旦事件触发，此表达式会被运行一次。
  
  __Example__
  ```html
    <div on-click={this.remove(index)}>Delte</div>
  ```

   在你的组件中定义remove逻辑

  ```javascript
  var Component = Regular.extend({
    template:'example',
    remove: function(index){
      this.data.list.splice(index ,1);
      // other logic
    }
  })

  ```

  
  一般来讲推荐这种方式来处理事件. 
  
  


-  非表达式(e.g. `on-click="remove"`)

  
  当传入的不是表达式，事件会被代理到组件的事件系统中，你可以使用`$on`去处理此事件
  
  __Example__

  ```html
    <div on-click="remove">Delte</div>
  ```

   然后利用`$on`方法来处理事件

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



### 4.  天生的事件代理支持



所有的`on-*`都会在节点上绑定对应事件，在某种情况下(比如大列表)，这种方式不是很高效.

你可以使用`delegate-`来代理`on-` 来避免可能的性能问题. regularjs只会绑定唯一的事件到组件的第一父元素(无论你是如何$inject的)来处理组件内的所有代理事件



__Example__

```html
<div delegate-click="remove">Delte</div>   //Proxy way via delegate
<div delegate-click={this.remove()}>Delte</div> // Evaluated way via delagate
```


从用户使用角度讲，`on-`和`delegate-` 完全等价，但是各有利弊

1. 正如你在`jQuery.fn.delegate`中学到的，如果组件结构复杂，避免在那些高频触发的事件中使用事件代理(mouseover等)
2. 如果事件是[自定义事件](custom-event). 事件对象必须是可冒泡的，这样事件代理才能生效 ，你可以参考zepto's tap-event的[实现](https://github.com/madrobby/zepto/blob/master/src/event.jsL274).
3. 某些事件天生没法冒泡，比如ie低版下的chang。select等. 所以也就无法使用`delegate-`


<a name="$event"></a>
### 5. `$event`


 那你可以使用`$event`来获取事件对象，这个变量会再每次事件触发时临时的定义在data.$event中， 即你可以在模板里直接使用它, 对于非自定义事件，则`$event`传入fire的对象.


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


`$event`对象是被修正过的，在兼容IE6的前提下，你可以使用以下规范内的属性


0. origin:  绑定节点
1. target: 
2. preventDefault()
3. stopPropgation
4. which
5. pageX
6. pageY
7. wheelDelta
8. event: origin event object.


##  组件事件


Regularjs内置了一个简单Emitter提供了组件的实例方法:`$on`、`$off`以及`$emit`. 这些我们都已经在 [api的emitter](?api-zhon) 中介绍过了， 不再赘述



__Example__

```js
var component = new Regular;
component.$on("event1", fn1)// register a listener
component.$trigger("event1", 1, 2) // trigger event1 with two params
component.$off("event1", fn1)  // unregister a listener
```


## 相同点

### 它们都可以在模板中声明

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

### 它们同时接受表达式或非表达式类型的参数

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

## __不同点__


- 触发手段不同: 1) 组件事件一般由
  but dom event belongs to particular element, in most case, is triggered by user action, except for [custom event](event).
- Object `$event` in template
  - emitter event: the 2nd param passed into `$emit`.
  - dom event: a wrapped native [dom event](dom-on), or the object pass into [`fire`](event) if the event is a custom event.
- dom事件会自动进入digest. 但是





__the `$event` trigger by Emitter is the first param passed to `$emit`__.

[【DEMO】](#)


- 它们都可以被代理到其它组件事件中.

__example__



```javascript


```

[【DEMO】](#)



你可以利用这种相似性来方便的将内联组件的事件传递到外层组件





# 模块化体系

- 传入Object可以进行多个factory的扩展

```js

Component.directive({
  "r-directive1": factory1,
  "r-directive2": factory2
})

```

-  如果只传入name, 可获取对应的factory .

```js
Component.filter("format": factory1);

alert(Component.filter("format") === factory1) // -> true

```

# 组件生命周期




## 当 `new Component(options)`

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




## 当 `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.







# Animation


regularjs 提供了纯声明式的动画支持，看完本章指南你会发现regularjs的动画系统的灵活和强大，它甚至可以完美的控制动画队列。



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




上例的意思是: 

1. 当 `click` 事件触发
2. 给节点添加类名 `animated fadeIn`　(见[animate.css](https://github.com/daneden/animate.css/blob/master/animate.css)) , 一旦动画结束, 我们移除这个类名.
3. 等待 1000ms.
4. 与步骤２类似, 不过我们这次添加一个消失的动画，并等待结束.
5. 增加`display:none` to element6. 
6. 动画结束





## Builtin Command


regularjs 提供了一些最基本的命令来帮助你实现最常用的动画



### 1. on: event, mode


当特定事件(组件事件或dom事件), 开始动画序列.



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

## 扩展动画

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







#  指令还是组件 


- regularjs中得指令一般用来增强节点的能力, 与angularjs的指令不同，它更像是一个装饰器
- 而regularjs中得组件则意义非凡了，它是一个小型mvvm系统，你可以使用它来构建任意复杂度的组件，关键是__组件是可组合的__
- 它们都是一种抽象，为的是复用一些可重用逻辑



