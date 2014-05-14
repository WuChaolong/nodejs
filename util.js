function getIdsByAct(act){
  var ids = [];
  var goodss = getGoodssBy(act);
  for(var key in goodss){
    ids.push(key);
  }
  return ids;
}
function getGoodssBy(act){
  var goodss = {};
  var arr = act.data;
  for (var i = arr.length - 1; i >= 0; i--) {
    extend(goodss,arr[i].goodss);
  };
  return goodss;
}
function setPrices(goodss,newGoodss){
  if(!goodss||!newGoodss){
    return;
  }
  for (var i = newGoodss.length - 1; i >= 0; i--) {
    var newGoods = newGoodss[i];
    var goods = goodss[newGoods.id];
    if(goods){
      goods["salePrice"] = newGoods.salePrice;
    }
  };
}
function setActPrices(act,goodss){
  var arr = act.data;
  for (var i = arr.length - 1; i >= 0; i--) {
    var goodsOld = arr[i].goodss;
    for(var key in goodsOld){
      goodsOld[key]["salePrice"] = goodss[key]["salePrice"];
    }
  };
}