import type { Locale } from "@/i18n-config";

export const contactFormTranslations = {
    en: {
        labels: {
            name: "Name",
            email: "Email",
            phone: "Phone",
            subject: "Subject",
            message: "Message",
        },
        placeholders: {
            name: "Your name",
            email: "your@email.com",
            phone: "+381 XX XXX XXXX",
            subject: "What is this about?",
            message: "Your message...",
        },
        buttons: {
            submit: "Send Message",
            sending: "Sending...",
        },
        validation: {
            nameRequired: "Name is required",
            emailRequired: "Email is required",
            emailInvalid: "Please enter a valid email",
            messageRequired: "Message is required",
        },
        status: {
            success: "Thank you! Your message has been sent.",
            error: "Something went wrong. Please try again.",
            networkError: "Network error. Please check your connection and try again.",
        },
    },
    sr: {
        labels: {
            name: "Ime",
            email: "Email",
            phone: "Telefon",
            subject: "Predmet",
            message: "Poruka",
        },
        placeholders: {
            name: "Vaše ime",
            email: "vas@email.com",
            phone: "+381 XX XXX XXXX",
            subject: "O čemu se radi?",
            message: "Vaša poruka...",
        },
        buttons: {
            submit: "Pošalji poruku",
            sending: "Slanje...",
        },
        validation: {
            nameRequired: "Ime je obavezno",
            emailRequired: "Email je obavezan",
            emailInvalid: "Unesite ispravan email",
            messageRequired: "Poruka je obavezna",
        },
        status: {
            success: "Hvala! Vaša poruka je poslata.",
            error: "Došlo je do greške. Pokušajte ponovo.",
            networkError: "Greška u mreži. Proverite konekciju i pokušajte ponovo.",
        },
    },
};

export type ContactFormTranslations = typeof contactFormTranslations.en;

export function getContactFormTranslations(locale: Locale): ContactFormTranslations {
    return contactFormTranslations[locale] || contactFormTranslations.en;
}
