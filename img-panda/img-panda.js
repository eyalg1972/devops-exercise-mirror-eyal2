var http = require('http');
var config = require('./config.json');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();

var path = require('path');
var fs=require('fs');

//Generate list of all the images files under resources that contains the word "panda"
function getImageArr(startPath,filter, extension){

  //  console.log('Starting from dir '+startPath+'/');
	var files_arr = [];
	var counter = 0;
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
	//console.log('filter '+filter);
    var files=fs.readdirSync(startPath);
	//console.log('files.length '+files.length);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
         if (filename.indexOf(filter)>=0) {
		   if (filename.endsWith(extension)) {
		//	    console.log('filename has the extension '+filename);
				files_arr[counter] = filename;
				counter++;
		   }
        };
    };

	return files_arr;
};



function handleRequest(request, response){
    try {
        console.log("Requested URL: " + request.url);
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

dispatcher.onGet("/", function(req, res) {

	  var arr_images = getImageArr('resources','panda', 'jpg');
	  var arr_len = arr_images.length;
//	  console.log('arr_len: '+arr_len);
	  var chosen = Math.floor(Math.random()* arr_len);
	  //console.log('-- chosen: ',chosen);
	  var image_path = arr_images[chosen];
//	  console.log('-- image_path: ',image_path);
	  var img = fs.readFileSync(image_path);
	  res.writeHead(200, {'Content-Type': 'image/png'});
	  res.end(img, 'binary');
  

});


dispatcher.onError(function(req, res) {
        res.writeHead(404);
        res.end("404 - Page Does not exists");
});

http.createServer(handleRequest).listen(config.port, function(){
    console.log("Server listening on: http://localhost:%s", config.port);
});
