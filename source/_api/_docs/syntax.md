# {Template Syntax % 模板语法}

[{Improve this page%完善此页} >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/syntax.md)


{I will use `rgl` to represent the Regularjs's built template engine %以下简称Regularjs的模板为__rgl__}


> {Take easy, syntax is very simple % 放轻松，语法元素非常简单}


##{Expression%表达式}


###ES5 {Expression%表达式}

<!-- t -->

Expression are usually placed in bindings such as 

1. inteplation: `{ Expression }`
2. rule: `{#list Expression as item}` , `{#if Expression}`...

and also can be used in some method like `$watch`,`$get`, `$update`


rgl almost implement the Expressions of ES5 specification

For example, these are valid expressions in regularjs:

- 100 + 'b'.
- 'a' + 'b'
- user? 'login': 'logout'
- login && items[index][this.nav(item.index)].method1()

Tips:

1. keyword `this` points to the component.
2. the root of the data is component.data. so `user` in Expression equals to 'component.data.user'
3. regular don't support prefix, postfix and bitwise operation(e.g. `++`,`--`, `&`)
4. literal regexp is not supported
5. you can directly use some global Object like:
<!-- s -->

rgl模板几乎完整的按ES5的规范实现了表达式,由于全面的　表达式的支持，rgl事实上是一个富逻辑的模板，这个是动态模板的天然要求.

举个例子，下列表达式在regularjs中都是合法的:

- 100 + 'b'.
- 'a' + 'b'
- user? 'login': 'logout'
- login && items[index][this.nav(item.index)].method1()


不过你仍然要注意几个要点

1. __表达式中的`this`指向组件本身, 所以你可以通过`this.xx`来调用组件的某个方法__
2. __数据根路径从component.data开始, 即`user` 其实获取的是`component.data.user`__
3. rgl不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. rgl不支持正则表达式的字面量
5. rgl开放了部分JS内建供使用:
<!-- /t -->
  - Array Date JSON Math NaN RegExp Object String
  - decodeURI decodeURIComponent encodeURI encodeURIComponent 
  - parseFloat parseInt 


{
Beside ES5 Expression, regularjs also support some useful Expression element.
%
除了ES5的表达式，regularjs 也同时支持以下几种表达式类型
}



###{Bindonce Expression%一次性绑定}

{
Beacuse the dirty-check's performance is tightly related to the counts of the data-binding, the less binding is created, the better.

regularjs provide `BindOnce Expression` to help developer to control the binding more easily.
%
由于脏检查机制的性能极大的依赖于监听器的数量，为了精确控制监听器的数量，regularjs引入了一个新的表达式语法元素`@()`提供了bind-once的表达式的支持. 这个被监听的表达式在检查到一次值变化就会被解除监听。 


}

__syntax__

`@(Expression)`

{
Bindonce Expression is valid Expression in rgl , so you can use it in any Expression environment(`list`, `if`... etc)
%
你可以在任意的表达式环境使用BindOnce(`list`, `if`... etc)
}

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

{
you can also use `@()`  in `$watch` .
%
你也可以在`$watch` 使用 `@()`
}

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

{
As shown above, binding-once __may make the data not synchronized with the ui__. you should use it carefully.

%
就如上的例子所示，由于`脏了一次就被被抛弃`, 如果值后续继续变化，会导致ui与data的不同步，所以请小心使用
}





###{Filter%过滤器Filter}


__syntax__

`Expression| fitlerName: arg1, arg2,... argN `

###Range

{
regularjs support a special Type —— range. it is a shortcut to create Array.
%
regularjs 支持一种常见的表达式元素: Range. 它是一种数据的简写形式.
}


__Syntax__: 

` start..end `

__where__

* start: A expression evaluted to number means range's start
* end:  A expression evaluted to number means range's end




`1..3 === [1,2,3]`




###{Error suppression%错误抑制}

<!-- t -->

regularjs suppress some safe exception to help system works as expected. For example

<!-- s -->
由于动态模板有别于常规模板的一次性，如果我们抛出所有xx of undefined的错误，整个系统会变得相当脆弱。所以Regularjs在语法解析阶段就抑制了相对安全的深层取值undefined的错误，并使用undefined代替.

<!-- /t -->

```js

new Component({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```

{
But if any function(undefined or any error occurs after calling) is called, the error will be still throwed. 

%

需要注意的是，如果表达中带有函数调用，则函数调用部分，Regularjs会保留其出错信息, 因为function call内部的错误是无法受控制的. 
}

```javascript

new Component({
  template: "<div>{this.methodNoFound(blog.user.name)}</div>"
})

{
error throw by the Expression `blog.user.name` is ignored, 

but this.methodNoFound(...)` still throw  "undefined is not a function"
%
其中blog.user.name部分的错误被抑制，而this.methodNoFound的undefined错误会被抛出.

}

