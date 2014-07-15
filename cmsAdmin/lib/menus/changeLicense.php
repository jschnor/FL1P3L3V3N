<form method="post" action="?">
<input type="hidden" name="changeProductId" value="1" />

<div class="content-box">
  <div class="content-box-header"><h3><?php et('Change Product Id') ?></h3></div>
  <div class="content-box-content login-content">
    <div class="tab-content default-tab" align="center">

      <p>
        <span class="label"><?php et('Product ID') ?></span>
        <input class="text-input setAttr-spellcheck-false" type="text" name="productId" id="productId" value="<?php echo htmlencode(@$_REQUEST['productId']) ?>" size="25" onfocus="clearDefaultProductId()" onblur="setDefaultProductId()"  />
        <input class="button" type="submit" name="unused" value="<?php et('Update') ?>" />
      </p>

      <div class="clear"></div>

    </div> <!-- End .tab-content -->
  </div> <!-- End .content-box-content -->
</div> <!-- End .content-box -->

</form>

<script type="text/javascript">
var DEFAULT_PRODUCT_ID = "XXXX-XXXX-XXXX-XXXX";

function setDefaultProductId() {
  var elProductId = document.getElementById('productId');
  if (elProductId.value == '' || elProductId.value == DEFAULT_PRODUCT_ID) {
    elProductId.value = DEFAULT_PRODUCT_ID;
    elProductId.style.color = "#999999";
  }
}

function clearDefaultProductId() {
  var elProductId = document.getElementById('productId');
  if (elProductId.value == DEFAULT_PRODUCT_ID) {
    elProductId.value = '';
    elProductId.style.color = "#000000";
  }
}

document.getElementById('productId').focus();

setDefaultProductId();


</script>
