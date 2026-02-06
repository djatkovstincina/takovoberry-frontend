import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email where you want to receive contact form submissions
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "info@takovoberry.com";

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();

        const { name, email, phone, subject, message } = body;

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
            subject: subject || `Nova poruka od ${name}`,
            html: `
                <h2>Nova poruka sa kontakt forme</h2>
                <p><strong>Ime:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
                ${subject ? `<p><strong>Tema:</strong> ${subject}</p>` : ""}
                <p><strong>Poruka:</strong></p>
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
            message: "Poruka je uspešno poslata!",
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
