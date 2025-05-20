<template>
    <div class="stepper-container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-wrapper"
      >
        <!-- Icon -->
        <div
          class="step-icon"
          :class="{
            active: index === currentStep,
            completed: index < currentStep,
            pending: index > currentStep,
          }"
        >
          <i :class="step.icon"></i>
        </div>
  
        <!-- Garis antar icon, tidak muncul di step terakhir -->
        <div
          v-if="index < steps.length - 1"
          class="step-line"
          :class="{
            activeLine: index < currentStep,
            pendingLine: index >= currentStep,
          }"
        ></div>
  
        <!-- Label -->
        <div class="step-label" :class="{ activeLabel: index === currentStep }">
          {{ step.label }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentStep: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        steps: [
          { label: "FORM", icon: "fas fa-check" },
          { label: "ATTACHMENT", icon: "fas fa-paperclip" },
          { label: "MEMO TO", icon: "fas fa-pen" },
          { label: "APPROVAL TO", icon: "fas fa-user" },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .stepper-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    padding: 1rem;
    margin-top: -30px;
    margin-bottom: -10px;
  }
  
  .step-wrapper {
    position: relative;
    flex: 1;
    text-align: center;
  }
  
  /* Icon Styling */
  .step-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
  }
  
  .step-icon.active,
  .step-icon.completed {
    background: linear-gradient(45deg, #f7d15e, #e4a0f7);
    border: 2px solid #fff;
  }
  
  .step-icon.pending {
    background-color: #cfd9e5;
  }
  
  /* Label Styling */
  .step-label {
    font-size: 0.75rem;
    margin-top: 6px;
    color: #8898aa;
    font-weight: 500;
  }
  
  .step-label.activeLabel {
    font-weight: 700;
    color: black;
  }
  
  /* Garis antar ikon */
  .step-line {
    position: absolute;
    top: 18px; /* tengah icon */
    left: 50%;
    right: -50%; /* menjulur ke ikon sebelah kanan */
    height: 2px;
    background-color: #d3dbe7;
    z-index: 1;
  }
  
  .step-line.activeLine {
    background: linear-gradient(to right, #ee9ca7, #ffdde1);
  }
  </style>
  