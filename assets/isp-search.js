const FREE_SHIPPING_TAG ="FreeShippingAU";
const FREE_SHIPPING_LABEL = '<ul class="pr_sticker" style="margin: 0 17.5%;max-width: 225px !important;margin:auto;"><li>free shipping *</li></ul>';

var __isp_options = {
  isp_serp_with_product_attributes: '1',
  isp_serp_callback: function () {
    $jquery_isp('.isp_grid_product').each(function() {
      let id =  $jquery_isp(this).attr("product_id");
      if(ISP_PRODUCTS[id].att) {
        let tags = get_attr(ISP_PRODUCTS[id].att,"Tag");
        if(tags === 0){return;}
        if(tags.indexOf(FREE_SHIPPING_TAG) > -1 && $jquery_isp(this).find(".pr_sticker").length === 0){
          $jquery_isp(this).find(".isp_product_image_wrapper").append(FREE_SHIPPING_LABEL);
        }
      }
    });
  }
};
function get_attr(attributes, target) {
  for (let i = 0; i < attributes.length ; i++) {
    if(attributes[i][0] === target){
      return attributes[i][1];
    }
  }
  return 0;
}