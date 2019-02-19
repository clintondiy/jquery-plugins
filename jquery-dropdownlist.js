(function ($) {

    var input;
    var items = [];

    $.fn.setupdropdownlist = function (options) {
        var settings = $.extend({
            input: undefined,
            items: []
        }, options);

        if (settings.input) {
            this.input = settings.input;
        } else {
            return this;
        }

        if (settings.items) {
            this.items = settings.items;
        } else {
            return this;
        }

        //alert(JSON.stringify(this.items));
        setup.call(this);

        return this;
    };

    var setup = function () {

        var _this = this;

        //alert(JSON.stringify(this.items));
        // Check if object exists
        if (!$(this.input).length) return 0;
        // Check that input element with unique ID
        if ($('#' + $(this.input).id).length > 1) {
            console.log('Setting up drop down list: Too many elements with ID = ' + $(this.input).id);
            if (DEBUG) alert('Setting up drop down list: Too many elements with ID = ' + $(this.input).id);
        }

        //console.log(input+' add '+itemary.length+' items');

        var ddlid = $(this.input).attr('id') + "_autodll";
        var listdiv = "#" + ddlid;

        // Create container if not exists
        if ($(listdiv).length == 0) $('body').append("<div id='" + ddlid + "'></div>");
        $(listdiv).css({
            "position": "absolute",
            "z-index": "10",
            "text-align": "left",
            "max-height": "200px",
            "overflow-y": "auto"
        });

        // Response to changing user input text
        $(this.input).keyup(function (e) {
            if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
                displayfilteredlist.call(_this, $(listdiv));
            }
        });
        $(this.input).focusin(function () {
            displayfilteredlist.call(_this, $(listdiv));
        });
        $(this.input).click(function () {
            displayfilteredlist.call(_this, $(listdiv));
        });

        // Keyboard shortcut friendly
        $(this.input).keydown(function (e) {
            if (e.keyCode == 38) {
                // Arrow Up
                var selectedIndex = parseInt($(listdiv).children('.selected').attr('data-item-index'));
                var newSelectedIndex = selectedIndex - 1;
                var newSelectedItem = $(listdiv).children('[data-item-index=' + newSelectedIndex + ']');
                if (newSelectedItem.length > 0) {
                    $(listdiv).children('.selected').removeClass('selected');
                    newSelectedItem.addClass('selected');
                    $(listdiv).scrollTop(newSelectedIndex * newSelectedItem.outerHeight());
                    updateselecteddropdownlistitemcss.call(this, listdiv);
                }
            } else if (e.keyCode == 40) {
                // Arrow Down
                var selectedIndex = parseInt($(listdiv).children('.selected').attr('data-item-index'));
                var newSelectedIndex = selectedIndex + 1;
                var newSelectedItem = $(listdiv).children('[data-item-index=' + newSelectedIndex + ']');
                if (newSelectedItem.length > 0) {
                    $(listdiv).children('.selected').removeClass('selected');
                    newSelectedItem.addClass('selected');
                    $(listdiv).scrollTop(newSelectedIndex * newSelectedItem.outerHeight());
                    updateselecteddropdownlistitemcss.call(this, listdiv);
                }
            } else if (e.keyCode == 13) {
                // Enter
                $(this.input).val($(listdiv).children('.selected').text());
                $(this.input).attr('data-val', $(listdiv).children('.selected').attr('data-item-val'));
                $(listdiv).hide();
            } else if (e.keyCode == 9 || e.keyCode == 27) {
                // TAB or ESC
                $(this.input).blur();
                $(this.listdiv).hide();
            }
        });

        // Dismissing drop down list
        $(this.input).focusout(function () {
            //$(listdiv).hide();
        });
        $(listdiv).mouseleave(function () {
            $(listdiv).hide();
        });

        //Set list appearance
        $(listdiv).css("background-color", "#FFFFFF");
        $(listdiv).css("border", "#AFAFAF solid 1px");

        $(listdiv).hide();

    };

    var updateselecteddropdownlistitemcss = function (listdiv) {
        $(listdiv).children('.item').css("background-color", "");
        $(listdiv).children('.item').css("color", "#727272");
        $(listdiv).children('.selected').css("background-color", "#243463");
        $(listdiv).children('.selected').css("color", "#FFFFFF");
    };

    var displayfilteredlist = function (listdiv) {

        var itemary = this.items;

        //Scroll top to show the first item of the list
        var ddlid = $(this.input).attr('id') + "_autodll";
        $('#' + ddlid).scrollTop(0);

        $(listdiv).hide();
        $(listdiv).html('');

        //Set list position
        $(listdiv).css($(this.input).offset());
        $(listdiv).css("top", (($(this.input).offset().top + $(this.input).height() + 6) + "px"));

        var maxdisplayitems = 1000;
        var displayeditems = 0;
        var inputtxt = $(this.input).val().toUpperCase();
        var isFirstItem = true;
        var indexCounter = 0;
        var isFound = false; // Indicates if user input found similar in list
        if (inputtxt.length != "") {

            for (var i = 0; i < itemary.length; i++) {
                //if (itemary[i].text.substring(0, inputtxt.length).toUpperCase() == inputtxt) {
                if (itemary[i].text.toUpperCase().indexOf(inputtxt) > -1) {
                    isFound = true;
                    var selectedTxt = '';
                    if (isFirstItem) selectedTxt = 'selected';

                    var itemValue = itemary[i].text;
                    if ('val' in itemary[i]) itemValue = itemary[i].val;

                    $(listdiv).append("<div data-item-index='" + indexCounter + "' class='item " + selectedTxt + "' data-item-val='" + itemValue + "'>" + itemary[i].text + "</div>");

                    indexCounter++;
                    isFirstItem = false;

                    displayeditems++;
                    if (displayeditems == maxdisplayitems) break;
                }
            }


            // Change value when clicked
            $(listdiv).children('.item').click(function () {
                $(this.input).val($(this).text());
                $(this.input).attr('data-val', $(this).attr('data-item-val'));
                $(listdiv).hide();
            });

            // CSS style
            $(listdiv).children('.item').css("cursor", "pointer");
            $(listdiv).children('.item').css("padding", "2px 15px 2px 5px");
            $(listdiv).children('.item').css("font-size", "13px");
            $(listdiv).children('.item').css("color", "#727272");
            updateselecteddropdownlistitemcss(listdiv);

            $(listdiv).children('.item').mouseenter(function () {
                $(listdiv).children('.item').removeClass('selected');
                $(this).addClass('selected');
                updateselecteddropdownlistitemcss(listdiv);
            });

            $(listdiv).children('.item').mouseleave(function () {
                $(this).removeClass('selected');
                updateselecteddropdownlistitemcss(listdiv);
            });

            if (displayeditems > 0) $(listdiv).show();
        }

        // Use user input as value if not found in list
        if (!isFound) $(this.input).attr('data-val', $(this.input).val());
    };


}(jQuery));
