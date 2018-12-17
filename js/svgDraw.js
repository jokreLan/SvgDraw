
var svg = document.querySelector('#svg');
var rect

// -------------------上传背景图----------

var input1 = document.getElementById("upload");

if (typeof FileReader === 'undefined') {
    alert("抱歉，你的浏览器不支持 FileReader");
    input1.setAttribute('disabled', 'disabled');
} else {

            input1.addEventListener('change', readFile, false);
   

}
function readFile() { 

    var file = this.files[0];//获取上传文件列表中第一个文件
    // var fileTypes = [".jpg", ".png", ".webp", ".bmp"];
    if (!/image\/\w+/.test(file.type)) {
        //图片文件的type值为image/png或image/jpg
        layer.alert("文件必须为图片！");
        return false; //结束进程
    }

    var size = file.size / 1024;
    if (size > 10240) {
        layer.alert("图片大小不能大于10M！");
        return false;
    }


    var reader = new FileReader();//实例一个文件对象
    reader.readAsDataURL(file);//把上传的文件转换成url
    //当文件读取成功便可以调取上传的接口
    reader.onload = function (e) {
        var image = new Image();
        // 设置src属性 
        // image.src = e.target.result;
        image.src = this.result;
  
        // 绑定load事件，加载完成后执行，避免同步问题
        image.onload = function () {
            var width = image.width;
            var height = image.height;
            if (width >= 640 | height >= 480) {
                // alert("文件尺寸符合！");
            } else {
                alert("图片必须大于640X480！");
                return false;
            }


            let xmlns = "http://www.w3.org/2000/svg";

            let svg_img = document.createElementNS(xmlns, "image");
           
            svg_img.href.baseVal = image.src;
         
            svg_img.setAttributeNS(null, "x", '0');
            svg_img.setAttributeNS(null, "y", '0');
            svg_img.setAttributeNS(null, "height", '100%');
            svg_img.setAttributeNS(null, "width", '100%');
            $(svg).append(svg_img);

        };
    }

};

// -----------------end-----------------


//--------- 画线-------------

$('#Line').click(function (event) {

    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active');
    Line.draw()
    rect = svg.getBoundingClientRect();

    // $('.note-box').remove()
});



var Line = {
    name: "line",
    draw: function () {
        var painting = false;
        var p_x;
        var p_y;

        var kk, dTo = '';

        $('#svg').mousemove(function (e) {
            if (painting === true) {
                var x = e.pageX - rect.x;
                var y = e.pageY - rect.y;
                let LineTo = 'L ' + x + ',' + y;
                dTo += (' ' + LineTo);
                kk.setAttribute("d", dTo);
                $('#svg').css('cursor', 'pointer');
            }
        });
        var color
        $('#svg').mousedown(function (e) {
            if ($('#Line').parent().hasClass('toolbar-active')) {
                painting = true;
                color = $("#color").val()
                p_x = e.pageX;
                p_y = e.pageY;
                
                console.log(p_x,p_y)
                p_x = p_x - rect.x
                p_y = p_y - rect.y
                console.log(rect)
                
                console.log(rect.x, rect.y)
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                kk = path
                path.setAttribute("class", "draw-path");
                path.setAttribute("stroke-linejoin", "round");
                path.setAttribute("stroke-width", "5");
                path.setAttribute("stroke", color);
                path.setAttribute("fill", "#ffffff");
                path.setAttribute("stroke-opacity", "1");
                path.setAttribute("fill-opacity", "0");
                let Moveto = 'M ' + p_x + ',' + p_y;
                dTo = Moveto
                path.setAttribute("d", Moveto);
                $('#svg').append(path);
            }
        })

        $('#svg').mouseup(function (e) {
            painting = false;

            if ($('#Line').parent().hasClass('toolbar-active')) { 
                  console.log('-----------------0000000')

            }
        });
        $('#svg').mouseleave(function (e) {
            painting = false;
            // context.closePath();
            $('#svg').css('cursor', '');
        });
    }
}


//  ------------------- 文字编辑------
$('#note').click(function (event) {

    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active');

    let div = '<div id="ftSize" style="	" class="fontSize">' +
    '<div onclick="fontSize(this)" class="fontItem" eid="22px">22</div>' +
    '<div  onclick="fontSize(this)" style="background:rgb(43, 144, 239) ;" class="fontItem" eid="28px">28</div>' +
    '<div  onclick="fontSize(this)" style="" class="fontItem" eid="36px">36</div>' +
    '</div>'
  $('#kuang').append(div)
    note.draw()
    rect = svg.getBoundingClientRect();
});

