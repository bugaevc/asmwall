$in = $("#content");
var initialTitle = "asmwall - NASM handbook - A Wall to Remember";
function getMarkdown(command) {
    function forHeader(line, f) {
        if (line[0] !== '#')
            return false;
        var content = line.replace(/#/g, '').replace(/`/g, '');
        var level = line.indexOf(' ');
        f($.trim(content), level);
        return true;
    }
    var res = "";
    if (command) {
        var isCurrent = false;
        lines.forEach(function (line) {
            forHeader(line, function (content, level) {
                isCurrent = (command === content) && level === 3;
            });
            if (isCurrent)
                res += line + '\n';
        });
    } else {
        lines.forEach(function (line) {
            forHeader(line, function (content, level) {
                switch (level) {
                    case 1:
                    case 2:
                        res += '#'.repeat(level + 1) + ' ' + content + '\n';
                        break;
                    case 3:
                        var url = commandToUrl(content);
                        res += '['+content+']('+url+')' + '\n';
                        break;
                }
            });
        });
    }
    return res;
}
function renderPage(command) {
    var md = getMarkdown(command);
    $in.empty();
    if (command) {
        document.title = command + ' - ' + initialTitle;
        $in.removeClass("instructions");
    } else {
        document.title = initialTitle;
        $in.addClass("instructions");
    }
    if (md)
        $in.html(marked(md));
    else
        $.get("404.md", function(data) {
            document.title = "404 - " + initialTitle;
            $in.html(marked(data));
        });
}

function urlToCommand(url) {
    if (!url)
        return "";
    return url.slice(1).replace(/_/g, ' ').replace(/\//g, '');
}
function commandToUrl(command) {
    if (!command)
        return "";
    return '?' + command.replace(/ /g, '_');
}

// first load

var lines;
$.get("data.md", function (data) {
    lines = data.split('\n');
    var command = urlToCommand(location.search);
    renderPage(command);
    // history.replaceState(command, null, location.search);
    $in.removeClass("long");
});
/*
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
*/

