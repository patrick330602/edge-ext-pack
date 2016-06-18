function update() {
  var hazChecked = document.getElementById('hideHoverButtons').checked;
  browser.storage.local.set({
    hideHoverButtons: hazChecked
  }, function() {
    var display = document.getElementById('display');
    display.innerHTML = "\u2713";
    browser.runtime.sendMessage({'logAction': '&event=preferences&hideHoverButtons=' + hazChecked}, function() {});
    setTimeout(function() {
      display.innerHTML = '';
    }, 750);
  });
}

function show() {
  document.getElementById('hideHoverButtons').addEventListener('click', update);
  document.getElementById('optionHide').innerHTML = browser.i18n.getMessage("optionHide");
  document.getElementById('optionTitle').innerHTML = browser.i18n.getMessage("optionTitle");
  document.title = browser.i18n.getMessage("optionTitle");
  browser.storage.local.get({
    hideHoverButtons: 'hideHoverButtons'
  }, function(items) {
    if (items.hideHoverButtons === true) {
      document.getElementById('hideHoverButtons').checked = items.hideHoverButtons;
    }
  });
}

document.addEventListener('DOMContentLoaded', show);
    

