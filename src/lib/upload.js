 //文件处理类
 class File{
    constructor(verify){
        //存储文件数据
        this.fileData = [];
        //验证格式
        this.verify = verify;
    }
    readFile(files) {
        // this.files = files;
        var self = this;
        var fileLength = 0;
        var data = [];
        
        return new Promise(function(resolve, reject){
            self.files = self.checking(files)
            if(self.files.length != 0){
                var reader = new FileReader();
                //在FileReader对象中获取文件内容
                reader.readAsDataURL(self.files[fileLength]);
                //当本地文件读取完毕后调用以下函数
                reader.onload = function(event) {
                    self.fileData.push(event.target.result);
                    data.push(event.target.result);
                    fileLength ++;
                    if(fileLength < self.files.length){
                        reader.readAsDataURL(self.files[fileLength]);
                    }else{
                        resolve([self, data]);
                    }
                
                }
            }else{
                reject(self);
            }
            
        })
    }
    //base64数据转换为blob二进制数据
    transformBlob(files) {
        return files.map((file) =>{
            return this.convertBase64UrlToBlob(file);
        })
    }
    convertBase64UrlToBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    //获取字节单位
    transKB(bytes) {
        if (isNaN(bytes)) {
            return '';
        }
        var symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var exp = Math.floor(Math.log(bytes)/Math.log(2));
        if (exp < 1) {
            exp = 0;
        }
        var i = Math.floor(exp / 10);
        bytes = bytes / Math.pow(2, 10 * i);

        if (bytes.toString().length > bytes.toFixed(2).toString().length) {
            bytes = bytes.toFixed(2);
        }
        return bytes + ' ' + symbols[i];
    }
    //文件验证
    checking(files) {
        var self = this;
        var files = Object.values(files);
        this.error = [];
        return files.filter((file)=>{
            var flag = true;
            var errMsg = [];
            if(this.verify['size'] && (file['size'] > this.verify['size'])){
                errMsg.push({
                    "name": file['name'],
                    "type": "size",
                    "info": "上传文件大小超过" + self.transKB(this.verify['size'])
                })
                flag = false;
            }
            var type = file['type'] && file['type'].split('/');
            if(file['type'] && (this.verify['type'].toString().indexOf(type[1]) == -1)){
                errMsg.push({
                    "name": file['name'],
                    "type": "type",
                    "info": "上传文件格式不正确"
                })
                flag = false;
            }
            if(!flag){
                self.error.push(errMsg);
                return false;
            }
            return true;
        });
    }
    //获取错误信息
    getError() {
        var sizeError = '';
        var sizeErrorInfo;
        var typeError = '';
        var typeErrorInfo;
        var errorInfo = [];
        this.error.map((items) =>{
            items.map((item) =>{
                if(item['type'] == "size") {
                    sizeError += item['name'] + ', '; 
                    sizeErrorInfo = item['info'];          
                }else if(item['type'] == 'type'){
                    typeError += item['name'] + ',';
                    typeErrorInfo = item['info'];
                }
            })
        })
        sizeErrorInfo && errorInfo.push(sizeError + sizeErrorInfo);
        typeErrorInfo && errorInfo.push(typeError + typeErrorInfo);
        return errorInfo;
    }
    //图片预览
    /*
    *第一个参数：需要显示的文件
    *第二个参数：canvas画布
    *第三个参数：放入拖拽文件的节点
    *第四个参数：需要在哪个子节点前插入图片浴帘
    */
    previewFile(files, ctx, holderDom, updateFileDom) {
        files.map(function(file){
            //创建一个image对象
            var img = new Image();
            // //将读取的二进制位图像数据赋予该对象
            img.src = event.target.result;
            img.onload = function() {
                //清除canvas中已有的内容
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                //将image对象显示在canvas中
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                //删除image对象，以释放缓存
                delete this;
                var imgDom = document.createElement("img");
                imgDom.src = file;
                imgDom.className ="updateImg";
                //插入img节点
                holder.insertBefore(imgDom, updateFile);
            }
        })
    
    }
}
module.exports  = {
    File
}