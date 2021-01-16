/**
 * 座標のクラス
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    eq(other) {
        return this.x == other.x && this.y == other.y;
    }

    clone() {
        return new Point(this.x, this.y);
    }
}

function point(x, y) {
    return new Point(x, y);
}