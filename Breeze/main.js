var main = {

    defs: "",

    go: function(event){
        // GET TEXTBOX VALUE
        var query = $("#search_box").val();
        if(event.keyCode == 13 && query != ""){
            done = 0;
            final = "";

            $.each(defs.shortcuts, function(i,x){
                if(query == x.word){
                    done = 1;
                    final = x.value;
                }
            });

            if(done == 0){
                
                t = query.length;
                l = query.indexOf(" ");
                tag = query.substring(0,l);
                other = query.substring(l+1,t);

                $.each(defs.tags, function(i,x){
                    if(tag == x.tag){
                        done = 1;
                        final = x.value+other;
                    }
                });
            }

            if(done == 0){
                final = "https://www.google.com/search?q="+query;
            }
            
            window.location.href = final;
        }
    },

    getMsg: function(r){
        defs = r.msg;
    },

    init: function(e){
        // SETTINGS
        browser.runtime.sendMessage({code: "get"},this.getMsg);

        // BACKGROUNDS
        var img_url = "http://www.bing.com";
        var rnd = Math.floor((Math.random()*8));
        $.get( "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8", function(data) {
            img_url = img_url + data["images"][rnd]["url"];
            $("body").css("background","url("+img_url+") no-repeat center center fixed");
            $("body").css("background-size","cover");
        });

        // CLOCK
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        if(parseInt(m)<10) m = "0"+m;
        $("#clock").html(h+":"+m);

        // EVENTS
        $("#search_box").keydown(this.go);

        // INTRO ANIMATION
        $("#main_content").animate({"opacity": 1}, 1000, function(){});
    }

};

$("#search_box").focus();
$("body").click(function(){$("#search_box").focus();});

document.addEventListener("load", main.init());