```





##{Interpolation%插值}

{
similar with other template engine, interpolation is the most common part of rgl.
%
与常规的模板类似，插值是rgl中最常用模板元素
}


__Syntax__


`{Expression}`

###{text inteplation%文本插值}

{

if used as text-interpolation, regularjs will create a TextNode and set the value as the node's textContent.

%

对于文本插值, regularjs会创建一个textNode, 并建立与表达式的单向数据绑定.
}

__Example__

```js

var app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```

{
the example above will output `<div>leeluolee</div>`. once the data changes, the textNode's content will update at the same time. it is a __one-way__ binding.
%
上面的例子会输出`<div>leeluolee</div>`，并且一旦数据发生改变，文本节点内容也会发生改变
}




###{attribute inteplation%属性插值}

{
When used as attribute-interpolation(only the attributeValue can be interpolated).
%
对于属性节点插值，情况就要复杂一些了. regularjs目前仅允许值被插值, 这里面有几个说明要点.
}

<!-- t -->

1. if the value is a String but contains `{Expression}`, the string will be considered as a Expression. for example `'.modal-{klass} z-{state}'` is equals to `'.modal-' + klass + 'z-' + state` 

2. if the attribute is not a directive, once the value changes, the attribute's value will be updated immediately. it is a __one-way binding__.

3. if the attribute is a directive(include event), regularjs will call the directive's link method but do nothing else. all logic is controlled by directive self.

<!-- s -->

1. 具有插值`{}`,字符串会生成一个组合表达式，求值结果是这个字符串拼接后的计算值.如`.modal-{klass} z-{state}` 就相当于是 `'.modal-' + klass + 'z-' + state`

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

1. `r-model`: directive
2. `style`: string-interpolation
3. `class`: simple attribute interpolation
4. `type`: just normal attribute





<a href="#" name="composite"></a>
##{Composite component %内嵌组件}

All Component in regularjs is composite.





##{Rule%规则Rule}

<!-- t -->

the rest of  rgl's syntax elements are all Rule. 
<!-- s -->

严格来说，在插值之外的语法功能, 都由RULE ,　RULE的语法是`{#NAME }`

<!-- /t -->


__syntax__

`{#NAME ...}Block..{/NAME}`

or non-block (self-closed)

`{#NAME /}`


{
currently, rgl only have three rules: list, if/else/elseif and include. other rules maybe introduced in the future.
%
目前rgl中只有三种Rule: list, if/else/elseif 和 include. 如果需要，未来也可能提供其它Rule.
}


__Warn__
{
Rule and Xml should not breakup with each other. it is the biggest  difference between rgl and other string-based templates.
%
内建规则和xml标签不能被相互打断，如下例是不被允许会抛出异常. 这也是与常规的字符串模板的最大区别.　
}

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



##list

{
You can use the list rule to process a section of template for each variable contained within a sequence. The code between the start-tag and end-tag will be processed for the 1st subvariable, then for the 2nd subvariable, then for the 3rd subvariable, etc until it passes the last one. For each such iteration the loop variable will contain the current subvariable.
%
list指令用来遍历某个sequence来循环的处理某些重复性的结构
}


__Syntax >__: 

```html
{#list sequence as item}
  ...block...
{/list}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)


{

There are one special loop variables available inside the list loop:

- item_index: This is a numerical value that contains the index of the current item being stepped over in the loop(start with 0).
%

在每次循环都会创建一个临时变量代表当前下标

* `item_index`(取决于你的item命名): 代表当前遍历到的下标(从0开始, 类似与angular中的`$index`变量) 

}


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



{
###Warning

Every iteration, regularjs create anonymous component to store the `item`, `item_index`, but the data from component has been extended ( based on prototypal inheritance). so, if you directly rewrite the data outside, It will not works. Fortunately,  the `this` in list's section is still pointing to the component outside, so you can use `this` to get the correct component.
%
###注意点

list内部实现会在每次iterate时与angular类似会创建一个新的匿名组件(类似于ng-repeat中创建的子scope), 对外层数据的访问是通过原型继承的方式，所以修改原始类型的数据如字符，将不会对父组件产生影响，你可以通过引用类型的属性或函数调用来避免这个缺陷,　不过幸运的是， `this`仍然指向的是正确的组件.
}


__Example >__

```html
<!-- every iteration , regularjs will create a new Component, 
  then the `item`, `item_index` can be reserved -->

  
<div>username: {username}</div>
<div>user.name: {user.name}</div>
<p>LIST</p>
{#list items as item}
  <p>
    <a href='#' on-click={name = name + '1'}>
      name = name + '1': <b>don`t work</b>
    </a> 
  </p>
  <p>
  <a href='#' on-click={user.name = user.name + '2'}>
    user.name = user.name + '2': works with Referrence Data Type
  </a>
  </p>
  <p>
  <a href='#' on-click={this.changename()}> 
    this.changename(): works by call method
  </a>
  </p>
  <p>
    <a href='#' on-click={this.data.username= username + "1"}>
      this.data.name= name + "1": works by `this` 
    </a>
  </p>

{/list}
```

[【DEMO】](http://jsfiddle.net/leeluolee/nKK8D/light/)





##if/else/elseif

{
You can use if, elseif and else rule to conditionally skip a section of the template. The condition's value will be converted to boolean type. The elseif-s and else-s must occur inside if (that is, between the if start-tag and end-tag). If can contain any number of elseif-s (including 0), and one optionally else at the end.
%
与其它模板引擎(如freemarker)一样, regular也提供了`if`,`elseif`,`else`等语法元素提供对逻辑控制的支持

}

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
- condition: {Expression evaluates to a boolean value%判断条件，这个表达式结果会被强制转换为Boolean值}


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


###{use `if` to control attribute% 使用if控制属性 }

{
you can use `if` `else` `elseif` to control the attribute value.
%
你甚至可以使用逻辑控制符去控制你的属性
}


__Example__

```xml
<!-- control the attribute -->
<div {#if active == 'home'}data-home{/if}>Home</div>
<!-- control the event -->
<a {#if current < last} on-click={this.next()} {/if}>Next</a>

<!-- control the directive -->
<input {#if !disabled} r-model={username} {/if}>
```

If condition is evaluated to false, the affcted attribute, event listener and directive will be removed or destroyed;




##include

include specifies that the some content should be replaced with the interpolation of the template. 

__syntax__

```dust
{#include Expression}
```


__where__


{
* template: A Expression that evaluated to String or AST


`include` watch the Expression `template` , once the value changed, template will be recompiled. This feature provides two basic advantage:

1. pass partial template as param at initialize time.
2. make the paticular content dynamically

for example, generally speaking, the content of the modal is mutative. only header and footer are reusable.

%

* template: 一个Expression,求值结果是字符串或模板AST


动态引入会监听传入表达式template的数据变动, 每当变化时会重新编译template,并插入到制定位置, 它带来几个好处

1. 可以配置部分模板内容
2. 可以动态修改展现

其中1的意义要远大于2, 比如你实现一个modal弹窗组件，通常modal结构是固定的, 而内容区通常需后续指定, 这时候`include`就可以大展伸手了

}

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

【DEMO】


###*{Transclude with include %内嵌片段Transclude}

{
when use component in composite way, if you defined the `body`, it will become __transclude content__. 
%
当你以内嵌的方式使用组件时，加入你同时声明了body. 它会成为一个transcluded 内容. 如
}

for example

```html
<div>
  <modal>
    <input r-model={user} type=text>
    <input r-model={email} type=password>
  </modal>
</div>
```

<!-- t -->
the transcluded content `<input r-model={user} type=text><input r-model={email} type=password>` will be assigned as `$body` property  to `modal`.

it is equals to

<!-- s -->
transcluded片段 `<input r-model={user} type=text><input r-model={email} type=password>` 作为 `$body` 属性传入到`modal`组件.

它等同于
<!-- /t -->


```js
new Modal({
  $body: 
    "<input r-model={user} type=text>\
     <input r-model={email} type=password>"
  // ...
})
```

{

so, you can use transcluded content(`$body`) in Modal's template by using `include`.
%
所以你可以在Modal的模板使用`#include this.$body`来注入这段transcluded模板
}

```js

{#include this.$body}
```


[【DEMO】]()




##{Comment%注释}

two way to have comment

1. xml

  ```xml
  <!-- you comment -->
  ```
2. rgl

  ```xml
  {! you comment !}
  ```

