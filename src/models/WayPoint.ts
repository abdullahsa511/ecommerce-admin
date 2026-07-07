export interface WayPointData {
    id: number | string;
    imageWidth: number;
    imageHeight: number;
    leftPx: number;
    topPx: number;
    leftPercent: number | string;
    topPercent: number | string;
    linkActive: boolean;
    label: string;
    href: string;
}

export class WayPoint {
    id: number | string;
    imageWidth: number;
    imageHeight: number;
    leftPx: number;
    topPx: number;
    leftPercent: number | string;
    topPercent: number | string;
    linkActive: boolean;
    label: string;
    href: string;

    constructor(data: WayPointData) {
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
