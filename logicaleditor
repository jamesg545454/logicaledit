/*
Studio One Midi Logial Editor version 1.0

Author Info
Email: mailto:expressmix@att.net
Studio One User Forum Profile: https://forums.presonus.com/memberlist.php?mode=viewprofile&u=282

Credits:
Thanks to Narech Kontcell for discovering some of the methods being used here that allow these edits to happen.
http://narechk.net/

*/

const kPackageID = "lawrence.logical.editor";
var MaxVelocity;


function performTask()
{
this.interfaces =
[
Host.Interfaces.IController,
Host.Interfaces.IParamObserver,
Host.Interfaces.IObserver,
Host.Interfaces.IEditTask
]; 

this.paramChanged = function (param)
{
if (param.name == "buttonRestore")
{
if (this.originalSelection.length > 0)
{

this.context.editor.selection.unselectAll();
let selectFunctions = this.context.editor.createSelectFunctions(this.context.functions);
selectFunctions.executeImmediately = true;
selectFunctions.selectMultiple(this.originalSelection);
this.context.editor.selection.showHideSuspended = false;
this.context.editor.showSelection(true);
}
}

if (param.name == "selectOnlyChk")
{
this.compressVelocityChk.setValue(0);
this.randomVelocityChk.setValue(0);
}

if (param.name == "randomVelocityChk")
{
if (this.randomVelocityChk.value == 1)
{
this.compressVelocityChk.setValue(0);
this.selectOnlyChk.setValue(0);
}
}

if (param.name == "compressVelocityChk")
{
if (this.compressVelocityChk.value == 1)
{
this.randomVelocityChk.setValue(0);
this.selectOnlyChk.setValue(0);
}
}

if (param.name == "randomHighVelocity")
{
if (this.randomHighVelocity.value < this.randomLowVelocity.value)
{
this.randomHighVelocity.value = this.randomLowVelocity.value
}
}

if (param.name == "randomLowVelocity")
{
if (this.randomLowVelocity.value > this.randomHighVelocity.value)
{
this.randomLowVelocity.value = this.randomHighVelocity.value
}
}

if (param.name == "buttonStoreDefault")
{
this.saveValuesToFile();
}

//-----------------------------------------------------------------------------
if (param.name == "buttonExecuteEdit")
{
this.filterAry = [];

var context = this.context
var editor = context.editor;
var iterator = context.iterator;
var functions = context.functions;

if (!editor || !iterator || !functions)
return Host.Results.kResultFailed;

context.functions.executeImmediately = true;

context.editor.showSelection(false);
context.editor.selection.showHideSuspended = true; 

iterator.first();

// ***********************************************************************************************************
// BEGIN PARSING EDITING OPTIONS
// ***********************************************************************************************************
switch (this.editOption.string)
{
case "1":

while (!iterator.done())
{
var event = iterator.next();

// ------------------------------------------------------------------------
if (this.Pitch1.value == event.pitch)
{
this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch)
{
functions.modifyPitch(event, value); continue;
}

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }
if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }
if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}
continue;
}

if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
}
}

// ------------------------------------------------------------------------
if (this.Pitch2.value == event.pitch)
{
this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch) { functions.modifyPitch(event, value); }

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }
if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }
if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}
continue;
}

if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
} 
}
// ------------------------------------------------------------------------
if (this.Pitch3.value == event.pitch)
{
this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch) { functions.modifyPitch(event, value); }

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }

if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}
continue;
}

if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
} 
}
}
break;

//----------------------------------------------------------------------------- 
case "2":

while (!iterator.done())
{
var event = iterator.next();

if ( event.pitch > this.Pitch4.value && 
event.pitch < this.Pitch5.value &&
event.velocity <= this.Velocity1.value )
{

this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch) { functions.modifyPitch(event, value); }

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127) ; continue; }

if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127) ; continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}

}


if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
}
}
}
break;

//-----------------------------------------------------------------------------
case "3":

while (!iterator.done())
{
var event = iterator.next();

if ( event.pitch > this.Pitch6.value &&
event.pitch < this.Pitch7.value &&
event.velocity >= this.Velocity2.value )

{
this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch) { functions.modifyPitch(event, value); }

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }

