/**
 * regularjs 
 * @return {[type]} [description]
 */
void function slogan(){
  var h2 = document.getElementById('slogan');  


  var Demo = Regular.extend({
    data: {}
  })
  var html_editor = CodeMirror($('#demo-html')[0], {
    value: $('#example').html().trim(),
    mode:  "xml",
    theme: "solarized",
    extraKeys: {
      Tab: function(cm) {
          var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ")
          cm.replaceSelection(spaces, "end", "+input")
      }
    }
  });
  var js_editor_1 = CodeMirror($('#demo-js-1')[0], {
    value: "var App = Regular.extend({\n  template:'#example', \n",
    mode:  "javascript",
    theme: "solarized",
    readOnly: 'nocursor',
    extraKeys: {
      Tab: function(cm) {
          var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ")
          cm.replaceSelection(spaces, "end", "+input")
      }
    }
  }); 
  var js_editor = CodeMirror($('#demo-js')[0], {
    value: 
      "login: function(){\n this.data.username = prompt('input username', '')\n return false\n},\nadd: function(draft){\n var data = this.data;\n data.todos.push({content: draft});\n data.draft = '';\n},\nremove: function(index){\n var data = this.data;\n  data.todos.splice(index, 1);\n return false;\n}",
    mode:  "javascript",
    theme: "solarized",
    extraKeys: {
      Tab: function(cm) {
          var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ")
          cm.replaceSelection(spaces, "end", "+input")
      }
    }
  });
  var js_editor_3 = CodeMirror($('#demo-js-3')[0], {
    value: "})\napp = new App({data: {todos: []}}).inject('#demo-view')",
    mode:  "javascript",
    theme: "solarized",
    readOnly: 'nocursor',
    extraKeys: {
      Tab: function(cm) {
          var spaces = new Array(cm.getOption("indentUnit") + 1).join(" ")
          cm.replaceSelection(spaces, "end", "+input")
      }
    }
  });


  var App = Regular.extend({
    template: "#example",
    data: {todos: []},
    login: function(){
      this.data.username = prompt("please enter you username", "")
      return false;
    },
    add: function(draft){
      var data = this.data;
      data.todos.push({content: draft});
      data.draft = "";
    },
    remove: function(index){
      var data = this.data;
      data.todos.splice(index, 1);
      return false; 
    }
  })

  app = new App().inject('#demo-view')
  Regular.dom.on($('.j-run')[0], 'click' ,function(ev){
    ev.preventDefault();
    runDemo();
  })

  var prefix = js_editor_1.getValue();
  var suffix = js_editor_3.getValue();
  function runDemo(){
    app.destroy();
    $('#example').html(html_editor.getValue());
    var code = [prefix, js_editor.getValue(), suffix ].join("\n")

    eval(code);
  }

}()

