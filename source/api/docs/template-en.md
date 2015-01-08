# Regularjs Template

I will use `rgl` to represent the Regularjs's built template engine 

<!-- t -->


## Expression



<!-- t -->




### Error Ignore

<!-- t -->


## Interplation

与常规的模板类似，插值是rgl中最常用模板元素

插值

### text inteplation

### attribute inteplation

### string inteplation


## Rule

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


## Comment


## bindonce: @(Expression)
