function boxOnclick() {
    var insertBox = document.getElementById("boxbody");

/*     var randomColor = parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math
        .random() * 255);
    insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:rgb(" + randomColor +
        ")'></div>"
    var randomColor = parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math
        .random() * 255);
    var point = document.getElementById("showPoint");
    point.innerHTML = "<div class='box1' style='background:rgb(" + randomColor + ")'></div>" */

        var  col0 = 'red',
             col1 = 'green',
             col2 = 'pink',
             col3 = 'skyblue',
             col3 = 'gold',
             col4 = 'salmon',
             col5 = 'aqua',
             col6 = 'cadetblue',
             col7 = 'palegreen';

    var ran = parseInt(Math.random() * 8) + 1;
        switch (ran) {
        case 1:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col0 +" '></div>"
        break;
        case 2:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col1 +" '></div>"
        break;
        case 3:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col2 +" '></div>"
        break;
        case 4:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col3 +" '></div>"
        break;
        case 5:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col4 +" '></div>"
        break;
        case 6:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col5 +" '></div>"
        break;
        case 7:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col6 +" '></div>"
        break;
        case 8:
            insertBox.innerHTML = insertBox.innerHTML + "<div class='box0' style='background:" + col7 +" '></div>"
        break;
    }





}