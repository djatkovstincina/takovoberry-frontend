"use client";

import React, { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n-config";
import { getContactFormTranslations } from "@/lib/translations/contact-form";

interface ContactFormProps {
    formId?: string; // Optional now, not used with Resend
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
    const params = useParams();
    const lang = (params?.lang as Locale) || "en";
    const t = getContactFormTranslations(lang);

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t.validation.nameRequired;
        }

        if (!formData.email.trim()) {
            newErrors.email = t.validation.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t.validation.emailInvalid;
        }

        if (!formData.message.trim()) {
            newErrors.message = t.validation.messageRequired;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitStatus("success");
                setStatusMessage(result.message || t.status.success);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
                onSuccess?.();
            } else {
                setSubmitStatus("error");
                setStatusMessage(result.message || t.status.error);
                onError?.(result.message);
            }
        } catch (error) {
            setSubmitStatus("error");
            setStatusMessage(t.status.networkError);
            onError?.(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
                <div className="contact-form__field">
                    <label htmlFor="name" className="contact-form__label">
                        {t.labels.name} <span className="contact-form__required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`contact-form__input ${errors.name ? "contact-form__input--error" : ""}`}
                        placeholder={t.placeholders.name}
                        disabled={isSubmitting}
                    />
                    {errors.name && (
                        <span className="contact-form__error">{errors.name}</span>
                    )}
                </div>

                <div className="contact-form__field">
                    <label htmlFor="email" className="contact-form__label">
                        {t.labels.email} <span className="contact-form__required">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`contact-form__input ${errors.email ? "contact-form__input--error" : ""}`}
                        placeholder={t.placeholders.email}
                        disabled={isSubmitting}
                    />
                    {errors.email && (
                        <span className="contact-form__error">{errors.email}</span>
                    )}
                </div>
            </div>

            <div className="contact-form__row">
                <div className="contact-form__field">
                    <label htmlFor="phone" className="contact-form__label">
                        {t.labels.phone}
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="contact-form__input"
                        placeholder={t.placeholders.phone}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="contact-form__field">
                    <label htmlFor="subject" className="contact-form__label">
                        {t.labels.subject}
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="contact-form__input"
                        placeholder={t.placeholders.subject}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <div className="contact-form__field">
                <label htmlFor="message" className="contact-form__label">
                    {t.labels.message} <span className="contact-form__required">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`contact-form__textarea ${errors.message ? "contact-form__textarea--error" : ""}`}
                    placeholder={t.placeholders.message}
                    rows={5}
                    disabled={isSubmitting}
                />
                {errors.message && (
                    <span className="contact-form__error">{errors.message}</span>
                )}
            </div>

            {submitStatus !== "idle" && (
                <div
                    className={`contact-form__status contact-form__status--${submitStatus}`}
                >
                    {statusMessage}
                </div>
            )}

            <button
                type="submit"
                className="contact-form__submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <span className="contact-form__spinner" />
                        {t.buttons.sending}
                    </>
                ) : (
                    t.buttons.submit
                )}
            </button>
        </form>
    );
};

export default ContactForm;