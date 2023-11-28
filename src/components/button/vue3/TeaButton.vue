<template>
  <button :class="Class" :disabled="disabled" class="button">
    <span class="text-button">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  }
})

const Class = computed(() => {
  return [
    'button',
    `button-${props.type}`,
    props.disabled ? 'button-disabled' : ''
  ]
})

</script>

<style scoped>
.button {
  border: 0;
  padding: 0 16px;
  outline: none;
  background: none;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
}

.button :hover, :focus {
  opacity: .8
}

.button-default {
  color: white;
  border: 1px solid #dcdfe6;
  background-color: #25599f;
}

.button-default :hover, :focus {
  opacity: .8;
}

.button-disabled {
  opacity: .4;
  cursor: no-drop;
}

.button-disabled:hover, :focus {
  opacity: .4;
}

.text-button {
  font-weight: 500;
  font-size: .875rem !important;
  line-height: 2.25rem;
  letter-spacing: .0892857143em !important;
  text-transform: uppercase !important;
}
</style>

