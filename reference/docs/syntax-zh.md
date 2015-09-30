#  模板语法

[完善此页 >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/syntax.md)


以下简称Regularjs的模板为__rgl__


>  放轻松，语法元素非常简单


##表达式


###ES5 表达式



rgl模板几乎完整的按ES5的规范实现了表达式, 你可以几乎按以往js的经验来使用你的表达式，这点你在其它数据驱动的框架如vuejs或avalon中是享受不到的，
当然并不是说必须要在模板里去声明复杂的表达式，只是提供了可能性.

举个例子，下列表达式在regularjs中都是合法的:

<!-- /t -->

- 100 + 'b'.
- user? 'login': 'logout'
- title = title + '1'
- !isLogin && this.login()
- items[index][this.nav(item.index)].method1()


不过你仍然要注意几个要点

1. __表达式中的`this`指向组件本身, 所以你可以通过`this.xx`来调用组件的某个方法__
2. __数据根路径从component.data开始, 即`user` 其实获取的是`component.data.user`__
3. rgl不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. rgl不支持正则表达式的字面量
5. rgl开放了部分JS内建供使用:


  - Array Date JSON Math NaN RegExp Object String
  - decodeURI decodeURIComponent encodeURI encodeURIComponent 
  - parseFloat parseInt 



除了ES5的表达式，regularjs 也同时支持以下几种表达式类型



<a id="bind-once"></a>

###一次性绑定


由于脏检查机制的性能极大的依赖于监听器的数量，为了精确控制监听器的数量，regularjs引入了一个新的表达式语法元素`@()`提供了bind-once的表达式的支持. 这个被监听的表达式在检查到一次值变化就会被解除监听。 




__syntax__

`@(Expression)`


你可以在任意的表达式环境使用BindOnce(`list`, `if`... etc)


__Example__

```html
<div>{ @(title) }</div> // the interpolation only trigger once

{#if @(test)}  // only test once
//...
{/if}

{#list @(items) as item}  // only trigger once
//...
{/list}

```


你也可以在`$watch` 使用 `@()`


```javascript

var component = new Regular({
  data: {
    user: {}
  }
});

var i = 0;
component.$watch("@(user.name)", function(){
    i++  // only trigger once
});
component.$update("user.name", 1);
component.$update("user.name", 2);

// update twice  but trigger once
alert(i === 1);
```


就如上的例子所示，由于`脏了一次就被被抛弃`, 如果值后续继续变化，会导致ui与data的不同步，所以请小心使用





<a id="filter"></a>
###过滤器Filter

__syntax__

`Expression| fitlerName: arg1, arg2,... argN `



```js
//Add filte

Regular.filter( "last" , function(obj) {
  return obj[obj.length - 1];
};

Regular.filter( "lowercase" , function(obj) {
  return (obj|).toLowerCase();
};
```


```html
// Template 

<div>{list|last|lowercase}</div>
```

with data `{list: ['Add','Update','Delete']}`, output:

```html
// output
<div>delete</div>
```



