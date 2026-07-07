export class WayPoint {
    constructor(data) {
        this.id = data.id;
        this.imageWidth = data.imageWidth;
        this.imageHeight = data.imageHeight;
        this.leftPx = data.leftPx;
        this.topPx = data.topPx;
        this.leftPercent = data.leftPercent;
        this.topPercent = data.topPercent;
        this.linkActive = data.linkActive;
        this.label = data.label;
        this.href = data.href;
    }
}