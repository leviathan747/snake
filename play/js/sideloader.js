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
                $("#cheat-table").append("<div class='cheat-row'>" + cheats[i].name + "</div");
            }
            $(".cheat-row").click(function(e) {
                selectRow($(e.target));
            });
        }, "json");
    }

    // select
    function selectRow(row) {
        if (selected && selected.html() == row.html()) {
            // deselect
            row.removeClass("cheat-row-selected");
            selected = null;
        }
        else {
            // deselect old row
            if (selected) selected.removeClass("cheat-row-selected");

            // select
            row.addClass("cheat-row-selected");
            selected = row;
        }
    }

    // init
    $(document).ready(function() {

        // button listeners
        $("#load").click(function() {
            if (selected) {
                $.get("js/cheat/" + selected.html(), null, function(text) {
                    $("#cheat-script").empty().append(text);
                    $(".cheat-row").removeClass("cheat-row-selected");
                    selected = null;
                    Sideloader.hide();
                }, "text")
                .error(function(err) {
                    if (err.status == 404) {
                        $(".cheat-row").removeClass("cheat-row-selected");
                        selected = null;
                        Sideloader.hide();
                    }
                });
            }
        });

        $("#upload").click(function() {
        });
         
        loadCheats();
    });


    // external API
    var Sideloader = {};

    Sideloader.hide = function() {
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
