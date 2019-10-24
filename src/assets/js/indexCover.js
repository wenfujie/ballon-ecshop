
var height = (801 * $(window).width()) / 751;
var currentIndex = 0;
var dir = "up";
var dirs = "up";
var step = 1;
var move_Height = 0;

function move_event(_y, moveHeight, _end) {
    $("#container a").each(function (i) {
        if (currentIndex == i) {
            $(this).css("transform", "translateY("+(_end ? 0 : _y)+"px)");
            $(this).find("h1, p").addClass("active");
        } else if (currentIndex + 1 == i) {
            if (dirs == "up")
                $(this).css("transform", "translateY("+(_end ? height : height + _y)+"px)");
            else
                $(this).css("transform", "translateY("+(_end ? height : height + moveHeight)+"px)");
            $(this).find("h1, p").removeClass("active");
        } else if (i < currentIndex) {
            $(this).css("transform", "translateY("+(- height * (currentIndex - i) + _y)+"px)");
            $(this).find("h1, p").removeClass("active");
        } else if (i > currentIndex) {
            if(currentIndex+2==i && Math.abs(_y) > height && dir=="up")
                $(this).css("transform", "translateY("+(height + (height / 4) * (i - currentIndex - 1) + moveHeight*1.5)+"px)");
            else
                $(this).css("transform", "translateY("+(height + (height / 4) * (i - currentIndex - 1) + moveHeight)+"px)");
            $(this).find("h1, p").removeClass("active");
        }
    });
}

move_event(0, 0);

var startY = 0;
function touchStart(event) {
    /*event.preventDefault();*/
    var touchEvent = event.touches[0];
    startY = touchEvent.pageY;
    step = Math.ceil((startY - height)/(height/4));
    if(step >= 1){
        step = getStep(step);
    }else{
        step = 0;
    }
    $("#container a").removeClass("ant");
}

function getStep(step) {
    if(currentIndex + step <= $("#container a").length-1) return step;
    return getStep(step-1);
}

document.addEventListener("touchstart", touchStart, true);

function touchMove(event) {
    var touchEvent = event.touches[0];
    var moveY = touchEvent.pageY - startY;
    // console.log(moveY);
    if(moveY >= 0){
        move_Height = (Math.abs(moveY)>(height/4)?(height/4):moveY);
    }else{
        move_Height = (Math.abs(moveY)>(height/4)?(height/4)*(-1):moveY);
        if(Math.abs(moveY) > height){
            move_Height -= (Math.abs(moveY) - height);
        }
    }
    move_event(moveY, move_Height);
    if (moveY < -50)
        dir = "up";
    else
        dir = "down";

    if (moveY < 0)
        dirs = "up";
    else
        dirs = "down";
}

document.addEventListener("touchmove", touchMove, true);

var endY = 0
function touchEnd(event) {
    event.preventDefault();
    var touchEvent = event.changedTouches[0];
    var $aLen = $("#container a").length;
    endY = touchEvent.pageY;
    if(step==0 && startY-endY>5){
        step = 1;
    }else if(step==0 && Math.abs(startY-endY)<1){
        var $video = $('a[data-index='+currentIndex+']').find('video');
        if($video.length == 0){
            console.log("当前是点击事件！");
        }else{
            // $video.addClass("active");
            var $vObject = $video[0];
            $vObject.play();
        }
    }
    if ((dir == "up" || startY-endY >= 0) && currentIndex < $aLen-1){
        if(startY-endY < 1) currentIndex += step;
        else if(startY-endY <= height) currentIndex++;
        else if(startY-endY > height) {currentIndex += 2; if(currentIndex >= $aLen-1) currentIndex = $aLen-1;}
    }else if (dir == "down" && currentIndex>0){
        if(endY-startY > 20){
            currentIndex--;
        }
    }
    $("#container a").addClass("ant");
    move_event(0, 0, true)
}

document.addEventListener("touchend", touchEnd, true);
