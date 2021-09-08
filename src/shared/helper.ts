const fs = require("fs");
const path = require('path');
export const moveTmpToMain = async (data = [], dir='') => {

    return data.map(item => {
        if (item && item.includes("upload/tmp")) {
            if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
                const tmpPath = './public/upload/tmp/' + path.basename(item);
                if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
                    fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
                }
                const mainPath = (dir) ? "images/" + dir : "images";
                const newItem = tmpPath.replace('tmp', mainPath);
                fs.renameSync(tmpPath, newItem);
                return item.replace('tmp', mainPath);
            }
            return item;
        }
        else {
            return item;
        }
    })
}

export const moveSingleTmpToMain = async (item, dir = '') => {
    if (item && item.includes("upload/tmp")) {
        if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
            const tmpPath = './public/upload/tmp/' + path.basename(item);
            if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
                fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
            }
            const mainPath = (dir) ? "images/" + dir : "images";
            const newItem = tmpPath.replace('tmp', mainPath);
            fs.renameSync(tmpPath, newItem);
            return item.replace('tmp', mainPath);
        }
        return item;
    }
    else {
        return item;
    }
}

export const moveTmpToMainObject = async (data = [], dir='') => {

    return data.map(itemObj=> {
        if(itemObj && itemObj.url) {
            let item = itemObj.url;
            if (item && item.includes("upload/tmp")) {
                if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
                    const tmpPath = './public/upload/tmp/' + path.basename(item);
                    if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
                        fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
                    }
                    const mainPath = (dir) ? "images/" + dir : "images";
                    const newItem = tmpPath.replace('tmp', mainPath);
                    fs.renameSync(tmpPath, newItem);
                    item = item.replace('tmp', mainPath);
                }
            }
            itemObj.url = item;
        } 
        
        return itemObj;
    })
}