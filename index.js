const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const PER_PAGE = 10;
const PHOTO_URL = "https://picsum.photos/id/";

const list = JSON.parse(localStorage.getItem('MyFavorite')) || []
const profile = [];
let fliterProfile = [];


const dataPanel = document.querySelector("#data-panel");
const paginator = document.querySelector("#paginator");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#search-input");
const footerButton = document.querySelector("#footer-button")

//DataPannelHTML
function rederInfoList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
     <div class="mb-3 col-6 col-sm-4 col-md-3 col-lg-2">
        <div class="card">
          <img src=${item.avatar} class="card-img-top" alt="...">
          <div class="card-body">
            <h6 class="card-name text-truncate">${item.surname} ${item.name} </h6>
            <div class="detailContainer">

            </div>
            <div class="buttunContainer mt-3 d-flex justify-content-around ">
              <button class="btn btn-primary btn-show-detail" data-toggle="modal" data-target="#introduce-modal" data-id="${item.id}">More</button>
                <i data-id="${item.id}" class="bi bi-heart" 
                "></i>
              </a>
            </div>
          </div>
        </div>
     </div>
  `;
  });

  dataPanel.innerHTML = rawHTML;
  updateRenderfavoriteIcons()
}

//ModalHTML內容資料
function showInfoModal(id) {
  const modalName = document.querySelector(".modal-name");
  //const modalInfo = document.querySelector("#modal-info").children;
  const modalMemberNumber = document.querySelector(".member-number");
  const modalGender = document.querySelector(".gender");
  const modalAge = document.querySelector(".age");
  const modalRegion = document.querySelector(".region");
  const modalBirthday = document.querySelector(".birthday");
  const modalEmail = document.querySelector(".email");
  const modalPhoto = document.querySelector(".modal-left");

  let rawHTML = `
  <div>
    <small class="created text-left"">created_at:</small>
    <small class="updated text-left"">updated_at:</small>
  </div>
  <div>
   <button type="button" class="btn btn-primary" data-dismiss="modal" data-id="${id}">Interested</button>
   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  </div>
  `
  footerButton.innerHTML = rawHTML


  axios.get(INDEX_URL + "/" + id).then((response) => {
    const modalCreatedAt = document.querySelector(".created");
    const modalUpdateAt = document.querySelector(".updated");
    const data = response.data;
    modalName.innerText = data.surname + " " + data.name;
    modalMemberNumber.innerText = "number:" + data.id;
    modalGender.innerText = `Gender: ${data.gender}`
    modalAge.innerText = `  Age: ${data.age}`
    modalRegion.innerText = `  Region: ${data.region}`
    modalBirthday.innerText = `  Birthday: ${data.birthday}`
    modalEmail.innerText = `  Email: ${data.email}`
    modalCreatedAt.innerText = "created_at:" + data.created_at;
    modalUpdateAt.innerText = "updated_at:" + data.updated_at;
    modalPhoto.children[0].src = `${PHOTO_URL}${id}/300/200`;
  }).catch((err) => console.log(err));
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

//加入我的最愛
function addToMyFavorite(id) {
  const addProfile = profile.find(profile => profile.id === id)
  list.push(addProfile)
  localStorage.setItem('MyFavorite', JSON.stringify(list))
}

//移除我的最愛
function removeMyFavoite(id) {

  //尋找ID是否符合
  const profileIndex = list.findIndex(list => list.id === id)
  list.splice(profileIndex, 1)
  //將物件轉成字串並存入
  localStorage.setItem('MyFavorite', JSON.stringify(list))
}

//搜尋提交
searchForm.addEventListener("submit", function onsearchSubmitted(event) {
  event.preventDefault()  //沒設定會跳404
  const keyword = searchInput.value.trim().toLowerCase();

  fliterProfile = profile.filter((profile) => {
    if (
      profile.name.toLowerCase().includes(keyword) ||
      profile.surname.toLowerCase().includes(keyword)
    ) {
      return profile;
    }
  });
  
  if (fliterProfile.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人名`)
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
  const target = event.target
  if (target.matches(".btn-show-detail")) {
    showInfoModal(Number(target.dataset.id));
    
  } else if (target.className === "bi bi-heart") {
      target.className = "bi bi-heart-fill";
      target.style.color = "#ff6600";
      addToMyFavorite(Number(target.dataset.id))

  } else if (target.className === "bi bi-heart-fill"){
      target.className = "bi bi-heart";
      target.style.color = "#007bff";
      removeMyFavoite(Number(target.dataset.id))
  } 
})

//Interested 點擊
footerButton.addEventListener("click", function onInterestedClicked(event) {
  if (event.target.innerText === "Interested") {
    addToMyFavorite(Number(event.target.dataset.id))
  }
})

//更新我的最愛icons
function updateRenderfavoriteIcons() {
  const bi = dataPanel.querySelectorAll('.bi')
  bi.forEach(item => {
     list.forEach(listItem => {
      if (Number(item.dataset.id) === listItem.id) {
        console.log(listItem.id)
        item.className = "bi bi-heart-fill"
        item.style.color = "#ff6600"
      }
     })
  })
}


axios
  .get(INDEX_URL)
  .then((response) => {
    profile.push(...response.data.results);
    renderPaginator(profile.length);
    rederInfoList(getProfileByPage(1));
  })
  .catch((err) => console.log(err));

