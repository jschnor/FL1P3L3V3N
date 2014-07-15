
function viewCancel() {
  if ($('#returnUrl').val()) { self.location = $('#returnUrl').val(); }
  else                       { self.location = '?menu=' + $('#menu').val(); }
}

function reloadIframe(id, errors) {
  if (errors == undefined) { errors = ''; }
  var el = document.getElementById(id);
  el.contentWindow.location = el.contentWindow.location + '&errors=' + escape(errors);
}

// resize iframe to fit content (up to max)
function resizeIframe(id) {
  var maxHeight     = 800;
  var iframeEl      = document.getElementById(id);
  var contentHeight = iframeEl.contentWindow.document.body.clientHeight;

  // set height
  if (contentHeight > 0 && contentHeight <= maxHeight) {
    iframeEl.height = contentHeight;
  }
  else {
    iframeEl.height = maxHeight;
  }
}
