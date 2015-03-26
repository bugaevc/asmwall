$(document).ready(function() {
    $in = $("#instructions");
    $.get("data/instructions.md", function(data) {
            var arr = data.split("\n");
            var $list = undefined;
            for(var i = 0; i < arr.length; i++)
            {
                arr[i] = $.trim(arr[i]);
                if(arr[i][0] === '=')
                {
                    $list = $("<ul></ul>")
                    $("<h2></h2>")
                        .text(arr[i-1])
                        .appendTo($in)
                        .after($list);
                }
                if(arr[i][0] === '#')
                {
                    var content = arr[i].replace(/#/gi, '').replace(/`/gi, '');
                    content = $.trim(content);
                    $("<li></li>").text(content).appendTo($list);
                }
            }
        });
});
