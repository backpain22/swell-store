<template>
  <component :is="link ? 'BaseLink' : 'div'" :link="link" :target="target" :prodname="prodname">
   <a v-if="dataready" :href="getmyurl()">
    <button
      class="relative"
      :class="[
        {
          'w-full': fit === 'full',
          'w-full md:w-auto': fit === 'auto',
          loading: isLoading,
          disabled: disabled,
          btn: type === 'button_primary',
          'cta-link': type === 'text',
          lighter: textColor === 'light',
          dark: appearance === 'dark',
          light: appearance === 'light',
          'light-error': appearance === 'light-error',
          'btn--lg': size === 'lg',
          'flex items-center justify-center': icon,
        },
      ]"
      :type="buttonType"
      :aria-label="ariaLabel"
    >
      <!-- Loading spinner -->
      <div v-if="loadingLabel" class="center-xy absolute">
        <div v-show="isLoading" class="spinner"></div>
      </div>

      <!-- Button label -->
      <span
        v-if="label"
        :class="{
          'center-xy absolute': fit === 'full',
          'flex items-center justify-center': icon,
        }"
      >
        <!-- Icon, if applicable -->
        <BaseIcon
          v-if="icon"
          :icon="`uil:${icon}`"
          size="sm"
          class="mr-2 inline-block"
        />

        <template v-if="isLoading">
          {{ loadingLabel }}
        </template>
        <template v-else>
          {{ label }}
        </template>
      </span>
    </button>
   </a>
  </component>
</template>

<script>
export default {
  name: 'BaseButton',

  props: {
    type: {
      type: String,
      default: 'button_primary',
      validator: (value) => ['text', 'button_primary'].includes(value),
    },
    prodname: {
      type: [object, string],
      default: 'The Drip Kit.zip',
    },
    link: {
      type: [Object, String],
      default: '',
    },
    target: {
      type: String,
      default: '_blank',
    },
    appearance: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
    fit: {
      // Full for full-width, auto for responsive, static for same auto width
      type: String,
      default: 'full',
      validator: (value) => ['full', 'auto', 'static'].includes(value),
    },
    buttonType: {
      type: String,
      default: 'button',
    },
    textColor: {
      type: String,
      default: 'dark',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'Download',
    },
    ariaLabel: {
      type: String,
      default: '',
    },
    loadingLabel: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  
  data() {
    return {
      dataready: false,
      url: null,
    }
  },
  
  async mounted() {
    let vm = this;
    
    const theurl = `https://www.madeforlifemusic.com/.netlify/functions/geturl`;
    const myjson = {};
    myjson.mykey = vm.prodname + '.zip';
    const json = JSON.stringify(myjson);
    try {
        const response = await fetch(theurl, {
           method: 'POST',
           body: json 
       });
        const data = await response.json();
        vm.url = data.url;
        vm.dataready = true;
    } catch (err) {
        console.log(err);
    }
  },
  
  methods: {
    getmyurl() {
      vm = this;
      return vm.url;
    }
  }
};
</script>
