var GVerify = /** @class */ (function () {
    /**
     * 生成验证码
     * @param {String} parentId     //容器Id
     * @param {String} canvasId     //canvas的ID
     */
    function GVerify(parentId, canvasId) {
        this.options = {
            id: "",
            //容器Id
            canvasId: "",
            //canvas的ID
            width: 100,
            //默认canvas宽度
            height: 30,
            //默认canvas高度
            code: ""
        };
        this.options.id = parentId;
        this.options.canvasId = canvasId;
        this._init(); //初始化
    }
    /**初始化方法**/
    GVerify.prototype._init = function () {
        var con = document.getElementById(this.options.id); //获得验证码的DIV
        var canvas = document.getElementById(this.options.canvasId); //获得画布  IE不能支持canvas，可以增加excanvas.js插件，但是还是不支持createelement()的形式
        con.offsetWidth > 0 && (this.options.width = con.offsetWidth); //如果有宽度就使用自己的，没有就默认100
        con.offsetHeight > 0 && (this.options.height = con.offsetHeight);
        canvas.id = this.options.canvasId; //为兼容IE把这些去掉
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        canvas.style.cursor = "pointer";
        canvas.innerHTML = "您的浏览器版本不支持canvas";
        con.appendChild(canvas);
        // var parent = this; //把this赋值parent
        // canvas.onclick = function() { //验证码点击切换刷新
        //     parent.refresh();
        // }
    };
    /**生成验证码**/
    GVerify.prototype.refresh = function () {
        var canvas = document.getElementById(this.options.canvasId); //获得验证码画布
        if (canvas.getContext) { //
            var ctx = canvas.getContext('2d'); //获得绘画对象
        }
        else { //
            return;
        }
        ctx.textBaseline = "middle";
        ctx.fillStyle = randomColor(180, 240);
        ctx.fillRect(0, 0, this.options.width, this.options.height); //绘制矩形 
        /* x:矩形起点横坐标（坐标原点为canvas的左上角，当然确切的来说是原始原点，后面写到变形的时候你就懂了，现在暂时不用关系）
   y:矩形起点纵坐标
   width:矩形长度
   height:矩形高度*/
        var codeArr = this.options.code.split('');
        for (var i = 1; i <= codeArr.length; i++) {
            var txt = codeArr[i - 1]; //取得一个字符
            ctx.font = randomNum(this.options.height / 2, this.options.height) + 'px SimHei'; //随机生成字体大小
            ctx.fillStyle = randomColor(50, 160); //填充的样式 随机生成字体颜色    
            ctx.shadowOffsetX = randomNum(-3, 3); //阴影的横向位移量
            ctx.shadowOffsetY = randomNum(-3, 3); //阴影的纵向位移量
            ctx.shadowBlur = randomNum(-3, 3); //阴影的模糊范围（值越大越模糊）
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; //阴影的颜色
            var x = this.options.width / 5 * i;
            var y = this.options.height / 2;
            var deg = randomNum(-30, 30);
            /**设置旋转角度和坐标原点
     *
     * 平移context.translate(x,y)
     *  x:坐标原点向x轴方向平移x
     *  y:坐标原点向y轴方向平移y
     *
     * **/
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180); //旋转context.rotate(angle)
            ctx.fillText(txt, 0, 0); //context.fillText(text,x,y) 
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y);
        }
        /**绘制干扰线**/
        for (var i = 0; i < 4; i++) {
            ctx.strokeStyle = randomColor(40, 180); //随机颜色
            ctx.beginPath(); //路径 context.beginPath()
            ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height)); //绘制线段 context.moveTo(x,y) context.lineTo(x,y)
            ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
            ctx.stroke();
        }
        /**绘制干扰点**/
        for (var i = 0; i < this.options.width / 4; i++) {
            ctx.fillStyle = randomColor(0, 255);
            ctx.beginPath();
            ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI); // 圆弧context.arc(x, y, radius, starAngle,endAngle, anticlockwise)
            ctx.fill();
        }
    };
    /**
    * 验证验证码
    * @param {String} code     //验证验证码字符串
    */
    GVerify.prototype.validate = function (code) {
        var code = code.toLowerCase();
        var v_code = this.options.code.toLowerCase();
        if (code == v_code) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
    * 设置验证码
    * @param {String} code     //设置验证码字符串
    */
    GVerify.prototype.setCode = function (code) {
        this.options.code = code;
        this.refresh();
    };
    return GVerify;
}());
/**生成一个随机数**/
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
/**生成一个随机色**/
function randomColor(min, max) {
    var r = randomNum(min, max);
    var g = randomNum(min, max);
    var b = randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
}
// export default GVerify