if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}
continue;
}

if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
}
}

}
break;

//-----------------------------------------------------------------------------
case "4":
while (!iterator.done())
{
var event = iterator.next();

if ( event.pitch > this.Pitch8.value &&
event.pitch < this.Pitch9.value &&
event.velocity >= this.Velocity3.value &&
event.velocity <= this.Velocity4.value )
{
this.filterAry.push(event);

value = this.getNewPitch(event.pitch);
if (value != event.pitch) { functions.modifyPitch(event, value); }

if (this.randomVelocityChk.value == 1)
{
var value = this.getRandomVelocity();
functions.modifyVelocity(event, value);
continue;
}

if (this.compressVelocityChk.value == 1)
{

if (MaxVelocity == 127)
{
if (event.velocity < (this.compressLowVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }

if (event.velocity > (this.compressHighVelocity.value / 127))
{ functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
}

if (MaxVelocity == 1)
{
if (event.velocity < (this.compressLowVelocity.value))
{ functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

if (event.velocity > (this.compressHighVelocity.value))
{ functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
}
continue;
}

if (this.changeVelocity.value != 0)
{
value = this.getVelocity(event.velocity);
functions.modifyVelocity(event, value);
continue;
}
}
}
break;
}

// if select only is checked, select items in this array
if (this.selectOnlyChk.value == 1 && this.filterAry.length > 0)
{
context.editor.selection.unselectAll(); 
let selectFunctions = this.context.editor.createSelectFunctions(context.functions);
selectFunctions.executeImmediately = true;
selectFunctions.selectMultiple(this.filterAry); 
}
//-------------------------------------- END SWITCH ------------------------------------------------------------
context.editor.selection.showHideSuspended = false;
context.editor.showSelection(true);


} // --- close buttonExecuteEdit 
} //--------------------------------------- close this.Parameter.Changed ------------------------------------------


// ***********************************************************************************************************
// EDIT HELPER FUNCTIONS
// ***********************************************************************************************************

function msg(value)
{
Host.GUI.alert(String(value));
}
function Msg(value)
{
Host.GUI.alert(value);
}

this.getNewPitch = function (eventPitch)
{
var value = eventPitch + this.changePitch.value
if (value > 127) { value = 127; }
if (value < 0) { value = 0; }
return value;
}

//---------------------------------------------------------------------------------------------
this.getVelocity = function (eventVelocity)
{
// msg("getVelocity:" + eventVelocity)
if (MaxVelocity == 127) { var value = eventVelocity + this.changeVelocity.value / 127 }
if (MaxVelocity == 1) { var value = (eventVelocity + (this.changeVelocity.value / 100)) }
if (value > 127) { value = 127; }
if (value < 0) { value = 0; }
return value;
}

//--------------------------------------------------------------------------------------------
this.getRandomVelocity = function ()
{
if (MaxVelocity == 127)
{
var RandVel = Math.floor((Math.random() *
(this.randomHighVelocity.value - this.randomLowVelocity.value)
+ this.randomLowVelocity.value))
return RandVel / 127;
}

if (MaxVelocity == 1)
{
var RandVel = (Math.random() *
((this.randomHighVelocity.value) - (this.randomLowVelocity.value))
+ (this.randomLowVelocity.value))
return RandVel;
}
}

// ***********************************************************************************************************
// FILE FUNCTIONS
// ***********************************************************************************************************
this.getEditFile = function ()
{
return Host.Url("local://$USERCONTENT/logicaledit.txt");
}

// ----------------------------------------------------------------
this.saveValuesToFile = function ()
{
editValues = new Array;

editValues.push(String(this.Pitch1.value));
editValues.push(String(this.Pitch2.string));
editValues.push(String(this.Pitch3.string));
editValues.push(String(this.Pitch4.string));
editValues.push(String(this.Pitch5.string));
editValues.push(String(this.Pitch6.string));
editValues.push(String(this.Pitch7.string));
editValues.push(String(this.Pitch8.string));
editValues.push(String(this.Pitch9.string));
editValues.push(String(this.Velocity1.value));
editValues.push(String(this.Velocity2.value));
editValues.push(String(this.Velocity3.value));
editValues.push(String(this.Velocity4.value));

var path = this.getEditFile();
var textFile = Host.IO.createTextFile(path);

if (textFile)
{
var count = editValues.length;
for (let i = 0; i < count; i++)
{
//Host.GUI.alert("ok");
var item = editValues[i];
textFile.writeLine(item);
}

textFile.close();
}
}

//--------------------------------------------------------
this.loadValuesFromFile = function ()
{
var path = this.getEditFile();

// open the target file
let editFile = Host.IO.openTextFile(path);

if (editFile)
{
var editValues = new Array;
while (!editFile.endOfStream)
{
var curItem = editFile.readLine();
editValues.push(curItem);
}
}
else
{
return;
}

if (editValues.length >= 13)
{
this.Pitch1.value = editValues[0]
this.Pitch2.string = editValues[1]
this.Pitch3.string = editValues[2]
this.Pitch4.string = editValues[3]
this.Pitch5.string = editValues[4]
this.Pitch6.string = editValues[5]
this.Pitch7.string = editValues[6]
this.Pitch8.string = editValues[7]
this.Pitch9.string = editValues[8]
this.Velocity1.value = editValues[9]
this.Velocity2.value = editValues[10]
this.Velocity3.value = editValues[11]
this.Velocity4.value = editValues[12]
}

editFile.close();
}

//----------------------------------------------------------------------------------------------------
this.prepareEdit = function (context)
{
this.filterAry = new Array;

this.pitchFormatter = Host.Engine.createFormatter("Media.MusicNote");
this.velocityFormatter = Host.Engine.createFormatter("Media.MusicVelocity");

this.paramList = Host.Classes.createInstance("CCL:ParamList");
this.paramList.controller = this;

this.paramList.addMenu("presetMenu");

this.editOption = this.paramList.addList("editOption");
this.editOption.appendString("1");
this.editOption.appendString("2");
this.editOption.appendString("3");
this.editOption.appendString("4");

// OR condition edit boxes

this.Pitch1 = this.paramList.addInteger(-1, 127, "Pitch1");
this.Pitch1.setFormatter(this.pitchFormatter);
this.Pitch1.value = -1;

this.Pitch2 = this.paramList.addInteger(-1, 127, "Pitch2");
this.Pitch2.setFormatter(this.pitchFormatter);
this.Pitch2.value = -1;

this.Pitch3 = this.paramList.addInteger(-1, 127, "Pitch3");
this.Pitch3.setFormatter(this.pitchFormatter);
this.Pitch3.value = -1;


// second condition edit boxes
this.Pitch4 = this.paramList.addInteger(-1, 127, "Pitch4");
this.Pitch4.setFormatter(this.pitchFormatter);
this.Pitch4.value = -1;

this.Pitch5 = this.paramList.addInteger(-1, 127, "Pitch5");
this.Pitch5.setFormatter(this.pitchFormatter);
this.Pitch5.value = -1;

this.Pitch6 = this.paramList.addInteger(-1, 127, "Pitch6");
this.Pitch6.setFormatter(this.pitchFormatter);
this.Pitch6.value = -1;

this.Pitch7 = this.paramList.addInteger(-1, 127, "Pitch7");
this.Pitch7.setFormatter(this.pitchFormatter);
this.Pitch7.value = -1;


// second condition edit boxes
this.Pitch8 = this.paramList.addInteger(-1, 127, "Pitch8");
this.Pitch8.setFormatter(this.pitchFormatter);
this.Pitch8.value = -1;

this.Pitch9 = this.paramList.addInteger(-1, 127, "Pitch9");
this.Pitch9.setFormatter(this.pitchFormatter);
this.Pitch9.value = -1;

if (Host.studioapp.find("Application").Configuration.getValue("Engine.Editing", "midiValuePresentationEnabled"))
{
MaxVelocity = 127;
this.Velocity1 = this.paramList.addInteger(0, MaxVelocity, "Velocity1");
this.Velocity1.value = MaxVelocity;

this.Velocity2 = this.paramList.addInteger(0, MaxVelocity, "Velocity2");
this.Velocity2.value = 0;

this.Velocity3 = this.paramList.addInteger(0, MaxVelocity, "Velocity3");
this.Velocity3.value = 0;

this.Velocity4 = this.paramList.addInteger(0, MaxVelocity, "Velocity4");
this.Velocity4.value = MaxVelocity; 

this.randomLowVelocity = this.paramList.addInteger(0, MaxVelocity, "randomLowVelocity");
this.randomLowVelocity.value = 0;

this.randomHighVelocity = this.paramList.addInteger(0, MaxVelocity, "randomHighVelocity");
this.randomHighVelocity.value = MaxVelocity;

this.compressLowVelocity = this.paramList.addInteger(0, MaxVelocity, "compressLowVelocity");
this.compressLowVelocity.value = 0;

this.compressHighVelocity = this.paramList.addInteger(0, MaxVelocity, "compressHighVelocity");
this.compressHighVelocity.value = MaxVelocity;

this.changeVelocity = this.paramList.addInteger(-127 , 127, "changeVelocity");
this.changeVelocity.setValue(0);
}
else
{
MaxVelocity = 1;
this.Velocity1 = this.paramList.addFloat(0, 1, "Velocity1");
this.Velocity1.setFormatter(this.velocityFormatter);
this.Velocity1.value = 1;

this.Velocity2 = this.paramList.addFloat(0, 1, "Velocity2");
this.Velocity2.setFormatter(this.velocityFormatter);
this.Velocity2.value = 0;

this.Velocity3 = this.paramList.addFloat(0, 1, "Velocity3");
this.Velocity3.setFormatter(this.velocityFormatter);
this.Velocity3.value = 1;

this.Velocity4 = this.paramList.addFloat(0, 1, "Velocity4");
this.Velocity4.setFormatter(this.velocityFormatter);
this.Velocity4.value = 0;


this.randomLowVelocity = this.paramList.addFloat(0, 1, "randomLowVelocity");
this.randomLowVelocity.setFormatter(this.velocityFormatter);
this.randomLowVelocity.value = 0;

this.randomHighVelocity = this.paramList.addFloat(0, 1, "randomHighVelocity");
this.randomHighVelocity.setFormatter(this.velocityFormatter);
this.randomHighVelocity.value = 1;

this.compressLowVelocity = this.paramList.addFloat(0, 1, "compressLowVelocity");
this.compressLowVelocity.setFormatter(this.velocityFormatter);
this.compressLowVelocity.value = 0;

this.compressHighVelocity = this.paramList.addFloat(0, 1, "compressHighVelocity");
this.compressHighVelocity.setFormatter(this.velocityFormatter);
this.randomHighVelocity.value = 1;

this.changeVelocity = this.paramList.addInteger(-100 , 100, "changeVelocity");
this.changeVelocity.setValue(0);
}

this.buttonStoreDefault = this.paramList.addInteger(0, 1, "buttonStoreDefault");
this.buttonRestore = this.paramList.addInteger(0, 1, "buttonRestore");
this.buttonExecuteEdit = this.paramList.addInteger(0, 1, "buttonExecuteEdit");

this.changePitch = this.paramList.addInteger(-60, 60, "changePitch");
this.changePitch.setValue(0);

this.selectOnlyChk = this.paramList.addInteger(0, 1, "selectOnlyChk");
this.selectOnlyChk.value = 0;

this.compressVelocityChk = this.paramList.addInteger(0, 1, "compressVelocityChk");
this.compressVelocityChk.setValue(0);

this.randomVelocityChk = this.paramList.addInteger(0, 1, "randomVelocityChk");
this.randomVelocityChk.setValue(0); 

// load the default setup from file if exists
this.loadValuesFromFile();

return Host.Results.kResultOk;
}

this.performEdit = function (context)
{
this.context = context;
var iterator = context.iterator;

// hold all event references for restore
this.originalSelection = new Array;
while(!iterator.done())
{
var event = iterator.next()
this.originalSelection.push(event)
}

context.functions.executeImmediately = true;
Host.GUI.runDialog(Host.GUI.Themes.getTheme(kPackageID), "LogicalEditor", this);

return Host.Results.kResultOk;
}
}

function beginEdit()
{
return new performTask;
}








