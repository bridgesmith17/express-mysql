
//when page is loaded display the table and activate forms submit button for new excerices
document.addEventListener('DOMContentLoaded', displayTable);
document.addEventListener('DOMContentLoaded', bindInsert);



//displays table when the page is loaded or called after the start of another ajax event.
function displayTable(){
  //checks to see if a table is already on the page and if so deletes it to make room for the updated content. 
 if(document.getElementById("body")){
  var content = document.getElementById("body");
  
  if(content.hasChildNodes()){
    while(content.firstChild){
      content.removeChild(content.firstChild);
    }
  }
 }
               var req = new XMLHttpRequest();
                req.open('GET', '/select', true);
                var data = "";
               req.addEventListener('load',function(){
                    if(req.status >= 200 && req.status < 400){
                        var response = JSON.parse(req.responseText);
                        //for each object that is returned via the response contstruct a row in the table for its content
                        for(var p in response.results){
                          
                            newRow = document.createElement("tr");
                            
                            
                            newCol = document.createElement("td");
                            newRow.appendChild(newCol);
                            newCol.textContent = response.results[p].name; 
                            
                            
                            newCol = document.createElement("td");
                            newRow.appendChild(newCol);
                            newCol.textContent = response.results[p].reps;
                            
                            newCol = document.createElement("td");
                            newRow.appendChild(newCol);
                            newCol.textContent = response.results[p].weight;
                            
                            newCol = document.createElement("td");
                            newRow.appendChild(newCol);
                            newCol.textContent = response.results[p].date;
                            
                            newCol = document.createElement("td");
                            newRow.appendChild(newCol);
                            
                            if(response.results[p].lbs == 1){
                              newCol.textContent = "LBS";
                            } else {
                              newCol.textContent = "KGS";
                            }                           
                            newCol = document.createElement("td");
                       
                          var form = document.createElement("form");                     
                            form.method = 'POST';
                            
                            var hiddenId = document.createElement("input");
                            hiddenId.setAttribute('type','hidden');
                            hiddenId.setAttribute('id',  response.results[p].id);
                            hiddenId.value = response.results[p].id;
                            
                            form.appendChild(hiddenId);
                            
                            var deleteSubmit = document.createElement("input");
                            deleteSubmit.setAttribute("type","button");
                            deleteSubmit.setAttribute("id",  "delete"+response.results[p].id);
                            deleteSubmit.value = "Delete";
                            deleteSubmit.setAttribute("onclick", "deleteMe(this)" );
                            
                            form.appendChild(deleteSubmit);
                          
                    
                          
                            newCol.appendChild(form);
                            newRow.appendChild(newCol);
                            
                              newCol = document.createElement("td");
                       
                          var form = document.createElement("form");                     
                            form.method = 'POST';
                            form.action = '/update';
                            
                            var hiddenId = document.createElement("input");
                            hiddenId.setAttribute('type','hidden');
                            hiddenId.setAttribute('id',  'updateID');
                            hiddenId.setAttribute('name',  'updateID');
                            hiddenId.value = response.results[p].id;
                            
                            form.appendChild(hiddenId);
                            
                            var updateSubmit = document.createElement("input");
                            updateSubmit.setAttribute("type","submit");
                            updateSubmit.setAttribute("id",  "update"+response.results[p].id);
                            updateSubmit.value = "Update";
                            
                            form.appendChild(updateSubmit);
                          
                            newCol.appendChild(form);
                            newRow.appendChild(newCol);
                                                      
                            
                            document.getElementById("body").appendChild(newRow);
                       
                        }

                    } else {
                           console.log("Error in network request: " + request.statusText);
                    } 
                });
                   req.send(null);
                   event.preventDefault();
         
  }
  

  
// function to be bound to delete button to delete that row by accessing the hidden id and passing it to a mysql function  
function deleteMe(delButton){
  
    var req = new XMLHttpRequest();
    var payload = {id:null};

    payload.id = delButton.previousElementSibling.value;
    
   
    req.open('POST', '/delete', true);
    req.setRequestHeader('Content-Type', 'application/json');
 
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
                     
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send(JSON.stringify(payload));
    displayTable();
    event.preventDefault();
}
  
  
//inserts a new value into the database with input for the fomr.   
function bindInsert (){
document.getElementById('newSubmit').addEventListener('click', function(event){
  
    var req = new XMLHttpRequest();
    var payload = {name:null, reps:null, weight:null, date:null, lbs:null};

    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;
    payload.lbs = document.getElementById('lbs').value;
    req.open('POST', '/insert', true);
    req.setRequestHeader('Content-Type', 'application/json');
 
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
                     
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send(JSON.stringify(payload));
    displayTable();
    document.getElementById("exercise-form").reset(); //resets the information in the fomr after it has been sent.
    event.preventDefault();
  });
}
