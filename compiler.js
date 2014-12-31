// Takes an intermediate representation of the HTML template and returns
// a string that contains the function definition that recreates that HTML.
//
// IR format:
// element = {
//   type: "tag" | "text",
//
//   // for text type
//   text: string
//
//   // for tag type
//   tagName: string,
//   attributes: [{name: value}, ...], // name/values must be strings
//   children: [element, ...] // can be empty or null
// }
function generateTemplateCode(rootElement) {
  var context = createCompilationContext();

  emitVariableDeclaration(context, context.exportName, "{}");
  emitLine(context);

  var rootElementName = deepCompileElement(context, rootElement);
  emitExportVar(context, "root", rootElementName);

  emitLine(context);
  emitCommand(context, "return " + context.exportName);
  return context.code;
}

function createCompilationContext() {
  return {
    code: "",
    exportName: "domExports",
    exportedKeys: [],
    tempVarCount: 0,
    indent: 0
  };
}

function deepCompileElement(context, element) {
  var elementVarName = compileElement(context, element);
  var childElementName;
  if (element.children) {
    for (var i = 0, length = element.children.length; i < length; ++i) {
      emitLine(context);
      childElementName = deepCompileElement(context, element.children[i]);
      emitAppendChild(context, elementVarName, childElementName);
    }
  }
  return elementVarName;
}

function compileElement(context, element) {
  var tempVarName = emitNextTempVar(context);

  if (element.type == "tag") {
    var attrValue;

    emitCreateElement(context, tempVarName, element.tagName);

    if (element.attributes) {
      for (attrName in element.attributes) {
        if (element.attributes.hasOwnProperty(attrName)) {
          attrValue = element.attributes[attrName];
          switch (attrName) {
            case "id":
              emitSetId(context, tempVarName, attrValue);
              break;
            case "class":
              emitSetClassName(context, tempVarName, attrValue);
              break;
            case "value":
              emitSetValue(context, tempVarName, attrValue);
              break;
            case "exportName":
              emitExportVar(context, attrValue, tempVarName);
              break;
            default:
              emitSetAttribute(context, tempVarName, attrName, attrValue);
              break;
          }
        }
      }
    }
  } else if (element.type == "text") {
    emitCreateTextNode(context, tempVarName, element.text);
  } else {
    throw new Error("Unknown element type: " + element.type);
  }

  return tempVarName;
}

function emitNextTempVar(context, value) {
  var varName = "temp" + context.tempVarCount;
  context.tempVarCount++;
  emitVariableDeclaration(context, varName, value);
  return varName;
}

function emitCreateElement(context, varName, tagName) {
  emitCommand(context, varName + " = document.createElement(" + str(tagName) + ")");
}

function emitCreateTextNode(context, varName, text) {
  emitCommand(context, varName + " = document.createTextNode(" + str(text) + ")");
}

function emitSetClassName(context, varName, className) {
  emitCommand(context, varName + ".className = " + str(className));
}

function emitSetValue(context, varName, value) {
  emitCommand(context, varName + ".value = " + str(value));
}

function emitSetId(context, varName, id) {
  emitCommand(context, varName + ".id = " + str(id));
}

function emitSetAttribute(context, varName, attributeKey, attributeValue) {
  emitCommand(context, varName + ".setAttribute(" + str(attributeKey) + ", " + str(attributeValue) + ")");
}

function emitAppendChild(context, parentName, childName) {
  emitCommand(context, parentName + ".appendChild(" + childName + ")");
}

function emitExportVar(context, elementExportName, varName) {
  validateExportKey(context, elementExportName);
  context.exportedKeys.push(elementExportName);
  emitCommand(context, context.exportName + "." + elementExportName + " = " + varName);
}

function emitVariableDeclaration(context, varName, value) {
  var cmd = "var " + varName;
  if (value !== undefined) {
    cmd += " = " + value;
  }
  emitCommand(context, cmd);
}

function emitCommand(context, text) {
  emitLine(context, text + ";");
}

function emitLine(context, text) {
  if (text) {
    context.code += indent(context.indent) + text + "\n";
  } else {
    context.code += "\n";
  }
}

function indent(amount) {
  var result = "";
  for (var i = 0; i < amount; ++i) {
    result += "\t";
  }
  return result;
}

function str(text) {
  return "\"" + text + "\"";
}

function validateExportKey(context, exportKey) {
  for (var i = 0, length = context.exportedKeys.length; i < length; ++i) {
    if (context.exportedKeys[i] == exportKey) {
      throw new Error("Export key \"" + exportKey + "\" used more than once");
    }
  }
}

