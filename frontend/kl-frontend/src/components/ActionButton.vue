<template>
  <v-btn
    class="custom-v-btn"
    :class="buttonClasses"
    :color="buttonColor"
    :ripple="true"
    :loading="isLoading"
    :disabled="isDisabled"
    @Click="$emit('btn-click')"
  >
    {{ textContent }}
    <img v-if="send" src="@/assets/icons/arrow-right.svg" />
    <img v-if="modify" src="@/assets/icons/pen-black.svg" />
    <img v-if="download" src="@/assets/icons/download-icon-no-border.svg" />
    <img v-if="look && btnColor === 'secondary'" src="@/assets/icons/eye.svg" />
  </v-btn>
</template>

<script>
export default {
  name: "PrimaryRoundedButton",

  props: {
    textContent: {
      type: String,
      default: "default text",
    },
    btnColor: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "secondary", "disabled"].includes(value),
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    send: {
      type: Boolean,
      default: false,
    },
    email: {
      type: Boolean,
      default: false,
    },
    back: {
      type: Boolean,
      default: false,
    },
    modify: {
      type: Boolean,
      default: false,
    },
    download: {
      type: Boolean,
      default: false,
    },
    look: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    buttonClasses() {
      return {
        "black-text": this.btnColor === "primary",
        "white-text":
          this.btnColor === "secondary" || this.btnColor === "disabled",
        "bg-primary": this.btnColor === "primary",
        "bg-secondary": this.btnColor === "secondary",
        "bg-disabled": this.btnColor === "disabled",
      };
    },
    buttonColor() {
      switch (this.btnColor) {
        case "primary":
          return "var(--color1)";
        case "secondary":
          return "var(--color2)";
        case "disabled":
          return "var(--color4)";
        default:
          return "var(--color1)";
      }
    },
  },
};
</script>

<style scoped>
.custom-v-btn {
  padding-inline: 24px;
  min-width: fit-content;
  align-content: center;
  height: 32px;
  border-radius: 5px;
  border: 1px solid var(--color3);
  box-shadow: none;
  
}

.white-text {
  color: var(--color1);
}

.black-text {
  color: var(--color4);
}

.bg-primary {
  background-color: var(--color1);
}

.bg-secondary {
  background-color: var(--color2);
}

.bg-disabled {
  background-color: var(--color4);
}

img {
  height: 24px;
}
</style>
