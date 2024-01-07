//Sự kiện thay đổi trạng thái sản phẩm
// button-change-status
//Thay đổi 1 sản phẩm
//Lấy theo tên thuộc tính là button-change-status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  //lấy theo id là form-change-status
  const formChangeStatus = document.querySelector("#form-change-status");
  //lấy ra giá trị của thuộc tính data-path
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
//Xử lí nút checkall và checkbox khác (thay đổi nhiêu sản phẩm)
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  // Xử lí nút checkall
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  //Xử lí các nút check ở từng sản phẩm
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );
    //Xóa nhiều sản phẩm với form của bộ lọc
    const typeChange = e.target.elements.type.value;
    if(typeChange === "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");
      if (!isConfirm) {
        return;
        // trong TH user bấm hủy thì tác vụ thay đổi 
        // status của sản phẩm ko đc thực thi
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      //Duyệt những thằng input checkbox của từng item dc checked
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;
        // thay đổi vị trí nhiều hoặc 1 sản phẩm
        // checkbox ròi submit form lọc change-position
        if(typeChange == "change-position"){
            const position = input.closest("tr").querySelector("input[name='position']").value;
            ids.push(`${id}-${position}`)
        }else{
          ids.push(id);
        }

      });
      //Thay đổi trạng thái nhiều sản phẩm
      inputIds.value = ids.join(",");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!");
    }
  });
}
//Xóa 1 sản phẩm
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {

  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", () => {

      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?");

      if (isConfirm) {

        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        formDeleteItem.submit();
      
      }
    });
  });
}

//Hiển thị(sau vài giây thì tắt) và tắt thông báo
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time= showAlert.getAttribute("data-time");
  // Nút close alert
  const closeAlert= showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click",()=>{
    showAlert.classList.add("alert-hidden");
  });
  //Sau 5 giây ẩn 
  setTimeout(() =>{
    showAlert.classList.add("alert-hidden");
  },parseInt(time));
}


// Hiện ảnh khi tạo sản phẩm
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    if(file){
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  })


}

// Sort -SẮP XẾP
const sort = document.querySelector("[sort]");
if(sort){
  const sortSelect = document.querySelector("[sort-select]");
  const sortClear = document.querySelector("[sort-clear]");
  // Lấy ra url ở trang web hiện tại
  let url = new URL(window.location.href);

  //Sắp xếp
  sortSelect.addEventListener("change", (e)=>{
    const value = e.target.value;
    const[sortKey,sortValue] = value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    // console.log(sortKey,sortValue);
    window.location.href = url.href;
  })

  //Xóa sắp xếp
  sortClear.addEventListener("click", (e)=>{

    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    // console.log(sortKey,sortValue);
    window.location.href = url.href;
  })
  //Thêm selected cho option
  const sortKey =  url.searchParams.get("sortKey");
  const sortValue =  url.searchParams.get("sortValue");
  if(sortKey && sortValue){
    const stringSort = `${sortKey}-${sortValue}`;
     const optionSort = sortSelect.querySelector(`option[value='${stringSort}']`);
     optionSort.setAttribute("selected",true);
  }
}