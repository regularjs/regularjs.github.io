# {Template Syntax % 模板语法}

[{Improve this page%完善此页} >](https://github.com/regularjs/blog/edit/master/source/_api/_docs/syntax.md)


{I will use `rgl` to represent the Regularjs's built template engine %以下简称Regularjs的模板为__rgl__}


<!-- t -->
<!-- s -->
<!-- /t -->

## {Expression%表达式}



<!-- t -->
<!-- s -->
rgl模板几乎完整的按ES5的规范实现了表达式,　这点你在国内其它mvvm框架中是无法享受到的(vuejs, avalon等).　由于表达式的支持，rgl事实上是一个富逻辑的模板，这个是动态模板的天然要求.

不过你仍然要注意几个要点

1. __表达式中的`this`指向组件本身, 所以你可以通过`this.xx`来调用组件的某个方法__
2. __数据根路径从component.data开始, 即`user` 其实获取的是`component.data.user`__
3. rgl不支持自增、自减(`++`,`--`)以及位操作符`&` `|`等
4. rgl不支持正则表达式的字面量
5. rgl开放了部分JS内建供使用:

  true false undefined null Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object String
<!-- /t -->



### {Error Ignore%错误抑制}

<!-- t -->
<!-- s -->
由于动态模板有别于常规模板的一次性，如果我们抛出所有xx of undefined的错误，整个系统会变得相当脆弱。所以Regularjs在语法解析阶段就抑制了相对安全的深层取值undefined的错误，并使用undefined代替.

```javascript

new Component({
  template: "<div>{blog.user.name}</div>"
})

// => <div></div>

```

需要注意的是，如果表达中带有函数调用，则函数调用部分，Regularjs会保留其出错信息, 因为function call内部的错误是无法受控制的. 

```javascript

new Component({
  template: "<div>{this.methodNoFound(blog.uer.name)}</div>"
})

```
其中blog.user.name部分的错误被抑制，而this.methodNoFound的undefined错误会被抛出.
<!-- /t -->

## {Interplation%插值}

与常规的模板类似，插值是rgl中最常用模板元素

插值

### {text inteplation%文本插值}

### {attribute inteplation%属性插值}

### {string inteplation%字符串插值}


## {Rule%规则}

严格来说，在插值之外的语法功能, 都由RULE ,　RULE的语法是`{#NAME }`, 后续我们提到的list等都隶属于RULE的一种，Regularjs虽然语法简单，但是由于表达式支持完备并且

## list

You can use the list rule to process a section of template for each variable contained within a sequence. The code between the start-tag and end-tag will be processed for the 1st subvariable, then for the 2nd subvariable, then for the 3rd subvariable, etc until it passes the last one. For each such iteration the loop variable will contain the current subvariable.




## if/else/elseif

```js
{#if Expression}
  block..
{#elseif Expression}
  block..
{/if}
```

## include

```js
{#include Expression}
```


## {Comment%注释}


## {bindonce%一次性绑定}: @(Expression)
