


# Regularjs API

<!-- t -->

[Improve this page >](#xx)

 __Warn:__ `Component` means the method belongs to both 'Regular' and its subClass. `Regular` means the method only belongs to 'Regular' itself.

 
 ## Static API

<!-- s -->

[完善此页 >](#xx)

__注意:__ `Component` 意味着此接口同时属于`Regular`及其子类. `Regular`　表示此接口只属于Regular本身(一般为全局配置参数)

## 静态接口
<!-- /t -->



### Component.extend

- 定义: Component.extend(options)

<!-- t -->
<!-- s -->

`Component.extend` 用来创建一个继承与`Component`的子组件，参数`options`中的所有属性都会成为子组件的__原型属性__. 


<!-- /t -->


```javascript
var Component = Regular.extend({
	template: "<div><h2 on-click={this.changeTitle(title + '1')}>{title}</h2><div>{content}</div></div>",

  config: function(){},
  init: function(){},

  changeTitle: function(newTitle){
    this.data.title = newtiTle;
  }
})

```

<!-- t -->
<!-- s -->


__config中需要说明的特殊字段__









<!-- /t -->


### Component.implement

<!-- t -->
<!-- s -->

扩展Component自身的__原型方法__. options与`Component.extend`的完全一致.


__注意__: Regular的类式继承体系来源于著名的[ded/klass](https://github.com/ded/klass)，通过implement扩展的方法仍然可以调用`this.supr`.

see more at [【类式继承】](#) 

<!-- /t -->


### new Component()

实例化组件

__返回__: 组件实例, 参考[实例方法](#instance)

options参数与, 但是需要注意的是, 在实例传入的属性将成为__实例属性__, 意味它将覆盖extend与implement的定义.并且无法调用`this.supr()`


### options

`new Component(options)`，`Component.extend(options)`, `Component.implement(options)`　都接受一个完全一致的Object参数options. 这里我们做一次统一的说明


#### template


- type: String | Selector | AST

即传入的Regularjs模板字符串，你需要遵循[模板语法](#template)（放心，比你用过的任何模板都要简单），当然在代码中拼接字符串模板是件肮脏的活，你可以参考[【模板模块化以及预解析模板】](#)来优雅的管理你的模板。

#### config( data )


- type: Function

会在模板编译 __之前__ 被调用，__config一般是用来初始化参数__，它接收一个Object类型的参数data, 即你在初始化时传入的data参数.

#### init

- type: Function

会在模板编译 __之后__(即活动dom已经产生)被调用. 你可以在这里处理一些与dom相关的逻辑　

#### destory: 

- type: Function

如果你需要有自定义的回收策略,你可以重写destroy方法(大部分情况并不需要,　只要是定义在模板中的逻辑都无需手动清理) __记得调用__`this.supr()`来调用Regular的自动回收.

```javascript
var Component = Regular.extend({
//.....
  destroy: function(){
    this.supr(); // call the super destroy 
  }
})
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


#### watchers

- type: Object

声明数据绑定





### Component.directive

> Component.directive(name, factory)

<!-- t -->

__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String|the custom event name|
|factory|Function| Factory function for creating event type|

<!-- s -->
设置自定义指令,　类似与Angularjs中的指令, Regularjs可以通过设置指令来增加节点功能. 由于Regularjs本身的组件化思维，以及模板本身已经拥有强大的描述能力，所以指令的功能在这里被弱化。

__Arguments__

|Param|Type|Detail|
|--|--|--|
|name|String||
|factory|Function| Factory function for creating event type|


__参数__

- name [String]: 指令名
- factory []


<!-- /t -->

### Component.filter(name, factory)

<!-- t -->
<!-- s -->
设置自定义过滤器
<!-- /t -->

### Component.event(name, factory)

<!-- t -->
<!-- s -->
设置自定义dom事件


__Argument__

|Param|Type|Detail|
|--|--|--|
|name|String|the custom event name|
|factory|Function| Factory function for creating event type|


__Example__
<!-- t -->
<!-- s -->
当按下ESC时，触发on-exit事件
<!-- /t -->

```javascript

Component.event()

```



<!-- /t -->


### Component.animation(name, )

自定义一个动画command, 

### Component.use( module )

使用一个模块, 注意event、animation、filter、directive等扩展方法，它们的影响范围都是当前组件类及其子类.　即是具有封装性的，

参见 [【模块化策略】]()了解作者为何如此设计.

### Regular.expression( ExpressionString )

- return: Expression对象

创建一个表达式，基本上你不会使用此方法

### Regular.parse( TemplateString)

解析模板字符串为AST, 基本上你不会使用此方法。


## Instance API


### component.$watch

-usage: component.$watch(expression, callback [, options])


<!-- t -->
<!-- s -->
一旦表达式求值发生改变， 调用callback方法

__参数__

- expression
  -type: String | Expression
  -callback(newval, oldval): Function
    回调接受两个参数

<!-- /t -->

__useage__

```
component.$watch( expression, callback [, options]) 
```




# 实例接口

component即代表组件实例, 注意这些公有都有`$`前缀 意味不建议进行重写

1. [component.$watch](../core/binding.html#watch):     创建一个数据监听
2. [component.$unwatch](../core/binding.html#unwatch)  解绑一个数据监听
3. [component.$update](../core/binding.html#update)    更新一个数据并进入digest(类似angular的$apply)
4. [component.$get](../core/binding.html#get)          获得一个表达式的值(类似angular的$eval)
5. <del>[component.$bind](../core/binding.html#bind)</del>        创建组件之间的双向绑定

<del>__即将废弃__</del>. 由于$bind过于灵活的双向绑定，极可能不当使用带来难以维护的对象间关系. 请使用事件通讯来处理组件之间的消息同步。

6. [component.$on](../core/message.html#on)            创建一个事件监听器(非dom)
7. [component.$off](../core/message.html#off)          解除一个事件监听(非dom)
8. [component.$emit](../core/message.html#emit)        触发一个事件监听(非dom) 
9. [component.$inject](../getting-start/quirk-example.html#inject)  插入组件到指定位置 


xian

# 内置模块

1. [指令directive](../core/directive.html#buildin)


# Regular中的内置帮助函数集



## Regular.dom

提供基本的操作dom帮助，注意Regularjs并没有封装成类似jqLite的对象，而是纯粹的静态方法.


## Regular.util

提供一些通用帮助方法的支持



## Regular.config
Regular的一些配置项




## 节点和组件引用

在模板中，你可以使用`ref`属性来标记一个节点或组件.　在组件初始化后，你可以通过component.$refs 来获取你标记的节点


```html

component = new Regular({
  template: "<input ref=input> <pager ref=pager></pager>"
})

component.$refs.input // -> the input tag
component.$refs.pager // -> the pager component

```
