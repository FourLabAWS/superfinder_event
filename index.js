function hiddenTrue() {
  $(".tab_text").hide();
  $(".input_wrap").hide();
  $(".input_box info").hide();
  $(".tab_content").hide();
  $(".phone_num_area").hide();
  $("#PHONE_NUM").hide();
  $("#place-guide").text("참여 완료된 골프장입니다. 다른 골프장을 선택해주세요.");
  $("#place-guide").css("color", "red");
}

function hiddenFalse() {
  $(".tab_text").show();
  $(".input_wrap").show();
  $(".input_box info").show();
  $(".tab_content").show();
  $(".phone_num_area").show();
  $("#PHONE_NUM").show();
  $("#place-guide").text("참여 가능한 골프장입니다.");
  $("#place-guide").css("color", "blue");
}

function isNotGolfPlace() {
  $(".tab_text").hide();
  $(".input_wrap").hide();
  $(".input_box info").hide();
  $(".tab_content").hide();
  $(".phone_num_area").hide();
  $("#place-guide").text("골프장이 아닙니다.");
  $("#place-guide").css("color", "black");
}

function validateInputs() {
  const inputs = [
    { id: "#keyword", alertMessage: "골프장을 입력해주세요" },
    { id: "#HZ_LNTH", alertMessage: "가로 길이를 입력해주세요" },
    { id: "#VR_LNTH", alertMessage: "세로 길이를 입력해주세요" },
    { id: "#PHONE_NUM", alertMessage: "전화번호를 입력해주세요" },
    { id: "input[name='radio']", alertMessage: "동의 여부를 선택해주세요" },
  ];

  for (let i = 0; i < inputs.length; i++) {
    let value = $(inputs[i].id).val();
    if (!value) {
      openAlert(inputs[i].alertMessage);
      $(inputs[i].id).focus();
      $("input[type='button']").prop("disabled", true);
      return;
    }
  }
  openAlert(
    "해당 정보로 제출하시겠습니까?<br>하나의 골프장당 한번만 참여 가능하며<br>깃발 크기가 부정확한 경우 보상 대상에서 제외됩니다."
  );
}

