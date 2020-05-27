var fs = require('fs');
var ejs = require('ejs');
var pinyin = require("chinese-to-pinyin");
var _=require("underscore");
function loadTmp(fileName,callback){
  //console.log(fileName);
  fs.readFile(fileName, 'utf8', function (err, text) {
    if(err) {
      callback(err);
      return;
    }
    callback(text);
  });
}

function getContent(fileName,callback){
  loadTmp(fileName,function (text) {
    console.log(text);
    var arry=text.split(/<p>|<\/p>|¤/);  // <p> , </p> 分割
    var narry=Array.from(new Set(arry)); // 去重
    //console.dir(narry);
    narry.splice(narry.indexOf('\r\n'),1); // 去换行
    narry.splice(narry.indexOf('&nbsp;'),1); // 去换行
    narry.splice(narry.indexOf(''),1); // 去空
    //console.dir(narry);
    callback(narry);
  });
}
function getFirstSection(chapter){
  //console.dir(chapter);
  var arry=chapter.split(/。|？|；|！/);
  //arry=arry[0].split("；");
  //arry=arry[0].split("？");
  //console.dir(arry);
  console.dir(arry[0]);
  return arry[0];
}
function getNewLine(chapter){
  //console.dir(chapter);
  var nline=chapter.replace(/。|？|；|！/g,"$&\r\n"); // 全局替换，句号后加换行
  //console.dir(nline);
  return nline;
}

function saveToFile(textArray){
  var chapters=[];
  //console.log(textArray);
  for (var i = 0; i < textArray.length; i++) {
    var line=textArray[i];
    var fileName=getFirstSection(line);
    console.log(fileName);
    var nline=getNewLine(line);
    chapters.push(fileName);
    fileName='../chapters/'+fileName.substr(0,2)+'.md';
    //fileName=fileName+'.md';
    converContex(fileName,nline);

  }
  updateSummry(chapters);
}

function converContex(fileName,nline){
  var title= getFirstSection(nline);
  var content=nline.slice(3); //删除行号
  console.log(content);

  contents=content.split('\r\n');
  console.log(content);
  contents=_.map(contents,function(item){
    return{
      src:item,
      des:pinyin(item, { keepRest: true })
    };
  });
  //console.log(contents);
  var param={'title':title,'contents':contents};
  //console.log(fileName);
  fs.readFile('temp.ejs', 'utf8', function (err, text) {
    console.log(param);
    var result=ejs.render(text,param);
    fs.writeFileSync(fileName, result); //save file
    //callback(result);
  });
}
function convertFile(fileName){
  getContent(fileName,function(textArray){
      saveToFile(textArray);
  });
}
function updateSummry(chapters){
  var nchapters=_.map(chapters,function(item){
    return{
      src:item,
      chapter:item.substr(0,2)
    };
  });
  var param={'chapters':nchapters};
  fs.readFile('SUMMARY.ejs', 'utf8', function (err, text) {
    var result=ejs.render(text,param);
    fs.writeFileSync('../SUMMARY.md', result); //save file
    //callback(result);
  });

}

function getSecment(textStr){
  //console.dir(chapter);
  var textArray=textStr.split(/。|？|；|！/); //
  console.dir(textArray);
  return textArray;
}

//getFirstSection('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。');
//getNewLine('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。');

//getSecment('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。天地之间，其犹橐迭乎？虚而不屈，动而愈出。豫兮若冬涉川；犹兮若畏四邻；俨兮其若容；涣兮若冰之将释；敦兮其若朴；旷兮其若谷；混兮其若浊；澹兮其若海；飉(liáo,风的声音)兮若无止。荒兮其未央哉！众人熙熙如享太牢、如春登台。');

//生成文件
convertFile('./daode-org.md');
//console.log('&#x6301;&#x800C;&#x76C8;&#x4E4B;&#x4E0D;&#x5982;&#x5176;&#x5DF1;&#xFF1B;');
//console.log('\u6301 \u800C');
//var tmp ='&#x6301;&#x800C;&#x76C8;&#x4E4B;&#x4E0D;&#x5982;&#x5176;&#x5DF1;&#xFF1B;'.replace(/&#x/g,'\\u').replace(/;/g,' ');
//console.log(tmp);

//console.log(pinyin('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。'));
