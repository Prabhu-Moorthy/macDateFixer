const fs = require('fs');
const ExifImage = require('exif').ExifImage;
const exec = require('child_process').exec;

var dir = './images';
var incrementSeconds = 0;

fs.readdir(dir,function(err,files){
    if (err) throw err;
    files.forEach(function(file){
        var dateTimeUpdated,year,month,date,hours,minutes,seconds;
        if(file && !file.startsWith('.')) {
            if(incrementSeconds >= 59) incrementSeconds = 0
            incrementSeconds = incrementSeconds + 1;
            var fileNameDate = file.match(/(19|20)\d{6}/g);
            var fineNameTime = file.match(/(0|1|2)\d{5}/g);
            if(fileNameDate && fineNameTime && fileNameDate.length > 0 && fineNameTime.length > 1){
                year = fileNameDate[0].substring(0,4);
                month = fileNameDate[0].substring(4,6);
                date = fileNameDate[0].substring(6);
                hours = fineNameTime[1].substring(0,2)
                minutes = fineNameTime[1].substring(2,4)
                seconds = fineNameTime[1].substring(4)
                if(isValidDate(month,date,hours,minutes,seconds)){
                    dateTimeUpdated = `${year}${month}${date}${hours}${minutes}.${seconds}`;
                    touch(`${file},${dateTimeUpdated},FileNameTime`,`touch -mt ${dateTimeUpdated} '${dir}/${file}'`);
                }
            }
            if(!dateTimeUpdated && fileNameDate){
                year = fileNameDate[0].substring(0,4);
                month = fileNameDate[0].substring(4,6);
                date = fileNameDate[0].substring(6);
                hours = `10`;
                minutes = `11`;
                seconds = incrementSeconds.toString().padStart(2, '0');
                if(isValidDate(month,date,hours,minutes,seconds)){
                    dateTimeUpdated = `${year}${month}${date}${hours}${minutes}.${seconds}`;
                    touch(`${file},${dateTimeUpdated},FileNameDate`,`touch -mt ${dateTimeUpdated} '${dir}/${file}'`);
                }
            }
            if(!dateTimeUpdated){
                const path = `${dir}/${file}`
                new ExifImage({ image : path }, function (error, exifData) {
                    if (error){
                        var errormessage = `${file},${error.message}`
                        fs.stat(`${dir}/${file}`, function(err, stats) {
                            // console.log(stats);
                            const dateObject = new Date(stats.mtimeMs)
                            year = dateObject.getFullYear();
                            month = (dateObject.getMonth()+1).toString().padStart(2, '0')
                            date = dateObject.getDate().toString().padStart(2, '0')
                            hours = dateObject.getHours().toString().padStart(2, '0')
                            minutes = dateObject.getMinutes().toString().padStart(2, '0')
                            seconds = dateObject.getSeconds().toString().padStart(2, '0')
                            dateTimeUpdated = `${year}${month}${date}${hours}${minutes}.${seconds}`;
                            touch(`${file},${dateTimeUpdated},Stat`,`touch -mt ${dateTimeUpdated} '${dir}/${file}'`);
                        })
                    }
                    else{
                        // console.log(exifData);
                        var createExifDateTimeString = exifData.exif.CreateDate;
                        var modifiedExifDateTimeString = exifData.image.ModifyDate;

                        createExifDateTimeString = createExifDateTimeString.replace(/:| /g,'');
                        modifiedExifDateTimeString = modifiedExifDateTimeString.replace(/:| /g,'');
                        
                        var createExifDate = dateFromExifString(createExifDateTimeString);
                        var modifiedExifDate = dateFromExifString(modifiedExifDateTimeString);
                        
                        if(createExifDate && modifiedExifDate){
                            if(createExifDate >= modifiedExifDate) {
                                dateTimeUpdated = createExifDateTimeString.substring(0, createExifDateTimeString.length - 2) + "." + createExifDateTimeString.substring(createExifDateTimeString.length - 2)
                                touch(`${file},${dateTimeUpdated},ExifCreateDate`,`touch -mt ${dateTimeUpdated} '${dir}/${file}'`);
                            } else {
                                dateTimeUpdated = modifiedExifDateTimeString.substring(0, modifiedExifDateTimeString.length - 2) + "." + modifiedExifDateTimeString.substring(modifiedExifDateTimeString.length - 2)
                                touch(`${file},${dateTimeUpdated},ExifModifyDate`,`touch -mt ${dateTimeUpdated} '${dir}/${file}'`);
                            } 
                        } else {
                            console.log(`******${file},ExifError`)
                        }
                    }
                });
            }
        }
    });
});

function isValidDate(month,date,hours,minutes,seconds){
    if(parseInt(month) > 0 && parseInt(month) <= 12 && 
        parseInt(date) > 0 && parseInt(date) <= 31 &&
        parseInt(hours) > 0 && parseInt(hours) <= 24 
        && parseInt(minutes) <= 60 && parseInt(seconds) <= 60){
            return true;
        }
    return false;
}

function touch(output,script){
    console.log(`${output},${script}`);
    // exec(script,
    // (error, stdout, stderr) => {
    //     if (error) console.log(`******************${output},${error}`);
    //     else console.log(`${output},passed`);
    // });
}

function dateFromExifString(dateTimeExifString){
    var dateExifString = dateTimeExifString.substring(0,8)
    var timeExifString = dateTimeExifString.substring(8)
    var year = dateExifString.substring(0,4);
    var month = dateExifString.substring(4,6);
    var date = dateExifString.substring(6);
    var hours = timeExifString.substring(0,2);
    var minutes = timeExifString.substring(2,4);
    var seconds = timeExifString.substring(4);
    var dateTimeExif = new Date();
    
    if(isValidDate(month,date,hours,minutes,seconds)){
        dateTimeExif.setUTCFullYear(year)
        dateTimeExif.setUTCMonth(month-1)
        dateTimeExif.setUTCDate(date)
        dateTimeExif.setUTCHours(hours);
        dateTimeExif.setUTCMinutes(minutes)
        dateTimeExif.setUTCSeconds(seconds)
        return dateTimeExif;
    }
    return null;
}