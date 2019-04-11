export function download(res,file){
    if (res.data.type === "application/json") {
         this.$message({
         type: "error",
         message: "下载失败，文件不存在或权限不足"
         });
     } else {
         let blob = new Blob([res.data]);
         console.log(res)
         if (window.navigator.msSaveOrOpenBlob) {
         navigator.msSaveBlob(blob, file.name);
         } else {
         let link = document.createElement("a");
         let evt = document.createEvent("HTMLEvents");
         evt.initEvent("click", false, false);
         link.href = URL.createObjectURL(blob); 
         link.download = file.name;
         link.style.display = "none";
         document.body.appendChild(link);
         link.click();
         window.URL.revokeObjectURL(link.href);
         }
     }
         
     

 }