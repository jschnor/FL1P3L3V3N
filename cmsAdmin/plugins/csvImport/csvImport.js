//
function csvImport_updatePreview() {
  var jobNum           = $('input[name=num]').val();
  var preSaveTempId    = $('input[name=preSaveTempId]').val();
  var hasColumnHeaders = $('input[name=hasColumnHeaders]').attr('checked') ? 1 : 0;
  var fileFormat       = $('select[name=fileFormat] option:selected').val();
  if (!jobNum)           { jobNum = ''; }
  if (!preSaveTempId)    { preSaveTempId = ''; }

  //
  var ajaxUrl = '';
  ajaxUrl += '?_plugin='          + escape( $('input[name=_plugin]').val() );
  ajaxUrl += '&_pluginAction='    + escape( 'csvImport_previewData_ajax' );
  ajaxUrl += '&num='              + escape( jobNum );
  ajaxUrl += '&preSaveTempId='    + escape( preSaveTempId );
  ajaxUrl += '&hasColumnHeaders=' + escape( hasColumnHeaders );
  ajaxUrl += '&fileFormat='       + escape( fileFormat );

  //
  $.ajax({
    url:   ajaxUrl,
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      var error = "There was an error sending the request!";
      error    += " (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")\n";
      error    += textStatus + ' - ' + errorThrown;
      $('#previewContent').html( error );
    },
    success:  function(html) {
      if (!html) { return; }
      var maxPreviewHeight = 250;
      var scrollBarHeight  = 20; // pad height for scrollBar

      //$('#previewContent').css({'overflow': 'auto'});
      $('#previewContent').html( html );
      $('#previewContent').animate({
        height: Math.min($('#previewContent table').height()+scrollBarHeight, maxPreviewHeight) + 'px'
      });
    }
  });
}

//
function csvImport_analyseFile() {
  var ajaxUrl = '';
  ajaxUrl += '?_plugin='       + escape( $('input[name=_plugin]').val() );
  ajaxUrl += '&_pluginAction=' + escape( 'csvImport_analyseForm_ajax' );
  ajaxUrl += '&num='           + escape( $('#num').val() );
  ajaxUrl += '&offset='        + escape( $('#currentOffset').val() );
  ajaxUrl += '&rowNum='        + escape( parseInt( $('#recordCount').val() ) + 1 );

  $.ajax({
    url:      ajaxUrl,
    dataType: 'json',
    error:  function(XMLHttpRequest, textStatus, errorThrown) {
      var error = "There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")\n" +textStatus+ ' - ' + errorThrown;
      $('#status').css('color', '#C00').text("Error: " + error);
      alert(error);
    },
    success:  function(json){

      // update row count and offset
      var recordCount   = json['lastRowNum'];
      var columnCount   = Math.max( $('#columnCount').val(), json['columnCount'] );
      var currentRowNum = recordCount;
      $('#recordCount').val( recordCount );
      $('#columnCount').val( columnCount );
      $('#currentOffset').val( json['offset'] );
      $('#status').css('color', '#C00').text("Analysing import row " +currentRowNum);
      $('#recordCountText').text( recordCount );
      $('#columnCountText').text( columnCount );

      // stop if done
      if (json['done']) {
        $('#status').css('color', '').text("Done!");
        $('#pleaseWait, #bottomButtons').toggle();
        return;
      }

      // debug
      //alert(JSON.stringify(json, null, 2));

      // import next row
      csvImport_analyseFile();
    }
  });

}

//
function csvImport_importFile(useTempTable) {
  if (typeof useTempTable == 'undefined') { useTempTable = 0; }
  else                                    { useTempTable = useTempTable ? 1 : 0; }

  var ajaxUrl = '';
  ajaxUrl += '?_plugin='       + escape( $('input[name=_plugin]').val() );
  ajaxUrl += '&_pluginAction=' + escape( 'csvImport_importForm_ajax' );
  ajaxUrl += '&num='           + escape( $('#num').val() );
  ajaxUrl += '&rowNum='        + escape( parseInt( $('#currentRowNum').val() ) + 1 );
  ajaxUrl += '&useTempTable='  + escape( useTempTable );

  $.ajax({
    url:      ajaxUrl,
    dataType: 'json',
    error:  function(XMLHttpRequest, textStatus, errorThrown) {
      var error = "There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")\n" +textStatus+ ' - ' + errorThrown;
      $('#noerrors').hide('');
      $('#errors').append(error + "<br/>\n");
      alert(error);
    },
    success:  function(json){

      // update display values
      var actionText = useTempTable ? "Validating" : "Importing";
      $('#currentRowNum').val( json['lastRowNum'] );
      $('#status').css('color', '#C00').text(actionText + " row " +$('#currentRowNum').val()+ " of " +$('#totalRows').val() );
      if (json['orphansRemoved']) {
        var orphansFound = parseInt($('#orphansFound').text()) + json['orphansRemoved']
        $('#orphansFound').text( orphansFound );
      }
      if (json['duplicatesUpdated']) {
        var duplicatesFound = parseInt($('#duplicatesFound').text()) + json['duplicatesUpdated']
        $('#duplicatesFound').text( duplicatesFound );
      }


      // display errors
      if (json['errors']) {
        $('#noerrors').hide('');
        $('#errors').append(json['errors']);
      }

      // stop if done
      if (json['done']) {
        if ($('#noerrors').is(':visible')) { $('#errors_div').hide(); }
        $('#complete_buttons_div').show();
        $('#status').css('color', '').text("Done!");
        return;
      }

      // debug
      //alert(JSON.stringify(json, null, 2));

      // import next row
      csvImport_importFile(useTempTable);
    }
  });

}
