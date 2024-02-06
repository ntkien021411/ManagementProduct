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

