# Template Syntax 

[Improve this page >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/syntax.md)


I will use `rgl` to represent the Regularjs's built template engine 


> Take easy, syntax is very simple 


##Expression


###ES5 Expression

<!-- t -->

Expression are usually placed in bindings such as 

1. interpolation: `{ Expression }`
2. rule: `{#list Expression as item}` , `{#if Expression}`...

and also can be used in some method like `$watch`,`$get`, `$update`


rgl almost implement the Expressions of ES5 specification

For example, these are valid expressions in regularjs:




- 100 + 'b'.
- user? 'login': 'logout'
- title = title + '1'
- !isLogin && this.login()
- items[index][this.nav(item.index)].method1()



Tips:

1. keyword `this` points to the component.
2. the root of the data is component.data. so `user` in Expression equals to 'component.data.user'
3. regular don't support prefix, postfix and bitwise operation(e.g. `++`,`--`, `&`)
4. literal regexp is not supported
5. you can directly use some global Object like:



  - Array Date JSON Math NaN RegExp Object String
  - decodeURI decodeURIComponent encodeURI encodeURIComponent 
  - parseFloat parseInt 



Beside ES5 Expression, regularjs also support some useful Expression type. I will introduce them in following sections.



<a id="bind-once"></a>

###Bindonce Expression


Beacuse the dirty-check's performance is tightly related to the counts of the data-binding, the less binding is created, the better.

regularjs provide `BindOnce Expression` to help developer to control the binding more easily.

Once the Expression is evalauted to value that isn't equals to `undefined`, the binding attached to it will be destroied by [component.$unwatch](?api-en#unwatch)


__syntax__

`@(Expression)`


Bindonce Expression is valid Expression in rgl , so you can use it in any Expression environment(`list`, `if`... etc)


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


you can also use `@()`  in `$watch` .


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


As shown above, binding-once __may make the data not synchronized with the ui__. you should use it carefully.






<a id="filter"></a>
###Filter

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



