import variable from "../../../../Shared/Variable.vue";
import axios from "axios";
import httpStatusCode from "../../../../Shared/Variable.vue";

class BusinessExpenditureService { 
  Validate(item) {
      return new Promise((resolve) => {
        axios
          .post(
            variable.data("ga").apiBaseUrl + "report/business-expenditure/validate",
            item,
            variable.header()
          )
          .then(function (response) {
            resolve(response);
          }).catch((error) => {
            if (typeof error.response == String(httpStatusCode.UNDEFINED)){
              resolve(error);
            }
            else{
              var ErrorStatus = error.response;
              resolve(ErrorStatus);
            }
          });
      });
    }
   
  GetExpense(item) {
    return new Promise((resolve) => {
      axios
        .post(
          variable.data("common").apiBaseUrl + "combo/get",
          item,
          variable.header()
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          var ErrorStatus = error.response;
          resolve(ErrorStatus);
        });
    });
  } 
  GetAllPromotors(item) {
    return new Promise((resolve) => {
      axios
        .post(
          variable.data("ga").apiBaseUrl +
            "form-peb/get-promotor-structure",
          item,
          variable.header()
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (typeof error.response == String(httpStatusCode.UNDEFINED)){
            resolve(error);
          }
          else{
            var ErrorStatus = error.response;
            resolve(ErrorStatus);
          }
        });
    });
  } 
  Save(payload) {
    return new Promise((resolve) => {
      axios
        .post(
          variable.data("ga").apiBaseUrl + "form-peb/save",
          payload,
          variable.header()
        )
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data); // 
          } else {
            resolve(response);
          }
        })
        .catch((error) => {
          var ErrorStatus = error.response;
          resolve(ErrorStatus);
        });
    });
  }

  GetFormList() {
    return new Promise((resolve) => {
      axios
        .post(
          variable.data("ga").apiBaseUrl + "form-peb/list", // sesuaikan jika berbeda
          {},
          variable.header()
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          var ErrorStatus = error.response;
          resolve(ErrorStatus);
        });
    });
  }

  GetFormDetail(memoId) {
    return new Promise((resolve) => {
      axios
        .get(
          variable.data("ga").apiBaseUrl + `form-peb/detail/${memoId}`,
          variable.header()
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          var ErrorStatus = error.response;
          resolve(ErrorStatus);
        });
    });
  }

   
}

export default new BusinessExpenditureService();
