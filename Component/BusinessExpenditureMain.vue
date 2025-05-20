<template>
  <div class="container">
    <StepperNavigation :currentStep="step - 1" />

    <div>
      <div v-show="step === 1">
        <ExpenditureForm ref="expenditureForm" v-model="expenditureData" />
      </div>
      <div v-show="step === 2">
        <AttachmentPage ref="attachment" v-model="attachments" />
      </div>
      <div v-show="step === 3">
        <MemoToPage ref="memoto" v-model="memoList" />
      </div>
      <div v-show="step === 4">
        <ApprovalPage ref="approvalPage" v-model="approvals" />
      </div>
    </div>

    <div class="mt-4 d-flex justify-content-between">
      <div v-if="step === 1"></div>
      <button
        v-if="step !== 1"
        class="btn btn-secondary btn-md mb-3"
        @click="step--"
      >
        Kembali
      </button>
      <button class="btn btn-primary btn-md mb-3" @click="submitForm">
        {{ step === 4 ? "Submit" : "Selanjutnya" }}
      </button>
    </div>
  </div>
</template>

<script>
import ExpenditureForm from "./BusinessExpenditureNewForm.vue";
import AttachmentPage from "./Attachment.vue";
import MemoToPage from "./MemoTo.vue";
import ApprovalPage from "./ApprovalTo.vue";
import StepperNavigation from "./StepperNavigation.vue";
import BusinessExpenditureService from "../Script/BusinessExpenditureService";

export default {
  components: {
    ExpenditureForm,
    AttachmentPage,
    MemoToPage,
    ApprovalPage,
    StepperNavigation,
  },
  data() {
    return {
      step: 1,
      expenditureData: {
        participants: [],
        promotors: [],
      },
      attachments: [],
      memoList: [],
      approvals: [],
    };
  },
  watch: {
    step(newVal) {
      this.initializeStep(newVal);
    },
  },
  mounted() {
    const savedData = localStorage.getItem("loadedFormData");
    if (savedData) {
      // Assign reactive copy supaya Vue mendeteksi perubahan
      this.expenditureData = JSON.parse(savedData);
      this.$nextTick(() => {
        this.initializeStep(this.step);
        console.log("Data edit:", this.expenditureData);
      });
    } else if (this.$route.params.memoId) {
      this.$loading(true);
      BusinessExpenditureService.GetFormDetail(this.$route.params.memoId)
        .then((res) => {
          if (res.status === 200) {
            this.expenditureData = res.data.Data;
            this.$nextTick(() => {
              this.initializeStep(this.step);
            });
          } else {
            this.$swal("Error", "Gagal mengambil data form.", "error");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$swal("Error", "Terjadi kesalahan saat memuat data.", "error");
        })
        .finally(() => {
          this.$loading(false);
        });
    } else {
      console.warn("No saved form data or memoId available.");
    }
  },
  methods: {
    initializeStep(step) {
      if (step === 1 && this.$refs.expenditureForm) {
        this.$refs.expenditureForm.initializeForm();
      } else if (step === 2 && this.$refs.attachment) {
        this.$refs.attachment.initializeAttachment();
      } else if (step === 3 && this.$refs.memoto) {
        this.$refs.memoto.initializeMemoTo();
      } else if (step === 4 && this.$refs.approvalPage) {
        this.$refs.approvalPage.initializeApproval();
      }
    },

    async submitForm() {
      if (this.step === 1) {
        const isChanged = this.$refs.expenditureForm.isFormChanged();
        if (isChanged) {
          const isSuccess = await this.$refs.expenditureForm.saveClick();
          if (isSuccess) this.step++;
        } else {
          this.step++;
        }
      } else if (this.step === 2) {
        this.step++;
        await this.$refs.attachment.cekmemo();
      } else if (this.step < 4) {
        this.step++;
      } else {
        console.log("Final submit:", {
          expenditure: this.expenditureData,
          attachments: this.attachments,
          memoList: this.memoList,
          approvals: this.approvals,
        });
        localStorage.removeItem("loadedFormData");
      }
    },
  },
};
</script>
