title: performance
layout: example
------------

# About  Performance 


Perhaps some people will worry about that regularjs is probably inefficient.

For that, we decide to introduce the test forked from [vuejs.org](vuejs.org), you will also find regularjs do fairly well on those test. Although regularjs is not designed to become the framework with best performance. the plan of optimization is also in our todolist now, we will do large work to make it competitive with other framework.

Finaly, just like Evan You Saying on [this pape](http://vuejs.org/perf/index.html)
>  The results here are merely for technical reference and do not reflect the user experience in real products.

Moreover, those tests actually is a little unfair because the focus of each frameworks is obviously different. for example,  angularjs may looks slowly in this test, but it is the most robust one and have much feature that others is not supported. vuejs is fast, but you need keep to its convention on `$watch`, beacuse callback isn't triggered directly after setter. 

__so please take easy to read the following test__

## Animation Performance

The benchmark was forked form [jsfiddle](http://jsfiddle.net/rich_harris/R9HRM/) to include Regularjs. 

<p data-height="400" data-theme-id="480" data-slug-hash="gDnxq" data-default-tab="result" class='codepen'>See the Pen <a href='http://codepen.io/leeluolee/pen/gDnxq/'>Performance Test</a> by leeluolee (<a href='http://codepen.io/leeluolee'>@leeluolee</a>) on <a href='http://codepen.io'>CodePen</a>.</p>


## Todomvc demo

Result is 10 runs average. testing is on my computer: Ubuntu 14.04 / i5-2450M CPU(2.50GHz)/ Memory 4GB / 500G.

You can also [test on your own computer](/perf/todomvc-benchmark/index.html)

__Chrome 32.0.1700.107__

```json
10 runs average:
{
  "Vue": 399.3999999947846,
  "Backbone": 1318.900000024587,
  "Knockout": 724.4000000064261,
  "Regular": 876.8999999738298,
  "Ember": 2359.1999999713153,
  "Angular": 2845.100000023376,
  "React": 1916.5999999968335,
  "Om": 829.500000004191,
  "Ractive": 2432.599999953527
}
See console output for more details.
```


__Firefox 28__

```json
10 runs average:
{
  "Vue": 257.334847599993,
  "Backbone": 804.8153442999974,
  "Knockout": 622.1618583000014,
  "Regular": 767.6420086999958,
  "Ember": 2079.0453040000016,
  "Angular": 1614.8467055000074,
  "React": 1152.1938196999977,
  "Om": 612.2738638000071,
  "Ractive": 1987.0603260000098
}
```


__without doubt, the framework that use async batch-update is efficient, e.g. vuejs, om(based on react) __.



