/** 
 * Written by Kevin Stroughair
 * Defines the custom Alexa blocks
*/
Blockly.defineBlocksWithJsonArray([ //Defines the appearance of the blocks including connection types and inputs
{
  "type": "alexa_speech", //Name of block
  "message0": "speech output %1", //Message to be displayed on block along with number of inputs
  "args0": [ //Definition of each input
    {
      "type": "input_value", //Set the type that the input is. Determines the style of connector. Set to value since the input is a string
      "name": "SPEECH", //Name of the input
      "check": "String" //Makes sure that only a string can be connected to the input
    }
  ],
  "previousStatement": null, //Has a connector to connect to a block above with no restriction on block type
  "nextStatement": null, //Has a connector to connect to a block below with no restriction on block type
  "colour": 230,
  "tooltip": "Causes Alexa to say the phrase in the attached text box. "
  +"Should be placed inside one of the trigger blocks", //Displays a tooltip when curser is hovered over block
  "helpUrl": ""
},
{
  "type": "alexa_invocationtrigger", //Name of block
  "message0": "Invocation Trigger %1", //Message to be displayed on block along with number of inputs
  "args0": [ //Definition of each input
    {
      "type": "input_statement", //Set the type that the input is. Determines the style of connector. Set to statement since the input is blocks
      "name": "HANDLER_CODE", //Name of the input
    }
  ],
  "previousStatement": null, //Has a connector to connect to a block above with no restriction on block type
  "nextStatement": null, //Has a connector to connect to a block below with no restriction on block type
  "colour": 230,
  "tooltip": "Triggers when the Invocation (Skill name) is called. "
  +"The Invocation is specified when the Skill is created on the Amazon Developer Portal. "
  +"The blocks inside this block will run when this is triggered", //Displays a tooltip when curser is hovered over block
  "helpUrl": "https://developer.amazon.com/en-US/docs/alexa/custom-skills/"
  +"choose-the-invocation-name-for-a-custom-skill.html" //Takes the user to the given URL when the help button is pressed
},
{
  "type": "alexa_structure", //Name of block
  "message0": "Alexa Structure %1", //Message to be displayed on block along with number of inputs
  "args0": [  //Definition of each input
    {
      "type": "input_statement", //Set the type that the input is. Determines the style of connector. Set to statement since the input is blocks
      "name": "ALEXA_CODE", //Name of the input
    }
  ],
  "colour": 230,
  "tooltip": "The starting point for an Alexa Skill. All blocks should be placed within this block", //Displays a tooltip when curser is hovered over block
  "helpUrl": ""
},
{
  "type": "alexa_intenttrigger", //Name of block
  "message0": "Intent Trigger %1 %2", //Message to be displayed on block along with number of inputs
  "args0": [ //Definition of each input
    {
      "type": "input_value", //Set the type that the input is. Determines the style of connector. Set to value since the input is a string
      "name": "INTENT", //Name of the input
      "check": "String", //Makes sure that only a string can be connected to the input
    },
    {
      "type": "input_statement", //Set the type that the input is. Determines the style of connector. Set to statement since the input is blocks
      "name": "HANDLER_CODE", //Name of the input
    }
  ],
  "previousStatement": null, //Has a connector to connect to a block above with no restriction on block type
  "nextStatement": null, //Has a connector to connect to a block below with no restriction on block type
  "colour": 230,
  "tooltip": "Triggers when the specified Intent (triggering phrase) is called. "
  +"Intents are specified when the Skill is created on the Amazon Developer Portal. "
  +"The blocks inside this block will run when this is triggered", //Displays a tooltip when curser is hovered over block
  "helpUrl": "https://developer.amazon.com/en-US/docs/alexa/custom-skills/"
  +"create-intents-utterances-and-slots.html" //Takes the user to the given URL when the help button is pressed
}
]);

var trigger = 0; // For counting the number of functions that need to be exported
var intentTriggers = 0; //For counting the number of intentTriggers, for naming purposes

