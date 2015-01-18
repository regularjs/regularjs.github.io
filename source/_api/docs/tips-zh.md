[完善此页 >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/api.md)


# Guide

<a id="digest"></a>
##  regularjs中的脏检查

## 一致的事件系统


Regularjs内置了一个简单Emitter提供了上述的`$on`、`$off`以及`$emit`.

在模板中声明使用事件时，dom事件与emitter事件非常相似, 因为它们在内部引用的是一套流程，区别仅仅是触发手段不同.



__Similarities__

- 它们都可以在模板中声明
- 它们在接受String与Expression表现完全一致
  - 如果value是String类型
  - 如果value是Expression类型


__differences__

- emitter event belongs to component and triggered by `component.$emit`.
  but dom event belongs to particular element, in most case, is triggered by user action, except for [custom event](#event).
- Object `$event` in template
  - emitter event: the 2nd param passed into `$emit`.
  - dom event: a wrapped native [dom event](#dom-on), or the object pass into [`fire`](#event) if the event is a custom event.




但是它们仍然有一些不同点



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

[【DEMO】](##)


- 它们都可以被代理到其它组件事件中.

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

[【DEMO】](##)



你可以利用这种相似性来方便的将内联组件的事件传递到外层组件





## 模块化体系

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

## 组件生命周期




### 当 `new Component(options)`

当你实例化组件时，将会发生以下剧情

> 对应的源码来源于[Regularjs.js](https://github.com/regularjs/regular/blob/master/src/Regular.js#L31)

##### 1 options将合并原型中的 [events](#events), data

```js
options = options || {};
options.data = options.data || {};
options.events = options.events || {};
if(this.data) _.extend(options.data, this.data);
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

注册事件，可以让我们无需去实现那生命的方法(init, destory等)

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




### 当 `component.destory()`

当销毁组件时，剧情就要简单的多了.

1. 触发`$destroy`事件

2. 销毁所有模板的dom节点,并且解除所有数据绑定、指令等

需要注意的是，是Regular.prototype.destory完成了这些处理,　所以永远记得在你定义的destory函数中使用`this.supr()`. 一个更稳妥的方案是: 永远不重写destroy, 而是注册`$destory`事件来完成你的回收工作.





## Animation

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




上例的意思是: 

1. 当 `click` 事件触发
2. 给节点添加类名 `animated fadeIn`　(见[animate.css](https://github.com/daneden/animate.css/blob/master/animate.css)) , 一旦动画结束, 我们移除这个类名.
3. 等待 1000ms.
4. 与步骤２类似, 不过我们这次添加一个消失的动画，并等待结束.
5. 增加`display:none` to element6. 
6. 动画结束





### Builtin Command


regularjs 提供了一些最基本的命令来帮助你实现最常用的动画



#### 1. on: event, mode


当特定事件(组件事件或dom事件), 开始动画序列.



__Arguments__



#### 2. when: Expression

when the specifed Expression is evaluated to true, starting the animation.



#### 3. class: classes, mode




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



#### 4. call: Expression
  
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






#### 5. style: propertyName1 value1, propertyName1 value1 ...

setStyle and waiting the `transitionend` (if the style trigger the `transition`)
  
__example__

```html
<div class='box animated' r-animation=
     "on: click; 
        class:  swing; 
        style: color #333;
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

the example above means: once clicking, swing it.  then set `style.color=#333`(trigger transition)... 




#### 6. wait: duration

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

### 扩展动画

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






