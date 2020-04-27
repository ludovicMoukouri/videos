<template>
      <v-btn
      :disabled="disabled"
      @click="$emit('click')"
      :class="{'': !loading, 'btn_lud': loading}">
      <loader v-if="loading" />
      <span v-else>{{ label }}</span>
      </v-btn>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
