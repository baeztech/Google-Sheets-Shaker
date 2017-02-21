/*V1.3.3 Changed the onTriggerWeekly()
 *        Fixed bug that would not allow copy
 *        Onto history. Added Functions masterWeeklyFresh
 *        and WeeklyFresh. Functions copy to the correct
 *        range.
 */
/*V1.3.2 Changed the onTriggerWeekly()
 *        Fixed going into hidden sheets.
 */

/*V1.3.1 Removed code that deleted records from master
 *        this would have caused collisions with HASH
 *
 */
/*V1.3 Fixed cell delete, clears the cell from teacher sheet instead of
 *      deleting the row. No problem with history.
 *
 */
//V1.2 Fixed delete cell method. Deletes the cell from both records. Problem
//     will be caused with history.
//     Fixed updating records when fixing header row
//     Removes up to 40 ASE assignments
//
//V1.1 Removed set note code, issues with attendance when index changed

function onEdit(e){
    // Set a comment on the edited cell to indicate when it was changed.
    var range = e.range;
    var sheet = range.getSheet();
    var aseCounter = sheet.getRange(1,1,1,1); // should be an class
    var data =parseInt( aseCounter.getValue());
    var masterRow ;
    
    // Attendance
    if(range.getColumn() == 3 && !("MainData" == sheet.getName()) ){
        var aCell = sheet.getRange(range.getRow(),1);
        masterRow = aCell.getNote();
        //cast to int
        masterRow = parseInt(masterRow);
        aCell=aCell.offset(0,2);
        var attendance = aCell.getValue();
        attendance += ";";
        attendance += sheet.getName();
        writeToMasterSheet(attendance, masterRow);
        
        
    }
    // There was a deletion on the teacher sheet.
    /*
     --Take the note from the data cell. The note indicates index on master
     --Get the teacher data cell from master
     --If only one teacehr assgined array <3 elements TeacherName;row;col delete record
     --else find index of teacher deleting it and pop values from array
     */
    if(range.getColumn() == 2 && range.isBlank() && !("MainData" == sheet.getName())){
        var dataCell = sheet.getRange(range.getRow(), 1);
        masterRow = dataCell.getNote();
        //cast to int
        masterRow = parseInt(masterRow);
        recordDelete(masterRow, sheet.getName());
        
        var clear = sheet.getRange(range.getRow(), 1,1,3);
        clear.setBackground("red");
        clear.clearContent();
        clear.clearNote();
        clear.setBackground("white");
        
        //sheet.deleteRow(range.getRow());
        //decrement counter and delete row.
        
        
        if (data < 0)
            data = 1;
        aseCounter.setValue(data-1);
        
        // Find the deleted record and take from master sheet.
        
    }
    else if(range.getColumn() == 2 && !("MainData" == sheet.getName())&& range.getRow() != 1){
        var row = range.getRow();
        var cell = sheet.getRange(row, 1);
        cell.setBackground("yellow");
        
        var sheetC = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MainData");
        var rangeToCopy = range;
        var lr = sheetC.getLastRow();
        
        //    Check for record
        var rangeMD = sheetC.getDataRange();
        var values = rangeMD.getValues();
        var tcell;
        var record = true;
        var note = "";
        for (var i = 0; i < values.length; i++) { //should be part of SSman
            var row = "";
            row = row + values[i][0];
            
            // row = row + " ";
            
            
            //row = row.slice(0,row.length-1); // take off trailing space.
            Logger.log(row);
            if(row == range.getValue() ){
                Logger.log(row + "Found at index " + i);
                // var cell = ts.getRange(i+1,j+2,1,1);
                cell.setBackground("#D3D3D3");
                cell.setNote(lr);
                tcell = sheetC.getRange(i+1,2);
                
                
                var teacher = tcell.getValue();
                //Check if teacher already added student.
                if(teacher != sheet.getSheetName()){
                    note = tcell.getNote();
                    tcell.setNote(note + ';' +sheet.getSheetName() + ';' + range.getRow() + ';' + range.getColumn() );
                    //tcell.setNote(note + "working");
                    cell.setNote(   tcell.getRow());
                    tcell.setValue(teacher + ";" + sheet.getSheetName());
                    aseCounter.setValue(data+1);
                }
                record = false;
                
            }
        }
        //copy data
        if (record){
            rangeToCopy.copyTo(sheetC.getRange(lr+1, 1),{contentsOnly:true});
            tcell = sheetC.getRange(lr+1, 2);
            //if(tcell.isBlank()){ //Student has not been assigned by another teacher
            tcell.setValue(sheet.getSheetName());
            tcell.setNote(sheet.getSheetName() + ';' + range.getRow() + ';' + range.getColumn());
            cell.setBackground("orange");
            cell.setNote(lr+1);
            Logger.log("executed Event transfer");
            aseCounter.setValue(data+1);
            //}
        }
        
    }
    
    
}

