// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  var keyword = document.getElementById("keyword").value;

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    openAlert("골프장을 입력해주세요", "취소", "확인", undefined, popupClose);
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB);

  // place-guide 영역을 동적으로 생성합니다
  var placeGuideEl = document.getElementById("place-guide");
  placeGuideEl.innerHTML = ""; // 기존 내용을 초기화합니다

  // 새로운 내용을 생성하고 추가합니다
  var newContent = document.createElement("p");
  newContent.textContent = "";
  placeGuideEl.appendChild(newContent);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록을 표출합니다
    displayPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    openAlert("골프장을 입력해주세요", "취소", "확인", undefined, popupClose);
    return false;
  } else if (status === kakao.maps.services.Status.ERROR) {
    openAlert("골프장을 입력해주세요", "취소", "확인", undefined, popupClose);
    return false;
  }
}

// 검색 결과 목록을 표출하는 함수입니다
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment();

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  for (var i = 0; i < places.length; i++) {
    var itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  // menuEl.scrollTop = 0;

  // keyword 입력란의 값이 변경될 때마다 placeList를 지우는 기능을 구현하기 위해 keyword 입력란에 이벤트 리스너를 추가합니다.
  var keywordInput = document.getElementById("keyword");
  keywordInput.addEventListener("input", clearPlaceList);

  // placeList를 지우는 함수를 정의합니다.
  function clearPlaceList() {
    var listEl = document.getElementById("placesList");
    removeAllChildNodes(listEl);
  }

  // 요소의 모든 자식 노드를 제거하는 함수를 정의합니다.
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  el.innerHTML = itemStr;
  el.className = "item";

  el.addEventListener("click", function () {
    handlePlaceSelect(places, el);
  });

  return el;
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}
