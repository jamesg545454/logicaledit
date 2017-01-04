/*
    PreSonus Studio One Midi Logical Editor version 1.0.3

    Author Info
    Email: expressmix@att.net
    Studio One User Forum Profile: https://forums.presonus.com/memberlist.php?mode=viewprofile&u=282

    Credits
    Thanks to Narech Kontcell for discovering and templateing some of the methods being  used here that allow these edits to happen.
    http://narechk.net/.  This package was inspired by Studio One X.  http://studioonex.narechk.net/index_en.html

    Changes
    1.0.1  Added optional selection mirroring to Action section
    1.0.2  Added an unrelated menu / action to the package for custom clip renaming [Event | Rename Clips...]
    1.0.3  Added a gray background to Rename Clips to be more consistent with the default UI dialog design.
*/

// PackageID is used to indentify the package for things like skins.
const kPackageID = "audiocave.logical.editor";

// used to parse which option the user has set in the editor, 1-127 or 1-100%
var MaxVelocity;

// Main function
function performTask() {
    this.interfaces =
        [
            Host.Interfaces.IController,
            Host.Interfaces.IParamObserver,
            Host.Interfaces.IEditTask
        ];

    // triggers whenever any UI parameter changes
    this.paramChanged = function (param) {

        // restore the original selection the user 
        // had when they first called the dialog 
        if (param.name == "buttonRestore") {
            if (this.originalSelection.length > 0) {

                this.context.editor.selection.unselectAll();
                let selectFunctions = this.context.editor.createSelectFunctions(this.context.functions);
                selectFunctions.executeImmediately = true;
                selectFunctions.selectMultiple(this.originalSelection);
                this.context.editor.selection.showHideSuspended = false;
                this.context.editor.showSelection(true);
            }
        }

        // toggle the check boxes acting as option buttons
        if (param.name == "selectOnlyChk") {
            this.compressVelocityChk.setValue(0);
            this.randomVelocityChk.setValue(0);
        }

        // toggle the check boxes acting as option buttons
        if (param.name == "randomVelocityChk") {
            if (this.randomVelocityChk.value == 1) {
                this.compressVelocityChk.setValue(0);
                this.selectOnlyChk.setValue(0);
            }
        }

        // toggle the check boxes acting as option buttons
        if (param.name == "compressVelocityChk") {
            if (this.compressVelocityChk.value == 1) {
                this.randomVelocityChk.setValue(0);
                this.selectOnlyChk.setValue(0);
            }
        }

        // randomize velocity high edit box
        if (param.name == "randomHighVelocity") {
            if (this.randomHighVelocity.value < this.randomLowVelocity.value) {
                this.randomHighVelocity.value = this.randomLowVelocity.value
            }
        }

        // randomize velocity low edit box
        if (param.name == "randomLowVelocity") {
            if (this.randomLowVelocity.value > this.randomHighVelocity.value) {
                this.randomLowVelocity.value = this.randomHighVelocity.value
            }
        }

        // Default UI button
        if (param.name == "buttonStoreDefault") {
            this.saveValuesToFile();
        }

        //------  Apply Button -----------------------------------------------
        if (param.name == "buttonExecuteEdit") {
                   
            // create array to hold the filtered items for the view selection option
            this.filterAry = [];

            // this.context is created on start to capture the current context
            var context = this.context
            var editor = context.editor;
            var iterator = context.iterator;
            var functions = context.functions;

            // if any of this fails, do nothing
            if (!editor || !iterator || !functions)
                return Host.Results.kResultFailed;
 
            // editor command.  execute, temp disable selection in editors
            // this may be the only way to real time update   
            context.functions.executeImmediately = true;

            // this may be the only way to real time update, to disable
            // selection and then re-enable, causing a refresh?
            context.editor.showSelection(false);
            context.editor.selection.showHideSuspended = true;

            // the iterator is used multiple times per session some
            // always set .first() for every Apply action
            iterator.first();

            // ***********************************************************************************************************
            //                                       BEGIN PARSING EDIT FILTERS
            // ***********************************************************************************************************
            switch (this.editOption.string) {
                // Pitches 1, 2, 3 are all in the first filter
                // the code for all three things is the same and can perhaps 
                // be reduced more by pushing more of it to common functions

                // the commenting here is applicable to all three pitch code blocks

                // ─────────────────────  FILTER 1  ──────────────────────────────────────────────────────────────────────
                case "1":
                    
                    // loop through all selected notes looking for filter matches
                    while (!iterator.done()) {
                        
                        // looking at the next selected event
                        var event = iterator.next();

                        // ----------- if Pitch 1 matches the event pitch, hit ------------------------------------------
                        if (this.Pitch1.value == event.pitch) {
                            
                            // put the event into the selection array
                            this.filterAry.push(event);

                            // get the new pitch based on the transpose value
                            // getNewPitch() is in the Helper Functions section
                            value = this.getNewPitch(event.pitch);
                            
                            // only modify the pitch if it's different from the returned value
                            if (value != event.pitch) {
                                functions.modifyPitch(event, value); continue;
                            }

                            //////////  RANDOMIZE VELOCITY /////////////////////////////
                            // if the randomize check box is checked, get a random value
                            // getRandomVelocity() is in te Helper Functions section
                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            //////////  COMPRESS VELOCITY /////////////////////////////
                            // if the compress check is checked, compress based on UI values
                            if (this.compressVelocityChk.value == 1) {

                            //
                            // ─── PARSE UI SETTINGS:  KEY EDITOR ────────────────────────────────────────────────────────────
                            //
                            //  values are different based on the setting in the key editor, 1-127 or 1-100%
                            //  the first uses floating point 0-1, the second uses literal fp values 0-100 ex: 23.45
                            //  set the value correctly based on the current key editor UI setting

                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127)) { 
                                        functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; 
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value / 127)) { 
                                        functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; 
                                    }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value)) { 
                                        functions.modifyVelocity(event, this.compressLowVelocity.value); continue; 
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value)) { 
                                        functions.modifyVelocity(event, this.compressHighVelocity.value); continue; 
                                    }
                                }
                                continue;
                            }

                            //
                            // ─── DEFAULT VELOCITY ACTION ─────────────────────────────────────── 
                            //
                            // because every section above uses continue; if the code gets here
                            // it means that no other velocity option was checked 
                            
                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }

                        // ------------------------------------------------------------------------
                        if (this.Pitch2.value == event.pitch) {
                            this.filterAry.push(event);

                            value = this.getNewPitch(event.pitch);
                            if (value != event.pitch) {
                                functions.modifyPitch(event, value);
                            }

                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            if (this.compressVelocityChk.value == 1) {

                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue;
                                    }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value); continue;
                                    }
                                }
                                continue;
                            }

                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }
                        // ------------------------------------------------------------------------
                        if (this.Pitch3.value == event.pitch) {
                            this.filterAry.push(event);

                            value = this.getNewPitch(event.pitch);
                            if (value != event.pitch) {
                                functions.modifyPitch(event, value);
                            }

                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            if (this.compressVelocityChk.value == 1) {
                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127))
                                    { functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }

                                    if (event.velocity > (this.compressHighVelocity.value / 127))
                                    { functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value))
                                    { functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

                                    if (event.velocity > (this.compressHighVelocity.value))
                                    { functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
                                }
                                continue;
                            }

                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }
                    }
                    break;

                // ─────────────────────  FILTER 2: PITCH + VELOCITY LOWER THAN ──────────────────────────────────────────
                
                case "2":

                    while (!iterator.done()) {
                        
                        var event = iterator.next();

                        if (event.pitch > this.Pitch4.value &&
                            event.pitch < this.Pitch5.value &&
                            event.velocity <= this.Velocity1.value) {

                            this.filterAry.push(event);

                            value = this.getNewPitch(event.pitch);
                            if (value != event.pitch) { 
                                functions.modifyPitch(event, value); 
                            }

                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            if (this.compressVelocityChk.value == 1) {
                                
                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue;
                                    }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value); continue;
                                    }
                                }
                            }

                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }
                    }
                    break;

                // ─────────────────────  FILTER 3: PITCH + VELOCITY HIGHER THAN ─────────────────────────────────────────────────
                
                case "3":

                    while (!iterator.done()) {
                        
                        var event = iterator.next();

                        if (event.pitch > this.Pitch6.value &&
                            event.pitch < this.Pitch7.value &&
                            event.velocity >= this.Velocity2.value) {
                            
                            this.filterAry.push(event);

                            value = this.getNewPitch(event.pitch);
                            if (value != event.pitch) {
                                functions.modifyPitch(event, value);
                            }

                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            if (this.compressVelocityChk.value == 1) {

                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value / 127)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue;
                                    }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressLowVelocity.value); continue;
                                    }

                                    if (event.velocity > (this.compressHighVelocity.value)) {
                                        functions.modifyVelocity(event, this.compressHighVelocity.value); continue;
                                    }
                                }
                                continue;
                            }

                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }
                    }
                    break;

                // ─────────────────────  FILTER 4: PITCH + VELOCITY HIGHER AND LOWE THAN ─────────────────────────────────────────────────

                case "4":
                    while (!iterator.done()) {
                        var event = iterator.next();

                        if (event.pitch > this.Pitch8.value &&
                            event.pitch < this.Pitch9.value &&
                            event.velocity >= this.Velocity3.value &&
                            event.velocity <= this.Velocity4.value) {
                            
                            this.filterAry.push(event);

                            value = this.getNewPitch(event.pitch);
                            if (value != event.pitch) { functions.modifyPitch(event, value); }

                            if (this.randomVelocityChk.value == 1) {
                                var value = this.getRandomVelocity();
                                functions.modifyVelocity(event, value);
                                continue;
                            }

                            if (this.compressVelocityChk.value == 1) {

                                if (MaxVelocity == 127) {
                                    if (event.velocity < (this.compressLowVelocity.value / 127))
                                    { functions.modifyVelocity(event, this.compressLowVelocity.value / 127); continue; }

                                    if (event.velocity > (this.compressHighVelocity.value / 127))
                                    { functions.modifyVelocity(event, this.compressHighVelocity.value / 127); continue; }
                                }

                                if (MaxVelocity == 1) {
                                    if (event.velocity < (this.compressLowVelocity.value))
                                    { functions.modifyVelocity(event, this.compressLowVelocity.value); continue; }

                                    if (event.velocity > (this.compressHighVelocity.value))
                                    { functions.modifyVelocity(event, this.compressHighVelocity.value); continue; }
                                }
                                continue;
                            }

                            if (this.changeVelocity.value != 0) {
                                value = this.getVelocity(event.velocity);
                                functions.modifyVelocity(event, value);
                                continue;
                            }
                        }
                    }
                    break;
            }

            // if select only is checked, select items in this array
            if (this.selectOnlyChk.value == 1 && this.filterAry.length > 0) {
                context.editor.selection.unselectAll();
                let selectFunctions = this.context.editor.createSelectFunctions(context.functions);
                selectFunctions.executeImmediately = true;
                selectFunctions.selectMultiple(this.filterAry);
            }
            //--------------------------------------  END SWITCH ------------------------------------------------------------
            
            // enable selection and showHide to (i assume?) refresh the items
            context.editor.selection.showHideSuspended = false;
            context.editor.showSelection(true);


        }   // --- close buttonExecuteEdit()
    }       // --- close this.ParamChanged()


    // ***********************************************************************************************************
    //                                           HELPER FUNCTIONS
    // ***********************************************************************************************************

    // message box shortcuts with and without string wrappers
    function msg(value) {
        Host.GUI.alert(String(value));
    }

    function Msg(value) {
        Host.GUI.alert(value);
    }

    // --------------------------------------------------------------------------------------------
    this.getNewPitch = function (eventPitch) {
        var value = eventPitch + this.changePitch.value
        if (value > 127) { value = 127; }
        if (value < 0) { value = 0; }
        return value;
    }

    //---------------------------------------------------------------------------------------------
    this.getVelocity = function (eventVelocity) {
        if (MaxVelocity == 127) { var value = eventVelocity + this.changeVelocity.value / 127 }
        if (MaxVelocity == 1) { var value = (eventVelocity + (this.changeVelocity.value / 100)) }
        if (value > 127) { value = 127; }
        if (value < 0) { value = 0; }
        return value;
    }

    //--------------------------------------------------------------------------------------------
    this.getRandomVelocity = function () {
        if (MaxVelocity == 127) {
            var RandVel = Math.floor((Math.random() *
                (this.randomHighVelocity.value - this.randomLowVelocity.value)
                + this.randomLowVelocity.value))
            return RandVel / 127;
        }

        if (MaxVelocity == 1) {
            var RandVel = (Math.random() *
                ((this.randomHighVelocity.value) - (this.randomLowVelocity.value))
                + (this.randomLowVelocity.value))
            return RandVel;
        }
    }

    // ***********************************************************************************************************
    //                                          FILE FUNCTIONS
    // ***********************************************************************************************************
    
    // this file is where the default pitch and velocity filter settings are store
    this.getSettingsFile = function () {
        return Host.Url("local://$USERCONTENT/logicaledit.txt");
    }

    // -----------------------------------------------------------------
    this.saveValuesToFile = function () {
        
        var defaultValues = new Array;
        
        defaultValues.push(String(this.Pitch1.value));
        defaultValues.push(String(this.Pitch2.string));
        defaultValues.push(String(this.Pitch3.string));
        defaultValues.push(String(this.Pitch4.string));
        defaultValues.push(String(this.Pitch5.string));
        defaultValues.push(String(this.Pitch6.string));
        defaultValues.push(String(this.Pitch7.string));
        defaultValues.push(String(this.Pitch8.string));
        defaultValues.push(String(this.Pitch9.string));
        defaultValues.push(String(this.Velocity1.value));
        defaultValues.push(String(this.Velocity2.value));
        defaultValues.push(String(this.Velocity3.value));
        defaultValues.push(String(this.Velocity4.value));

        var path = this.getSettingsFile();
        var settingsFile = Host.IO.createTextFile(path);

        if (settingsFile) {
            var count = defaultValues.length;
            for (let i = 0; i < count; i++) {
                var item = defaultValues[i];
                settingsFile.writeLine(item);
            }

            settingsFile.close();
        }
    }

    //---------------------------------------------------------------------

    // if the file exists, always load the default values for pitch and vel
    this.loadValuesFromFile = function () {
        var path = this.getSettingsFile();

        // open the target file
        let settingsFile = Host.IO.openTextFile(path);

        if (settingsFile) {
            var defaultValues = new Array;
            while (!settingsFile.endOfStream) {
                var curItem = settingsFile.readLine();
                defaultValues.push(curItem);
            }
        }
        else {
            return;
        }

        if (defaultValues.length >= 13) {
            this.Pitch1.value =    defaultValues[0]
            this.Pitch2.string =   defaultValues[1]
            this.Pitch3.string =   defaultValues[2]
            this.Pitch4.string =   defaultValues[3]
            this.Pitch5.string =   defaultValues[4]
            this.Pitch6.string =   defaultValues[5]
            this.Pitch7.string =   defaultValues[6]
            this.Pitch8.string =   defaultValues[7]
            this.Pitch9.string =   defaultValues[8]
            this.Velocity1.value = defaultValues[9]
            this.Velocity2.value = defaultValues[10]
            this.Velocity3.value = defaultValues[11]
            this.Velocity4.value = defaultValues[12]
        }

        settingsFile.close();
    }

    //----------------------------------------------------------------------------------------------------
    this.prepareEdit = function (context) {
        
        // array used to hold items that match edit filter
        this.filterAry = new Array;

        this.pitchFormatter = Host.Engine.createFormatter("Media.MusicNote");
        this.velocityFormatter = Host.Engine.createFormatter("Media.MusicVelocity");

        this.paramList = Host.Classes.createInstance("CCL:ParamList");
        this.paramList.controller = this;
       
        // edit option radio buttons
        this.editOption = this.paramList.addList("editOption");
        this.editOption.appendString("1");
        this.editOption.appendString("2");
        this.editOption.appendString("3");
        this.editOption.appendString("4");
   
        // Pitch Edit Boxes
        this.Pitch1 = this.paramList.addInteger(-1, 127, "Pitch1");
        this.Pitch1.setFormatter(this.pitchFormatter);
        this.Pitch1.value = -1;

        this.Pitch2 = this.paramList.addInteger(-1, 127, "Pitch2");
        this.Pitch2.setFormatter(this.pitchFormatter);
        this.Pitch2.value = -1;

        this.Pitch3 = this.paramList.addInteger(-1, 127, "Pitch3");
        this.Pitch3.setFormatter(this.pitchFormatter);
        this.Pitch3.value = -1;

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

        this.Pitch8 = this.paramList.addInteger(-1, 127, "Pitch8");
        this.Pitch8.setFormatter(this.pitchFormatter);
        this.Pitch8.value = -1;

        this.Pitch9 = this.paramList.addInteger(-1, 127, "Pitch9");
        this.Pitch9.setFormatter(this.pitchFormatter);
        this.Pitch9.value = -1;


        // ***********************************************************************************************************
        //                         PARSE KEY EDITOR PRESENTATION TYPE:  1-127 OR 1-100% ?
        //                                   AND SET PARAMETERS ACCORDINGLY
        // ***********************************************************************************************************
        if (Host.studioapp.find("Application").Configuration.getValue("Engine.Editing", "midiValuePresentationEnabled")) {
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

            this.changeVelocity = this.paramList.addInteger(-127, 127, "changeVelocity");
            this.changeVelocity.setValue(0);
        }
        else {
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

            this.changeVelocity = this.paramList.addInteger(-100, 100, "changeVelocity");
            this.changeVelocity.setValue(0);
        }
        // ***************************************************************************************************


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

    this.performEdit = function (context) {
        
        // set the context and iterator 
        this.context = context;
        var iterator = context.iterator;

        // hold all event references for original selection restore function
        this.originalSelection = new Array;
        while (!iterator.done()) {
            var event = iterator.next()
            this.originalSelection.push(event)
        }

        context.functions.executeImmediately = true;

        // run the UI
        Host.GUI.runDialog(Host.GUI.Themes.getTheme(kPackageID), "LogicalEditor", this);

        return Host.Results.kResultOk;
    }
}

function beginEdit() 
{
    return new performTask;
}


