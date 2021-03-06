<template>
  <div
    class="dao-input-container"
    :class="{
      'loading': status === 'loading' && iconInside,
      'info': status === 'info' && iconInside,
      'error': status === 'error',
      'success': status === 'success',
      'search': search && !iconInside,
      'can-empty': canEmpty,
      'icon-inside': iconInside,
      'message-bottom': messagePlacement === 'bottom' && !iconInside,
      'no-message-icon': messageNoIcon,
      'dao-input-group': $slots.prepend || $slots.append,
      'input-sm': size === 'sm',
      'block': block,
      'no-border': noBorder
    }">
    <div class="dao-input-group-addon prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="dao-input-inner" :class="{'has-append': !!$slots.append}">
      <dao-popover
        :content="currentMessage"
        :class="{
          'info': status === 'info' && iconInside,
          'error': status === 'error' && iconInside,
          'success': status === 'success' && iconInside,
          'hide': !iconInside || !messageEnabled || (showTooltipOnlyHover && !hovered),
        }"
        :placement="iconInsideMessagePlacement"
        :always="iconInside"
        :popper-cls="popperCls"
        :append-to-body="appendToBody"
        :disabled="!iconInside || !messageEnabled || (showTooltipOnlyHover && !hovered)">
        <input
          v-bind="$props"
          :value="currentValue"
          :required="isRequired"
          ref="input"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keyup="handleKeyUp"
          @keydown="handleKeyDown"
        >
      </dao-popover>
      <span class="icon loading-icon" v-if="status === 'loading' && iconInside && !isFocus" @mouseover="hoverIcon" @mouseleave="leaveIcon">
        <dao-spin></dao-spin>
      </span>
      <span class="icon info-icon" v-if="status === 'info' && iconInside && !isFocus" @mouseover="hoverIcon" @mouseleave="leaveIcon">
        <svg>
          <use xlink:href="#icon_question"></use>
        </svg>
      </span>
      <span class="icon error-icon" v-if="status === 'error' && iconInside && !isFocus" @mouseover="hoverIcon" @mouseleave="leaveIcon">
        <svg>
          <use xlink:href="#icon_warning"></use>
        </svg>
      </span>
      <span class="icon success-icon" v-if="status === 'success' && iconInside && !isFocus" @mouseover="hoverIcon" @mouseleave="leaveIcon">
        <svg>
          <use xlink:href="#icon_success"></use>
        </svg>
      </span>
      <span  
        :class="['icon', 'close-icon', { active: isFocus, disabled: disabled }]"
        v-if="canEmpty"
        @click="resetCurrentVal()">
        <svg>
          <use xlink:href="#icon_close-circled"></use>
        </svg>
      </span>
      <span  
        class="input-helper-text"
        v-if="canShowHelperText">
        {{ helperText }}
      </span>
    </div>
    <div class="dao-input-group-addon append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
    <slot name="button"></slot>
    <div class="dao-input-message error" v-if="status === 'error' && !!message && !iconInside && !$slots.prepend && !$slots.append">
      <svg class="icon"><use xlink:href="#icon_danger"></use></svg>
      <span v-html="message"></span>
    </div>
    <div class="dao-input-message success" v-if="status === 'success' && !!message && !iconInside && !$slots.prepend && !$slots.append">
      <svg class="icon"><use xlink:href="#icon_success"></use></svg>
      <span v-html="message"></span>
    </div>
  </div>
</template>
<script>
  import { _includes } from '../../utils/assist';

  export default {
    name: 'DaoInput',
    data() {
      return {
        currentValue: this.value,
        currentMessage: this.message,
        hovered: false,
        isFocus: false,
      };
    },
    props: {
      type: {
        type: String,
        default: 'text',
      },
      disabled: Boolean,
      value: [String, Number],
      size: String,
      iconInside: Boolean,
      message: String,
      messagePlacement: {
        validator(value) {
          return _includes(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'], value);
        },
        default: 'top-end',
      },
      messageNoIcon: Boolean,
      search: Boolean,
      status: {
        validator(value) {
          return _includes(['', 'loading', 'info', 'error', 'success'], value);
        },
        default: '',
      },
      block: Boolean,
      required: Boolean,
      noBorder: Boolean,
      appendToBody: {
        type: Boolean,
        default: true,
      },
      showTooltipOnlyHover: {
        type: Boolean,
        default: true,
      },
      helperText: {
        type: String,
        default: '按回车键搜索',
      },
      showHelperText: Boolean,
      // 以下使用 input 原生属性，不做特殊处理
      placeholder: String,
      readonly: Boolean,
      autofocus: Boolean,
      name: String,
      form: String,
      maxlength: Number,
      minlength: Number,
      max: Number,
      min: Number,
      step: Number,
    },
    computed: {
      isRequired() {
        return this.required || this.search;
      },
      messageEnabled() {
        return _includes(['info', 'error', 'success'], this.status) && !!this.message;
      },
      canEmpty() {
        return this.search && !this.iconInside && this.currentValue && !this.disabled;
      },
      canShowHelperText() {
        return this.search && !this.iconInside && !this.currentValue
          && this.showHelperText && !this.disabled;
      },
      iconInsideMessagePlacement() {
        if (_includes(['top-end', 'right-start', 'right'], this.messagePlacement)) {
          return this.messagePlacement;
        }
        return 'top-end';
      },
      popperCls() {
        return [
          this.iconInside && this.status,
          (!this.iconInside || !this.messageEnabled || (this.showTooltipOnlyHover && !this.hovered)) && 'hide',
          'dao-input-popover',
        ].filter(i => !!i);
      },
    },
    watch: {
      value(val) {
        this.setCurrentValue(val);
      },
      message(val) {
        this.setCurrentMessage(val);
      },
    },
    methods: {
      hoverIcon() {
        this.hovered = true;
      },
      leaveIcon() {
        this.hovered = false;
      },
      handleBlur(event) {
        this.isFocus = false;
        this.$emit('blur', event);
      },
      handleFocus(event) {
        this.isFocus = true;
        this.$emit('focus', event);
      },
      handleKeyUp(event) {
        this.$emit('keyup', event);
      },
      handleKeyDown(event) {
        this.$emit('keydown', event);
      },
      updateModel(value) {
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      },
      handleInput(event) {
        const value = event.target.value;
        this.updateModel(value);
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      setCurrentMessage(message) {
        if (message === this.currentMessage) return;
        this.currentMessage = message;
      },
      // 重置输入值
      resetCurrentVal() {
        if (this.disabled) return;
        this.currentValue = '';
        this.updateModel(this.currentValue);
      },
    },
  };
</script>

<style lang="scss">
@import './dao-input.scss';
</style>