__regularjs is also support advanced usage , like two-way filter,see [Component.filter](?api-en#two-way-filter) for Detail__





###Range


regularjs support a special Type —— range. it is a shortcut to create Array.



__Syntax__: 

` start..end `

__where__

* start: A expression evaluted to number means range's start
* end:  A expression evaluted to number means range's end




`1..3 === [1,2,3]`




###Error suppression

<!-- t -->

regularjs suppress some safe exception to help system works as expected. For example



```js

new Component({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```


But if any function(undefined or any error occurs after calling) is called, the error will be still throwed. 



```javascript

new Component({
  template: "<div>{this.methodNoFound(blog.user.name)}</div>"
})


error throw by the Expression `blog.user.name` is ignored, 

but this.methodNoFound(...)` still throw  "Uncaught TypeError: undefined is not a function "


```





<a id="interpolation"></a>
##Interpolation


similar with other template engine, interpolation is the most common part of rgl.



__Syntax__


`{Expression}`

###text interpolation



if used as text-interpolation, regularjs will create a TextNode and set the value as the node's textContent.



__Example__

```js

var app = new Regular({
  template: "<div>{username}</div>",
  data: {username: 'leeluolee'}
});

app.$inject('#app');


```


the example above will output `<div>leeluolee</div>`. once the data changes, the textNode's content will update at the same time. it is a __one-way__ binding.





###attribute interpolation


When used as attribute-interpolation(only the attributeValue can be interpolated).


<!-- t -->

1. if the value is a String but contains `{Expression}`, the string will be considered as a Expression. for example `'.modal-{klass} z-{state}'` is equals to `'.modal-' + klass + 'z-' + state` 

2. if the attribute is not a directive, once the value changes, the attribute's value will be updated immediately. it is a __one-way binding__.

3. if the attribute is a directive(include event), regularjs will call the directive's link method but do nothing else. all logic is controlled by [directive](?api-en#directive) self.








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

##nested component 



during compiling(AST-> DOM) phase, every time rgl saw a tagName, for example (assume that `custom-pager` has been registered yet) 


- `<custom-pager attr1={user} attr2=user on-nav={this.nav()}></custom-pager>` 
- `<div class="text" r-hide={!text}></div>`



The process will be performed as follows:

  - detect whether the component has been registered
  - if true (like `custom-pager`), we will consider it as a nested component
    1. create a plainObject `data`
    2. if has children(AST), it will be passed into nested component as the [$body](#transclude) property, you can use it  through [`#include`](#include) .
    3. traversing the attribute list
      - if attrbuteName isn't  eventType (prefix `on-` ), `rgl` will merge it to `data`, if the attributeValue is a Interpolation, a __two-way binding__ will be created between it and external component 
      - if attributeName is a Event, rgl will register specified event.
    4. initialize the nested component with `data`.
    5. inject it to extenal component
  - if not registered yet. rgl will consider it as a normal dom element (no matter it is a valid htmltag or not).
    1. create a element by `document.createElement(tagName)`
    2. compiling its content
    3. traversing the attribute list
      1. if attributeName is `on-xx`: register dom event.
      2. if attribute is a registered [directive](?api-en#directive): call specifed `directive.link` to operate.
      3. otherwise, setAttribute. if attributeName is a Intepolation, create __one-way binding__ 
    4. inject element to extenal component.





- __For Example__

  
  in the template of the component named `external`
  

  ```html
  <pager current={current} total=100 
    on-nav={this.hello()} 
    on-end='end' />
  ```

  
  which is equals to: 
  
  

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

  
  the way regularjs dealing with component's event  is very similar with dom event. the only difference is: the `$event` param represent the 2nd params that you passed to function `$emit`.
  



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








##Rule

<!-- t -->

the rest of  rgl's syntax elements are all Rule. 



__syntax__

`{#NAME ...}Block..{/NAME}`

or non-block (self-closed)

`{#NAME /}`



currently, rgl only have three rules: list, if/else/elseif and include. other rules maybe introduced in the future.



__Warn__

Rule and Xml should not breakup with each other. it is the biggest  difference between rgl and other string-based templates.


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


You can use the list rule to process a section of template for each variable contained within a sequence. The code between the start-tag and end-tag will be processed for the 1st subvariable, then for the 2nd subvariable, then for the 3rd subvariable, etc until it passes the last one. For each such iteration the loop variable will contain the current subvariable.



__Syntax >__: 

```html
{#list sequence as item}
  ...block...
{/list}

```

__where__

* sequence: Expressions evaluates to a sequence or collection
* item: Name of the loop variable (not an expression)




There are one special loop variables available inside the list loop:

- item_index: This is a numerical value that contains the index of the current item being stepped over in the loop(start with 0).



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


You can use if, elseif and else rule to conditionally skip a section of the template. The condition's value will be converted to boolean type. The elseif-s and else-s must occur inside if (that is, between the if start-tag and end-tag). If can contain any number of elseif-s (including 0), and one optionally else at the end.


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
- condition: Expression evaluates to a boolean value


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


###use `if` to control attribute


you can use `if` `else` `elseif` to control the attribute value.



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




[【Demo】](http://codepen.io/leeluolee/pen/JqAaH)




<a name="include"></a>
##include



include specifies that the some content should be replaced with the interpolation of the template. 


__syntax__

` {#include template} `


__where__



* template: A Expression that evaluated to String or AST


`include` watch the Expression `template` , once the value changed, template will be recompiled. This feature provides two basic advantage:

1. pass partial template as param at initialize time.
2. make the paticular content dynamically

for example, generally speaking, the content of the modal is mutative. only header and footer are reusable.



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





##Comment

two way to have comment

1. xml

  ```xml
  <!-- you comment -->
  ```
2. rgl

  ```xml
  {! you comment !}
  ```