Blockly.JavaScript['alexa_speech'] = function(block) { //Code definition for alexa_speech block
  var argument0 = Blockly.JavaScript.valueToCode(block, 'SPEECH', //gathers up inputs into variable
      Blockly.JavaScript.ORDER_ATOMIC) || '\'\''; 
  return '/**Alexa reads out the speech input*/ \r\n'
  +'    const speakOutput = ' + argument0 + ';\r\n'
  +'    return handlerInput.responseBuilder.speak(speakOutput).getResponse();\r\n'; //returns the code for the alexa_speech block
};

Blockly.JavaScript['alexa_invocationtrigger'] = function(block) { //Code definition for alexa_invocationtrigger block
  trigger += 1; // increases the export count by 1
  var handler_code = Blockly.JavaScript.statementToCode(block, 'HANDLER_CODE'); //gathers up inputs into variable
  handler_code = Blockly.JavaScript.addLoopTrap(handler_code, block); 
  return '/**Opens handler function for a voice trigger*/ \r\n'
  +'const voiceTrigger = { \r\n'
  +'  canHandle(handlerInput) {\r\n'
  +'    const request = handlerInput.requestEnvelope.request;\r\n'
  +'    // checks request type\r\n'
  +'    return request.type === \'LaunchRequest\';\r\n'
  +'  },\r\n'
  +'  handle(handlerInput) {\r\n' 
  +     handler_code 
  + '  },\r\n'
  +'};\r\n'
  +'export_functions.push(voiceTrigger);\r\n'
  +' \r\n'; //returns the code for the alexa_invocationtrigger block
};

Blockly.JavaScript['alexa_structure'] = function(block) { //Code definition for alexa_structure block
  trigger = 0; //resets trigger to 0
  intentTriggers = 0; //resets intentTriggers to 0
  var alexa_code = Blockly.JavaScript.statementToCode(block, 'ALEXA_CODE'); //gathers up inputs into variable
  alexa_code = Blockly.JavaScript.addLoopTrap(alexa_code, block); 
  code =  'const Alexa = require(\'ask-sdk-core\'); \r\n \r\n'
  +' var export_functions = []; \r\n'
  + alexa_code 
  + 'const skillBuilder = Alexa.SkillBuilders.custom();\r\n'
  +'exports.handler = skillBuilder\r\n'
  +'  .addRequestHandlers(\r\n';
  for(var i = 0; i < trigger; i += 1) //Adds all of the elements added to the export_functions array
  {
    code += '    export_functions[' + i + '],\r\n';
  }
  code += '  )\r\n  .lambda();\r\n';
  return code; //returns the code for the alexa_structure block
};

Blockly.JavaScript['alexa_intenttrigger'] = function(block) { //Code definition for alexa_intenttrigger block
  intentTriggers += 1; // increments the names of the intentTriggers, e.g. intentTrigger1, intentTrigger2 etc
  trigger += 1; // increases the export count by 1
  var intent = Blockly.JavaScript.valueToCode(block, 'INTENT', //gathers up first input into variable
      Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\''; 
  var handler_code = Blockly.JavaScript.statementToCode(block, 'HANDLER_CODE'); //gathers up second input into variable
  handler_code = Blockly.JavaScript.addLoopTrap(handler_code, block);
  code = '/**Opens handler function for an intent trigger*/ \r\n'
  +'const Intent' + intentTriggers + 'Trigger = { \r\n'
  +'  canHandle(handlerInput) {\r\n'
  +'    const request = handlerInput.requestEnvelope.request;\r\n'
  +'    // checks request type\r\n'
  +'    return request.type === \'IntentRequest\'\r\n'
  +'    && request.intent.name === ' + intent + ';\r\n'
  +'  },\r\n'
  +'  handle(handlerInput) {\r\n' 
  +     handler_code 
  +'  },\r\n'
  +'};\r\n'
  +'export_functions.push(Intent' + intentTriggers + 'Trigger);\r\n \r\n'; 
   return code; //returns the code for the alexa_intenttrigger block
};

