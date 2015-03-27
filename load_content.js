$(document).ready(function() {
    $in = $("#content");
    var showAll = (location.search.length === 0);
    if(!showAll)
    {
        var command = location.search.slice(1);
        command = command.replace(/_/g, ' ').replace(/\//g, '');
        console.log(command);
        var md = ""; // markdown code of the current section
        var isCurrent = false; // whether we are inside the needed section
    }
    else
    {
        $in.addClass("instructions");
        var $list = undefined;
    }
    $.get("data/instructions.md", function(data) {
            var arr = data.split("\n");
            for(var i = 0; i < arr.length; i++)
            {
                arr[i] = $.trim(arr[i]);
                if(arr[i][0] === '=')
                    if(showAll)
                    {
                        $list = $("<ul></ul>")
                        $("<h2></h2>")
                            .text(arr[i-1])
                            .appendTo($in)
                            .after($list);
                    }
                    else if(isCurrent)
                    {
                        isCurrent = false;
                        // We have already added an extra line
                        md = md.slice(0, -1);
                        md = md.slice(0, md.lastIndexOf('\n'));
                    }
                if(arr[i][0] === '#')
                {
                    var content = arr[i].replace(/#/g, '').replace(/`/g, '');
                    content = $.trim(content);
                    if(showAll)
                        $("<li></li>").text(content).appendTo($list);
                    else
                        isCurrent = (command === content);
                }
                if(!showAll && isCurrent)
                    md += arr[i] + '\n';
            }
            if(!showAll)
                $in.html(marked(md));
        });
});
