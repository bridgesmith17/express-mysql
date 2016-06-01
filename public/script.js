

document.addEventListener('DOMContentLoaded', displayTable);
document.addEventListener('DOMContentLoaded', bindInsert);




function displayTable(){
  var content = document.getElementById("body");
  if(content.hasChildNodes()){
    while(content.firstChild){
      content.removeChild(content.firstChild);
    }
  }
  
               var req = new XMLHttpRequest();
                req.open('GET', '/select', true);
                var data = "";
               req.addEventListener('load',function(){
                    if(req.status >= 200 && req.status < 400){
                        var response = JSON.parse(req.responseText);
                        
                        for(var p in response.results){
                          var deleteMe=  "<p></p>";
                          
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
                            newCol.textContent = response.results[p].lbs;
                            
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
  

  
  
function deleteMe(delButton){
  
    var req = new XMLHttpRequest();
    var payload = {id:null};

    payload.id = delButton.previousElementSibling.value;
    
    console.log(payload.id);
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
  
  
  
function bindInsert (){
document.getElementById('newSubmit').addEventListener('click', function(event){
  
  console.log("Error Hunt!");
  
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
    document.getElementById("exercise-form").reset();
    event.preventDefault();
  });
}