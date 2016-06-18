var opts = {

    back: "",
    defs: "",

    save_main_page: function(){
        defs.main_page = $("#main_page").val();
        alert("Saved");
        browser.runtime.sendMessage({code: "set", msg: defs});
        $("#main_page").focus();
        return 0;
    },

    // EVENT
    save_shortcuts: function(){
        word = $("#shortcuts_word").val();
        value = $("#shortcuts_value").val();
        found = 0;

        if(value == "" || word == ""){
            alert("Word or Value empty.");
            $("#shortcuts_word").focus();
            return 0;
        }
        
        $.each(defs.shortcuts, function(i,x){
            if(x.word == word) found = 1;
        });

        if(found == 0){
            // ADD ELEMENT
            elem = $.parseHTML("<tr><td>"+word+"</td><td>"+value+"</td><td class='s_d'>X</td></tr>");
            $("#shortcuts_opts").append(elem);
            $(".s_d").click(opts.delete_shortcuts);
            
            // ADD TO ARRAY
            tmp = [{"word": word,"value": value}];
            $.merge(defs.shortcuts, tmp);

            // CLEAN INPUTS
            $("#shortcuts_word").val("");
            $("#shortcuts_value").val("");

            //alert("Added");

            // UPDATE SETTINGS
            browser.runtime.sendMessage({code: "set", msg: defs});
            $("#shortcuts_word").focus();
            return 0;
        }else{
            alert("Already exists... delete and add again.");
            $("#shortcuts_word").focus();
            return 0;
        }
    },

    // EVENT
    delete_shortcuts: function(e){
        var elem = $(e.target).parent();
        var text = elem.children().html();

        $.each(defs.shortcuts, function(i,x){
            if(x.word == text){
                defs.shortcuts.splice(i,1);
                return false;
            }
        });

        // REMOVE FROM TABLE
        elem.remove();
        //alert("Removed");

        // UPDATE SETTINGS
        browser.runtime.sendMessage({code: "set", msg: defs});
        $("#shortcuts_word").focus();
        return 0;
    },

    save_tags: function(){
        tag = $("#tags_tag").val();
        value = $("#tags_value").val();
        found = 0;

        if(value == "" || tag == ""){
            alert("Tag or Value empty.");
            $("#tags_tag").focus();
            return 0;
        }
        
        $.each(defs.tags, function(i,x){
            if(x.tag == tag) found = 1;
        });

        if(found == 0){
            // ADD ELEMENT
            elem = $.parseHTML("<tr><td>"+tag+"</td><td>"+value+"<b>query</b></td><td class='t_d'>X</td></tr>");
            $("#tags_opts").append(elem);
            $(".t_d").click(opts.delete_tags);
            
            // ADD TO ARRAY
            tmp = [{"tag": tag,"value": value}];
            $.merge(defs.tags, tmp);

            // CLEAN INPUTS
            $("#tags_tag").val("");
            $("#tags_value").val("");

            //alert("Added");

            // UPDATE SETTINGS
            browser.runtime.sendMessage({code: "set", msg: defs});
            $("#tags_tag").focus();
            return 0;
        }else{
            alert("Already exists... delete and add again.");
            $("#tags_tag").focus();
            return 0;
        }
    },

    delete_tags: function(e){
        var elem = $(e.target).parent();
        var text = elem.children().html();

        $.each(defs.tags, function(i,x){
            if(x.tag == text){
                defs.tags.splice(i,1);
                return false;
            }
        });

        // REMOVE FROM TABLE
        elem.remove();
        //alert("Removed");

        // UPDATE SETTINGS
        browser.runtime.sendMessage({code: "set", msg: defs});
        $("#tags_tag").focus();
        return 0;
    },

    fill: function(){
        $("#main_page").val(defs.main_page);
        $("#save_main_page").click(this.save_main_page);

        $.each(defs.shortcuts, function(i,x){
            $("#shortcuts_opts").html($("#shortcuts_opts").html()+
                "<tr><td>"+x.word+"</td><td>"+x.value+"</td><td class='s_d'>X</td></tr>");
        });
        $("#save_shortcuts").click(this.save_shortcuts);
        $(".s_d").click(this.delete_shortcuts);

        $.each(defs.tags, function(i,x){
            $("#tags_opts").html($("#tags_opts").html()+
                "<tr><td>"+x.tag+"</td><td>"+x.value+"<b>query</b></td><td class='t_d'>X</td></tr>");
        });
        $("#save_tags").click(this.save_tags);
        $(".t_d").click(this.delete_tags);
    },

    getMsg: function(r){
        defs = r.msg;
        opts.fill();
    },

    init: function(e){
        // GETTING THE SETTINGS
        browser.runtime.sendMessage({code: "get"},this.getMsg);
    }

};

document.addEventListener("load", opts.init());