(function (undefined) {

    pl.extend(ke.templates, {
        get helpSelectedTooltip() {
            return '\
        <div class="<%=prefix%>t <%=prefix%>help-selected-wrap">\
          <div class="<%=prefix%>t <%=prefix%>help-inside-layout">\
          <div class="<%=prefix%>unpinned-utils">\
                <div title="<%=title_highlight_button%>" class="<%=prefix%>util-button <%=prefix%>highlight-button"></div>\
                <div title="<%=title_open_link%>" class="<%=prefix%>util-button <%=prefix%>open-link"></div>\
                <div class="<%=prefix%>close-unpinned"></div>\
            </div>\
            <div class="<%=prefix%>utils">\
                <div title="<%=title_listen_original%>" class="<%=prefix%>util-button <%=prefix%>listen-button <%=prefix%>listen-original"></div>\
                <div title="<%=title_open_link%>" class="<%=prefix%>util-button <%=prefix%>open-link"></div>\
                <div title="<%=title_show_reversed%>" class="<%=prefix%>util-button <%=prefix%>show-reversed"></div>\
                <div title="<%=title_unpin%>" class="<%=prefix%>util-button <%=prefix%>unpin"></div>\
            </div>\
              <div class="<%=prefix%>trVisibleLayout" id="<%=prefix%>trVisibleLayout-<%=ttid%>">\
                <div class="<%=prefix%>trEntireLayout" id="<%=prefix%>trEntireLayout-<%=ttid%>">\
                  <div class="<%=prefix%>t <%=prefix%>content-layout <%=prefix%>content-layout-<%=ttid%>"><%=content%></div>\
                </div>\
              </div>\
            \
            <div class="<%=prefix%>tr-scrollbar" id="<%=prefix%>tr-scrollbar-<%=ttid%>">\
             <div class="<%=prefix%>track" id="<%=prefix%>track-<%=ttid%>">\
              <div class="<%=prefix%>dragBar" id="<%=prefix%>dragBar-<%=ttid%>"></div>\
             </div>\
            </div>\
          </div>\
          <div class="<%=prefix%>loading"><span><%=l_loading%></span></div>\
          <div class="<%=prefix%>offline"><span><%=l_offline%></span></div>\
        </div>\
      ';
        }
    });

})();