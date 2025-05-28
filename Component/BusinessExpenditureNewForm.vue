<style>
/* Menengahkan radio button di dalam sel tabel */
.custom-card-body {
  border-radius: 10px; /* Membuat sudut membulat */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan halus */
  margin-top: 10px; /* Memberikan jarak antar card */
  margin-bottom: 10px; /* Memberikan jarak antar card */
  padding: 15px; /* Memberikan padding pada card */
  background-color: #fff; /* Background putih agar lebih bersih */
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Menambahkan bayangan agar header terlihat lebih jelas */
}

.table-bordered {
  border: none;
}

.table-bordered thead th,
.table-bordered thead td {
  border-bottom-width: 1px;
}

.table th,
.table td {
  padding: 7px 12px;
}

.modal-backdrop {
  background-color: transparent !important;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-secondary {
  background-color: #e5e7eb;
}

.card-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.add-btn {
  background-color: white;
  border: 1px solid #3f51b5;
  color: #3f51b5;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #f0f2ff;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.badge {
  background-color: #e0edff;
  color: #007bff;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.participant-card {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}

.participant-card .btn {
  background: none;
  border: none;
}

.participant-card .btn i {
  font-size: 16px;
}
/* CSS untuk memperbesar tinggi modal */
.custom-modal-dialog {
  max-width: 95% !important;
  width: auto !important;
  max-height: 90vh;
}

.modal-content {
  min-height: 400px; /* Atau sesuai kebutuhan kamu */
}

/* Biar input tidak terlalu kecil saat horisontal scroll */
.min-width-input {
  min-width: 200px;
}

/* Styling tambahan untuk vue-select */
.form-select-vue .vs__dropdown-toggle {
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-height: 38px;
  padding: 4px 8px;
}
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.modal-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.btn-lg {
  padding: 0.75rem 1.5rem !important;
  font-size: 1.25rem !important;
}
</style>

<template>
  <div>
    <!-- FORM UTAMA -->
    <CCardBody class="custom-card-body">
      <form class="form-expenditure-info">
        <div class="row mb-3">
          <div class="col-12">
            <h4 class="font-weight-bold">Expenditure Information</h4>
          </div>
        </div>

        <div class="row align-items-end">
          <div class="col-md-3">
            <label class="form-label">Expense Type*</label>
            <v-select
              label="Name"
              :options="formData.expenseTypes"
              v-model="formData.expenseTypeSelected"
              @input="onChangeExpenseType"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">Expense Type Detail*</label>
            <v-select
              label="Name"
              :options="formData.expenseDetails"
              v-model="formData.expenseDetailSelected"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">Expense Date*</label>
            <date-picker
              style="width: 100%"
              v-model="formData.expenseDate"
              format="DD MMM YYYY"
              value-type="YYYY-MM-DD"
            />
          </div>

          <div class="col-md-3">
            <label class="form-label">Category*</label>
            <v-select
              label="Name"
              :options="formData.categories"
              v-model="formData.categorySelected"
            />
          </div>
        </div>

        <div class="row mt-3" v-if="shouldShowDetailInput">
          <div class="col-md-6">
            <label class="form-label">{{ detailLabel }}*</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.otherDetail"
            />
          </div>
        </div>

        <div class="row mt-4">
          <div class="col-12">
            <h5 class="font-weight-bold">Venue</h5>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label class="form-label">Venue Name*</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.venueName"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Venue Address*</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.venueAddress"
            />
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-6">
            <label class="form-label">Price Amount*</label>
            <input
              type="text"
              class="form-control"
              v-model="formattedPriceAmount"
              @input="formatPriceAmount"
              placeholder="Rp0"
            />
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-12">
            <label class="form-label">Purpose*</label>
            <textarea
              class="form-control"
              v-model="formData.purpose"
              rows="3"
              placeholder="Enter purpose here"
            ></textarea>
          </div>
        </div>

        <div v-if="exceedsGratification" class="mt-3">
          <div class="d-flex align-items-center text-danger mb-2">
            <i class="fas fa-info-circle mr-2"></i>
            <strong>Exceed the Regulation of Gratification</strong>
          </div>
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" checked disabled />
            <label class="form-check-label">
              The price amount filled has surpassed Rp1.000.000 and exceed the
              Regulation of Gratification. Please fill the remark below
            </label>
          </div>
          <div class="form-group">
            <label class="form-label">Remark*</label>
            <textarea
              class="form-control"
              v-model="formData.gratificationNotes"
              rows="3"
              placeholder="Enter remark"
              required
            ></textarea>
          </div>
        </div>
      </form>
    </CCardBody>

    <div class="mt-4">
      <div class="card-container">
        <!-- Participant Card -->
        <div class="card">
          <div class="card-header">
            <h2>Participants</h2>
            <button
              class="btn btn-primary mb-3"
              @click="showParticipantModal = true"
            >
              + Add Participant
            </button>
          </div>
          <hr />
          <div
            v-if="formData.participants.length === 0"
            class="text-center text-muted py-5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="No Data"
              width="100"
            />
            <p class="mt-2">No Data</p>
          </div>
          <div>
            <div
              class="participant-card mb-2"
              v-for="(p, index) in formData.participants"
              :key="index"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="badge bg-secondary mb-1">{{
                    p.status.Name
                  }}</span>
                  <div class="fw-bold">{{ p.name }}</div>
                  <div class="small">{{ p.position }}</div>
                  <div class="text-muted small">{{ p.company }}</div>
                </div>
                <div class="d-flex flex-column align-items-end ms-2">
                  <button
                    class="btn btn-sm text-primary p-1"
                    @click="editParticipant(index)"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm text-danger p-1"
                    @click="deleteParticipant(index)"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Promotor Card -->
        <div class="card">
          <div class="card-header">
            <h2>Promotor</h2>
            <button
              class="btn btn-primary mb-3"
              @click="showPromotorModal = true"
            >
              + Add Promotor
            </button>
          </div>
          <hr />
          <div
            v-if="formData.promotors.length === 0"
            class="text-center text-muted py-5"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
              alt="No Data"
              width="100"
            />
            <p class="mt-2">No Data</p>
          </div>
          <div>
            <div
              class="participant-card mb-2"
              v-for="(p, index) in formData.promotors"
              :key="index"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="fw-bold">{{ p.employee.Name }}</div>
                  <div class="small">{{ p.position }}</div>
                  <div class="text-muted small">{{ p.divisi }}</div>
                </div>
                <div class="d-flex flex-column align-items-end ms-2">
                  <button
                    class="btn btn-sm text-primary p-1 mb-1"
                    @click="editPromotor(index)"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm text-danger p-1"
                    @click="deletePromotor(index)"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Participant Modal -->
      <b-modal
        v-model="showParticipantModal"
        hide-footer
        size="xl"
        :backdrop="'static'"
        :keyboard="false"
        centered
        dialog-class="custom-modal-dialog"
      >
        <template #modal-header>
          <div
            class="d-flex justify-content-between align-items-center w-100 px-3 pt-3"
          >
            <h5 class="mb-0">Add Participants</h5>
            <button class="btn btn-sm btn-outline-primary" @click="addRow">
              + Add Participant
            </button>
          </div>
        </template>

        <div
          v-for="(item, index) in formData.tempParticipants"
          :key="index"
          class="row align-items-center gx-2 gy-2 mb-2"
        >
          <div class="col-md-3 min-width-input">
            <input
              type="text"
              v-model="item.name"
              class="form-control"
              placeholder="Name"
            />
          </div>
          <div class="col-md-3 min-width-input">
            <input
              type="text"
              v-model="item.position"
              class="form-control"
              placeholder="Position"
            />
          </div>
          <div class="col-md-3 min-width-input">
            <input
              type="text"
              v-model="item.company"
              class="form-control"
              placeholder="Company/Division"
            />
          </div>
          <div class="col-md-2 min-width-input">
            <v-select
              label="Name"
              v-model="item.status"
              :options="formData.expenseStatus"
              clearable
            />
          </div>
          <div
            class="col-md-1 d-flex justify-content-center align-items-center"
          >
            <button
              class="btn btn-sm text-danger p-1"
              @click="removeRow(index)"
              title="Delete"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-end m-3">
          <button
            class="btn btn-secondary me-2 mr-2"
            @click="showParticipantModal = false"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="submitParticipant">
            Submit
          </button>
        </div>
      </b-modal>

      <!-- Promotor Modal -->
      <b-modal
        v-model="showPromotorModal"
        hide-footer
        size="xl"
        :backdrop="'static'"
        :keyboard="false"
        centered
      >
        <template #modal-header>
          <div
            class="d-flex justify-content-between align-items-center w-100 px-3 pt-3"
          >
            <h5 class="mb-0">Add Promotor</h5>
            <button
              class="btn btn-sm btn-outline-primary"
              @click="addPromotorRow"
            >
              + Add Promotor
            </button>
          </div>
        </template>

        <div
          v-for="(item, index) in formData.tempPromotors"
          :key="index"
          class="row align-items-center gx-2 gy-2 mb-2"
        >
          <div class="col-md-4 min-width-input">
            <v-select
              v-model="item.divisi"
              :options="formData.divisiOptions"
              label="Name"
              clearable
              placeholder="Divisi"
            />
          </div>
          <div class="col-md-4 min-width-input">
            <v-select
              v-model="item.position"
              :options="getAvailablePositions(index)"
              label="Name"
              clearable
              placeholder="Position"
            />
          </div>
          <div class="col-md-3 min-width-input">
            <v-select
              v-model="item.employee"
              :options="getAvailableEmployees(index)"
              label="Name"
              clearable
              placeholder="Employee"
            />
          </div>
          <div
            class="col-md-1 d-flex justify-content-center align-items-center"
          >
            <button
              class="btn btn-sm text-danger p-1"
              @click="removePromotorRow(index)"
              title="Delete"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-end m-3">
          <button
            class="btn btn-secondary me-2 mr-2"
            @click="showPromotorModal = false"
          >
            Cancel
          </button>
          <button class="btn btn-primary" @click="submitPromotor">
            Submit
          </button>
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import datePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { BModal } from "bootstrap-vue";
import BusinessExpenditureService from "../Script/BusinessExpenditureService";
import variable from "../../../../Shared/Variable.vue";
import httpStatusCode from "../../../../Shared/Constants.vue";
import _ from "lodash";

export default {
  name: "businessExpenditure",
  components: {
    "date-picker": datePicker,
    BModal,
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  },

  data() {
    return {
      formData: {
        participants: [],
        promotors: [],
        expenseTypeSelected: null,
        expenseTypes: [],
        expenseDetailSelected: null,
        expenseDetails: [],
        expenseDate: '',
        categorySelected: null,
        categories: [],
        otherDetail: '',
        venueName: '',
        venueAddress: '',
        priceAmount: '',
        purpose: '',
        gratificationNotes: '',
        expenseStatus: [],
        tempParticipants: [
          { name: '', position: '', company: '', status: '' }
        ],
        tempPromotors: [
          { divisi: null, position: null, employee: null }
        ],
        divisiOptions: [],
        positionOptions: [],
        employeeOptions: [],
        editIndex: null,
        editPromotorIndex: null,
      },
      showParticipantModal: false,
      showPromotorModal: false,
      allExpenseDetailsMap: {},
      memoIdLocal: null,
      initialFormData: null,
      // Tambahan untuk pending id agar binding dropdown setelah options ready
      pendingExpenseTypeId: null,
      pendingExpenseDetailId: null,
      pendingCategoryId: null,
      // Tambahan untuk pending Name agar binding by Name setelah options ready
      pendingExpenseTypeName: null,
      pendingExpenseDetailName: null,
      pendingCategoryName: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal) {
        // console.log('[Watcher value] newVal:', JSON.parse(JSON.stringify(newVal)));
        if (newVal && typeof newVal === "object") {
          this.memoIdLocal = newVal.MemoId || null;
          // console.log("New value:", newVal);
          
          // Simpan id ke pending agar bisa di-bind setelah options ready
          this.pendingExpenseTypeId = null;
          this.pendingExpenseDetailId = null;
          this.pendingCategoryId = null;
          // Field lain tetap langsung diisi
          this.formData.expenseDate = newVal.ExpenseDate || '';
          this.formData.otherDetail = newVal.OtherDetail || newVal.Detail || newVal.other_detail || newVal.Others || '';
          this.formData.venueName = newVal.VenueName || '';
          this.formData.venueAddress = newVal.VenueAddress || '';
          this.formData.priceAmount = newVal.PriceAmount ? String(newVal.PriceAmount) : '';
          this.formData.purpose = newVal.Purpose || '';
          this.formData.gratificationNotes = newVal.GratificationNotes || '';
          // Participants
          if (Array.isArray(newVal.Participant)) {
            this.formData.participants = newVal.Participant.map(p => ({
              name: p.Name || '',
              position: p.Position || '',
              company: p.CompanyOrDivision || '',
              status: this.formData.expenseStatus.find(s => s.Name === p.Status) || { Name: p.Status || '' }
            }));
          } else {
            this.formData.participants = [];
          }
          // Promotors
          if (Array.isArray(newVal.Promotor)) {
            this.formData.promotors = newVal.Promotor.map(p => ({
              divisi: p.Division || '',
              position: p.Position || '',
              employee: { Name: p.Name || '' }
            }));
          } else {
            this.formData.promotors = [];
          }
          // Binding dropdown by Name (setelah options masuk)
          this.$nextTick(() => {
            // ExpenseType
            if (newVal.ExpenseType) {
              if (this.formData.expenseTypes.length) {
                this.formData.expenseTypeSelected = this.formData.expenseTypes.find(e => e.Name === newVal.ExpenseType) || null;
                this.pendingExpenseTypeName = null;
              } else {
                this.pendingExpenseTypeName = newVal.ExpenseType;
              }
            } else {
              this.formData.expenseTypeSelected = null;
              this.pendingExpenseTypeName = null;
            }
            // ExpenseTypeDetail
            if (newVal.ExpenseTypeDetail) {
              if (this.formData.expenseDetails.length) {
                this.formData.expenseDetailSelected = this.formData.expenseDetails.find(e => e.Name === newVal.ExpenseTypeDetail) || null;
                this.pendingExpenseDetailName = null;
              } else {
                this.pendingExpenseDetailName = newVal.ExpenseTypeDetail;
              }
            } else {
              this.formData.expenseDetailSelected = null;
              this.pendingExpenseDetailName = null;
            }
            // Category
            if (newVal.Category) {
              if (this.formData.categories.length) {
                this.formData.categorySelected = this.formData.categories.find(e => e.Name === newVal.Category) || null;
                this.pendingCategoryName = null;
              } else {
                this.pendingCategoryName = newVal.Category;
              }
            } else {
              this.formData.categorySelected = null;
              this.pendingCategoryName = null;
            }
          });
          // console.log('[Watcher value] formData.otherDetail:', this.formData.otherDetail);
        } else {
          this.pendingExpenseTypeId = null;
          this.pendingExpenseDetailId = null;
          this.pendingCategoryId = null;
          this.formData.expenseDate = '';
          this.formData.otherDetail = '';
          this.formData.venueName = '';
          this.formData.venueAddress = '';
          this.formData.priceAmount = '';
          this.formData.purpose = '';
          this.formData.gratificationNotes = '';
          this.formData.participants = [];
          this.formData.promotors = [];
        }
        this.initialFormData = this.cloneFormData(this.formData);
        // console.log("Initial form data:", JSON.parse(JSON.stringify(this.initialFormData)));
        this.$nextTick(() => {
          this.resetInitialFormDataIfReady();
        });
      },
    },
    'formData.expenseTypeSelected': {
      handler(newVal) {
        if (newVal && newVal.Id) {
          this.onChangeExpenseType(newVal);
        } else {
          this.formData.expenseDetails = [];
          this.formData.expenseDetailSelected = null;
        }
        this.$nextTick(() => {
          this.resetInitialFormDataIfReady();
        });
      },
      immediate: true,
      deep: true
    },
    'formData.expenseDetailSelected': {
      handler() {
        this.$nextTick(() => {
          this.resetInitialFormDataIfReady();
        });
      },
      deep: true
    },
    'formData.categorySelected': {
      handler() {
        this.$nextTick(() => {
          this.resetInitialFormDataIfReady();
        });
      },
      deep: true
    },
    'formData.expenseDetails': {
      handler(newVal) {
        // Jika ada pendingExpenseDetailName, binding by Name setelah options expenseDetails masuk
        if (this.pendingExpenseDetailName && Array.isArray(newVal) && newVal.length) {
          this.formData.expenseDetailSelected = newVal.find(e => e.Name === this.pendingExpenseDetailName) || null;
          this.pendingExpenseDetailName = null;
        }
      },
      immediate: false,
      deep: true
    },
  },
  computed: {
    shouldShowDetailInput() {
      const typeId = this.formData.expenseTypeSelected?.Id ?? "";
      const detailName = this.formData.expenseDetailSelected?.Name ?? "";

      return (
        (["1", "2"].includes(typeId) && detailName && detailName !== "-") ||
        (typeId === "3" && detailName === "Others")
      );
    },
    detailLabel() {
      const selectedId = this.formData.expenseDetailSelected.Id;

      // if (!selectedId || selectedId === "-") return "Expense Detail";

      const found = this.formData.expenseDetails.find(
        (item) => item.Id === selectedId
      );

      return found ? `${found.Name} Detail` : "Other Detail";
    },
    formattedPriceAmount: {
      get() {
        return this.formData.priceAmount
          ? this.formatCurrency(this.formData.priceAmount)
          : "";
      },
      set(value) {
        // Hanya simpan angka ke priceAmount
        this.formData.priceAmount = value.replace(/[^0-9]/g, "");
      },
    },
    exceedsGratification() {
      return this.getNumericPriceAmount(this.formattedPriceAmount) >= 1000000;
    },
  },
  mounted() {
    this.fetchExpenseCombo("EXPENSE_TYPE", "expenseTypes");
    this.fetchExpenseCombo("Category_PEB", "categories");
    this.fetchExpenseCombo("Status_PEB", "expenseStatus");
    this.preloadExpenseDetails(); // Tetap dipanggil terpisah
    this.getDivisiWithPositionsAndEmployees();
    // this.$store.commit("clearMemoId");
    this.initialFormData = this.cloneFormData(this.formData);
    // console.log("Initial form data:", this.initialFormData);
    // console.log("form data:", this.formData);
    
  },

  methods: {
    getNumericPriceAmount(val) {
      return parseInt(val.replace(/[^\d]/g, "")) || 0;
    },
    addRow() {
      this.formData.tempParticipants.push({
        name: "",
        position: "",
        company: "",
        status: "",
      });
    },
    removeRow(index) {
      this.formData.tempParticipants.splice(index, 1);
    },
    submitParticipant() {
      const validEntries = this.formData.tempParticipants.filter(
        (p) => p.name && p.status
      );
      // console.log("masuk submit");

      if (this.formData.editIndex !== null) {
        // Edit mode: replace participant
        this.$set(
          this.formData.participants,
          this.formData.editIndex,
          validEntries[0]
        );
        this.formData.editIndex = null;
      } else {
        // Add mode
        this.formData.participants.push(...validEntries);
      }

      this.formData.tempParticipants = [
        { name: "", position: "", company: "", status: "" },
      ];
      this.showParticipantModal = false;
    },
    editParticipant(index) {
      const p = this.formData.participants[index];
      this.formData.tempParticipants = [Object.assign({}, p)];
      this.formData.editIndex = index;
      this.showParticipantModal = true;
    },
    deleteParticipant(index) {
      this.formData.participants.splice(index, 1);
    },
    formatPriceAmount(event) {
      const input = event.target.value.replace(/[^0-9]/g, ""); // Hanya ambil angka
      this.formData.priceAmount = input; // Simpan angka ke priceAmount
      event.target.value = this.formatCurrency(input); // Format dan tampilkan
    },
    formatCurrency(value) {
      if (!value) return "";
      const numberValue = parseInt(value, 10);
      return numberValue.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    editPromotor(index) {
      const p = this.formData.promotors[index];
      // console.log('pppp: ', p);

      // Step 1: Set divisi dan position dulu (tanpa employee)
      const divisiObj = this.formData.divisiOptions.find(
        (d) => d.Name === p.divisi
      );

      this.formData.tempPromotors = [
        {
          divisi: divisiObj,
          position: p.position,
          employee: null,
        },
      ];

      this.formData.editPromotorIndex = index;

      // Step 2: Setelah DOM dan data reactive update, baru isi employee
      this.$nextTick(() => {
        const matchedEmployee = this.getMatchedEmployee(
          p.divisi,
          p.position,
          p.employee?.Id,
          0
        );

        this.formData.tempPromotors[0].employee = matchedEmployee;

        this.showPromotorModal = true;
        // console.log("Matched employee:", matchedEmployee);
      });
    },
    getMatchedEmployee(divisiName, positionName, employeeId, index) {
      const availableEmployees = this.getAvailableEmployees(index);
      // console.log('employeID: ', employeeId);
      // console.log('sumbermaslah: ', availableEmployees);

      return availableEmployees.find((e) => e.Id === employeeId) || null;
    },
    addPromotorRow() {
      this.formData.tempPromotors.push({
        divisi: null,
        position: null,
        employee: null,
      });
    },
    removePromotorRow(index) {
      this.formData.tempPromotors.splice(index, 1);
    },
    submitPromotor() {
      const validEntries = this.formData.tempPromotors.filter(
        (p) => p.divisi && p.position && p.employee
      );
      // console.log("data: ", validEntries);

      const transformed = validEntries.map((p) => ({
        divisi: p.divisi.Name,
        position: p.position,
        employee: { Id: p.employee.Id, Name: p.employee.Name },
      }));

      if (this.formData.editPromotorIndex !== null) {
        this.$set(
          this.formData.promotors,
          this.formData.editPromotorIndex,
          transformed[0]
        );
        this.formData.editPromotorIndex = null;
      } else {
        this.formData.promotors.push(...transformed);
      }

      this.formData.tempPromotors = [
        { divisi: null, position: null, employee: null },
      ];
      this.showPromotorModal = false;
    },
    deletePromotor(index) {
      this.formData.promotors.splice(index, 1);
    },
    fetchExpenseCombo(category, targetKey) {
      this.$loading(true);

      let item = {
        Category: category,
        ExcludedValues: [],
      };

      BusinessExpenditureService.GetExpense(item)
        .then((response) => {
          if (response.status === httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (response.status === httpStatusCode.OK) {
            if (!_.isEmpty(response.data.Data)) {
              const optionList = response.data.Data.map((val) => ({
                Id: val.ComboValue,
                Name: val.ComboDescription,
              }));
              // Assign ke formData dynamic
              this.$set(this.formData, targetKey, optionList);
              // Setelah options ready, bind selected jika ada pending Name
              if (targetKey === 'expenseTypes' && this.pendingExpenseTypeName) {
                this.formData.expenseTypeSelected = optionList.find(e => e.Name === this.pendingExpenseTypeName) || null;
                this.pendingExpenseTypeName = null;
              }
              if (targetKey === 'expenseDetails' && this.pendingExpenseDetailName) {
                this.formData.expenseDetailSelected = optionList.find(e => e.Name === this.pendingExpenseDetailName) || null;
                this.pendingExpenseDetailName = null;
              }
              if (targetKey === 'categories' && this.pendingCategoryName) {
                this.formData.categorySelected = optionList.find(e => e.Name === this.pendingCategoryName) || null;
                this.pendingCategoryName = null;
              }
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
    onChangeExpenseType(value) {
      let cat_val = "";
      if (value.Id === "1") {
        cat_val = "BUSREL_DETAIL";
      } else if (value.Id === "2") {
        cat_val = "PARINREW_DETAIL";
      } else if (value.Id === "3") {
        cat_val = "ENTER_DETAIL";
      }

      // Ambil dari cache, tidak panggil API lagi
      this.formData.expenseDetails = this.allExpenseDetailsMap[cat_val] || [];

      // Perbaikan: jika ada pendingExpenseDetailName, binding ke selected by Name
      if (this.pendingExpenseDetailName) {
        this.formData.expenseDetailSelected = this.formData.expenseDetails.find(e => e.Name === this.pendingExpenseDetailName) || { Id: '', Name: '' };
        this.pendingExpenseDetailName = null;
      } else {
        this.formData.expenseDetailSelected = { Id: '', Name: '' };
      }
    },
    preloadExpenseDetails() {
      const categories = ["BUSREL_DETAIL", "PARINREW_DETAIL", "ENTER_DETAIL"];

      const requests = categories.map((cat) => {
        const item = { Category: cat, ExcludedValues: [] };
        return BusinessExpenditureService.GetExpense(item).then((res) => ({
          cat,
          data: res,
        }));
      });

      Promise.all(requests)
        .then((results) => {
          results.forEach(({ cat, data }) => {
            if (data.status === httpStatusCode.OK && data.data?.Data) {
              this.allExpenseDetailsMap[cat] = data.data.Data.map((val) => ({
                Id: val.ComboValue,
                Name: val.ComboDescription,
              }));
            }
          });
        })
        .catch((err) => {
          this.$swal("Error", "Gagal memuat data expense detail", "error");
        });
    },
    getAvailablePositions(index) {
      const divisiInput = this.formData.tempPromotors[index].divisi;
      if (!divisiInput) return [];

      const divisiName =
        typeof divisiInput === "string" ? divisiInput : divisiInput.Name;

      const found = this.formData.divisiOptions.find(
        (d) => d.Name === divisiName
      );
      return found && found.Positions ? found.Positions.map((p) => p.Name) : [];
    },
    getAvailableEmployees(index) {
      const divisiInput = this.formData.tempPromotors[index].divisi;
      const positionInput = this.formData.tempPromotors[index].position;

      if (!divisiInput || !positionInput) return [];

      const divisiName =
        typeof divisiInput === "string" ? divisiInput : divisiInput.Name;

      const foundDiv = this.formData.divisiOptions.find(
        (d) => d.Name === divisiName
      );
      if (!foundDiv || !foundDiv.Positions) return [];

      const foundPos = foundDiv.Positions.find((p) => p.Name === positionInput);
      // console.log("Available employees for index", index, this.formData.tempPromotors[index]);
      return foundPos?.Employees || [];
    },
    getDivisiWithPositionsAndEmployees() {
      this.$loading(true);
      let item = {
        LeaseNo: this.LeaseNo,
      };
      BusinessExpenditureService.GetAllPromotors(item)
        .then((response) => {
          if (response.status == httpStatusCode.UNAUTHORIZED) {
            this.$globalfunc.TokenValidator(response.status);
          } else if (
            typeof response.data !== String(httpStatusCode.UNDEFINED)
          ) {
            if (_.isEmpty(response.data.Data)) {
              this.formData.divisiOptions = [];
            } else {
              this.formData.divisiOptions = response.data.Data;
              // console.log("datapromotors: ", this.formData.divisiOptions);
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
    initializeForm() {
      this.fetchExpenseCombo("EXPENSE_TYPE", "expenseTypes");
      this.fetchExpenseCombo("Category_PEB", "categories");
      this.fetchExpenseCombo("Status_PEB", "expenseStatus");
      this.preloadExpenseDetails();
      this.getDivisiWithPositionsAndEmployees();

      // Simpan salinan awal untuk deteksi perubahan
      this.initialFormData = this.cloneFormData(this.formData);
    },
    cloneFormData(data) {
      return JSON.parse(JSON.stringify(data));
    },
    isFormChanged() {
      return (
        JSON.stringify(this.formData) !== JSON.stringify(this.initialFormData)
      );
    },
    resetInitialFormDataIfReady() {
      if (
        !this.pendingExpenseTypeId &&
        !this.pendingExpenseDetailId &&
        !this.pendingCategoryId &&
        this.formData.expenseTypeSelected &&
        this.formData.expenseDetailSelected &&
        this.formData.categorySelected
      ) {
        this.initialFormData = this.cloneFormData(this.formData);
        console.log('[resetInitialFormDataIfReady] initialFormData updated:', this.initialFormData);
      }
    },
    saveClick() {
      // console.log("data asli: ", this.initialFormData);
      // console.log("data ubah: ", this.formData);

      if (!this.isFormChanged()) {
        console.log("Tidak ada perubahan pada form, tidak perlu disimpan.");
        return true; // anggap saja lanjut ke step berikutnya
      }
      this.$validator.validateAll().then((result) => {
        if (!result) return;
        // console.log('prom: ', this.formData.promotors);

        this.$swal(variable.confirmation()).then((result) => {
          if (result.isConfirmed) {
            this.$loading(true);

            // Susun payload sesuai struktur backend
            const payload = {
              MemoId: this.memoIdLocal ? this.memoIdLocal : "",
              ExpenseTypeId: this.formData.expenseTypeSelected?.Id || 0,
              ExpenseType: this.formData.expenseTypeSelected?.Name || 0,
              ExpenseDetailId: this.formData.expenseDetailSelected?.Id || 0,
              ExpenseTypeDetail: this.formData.expenseDetailSelected?.Name || 0,
              ExpenseDate: this.formData.expenseDate,
              CategoryId: this.formData.categorySelected?.Id || 0,
              Category: this.formData.categorySelected?.Name || 0,
              OtherDetail: this.formData.otherDetail,
              Detail: this.formData.otherDetail,
              VenueName: this.formData.venueName,
              VenueAddress: this.formData.venueAddress,
              PriceAmount: parseFloat(this.formData.priceAmount || 0),
              Purpose: this.formData.purpose,
              GratificationNotes: this.formData.gratificationNotes,
              Notes: "", // Jika kamu punya field tambahan untuk catatan
              Participant: this.formData.participants.map((p) => ({
                Name: p.name,
                Position: p.position,
                CompanyOrDivision: p.company,
                StatusId: p.status.Id,
                Status: p.status.Name,
              })),
              Promotor: this.formData.promotors.map((p) => ({
                Division: p.divisi || "", // pastikan divisi dipilih
                CompanyOrDivision: p.divisi || "", // pastikan divisi dipilih
                Position: p.position || "", // pastikan posisi dipilih
                EmployeeId: p.employee?.Id || "", // pastikan employee dipilih
                Name: p.employee?.Name,
              })),
            };

            BusinessExpenditureService.Save(payload)
              .then((response) => {
                if (response.Status === 0) {
                  this.$globalfunc.FormatErrors(response.Errors);
                } else if (response.Status === 1) {
                  this.$swal("Info", "Data berhasil disimpan", "success");

                  // console.log("MemoID:", response.Data.MemoId);
                  this.$store.commit("setMemoId", response.Data.MemoId); 
                  this.memoIdLocal = this.$store.state.memoId;
                  // console.log("memoID: ", this.$store.state.memoId);
                  this.initialFormData = null;
                  this.initialFormData = this.cloneFormData(this.formData);
                  // this.$router.push({ name: "Business Eexpenditure" });
                } else if (response.status === 401) {
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
        });
      });
    },
  },
};
</script>
