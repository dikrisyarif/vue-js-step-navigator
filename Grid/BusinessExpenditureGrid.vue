<template>
  <div>
    <h4 class="mb-3">All Forms</h4>

    <div v-if="forms.length > 0">
      <div
        v-for="(item, index) in paginatedForms"
        :key="item.MemoID"
        class="card mb-3 shadow-sm cursor-pointer"
        :class="{ 'border-primary': selectedMemoID === item.MemoID }"
        @click="onSelect(item)"
      >
        <div
          class="card-body d-flex justify-content-between align-items-center position-relative"
        >
          <!-- MemoID di pojok kanan atas -->
          <span class="memo-id-badge">{{ item.MemoID }}</span>


          <div>
            <div class="text-muted">{{ item.MemoNo }}</div>
            <h5 class="mb-1">{{ item.ExpenseType }}</h5>
            <div class="d-flex align-items-center text-muted">
              <i class="fas fa-calendar-alt mr-1"></i>
              Proposed {{ formatDate(item.ExpenseDate) }}
            </div>
          </div>

          <!-- Status badge tetap di kanan bawah -->
          <span class="badge bg-secondary">Draft</span>
        </div>
      </div>

      <b-pagination
        v-model="currentPage"
        :total-rows="forms.length"
        :per-page="pageSize"
        align="center"
        class="mt-3"
      ></b-pagination>
    </div>
    <div v-else class="text-center text-muted mt-5">No forms available.</div>
  </div>
</template>

<script>
import { BPagination } from "bootstrap-vue";
import moment from "moment";
import BusinessExpenditureService from "../Script/BusinessExpenditureService";
import httpStatusCode from "../../../../Shared/Variable.vue";

export default {
  components: { BPagination },
  data() {
    return {
      forms: [],
      currentPage: 1,
      pageSize: 5,
      selectedMemoID: null,
    };
  },
  computed: {
    paginatedForms() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.forms.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.loadForms();
  },
  methods: {
    loadForms() {
      this.$loading(true);
      BusinessExpenditureService.GetFormList()
        .then((res) => {
          console.log("response: ", res);

          if (res.status === 200) {
            this.forms = res.data.Data || [];
          } else {
            this.$swal("Error", "Failed to load forms.", "error");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$swal("Error", "Failed to load forms.", "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    },
    formatDate(date) {
      return moment(date).format("DD MMM YYYY");
    },
    onSelect(item) {
      this.selectedMemoID = item.MemoID;

      this.$loading(true);
      BusinessExpenditureService.GetFormDetail(item.MemoID)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("loadedFormData", JSON.stringify(res.data.Data));
            this.$router.push({
              name: "Add New Form Expenditure",
              params: { memoId: item.MemoID },
              query: { step: 1 },
              state: { formData: res.data.Data },
            });
          } else {
            this.$swal("Error", "Failed to load form detail.", "error");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$swal("Error", "Failed to load form detail.", "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.memo-id-badge {
  position: absolute;
  top: 8px;
  right: 12px;
}

</style>
