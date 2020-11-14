/// Field definition
class Info{
    constructor(){
        this.firstName="";
        this.LastName="";
        this.phoneNo="";
        this.email="";
        this.majorCourse="";
        this.Id = "";
    }
}
/// Field definition END
/// helper function below

//create html element
function createDOMElement(dTag, dType, dId, dValue)
{   
    let newElem = document.createElement(dTag);
    newElem.type = dType;
    newElem.id = dId;
    newElem.value = dValue;
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
        if(property=="firstName" || property=="LastName"){
            let up = data.toUpperCase();
            let dow = data.toLowerCase();
            for(let i=data.length-1; i>=0; i--){
                if(up.charAt(i)==dow.charAt(i)){
                    if(up.charAt(i)==" ");
                    else return alertValidation(`name can not contain ${up.charAt(i)}`);
                }
            }
        }
        if(property=="phoneNo"){
            if(data!=data.toUpperCase() || data!=data.toLowerCase() ){
                return alertValidation("Invalid character in phone number");
            }
            if(data.length!=11){
                return alertValidation("Phone number length is not valid");
            }
        }
        if(property=="email"){
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
        // if(entry[property]==""){
        //     alert(`${property}: Empty Field!`);
        // }
    }
    deleteDomField();
    if(checkValidity(entry)){
        entry.Id = (key) ? key : createNewId();
        localStorage.setItem(entry.Id, JSON.stringify(entry));
    }
}
/// update created html elements
function updateDOMField(entry, key){
    let form = document.getElementById("form");
    for(let property in entry){
        if(property=="Id") continue;
        form.appendChild( createDOMElement("input", "text", property, entry[property]));
    }
    form.appendChild( createDOMElement("input","button","btn","Submit"));    
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
    updateDOMField(entry, id);    
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
    newField.value = msg;
    form.appendChild(newField);
    newField = document.createElement("input");
    newField.type = "button";
    newField.className = "button";
    newField.value = "Submit";
    newField.id = "btn";
    form.appendChild(newField);
}
/// show database in tabular format
function showDataInTable(entryList)
{
    let table = document.getElementById("output");
    let cap = document.createElement("caption");
    let h2 = document.createElement("h2");
    h2.textContent = "Student List";
    cap.appendChild(h2);
    table.appendChild(cap);
    let tr = document.createElement("tr");
    let testEntry = new Info();
    for(let prop in testEntry){
        let th = document.createElement("th");
        th.textContent = prop;
        tr.appendChild(th);
    }
    tr.className = "row";
    table.appendChild(tr);
    for(let i=0; i<entryList.length; i++){
        tr = document.createElement("tr");
        testEntry.className = "data";
        for(let prop in entryList[i]){
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
    inputId("update");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        let data = localStorage.getItem(id);
        if(data==null){
            alertInvalidId();
        }
        else{
            data = JSON.parse(data);
            createNewEntry(data);
        }
    });
    
}
function deleteExistingEntry()
{
    inputId("delete");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        if(localStorage.getItem(id)==null){
            alertInvalidId();
        }
        else {
            if(confirm(`Are you sure to delete Id: ${id}`))
                localStorage.removeItem(id);
        }
    });
}
function findAnEntry()
{
    inputId("find");
    let btn = document.getElementById("btn");
    btn.addEventListener("click",()=>{
        let id = document.getElementById("search").value;
        deleteDomField();
        if(localStorage.getItem(id)==null){
            alertInvalidId();
        }
        else{
            let data = localStorage.getItem(id);
            data = JSON.parse(data);
            showDataInTable([data]);
        }
    });
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
/// main code ends here 
