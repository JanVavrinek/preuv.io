import { hexColorSchema } from "@lib/schemas/color";
import { z } from "zod";

export const QRCODE_CORNER_TYPES = ["dot", "square"] as const;
export const QRCODE_CORNER_SQUARE_TYPES = ["dot", "square", "extra-rounded"] as const;
export const QRCODE_DOTS_TYPES = ["classy", "classy-rounded", "dots", "extra-rounded", "rounded", "square"] as const;
export const QRCODE_SHAPES = ["square", "circle"] as const;
export const QRCODE_EXTENSION = ["jpeg", "svg", "png", "webp"] as const;

export const qrCodeCornerDotType = z.enum(QRCODE_CORNER_TYPES);
export const qrCodeCornerSquareType = z.enum(QRCODE_CORNER_SQUARE_TYPES);
export const qrCodeDotsType = z.enum(QRCODE_DOTS_TYPES);
export const qrCodeShape = z.enum(QRCODE_SHAPES);

export const qrCodeOptionsSchema = z.object({
	cornersDotOptions: z.object({
		type: qrCodeCornerDotType,
		color: hexColorSchema,
	}),
	cornersSquareOptions: z.object({
		type: qrCodeCornerSquareType,
		color: hexColorSchema,
	}),
	dotsOptions: z.object({
		type: qrCodeDotsType,
		color: hexColorSchema,
	}),
	shape: qrCodeShape,
});
