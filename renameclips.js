/* 
    This script and it's accompanying xml form brings more flexible clip
    series numeric renaming to Studio One.
*/

const kPackageID = "audiocave.logical.editor";

function performTask() {

        this.interfaces =
                [
                        Host.Interfaces.IController,
                        Host.Interfaces.IParamObserver,
                        Host.Interfaces.IEditTask
                ];

        this.paramChanged = function (param) {

                if (param.name == "buttonApply") {
                
                        var context = this.context
                        var editor = context.editor;
                        var iterator = context.iterator;
                        var functions = context.functions;
                        context.functions.executeImmediately = true;
                       
                        iterator.first();

                        switch (this.renameOption.string) {

                                case "none":                                      
                                        while (!iterator.done()) {
                                                var event = iterator.next()
                                                functions.renameEvent(event, this.newName.string);
                                        }

                                        break;

                                case "Prefix":                                       
                                        var clips = new Array();
                                        while (!iterator.done()) {                                               
                                                var clip = iterator.next()
                                                clips.push(clip);                                              
                                        }        

                                        // for some unknown reason the iteration above results in
                                        // the numeric series being reversed, so throw it into an 
                                        // array and reverse the array then iterate the array.
                                        clips.reverse();

                                        for (i = 0; i < clips.length; i++){
                                                functions.renameEvent(clips[i], (i + 1) + " - " + this.newName.string);
                                        }
                                        break;

                                case "Num":
                                        var clips = new Array();
                                        while (!iterator.done()) {                                               
                                                var clip = iterator.next()
                                                clips.push(clip);                                              
                                        }        

                                        clips.reverse();

                                        for (i = 0; i < clips.length; i++){
                                                functions.renameEvent(clips[i],  this.newName.string + " " + (i + 1) );
                                        }
                                        break;        
                                case "DashNum":
                                        var clips = new Array();
                                        while (!iterator.done()) {                                               
                                                var clip = iterator.next()
                                                clips.push(clip);                                              
                                        }        

                                        clips.reverse();

                                        for (i = 0; i < clips.length; i++){
                                                functions.renameEvent(clips[i],  this.newName.string + " - " + (i + 1) );
                                        }
                                        break; 

                                case "Paren":
                                        var clips = new Array();
                                        while (!iterator.done()) {                                               
                                                var clip = iterator.next()
                                                clips.push(clip);                                              
                                        }        

                                        clips.reverse();

                                        for (i = 0; i < clips.length; i++){
                                                functions.renameEvent(clips[i],  this.newName.string + " (" + (i + 1) +")" );
                                        }
                                        break;      
                        }
                }

        }

        this.prepareEdit = function (context) {
                this.paramList = Host.Classes.createInstance("CCL:ParamList");
                this.paramList.controller = this;

                this.newName = this.paramList.addString("New Name");

                // radio buttons
                this.renameOption = this.paramList.addList("renameOption");
                this.renameOption.appendString("none");
                this.renameOption.appendString("Prefix");
                this.renameOption.appendString("Num");
                this.renameOption.appendString("DashNum");
                this.renameOption.appendString("Paren");
                
                // Apply button
                this.buttonApply = this.paramList.addInteger(0, 1, "buttonApply");
        }

        this.performEdit = function (context) {
                this.context = context;
                Host.GUI.runDialog(Host.GUI.Themes.getTheme(kPackageID), "RenameClips", this);
                return Host.Results.kResultOk;

        }
        
        // message box shorthand
        function msg(value) {
                Host.GUI.alert(value);
        }
}

function beginEdit() {
        return new performTask;
}




