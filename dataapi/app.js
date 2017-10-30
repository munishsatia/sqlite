var express = require('express');
var restapi = express();
var sqlite3 = require('sqlite3').verbose();   
let db = new sqlite3.Database('opportunity.db')

restapi.get('/',function(req,res){
 res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello World from express!");
});

restapi.get('/data/:acode/:startdate/:enddate', function(req,res){
    console.log("agencycode  %s - startdate %s - enddate %s", req.params.acode,req.params.startdate,req.params.enddate); 
    var agencycode = "%"+req.params.acode+"%";
      var startdate,enddate;
    if (req.params.startdate != 'undefined')
        startdate = req.params.startdate;
    else
        startdate = null;//getdate(false);
      
     
    if (req.params.enddate != 'undefined')
        enddate = req.params.enddate;
    else
        enddate = null;//getdate(false);
      
    
    var data = fnSearch(agencycode,startdate,enddate,res);
   // res.json(data);
});

restapi.get('/data/:acode', function(req, res){
  console.log("agencycode  %s - startdate %sd - enddate $sed", req.params.acode,req.params.startdate,req.params.enddate); 
   var agencycode = "%"+req.params.acode.trim()+"%";
   
    var data = fnSearch(agencycode,null,null,res);
});
function getdate(iscurrent){
    var dateString="";
    var newDate = new Date();
    dateString += newDate.getFullYear()+ "-";
    if (iscurrent)
        dateString += ("0" + (newDate.getMonth() + 1)).slice(-2);    
    else
        dateString += ("0" + (newDate.getMonth())).slice(-2) ;
    dateString += "-" + ("0" + newDate.getDate()).slice(-2);
return dateString;
}
function fnSearch(agencycode,startdate,enddate,res){
  var params =[];
  let sql = "SELECT id,\"OPPORTUNITY NUMBER\" OPPORTUNITYNUMBER, OPPORTUNITYTITLE Title,AGENCYCODE FROM opportunitydetails where 1=1 ";
  if (agencycode)
    {
         sql +=  "and (agencycode like ? or agencyname like ? )";
        params.push(agencycode.trim());
        params.push(agencycode.trim());
    }
  if (startdate && enddate){
  sql += " and posteddate between ? and ? "; 
  params.push(startdate);
  params.push(enddate);
  } 
    console.log(sql);
    console.log(params);
  db.all(sql, params, function(err, row){ 
        if (err) {
        return console.error(err.message);
        }         
        return  res.json(row);
    });
}

db.on('trace', function (sql) {
    console.log("trace" + sql);
});

var port = process.env.PORT || 1337;
restapi.listen(port,function(){
  console.log("Server running at http://localhost:%d", port);
});
