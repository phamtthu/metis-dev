const fs = require('fs');
const path = require('path');

export const moveTmpToMain = async (data = [], dir = '') => {
  return data.map((item) => {
    if (item && item.includes('upload/tmp')) {
      if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
        const tmpPath = './public/upload/tmp/' + path.basename(item);
        if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
          fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
        }
        const mainPath = dir ? 'images/' + dir : 'images';
        const newItem = tmpPath.replace('tmp', mainPath);
        fs.renameSync(tmpPath, newItem);
        return item.replace('tmp', mainPath);
      }
      return item;
    } else {
      return item;
    }
  });
};

export const moveSingleTmpToMain = async (item, dir = '') => {
  if (item && item.includes('upload/tmp')) {
    if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
      const tmpPath = './public/upload/tmp/' + path.basename(item);
      if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
        fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
      }
      const mainPath = dir ? 'images/' + dir : 'images';
      const newItem = tmpPath.replace('tmp', mainPath);
      fs.renameSync(tmpPath, newItem);
      return item.replace('tmp', mainPath);
    }
    return item;
  } else {
    return item;
  }
};

export const moveTmpToMainObject = async (data = [], dir = '') => {
  return data.map((itemObj) => {
    if (itemObj && itemObj.url) {
      let item = itemObj.url;
      if (item && item.includes('upload/tmp')) {
        if (fs.existsSync('./public/upload/tmp/' + path.basename(item))) {
          const tmpPath = './public/upload/tmp/' + path.basename(item);
          if (dir && !fs.existsSync('./public/upload/images/' + dir)) {
            fs.mkdirSync('./public/upload/images/' + dir, { recursive: true });
          }
          const mainPath = dir ? 'images/' + dir : 'images';
          const newItem = tmpPath.replace('tmp', mainPath);
          fs.renameSync(tmpPath, newItem);
          item = item.replace('tmp', mainPath);
        }
      }
      itemObj.url = item;
    }

    return itemObj;
  });
};

export const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
};

export const getOriginURL = (req) => {
  return req.protocol + '://' + req.headers.host;
};

export const isTwoArrayEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.some((e) => arr2.includes(e)) &&
    arr2.some((e) => arr1.includes(e))
  );
};

export const getNestedList = (parent = null, flatArray = []) => {
  const nest = (items, _id = parent, link = 'parent') =>
    items
      .filter((item) => item[link]?.toString() === _id?.toString())
      .map((item) => ({ ...item, children: nest(items, item._id) }));
  return nest(flatArray);
};

export const paginator = (items, offset = 0, limit = 10) => {
  let page = offset / limit + 1;
  let total_pages = Math.ceil(items.length / limit);
  return {
    data: items.slice(offset, offset + limit),
    total: items.length,
    offset: offset,
    per_page: limit,
    total_pages: total_pages,
    page: Math.floor(page),
    pre_page: page - 1 > 1 ? Math.floor(page - 1) : null,
    next_page: page >= total_pages ? null : Math.floor(page + 1),
  };
};
