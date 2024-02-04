// File upload with preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image',{
  multiple:true,
  maxFileCount : 6
});
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const images = upload.cacheFileArray || [];
    const content = e.target.elements.content.value;
    if (content || images.length > 0) {
      //Người dùng gửi tin nhắn hoặc gửi kèm ảnh
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

//SERVER_RETURN_MESSAGE
const bodyChat = document.querySelector(".chat");
//Sau khi người dùng gửi tin nhắn
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullName = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>`;

    const boxTyping = document.querySelector(".inner-list-typing");
  body.insertBefore(div,boxTyping);

  //Scroll chat to bottom
  bodyChat.scrollTop = bodyChat.scrollHeight;
});

//Scroll chat to bottom
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

//Emoji-picker

//Show popup Icon Table
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// Show Typing sau 3 giây ko làm gì thì mất typing
const showTyping = ()=>{
  socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeout);
    //Sau 3 giây gửi lên 
    timeout = setTimeout(()=>{
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    },3000);
}

//Insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  
  var timeout; 
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end,end);
    inputChat.focus();

    showTyping();
  });

  //Ví dụ
  // Lần 1 typing : sẽ gọi event KeyUp -> socketEmitShow -> clear timeout cũ nếu có -> socketEmitHidden
  // Lần 2 typing ròi dừng : sẽ gọi event KeyUp -> socketEmitShow -> clear timeout(ở lần 1 )  -> socketEmitHidden và sau 3 giây thì dừng
  //Đơn giản là lần 1 typing thì sẽ gán socketEmitHidden và lần 2 sẽ clear và gán lại 
  // nếu lần 1 typing xong mà lần 2 ko typing thì sẽ chỉ có sau 3 giây thì socketEmitHidden chứ ko clear biến global timeout
  //Người dùng soạn tin nhắn và chưa gửi
  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}

// SERVER_RETURN_TYPING
//Sau khi người dùng soạn tin nhắn và chưa gửi
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if(data.type =="show"){
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
  
      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `<div class="inner-name">${data.fullName}</div> <div class="inner-dots"><span> </span><span> </span><span> </span></div>
        `;
  
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    }else{
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if(boxTypingRemove){
        elementListTyping.removeChild(boxTypingRemove);
      }

    }
    
  });
}