var  numFont = '28px';
function fontSize(e) {
  $(e).css('background-color', 'rgb(43, 144, 239)').siblings().css('background-color', 'rgba(34, 34, 34, .1)')
  numFont = $(e).attr('eid')
  $(e).parent().remove()
}

var drawText;
var note = {
    name: "note",
    draw: function () {
        var painting = false;
        var p_x;
        var p_y;
        var kk, dTo = '';
        $('#svg').mousedown(function (e) {
            if ($('#note').parent().hasClass('toolbar-active')) {
                painting = true;
                p_x = e.pageX;
                p_y = e.pageY;
                var drawX = p_x - rect.x
                var drawY = p_y - rect.y
   
                $('#textInput').css('top', drawY-20).css('left', drawX).attr('txtX',drawX).attr('txtY',drawY).show()
              
            
            }
        });
        $('#svg').mouseup(function (e) {
            painting = false;
        });
        $('#svg').mouseleave(function (e) {
            painting = false;
            $('#svg').css('cursor', '');
        });


    }
}

function submit(e){

   let txt=  $(e).prev().val()
   let X=$(e).parent('#textInput').attr('txtX')
   let Y=$(e).parent('#textInput').attr('txtY')
   let color = $("#color").val();
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", X);
    text.setAttribute("y", Y);
    text.setAttribute("text-anchor", "start");
    text.setAttribute("font-size", numFont);
    text.setAttribute("fill", color);
    text.setAttribute("stroke", "none");
    text.setAttribute("font-family", "Arial");
    text.textContent = txt; 
    $('#svg').append(text);   
    $(e).parent('#textInput').hide()
    $(e).prev().val('')

 
}

function cancel(e){
    $(e).parent('#textInput').hide()
    $(e).prev().prev().val('')
}

// --------橡皮擦------
$('#xpc').click(function (event) {

    $(this).parent().addClass('toolbar-active').siblings().removeClass('toolbar-active');
    xpc.draw()
    rect = svg.getBoundingClientRect();
});


var xpc = {
    name: "xpc",
    draw: function () {
        var painting = false;
        var p_x;
        var p_y;

        var kk, dTo = '';

        $('#svg').mousemove(function (e) {
            if (painting === true) {
                var x = e.pageX - rect.x;;
                var y = e.pageY - rect.y;;
         
                let LineTo = 'L ' + x + ',' + y;

                dTo += (' ' + LineTo);
  
                kk.setAttribute("d", dTo);
                $('#svg').css('cursor', 'pointer');
            }
        });
        $('#svg').mousedown(function (e) {
            if ($('#xpc').parent().hasClass('toolbar-active')) {
                painting = true;
                p_x = e.pageX - rect.y;;
                p_y = e.pageY - rect.y;;

                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                kk = path
                path.setAttribute("class", "draw-path");
                path.setAttribute("stroke-linejoin", "round");
                path.setAttribute("stroke-width", "54");
                path.setAttribute("stroke", "#fff");
                path.setAttribute("fill", "#ffffff");
                path.setAttribute("stroke-opacity", "1");
                path.setAttribute("fill-opacity", "0");
                let Moveto = 'M ' + p_x + ',' + p_y;
                dTo = Moveto
                path.setAttribute("d", Moveto);
                $('#svg').append(path);
            }
        })

        $('#svg').mouseup(function (e) {

            painting = false;
            if ($('#xpc').parent().hasClass('toolbar-active')) {
                console.log('------------383838---')
   
            }
        });
        $('#svg').mouseleave(function (e) {
            painting = false;
            // context.closePath();

            $('#svg').css('cursor', '');
        });
    }
}

// -------------清屏---
$('#qingping').click(function (event) {

    $(svg).children().remove()

});

$('#chexiao').click(function (e) {

    let del = svg.lastElementChild
    $(del).remove()

})

// ------保存图片

$("#xiazai").click(function (event) {
    var filename = '电子白板' + (new Date()).getTime()
    saveSvgAsPng(document.getElementById("svg"), filename + ".png");
});
