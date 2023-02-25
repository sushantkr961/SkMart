export const changeCategory = (
  e,
  categories,
  setAttributeFormDB,
  setCategoryChoosen
) => {
  const highLevelCategory = e.target.value.split("/")[0];
  const highLevelCategoryAllData = categories.find(
    (cat) => cat.name === highLevelCategory
  );
  if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
    setAttributeFormDB(highLevelCategoryAllData.attrs);
  } else {
    setAttributeFormDB([]);
  }
  setCategoryChoosen(e.target.value);
};

export const setValueForAttrFormDBselectForm = (
  e,
  attributeFormDB,
  attrVal
) => {
  // console.log(e.target.value)
  if (e.target.value !== "Choose attribute") {
    var selectedAttr = attributeFormDB.find(
      (item) => item.key === e.target.value
    );
    // console.log(selectedAttr)
    let valuesForAttrKeys = attrVal.current;
    if (selectedAttr && selectedAttr.value.length > 0) {
      while (valuesForAttrKeys.options.length) {
        valuesForAttrKeys.remove(0);
      }
      valuesForAttrKeys.options.add(new Option("Choose attribute value"));
      selectedAttr.value.map((item) => {
        valuesForAttrKeys.add(new Option(item));
        return "";
      });
    }
  }
};


export const setAttributesTableWrapper = (key, val, setAttributesTable) => {
    setAttributesTable((attr) => {
      // console.log(attr)
      if (attr.length !== 0) {
        var keyExistsInOldTable = false;
        let modifiedTable = attr.map((item) => {
          if (item.key === key) {
            keyExistsInOldTable = true;
            item.value = val;
            return item;
          } else {
            return item;
          }
        });
        if (keyExistsInOldTable) {
          return [...modifiedTable];
        } else return [...modifiedTable, { key: key, value: val }];
      } else {
        return [{ key: key, value: val }];
      }
    });
  };