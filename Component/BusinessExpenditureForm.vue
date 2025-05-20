<template>
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
      <form class="form-surat-tugas" @submit.prevent="saveClick()">
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Nomor Surat</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-5">
            <label class="form-label">{{ letterNumberText }}</label>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Nomor Konsumen</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" @keypress="$globalfunc.numberOnly($event)" @change="searchClick" v-model.trim="lesseeNumber" :maxlength="6" :disabled="editMode"/>
            <span id="LesseeNumber-Error" :hidden="this.lesseeNumber != null && this.lesseeNumber != ''"></span>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Nama Konsumen</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-5">
            <label class="form-label">{{ lesseeName }}</label>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Tanggal Cetak</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-5">
            <label class="form-label">{{
              $globalfunc.FormatTgl(letterDate, "DD MMM Y")
            }}</label>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Pemberi Kuasa</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-4">
            <v-select label="Name" :options="assignerData" v-model="assignerSelected"></v-select>
            <span id="Assigner-Error" :hidden="this.assignerSelected != null && this.assignerSelected != ''"></span>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Penerima Kuasa I</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-4">
            <v-select label="Name" :options="assigneeData" v-model="collector1"></v-select>
            <span id="Collector1-Error" :hidden="this.collector1 != null && this.collector1 != ''"></span>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Penerima Kuasa II</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" v-model="collector2" :disabled="editMode" />
          </div>
        </div>
        <div class="row py-2">
          <div class="col-2">
            <label class="form-label">Penerima Kuasa III</label>
            <label class="form-label" style="float: right">:&nbsp;</label>
          </div>
          <div class="col-4">
            <input type="text" class="form-control" v-model="collector3"  :disabled="editMode" />
          </div>
        </div>
        <br />
        <!-- Table -->
        <div class="py-2">
          <div class="table-responsive">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Contract No</th>
                  <th scope="col">Contract Date</th>
                  <th scope="col">Police No.</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Type</th>
                  <th scope="col" width="17%">Result</th>
                  <th scope="col">
                    <input
                      v-if="dealerData.length > 0"
                      type="checkbox"
                      @click="toggleSelectAll"
                      :checked="selectAll"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dealerData.length > 0">
                  <tr v-for="(val, index) in dealerData" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ val.LeaseNo }}</td>
                    <td>
                      {{ $globalfunc.FormatTgl(val.ContractDate, "DD MMM Y") }}
                    </td>
                    <td>{{ val.PoliceNo }}</td>
                    <td>{{ val.BrandName }}</td>
                    <td>{{ val.TypeName }}</td>
                    <td width="20%">
                      <v-select
                        label="ResultDescription"
                        :clearable="false"
                        :options="resultData"
                        v-model="dealerDataSelected[val.LeaseNo].Result"
                        data-vv-name="Result"
                        v-validate="'required'"
                      ></v-select>
                      <div class="text-danger text-sm">
                        {{ errors.first("Result") }}
                      </div>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        v-model="dealerDataSelected[val.LeaseNo].Checked"
                        @change="clickCheckbox($event)"
                      />
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="8">
                      <p style="margin: 5px">
                        <em>{{ gridEmptyMessage }}</em>
                      </p>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <label class="form-error" style="color: red">{{ errorGrid }}</label>
        </div>
        <br />
        <!-- Button -->
        <div class="row py-2">
          <div class="col-12 pull-right text-right">
            <CButton type="button" @click="cancelClick()" color="secondary"
              >Cancel</CButton
            >
            <label>&nbsp;&nbsp;</label>
            <button type="submit" class="btn btn-primary">
              <i class="fa fa-check"></i> Simpan
            </button>
          </div>
        </div>
      </form>
    </CCardBody>
  </CCard>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import store from "../../../../store.js";
