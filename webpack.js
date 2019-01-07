const fs = require('fs');
const path = require('path');
const build = require('./src/buildDeps');
const writeChunk = require('./src/writeChunk');

var files = [];
// 如果存在此目录，删除目录下文件
if( fs.existsSync('./dist') ) {
    files = fs.readdirSync('./dist');
    files.forEach(function(file,index){
        var curPath = './dist/' + file;
        fs.unlinkSync(curPath);
    });
}else {
  // 如果不存在，创建目录
  console.log("文件不存在")
  fs.mkdirSync('./dist');
}

// 将index.html文件拷贝到dist目录
fs.copyFileSync('./index.html', './dist/index.html');

// 主要功能部分，对require进行模块整理
build('main', {context: './demo'}).then((res)=> {
  let chunkStr = writeChunk(res); // 各个文件的模块对象字符串
  let templateStr = fs.readFileSync('./src/template.js', 'utf-8');
  let bundleStr = templateStr + '({' + chunkStr + '})';
  fs.writeFile('./dist/bundle.js', bundleStr, function(err) {
    if(err) {
      console.log(err);
    }
  } );
});