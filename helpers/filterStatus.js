module.exports = (query) =>{
    //Nút bấm lọc trạng thái của product
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
   //BỘ LỌC
  //Thay đổi trạng thái active của nút bấm theo bộ lọc
  // và find product theo bộ lọc (param trên url)
  if (query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status == query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status == "");
    filterStatus[index].class = "active";
  }
  return filterStatus;
}