import variable from "../../../../Shared/Variable.vue";
import httpStatusCode from "../../../../Shared/Constants.vue";
import suratKuasaService from "../Script/SuratKuasaService.js";
export default {
  name: "SuratKuasaForm",
  data() {
    return {
      lesseeNumber: "",
      lesseeName: "",
      letterNumber: "",
      letterNumberText: "",
      letterDate: moment(new Date()).format("YYYY-MM-DD"),
      branchCode: variable.currentUser().BranchDefault.BranchCode,
      collector1: "",
      collector2: "",
      collector3: "",
      dealerData: [],
      dealerList: [],
      dealerDataSelected: {},
      assignerData: [],
      assignerSelected: { Id: "", Name: "" },
      assigneeData: [],
      resultData: [],
      resultSelected: "",
      editMode: false,
      errorGrid: "",
      selectAll: false,
    };
  },
  mounted() {
    this.getAssignerData();           
  },
  computed: {
    showDelete() {
      return this.acl.Delete;
    },
    showEdit() {
      return this.acl.Edit;
    },
    gridEmptyMessage() {
      return variable.gridEmptyMessage();
    },    
  },
  watch: {
    "$store.getters.BranchDefault.BranchCode": {
      handler() {
        this.branchCode = store.getters.BranchDefault.BranchCode;
        this.getAssignerData();
      },
      deep: false,
    },
  },
  methods: {
    searchClick() {
      this.getNewDealer();
    },
    getAssignerData() {
      this.$loading(true);
      let item = {
        Category: this.branchCode == '01' ? "CL_LETTER_ASSIGNOR_HO" : "CL_LETTER_ASSIGNOR",
        ExcludedValues: [],
      };
      suratKuasaService
        .GetFilter(item)
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
              this.assignerData = optionList;
              this.assignerSelected = optionList[0];             
            }
            this.getLetterAssignee();
          } else {
            this.$loading(false);
            this.$swal("Info", this.$globalfunc.ErrorFormat(response), "error");
          }
        })
        .catch((e) => {
          this.$loading(false);
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
            this.$loading(false);
        });
    },
    getLastLetterNumber() {
      let item = {
        BranchCode: this.branchCode,
      };
      suratKuasaService
        .GetLastLetterNumber(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else {
            if (!_.isEmpty(response.data.Data)) {
              this.letterNumber = response.data.Data.Code;
              this.letterNumberText = response.data.Data.LetterNumber;
            }
          }
        })
        .catch((e) => {
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    },
    getNewDealer() {
      this.$loading(true);
      let item = {
        LesseeNumber: this.lesseeNumber,
      };
      suratKuasaService
        .GetNewDealer(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (typeof response.data !== String(httpStatusCode.UNDEFINED)) {
            if (_.isEmpty(response.data.Data)) {
              this.dealerData = [];
            } else {
              this.dealerData = response.data.Data;
              this.lesseeName = response.data.Data[0].LesseeName;

              if (!_.isEmpty(this.dealerData)) {
                var dealerDataList = [];
                var dealerDataObject = {};
                var defaultResult = _.isEmpty(this.resultData)
                  ? {}
                  : this.resultData[0];
                _.forEach(response.data.Data, function (val) {
                  var str = {
                    LeaseNo: val.LeaseNo,
                    Result: defaultResult,
                    Checked: true,
                  };
                  dealerDataList.push(str);
                  dealerDataObject[val.LeaseNo] = str;
                });
                this.dealerList = dealerDataList;
                this.dealerDataSelected = dealerDataObject;
                this.selectAll = true;
              }
            }
          }
          else {
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
    getLetterAssignee() {
      let item = {
        LetterName: "SuratKuasa",
      };
      suratKuasaService
        .GetLetterAssignee(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (typeof response.data !== String(httpStatusCode.UNDEFINED)) {
            if (!_.isEmpty(response.data.Data)) {
              var optionList = [];
              _.forEach(response.data.Data, function (val) {
                var str = {
                  Id: val.AssigneeName,
                  Name: val.AssigneeName,
                };
                optionList.push(str);
              });
              this.assigneeData = optionList;
              this.collector1 = optionList[0];
            }

            this.getResult();
          }
          else {
            this.$swal("Info", this.$globalfunc.ErrorFormat(response), "error");
          }
        })
        .catch((e) => {
          this.$loading(false);
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        });
    },
    getResult() {
      suratKuasaService
        .GetResult()
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else {
            var results = [
              {
                CollectionLetterResultId: 0,
                ResultDescription: "",
              },
            ];
            if (!_.isEmpty(response.data.Data)) {
              _.forEach(response.data.Data, function (val) {
                results.push(val);
              });
            }
            this.resultData = results;
          }
        })
        .catch((e) => {
          this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
        })
        .finally(() => {
          if (this.$route.query.ltn) {
            this.initValues();
          } else {
            this.getLastLetterNumber();
          }    
        });
    },
    saveClick() {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return;
        }

        var DealerData = [];
        _.forEach(this.dealerDataSelected, function (val) {
          if (val.Checked == true) {
            var str = {
              LeaseNumber: val.LeaseNo,
              Result: val.Result.CollectionLetterResultId == null ? 0 : parseInt(val.Result.CollectionLetterResultId),
            };
            DealerData.push(str);
          }
        });
        
        if (_.isEmpty(DealerData)) {
          this.errorGrid = "The Grid Must Be Selected";
          return;
        } else {
          this.errorGrid = "";
        }

        this.$swal(variable.confirmation()).then((result) => {
          if (result.isConfirmed == true) {
            this.$loading(true);

            let item = {
              LetterNumber: this.letterNumber,
              LetterDate: this.letterDate,
              LesseeNumber: this.lesseeNumber,
              Collector1: this.collector1 == null ? null : this.collector1.Id,
              Collector2: this.collector2,
              Collector3: this.collector3,
              Assigner: this.assignerSelected == null ? null : this.assignerSelected.Id,
              //BranchCode: this.branchCode,
              BranchCode: this.$route.query.brc == null ? this.branchCode : this.$route.query.brc,
              DealerData: DealerData,
            };

            if (this.$route.query.ltn) {
              suratKuasaService.Update(item).then((response) => {                  
                  if(response.status == httpStatusCode.BAD_REQUEST){
											this.$globalfunc.FormatErrors(response.data.Errors);
									} else if (response == "Success") {
                    this.$swal(
                      "Info",
                      "Data has been updated successfully.",
                      "success"
                    );
                    this.$router.push({
                      name: "Surat Kuasa",
                    });
                  } else if (response.status == httpStatusCode.UNAUTHORIZED) {
                    this.$globalfunc.TokenValidator(response.status);
                  } else {
                    this.$swal(
                      "Info",
                      this.$globalfunc.ErrorFormat(response),
                      "error"
                    );
                  }
                })
                .catch((e) => {
                  this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
                })
                .finally(() => {
                  this.$loading(false);
                });
            } else {
              suratKuasaService.Save(item).then((response) => {
                  if(response.status == httpStatusCode.BAD_REQUEST){
											this.$globalfunc.FormatErrors(response.data.Errors);
										}
                  else if (response == "Success") {
                    this.$swal(
                      "Info",
                      "Data has been saved successfully.",
                      "success"
                    );
                    this.$router.push({
                      name: "Surat Kuasa",
                    });
                  } else if (response.status == httpStatusCode.UNAUTHORIZED) {
                    this.$globalfunc.TokenValidator(response.status);
                  } else {
                    this.$swal(
                      "Info",
                      this.$globalfunc.ErrorFormat(response),
                      "error"
                    );
                  }
                })
                .catch((e) => {
                  this.$swal("Info", this.$globalfunc.ErrorFormat(e), "error");
                })
                .finally(() => {
                  this.$loading(false);
                });
            }
          }
        });
      });
    },
    cancelClick() {
      this.$router.push({
        name: "Business Trip Accomodation",
      });
    },
    initValues() {
      let item = {
        LetterNumber: this.$route.query.ltn,
        Period: this.$route.query.prd,
        LetterDate: this.$route.query.ltd,
        BranchCode: this.$route.query.brc,
      };
      this.editMode = true;
      
      suratKuasaService
        .GetById(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (response.status == httpStatusCode.OK) {
            this.lesseeNumber = response.data.Data.LesseeNumber;
            this.lesseeName = response.data.Data.LesseeName;
            this.letterNumber = response.data.Data.LetterNumber;
            this.letterNumberText = response.data.Data.Number;
            this.letterDate = response.data.Data.LetterDate;
            this.collector1 = _.find(this.assigneeData, {
              Id: response.data.Data.Collector1.trim(),
            });
            this.collector2 = response.data.Data.Collector2;
            this.collector3 = response.data.Data.Collector3;
            this.assignerSelected = _.find(this.assignerData, {
              Id: response.data.Data.Assigner.trim(),
            });
            this.dealerData = response.data.Data.Detail;
            if (!_.isEmpty(this.dealerData)) {
              var dealerDataList = [];
              var dealerDataObject = {};
              _.forEach(response.data.Data.Detail, function (val) {
                var str = {
                  LeaseNo: val.LeaseNo,
                  Result: {
                    CollectionLetterResultId: val.CollectionLetterResultId,
                    ResultDescription: val.ResultDescription,
                  },
                  Checked: true,
                };
                dealerDataList.push(str);
                dealerDataObject[val.LeaseNo] = str;
              });
              this.dealerList = dealerDataList;
              this.dealerDataSelected = dealerDataObject;
              this.selectAll = true;
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
    toggleSelectAll() {
      var select = (this.selectAll = !this.selectAll);
      this.dealerList.forEach(function (data) {
        data.Checked = select;
      });
    },
    clickCheckbox() {
      var DealerData = [];
      _.forEach(this.dealerDataSelected, function (val) {
        if (val.Checked == true) {
          var str = {
            LeaseNumber: val.LeaseNo,
            Result: parseInt(val.Result.CollectionLetterResultId),
          };
          DealerData.push(str);
        }
      });
      if (_.isEmpty(DealerData)) {
        this.selectAll = false;
      }
    },
  },
};
</script>

<style scoped>
.table-bordered {
  border: none;
}

.table-bordered thead th,
.table-bordered thead td {
  border-bottom-width: 1px;
}

.table thead th {
  font-weight: 500;
  vertical-align: middle;
  background: #fafafa;
}

.table th,
.table td {
  padding: 7px 12px;
}
@media (max-width: 767px) {
  .table-responsive {
    overflow-x: auto;
    overflow-y: auto;
  }
}
@media (min-width: 767px) {
  .table-responsive {
    overflow: inherit !important;
  }
}
</style>
