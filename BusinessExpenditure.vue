<template>
  <div>
    <CCard class="w-100 p-2">
      <CCardHeader class="sticky-header">
        <div class="row align-items-center">
          <!-- Baris pertama untuk judul -->
          <div class="col-12 d-flex">
            <h3 class="text-left font-weight-bold">Business Expenditure</h3>
          </div>
        </div>

        <div class="row align-items-center">
          <!-- Baris kedua untuk tombol dan input pencarian, di paling kanan -->
          <div class="col-12 d-flex justify-content-end">
            <!-- Input pencarian -->
            <input
              type="text"
              class="form-control col-md-4"
              placeholder="Cari..."
              v-model="searchQuery"
            />
            <!-- Tombol Tambah -->
            <div class="ml-3"> 
              <button
                v-if="showAdd"
                type="button"
                class="btn btn-primary font-weight-bold"
                @click="addClick()"
              >
                <i class="fa fa-plus"></i> Add New Form
              </button>
            </div>
            <!-- Icon Filter -->
            <div class="ml-3">
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="filterClick()"
              >
                <i class="fa fa-sliders-h"></i>
              </button>
            </div>
          </div>
        </div>
        <br />
      </CCardHeader> 
      <CCardBody>
        <div class="row py-2">
          <div class="col-md-6 col-xs-12">
            <form
              class="collector-internal-performance"
              @submit.prevent="searchClick()"
            >
            </form>
          </div>
        </div>
        <business-expenditure-grid
          :key="gridReload"
          :LeaseNo="LeaseNo"
          :printClick="printClick"
          :editClick="editClick"
          :deleteClick="deleteClick"
          ref="grid"
        />

        <!-- Print -->
        <print-module ref="printModule" />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import "@progress/kendo-ui";
import "@progress/kendo-theme-default/dist/all.css";
import moment from "moment";
import store from "../../../store.js";
import httpStatusCode from "../../../Shared/Constants.vue";
import _ from "lodash";
import variable from "../../../Shared/Variable.vue";
import businessExpenditureGrid from "./Grid/BusinessExpenditureGrid.vue";
import BusinessExpenditureService from "./Script/BusinessExpenditureService.js";
import printModule from "../PrintModule/PrintModule.vue";

export default {
  name: "businessExpenditure",
  components: {
    "business-expenditure-grid": businessExpenditureGrid,
    "print-module": printModule,
  },
  provide() {
    return {
      acl: this.acl,
    };
  },
  data() {
    return {
      acl: variable.Acl(this.$route.path),
      LeaseNo: "",
      gridReload: 0,

    };
  },
  mounted() {
    // this.getData();
  },
  watch: {
    "$store.getters.BranchDefault.BranchCode": {
      handler() {
        this.branchSelected = store.getters.BranchDefault;
        this.searchClick();
      },
      deep: false,
    },
  },
  computed: {
    showAdd() {
      return this.acl.Add;
    },
    monthList() {
      return this.$globalfunc.MonthList();
    },
    yearList() {
      let yearStart = parseInt(moment(new Date()).format("Y")) - 5;
      let yearEnd = parseInt(moment(new Date()).format("Y"));
      let yearTemp = [];
      for (let i = yearEnd; i > yearStart; i--) {
        let str = {
          Id: i,
          Name: i,
        };
        yearTemp.push(str);
      }
      return yearTemp;
    },
  },
  methods: {
    getData() {
      this.$loading(true);
      let item = {
        Category: this.LeaseNo,
        ExcludedValues: [],
      };
      BusinessExpenditureService
        .GetLoadData(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (response.status == httpStatusCode.OK) {
            if (!_.isEmpty(response.data.Data)) {
              var optionList = [];
              _.forEach(response.data.Data, function (val) {
                var str = {
                  Id: val.ComboValue,
                  Name: val.ComboDescription,
                };
                optionList.push(str);
              });
              this.searchByOption = optionList;
              this.searchBySelected = optionList[0];
            }
          } else {
            this.$swal("Info", this.$globalfunc.ErrorFormat(response), "error");
          }
        })
        .catch((e) => {
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    },
    addClick() {
      this.$refs.grid.addClick();
    },
    searchClick() {
      this.gridReload++;
    },
    editClick(dataItem) { 
      this.$router.push({
        name: "Business Expenditure Form",
        params: { id: dataItem.LeaseNo },
        query: { 
          brc: dataItem.BranchCode,
        },
      });
    },
    deleteClick(dataItem) {
      this.$swal(variable.confirmation()).then((result) => {
        if (result.isConfirmed == true) {
          this.$loading(true);
          let item = {
            LeaseNo: dataItem.LeaseNo, 
          };
          BusinessExpenditureService
            .Delete(item)
            .then((response) => {
              if (response == "Success") {
                this.gridReload++;
                this.$swal(
                  "Info",
                  "Data has been deleted successfully.",
                  "success"
                );
              } else {
                if (response.status == httpStatusCode.UNAUTHORIZED) {
                  this.$globalfunc.TokenValidator(response.status);
                } else {
                  this.$swal(
                    "Info",
                    this.$globalfunc.ErrorFormat(response),
                    "error"
                  );
                }
              }
            })
            .catch((e) => {
              this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
            })
            .finally(() => {
              this.$loading(false);
            });
        }
      });
    },
    printClick(reportFormat, dataItem) {   
      console.log('data: ', reportFormat); 
      
      this.$loading(true);
      let item = {
        LeaseNo: dataItem.LeaseNo, 
      };

      this.$loading(true);
      BusinessExpenditureService 
        .Validate(item)
        .then((response) => {
          if(response.status == httpStatusCode.BAD_REQUEST){
            this.$globalfunc.FormatErrors(response.data.Errors);
            this.$loading(false);
          }
          else if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (
            response.status == httpStatusCode.OK &&
            response.data.Status == 1
          ) {
            this.$refs.printModule.printClick(
              item,
              "report/business-expenditure/print",
              reportFormat
            );
          } else {
            this.$loading(false);
            this.$swal(
              "Info",
              this.$globalfunc.ErrorFormat(response),
              "error"
            );
          }
        })
        .catch((e) => {
          this.$loading(false);
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        });
    },
  },
};
</script>
<style scoped>
.form-inline {
  display: inline-block;
  width: 100%;
  vertical-align: middle;
}

.sticky-header {
  position: sticky;
  top: 0; /* Menjaga posisi di atas */
  z-index: 1000; /* Pastikan di atas elemen lainnya */
  background-color: #fff; /* Mengatur background untuk header agar terlihat jelas */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan agar header terlihat lebih jelas */
}
.sticky-header h3 {
  font-weight: bold; /* Membuat teks menjadi bold */
} 
</style>
