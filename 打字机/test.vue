<template>
  <div>
    <p>{{ typedText }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "This is a typewriter effect.",
      typedText: "",
      charIndex: 0,
      typingSpeed: 50, // 调整打字速度（更小的值表示更快）
    };
  },
  created() {
    this.typeWriter();
  },
  methods: {
    typeWriter() {
      if (this.charIndex < this.text.length) {
        this.typedText += this.text.charAt(this.charIndex);
        this.charIndex++;
        setTimeout(this.typeWriter, this.typingSpeed);
      }
    },
  },
};
</script>

<style>
p {
  white-space: nowrap;
  overflow: hidden;
  border-right: 1px solid #000;
  animation: typing 1s steps(40, end), blink-caret 0.75s step-end infinite;
  font-size: 24px;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
}
</style>
