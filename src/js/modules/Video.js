var Video = function($frame) {
    this.$frame = $frame;
    this.resize();
}
Video.prototype.resize = function() {
    this.$frame.css({
    height: (1080/1920) * this.$frame.width()
    });
}