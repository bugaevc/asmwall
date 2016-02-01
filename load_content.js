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
        $in.addClass("details");
    } else {
        document.title = initialTitle;
        $in.addClass("instructions");
        $in.removeClass("details");
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

var lines;
$.get("data.md", function (data) {
    lines = data.split('\n');
    var command = urlToCommand(location.search);
    renderPage(command);
    $in.removeClass("long");
});

$(document).on("click", ".instructions > p > a", function (event) {
    var $this = $(this);
    // check for clicks on [link]
    if ($this.offset().left + $this.width() - event.pageX < 35)
        return true;
    var details = $this.next(".details");
    if (details.length) {
        details.slideUp(function() {
            details.remove();
        });
        return false;
    }
    // Note: this.href is an absolute URL like
    // https://bugaevc.github.io/asmwall/?cdecl
    // while $(this).attr("href") is exactly the given value
    // which is in this case just "?cdecl"
    var href = $this.attr("href");
    var command = urlToCommand(href);
    var md = getMarkdown(command);
    md = md.substring(md.indexOf('\n') + 1);
    $('<div class="details"></div>')
        .html(marked(md))
        .hide()
        .insertAfter($this)
        .slideDown();
    return false;
});
