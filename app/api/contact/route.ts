import { NextRequest, NextResponse } from "next/server";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost:8888/takovoberry";

interface ContactFormData {
    formId: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();

        const { formId, name, email, phone, subject, message } = body;

        // Validate required fields
        if (!formId || !name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create FormData for CF7 REST API
        // CF7 expects form data, not JSON
        const formData = new FormData();
        formData.append("your-name", name);
        formData.append("your-email", email);
        formData.append("your-phone", phone || "");
        formData.append("your-subject", subject || "");
        formData.append("your-message", message);

        // Submit to Contact Form 7 REST API
        const cf7Response = await fetch(
            `${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
            {
                method: "POST",
                body: formData,
            }
        );

        const cf7Data = await cf7Response.json();

        // CF7 returns status: "mail_sent" on success
        if (cf7Data.status === "mail_sent") {
            return NextResponse.json({
                success: true,
                message: cf7Data.message || "Message sent successfully!",
            });
        } else if (cf7Data.status === "validation_failed") {
            // Extract validation errors from CF7 response
            const errorMessages = cf7Data.invalid_fields
                ?.map((field: { message: string }) => field.message)
                .join(", ");
            
            return NextResponse.json(
                {
                    success: false,
                    message: errorMessages || cf7Data.message || "Validation failed",
                },
                { status: 400 }
            );
        } else {
            // Other error states
            return NextResponse.json(
                {
                    success: false,
                    message: cf7Data.message || "Failed to send message",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Contact form submission error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Server error. Please try again later.",
            },
            { status: 500 }
        );
    }
}
