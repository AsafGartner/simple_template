
//var IR = parseHTML(" \
//<div id='id' class='some_class' checked='true'> \
  //Hello \
  //<span>test</span> \
  //<span>test</span> \
  //<input type='text' value='hello world' class='input_class' style='position: absolute; display: block;' exportName='input'> \
  //</input> \
  //Hello \
//</div>");

//console.log(IR);

//var generated = generateTemplateCode({
  //type: "tag",
  //tagName: "div",
  //attributes: {
    //id: "id",
    //"class": "some_class",
    //checked: "true"
  //},
  //children: [
    //{
      //type: "text",
      //text: "Hello"
    //},
    //{
      //type: "tag",
      //tagName: "input",
      //attributes: {
        //type: "text",
        //value: "hello world",
        //"class": "input_class",
        //style: "position: absolute; display: block;",
        //exportName: "input"
      //}
    //},
    //{
      //type: "text",
      //text: "Hello"
    //}
  //]
//});


//var generated = generateTemplateCode(IR);

//console.log(generated);
//eval("window.template = " + generated);

//var frag = window.template();
//document.body.appendChild(frag.root);




sharedVariables = {
        header: "Header",
        header2: "Header 2",
        header3: "Header 3",
        header4: "Header 4",
        header5: "Header 5",
        header6: "Header 6",
        list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    };

var IR = parseHTML("<div> <h1 class='header' exportName='header'></h1> <h2 class='header2' exportName='header2'></h2> <h3 class='header3' exportName='header3'></h3> <h4 class='header4' exportName='header4'></h4> <h5 class='header5' exportName='header5'></h5> <h6 class='header6' exportName='header6'></h6> <ul class='list' exportName='list'> </ul> </div>");

new Function(generateTemplateCode(parseHTML("<div> <h1 class='header' exportName='header'></h1> <h2 class='header2' exportName='header2'></h2> <h3 class='header3' exportName='header3'></h3> <h4 class='header4' exportName='header4'></h4> <h5 class='header5' exportName='header5'></h5> <h6 class='header6' exportName='header6'></h6> <ul class='list' exportName='list'> </ul> </div>")));
var template = new Function(generateTemplateCode(IR));

function setText(element, text) {
  element.appendChild(document.createTextNode(text));
}

// test
//
function test() {
  for (var loop = 0; loop < 10000; loop++) {
    var frag = var template();
    setText(frag.header, sharedVariables.header);
    setText(frag.header2, sharedVariables.header2);
    setText(frag.header3, sharedVariables.header3);
    setText(frag.header4, sharedVariables.header4);
    setText(frag.header5, sharedVariables.header5);
    setText(frag.header6, sharedVariables.header6);

    for (var i = 0, length = sharedVariables.list.length; i < length; ++i) {
      var el = document.createElement("li");
      el.className = "item";
      setText(el, sharedVariables.list[i]);
      frag.list.appendChild(el);
    }
    document.body.appendChild(frag.root);
  }
}
