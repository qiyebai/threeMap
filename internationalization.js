// 把文件国际化的代码
const path = require('path');
const fs = require('fs');
const md5 = require('md5-node');
const axios = require('axios');
const readlineSync = require('readline-sync');

const enPath = './src/language/en.js';
const zhPath = './src/language/zh.js';
// const { objectData } = require(basePath+'/zh-en');
const reg = /[\u4e00-\u9fa5]+/g;
const objectData = {};
let textObject = {};
// eslint-disable-next-line no-use-before-define
const init = () => {
  console.log(`
  翻译启动中....
  可能需要执行多次代码
  第一次查询百度翻译
  第二次转化
  如果不完全可以执行第三次
  bug总是存在的^-^`);
  const dirname = readlineSync.question('请输入你要翻译的文件夹，请注意一定要是文件夹，例如：./src:') || './src';
  const setTime = readlineSync.question('请大概预估你要执行代码的时长，1s可以翻译6个单词左右,例如：10表示10s,也就是大致60个汉字需要翻译:') || 10;
  // 读取文件并翻译
  // const dirname = './src/pages/xitongguanli';
  // const setTime = 10;
  let enContent = fs.readFileSync(enPath, 'utf-8');
  let zhContent = fs.readFileSync(zhPath, 'utf-8');
  enContent = JSON.parse(enContent.substring(enContent.indexOf('{'), enContent.indexOf('}') + 1).replace(/\n/g, ''));
  zhContent = JSON.parse(zhContent.substring(zhContent.indexOf('{'), zhContent.indexOf('}') + 1).replace(/\n/g, ''));
  // eslint-disable-next-line guard-for-in
  for (const key in zhContent) {
    objectData[zhContent[key]] = enContent[key];
  }
  textObject = { ...objectData };
  // eslint-disable-next-line no-use-before-define
  fileDisplay(dirname);
  // 一段时间后进行存储
  setTimeout(() => {
    // 没有新增的翻译,本次结束
    if (Object.keys(textObject).length === Object.keys(objectData).length) {
      console.log('本次结束翻译完成');
    } else {
      fs.writeFile('./src/language/zh-en.js', `const objectData = ${JSON.stringify(textObject)};module.exports = {objectData};`, { encoding: 'utf-8', mode: '0666' }, function (err) {
        if (err) {
          console.log('zh-en.js文件写入失败');
        } else {
          console.log('zh-en.js文件写入成功');
        }
      });
      const enObject = {};
      const chObject = {};
      // eslint-disable-next-line guard-for-in
      for (const key in textObject) {
        enObject[textObject[key].replace(/\s/g, '')] = textObject[key];
        chObject[textObject[key].replace(/\s/g, '')] = key;
      }
      fs.writeFile(enPath, `const en = ${JSON.stringify(enObject)};export default en;`, { encoding: 'utf-8', mode: '0666' }, function (err) {
        if (err) {
          console.log('en.js文件写入失败');
        } else {
          console.log('en.js文件写入成功');
        }
      });
      fs.writeFile(zhPath, `const zh = ${JSON.stringify(chObject)};export default zh;`, { encoding: 'utf-8', mode: '0666' }, function (err) {
        if (err) {
          console.log('zh.js文件写入失败');
        } else {
          console.log('zh.js文件写入成功');
        }
      });
    }
  }, 1000 * parseInt(setTime, 0));
};
function fileDisplay(filePath) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      // 遍历读取到的文件列表
      // console.log(files)
      files.forEach(function (filename) {
        // 获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象 statSync
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            const isFile = stats.isFile();// 是文件
            const isDir = stats.isDirectory();// 是文件夹
            if (isFile) {
              let local_fileType = false;
              if (filedir.indexOf('.js') > -1) {
                local_fileType = 'js';
              }
              if (filedir.indexOf('.vue') > -1) {
                local_fileType = 'vue';
              } else {
                return false;
              }
              // 读取文件
              let content = fs.readFileSync(filedir, 'utf-8');
              // 取出文件中的中文
              const caArry = content.match(reg);
              // vue文件中的script位置，上下匹配的规则不一样和
              const local_script = content.indexOf('<script>');
              const local_translateArry = [];
              if (caArry) {
                // 判断文件中的中文是不是都有翻译
                caArry.forEach((item) => {
                  if (!objectData[item]) {
                    local_translateArry.push(item);
                  }
                });
                // 如果没有翻译的时候，进行翻译
                if (local_translateArry.length > 0) {
                  // eslint-disable-next-line no-use-before-define
                  translate(local_translateArry);
                } else {
                  // 都有翻译的时候进行匹配和替换工作
                  caArry.forEach((item) => {
                    // 匹配汉字的正则,默认js是单引号，html是双引号
                    const local_reg = new RegExp(item);
                    const local_regSingle = new RegExp(`'${item}'`);
                    const local_regDouble = new RegExp(`"${item}"`);
                    // 判断汉字的位置是否在html里面还是在js里面的比较值
                    const local_nowIndex = content.indexOf(item);
                    // 判断如果是js文件,纯js文件需要导入vue这个变量才能进行i18n的转化，请手动传人参数_this指向vue实例
                    if (local_fileType === 'js') {
                      content = content.replace(local_regSingle, `_this.$t('${objectData[item].replace(/\s/g, '')}')`);
                    }
                    // 判断如果是vue文件
                    if (local_fileType === 'vue') {
                      // 判断是vue文件中的html
                      if (local_nowIndex < local_script) {
                        const caArrys = content.match(local_regDouble);
                        // 匹配是文件填充还是变量填充
                        if (caArrys) {
                          content = content.replace(local_reg, `$t('${objectData[item].replace(/\s/g, '')}')`);
                        } else {
                          content = content.replace(local_reg, `{{$t('${objectData[item].replace(/\s/g, '')}')}}`);
                        }
                      } else {
                        try {
                          content = content.replace(local_regSingle, `this.$t('${objectData[item].replace(/\s/g, '')}')`);
                        } catch (e) {
                          debugger;
                        }
                      }
                    }
                  });
                  // 翻译完成后直接写入
                  // eslint-disable-next-line no-shadow
                  fs.writeFile(filedir, content, { encoding: 'utf-8', mode: '0666' }, function (err) {
                    if (err) {
                      console.log(`${filedir}文件写入失败`);
                    } else {
                      console.log(`${filedir}文件写入成功`);
                    }
                  });
                }
              }
            }
            if (isDir) {
              fileDisplay(filedir);// 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}
// 循环翻译
function translate(data) {
  data.forEach((item) => {
    console.log(`找不到我:${item},翻译查询中...`);
    // eslint-disable-next-line no-use-before-define
    baiduTranslate(item);
  });
}
let iTime = 0;
// 翻译出对应的英文
function baiduTranslate(value) {
  const AppId = '20200905000559282';
  const key = 'qCjJPFNdUQv3wKfKh6z8';
  const salt = '1435660288';
  const params = value;
  const sign = md5(AppId + params + salt + key);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${params}&from=zh&to=en&appid=${AppId}&salt=${salt}&sign=${sign}`;
  iTime++;
  // 百度翻译有读取时间限制，1s最多10条，所以设置定时器慢慢读取
  setTimeout(async () => {
    // 再次校验是否存在
    if (textObject[value]) {
      return false;
    }
    const response = await axios.get(encodeURI(url));
    if (response.data.trans_result) {
      const { src, dst } = response.data.trans_result[0];
      console.log(`翻译查到我了，数据存储中${src}:${dst}...`);
      textObject[src] = dst;
    } else {
      console.log(params);
    }
  }, iTime * 150);
}
init();
// module.exports = {
//   init,
// };


