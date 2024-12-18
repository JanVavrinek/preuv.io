import type { CornerDotType, CornerSquareType, DotType, ShapeType } from "qr-code-styling";

export const qrCodeShapes: Record<ShapeType, string> = {
	circle: "Circle",
	square: "Square",
};

export const qrCodeCornerSquareType: Record<CornerSquareType, string> = {
	"extra-rounded": "Squircle",
	dot: "Circle",
	square: "Square",
};

export const qrCodeCornerDotType: Record<CornerDotType, string> = {
	dot: "Dot",
	square: "Square",
};

export const qrCodeDotsType: Record<DotType, string> = {
	square: "Square",
	classy: "Classy",
	"classy-rounded": "Classy rounded",
	"extra-rounded": "Extra rounded",
	dots: "Dots",
	rounded: "Rounded",
};
