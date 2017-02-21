//V1.0

var SSManager = function () {
    
    this.copyFrom = "1Ljkoqf3plJoU6q3EGp3AxEmmukzZ5ThOxGbyCiX3k_o";
    this.destination = "1I6w6FAOXx1T_Pnlp2JRhPYuE5TxqHQKAJQtiLCe8dr8";
    
    
    Logger.log('SSMAn Instatianted');
};

SSManager.prototype.transferData = function(student) {
    //var sss = SpreadsheetApp.openById(this.copyFrom); //source ID
    var tss = SpreadsheetApp.openById(this.destination);//destination ID
    var writeData = false;
    if(student.grade == 9){
        //var ss = sss.getSheetByName('Freshman'); //source Sheet tab name
        //data = range.getValues();
        var ts = tss.getSheetByName('Freshman');
        writeData = true;
    }
    if(student.grade == 10){
        //var ss = sss.getSheetByName('Freshman'); //source Sheet tab name
        //data = range.getValues();
        Logger.log("** Going **");
        var ts = tss.getSheetByName('Sophomore');
        writeData = true;
    }
    if(student.grade == 11){
        //var ss = sss.getSheetByName('Freshman'); //source Sheet tab name
        //data = range.getValues();
        var ts = tss.getSheetByName('Junior');
        writeData = true;
    }
    if(student.grade == 12){
        //var ss = sss.getSheetByName('Freshman'); //source Sheet tab name
        //data = range.getValues();
        var ts = tss.getSheetByName('Senior');
        writeData = true;
    }
    if(writeData){
        Logger.log("** Going 2 **");
        
        var range = ts.getDataRange();
        var values = range.getValues();
        var teacher = '';
        for (var i = 0; i < values.length; i++) {
            var row = "";
            for (var j = 0; j < 2; j++) {
                if (values[i][j]) {
                    row = row + values[i][j];
                }
                row = row + " ";
                
            }
            row = row.slice(0,row.length-1); // take off trailing space.
            Logger.log(row);
            Logger.log(student.name);
            if(row == student.name){
                Logger.log(row + "Found at index " + i);
                var cell = ts.getRange(i+1,j+2,1,1);
                cell.setNote('Found ' + new Date() );
                if (cell.isBlank()){
                    cell.setValue(student.teacher);
                    cell = cell.offset(0,1);
                    cell.setValue(student.attendance);
                    //writeData = false;
                } else if(cell.getValue() != student.teacher ){
                    if( inArray(cell,student.teacher)){
                        teacher = cell.getValue();
                        student.teacher += ';'+teacher;
                        cell.setValue(student.teacher);
                        cell = cell.offset(0,1);
                        var attendance = "";
                        if(cell.isBlank()){
                            cell.setValue(student.attendance);
                        } else{
                            attendance += cell.getValue();
                            cell.setValue(attendance);
                            
                        }//attendance else
                    }//not in array
                }//not blank cell
                //writeData = true;
            }//student found
        }//secondary Loop
        
        
    }//write data
    
};
//returns false if the teacher is not on the range
function inArray(cell,teacher){
    var values = cell.getValue();
    Logger.log("-------Index Of ________"+values.indexOf(';'));
    if(values.indexOf(';') > -1){
        var strArray = values.split(';');
        var contains = strArray.indexOf(teacher);
        if (contains >-1){
            return false;
        }else
            return true;
    }else
        return true;
    
}

function testIndex(){
    
    var str = "monkey;brains";
    Logger.log(str.indexOf(';'));
    
    
}

SSManager.prototype.test = function (){
    test();
};


function test(){
    var student1 = new Student('Parks Monique 10', 'Baez', 'Present;Baez');
    Logger.log(student1.name + " " + student1.grade)
    student1.sayHello();
    var copyM = new SSManager;
    copyM.transferData(student1);
}


/*function Copy() {
 var sss = SpreadsheetApp.openById('1Ljkoqf3plJoU6q3EGp3AxEmmukzZ5ThOxGbyCiX3k_o'); //replace with source ID
 var ss = sss.getSheetByName('Freshman'); //replace with source Sheet tab name
 var range = ss.getRange(1,1,ss.getLastRow(),1); //assign the range you want to copy
 var data = range.getValues();
 Logger.log(ss.getLastRow());
 
 var tss = SpreadsheetApp.openById('1I6w6FAOXx1T_Pnlp2JRhPYuE5TxqHQKAJQtiLCe8dr8'); //replace with destination ID
 var ts = tss.getSheetByName('Saved'); //replace with destination Sheet tab name
 ts.getRange(1,1,ss.getLastRow(),1).setValues(data); //you will need to define the size of the copied data see getRange()
 }*/
