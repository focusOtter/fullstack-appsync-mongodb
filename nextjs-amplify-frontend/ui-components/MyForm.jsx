/* eslint-disable */
import * as React from 'react'
import { fetchByPath, validateField } from './utils'
import { getOverrideProps } from '@aws-amplify/ui-react/internal'
import {
	Button,
	Flex,
	Grid,
	Heading,
	Radio,
	RadioGroupField,
	SelectField,
	TextField,
} from '@aws-amplify/ui-react'
export default function MyForm(props) {
	const { onSubmit, onCancel, onValidate, onChange, overrides, ...rest } = props
	const initialValues = {
		name: undefined,
		email: undefined,
		phoneNumber: undefined,
		employmentStatus: undefined,
		startDate: undefined,
		focusArea: undefined,
	}
	const [name, setName] = React.useState(initialValues.name)
	const [email, setEmail] = React.useState(initialValues.email)
	const [phoneNumber, setPhoneNumber] = React.useState(
		initialValues.phoneNumber
	)
	const [employmentStatus, setEmploymentStatus] = React.useState(
		initialValues.employmentStatus
	)
	const [startDate, setStartDate] = React.useState(initialValues.startDate)
	const [focusArea, setFocusArea] = React.useState(initialValues.focusArea)
	const [errors, setErrors] = React.useState({})
	const resetStateValues = () => {
		setName(initialValues.name)
		setEmail(initialValues.email)
		setPhoneNumber(initialValues.phoneNumber)
		setEmploymentStatus(initialValues.employmentStatus)
		setStartDate(initialValues.startDate)
		setFocusArea(initialValues.focusArea)
		setErrors({})
	}
	const validations = {
		name: [{ type: 'Required' }],
		email: [{ type: 'Required' }, { type: 'Email' }],
		phoneNumber: [{ type: 'Phone' }],
		employmentStatus: [],
		startDate: [{ type: 'Required' }],
		focusArea: [],
	}
	const runValidationTasks = async (fieldName, value) => {
		let validationResponse = validateField(value, validations[fieldName])
		const customValidator = fetchByPath(onValidate, fieldName)
		if (customValidator) {
			validationResponse = await customValidator(value, validationResponse)
		}
		setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }))
		return validationResponse
	}
	return (
		<Grid
			as="form"
			rowGap="15px"
			columnGap="15px"
			padding="20px"
			onSubmit={async (event) => {
				event.preventDefault()
				const modelFields = {
					name,
					email,
					phoneNumber,
					employmentStatus,
					startDate,
					focusArea,
				}
				const validationResponses = await Promise.all(
					Object.keys(validations).reduce((promises, fieldName) => {
						if (Array.isArray(modelFields[fieldName])) {
							promises.push(
								...modelFields[fieldName].map((item) =>
									runValidationTasks(fieldName, item)
								)
							)
							return promises
						}
						promises.push(runValidationTasks(fieldName, modelFields[fieldName]))
						return promises
					}, [])
				)
				if (validationResponses.some((r) => r.hasError)) {
					return
				}
				await onSubmit(modelFields)
			}}
			{...rest}
			{...getOverrideProps(overrides, 'MyForm')}
		>
			<Heading
				level={3}
				children="Application Submission Form"
				{...getOverrideProps(overrides, 'SectionalElement0')}
			></Heading>
			<TextField
				label="Name"
				isRequired={true}
				placeholder="Focus Otter"
				onChange={(e) => {
					let { value } = e.target
					if (onChange) {
						const modelFields = {
							name: value,
							email,
							phoneNumber,
							employmentStatus,
							startDate,
							focusArea,
						}
						const result = onChange(modelFields)
						value = result?.name ?? value
					}
					if (errors.name?.hasError) {
						runValidationTasks('name', value)
					}
					setName(value)
				}}
				onBlur={() => runValidationTasks('name', name)}
				errorMessage={errors.name?.errorMessage}
				hasError={errors.name?.hasError}
				{...getOverrideProps(overrides, 'name')}
			></TextField>
			<TextField
				label="Email"
				isRequired={true}
				placeholder="me@sample.com"
				onChange={(e) => {
					let { value } = e.target
					if (onChange) {
						const modelFields = {
							name,
							email: value,
							phoneNumber,
							employmentStatus,
							startDate,
							focusArea,
						}
						const result = onChange(modelFields)
						value = result?.email ?? value
					}
					if (errors.email?.hasError) {
						runValidationTasks('email', value)
					}
					setEmail(value)
				}}
				onBlur={() => runValidationTasks('email', email)}
				errorMessage={errors.email?.errorMessage}
				hasError={errors.email?.hasError}
				{...getOverrideProps(overrides, 'email')}
			></TextField>
			<TextField
				label="Phone Number"
				placeholder="555-555-5555"
				type="tel"
				onChange={(e) => {
					let { value } = e.target
					if (onChange) {
						const modelFields = {
							name,
							email,
							phoneNumber: value,
							employmentStatus,
							startDate,
							focusArea,
						}
						const result = onChange(modelFields)
						value = result?.phoneNumber ?? value
					}
					if (errors.phoneNumber?.hasError) {
						runValidationTasks('phoneNumber', value)
					}
					setPhoneNumber(value)
				}}
				onBlur={() => runValidationTasks('phoneNumber', phoneNumber)}
				errorMessage={errors.phoneNumber?.errorMessage}
				hasError={errors.phoneNumber?.hasError}
				{...getOverrideProps(overrides, 'phoneNumber')}
			></TextField>
			<Grid
				columnGap="inherit"
				rowGap="inherit"
				templateColumns="repeat(2, auto)"
				{...getOverrideProps(overrides, 'RowGrid4')}
			>
				<RadioGroupField
					label="Employment Status"
					name="fieldName"
					isRequired={false}
					onChange={(e) => {
						let { value } = e.target
						if (onChange) {
							const modelFields = {
								name,
								email,
								phoneNumber,
								employmentStatus: value,
								startDate,
								focusArea,
							}
							const result = onChange(modelFields)
							value = result?.employmentStatus ?? value
						}
						if (errors.employmentStatus?.hasError) {
							runValidationTasks('employmentStatus', value)
						}
						setEmploymentStatus(value)
					}}
					onBlur={() =>
						runValidationTasks('employmentStatus', employmentStatus)
					}
					errorMessage={errors.employmentStatus?.errorMessage}
					hasError={errors.employmentStatus?.hasError}
					{...getOverrideProps(overrides, 'employmentStatus')}
				>
					<Radio
						children="employed"
						value="employed"
						{...getOverrideProps(overrides, 'employmentStatusRadio0')}
					></Radio>
					<Radio
						children="unemployed"
						value="unemployed"
						{...getOverrideProps(overrides, 'employmentStatusRadio1')}
					></Radio>
				</RadioGroupField>
				<TextField
					label="Start Date"
					isRequired={true}
					type="date"
					onChange={(e) => {
						let { value } = e.target
						if (onChange) {
							const modelFields = {
								name,
								email,
								phoneNumber,
								employmentStatus,
								startDate: value,
								focusArea,
							}
							const result = onChange(modelFields)
							value = result?.startDate ?? value
						}
						if (errors.startDate?.hasError) {
							runValidationTasks('startDate', value)
						}
						setStartDate(value)
					}}
					onBlur={() => runValidationTasks('startDate', startDate)}
					errorMessage={errors.startDate?.errorMessage}
					hasError={errors.startDate?.hasError}
					{...getOverrideProps(overrides, 'startDate')}
				></TextField>
			</Grid>
			<SelectField
				label="Area of Focus"
				placeholder="Please select an option"
				value={focusArea}
				onChange={(e) => {
					let { value } = e.target
					if (onChange) {
						const modelFields = {
							name,
							email,
							phoneNumber,
							employmentStatus,
							startDate,
							focusArea: value,
						}
						const result = onChange(modelFields)
						value = result?.focusArea ?? value
					}
					if (errors.focusArea?.hasError) {
						runValidationTasks('focusArea', value)
					}
					setFocusArea(value)
				}}
				onBlur={() => runValidationTasks('focusArea', focusArea)}
				errorMessage={errors.focusArea?.errorMessage}
				hasError={errors.focusArea?.hasError}
				{...getOverrideProps(overrides, 'focusArea')}
			>
				<option
					children="FRONTEND"
					value="FRONTEND"
					{...getOverrideProps(overrides, 'focusAreaoption0')}
				></option>
				<option
					children="BACKEND"
					value="BACKEND"
					{...getOverrideProps(overrides, 'focusAreaoption1')}
				></option>
			</SelectField>
			<Flex
				justifyContent="space-between"
				{...getOverrideProps(overrides, 'CTAFlex')}
			>
				<Button
					children="Clear"
					type="reset"
					onClick={resetStateValues}
					{...getOverrideProps(overrides, 'ClearButton')}
				></Button>
				<Flex
					gap="15px"
					{...getOverrideProps(overrides, 'RightAlignCTASubFlex')}
				>
					<Button
						children="Cancel"
						type="button"
						onClick={() => {
							onCancel && onCancel()
						}}
						{...getOverrideProps(overrides, 'CancelButton')}
					></Button>
					<Button
						children="Submit"
						type="submit"
						variation="primary"
						isDisabled={Object.values(errors).some((e) => e?.hasError)}
						{...getOverrideProps(overrides, 'SubmitButton')}
					></Button>
				</Flex>
			</Flex>
		</Grid>
	)
}
