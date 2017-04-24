module.exports = function( App ) {

  const Component = {
    data() {
      return {
        pageNumber: ''
      };
    },
    methods: {},
    mounted() {
      this.pageNumber = '1';
    },
    activated() {
    },
    destroyed() {
    }
  };

  return Component;
};
