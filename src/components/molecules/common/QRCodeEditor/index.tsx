import { type VoidProps, createEffect, createMemo, createSignal } from "solid-js";
import type { QRCodeEditorProps } from "./types";

import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import useI18n from "@lib/i18n/hooks/useI18n";
import { createForm, getValues, setValue, zodForm } from "@modular-forms/solid";
import QRCodeStyling, {
	type DotType,
	type CornerDotType,
	type CornerSquareType,
	type ShapeType,
	type FileExtension,
} from "qr-code-styling";
import { FaSolidDownload } from "solid-icons/fa";
import {
	QRCODE_CORNER_SQUARE_TYPES,
	QRCODE_CORNER_TYPES,
	QRCODE_DOTS_TYPES,
	QRCODE_EXTENSION as QRCODE_EXTENSIONS,
	QRCODE_SHAPES,
	qrCodeOptionsSchema as schema,
} from "./schemas";

export default function QRCodeEditor(props: VoidProps<QRCodeEditorProps>) {
	const { c } = useI18n();
	const [extension, setExtension] = createSignal<ComboboxItem<FileExtension>>({ label: "", value: "jpeg" });
	const [root, setRoot] = createSignal<HTMLDivElement>();
	const [optionsForm, { Form, Field }] = createForm({
		validate: zodForm(schema),
		initialValues: {
			cornersDotOptions: {
				type: "square",
				color: "#000",
			},
			cornersSquareOptions: {
				type: "square",
				color: "#000",
			},
			dotsOptions: {
				type: "square",
				color: "#000",
			},
			shape: "square",
		},
	});

	const qrCode = createMemo(
		() =>
			new QRCodeStyling({
				data: props.link,
				width: 300,
				height: 300,
				...getValues(optionsForm),
			}),
	);

	createEffect(() => {
		const r = root();
		if (!r) return;
		r.innerHTML = "";

		qrCode().append(r);
	});

	const handleDownload = () => qrCode().download({ extension: extension().value, name: props.name });

	return (
		<Form class="flex flex-col-reverse gap-6 md:flex-row md:gap-12">
			<div class="flex w-full flex-col gap-3 md:max-w-sm">
				<Field name="shape">
					{(field, props) => (
						<>
							<Combobox
								options={QRCODE_SHAPES.map<ComboboxItem>((s) => ({
									label: c.app.formShare.link.qr.options.shape[s](),
									value: s,
								}))}
								value={{
									label: c.app.formShare.link.qr.options.shape[field.value ?? "square"](),
									value: field.value ?? "",
								}}
								onChange={(v) => setValue(optionsForm, "shape", (v?.value ?? "square") as ShapeType)}
								label={c.app.formShare.link.qr.options.shapeTitle()}
								parseResult={schema.shape[field.name].safeParse(field.value)}
								showErrors={!!field.error.length}
							/>
							<input {...props} hidden />
						</>
					)}
				</Field>
				<hr />
				<Field name="cornersSquareOptions.type">
					{(field, props) => (
						<>
							<Combobox
								options={QRCODE_CORNER_SQUARE_TYPES.map<ComboboxItem>((s) => ({
									label: c.app.formShare.link.qr.options.cornerSquareShape[s](),
									value: s,
								}))}
								value={{
									label: c.app.formShare.link.qr.options.cornerSquareShape[field.value ?? "square"](),
									value: field.value ?? "",
								}}
								onChange={(v) =>
									setValue(optionsForm, "cornersSquareOptions.type", (v?.value ?? "square") as CornerSquareType)
								}
								label={c.app.formShare.link.qr.options.cornerSquareShapeTitle()}
								parseResult={schema.shape.cornersSquareOptions.shape.type.safeParse(field.value)}
								showErrors={!!field.error.length}
							/>
							<input {...props} hidden />
						</>
					)}
				</Field>
				<Field name="cornersSquareOptions.color">
					{(_field, props) => (
						<>
							<input {...props} type="color" class="w-full rounded-xl border border-pv-blue-200" />
						</>
					)}
				</Field>
				<hr />
				<Field name="cornersDotOptions.type">
					{(field, props) => (
						<>
							<Combobox
								options={QRCODE_CORNER_TYPES.map<ComboboxItem>((s) => ({
									label: c.app.formShare.link.qr.options.cornerDotShape[s](),
									value: s,
								}))}
								value={{
									label: c.app.formShare.link.qr.options.cornerDotShape[field.value ?? "square"](),
									value: field.value ?? "",
								}}
								onChange={(v) =>
									setValue(optionsForm, "cornersDotOptions.type", (v?.value ?? "square") as CornerDotType)
								}
								label={c.app.formShare.link.qr.options.cornerDotShapeTitle()}
								parseResult={schema.shape.cornersDotOptions.shape.type.safeParse(field.value)}
								showErrors={!!field.error.length}
							/>
							<input {...props} hidden />
						</>
					)}
				</Field>
				<Field name="cornersDotOptions.color">
					{(_field, props) => (
						<>
							<input {...props} type="color" class="w-full rounded-xl border border-pv-blue-200" />
						</>
					)}
				</Field>
				<hr />
				<Field name="dotsOptions.type">
					{(field, props) => (
						<>
							<Combobox
								options={QRCODE_DOTS_TYPES.map<ComboboxItem>((s) => ({
									label: c.app.formShare.link.qr.options.dotsTypes[s](),
									value: s,
								}))}
								value={{
									label: c.app.formShare.link.qr.options.dotsTypes[field.value ?? "square"](),
									value: field.value ?? "",
								}}
								onChange={(v) => setValue(optionsForm, "dotsOptions.type", (v?.value ?? "square") as DotType)}
								label={c.app.formShare.link.qr.options.dotsTypesTitle()}
								parseResult={schema.shape.dotsOptions.shape.type.safeParse(field.value)}
								showErrors={!!field.error.length}
							/>
							<input {...props} hidden />
						</>
					)}
				</Field>
				<Field name="dotsOptions.color">
					{(_field, props) => (
						<>
							<input {...props} type="color" class="w-full rounded-xl border border-pv-blue-200" />
						</>
					)}
				</Field>
			</div>
			<div class="flex flex-col items-center justify-center gap-2">
				<div ref={setRoot} class="aspect-square w-full max-w-60 flex-shrink-0 [&>*]:w-full" />
				<Combobox
					options={QRCODE_EXTENSIONS.map<ComboboxItem<FileExtension>>((s) => ({
						label: s.toUpperCase(),
						value: s,
					}))}
					value={extension()}
					onChange={setExtension}
					label={c.app.formShare.link.qr.options.dotsTypesTitle()}
					class="max-w-60"
				/>
				<Button onclick={handleDownload} icon={<FaSolidDownload />} class="w-full max-w-60">
					{c.generic.actions.download()}
				</Button>
			</div>
		</Form>
	);
}