//V1.1 Added Attendance not taken if attendance is left blank.
//V1.0



var Student = function (name,tname,attendance) {
    var str = name.trim();
    
    this.name = str.slice(0,str.length-2); // STORES full name
    this.name = this.name.trim();
    this.grade = str.slice(-2);
    
    this.teacher = tname;
    
    //added 12.12
    if(attendance == '')
        attendance = "Attendance not taken " + new Date();
    this.attendance = attendance;
    // Logger.log(name.split(" "));
    this.nameA = []; //STORES first name last name
    //this.lastName = nameArray[2];
    //this.firstName = nameArray[1];
    Logger.log('Person instantiated');
};

Student.prototype.nameSplitter = function() {
    this.nameA = this.name.split(" ");
};

Student.prototype.sayHello = function() {
    Logger.log("Hello, I'm " + this.name);
    Logger.log("Hello, I'm in the " + this.grade);
    Logger.log("Hello, My teacher is " + this.teacher);
};



function testMVD(){
    var student1 = new Student('Teacher Deleted Tue Dec 20 2016 14:14:15 GMT-0800 (PST)', 'Willis','UNX');
    Logger.log(student1.name + " " + student1.grade)
    student1.sayHello();
    // student1.nameSplitter();
    //Logger.log(student1.nameA[0]+student1.nameA[1]);
    //Logger.log(student1.lasntName + " " + student1.firstName);
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
