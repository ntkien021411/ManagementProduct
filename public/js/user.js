// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
//Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
//Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}

//Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

//SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUserAccept.getAttribute("badge-users-accept");
    console.log(123);
  //   console.log(data.userId);
  //Check xem có phải client của người dùng B ko
  if (userId == data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriend;
  }
});

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector("[data-users-accept]");
  const userId = dataUsersAccept.getAttribute("data-users-accept");
  //Check xem có phải client của người dùng B ko
  if (userId == data.userId) {
    //Vẽ user ra giao diện
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id",data.infoUserA._id);
    newBoxUser.innerHTML = `<div class="box-user">
      <div class="inner-avatar">
      <img src="${data.infoUserA.avatar}" alt="${data.infoUserA.fullName}">
      </div>
      <div class="inner-info">
      <div class="inner-name">${data.infoUserA.fullName}</div>
      <div class="inner-buttons">
      <button class="btn btn-sm btn-primary mr-1" btn-accept-friend="${data.infoUserA._id}">Chấp nhận</button>
      <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
      <button class="btn btn-sm btn-secondary mr-1"  btn-deleted-friend disabled>Đã xóa</button>
      <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend disabled=>Đã chấp nhận</button>
      </div></div></div>`;
    dataUsersAccept.appendChild(newBoxUser);
    //Xóa lời mời kết bạn
    const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
    btnRefuseFriend.addEventListener("click", (e) => {
      btnRefuseFriend.closest(".box-user").classList.add("refuse");
      const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
    btnAcceptFriend.addEventListener("click", (e) => {
      btnAcceptFriend.closest(".box-user").classList.add("accepted");
      const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  }
});



//SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
   const dataUsersAccept = document.querySelector("[data-users-accept]");
  const userId = dataUsersAccept.getAttribute("data-users-accept");
  //Check xem có phải client của người dùng B ko
  if (userId == data.userId) {
      //Xóa A khỏi danh sách lời mời kết bạn của B
    
      const boxUserRemove =dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`); 
      if(boxUserRemove){
        dataUsersAccept.removeChild(boxUserRemove);
      }
  }
});