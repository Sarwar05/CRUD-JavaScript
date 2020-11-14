/// Field definition
class Info{
    constructor(){
        this["First Name"]="";
        this["Last Name"]="";
        this["Phone No."]="";
        this["Email"]="";
        this["Course 1"]="";
        this["Course 2"]="";
        this["Course 3"]="";
        this.Id = "";
    }
}

/// Field definition END
/// helper function below

//create html element
function createDOMElement(divTag, divType, divId, divValue, useValue)
{   
    let newElem = document.createElement(divTag);
    newElem.type = divType;
    newElem.id = divId;
    if(useValue){
        newElem.value = divValue;
    }
    else{
        newElem.placeholder = divValue;
    }
    let newDiv = document.createElement("div");
    newDiv.className = "temp";
    newDiv.appendChild(newElem);
    return newDiv;
}
/// delete peviously created dom field
function deleteDomField()
{   
    let out = document.getElementById("output");
    while(out.firstChild){
        out.removeChild(out.firstChild);
    }
    let form = document.getElementById("form");
    while(form.firstChild){
        form.removeChild(form.firstChild);
    }
}
/// validate input
function alertValidation(msg){
    alert(msg);
    return false;
}
function checkValidity(entry)
{
    for(property in entry){
        if(property=="Id") continue;
        let data = entry[property];
        if(data==""){
            return alertValidation(`${property}: Empty Field!`);
        }
        if(property=="First Name" || property=="Last Name"){
            let up = data.toUpperCase();
            let dow = data.toLowerCase();
            for(let i=data.length-1; i>=0; i--){
                if(up.charAt(i)==dow.charAt(i)){
                    if(up.charAt(i)==" ");
                    else return alertValidation(`name can not contain ${up.charAt(i)}`);
                }
            }
        }
        if(property=="Phone No."){
            if(data!=data.toUpperCase() || data!=data.toLowerCase() ){
                return alertValidation("Invalid character in phone number");
            }
            if(data.length!=11){
                return alertValidation("Phone number length is not valid");
            }
        }
        if(property=="Email"){
            let idx =  data.indexOf("@");
            if(data.lastIndexOf("@")!=idx || data.includes("#")|| data.includes("$")){
                return alertValidation("invalid email");
            }
            if(data.lastIndexOf(".") <= idx+1 || idx==0 || data.includes(" ")){
                return alertValidation("invalid email");
            }
        }
    }
    return true;
}
/// get data from user submit
function retriveData(key)
{   
    let entry = new Info();
    
    for(let property in entry){  
        if(property=="Id") continue;      
        entry[property] = document.getElementById(property).value;
    }
    if(checkValidity(entry)){
        deleteDomField();
        entry.Id = (key) ? key : createNewId();
        localStorage.setItem(entry.Id, JSON.stringify(entry));
        markShowAllEntry();
    }
    else{
    }
}
/// update created html elements
function updateDOMField(entry, key,exist){
    let form = document.getElementById("form");
    for(let property in entry){
        if(property=="Id") continue;
        form.appendChild( createDOMElement("input", "text", property, entry[property],exist));
    }
    form.appendChild( createDOMElement("input","button","btn","Submit",true));    
    let sub = document.getElementById("btn");
    btn.className = "button";///
    sub.addEventListener("click",()=>{
        retriveData(key);
    }); 
}
/// create/ update existing entry
function createNewEntry(exist){
    
    let entry = new Info();
    for(let property in entry){
        if(property=="Id") continue;
        if(exist) entry[property] = exist[property];
        else entry[property] = `Enter ${property}`;
    }
    let id = null;
    if(exist) id = exist.Id;   
    updateDOMField(entry, id,exist);    
}
/// create an id for this user
let globalId = -1;
function createNewId(){
    if(globalId==-1){
        globalId = 0;
        for(let i=0; i<localStorage.length; i++){
            let id = localStorage.key(i);
            globalId = Math.max(globalId,Number(id));
        }
    }
    return ++globalId;    
}
/// enter id to find, update, delete
function inputId(reason){
    let msg = `Enter Id to ${reason}`;
    let form = document.getElementById("form");
    let newField = document.createElement("input");
    newField.type = "text";
    newField.id = "search";
    newField.placeholder  = msg;
    form.appendChild(newField);
    newField = document.createElement("input");
    newField.type = "button";
    newField.className = "button";
    newField.value = reason;
    newField.id = "btn";
    form.appendChild(newField);
}
/// show database in tabular format
function showDataInTable(entryList)
{
    let table = document.getElementById("output");
    let h2 = document.createElement("h2");
    h2.textContent = "Student List";
    let cap = document.createElement("caption");
    cap.appendChild(h2);
    table.appendChild(cap);
    let tr = document.createElement("tr");
    let testEntry = new Info();
    let spanSize = 0;
    for(let prop in testEntry){
        let th = document.createElement("th");
        th.textContent = prop;
        tr.appendChild(th);
        spanSize++;
    }
    tr.className = "row";
    table.appendChild(tr);
    if(entryList.length==0){
        tr = document.createElement("tr");
        testEntry.className = "data";
        let td = document.createElement("td");
        td.colSpan = spanSize;
        td.textContent = "No Data Found";
        tr.appendChild(td);
        table.appendChild(tr);
        return;
    }
    for(let i=0; i<entryList.length; i++){
        tr = document.createElement("tr");
        testEntry.className = "data";
        for(let prop in entryList[i]){
            if(testEntry[prop]) continue;
            let td = document.createElement("td");
            td.textContent = entryList[i][prop];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
///
function alertInvalidId(){

    alert("Invalid Id\nPlease enter valid one.");
}
/// helper function END
/// main functions to perform button action
function showAllEntry()
{
    /// etrive db and call showintable
    let entry = [];
    
    for(let i=0; i<localStorage.length; i++){
        let id = localStorage.key(i);
        let data = localStorage.getItem(id);
        entry.push(JSON.parse(data));
    }
    
    entry.sort((a,b)=>Number(a.Id)-Number(b.Id));    
    showDataInTable(entry);
}
 function addNewEntry()
{    
    let entry = createNewEntry();
    if(checkValidity(entry)){
        entry.Id =  createNewId();
        localStorage.setItem(entry.Id, JSON.stringify(entry));
    }
}
function updateExistingEntry()
{
    inputId("Update");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        let data = localStorage.getItem(id);
        if(data==null){
            alertInvalidId();
            updateExistingEntry();
        }
        else{
            data = JSON.parse(data);
            createNewEntry(data);
        }
    });
    
}
function deleteExistingEntry()
{
    inputId("Delete");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        if(localStorage.getItem(id)==null){
            alertInvalidId();
            deleteExistingEntry();
        }
        else {
            if(confirm(`Are you sure to delete Id: ${id}`)){
                localStorage.removeItem(id);
            }
            markShowAllEntry();   
        }
    });
}
function findAnEntry()
{
    inputId("Find");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        if(localStorage.getItem(id)==null){
            alertInvalidId();
            findAnEntry();
        }
        else{
            let data = localStorage.getItem(id);
            data = JSON.parse(data);
            showDataInTable([data]);
        }
    });
}

function markShowAllEntry()
{
    showAllEntry();
}
/// main functions to perform button action END
/// call event function for each button
function addEventToButton()
{
    
    deleteDomField();
    if(this.id=="list"){
        showAllEntry();
    }
    if(this.id=="reg"){
        createNewEntry();
    }
    if(this.id=='upd'){
        updateExistingEntry();
    }
    if(this.id=="del"){
        deleteExistingEntry();
    }
    if(this.id=="find"){
        findAnEntry();
    }
}
/// call event function for each button END



/// main code starts here

let nav = document.querySelector(".nav");
for(let i=0; i<nav.children.length; i++){
    nav.children[i].addEventListener("click", addEventToButton);
}
markShowAllEntry();
/// main code ends here 
