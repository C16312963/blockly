/** array of block declarations. Defines visual traits of block such as name, colour and connectors */
Blockly.defineBlocksWithJsonArray([
{
  "type": "alexa_speech",
  "message0": "speech output %1",
  "args0": [
    {
      "type": "input_value",
      "name": "SPEECH",
      "check": "String"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Causes Alexa to say the phrase in the attached text box. "
  +"Should be placed inside one of the trigger blocks",
  "helpUrl": ""
},
{
  "type": "alexa_invocationtrigger",
  "message0": "Invocation Trigger %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "HANDLER_CODE",
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Triggers when the Invocation (Skill name) is called. "
  +"The Invocation is specified when the Skill is created on the Amazon Developer Portal. "
  +"The blocks inside this block will run when this is triggered",
  "helpUrl": "https://developer.amazon.com/en-US/docs/alexa/custom-skills/"
  +"choose-the-invocation-name-for-a-custom-skill.html"
},
{
  "type": "alexa_structure",
  "message0": "Alexa Structure %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "ALEXA_CODE",
    }
  ],
  "colour": 230,
  "tooltip": "The starting point for an Alexa Skill. All blocks should be placed within this block",
  "helpUrl": ""
},
{
  "type": "alexa_intenttrigger",
  "message0": "Intent Trigger %1 %2",
  "args0": [
    {
      "type": "input_value",
      "name": "INTENT",
      "check": "String",
    },
    {
      "type": "input_statement",
      "name": "HANDLER_CODE",
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "Triggers when the specified Intent (triggering phrase) is called. "
  +"Intents are specified when the Skill is created on the Amazon Developer Portal. "
  +"The blocks inside this block will run when this is triggered",
  "helpUrl": "https://developer.amazon.com/en-US/docs/alexa/custom-skills/"
  +"create-intents-utterances-and-slots.html"
}
]);

var trigger = 0; // For counting the number of functions that need to be exported
var intentTriggers = 0; //For counting the number of intentTriggers, for naming purposes

Blockly.JavaScript['alexa_speech'] = function(block) {
  var argument0 = Blockly.JavaScript.valueToCode(block, 'SPEECH',
      Blockly.JavaScript.ORDER_ATOMIC) || '\'\''; 
  return '/**Alexa reads out the speech input*/ \r\n'
  +'    const speakOutput = ' + argument0 + ';\r\n'
  +'    return handlerInput.responseBuilder.speak(speakOutput).getResponse();\r\n'; 
};

Blockly.JavaScript['alexa_invocationtrigger'] = function(block) {
  trigger += 1; // increases the export count by 1
  var handler_code = Blockly.JavaScript.statementToCode(block, 'HANDLER_CODE'); 
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
  +' \r\n'; 
};

Blockly.JavaScript['alexa_structure'] = function(block) {
  trigger = 0;
  intentTriggers = 0;
  var alexa_code = Blockly.JavaScript.statementToCode(block, 'ALEXA_CODE');
  alexa_code = Blockly.JavaScript.addLoopTrap(alexa_code, block);
  code =  'const Alexa = require(\'ask-sdk-core\'); \r\n \r\n'
  +' var export_functions = []; \r\n'
  + alexa_code 
  + 'const skillBuilder = Alexa.SkillBuilders.custom();\r\n'
  +'exports.handler = skillBuilder\r\n'
  +'  .addRequestHandlers(\r\n';
  for(var i = 0; i < trigger; i += 1)
  {
    code += '    export_functions[' + i + '],\r\n';
  }
  code += '  )\r\n  .lambda();\r\n';
  return code; 
};

Blockly.JavaScript['alexa_intenttrigger'] = function(block) {
  intentTriggers += 1; // increments the names of the intentTriggers, e.g. intentTrigger1, intentTrigger2 etc
  trigger += 1; // increases the export count by 1
  var intent = Blockly.JavaScript.valueToCode(block, 'INTENT',
      Blockly.JavaScript.ORDER_FUNCTION_CALL) || '\'\''; 
  var handler_code = Blockly.JavaScript.statementToCode(block, 'HANDLER_CODE'); 
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
   return code;
};

