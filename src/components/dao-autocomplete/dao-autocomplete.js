import daoDrop from '../dao-select/dropdown.vue';
import _ from 'lodash';

export default {
  name: 'DaoAutocomplete',
  components: { daoDrop },
  props: ['value', 'options'],
  data() {
    return {
      inputText: '',
      isShow: false,
      optionIndex: 0,
    };
  },
  computed: {
    // 放这里是为了兼容异步进来的数据
    vmOptions() {
      return _.map(this.options, (o) => {
        if (_.isString(o)) {
          return {
            text: o,
            value: o,
          };
        }
        return o;
      });
    },
    filteredOption() {
      return _.filter(this.vmOptions, o => o.text.includes(this.inputText));
    },
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    blur() {
      // 要检测一下 inputText 是否在 options 中
      if (!_.find(this.filteredOption, { text: this.inputText }).value) {
        // 如果不是的话，才需要 update
        this.updateValue(this.inputText);
      }
      this.hide();
    },
    // 点击下拉菜单选项的事件
    clickOption() {
      this.chooseOption();
    },
    // 鼠标 hover 在下拉菜单的选项上
    hoverOption(optionIndex) {
      this.optionIndex = optionIndex;
    },
    // 从下拉菜单选择一个选项
    chooseOption() {
      this.inputText = this.filteredOption[this.optionIndex].text;
      const newValue = _.find(this.filteredOption, { text: this.inputText }).value;
      this.updateValue(newValue);
      this.optionIndex = 0;
    },
    // 更新外部 v-model 所绑定的值
    updateValue(value) {
      this.$emit('input', value);
    },
    // 当从组件外部改变 v-model 时，同步组件内部的 inputText
    syncValue() {
      // 如果外部修改的 v-model 和组件自己的 inputText 一样，那就不用同步了
      if (this.value === this.inputText) return;
      // 如果有选项的话，那就要根据 value 来找到选项中对应的 text
      let initText = '';
      if (this.value && this.options.length > 0) {
        const initOption = _.find(this.options, o => (o === this.value || o.value === this.value));
        if (initOption) {
          initText = initOption.text ? initOption.text : initOption;
        }
      }
      this.inputText = initText;
    },
    keyup() {
      this.show();
    },
    downArrow() {
      if (this.optionIndex < this.filteredOption.length - 1) {
        this.optionIndex = this.optionIndex + 1;
      }
    },
    upArrow() {
      if (this.optionIndex > 0) {
        this.optionIndex = this.optionIndex - 1;
      }
    },
    enter() {
      // 如果选择了某个选项
      if (this.filteredOption[this.optionIndex]) {
        this.chooseOption();
      } else {
      // 如果是直接按回车，没有选择选项的话
        this.updateValue(this.inputText);
      }
      this.hide();
    },
  },
  created() {
    this.syncValue();
  },
  watch: {
    value() {
      this.syncValue();
    },
  },
};