function handlePlaceSelect(places) {
  var items = document.querySelectorAll("li.item");
  items.forEach(function (item) {
    item.remove();
  });
  var PLC_ID = places.id;
  var PLC_NM = places.place_name;
  var category_name = places.category_name;
  $("#PLC_ID").val(PLC_ID);
  $("#PLC_ID").change();
  $("#PLC_NM").val(PLC_NM);
  $("#keyword").val(PLC_NM);
  sessionStorage.setItem("PLC_NM", PLC_NM);

  const keywords = ["스포츠,레저", "골프", "골프장", "골프연습장"];
  let isGolfPlace = false;

  let categories = category_name.split(" > ");

  for (let i = 0; i < categories.length; i++) {
    if (keywords.includes(categories[i])) {
      isGolfPlace = true;
      break;
    }
  }

  if (!isGolfPlace) {
    isNotGolfPlace();
    return;
  }

  const params = {
    PLC_ID: $("#PLC_ID").val(),
  };

  $.ajax({
    url: "https://ji40ssrbe6.execute-api.ap-northeast-2.amazonaws.com/v1/checkFlagEvnt",
    type: "POST",
    data: JSON.stringify(params),
    contentType: "application/json",
    success: function (data) {
      //console.log("success:", data);
      if (data.statusCode === 400 || data.statusCode === 409) {
        openFailPopup();
      } else {
        openSuccessPopup();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      openAlert("서버와 통신 중 오류가 발생하였습니다.");
    },
  });

  function openSuccessPopup() {
    hiddenFalse();
  }
  function openFailPopup() {
    hiddenTrue();
  }
}

function openAlert(
  message,
  cancelText = "취소",
  submitText = "확인",
  cancelEvent = function (e) {
    popupClose(e);
  },
  submitEvent = function (e) {
    submitAndClose(e);
  }
) {
  const popupBg = document.getElementById("popupBg");
  const popupTxtCnf = document.querySelector(".popup_txt_cnf");
  const popupTxtCnfSub = document.querySelector(".popup_txt_cnf_sub");
  const cancelButton = document.getElementById("popupCancelBtn");
  const submitButton = document.getElementById("popupSubmitBtn");

  popupTxtCnf.textContent = "알림";
  popupTxtCnfSub.innerHTML = message;

  cancelButton.textContent = cancelText;
  cancelButton.onclick = cancelEvent;

  submitButton.textContent = submitText;
  submitButton.onclick = submitEvent;

  // 팝업을 열어줍니다.
  popupBg.classList.add("active");
}

function openPopup(e) {
  document.getElementById("popupBg").classList.add("active");
}

function popupClose(e) {
  document.getElementById("popupBg").classList.remove("active");
}

function submitAndClose(e) {
  popupClose();
  onSave();
}

$(document).ready(function () {
  var phoneNumber = sessionStorage.getItem("phone");
  if (phoneNumber) {
    $("#PHONE_NUM").val(phoneNumber);
  }
  $("#HZ_LNTH, #VR_LNTH, #PHONE_NUM, #onSave")
    .prop("disabled", true)
    .prop("tabindex", -1);

  $("#PLC_ID").change(function () {
    if ($(this).val()) {
      $("#HZ_LNTH").prop("disabled", false);
      $("#VR_LNTH").prop("disabled", false);
    } else {
      $("#HZ_LNTH").prop("disabled", true);
      $("#VR_LNTH").prop("disabled", true);
    }
    hiddenTrue();
  });

  $("#PLC_ID").change(function () {
    if ($(this).val()) {
      $("#HZ_LNTH, #VR_LNTH, #PHONE_NUM, #onSave")
        .prop("disabled", false)
        .removeAttr("tabindex");
      hiddenFalse();
    }
  });

  const HZ_LNTH_MIN = 38;
  const HZ_LNTH_MAX = 60;
  const VR_LNTH_MIN = 27;
  const VR_LNTH_MAX = 45;

  $("#input_guide").hide();

  $("#HZ_LNTH, #VR_LNTH").on("input", function () {
    var hz_ln = parseInt($("#HZ_LNTH").val());
    var vr_ln = parseInt($("#VR_LNTH").val());
    var hz_valid = !isNaN(hz_ln) && hz_ln >= HZ_LNTH_MIN && hz_ln <= HZ_LNTH_MAX;
    var vr_valid = !isNaN(vr_ln) && vr_ln >= VR_LNTH_MIN && vr_ln <= VR_LNTH_MAX;

    if (hz_valid && vr_valid) {
      $("button[type='button']").prop("disabled", false);
      $("#input_guide").hide();
    } else {
      $("button[type='button']").prop("disabled", true);
      $("#input_guide").show();
    }

    var guideText =
      "최소값: " +
      HZ_LNTH_MIN +
      " x " +
      VR_LNTH_MIN +
      ", 최대값: " +
      HZ_LNTH_MAX +
      " x " +
      VR_LNTH_MAX;
    $("#input_guide").text(guideText);
  });
});

function onSave() {
  if ($("#PHONE_NUM").val()) {
    var phoneNumber = $("#PHONE_NUM").val();
    phoneNumber = phoneNumber.replace(/-/g, "");
    $("#PHONE_NUM").val(phoneNumber);
    sessionStorage.setItem("phone", phoneNumber);
  }

  const params = {
    PLC_ID: $("#PLC_ID").val(),
    PLC_NM: $("#PLC_NM").val(),
    HZ_LNTH: $("#HZ_LNTH").val(),
    VR_LNTH: $("#VR_LNTH").val(),
    PHONE_NUM: $("#PHONE_NUM").val(),
    USE_YN: $("#USE_YN").val(),
    CSNT_YN: $('input[name="radio"]:checked').val(),
  };

  $.ajax({
    url: "https://ji40ssrbe6.execute-api.ap-northeast-2.amazonaws.com/v1/flagEvnt",
    type: "POST",
    data: JSON.stringify(params),
    contentType: "application/json",
    success: function (data) {
      if (data.statusCode === 409) {
        openAlert(
          "해당 골프장에 깃발을 이미 등록했습니다.",
          "취소",
          "확인",
          undefined,
          popupClose
        );
      } else if (data.statusCode === 400) {
        openAlert(
          "해당 골프장은 깃발이 모두 등록되었습니다.",
          "취소",
          "확인",
          undefined,
          popupClose
        );
      } else {
        openAlert(
          "이벤트 참여 완료!<br>커피 기프티콘보다 더 큰 보상을 원하시면<br>이벤트를 최대 10회까지 참여해주세요",
          "취소",
          "확인",
          undefined,
          popupClose
        );
        setTimeout(function () {
          location.reload();
        }, 3000);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      openAlert(
        "서버와 통신 중 오류가 발생하였습니다.",
        "취소",
        "확인",
        undefined,
        popupClose
      );
    },
  });
}

$.ajax({
  url: "https://ji40ssrbe6.execute-api.ap-northeast-2.amazonaws.com/v1/FlagEvntRank",
  type: "GET",
  contentType: "application/json",
  success: function (response) {
    const data = JSON.parse(response.body);
    if (data.length === 0) {
      $(".rating_box").html("<br>".repeat(13));
    } else {
      let rankHtml = "";
      for (let index = 0; index < 5; index++) {
        let item = data[index];
        if (!item) continue;

        const rankClass =
          index === 0
            ? "first"
            : index === 1
            ? "second"
            : index === 2
            ? "third"
            : index === 3
            ? "fourth"
            : "fifth";
        let phoneNumber = item[0];
        let times = item[1];

        let lastFourDigits = phoneNumber.slice(-4);
        phoneNumber = lastFourDigits;

        const rankElement = `
          <div class="rating_item">
            <div class="rating_star ${rankClass}">${index + 1}등</div>
            <p class="phone_num">${phoneNumber}</p>
            <p class="num_time">${times}회</p>
          </div>
        `;
        rankHtml += rankElement;
      }
      $(".rating_box").html(rankHtml);
    }
  },
  error: function (jqXHR, textStatus, errorThrown) {
    openAlert("서버와 통신 중 오류가 발생하였습니다.");
  },
});

function phoneNumCnt() {
  window.onload = function () {
    document.querySelector(".section_title_box p").textContent = phoneNumCnt();
  };
}

$.ajax({
  url: "https://ji40ssrbe6.execute-api.ap-northeast-2.amazonaws.com/v1/FlagEvntCnt",
  type: "GET",
  contentType: "application/json",
  success: function (response) {
    const unique_phone_nums_count = JSON.parse(response.body);
    $("#unique_phone_nums_count").text("현재 " + unique_phone_nums_count + "명 참여중");
  },
  error: function (jqXHR, textStatus, errorThrown) {
    openAlert("서버와 통신 중 오류가 발생하였습니다.");
  },
});