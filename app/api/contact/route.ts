import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Email where you want to receive contact form submissions
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@takovoberry.com";

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    lang?: string;
}

export async function POST(request: NextRequest) {
    try {
        // Initialize Resend inside the handler to ensure env vars are available
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error("RESEND_API_KEY is not configured");
            return NextResponse.json(
                { success: false, message: "Email service not configured" },
                { status: 500 }
            );
        }
        const resend = new Resend(apiKey);

        const body: ContactFormData = await request.json();

        const { name, email, phone, subject, message, lang } = body;
        const isEnglish = lang === "en";

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send email using Resend
        const { error } = await resend.emails.send({
            from: "Takovoberry Contact <noreply@takovoberry.com>",
            to: [CONTACT_EMAIL],
            replyTo: email,
            subject: subject || (isEnglish ? `New message from ${name}` : `Nova poruka od ${name}`),
            html: `
                <h2>${isEnglish ? "New message from contact form" : "Nova poruka sa kontakt forme"}</h2>
                <p><strong>${isEnglish ? "Name" : "Ime"}:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>${isEnglish ? "Phone" : "Telefon"}:</strong> ${phone}</p>` : ""}
                ${subject ? `<p><strong>${isEnglish ? "Subject" : "Tema"}:</strong> ${subject}</p>` : ""}
                <p><strong>${isEnglish ? "Message" : "Poruka"}:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { success: false, message: "Failed to send email" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: isEnglish ? "Message sent successfully!" : "Poruka je uspešno poslata!",
        });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Server error. Please try again later.",
            },
            { status: 500 }
        );
    }
}
