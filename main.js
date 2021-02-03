const fs = require('fs');
var file = 'DaytoNightAutumn.mp4';

var dir = './images';
var incrementSeconds = 0;
fs.readdir(dir,function(err,files){
    if (err) throw err;
    files.forEach(function(file){
        if(file && !file.startsWith('.')) {
            if(incrementSeconds >= 59) incrementSeconds = 0
            incrementSeconds = incrementSeconds + 1;
            var fileNameDate = file.match(/(19|20)\d{6}/g)
            if(fileNameDate){
                var dateTimeUpdated = `${fileNameDate[0]}1011.${incrementSeconds.toString().padStart(2, '0')}`; 
                console.log(`${file},${dateTimeUpdated},FileNameDate,touch -mt ${dateTimeUpdated} ${file}`);
            }else{
                fs.stat(`${dir}/${file}`, function(err, stats) {
                    //console.log(stats.isDirectory());
                    //console.log(stats);
                    const dateObject = new Date(stats.mtimeMs)
                    const year = dateObject.getFullYear();
                    const month = (dateObject.getMonth()+1).toString().padStart(2, '0')
                    const date = dateObject.getDate().toString().padStart(2, '0')
                    const hours = dateObject.getHours().toString().padStart(2, '0')
                    const minutes = dateObject.getMinutes().toString().padStart(2, '0')
                    const seconds = dateObject.getSeconds().toString().padStart(2, '0')
                    var dateTimeUpdated = `${year}${month}${date}${hours}${minutes}.${seconds}`;
                    console.log(`${file},${dateTimeUpdated},Stat,touch -mt ${dateTimeUpdated} ${file}`)
                })
            }
            //console.log(file)
        }
    });
});

/*fs.stat('./images/'+file, function(err, stats) {
    //console.log(stats.isDirectory());
    console.log(stats);
    const dateObject = new Date(stats.mtimeMs);
    console.log(stats.mtime.getMonth()+1)

    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth()+1).toString().padStart(2, '0')
    const date = dateObject.getDate().toString().padStart(2, '0')
    const hours = dateObject.getHours().toString().padStart(2, '0')
    const minutes = dateObject.getMinutes().toString().padStart(2, '0')
    const seconds = dateObject.getSeconds().toString().padStart(2, '0')
    console.log(`${year}${month}${date}${hours}${minutes}.${seconds}`)
})*/