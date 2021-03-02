const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const PER_PAGE = 30;

const profile = JSON.parse(localStorage.getItem("MyFavorite"));


let fliterProfile = [];

const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#search-input");


//DataPannelHTML
function rederInfoList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
     <div class="mb-3" style="width:13rem;">
        <div class="card">
          <img src=${item.avatar} class="card-img-top" alt="...">
          <div class="card-body">
            <h3 class="card-name text-truncate">${item.surname} ${item.name} </h3>
            <div class="detailContainer">
              <div class="mb-1 gender"><i class="fas fa-venus-mars mr-1"></i>${item.gender}</div>
              <div class="mb-1 age"><i class="fas fa-user mr-2"></i>${item.age}</div>
              <div class="mb-1 region"><i class="fas fa-globe mr-2"></i>${item.region}</div>
            </div>
            <div class="buttunContainer mt-3 d-flex justify-content-around">
              <button class="btn btn-primary btn-show-detail" data-toggle="modal" data-target="#introduce-modal" data-id="${item.id}">More</button>
              <a  style="font-size: 1.5rem; color: #ff6600; href="#">
                <i id="addLike" data-id="${item.id}" class="bi bi-heart-fill"></i>
              </a>
            </div>
          </div>
        </div>
     </div>
  `;
  });
  dataPanel.innerHTML = rawHTML;
}

//ModalHTML內容資料
function showInfoModal(id) {
  const PHOTO_URL = "https://picsum.photos/id/";
  const modalName = document.querySelector(".modal-name");
  const modalInfo = document.querySelector("#modal-info").children;
  const modalMemberNumber = modalInfo[0];
  const modalBirthday = modalInfo[1];
  const modalEmail = modalInfo[2];
  const modalCreatedAt = modalInfo[3];
  const modalUpdateAt = modalInfo[4];
  const modalPhoto = document.querySelector(".modal-left");

  axios.get(INDEX_URL + "/" + id).then((response) => {
    const data = response.data;
    modalName.innerText = data.surname + " " + data.name;
    modalMemberNumber.innerText = "member number:" + data.id;
    modalBirthday.innerText = "birthday:" + data.birthday;
    modalEmail.innerText = "email:" + data.email;
    modalCreatedAt.innerText = "created_at:" + data.created_at;
    modalUpdateAt.innerText = "updated_at:" + data.updated_at;
    modalPhoto.children[1].src = `${PHOTO_URL}${id}/300/200`;
  });
}

//PaginatorHTML
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / PER_PAGE);
  let rawHTML = "";

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

//設計分頁
function getProfileByPage(page) {
  const data = fliterProfile.length ? fliterProfile : profile;
  //console.log(data.length);
  const startIndex = (page - 1) * PER_PAGE;
  return data.slice(startIndex, startIndex + PER_PAGE);
}

//移除我的最愛
function removeMyFavoite(id) {
  //尋找電影ID是否符合
  const list = JSON.parse(localStorage.getItem('MyFavorite')) || []

  const profileIndex = list.findIndex(list => list.id === id)
  list.splice(profileIndex, 1)
  //將物件轉成字串並存入
  localStorage.setItem('MyFavorite', JSON.stringify(list))
  rederInfoList(list)
}

//搜尋提交
searchForm.addEventListener("submit", function onsearchSubmitted(event) {
  event.preventDefault(); //沒設定會跳404
  const keyword = searchInput.value.trim().toLowerCase();

  fliterProfile = profile.filter((profile) => {
    if (
      profile.name.toLowerCase().includes(keyword) ||
      profile.surname.toLowerCase().includes(keyword)
    ) {
      return profile;
    }
  });
  console.log(fliterProfile.length);

  if (fliterProfile.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  renderPaginator(fliterProfile.length);
  rederInfoList(getProfileByPage(1));
});

//分頁點擊
paginator.addEventListener("click", function onPageClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  rederInfoList(getProfileByPage(page));
});

//按鈕點擊
dataPanel.addEventListener("click", function onPanelClicked(event) {
  const target = event.target;
  if (target.matches(".btn-show-detail")) {
    showInfoModal(Number(target.dataset.id));
    //console.log(target.dataset.id);
  } else if (target.matches("#addLike")) {
    if (target.className === "bi bi-heart") {
      target.className = "bi bi-heart-fill";
      target.parentElement.style.color = "#ff6600";
    } else {
      target.className = "bi bi-heart";
      target.parentElement.style.color = "#007bff";
      removeMyFavoite(Number(target.dataset.id))
    }
  }
});


axios
  .get(INDEX_URL)
  .then((response) => {
    rederInfoList(profile);
  })
  .catch((err) => console.log(err));


