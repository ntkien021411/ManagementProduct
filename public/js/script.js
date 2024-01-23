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
