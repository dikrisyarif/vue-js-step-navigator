<template>
  <div class="container">
    <StepperNavigation :currentStep="step - 1" />

    <div>
      <div v-show="step === 1">
        <ExpenditureForm ref="expenditureForm" v-model="expenditureData" />
      </div>
      <div v-show="step === 2">
        <AttachmentPage
          ref="attachment"
          v-model="attachments"
          :memo-id="expenditureData.MemoId || $route.params.memoId || ''"
        />
      </div>
      <div v-show="step === 3">
        <MemoToPage ref="memoto" v-model="memoList" />
      </div>
      <div v-show="step === 4">
        <ApprovalPage
          ref="approvalPage"
          v-model="approvals"
          :memo-id="expenditureData.MemoId || $route.params.memoId || ''"
        />
      </div>
    </div>

    <div class="mt-4 d-flex justify-content-between">
      <button
        v-if="step === 1"
        class="btn btn-secondary btn-md mb-3"
        @click="keluarMemo"
      >
        Cancel
      </button>
      <button
        v-if="step !== 1"
        class="btn btn-secondary btn-md mb-3"
        @click="step--"
      >
        Kembali
      </button>
      <button class="btn btn-primary btn-md mb-3" @click="submitForm">
        {{ step === 4 ? "Submit" : "Save" }}
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
    // Tunggu sampai MemoToPage (child) sudah dapat memoToStructure dari backend
    // lalu lakukan binding memoList jika MemoToList ada
    this.getMemoToStructureAndBindMemoList();
  },
  methods: {
    async getMemoToStructureAndBindMemoList() {
      // Ambil struktur memoTo dari backend
      await this.$refs.memoto.getBranchWithPositionsAndEmployees();
      // Setelah struktur didapat, baru lakukan binding memoList
      const savedData = localStorage.getItem("loadedFormData");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        this.expenditureData = parsed;
        this.attachments = (parsed.Attachment || []).map((att) => ({
          ...att,
          title: att.Remark || att.title || "",
          filename: att.File_Nm || att.filename || "",
          file: null,
        }));
        this.$refs.memoto.initializeMemoTo();
        // MemoToList binding ke memoList jika ada
        this.memoList = (parsed.MemoToList || []).map((memo) => {
          const memoToStructure = this.$refs.memoto.memoToStructure || [];
          const branchObj = memoToStructure.find(
            (b) => b.BranchCode == memo.BranchCd
          );
          const branch = branchObj
            ? { label: branchObj.BranchName, value: branchObj.BranchCode }
            : { label: memo.branch, value: memo.BranchCd };
          let position = { label: memo.position, value: memo.PositionID };
          let receiver = { label: memo.receiver, value: memo.EmployeeID };
          if (branchObj) {
            const posObj = branchObj.Positions.find(
              (p) => p.PositionID == memo.PositionID
            );
            if (posObj) {
              position = {
                label: posObj.PositionDesc,
                value: posObj.PositionID,
              };
              const empObj = posObj.Employees.find(
                (e) => e.EmployeeID == memo.EmployeeID
              );
              if (empObj) {
                receiver = { label: empObj.FullName, value: empObj.EmployeeID };
              }
            }
          }
          return { branch, position, receiver };
        });
        // this.memoList = (parsed.MemoToList)
        this.$nextTick(() => {
          this.initializeStep(this.step);
        });
      } else if (this.$route.params.memoId) {
        this.$loading(true);
        BusinessExpenditureService.GetFormDetail(this.$route.params.memoId)
          .then((res) => {
            if (res.status === 200) {
              this.expenditureData = res.data.Data;
              this.attachments = (res.data.Data.Attachment || []).map(
                (att) => ({
                  ...att,
                  title: att.Remark || att.title || "",
                  filename: att.File_Nm || att.filename || "",
                  file: null,
                })
              );
              // MemoToList binding ke memoList jika ada
              this.memoList = (res.data.Data.MemoToList || []).map((memo) => {
                const memoToStructure = this.$refs.memoto.memoToStructure || [];
                const branchObj = memoToStructure.find(
                  (b) => b.BranchCode == memo.BranchCd
                );
                const branch = branchObj
                  ? { label: branchObj.BranchName, value: branchObj.BranchCode }
                  : { label: "", value: memo.BranchCd };
                let position = { label: "", value: memo.PositionID };
                let receiver = { label: "", value: memo.EmployeeID };
                if (branchObj) {
                  const posObj = branchObj.Positions.find(
                    (p) => p.PositionID == memo.PositionID
                  );
                  if (posObj) {
                    position = {
                      label: posObj.PositionDesc,
                      value: posObj.PositionID,
                    };
                    const empObj = posObj.Employees.find(
                      (e) => e.EmployeeID == memo.EmployeeID
                    );
                    if (empObj) {
                      receiver = {
                        label: empObj.FullName,
                        value: empObj.EmployeeID,
                      };
                    }
                  }
                }
                return { branch, position, receiver };
              });
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
    initializeStep(step) {
      if (step === 1 && this.$refs.expenditureForm) {
        this.$refs.expenditureForm.initializeForm();
        // Set snapshot awal agar isFormChanged() akurat
        if (
          typeof this.$refs.expenditureForm.setInitialSnapshot === "function"
        ) {
          this.$refs.expenditureForm.setInitialSnapshot();
        }
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
        console.log("[submitForm] step 1, isFormChanged:", isChanged);
        if (isChanged) {
          const isSuccess = await this.$refs.expenditureForm.saveClick();
          console.log("[submitForm] step 1, saveClick result:", isSuccess);
          if (isSuccess) this.step++;
        } else {
          this.step++;
        }
      } else if (this.step === 2) {
        const isValid = await this.$refs.attachment.saveClick();
        // console.log("[submitForm] step 2, saveClick result:", isValid);
        if (!isValid) return;
        const isUploaded = await this.$refs.attachment.uploadAttachments();
        // console.log(
        //   "[submitForm] step 2, uploadAttachments result:",
        //   isUploaded
        // );
        if (isUploaded) {
          this.step++;
        }
      } else if (this.step === 3) {
        const isSaved = await this.$refs.memoto.save();
        // console.log("[submitForm] step 3, save result:", isSaved);
        if (isSaved) {
          this.step++;
        }
      } else if (this.step === 4) {
        const isSaved = await this.$refs.approvalPage.saveApprovalTo();
        console.log("[submitForm] step 4, save result:", isSaved);
      } else if (this.step < 4) {
        this.step++;
      } else {
        console.log("Final submit:", {
          expenditure: this.expenditureData,
          attachments: this.attachments,
          memoList: this.memoList,
          approvals: this.approvals,
        });
        // localStorage.removeItem("loadedFormData");
      }
    },
    keluarMemo() {
      this.$swal({
        title: "Are you sure?",
        text: "You will lose all unsaved changes.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          localStorage.removeItem("loadedFormData");
          this.$router.push({ name: "Business Eexpenditure" });
        }
      });
    },
  },
};
</script>
