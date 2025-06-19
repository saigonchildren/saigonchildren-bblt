import { useState, useEffect, useMemo } from 'react';
import {
    Stepper,
    Button,
    Group,
    TextInput,
    PasswordInput,
    Select,
    Radio,
    Checkbox,
    Textarea,
    MultiSelect,
    Stack,
    Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { CreatableMultiselect } from './CreatableMultiselect';

export const MultiStepForm = ({ steps, onSubmit, initialValues = {}, isSubmitting = false }) => {
    const [active, setActive] = useState(0);

    // Create initial values from steps - memoized to prevent infinite re-renders
    const memoizedInitialValues = useMemo(() => {
        const values = { ...initialValues };
        steps.forEach(step => {
            step.fields.forEach(field => {
                if (!(field.name in values)) {
                    if (field.type === 'multiselect') {
                        values[field.name] = [];
                    } else {
                        values[field.name] = '';
                    }
                }
                // Add "other" field for select/radio options that include "Other" (not multiselect since it's now creatable)
                if (field.type !== 'multiselect' && field.options?.includes('Other') && !(`${field.name}_other` in values)) {
                    values[`${field.name}_other`] = '';
                }
            });
        });
        return values;
    }, [steps, initialValues]);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: memoizedInitialValues,
        validate: (values) => {
            const currentStep = steps[active];
            if (!currentStep) return {};

            const errors = {};
            currentStep.fields.forEach(field => {
                // Check if field should be shown based on conditional logic
                if (field.conditional) {
                    const conditionValue = values[field.conditional.field];
                    if (conditionValue !== field.conditional.value) {
                        return; // Skip validation if condition not met
                    }
                } if (field.required) {
                    const value = values[field.name];
                    if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
                        errors[field.name] = `${field.label} is required`;
                    }

                    // Check if "Other" is selected but no custom value is provided (only for select/radio, not multiselect)
                    if (field.type !== 'multiselect' && field.options?.includes('Other')) {
                        if ((field.type === 'select' || field.type === 'radio') && value === 'Other') {
                            const otherValue = values[`${field.name}_other`];
                            if (!otherValue || otherValue.trim() === '') {
                                errors[`${field.name}_other`] = `Please specify ${field.label.toLowerCase()}`;
                            }
                        }
                    }
                }

                // Additional validation rules
                if (field.type === 'email' && values[field.name]) {
                    if (!/^\S+@\S+\.\S+$/.test(values[field.name])) {
                        errors[field.name] = 'Invalid email format';
                    }
                }

                if (field.type === 'password' && values[field.name]) {
                    if (values[field.name].length < 6) {
                        errors[field.name] = 'Password must be at least 6 characters';
                    }
                }
            });

            return errors;
        },
    });

    const nextStep = () =>
        setActive((current) => {
            if (form.validate().hasErrors) {
                return current;
            }
            return current < steps.length ? current + 1 : current;
        });

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current)); const handleSubmit = () => {
        if (!form.validate().hasErrors) {
            const formData = form.getValues();
            const processedData = { ...formData };

            // Process "Other" values - merge them with the main field values (only for select/radio, not multiselect)
            steps.forEach(step => {
                step.fields.forEach(field => {
                    if (field.type !== 'multiselect' && field.options?.includes('Other')) {
                        const mainValue = processedData[field.name];
                        const otherValue = processedData[`${field.name}_other`];

                        if (otherValue && otherValue.trim()) {
                            if ((field.type === 'select' || field.type === 'radio') && mainValue === 'Other') {
                                // Replace "Other" with the custom value
                                processedData[field.name] = otherValue.trim();
                            }
                        }

                        // Remove the "_other" field from final data
                        delete processedData[`${field.name}_other`];
                    }
                });
            });

            onSubmit(processedData);
        }
    };

    const renderField = (field) => {
        const formValues = form.getValues();

        // Check conditional rendering
        if (field.conditional) {
            const conditionValue = formValues[field.conditional.field];
            if (conditionValue !== field.conditional.value) {
                return null;
            }
        } const commonProps = {
            label: field.label,
            placeholder: field.placeholder || field.label,
            ...form.getInputProps(field.name),
        };

        const fieldKey = form.key(field.name); switch (field.type) {
            case 'text':
            case 'tel':
                return <TextInput key={fieldKey} {...commonProps} />;            case 'text_with_button':
                return (
                    <div key={fieldKey}>
                        <Group align="end" gap="sm">
                            <TextInput
                                {...commonProps}
                                style={{ flex: 1 }}
                            />
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const currentValues = form.getValues();
                                    field.onButtonClick?.(currentValues[field.name]);
                                }}
                                disabled={!formValues[field.name] || formValues[field.name].trim() === '' || field.validationStatus === 'loading'}
                                loading={field.validationStatus === 'loading'}
                            >
                                {field.buttonText || 'Validate'}
                            </Button>
                        </Group>
                        {field.validationMessage && (
                            <Text
                                size="sm"
                                c={field.validationStatus === 'success' ? 'green' : field.validationStatus === 'error' ? 'red' : 'dimmed'}
                                mt="xs"
                            >
                                {field.validationMessage}
                            </Text>
                        )}
                    </div>
                );case 'email':
                return <TextInput key={fieldKey} {...commonProps} type="email" />; case 'password':
                return (
                    <div key={fieldKey}>
                        <PasswordInput {...commonProps} />
                        {field.description && (
                            <Text size="sm" c="dimmed" mt="xs">
                                {field.description}
                            </Text>
                        )}
                    </div>
                ); case 'select':
                const hasOther = field.options?.includes('Other');
                const selectValue = formValues[field.name];
                const showOtherInput = hasOther && selectValue === 'Other'; return (
                    <div key={fieldKey}>
                        <Select
                            {...commonProps}
                            data={field.options || []}
                            allowDeselect={false}
                            onChange={(value) => {
                                // Handle the select change
                                form.setFieldValue(field.name, value);

                                // If "Other" is not selected, clear the other input field
                                if (hasOther && value !== 'Other') {
                                    form.setFieldValue(`${field.name}_other`, '');
                                }
                            }}
                        />
                        {showOtherInput && (
                            <TextInput
                                key={`${field.name}_other`}
                                label={`Please specify ${field.label}`}
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                mt="sm"
                                {...form.getInputProps(`${field.name}_other`)}
                            />
                        )}
                    </div>
                ); case 'multiselect':
                // Remove "Other" from options since CreatableMultiselect allows custom values
                const multiselectOptions = field.options ? field.options.filter(option => option !== 'Other') : []; return (
                    <CreatableMultiselect
                        key={fieldKey}
                        label={field.label}
                        placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
                        data={multiselectOptions}
                        value={formValues[field.name] || []}
                        onChange={(value) => form.setFieldValue(field.name, value)}
                    />
                ); case 'radio':
                const hasRadioOther = field.options?.includes('Other');
                const radioValue = formValues[field.name];
                const showRadioOtherInput = hasRadioOther && radioValue === 'Other'; return (
                    <div key={fieldKey}>
                        <Radio.Group
                            {...commonProps}
                            onChange={(value) => {
                                // Handle the radio change
                                form.setFieldValue(field.name, value);

                                // If "Other" is not selected, clear the other input field
                                if (hasRadioOther && value !== 'Other') {
                                    form.setFieldValue(`${field.name}_other`, '');
                                }
                            }}
                        >
                            <Stack gap="xs">
                                {(field.options || []).map((option) => (
                                    <Radio key={option} value={option} label={option} />
                                ))}
                            </Stack>
                        </Radio.Group>
                        {showRadioOtherInput && (
                            <TextInput
                                key={`${field.name}_other`}
                                label={`Please specify ${field.label}`}
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                mt="sm"
                                {...form.getInputProps(`${field.name}_other`)}
                            />
                        )}
                    </div>
                ); case 'textarea':
                return (
                    <Textarea
                        key={fieldKey}
                        {...commonProps}
                        minRows={3}
                        autosize
                    />
                );

            default:
                return <TextInput key={fieldKey} {...commonProps} />;
        }
    };

    const isLastStep = active === steps.length;

    return (
        <>
            <Stepper active={active}>
                {steps.map((step, index) => (
                    <Stepper.Step key={index} label={step.title} description={step.description}>                        <Stack gap="md" mt="md">
                        {step.fields.map((field, fieldIndex) => (
                            <div key={`${field.name}-${fieldIndex}`}>
                                {renderField(field)}
                            </div>
                        ))}
                    </Stack>
                    </Stepper.Step>
                ))}

                <Stepper.Completed>
                    <Stack gap="md" align="center">
                        <Text size="lg" fw={500}>Registration Complete!</Text>
                        <Text c="dimmed">Thank you for joining the Saigonchildren Mentoring Program.</Text>
                        <Text c="dimmed">Your application has been submitted successfully.</Text>
                    </Stack>
                </Stepper.Completed>
            </Stepper>

            <Group justify="flex-end" mt="xl">
                {active !== 0 && active < steps.length && (
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                )}
                {active < steps.length - 1 && (
                    <Button onClick={nextStep}>Next step</Button>
                )}                {active === steps.length - 1 && (
                    <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                        Submit
                    </Button>
                )}
            </Group>
        </>
    );
};