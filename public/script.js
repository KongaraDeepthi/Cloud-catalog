function addApp(){

fetch("/addApp",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:document.getElementById("name").value,
category:document.getElementById("category").value,
version:document.getElementById("version").value,
dependencies:document.getElementById("dependencies").value,
tags:document.getElementById("tags").value
})

})
.then(res=>res.text())
.then(data=>alert(data));

}


function loadApps(){

fetch("/apps")
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("appList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerHTML = `
<strong>ID: ${app.id} | ${app.name}</strong><br>
Category: ${app.category}<br>
Version: ${app.version}<br>
Dependencies: ${app.dependencies}<br>
Tags: ${app.tags}
<br><br>
<button onclick="deleteApp(${app.id})">Delete</button>
<button onclick="updateApp(${app.id})">Update</button>
`;

list.appendChild(li);

});

});

}

app.get("/userRecommend/:userid", (req, res) => {
    db.query(
        "SELECT preferred_category FROM users WHERE id=?",
        [req.params.userid],
        (err, result) => {
            if (err) return res.status(500).send(err);
            
            // Check if user exists
            if(result.length === 0){
                return res.status(404).send("User not found");
            }

            let category = result[0].preferred_category;

            db.query(
                "SELECT DISTINCT name, category, version, dependencies, tags FROM applications WHERE category=? ORDER BY usage_count DESC",
                [category],
                (err, apps) => {
                    if(err) return res.status(500).send(err);
                    res.json(apps);
                }
            );
        }
    );
});
function searchApp(){

let keyword=document.getElementById("searchBox").value;

fetch("/search?keyword="+keyword)
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("appList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerText =
app.name+" | "+app.category+" | "+app.version;

list.appendChild(li);

});

});

}


function loadAnalytics(){

fetch("/analytics")
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("analyticsList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerText =
app.name+" - Usage: "+app.usage_count;

list.appendChild(li);

});

});

}



/* -------- DELETE APPLICATION -------- */

function deleteApp(id){

fetch("/deleteApp/"+id,{
method:"DELETE"
})
.then(res=>res.text())
.then(data=>{
alert(data);
loadApps();
});

}



/* -------- UPDATE APPLICATION -------- */

function updateApp(id){

fetch("/updateApp/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name:document.getElementById("name").value,
category:document.getElementById("category").value,
version:document.getElementById("version").value,
dependencies:document.getElementById("dependencies").value,
tags:document.getElementById("tags").value
})

})
.then(res=>res.text())
.then(data=>alert(data));

}



/* -------- FILTER APPLICATIONS -------- */

function filterApps(){

let category=document.getElementById("filterCategory").value;

fetch("/filter?category="+category)
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("appList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerText =
app.name+" | "+app.category+" | "+app.version;

list.appendChild(li);

});

});

}



/* -------- CATEGORY RECOMMENDATION -------- */

function recommendApps(){

let category=document.getElementById("recommendCategory").value;

fetch("/recommend/"+category)
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("recommendList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerText =
app.name+" | "+app.category+" | "+app.version;

list.appendChild(li);

});

});

}



/* -------- USER BASED RECOMMENDATION -------- */

function userRecommend(){

let userid=document.getElementById("userid").value;

fetch("/userRecommend/"+userid)
.then(res=>res.json())
.then(data=>{

let list=document.getElementById("recommendList");

list.innerHTML="";

data.forEach(app=>{

let li=document.createElement("li");

li.innerText =
app.name+" | "+app.category+" | "+app.version;

list.appendChild(li);

});

});

}