$in = $("#content");
var initialTitle = "asmwall - NASM handbook";
function renderPage(command) {
    if (command) {
        document.title = command + ' - ' + initialTitle;

        $in.removeClass("instructions");
        var md = ""; // markdown code of the current section
        var isCurrent = false; // whether we are inside the needed section
        lines.forEach(function (line) {
            if (line[0] == '#') {
                var content = line.replace(/#/g, '').replace(/`/g, '');
                isCurrent = (command === $.trim(content));
            }
            if (isCurrent)
                md += line + '\n';
        });
        if (md)
            $in.html(marked(md));
        else
            $.get("404.md", function(data2) {
                document.title = "404 - " + initialTitle;
                $in.html(marked(data2));
            });
    } else {
        document.title = initialTitle;
        $in.addClass("instructions");
        var $list = $("<ul></ul>");
        function addItem(text, level) {
            switch (level) {
                case 1:
                case 2:
                    if (!$list.is(":empty"))
                        $list = $("<ul></ul>");
                    var headerTag = '<h' + (level+1) + '>' +
                                    '</h' + (level+1) + '>';
                    $(headerTag)
                        .text(text)
                        .appendTo($in)
                        .after($list);
                    break;

                case 3:
                    var $a = $("<a></a>")
                        .addClass("block-link");
                    var href = '?' + text.replace(/ /g, '_');
                    $a
                        .attr("href", href)
                        .text(text);
                    $('<li></li>')
                        .append($a)
                        .appendTo($list);
                    break;
            }
        }
        lines.forEach(function (line) {
            if (line[0] != '#')
                return;
            var level = line.indexOf(' ');
            var content = line.replace(/#/g, '').replace(/`/g, '');
            content = $.trim(content);
            addItem(content, level);
        });
    }
}

// first load

var lines;
$.get("data.md", function(data) {
    lines = data.split('\n');
    var command = location.search.length === 0 ? "" :
        location.search.slice(1).replace(/_/g, ' ').replace(/\//g, '');
    renderPage(command);
    $in.removeClass("long");
});
