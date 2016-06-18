/*!
 * ---------------------------------------------------------
 * Copyright(C) Microsoft Corporation. All rights reserved.
 * ---------------------------------------------------------
 */
var gestureRecognizer=function(){var n=function(n,t){return Math.atan2(t.Y-n.Y,n.X-t.X)*180/Math.PI},t=function(n,t){var i=Math.abs(n.X-t.X),r=Math.abs(n.Y-t.Y);return i>r?n.X>t.X?"R":"L":n.Y>t.Y?"D":"U"},i=function(t,i){var u=n(t,i);return u<0&&(u=360+u),r(u)},r=function(n){var t="NO_DIRECTION";return n<40||n>320?t="R":n>50&&n<130?t="U":n>140&&n<220?t="L":n>230&&n<310&&(t="D"),t},u=function(n,r,u){return u?i(n,r):t(n,r)};return{getDirection:u}}()