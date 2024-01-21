let count = 0;
const createTreeCategory = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId   ) {
      count++;
      const newItem = item;
      newItem.index = count;
      const children = createTreeCategory(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

let count1 = 0;
const createTreeCategoryActive = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId && item.status =="active"  ) {
      count1++;
      const newItem = item;
      newItem.index = count1;
      const children = createTreeCategoryActive(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

module.exports.createTree = (arr, parentId = "") => {
  count = 0;
  const tree = createTreeCategory(arr, (parentId = ""));
  return tree;
};

module.exports.createTreeActive = (arr, parentId = "") => {
  count = 0;
  const tree = createTreeCategoryActive(arr, (parentId = ""));
  return tree;
};

