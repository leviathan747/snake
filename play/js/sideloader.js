// sideload cheats

const Sideloader = (function() {

    "use strict";

    var selected = null;                // current row selected

    // load avaliable cheat plugins
    function loadCheats() {
        // empty cheat list
        $("#cheat-table").empty();

        // get cheat index
        $.get("js/cheat/index.json", null, function(cheats) {
            for (var i = 0; i < cheats.length; i++) {
                $("#cheat-table").append("<div class='cheat-row'><div>" + cheats[i].name + "</div><div class='description hidden'>" + cheats[i].description + "</div></div");
            }
            $(".cheat-row").click(function(e) {
                selectRow($(e.target).parent());
            });
        }, "json");
    }

    // select
    function selectRow(row) {
        if (selected && selected.html() == row.children().first().html()) {
            // deselect
            row.removeClass("cheat-row-selected");
            row.children().eq(1).addClass("hidden");
            selected = null;
        }
        else {
            // deselect old row
            if (selected) {
                selected.parent().removeClass("cheat-row-selected");
                selected.parent().children().eq(1).addClass("hidden");
            }

            // select
            row.addClass("cheat-row-selected");
            row.children().eq(1).removeClass("hidden");
            selected = row.children().first();
        }
    }

    // add a script element with the cheat
    function sideloadCheat(text, name) {
        $("#cheat-container").empty().append("<script>" + text + "</script>");
        $("#title").empty().append(name);

        $(".cheat-row").removeClass("cheat-row-selected");
        $(".cheat-row div:nth-child(2)").addClass("hidden");
        selected = null;
    }

    // init
    $(document).ready(function() {

        // button listeners
        $("#clear").click(function() {
            $("#cheat-container").empty();
            $("#title").empty().append("None");
            Cheat = undefined;
        });

        // exit button listener in snake.js

        $("#load").click(function() {
            if (selected) {
                $.get("js/cheat/" + selected.html(), null, function(text) {
                    sideloadCheat(text, selected.html());
                }, "text")
                .error(function(err) {
                    if (err.status == 404) {
                        // error message?
                        Sideloader.hide();
                    }
                });
            }
        });

        $("#upload").change(function(e) {
            var files = e.target.files;
            if (files.length == 1) {
                var file = files[0];
                var contents;
                var name = file.name;
                var r = new FileReader();
                r.onload = function(e){
                    contents = e.target.result;
                    if (file.type == "text/javascript"){
                        sideloadCheat(contents, file.name);
                    }
                    else {
                        // error message?
                    }
                }
                r.readAsText(file);
            }
        });
         
        loadCheats();
    });


    // external API
    var Sideloader = {};

    Sideloader.hide = function() {
        $(".cheat-row").removeClass("cheat-row-selected");
        selected = null;
        $("#upload").val("");
        $("#cheat-box").css("zIndex", 0);
        $("#cheat-box").addClass("hidden");
    }

    Sideloader.show = function() {
        $("#message").css("zIndex", 0);
        $("#cheat-box").css("zIndex", 1);
        $("#cheat-box").removeClass("hidden");
    }

    Sideloader.visible = function() {
        return !($("#cheat-box").hasClass("hidden"));
    }

    return Sideloader;

})();
