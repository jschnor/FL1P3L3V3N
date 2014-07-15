// Custom table drag-sorting for CMS
// ... Call initSortable to initalize sorting on any table with .sortable class

// onStartCallback - Callback to call before sorting starts
// onStopCallback - Callback to call when sorting is finished
function initSortable(onStartCallback, onStopCallback) {
  updateRowColors($('table.sortable'));

  var draggable = $('.dragger').mousedown(function(){
    setSortableItems(this, onStartCallback, onStopCallback);
  });

  $('body').mouseleave(function(event, ui){
    draggable.trigger('mouseup');
  });
}

//
function setSortableItems(row, onStartCallback, onStopCallback){
  if (onStartCallback){
    onStartCallback(row);
  }

  $('table.sortable').sortable({
    forceHelperSize : true,
    axis        : 'y',
    containment : 'parent',
    items       : "tr:not(.ui-state-disabled)",
    tolerance   : 'pointer',
    helper      : function(event, ui){
      return fixedHelper(event, ui);
    },
    start       : function(event, ui){
      ui.helper.addClass('tDnD_whileDrag');
    },
    beforeStop  : function(event, ui){
      ui.helper.removeClass('tDnD_whileDrag');
    },
    stop        : function(event, ui){
      if (onStopCallback){
        onStopCallback(ui.item, this);
      }
      updateRowColors();
    }
  });

  $('.sortable tr').disableSelection();
}

// Keeps the width of the drag helper.
function fixedHelper(event, ui){
  ui.children().each(function(){
    $(this).width($(this).width());
  });

  return ui;
}

function updateRowColors(table){
  // update row colors
  $("table.sortable tr").removeClass('listRowOdd listRowEven');
  $("table.sortable tr:odd:not(.nodrag)").addClass('listRowOdd');
  $("table.sortable tr:even:not(.nodrag)").addClass('listRowEven');

  //$("tr", table).removeClass('listRowOdd listRowEven');
  //$("tr:odd:not(.nodrag)", table).addClass('listRowOdd');
  //$("tr:even:not(.nodrag)", table).addClass('listRowEven');
}


// Dragsort callbacks for regular sections
// =======================================

function updateDragSortOrder_forList(row, table){
  // get new order
  var rows     = table.tBodies[0].rows;
  var newOrder = "";
  for (var i=0; i<rows.length; i++) {
      var order = $("._recordNum", rows[i]).val();
      if (order) {
        if (newOrder != "") { newOrder += ","; }
        newOrder += order;
      }
  }

  // Save changes via ajax
  $('body').css('cursor','wait'); // 2.15 - show wait cursor
  $.ajax({
    url: '?',
    type: "POST",
    data: {
      menu:       $('._tableName', table).val(),
      action:     'listDragSort',
      recordNums: newOrder
    },
    error:  function(XMLHttpRequest, textStatus, errorThrown){
      alert("There was an error sending the request! (" +XMLHttpRequest['status']+" "+XMLHttpRequest['statusText'] +")");
    },
    success: function(msg){
      $('body').css('cursor','default'); // 2.15 - show wait cursor
      if (msg) { alert("Error: " + msg); }
    }
  });
}