__regularjs 同时支持一些高阶用法，例如双向过滤器。查看 [[Guide/filter](?api-zh#two-way-filter) 了解更多__





###Range


regularjs 支持一种常见的表达式元素: Range. 它是一种数组的简写形式.



__Syntax__: 

` start..end `

__where__

* start: A expression evaluted to number means range's start
* end:  A expression evaluted to number means range's end




`1..3 === [1,2,3]`




###错误抑制


由于动态模板有别于常规模板的一次性，如果我们抛出所有xx of undefined的错误，整个系统会变得相当脆弱。所以Regularjs在语法解析阶段就抑制了相对安全的深层取值undefined的错误，并使用undefined代替.

<!-- /t -->

```js

new Component({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```



需要注意的是，如果表达中带有函数调用，则函数调用部分，Regularjs会保留其出错信息, 因为function call内部的错误是无法受控制的. 


```javascript

new Component({
  template: "<div>{this.methodNoFound(blog.user.name)}</div>"
})


其中blog.user.name部分的错误被抑制，而this.methodNoFound的undefined错误会被抛出.



```





<a id="interpolation"></a>
##插值


与常规的模板类似，插值是rgl中最常用模板元素



__Syntax__


`{Expression}`

###文本插值



对于文本插值, regularjs会创建一个textNode, 并建立与表达式的__单向数据绑定__.


__Example__

```js

var app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```


上面的例子会输出`<div>leeluolee</div>`，并且一旦数据发生改变，文本节点内容也会发生改变





###属性插值


对于属性节点插值，情况就要复杂一些了. regularjs目前仅允许值被插值, 这里面有几个说明要点.




1. 如果属性是一个字符串，不过它内部具有插值符号`{}`,字符串会生成一个组合表达式，求值结果是这个字符串拼接后的计算值.如`.modal-{klass} z-{state}` 就相当于是 `'.modal-' + klass + 'z-' + state`

2. 对于非指令类的的属性, regularjs会在绑定的值发生变化时, 修改对应属性, 即一般属性(`class`, `style`等)是天生可插值的.

3. 对于指令类的属性(包括事件), 会将插值表达式传入[directive](?api-zh#directive)的处理函数中, 具体处理逻辑交由directive指令

<!-- /t -->






__Example__

```javascript

<input
  type='radio'
  class={klass}
  r-model={checked}
  style="left: {10 + offsetX}px; top: {10 + offsetY}px"
  > 

```

the example above.

1. `r-model`: directive, see [builtin](?api-en#builtin)
2. `style`: string-interpolation
3. `class`: simple attribute interpolation
4. `type`: just normal attribute




<a href="#" id="composite"></a>

##内嵌组件



在编译阶段(AST -> DOM)，每当regularjs碰到一个节点例如
(其中，我们假定__`custom-pager`__是一个已注册的组件)


- `<custom-pager attr1={user} attr2=user on-nav={this.nav()}></custom-pager>` 
- `<div class="text" r-hide={!text}></div>`



将会发生以下过程

- 查找当前命名空间下是否可以找到注册为对应名字的组件
- 如果找到,　则视其为内嵌组件(如`custom-pager`),　会执行流程1
  1. 创建一个空对象`data`.
  2. 如果有子元素, 子内容(AST)会作为实例的[`$body`属性](#transclude), 你可以配合 #include 来使用它
  3. 遍历每个属性，
    - 如果不是事件则作为`data`的一个属性值,　如果为插值则建立父组件与子组件的__双向绑定_-
    - 如果是事件名`on-xx`,则注册为Emitter事件,相当于`this.$on(xx, ...)`
  4. 初始化组件, `data`会作为参数传入
  5. 插入到父组件的内容中
- 如果没有找对应组件名 ,则执行流程2
  1. 创建一个节点`document.createElement(tagName)`
  2. 编译它的子元素(如果有的话)，并塞入节点.
  3. 遍历属性值, 根据插值,指令, 事件等分别处理它们
  4. 将节点插入到父组件的内容中

流程1即我们所说的内嵌组件. 注意内嵌组件无法使用指令, 因为它并不是一个真实节点，而是一种抽象.






- __For Example__

  
  __external__组件的模板中声明
  

  ```html
  <pager current={current} total=100 
    on-nav={this.hello()} 
    on-end='end' />
  ```

  
  就相当于是手动调用组件(参数请查看[API:options](?api-zh#options))
  
  

  ```js
  
  var pager = new Pager({
    events: {
      nav : function(){
        extenal.hello();
      },
      end: function(){
        extenal.$emit('end');
      }
    },
    data:{
      total: "100"
    }
  })
  pager.$bind(extenal, 'current');
  ```

  
  其中extenal代表嵌入它的外层组件. 其中事件的处理与dom事件几乎完全一致，区别就是$event参数变成了你`$emit`的事件参数.
  



[【DEMO】](http://jsfiddle.net/leeluolee/DCFXn/)


where
  
  - template in `#external`
    
    ```html
    {list.length}:{current}
     <pager total={Math.floor(list.length/20)} 
            current={current} 
            on-nav={this.changePage($event)}/>

     <pager total={Math.floor(list.length/20)} 
            current={current} 
            on-nav='nav' />
    ```








##规则Rule



严格来说，在插值之外的语法功能, 都由RULE ,　RULE的语法是`{#NAME }`

<!-- /t -->


__syntax__

`{#NAME ...}Block..{/NAME}`

or non-block (self-closed)

`{#NAME /}`



目前rgl中只有三种Rule: list, if/else/elseif 和 include. 如果需要，未来也可能提供其它Rule.



__Warn__

内建规则和xml标签不能被相互打断，如下例是不被允许会抛出异常. 这也是与常规的字符串模板的最大区别.　


__incorrect __

```xml
<div>
{#if true}
  <p>True</p>
</div>
{#else}
  <p>False</p>
</div>
{/if}

```

__correct__

```xml

<div>
{#if true}
  <p>True</p>
{#else}
  <p>False</p>
{/if}
</div>

```



<a id="list"></a>
##list


list指令用来遍历某个sequence来循环的处理某些重复性的结构



__Syntax >__: 

```html
{#list sequence as item}
  ...block...
{/list}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)




在每次循环都会创建一个临时变量代表当前下标

* `item_index`(取决于你的item命名): 代表当前遍历到的下标(从0开始, 类似与angular中的`$index`变量) 




__Example >__

```js
var component = new Regular({
  template: 
    "{#list items as item}\
     <span class='index'>{item_index}:{item}</span>\
     {/list}",
  data: {
    items: ["a", "b", "c", "d"]
  }
})

component.$inject(document.body);

```

__resulting html__

```html
<span class="index">0:a</span>
<span class="index">1:b</span>
<span class="index">2:c</span>
<span class="index">3:d</span>
```

<a id="if"></a>
##if/else/elseif


与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持



__Syntax__


```jsx
{#if condition}
  ...
{#elseif condition2}
  ...
{#else}
  ...
{/if}
```

where:
- condition: 判断条件，这个表达式结果会被强制转换为Boolean值


__Example__

```jsx

{#if user.age >= 80 }
  you are too old
{#elseif user.age <= 10}
  you are too young
{#else}
  Welcome, Friend
{/if}

```


### 使用if控制属性 


你甚至可以使用逻辑控制符去控制你的属性



__Example__

```xml
<!-- control the attribute -->
<div {#if active == 'home'}data-home{/if}>Home</div>
<!-- control the event -->
<a {#if current < last} on-click={this.next()} {/if}>Next</a>

<!-- control the directive -->
<input {#if !disabled} r-model={username} {/if}>
```


根据判断依据，指令、属性或事件会被添加或移除




[【Demo】](http://codepen.io/leeluolee/pen/JqAaH)




<a name="include"></a>
##include


include 用来标准引入一些内容，这些内容可能需要在初始化后指定，或可能发生变动。


__syntax__

` {#include template} `


__where__




* template: 一个Expression,求值结果是字符串或模板AST


动态引入会监听传入表达式template的数据变动, 每当变化时会重新编译template,并插入到制定位置, 它带来几个好处

1. 可以配置部分模板内容
2. 可以动态修改展现

其中1的意义要远大于2, 比如你实现一个modal弹窗组件，通常modal结构是固定的, 而内容区通常需后续指定, 这时候`include`就可以大展伸手了



```html
<div id="app"></div>

<!-- Templates -->
<script id="modal" type="text/regular">
  <div class="modal show {clazz}">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" on-click={this.close()}>×</button>
          <h4 class="modal-title">{title}</h4>
        </div>
        <div class="modal-body">
          {#include content }
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-default" 
            on-click={this.close()} >Close</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            on-click={this.confirm()}>Confirm</button>
        </div>
      </div>
    </div>
  </div>
</script>

<script>

var Modal = Regular.extend({
  template: '#modal',
  init: function(){
    if(!this.parent) this.$inject(document.body)
  },
  close: function(){
    this.$emit('close');
    this.destroy();
  },
  confirm: function(){
    this.$emit('confirm', this.data);
    this.destroy();
  }
});

var modal = new Modal({
  data: {
    content: '<input type="email" class="form-control" r-model={email}>',
    title: 'please confirm your email'
  }
});

modal.$on('confirm', function(data){
  console.log(data.email)
});
</script>



```

[【DEMO】](http://fiddle.jshell.net/leeluolee/Xvp9S/)





##注释

two way to have comment

1. xml

  ```xml
  <!-- you comment -->
  ```
2. rgl

  ```xml
  {! you comment !}
  ```


