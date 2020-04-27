import '../../stylus/index.styl';
import  {File } from '../../lib/upload.js'
import 'lib-flexible/flexible';

//定义全局变量
var holder = document.getElementById("holder");
var canvas = document.getElementById("canvas");
var addFile = document.getElementById("addFile");
var modal = document.getElementById("modal");
canvas.width = window.innerWidth -1;
canvas.height = window.innerHeight -1;
var ctx = canvas.getContext("2d");
var updateFile = document.getElementById("updateFile");
var fileBlob = [];

function handleFile(drapDom, inputDrom, modalDom){
    var verifyImg = {
        size: 353936,
        type: ['jpeg', 'jpg', 'png']
    }
    var fileObj =  new File(verifyImg);
    //检测浏览器是否支持HTML5 File API
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //必须存在，不要文件无法拖拽到元素上
        drapDom.ondragover = function(){
            return false;
        }
        //将文件拖拽到元素上方，并放开鼠标左键，触发drop事件
        drapDom.ondrop = function(e) {
            //阻止默认事件
            e.preventDefault();
            //通过该事件参数的dataTransfer属性获得所传输的数据详情
            //获取到所拖拽的第一个文件
            var dataTransferData = e.dataTransfer.files;
            handleRead(dataTransferData);
            return false;
        }
        modalDom.querySelector(".modal_close").onclick = function(){
            modalDom.classList.remove("show");
        }
        function getError(self){
            var errorOutput = '';
            if(self.error.length !=0){
                var errorInfo = self.getError();
                errorInfo.map((info) =>{
                    errorOutput += `<p>${info}</p>`;
                })
                modalDom.querySelector(".modal_content").innerHTML = errorOutput;
                modalDom.classList.add("show");
            }
        }
        //通过File类读取文件数据
        function handleRead(dataFile){
            fileObj.readFile(dataFile).then(([self, files])=>{
                self.previewFile(files, ctx, holder, updateFile);
                //需要上传的二进制文件
                fileBlob = fileBlob.concat(self.transformBlob(files));
                getError(self);
            },(self)=>{
                getError(self);
            })
        }
        //input按钮选择文件
        inputDrom.onchange = function(e){
            handleRead(e.target.files);
        }
    }else {
        console.log("HTML5 File API在您的浏览器中是不完全支持的");
    }
}
handleFile(holder, addFile, modal);