function writeToMasterSheet(data, rowIndex){
    const tcolumn = 3;
    var mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MainData");
    var recordCell = mainSheet.getRange(rowIndex, tcolumn);
    var masterdata = recordCell.getValue();
    if (recordCell.isBlank()){
        recordCell.setValue(data);
    }
    else{
        masterdata += ";";
        masterdata += data;
        
        recordCell.setValue(masterdata);
    }
    
}

function recordDelete(index, tName){
    //const
    const tcolumn = 2;
    var tindex = -1;
    var mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MainData");
    var recordCell = mainSheet.getRange(index, tcolumn);
    recordCell.setBackground("green");
    var teachers = recordCell.getValue();
    var tarray = [];
    tarray = teachers.split(";");
    //var oRange = recordCell.offset(0,1);
    //oRange.setValue("working "+ tarray.length + tarray.indexOf("Baez"));
    //contains more than one teacher
    if (tarray.length > 1){
        recordCell.setBackground("blue");
        
        teachers = "";
        tindex = tarray.indexOf(tName);
        if (tindex > -1){
            recordCell.setBackground("red");
            tarray.splice(tindex,1);
            //tarray[tindex] = " ";
            //oRange.setValue("working tindex"+ tarray[0] + " " +tarray[tindex]);
        }
        
        for(var i=0;i<tarray.length;i++){
            Logger.log(tarray[i] + " " + i);
            teachers += tarray[i];
            
        }
        
        recordCell.setValue(teachers);
    }else{
        //recordCell.setValue("Not Assigned ASE");
        recordCell = recordCell.offset(0, -1);
        recordCell.setValue("Teacher Deleted " + new Date());
        
        //row cannot be deleted.Will disrupt hash;
    }
    
    
    //recordCell.setBackground("red");
    
    
}


function delTest(){
    recordDelete( 7, "Baez");
}

function onAttendance(){
    
    
    
}

function onTriggerWeekly(){
    var mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MainData");
    // This represents ALL the data
    var range = mainSheet.getDataRange();
    var values = range.getValues();
    var copyM = new SSManager;
    
    // This logs the spreadsheet in CSV format with a trailing comma
    for (var i = 0; i < values.length; i++) {
        var row = "";
        for (var j = 0; j < values[i].length; j++) {
            if (values[i][j]) {
                row = row + values[i][j];
                var student = new Student(values[i][0],values[i][1],values[i][2]);
                copyM.transferData(student);
            }
            row = row + ",";
        }
        Logger.log(row);
    }
    //Create new set Wednesdays
    
    weeklyFresh();
    /*var ss = SpreadsheetApp.getActiveSpreadsheet();
     var numSheets = SpreadsheetApp.getActiveSpreadsheet().getNumSheets();
     for (var ni = 0; ni < numSheets ; ni++){
     var sheet = ss.getSheets()[ni];
     //if(!sheet.isSheetHidden() || sheet.getName() != "History"){
     if (sheet.getIndex() > 3){
     
     }
     
     
     }*/
    
}

function weeklyFresh(){
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var numSheets = SpreadsheetApp.getActiveSpreadsheet().getNumSheets();
    for (var ni = 3; ni < numSheets ; ni++){
        
        var sheet = ss.getSheets()[ni];
        //if(!sheet.isSheetHidden() || sheet.getName() != "History"){
        if (sheet.getIndex() > 2){
            range = sheet.getDataRange();
            var copyRange = sheet.getRange(1, 2,range.getLastRow()+1,2);
            //Logger.log(copyRange.getDisplayValues());
            copyRange.copyTo(sheet.getRange(range.getLastRow()+2,4));
            var header = sheet.getRange("A1:C1");
            var d = new Date();
            d.setDate(d.getDate() + 6);
            
            var n = "Students Assigned " + d.toLocaleDateString();
            
            var hArray =new Array();
            hArray[0]=new Array();
            hArray[0][0] = 0;
            hArray[0][1] = n;
            hArray[0][2] = "Attendance";
            if(sheet.getSheetName() != "MainData"){
                header.setValues(hArray);
                header = sheet.getRange(2, 1,range.getLastRow()+1,3);
                header.clearContent();
                header.clearNote();
                header.setBackground("white");
            }
            
        }
    }
    masterWeeklyFresh();
    
}

function masterWeeklyFresh(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var numSheets = SpreadsheetApp.getActiveSpreadsheet().getNumSheets();
    var sheet = ss.getSheets()[2];
    sheet.insertColumnsBefore(1, 4);
    var sheetS = ss.getSheets()[0];
    var range = sheet.getDataRange();
    var rangeS = sheetS.getDataRange();
    var copyRange = sheetS.getRange(1, 1,rangeS.getLastRow()+1,3);
    Logger.log(copyRange.getDisplayValues());
    copyRange.copyTo(sheet.getRange("A2")); 
    rangeS.clearContent();
    rangeS.setBackground('white');
    rangeS.clearNote();
    
    
}


function testEH(){
    var test = new SSManager;
    test.test();
    
}
