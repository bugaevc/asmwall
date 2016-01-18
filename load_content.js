$in = $("#content");
var initialTitle = "asmwall - NASM handbook";
function renderPage(command) {
    $in.empty();
    if (command) {
        document.title = command + ' - ' + initialTitle;

        $in.removeClass("instructions");
        var md = ""; // markdown code of the current section
        var isCurrent = false; // whether we are inside the needed section
        lines.forEach(function (line) {
            if (line[0] === '#') {
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
        lines.forEach(function (line) {
            if (line[0] !== '#')
                return;
            var level = line.indexOf(' ');
            var content = line.replace(/#/g, '').replace(/`/g, '');
            content = $.trim(content);
            switch (level) {
                case 1:
                case 2:
                    if (!$list.is(":empty"))
                        $list = $("<ul></ul>");
                    var headerTag = '<h' + (level+1) + '>' +
                                    '</h' + (level+1) + '>';
                    $(headerTag)
                        .text(content)
                        .appendTo($in)
                        .after($list);
                    break;

                case 3:
                    var $a = $("<a></a>")
                        .addClass("block-link");
                    var href = '?' + content.replace(/ /g, '_');
                    $a
                        .attr("href", href)
                        .text(content);
                    $('<li></li>')
                        .append($a)
                        .appendTo($list);
                    break;
            }
        });
    }
}

function urlToCommand(url) {
    if (!url)
        return "";
    return url.slice(1).replace(/_/g, ' ').replace(/\//g, '');
}

// first load

var lines;
$.get("data.md", function (data) {
    lines = data.split('\n');
    var command = urlToCommand(location.search);
    renderPage(command);
    history.replaceState(command, null, location.search);
    $in.removeClass("long");
});
$(document).on("click", "a", function () {
    // Note: this.href is an absolute URL like
    // https://bugaevc.github.io/asmwall/?cdecl
    // while $(this).attr("href") is exactly the given value
    // which is in this case just "?cdecl"
    var href = $(this).attr("href");
    var command = urlToCommand(href);
    renderPage(command);
    history.pushState(command, null, href);
    return false;
});
window.addEventListener('popstate', function(e) {
    renderPage(e.state);
});
