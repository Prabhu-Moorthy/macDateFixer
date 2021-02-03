var ExifImage = require('exif').ExifImage;

var fs=require('fs');

var dir = './images';
/*fs.readdir(dir,function(err,files){
  if (err) throw err;
  files.forEach(function(file){
    if(file) {
      fs.readFile('./images/'+file, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
      });
    }
  });
});*/

/*fs.readdirSync(dir).forEach(file => {
    console.log(file);
  });*/

  /*var count = 0;
  fs.readdirSync(dir).forEach(file => {
    try {
        var path = `${dir}/${file}`
        new ExifImage({ image : path }, function (error, exifData) {
            if (error)
                console.log('Error: '+error.message);
            else{
                var csv = `${file},${exifData.image.ModifyDate},${exifData.exif.CreateDate}`
                console.log(csv)
                count ++;
                //console.log(file);
                //console.log(exifData.image.ModifyDate); // Do something with your data!
            }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
  });*/

  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
        try {
            var path = `${dir}/${file}`
            new ExifImage({ image : path }, function (error, exifData) {
                if (error){
                    var errormessage = `${file},${error.message}`
                    fs.rename(path, `./edited/${file}`, (err) => {
                        if (err) throw err;
                        console.log(`${file}`);
                    });
                }
                else{
                    if(!exifData.image.ModifyDate){
                        fs.rename(path, `./edited/${file}`, (err) => {
                            if (err) throw err;
                        });
                    }
                    else{
                            var st = exifData.image.ModifyDate;
                            st = st.replace(/:/g,'')
                            st = st.replace(/ /g,'')
                            st = st.substring(0, st.length - 2) + "." + st.substring(st.length - 2)
                            var csv = `${file},${exifData.image.ModifyDate},touch -mt ${st} ${file}`
                            console.log(csv);
                    } 
                }
            });
        } catch (error) {
            var errormessage = `${file},${error.message}`
            fs.rename(path, `./edited/${file}`, (err) => {
                if (err) throw err;
                console.log(`${file}`);
            });
        }
    });
  });
  

/*fs.readdir(dir,function(err,files){
    if (err) throw err;
    files.forEach(function(file){
      if(file) {
        fs.readFile('./images/'+file, 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            try {
                new ExifImage({ image : 'IMG_20200927_125812630.jpg' }, function (error, exifData) {
                    if (error)
                        console.log('Error: '+error.message);
                    else
                        console.log(exifData.image.ModifyDate); // Do something with your data!
                });
            } catch (error) {
                console.log('Error: ' + error.message);
            }
        });
      }
    });
  });*/

/*try {
    new ExifImage({ image : dir + '/IMG_20200712_134716933.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message);
        else
            console.log(exifData); // Do something with your data!
    });
} catch (error) {
    console.log('Error: ' + error.message);
}*/