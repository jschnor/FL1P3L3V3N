
// when the user hits enter on the page number text field, redirect them instead of submitting the form (since submitting a search filter will reset page number to 1)
$('#pageNum').live('keydown', function(e) {
  if (e.keyCode == 13){
    var menu = $('form[name=searchForm] input[name=menu]').val();
    var page = $(this).val();
    window.location = '?menu='+encodeURIComponent(menu)+'&_action=list&page='+page;
    e.preventDefault();
    return false;
  }
});


// Dragsort callbacks for Category
// ======================

function markSiblings(row){
  var parentNum = getParentNum(row);

  var notSiblings = getNotChildren(parentNum);
  var siblings = getChildren(parentNum);

  $(notSiblings).each(function(){
    $(this).addClass('ui-state-disabled');
  });

  $(siblings).each(function(){
    $(this).addClass('ui-state-default');
  });
}

//
function getParentNum(row){
  return $(row).parents('tr').find('._categoryParent').val();
}

function getNotChildren(parentNum){
  var children = [];

  $('._categoryParent').each(function(){
    if ($(this).val() != parentNum){
      children.push($(this).parent().parent());
    }
  });

  return children;
}

function getChildren(parentNum){
  var children = [];

  $('._categoryParent').each(function(){
    if ($(this).val() == parentNum){
      child = new Array();
      child['index'] = $(this).parent().parent().index();
      child['row'] = $(this).parent().parent();

      children.push(child);
    }
  });

  return children;
}

function updateCategoryDragSortOrder(row, table){
  var sourceNum = getRecordNum(row);
  var targetNum = null;
  var position = null;
  var sibling = getPreviousSibling(row);

  if (sibling.length){ // We found a sibling.
    targetNum = getRecordNum(sibling);
    position = 'below';
  } else {
    sibling = getNextSibling(row);
    targetNum = getRecordNum(sibling);
    position = 'above';
  }

  //
  var menu = $('._tableName', table).val();
  var url  = '?menu=' +encodeURIComponent(menu)+ '&_action=categoryMove&sourceNum=' + sourceNum + '&targetNum=' + targetNum + '&position=' + position;
  window.location.href = url;
}
// ====================================

function getPreviousSibling(row){
  return $(row).prev('tr:not(.ui-state-disabled)');
}

function getNextSibling(row){
  return $(row).next('tr:not(.ui-state-disabled)');
}

function getRecordNum(row){
  return $(row).find('[name="selectedRecords[]"]').val();
}

//
function toggleCheckboxes(checkedBool) {

  if (checkedBool) {
    $('.selectRecordCheckbox').each(function() {
        this.checked = "checked";
    });
  }
  else {
    $('.selectRecordCheckbox').each(function() {
        this.checked = "";
    });
  }

}


function toggleAdvancedSearchOptions() {

  //$('.hideShowSecondarySearchFields, .secondarySearchField').toggle();
  // workaround for jquery 1.3.2 IE8 bug with toggle() as described here: http://dev.jquery.com/ticket/4512 and http://stackoverflow.com/questions/975153/jquery-toggle-not-working-with-trs-in-ie
  $('.hideShowSecondarySearchFields, .secondarySearchField').each(function(){
    if (this.style.display == 'none') { $(this).show(); }
    else                              { $(this).hide(); }
  });

  //
  var showingSecondaryFields = $('.secondarySearchField:visible').length > 0;
  if (showingSecondaryFields) { $('#showAdvancedSearch').val('1'); }
  else                        { $('#showAdvancedSearch').val('0'); }

}
